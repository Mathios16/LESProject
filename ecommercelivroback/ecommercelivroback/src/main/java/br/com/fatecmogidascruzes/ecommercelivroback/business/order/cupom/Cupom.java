package br.com.fatecmogidascruzes.ecommercelivroback.business.order.cupom;

import java.sql.Timestamp;

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
@Entity(name = "cupoms")
public class Cupom {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cup_id")
    private Long id;

    @Column(name = "cup_code", nullable = false)
    private String code;

    @Column(name = "cup_value", nullable = false)
    private Double value;

    @Column(name = "cup_expiration_date", nullable = false)
    private Timestamp expirationDate;

    @Column(name = "cup_order_id")
    private Long orderId;
}
