package br.com.fatecmogidascruzes.ecommercelivroback.infra.DTO;

import java.util.List;
import java.util.stream.Collectors;

import br.com.fatecmogidascruzes.ecommercelivroback.business.order.cart.Cart;

public record dataCart(Long id, Long customerId, Long addressId, Double freight, Double subTotal, Double total,
        List<dataCartItem> items) {
    public static dataCart fromCart(Cart cart) {
        return new dataCart(
                cart.getId(),
                cart.getCustomerId(),
                cart.getAddressId(),
                cart.getFreight(),
                cart.getSubTotal(),
                cart.getTotal(),
                cart.getItems().stream()
                        .map(dataCartItem::fromCartItem)
                        .collect(Collectors.toList()));
    }
}
