package br.com.fatecmogidascruzes.ecommercelivroback.business.order.orderExchange;

import java.util.List;

import br.com.fatecmogidascruzes.ecommercelivroback.business.order.cupom.Cupom;
import jakarta.persistence.Column;
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
@Entity(name = "exchanges")
public class OrderExchange {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "exc_id")
  private Long id;

  @Column(name = "exc_order_id")
  private Long orderId;

  @Column(name = "exc_order_items_id")
  private List<Long> orderItemsId;

  @OneToMany(mappedBy = "orderExchangeId")
  private List<OrderExchangeItem> items;

  @Column(name = "exc_cupom_id")
  private Long cupomId;

  @ManyToOne
  @JoinColumn(name = "exc_cupom_id", insertable = false, updatable = false)
  private Cupom cupom;
}
