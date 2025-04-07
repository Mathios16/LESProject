package br.com.fatecmogidascruzes.ecommercelivroback.infra.DTO;

import java.util.List;
import java.util.stream.Collectors;

import br.com.fatecmogidascruzes.ecommercelivroback.business.order.Order;

public record dataOrder(Long id, Long customerId, Long addressId, Double freight, Double subTotal, Double total,
        List<dataOrderItem> items) {
    public static dataOrder fromOrder(Order order) {
        return new dataOrder(
                order.getId(),
                order.getCustomerId(),
                order.getAddressId(),
                order.getFreight(),
                order.getSubTotal(),
                order.getTotal(),
                order.getItems().stream()
                        .map(dataOrderItem::fromOrderItem)
                        .collect(Collectors.toList()));
    }
}
