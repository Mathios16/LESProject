package br.com.fatecmogidascruzes.ecommercelivroback.infra.DTO;

import java.util.List;
import java.util.stream.Collectors;

import br.com.fatecmogidascruzes.ecommercelivroback.business.order.Order;
import br.com.fatecmogidascruzes.ecommercelivroback.business.order.cupom.Cupom;
import br.com.fatecmogidascruzes.ecommercelivroback.business.order.orderPayment.OrderPayment;

public record dataOrder(Long id, Long customerId, String customerName, Long addressId, String addressStreet,
                List<OrderPayment> orderPayments,
                List<Cupom> cupoms, Double freight, Double discount, Double subTotal, Double total, String status,
                List<dataOrderItem> items, Long cupomId) {
        public static dataOrder fromOrder(Order order) {
                return new dataOrder(
                                order.getId(),
                                order.getCustomerId(),
                                order.getCustomer().getFullName(),
                                order.getAddressId(),
                                order.getAddress().getStreet(),
                                order.getPayments(),
                                order.getCupoms(),
                                order.getFreight(),
                                order.getDiscount(),
                                order.getSubTotal(),
                                order.getTotal(),
                                order.getStatus(),
                                order.getItems().stream()
                                                .map(dataOrderItem::fromOrderItem)
                                                .collect(Collectors.toList()),
                                order.getCupomId());
        }
}