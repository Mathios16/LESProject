package br.com.fatecmogidascruzes.ecommercelivroback.business.order.orderReturn;

import java.util.List;

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
@Entity(name = "returns")
public class OrderReturn {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "rtr_id")
  private Long id;

  @Column(name = "rtr_orders_id")
  private Long orderId;

  @Column(name = "rtr_order_items_id")
  private List<Long> orderItemsId;
}
