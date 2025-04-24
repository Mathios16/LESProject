package br.com.fatecmogidascruzes.ecommercelivroback.infra.DTO;

import br.com.fatecmogidascruzes.ecommercelivroback.business.order.orderExchange.OrderExchangeItem;

public record dataOrderExchangeItem(Long id, Long exchangeId, Long itemId, String name, String image, Double price,
    Integer quantity) {
  public static dataOrderExchangeItem fromExchangeItem(OrderExchangeItem exchangeItem) {
    return new dataOrderExchangeItem(
        exchangeItem.getId(),
        exchangeItem.getExchangeId(),
        exchangeItem.getItemId(),
        exchangeItem.getItem().getTitle(),
        exchangeItem.getItem().getImage(),
        exchangeItem.getPrice(),
        exchangeItem.getQuantity());
  }
}
