package br.com.fatecmogidascruzes.ecommercelivroback.business.order.orderExchange;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Column;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity(name = "exchanged_items")
public class OrderExchangedItem {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "exi_order_id", nullable = false)
  private Long orderExchangeId;

  @Column(name = "exi_item_id", nullable = false)
  private Long itemId;

  @Column(name = "exi_quantity", nullable = false)
  private int quantity;

  @Column(name = "exi_price", nullable = false)
  private double price;
}
