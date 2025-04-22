package br.com.fatecmogidascruzes.ecommercelivroback.business.order;

import java.util.List;
import java.util.Optional;

import br.com.fatecmogidascruzes.ecommercelivroback.business.address.Address;
import br.com.fatecmogidascruzes.ecommercelivroback.business.customer.Customer;
import br.com.fatecmogidascruzes.ecommercelivroback.business.order.cupom.Cupom;
import br.com.fatecmogidascruzes.ecommercelivroback.business.order.orderPayment.OrderPayment;
import br.com.fatecmogidascruzes.ecommercelivroback.business.order.orderStatus.OrderStatus;
import br.com.fatecmogidascruzes.ecommercelivroback.business.order.orderStatus.OrderStatusConverter;
import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ord_id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "ord_customer_id", insertable = false, updatable = false)
    private Customer customer;

    @Column(name = "ord_customer_id", nullable = false)
    private Long customerId;

    @ManyToOne
    @JoinColumn(name = "ord_address_id", insertable = false, updatable = false)
    private Address address;

    @Column(name = "ord_address_id")
    private Long addressId;

    @OneToMany(mappedBy = "orderId")
    private List<OrderPayment> payments;

    @OneToMany(mappedBy = "orderId")
    private List<Cupom> cupoms;

    @OneToMany(mappedBy = "orderId")
    private List<OrderItem> items;

    @Column(name = "ord_status")
    @Convert(converter = OrderStatusConverter.class)
    private String status;

    public Double getFreight() {
        Double freight = 0.0;
        if (items.size() >= 3) {
            freight += items.stream().mapToDouble(OrderItem::getPrice).sum() * 0.1;
        }
        if (address != null && !address.getState().contains("SP")) {
            freight += 10.0;
        }
        return Math.round(freight * 100.0) / 100.0;
    }

    public Double getDiscount() {
        return Math.round(cupoms.stream()
                .mapToDouble(Cupom::getValue)
                .sum() * 100.0) / 100.0;
    }

    public Double getSubTotal() {
        return Math.round(items.stream()
                .mapToDouble(OrderItem::getPrice)
                .sum() * 100.0) / 100.0;
    }

    public Double getTotal() {
        return Math.round((getSubTotal() - getDiscount() + getFreight()) * 100.0) / 100.0;
    }

    public Optional<Cupom> verifyPayment() {

        double totalOrderValue = getSubTotal();
        double totalCouponValue = getDiscount();

        double carry = 0.0;

        for (Cupom cupom : cupoms) {
            if (carry > totalOrderValue && cupoms.indexOf(cupom) < cupoms.size() - 1) {
                this.status = OrderStatus.REPROVED.name();
                throw new IllegalArgumentException("Cupons excedem desnecessáriamente o valor da compra");
            }
            carry += cupom.getValue();
        }

        if (totalCouponValue > totalOrderValue) {
            double remainingCouponValue = totalCouponValue - totalOrderValue;
            Cupom exchangeCoupon = new Cupom();
            exchangeCoupon.setValue(remainingCouponValue);
            exchangeCoupon.setCode("teste");
            totalCouponValue = totalOrderValue;
            return Optional.of(exchangeCoupon);
        }

        double totalCreditCardPayment = 0.0;
        for (OrderPayment payment : payments) {
            if (totalCouponValue != 0 && payment.getAmount() < 10.0 && totalOrderValue >= 10) {
                this.status = OrderStatus.REPROVED.name();
                throw new IllegalArgumentException("Valor mínimo de pagamento é R$10,00 ");
            }
            totalCreditCardPayment += payment.getAmount();
        }

        if (Math.round(totalCreditCardPayment * 100.0) / 100.0 < this.getTotal()) {
            this.status = OrderStatus.REPROVED.name();
            throw new IllegalArgumentException("Valor de pagamento insuficiente");
        }

        this.status = OrderStatus.PROCESSING.name();
        return Optional.empty();
    }
}
