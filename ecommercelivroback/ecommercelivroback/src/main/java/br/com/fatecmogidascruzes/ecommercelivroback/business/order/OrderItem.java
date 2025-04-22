package br.com.fatecmogidascruzes.ecommercelivroback.business.order;

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
@Entity(name = "orderitems")
public class OrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ori_id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "ori_item_id", insertable = false, updatable = false)
    private Item item;

    @Column(name = "ori_item_id", nullable = false)
    private Long itemId;

    @Column(name = "ori_quantity", nullable = false)
    private int quantity;

    @Column(name = "ori_price", nullable = false)
    private double price;

    @Column(name = "ori_order_id", nullable = false)
    private Long orderId;
}
