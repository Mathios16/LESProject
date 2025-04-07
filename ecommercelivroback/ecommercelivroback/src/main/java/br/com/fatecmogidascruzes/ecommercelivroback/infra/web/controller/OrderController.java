package br.com.fatecmogidascruzes.ecommercelivroback.infra.web.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.fatecmogidascruzes.ecommercelivroback.business.order.Order;
import br.com.fatecmogidascruzes.ecommercelivroback.business.order.cart.Cart;
import br.com.fatecmogidascruzes.ecommercelivroback.business.order.cart.CartItem;
import br.com.fatecmogidascruzes.ecommercelivroback.infra.DTO.dataCartItem;
import br.com.fatecmogidascruzes.ecommercelivroback.infra.DTO.dataOrder;
import br.com.fatecmogidascruzes.ecommercelivroback.infra.DTO.dataOrderItem;
import br.com.fatecmogidascruzes.ecommercelivroback.infra.persistence.CartItemRepository;
import br.com.fatecmogidascruzes.ecommercelivroback.infra.persistence.CartRepository;
import br.com.fatecmogidascruzes.ecommercelivroback.infra.persistence.OrderItemRepository;
import br.com.fatecmogidascruzes.ecommercelivroback.infra.persistence.OrderRepository;

@RestController
@RequestMapping("/order")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @PostMapping("/{customerId}")
    public ResponseEntity<?> createOrder(@PathVariable Long customerId, dataOrder data) {
        Optional<Cart> cart = cartRepository.findByCustomerId(customerId);
        if (cart.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        List<CartItem> items = cartItemRepository.findByCartId(cart.get().getId());

        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<List<?>> getOrders() {
        return ResponseEntity.ok(orderRepository.findAll());
    }
}
