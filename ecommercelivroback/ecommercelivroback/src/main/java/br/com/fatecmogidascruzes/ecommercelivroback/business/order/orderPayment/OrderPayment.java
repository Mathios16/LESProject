package br.com.fatecmogidascruzes.ecommercelivroback.business.order.orderPayment;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity(name = "orderpayments")
public class OrderPayment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "orp_id")
    private Long id;

    @Column(name = "orp_amount", nullable = false)
    private Double amount;

    @Column(name = "orp_payment_method_id", nullable = false)
    private Long paymentMethodId;

    @Column(name = "orp_order_id", nullable = false)
    private Long orderId;
}
