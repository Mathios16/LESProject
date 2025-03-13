package br.com.fatecmogidascruzes.ecommercelivroback.business.customer;

import java.sql.Timestamp;
import java.util.List;

import org.hibernate.annotations.Cascade;
import org.hibernate.annotations.CascadeType;
import org.springframework.web.bind.MethodArgumentNotValidException;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import br.com.fatecmogidascruzes.ecommercelivroback.business.address.Address;
import br.com.fatecmogidascruzes.ecommercelivroback.business.address.addressType.AddressType;
import br.com.fatecmogidascruzes.ecommercelivroback.business.customer.gender.Gender;
import br.com.fatecmogidascruzes.ecommercelivroback.business.customer.gender.GenderConverter;
import br.com.fatecmogidascruzes.ecommercelivroback.business.customer.phoneType.PhoneType;
import br.com.fatecmogidascruzes.ecommercelivroback.business.customer.phoneType.PhoneTypeConverter;
import br.com.fatecmogidascruzes.ecommercelivroback.business.paymentMethod.PaymentMethod;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity(name="customers")
public class Customer {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "cst_id")
  private int id;

  @NotBlank(message = "name: Nome não pode ser vazio")
  @Column(name = "cst_name", nullable = false)
  private String name;

  @NotBlank(message = "lastname: Sobrenome não pode ser vazio")
  @Column(name = "cst_lastname", nullable = false)
  private String lastname;

  @Pattern(regexp = "^\\d{3}\\.\\d{3}\\.\\d{3}\\-\\d{2}$", message = "document: Documento inválido")
  @NotBlank(message = "document: Documento não pode ser vazio")
  @Column(name = "cst_document", nullable = false, unique = true)
  private String document;

  @NotNull(message = "birthdate: Data de nascimento não pode ser vazia")
  @Column(name = "cst_birthdate", nullable = false)
  private Timestamp birthdate;

  @Email
  @NotBlank(message = "email: Email não pode ser vazio")
  @Column(name = "cst_email", nullable = false, unique = true)
  private String email;

  @Pattern(regexp = "^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*\\W)[\\w\\W]{8,}$", message = "password: Senha inválida")
  @NotBlank(message = "password: Senha não pode ser vazia")
  @Column(name = "cst_password", nullable = false)
  private String password;

  @Pattern(regexp = "^\\d{2}$", message = "phone: DDD inválido")
  @NotBlank(message = "phone: DDD não pode ser vazio")
  @Column(name = "cst_phoneddd", nullable = false)
  private String phoneddd;

  @Pattern(regexp = "^\\d{8,9}$", message = "phone: Telefone inválido")
  @NotBlank(message = "phone: Telefone não pode ser vazio")
  @Column(name = "cst_phonenumber", nullable = false)
  private String phone;

  @NotNull(message = "gender: Genero não pode ser vazio")
  @Convert(converter = GenderConverter.class)
  @Column(name = "cst_gnd_id", nullable = false)
  private Gender gender;

  @NotNull(message = "phoneType: Tipo de telefone não pode ser vazio")
  @Convert(converter = PhoneTypeConverter.class)
  @Column(name = "cst_ptyp_id", nullable = false)
  private PhoneType phoneType;

  @Cascade(CascadeType.REMOVE)
  @OneToMany(mappedBy = "customer")
  private List<Address> addresses;

  @Cascade(CascadeType.REMOVE)
  @OneToMany(mappedBy = "customer")
  private List<PaymentMethod> paymentMethods;

  public String getFullName() {
    return name + " " + lastname;
  }

  public void setGender(int gender) {
    this.gender = Gender.fromId(gender);
  }

  public void setPhoneType(int phoneType) {
    this.phoneType = PhoneType.fromId(phoneType);
  }

  public void verifyAddresses() throws MethodArgumentNotValidException {
    boolean hasDeliveryAddress = addresses != null && addresses.stream()
        .anyMatch(address -> address.getAddressType().contains(AddressType.ENTREGA));
    
    boolean hasBillingAddress = addresses != null && addresses.stream()
        .anyMatch(address -> address.getAddressType().contains(AddressType.COBRANCA));

    if(!hasDeliveryAddress || !hasBillingAddress) {
      throw new IllegalArgumentException("addresses: É necessário ter pelo menos um endereço de entrega e de cobrança");
    }
  }

  public void verifyPaymentMethods() throws MethodArgumentNotValidException {
    boolean hasValidPaymentMethod = paymentMethods != null && paymentMethods.stream()
        .anyMatch(paymentMethod -> paymentMethod.getCardExpiration().after(new Timestamp(System.currentTimeMillis())));
    if(!hasValidPaymentMethod) {
      throw new IllegalArgumentException("paymentMethods: É necessário ter pelo menos um método de pagamento válido");
    }
  }
}
