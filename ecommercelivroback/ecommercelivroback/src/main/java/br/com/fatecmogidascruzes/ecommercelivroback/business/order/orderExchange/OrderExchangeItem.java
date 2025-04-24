package br.com.fatecmogidascruzes.ecommercelivroback.business.order.orderExchange;

import br.com.fatecmogidascruzes.ecommercelivroback.business.item.Item;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity(name = "exchangeitems")
public class OrderExchangeItem {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "exi_id")
  private Long id;

  @ManyToOne
  @JoinColumn(name = "exi_item_id", insertable = false, updatable = false)
  private Item item;

  @Column(name = "exi_item_id", nullable = false)
  private Long itemId;

  @Column(name = "exi_quantity", nullable = false)
  private int quantity;

  @Column(name = "exi_price", nullable = false)
  private double price;

  @Column(name = "exi_exchange_id", nullable = false)
  private Long exchangeId;
}
