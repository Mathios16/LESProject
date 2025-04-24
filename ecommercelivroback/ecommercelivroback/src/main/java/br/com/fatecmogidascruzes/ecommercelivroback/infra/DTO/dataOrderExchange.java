package br.com.fatecmogidascruzes.ecommercelivroback.infra.DTO;

import java.util.List;
import java.util.stream.Collectors;

import br.com.fatecmogidascruzes.ecommercelivroback.business.order.orderExchange.OrderExchange;

public record dataOrderExchange(Long id, Long orderId, List<Long> orderItemsId, List<dataOrderExchangeItem> items) {
  public static dataOrderExchange fromExchange(OrderExchange orderExchange) {
    return new dataOrderExchange(
        orderExchange.getId(),
        orderExchange.getOrderId(),
        orderExchange.getOrderItemsId(),
        orderExchange.getItems().stream()
            .map(dataOrderExchangeItem::fromExchangeItem)
            .collect(Collectors.toList()));
  }
}
