package br.com.fatecmogidascruzes.ecommercelivroback.infra.DTO;

import br.com.fatecmogidascruzes.ecommercelivroback.business.order.OrderItem;

public record dataOrderItem(Long id, Long orderId, Long itemId, Integer quantity) {
    public static dataOrderItem fromOrderItem(OrderItem orderItem) {
        return new dataOrderItem(
                orderItem.getId(),
                orderItem.getOrderId(),
                orderItem.getItemId(),
                orderItem.getQuantity());
    }
}
