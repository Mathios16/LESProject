package br.com.fatecmogidascruzes.ecommercelivroback.infra.DTO;

import java.util.List;

import br.com.fatecmogidascruzes.ecommercelivroback.business.order.cupom.Cupom;
import br.com.fatecmogidascruzes.ecommercelivroback.business.order.orderReturn.OrderReturn;
import br.com.fatecmogidascruzes.ecommercelivroback.business.order.orderReturn.OrderReturnItem;

public record dataOrderReturn(Long id, Long orderId, List<OrderReturnItem> orderReturnItems, Double value,
    Cupom cupom) {
  public static dataOrderReturn fromReturn(OrderReturn orderReturn) {
    return new dataOrderReturn(
        orderReturn.getId(),
        orderReturn.getOrderId(),
        orderReturn.getOrderReturnItems(),
        orderReturn.getValue(),
        orderReturn.getCupom());
  }
}
