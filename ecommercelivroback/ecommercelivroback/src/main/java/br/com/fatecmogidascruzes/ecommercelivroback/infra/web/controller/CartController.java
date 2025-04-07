package br.com.fatecmogidascruzes.ecommercelivroback.infra.web.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import br.com.fatecmogidascruzes.ecommercelivroback.business.address.Address;
import br.com.fatecmogidascruzes.ecommercelivroback.business.customer.Customer;
import br.com.fatecmogidascruzes.ecommercelivroback.business.item.Item;
import br.com.fatecmogidascruzes.ecommercelivroback.business.order.cart.Cart;
import br.com.fatecmogidascruzes.ecommercelivroback.business.order.cart.CartItem;
import br.com.fatecmogidascruzes.ecommercelivroback.infra.DTO.dataCart;
import br.com.fatecmogidascruzes.ecommercelivroback.infra.DTO.dataCartItem;
import br.com.fatecmogidascruzes.ecommercelivroback.infra.persistence.AddressRepository;
import br.com.fatecmogidascruzes.ecommercelivroback.infra.persistence.CartItemRepository;
import br.com.fatecmogidascruzes.ecommercelivroback.infra.persistence.CartRepository;
import br.com.fatecmogidascruzes.ecommercelivroback.infra.persistence.CustomerRepository;
import br.com.fatecmogidascruzes.ecommercelivroback.infra.persistence.ItemRepository;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/cart")
public class CartController {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private ItemRepository itemRepository;

    @PutMapping("/{customerId}")
    public ResponseEntity<?> createCart(@PathVariable Long customerId, @RequestBody(required = false) dataCart data)
            throws Exception {
        Optional<Cart> existentCart = cartRepository.findByCustomerId(customerId);

        Cart cart;

        if (existentCart.isEmpty()) {
            cart = new Cart();

            Optional<Customer> customer = customerRepository.findById(customerId);

            if (customer.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            List<Address> address = addressRepository.findByCustomer(customerId);

            Optional<Address> shippingaddress = address.stream()
                    .reduce((carry, add) -> {
                        if (add.getAddressType().contains("ENTREGA")) {
                            carry = add;
                        }
                        return carry;
                    });

            cart.setCustomerId(customerId);

            if (shippingaddress.isPresent()) {
                cart.setAddressId(shippingaddress.get().getId());
                cart.setAddress(shippingaddress.get());
            }
        } else {
            cart = existentCart.get();
            if (data != null && data.addressId() != null) {
                Optional<Address> address = addressRepository.findById(data.addressId());
                if (address.isPresent()) {
                    cart.setAddress(address.get());
                    cart.setAddressId(data.addressId());
                }
            } else {
                Optional<Address> address = addressRepository.findById(cart.getAddressId());
                if (address.isPresent()) {
                    cart.setAddress(address.get());
                    cart.setAddressId(cart.getAddressId());
                }
            }
        }

        List<dataCartItem> items = new ArrayList<>();

        List<CartItem> cartItems = new ArrayList<>();

        if (data != null && data.items() != null) {
            items = data.items();

            List<CartItem> existingCartItems = cartItemRepository.findByCartId(cart.getId());

            items.forEach(newCartItem -> {
                cartItems.addAll(existingCartItems.stream()
                        .map(c -> {
                            if (newCartItem.id() != null && c.getId() != null && c.getId().equals(newCartItem.id())) {
                                c.setQuantity(newCartItem.quantity());
                                return c;
                            }
                            return c;
                        })
                        .collect(Collectors.toList()));

                if (newCartItem.id() == null) {
                    Optional<Item> itemOptional = itemRepository.findById(newCartItem.itemId());
                    if (itemOptional.isEmpty()) {
                        throw new IllegalArgumentException("Item " + newCartItem.itemId() + " não encontrado.");
                    }

                    Item item = itemOptional.get();
                    CartItem cartItem = new CartItem();
                    cartItem.setItem(item);
                    cartItem.setItemId(item.getId());
                    cartItem.setQuantity(newCartItem.quantity());
                    cartItem.setPrice(item.getPrice());
                    cartItems.add(cartItem);
                }
            });
        }

        Cart savedCart = cartRepository.save(cart);

        if (cartItems.size() > 0) {
            List<CartItem> updatedCartItems = cartItems.stream()
                    .map(cartItem -> {
                        cartItem.setCartId(savedCart.getId());
                        return cartItem;
                    })
                    .collect(Collectors.toList());

            List<CartItem> savedCartItems = cartItemRepository.saveAll(updatedCartItems);

            savedCart.setItems(savedCartItems);

            savedCart.verifyItems();
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(dataCart.fromCart(savedCart));
    }

    @GetMapping("/{customerId}")
    public ResponseEntity<?> getCustomerCart(@PathVariable Long customerId) {
        Optional<Cart> cart = cartRepository.findByCustomerId(customerId);
        if (cart.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        List<CartItem> items = cartItemRepository.findByCartId(cart.get().getId());

        cart.get().setItems(items);

        cart.get().verifyItems();

        return ResponseEntity.ok(dataCart.fromCart(cart.get()));
    }

    @DeleteMapping("/{customerId}")
    public ResponseEntity<?> deleteCartItem(@PathVariable Long customerId, @RequestBody dataCart data) {

        List<dataCartItem> cartItems = data.items();

        cartItems.forEach((item) -> {
            Optional<CartItem> cartItem = cartItemRepository.findById(item.id());
            if (cartItem.isPresent()) {
                cartItemRepository.delete(cartItem.get());
            }
        });

        return ResponseEntity.ok().build();
    }
}
