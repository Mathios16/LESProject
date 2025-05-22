package br.com.fatecmogidascruzes.ecommercelivroback.business.order.orderExchange;

import java.util.List;

import br.com.fatecmogidascruzes.ecommercelivroback.business.address.Address;
import br.com.fatecmogidascruzes.ecommercelivroback.business.order.cupom.Cupom;
import br.com.fatecmogidascruzes.ecommercelivroback.business.order.orderPayment.OrderPayment;
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

  @Column(name = "exc_address_id")
  private Long addressId;

  @ManyToOne
  @JoinColumn(name = "exc_address_id", insertable = false, updatable = false)
  private Address address;

  @OneToMany(mappedBy = "orderExchangeId")
  private List<OrderPayment> payments;

  @OneToMany(mappedBy = "orderExchangeId")
  private List<OrderExchangedItem> orderItems;

  @OneToMany(mappedBy = "orderExchangeId")
  private List<OrderExchangeItem> items;

  @Column(name = "exc_cupom_id")
  private Long cupomId;

  @ManyToOne
  @JoinColumn(name = "exc_cupom_id", insertable = false, updatable = false)
  private Cupom cupom;

  public Double getValue() {
    return cupom.getValue();
  }
}
