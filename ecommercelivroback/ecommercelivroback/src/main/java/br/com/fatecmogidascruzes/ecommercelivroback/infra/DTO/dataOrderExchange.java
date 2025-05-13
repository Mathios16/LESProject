package br.com.fatecmogidascruzes.ecommercelivroback.infra.DTO;

import java.util.List;
import java.util.stream.Collectors;

import br.com.fatecmogidascruzes.ecommercelivroback.business.order.orderExchange.OrderExchange;
import br.com.fatecmogidascruzes.ecommercelivroback.business.order.orderExchange.OrderExchangedItem;
import br.com.fatecmogidascruzes.ecommercelivroback.business.order.orderPayment.OrderPayment;

public record dataOrderExchange(Long id, Long orderId, List<OrderExchangedItem> orderItems, Long addressId,
    List<dataOrderExchangeItem> items, List<OrderPayment> orderPayments) {
  public static dataOrderExchange fromExchange(OrderExchange orderExchange) {
    return new dataOrderExchange(
        orderExchange.getId(),
        orderExchange.getOrderId(),
        orderExchange.getOrderItems(),
        orderExchange.getAddressId(),
        orderExchange.getItems().stream()
            .map(dataOrderExchangeItem::fromExchangeItem)
            .collect(Collectors.toList()),
        orderExchange.getPayments());
  }
}
