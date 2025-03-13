package br.com.fatecmogidascruzes.ecommercelivroback.business.address;

import java.util.List;
import java.util.stream.Collectors;

import br.com.fatecmogidascruzes.ecommercelivroback.business.address.addressType.AddressType;
import br.com.fatecmogidascruzes.ecommercelivroback.business.address.addressType.AddressTypeConverter;
import br.com.fatecmogidascruzes.ecommercelivroback.business.address.streetType.StreetType;
import br.com.fatecmogidascruzes.ecommercelivroback.business.address.streetType.StreetTypeConverter;
import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity(name = "addresses")
public class Address {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "add_id")
    private int id;

    @Column(name = "add_title")
    private String title;

    @NotNull(message = "addressType: Tipo de endereço não pode ser vazio")
    @Convert(converter = AddressTypeConverter.class)
    @Column(name = "add_addresstype", nullable = false)
    private List<AddressType> addressType;

    @NotNull(message = "streetType: Tipo de rua não pode ser vazio")
    @Convert(converter = StreetTypeConverter.class)
    @Column(name = "add_streettype", nullable = false)
    private StreetType streetType;

    @NotBlank(message = "street: Rua não pode ser vazia")
    @Column(name = "add_street", nullable = false)
    private String street;

    @NotBlank(message = "number: Número não pode ser vazio")
    @Column(name = "add_number", nullable = false)
    private String number;

    @Column(name = "add_complement")
    private String complement;

    @NotBlank(message = "neighborhood: Bairro não pode ser vazio")
    @Column(name = "add_neighborhood", nullable = false)
    private String neighborhood;

    @NotBlank(message = "city: Cidade não pode ser vazia")
    @Column(name = "add_city", nullable = false)
    private String city;

    @NotBlank(message = "state: Estado não pode ser vazio")
    @Column(name = "add_state", nullable = false)
    private String state;

    @NotBlank(message = "country: País não pode ser vazio")
    @Column(name = "add_country", nullable = false)
    private String country;

    @Pattern(regexp = "^\\d{5}-\\d{3}$", message = "zip: CEP inválido")
    @NotBlank(message = "zip: CEP não pode ser vazio")
    @Column(name = "add_zip", nullable = false)
    private String zip;

    @Column(name = "add_cst_id")
    private int customer;

    public String getAddress() {
        return streetType + " " + street + ", " + number + ", " + complement + "\n" + zip + " - " + neighborhood + ", " + city + ", " + state + ", " + country;
    }

    public void setAddressType(List<Integer> addressType) {
        this.addressType = addressType.stream().map(id -> AddressType.fromId(id)).collect(Collectors.toList());
    }

    public void setStreetType(int streetType) {
        this.streetType = StreetType.fromId(streetType);
    }
}
