package br.com.fatecmogidascruzes.ecommercelivroback.infra.DTO;

import java.util.List;

import br.com.fatecmogidascruzes.ecommercelivroback.business.order.orderReturn.OrderReturn;

public record dataOrderReturn(Long id, Long orderId, List<Long> orderItemsId) {
  public static dataOrderReturn fromReturn(OrderReturn orderReturn) {
    return new dataOrderReturn(
        orderReturn.getId(),
        orderReturn.getOrderId(),
        orderReturn.getOrderItemsId());
  }
}
