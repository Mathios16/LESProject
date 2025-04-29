package br.com.fatecmogidascruzes.ecommercelivroback.business.order.orderReturn;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import br.com.fatecmogidascruzes.ecommercelivroback.business.order.OrderItem;
import br.com.fatecmogidascruzes.ecommercelivroback.business.order.cupom.Cupom;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Transient;
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

  @Column(name = "rtr_order_items_id", columnDefinition = "varchar(255)")
  private String orderItemsIdStr;

  @Transient
  private List<Long> orderItemsId;

  public List<Long> getOrderItemsId() {
    if (orderItemsIdStr == null || orderItemsIdStr.isEmpty()) {
      return new ArrayList<>();
    }
    return Arrays.stream(orderItemsIdStr.split(","))
        .map(Long::parseLong)
        .collect(Collectors.toList());
  }

  public void setOrderItemsId(List<Long> orderItemsId) {
    this.orderItemsId = orderItemsId;
    if (orderItemsId != null && !orderItemsId.isEmpty()) {
      this.orderItemsIdStr = orderItemsId.stream()
          .map(String::valueOf)
          .collect(Collectors.joining(","));
    }
  }

  @OneToMany
  @JoinColumn(name = "rtr_order_items_id", insertable = false, updatable = false)
  private List<OrderItem> orderItems;

  @Column(name = "rtr_cupom_id")
  private Long cupomId;

  @ManyToOne
  @JoinColumn(name = "rtr_cupom_id", insertable = false, updatable = false)
  private Cupom cupom;

  public Double getValue() {
    return orderItems.stream()
        .mapToDouble(OrderItem::getPrice)
        .sum();
  }
}
