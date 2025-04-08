package br.com.fatecmogidascruzes.ecommercelivroback.infra.DTO;

import java.util.List;
import java.util.stream.Collectors;

import br.com.fatecmogidascruzes.ecommercelivroback.business.order.Order;
import br.com.fatecmogidascruzes.ecommercelivroback.business.order.cupom.Cupom;
import br.com.fatecmogidascruzes.ecommercelivroback.business.order.orderPayment.OrderPayment;

public record dataOrder(Long id, Long customerId, Long addressId, List<OrderPayment> orderPayments, List<Cupom> cupoms,
                Double freight, Double discount, Double subTotal, Double total, String status,
                List<dataOrderItem> items) {
        public static dataOrder fromOrder(Order order) {
                return new dataOrder(
                                order.getId(),
                                order.getCustomerId(),
                                order.getAddressId(),
                                order.getPayments(),
                                order.getCupoms(),
                                order.getFreight(),
                                order.getDiscount(),
                                order.getSubTotal(),
                                order.getTotal(),
                                order.getStatus(),
                                order.getItems().stream()
                                                .map(dataOrderItem::fromOrderItem)
                                                .collect(Collectors.toList()));
        }
}