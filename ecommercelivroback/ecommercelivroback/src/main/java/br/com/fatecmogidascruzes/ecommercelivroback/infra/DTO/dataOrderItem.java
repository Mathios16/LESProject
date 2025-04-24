package br.com.fatecmogidascruzes.ecommercelivroback.infra.DTO;

import br.com.fatecmogidascruzes.ecommercelivroback.business.order.OrderItem;

public record dataOrderItem(Long id, Long orderId, Long itemId, String name, String image, Double price,
        Integer quantity) {
    public static dataOrderItem fromOrderItem(OrderItem orderItem) {
        return new dataOrderItem(
                orderItem.getId(),
                orderItem.getOrderId(),
                orderItem.getItemId(),
                orderItem.getItem().getTitle(),
                orderItem.getItem().getImage(),
                orderItem.getPrice(),
                orderItem.getQuantity());
    }
}
