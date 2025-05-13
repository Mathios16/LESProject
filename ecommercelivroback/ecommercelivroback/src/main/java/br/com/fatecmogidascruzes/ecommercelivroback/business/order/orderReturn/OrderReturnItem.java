package br.com.fatecmogidascruzes.ecommercelivroback.business.order.orderReturn;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity(name = "returns_items")
public class OrderReturnItem {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "rti_order_id", nullable = false)
  private Long orderReturnId;

  @Column(name = "rti_item_id", nullable = false)
  private Long itemId;

  @Column(name = "orti_quantity", nullable = false)
  private int quantity;

  @Column(name = "orti_price", nullable = false)
  private double price;
}
