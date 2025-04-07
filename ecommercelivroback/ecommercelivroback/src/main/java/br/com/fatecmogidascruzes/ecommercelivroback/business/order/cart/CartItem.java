package br.com.fatecmogidascruzes.ecommercelivroback.business.order.cart;

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
@Entity(name = "cartitems")
public class CartItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cti_id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "cti_item_id", insertable = false, updatable = false)
    private Item item;

    @Column(name = "cti_item_id", nullable = false)
    private Long itemId;

    @Column(name = "cti_quantity", nullable = false)
    private int quantity;

    @Column(name = "cti_price", nullable = false)
    private double price;

    @Column(name = "cti_cart_id", nullable = false)
    private Long cartId;

    public double getTotal() {
        return quantity * price;
    }
}
