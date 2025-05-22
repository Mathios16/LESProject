package br.com.fatecmogidascruzes.ecommercelivroback.business.order.orderReturn;

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
@Entity(name = "returns")
public class OrderReturn {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "rtr_id")
  private Long id;

  @Column(name = "rtr_orders_id")
  private Long orderId;

  @OneToMany(mappedBy = "orderReturnId")
  private List<OrderReturnItem> orderReturnItems;

  @Column(name = "rtr_cupom_id")
  private Long cupomId;

  @ManyToOne
  @JoinColumn(name = "rtr_cupom_id", insertable = false, updatable = false)
  private Cupom cupom;

  public Double getValue() {
    return orderReturnItems.stream()
        .mapToDouble(OrderReturnItem::getPrice)
        .sum();
  }
}
