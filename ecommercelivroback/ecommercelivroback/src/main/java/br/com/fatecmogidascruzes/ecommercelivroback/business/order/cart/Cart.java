package br.com.fatecmogidascruzes.ecommercelivroback.business.order.cart;

import java.util.List;

import org.hibernate.annotations.Cascade;
import org.hibernate.annotations.CascadeType;

import br.com.fatecmogidascruzes.ecommercelivroback.business.address.Address;
import br.com.fatecmogidascruzes.ecommercelivroback.business.customer.Customer;
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
@Entity(name = "carts")
public class Cart {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "crt_id")
    private Long id;

    @Column(name = "crt_customer_id", nullable = false)
    private Long customerId;

    @Column(name = "crt_address_id")
    private Long addressId;

    @ManyToOne
    @JoinColumn(name = "crt_customer_id", insertable = false, updatable = false)
    private Customer customer;

    @ManyToOne
    @JoinColumn(name = "crt_address_id", insertable = false, updatable = false)
    private Address address;

    @Cascade(CascadeType.REMOVE)
    @OneToMany(mappedBy = "cartId")
    private List<CartItem> items;

    public Double getFreight() {
        Double freight = 0.0;
        if (items.size() >= 3) {
            freight += items.stream().mapToDouble(CartItem::getPrice).sum() * 0.1;
        }
        if (address != null && !address.getState().contains("SP")) {
            freight += 10.0;
        }
        return freight;
    }

    public Double getSubTotal() {
        return items.stream()
                .mapToDouble(CartItem::getPrice)
                .sum();
    }

    public Double getTotal() {
        return getSubTotal() + getFreight();
    }

    public void verifyItems() {
        items.stream().forEach(item -> {
            if (item.getQuantity() > item.getItem().getQuantity()) {
                item.setQuantity(item.getItem().getQuantity());
                throw new IllegalArgumentException("Quantidade de " + item.getItem().getTitle() + " excedida.");
            }
            if (item.getItem().getQuantity() == 0) {
                items.remove(item);
                throw new IllegalArgumentException("Item " + item.getItem().getTitle() + " indisponível.");
            }
        });
    }
}