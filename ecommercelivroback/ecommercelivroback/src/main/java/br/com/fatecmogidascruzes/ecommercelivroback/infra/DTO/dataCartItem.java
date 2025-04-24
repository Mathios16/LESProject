package br.com.fatecmogidascruzes.ecommercelivroback.infra.DTO;

import br.com.fatecmogidascruzes.ecommercelivroback.business.order.cart.CartItem;

public record dataCartItem(Long id, Long itemId, int quantity, String title, String image, double price, Long cartId) {

    public static dataCartItem fromCartItem(CartItem cartItem) {
        return new dataCartItem(
                cartItem.getId(),
                cartItem.getItemId(),
                cartItem.getQuantity(),
                cartItem.getItem().getTitle(),
                cartItem.getItem().getImage(),
                cartItem.getPrice(),
                cartItem.getCartId());
    }
}