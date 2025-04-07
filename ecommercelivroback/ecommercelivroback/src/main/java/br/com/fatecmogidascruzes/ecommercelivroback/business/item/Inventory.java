package br.com.fatecmogidascruzes.ecommercelivroback.business.item;

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
@Entity(name = "inventories")
public class Inventory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "inv_itm_id", nullable = false)
    private Long itemId;

    @Column(name = "inv_quantity", nullable = false)
    private int quantity;

    @Column(name = "inv_cost", nullable = false)
    private Double cost;

    @Column(name = "inv_supplier", nullable = false)
    private String supplier;
}
