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
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import br.com.fatecmogidascruzes.ecommercelivroback.business.address.Address;
import br.com.fatecmogidascruzes.ecommercelivroback.business.customer.gender.GenderConverter;
import br.com.fatecmogidascruzes.ecommercelivroback.business.customer.phoneType.PhoneTypeConverter;
import br.com.fatecmogidascruzes.ecommercelivroback.business.paymentMethod.PaymentMethod;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity(name = "customers")
public class Customer {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "cst_id")
  private Long id;

  @NotBlank(message = "name: Nome não pode ser vazio")
  @Column(name = "cst_name", nullable = false)
  private String name;

  @NotBlank(message = "lastname: Sobrenome não pode ser vazio")
  @Column(name = "cst_lastname", nullable = false)
  private String lastname;

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

  @NotBlank(message = "password: Senha não pode ser vazia")
  @Column(name = "cst_password", nullable = false)
  private String password;

  @NotBlank(message = "phone: DDD não pode ser vazio")
  @Column(name = "cst_phoneddd", nullable = false)
  private String phoneDdd;

  @NotBlank(message = "phone: Telefone não pode ser vazio")
  @Column(name = "cst_phonenumber", nullable = false)
  private String phone;

  @NotNull(message = "gender: Genero não pode ser vazio")
  @Convert(converter = GenderConverter.class)
  @Column(name = "cst_gnd_id", nullable = false)
  private String gender;

  @NotNull(message = "phoneType: Tipo de telefone não pode ser vazio")
  @Convert(converter = PhoneTypeConverter.class)
  @Column(name = "cst_ptyp_id", nullable = false)
  private String phoneType;

  @Cascade(CascadeType.REMOVE)
  @OneToMany(mappedBy = "customer")
  private List<Address> addresses;

  @Cascade(CascadeType.REMOVE)
  @OneToMany(mappedBy = "customer")
  private List<PaymentMethod> paymentMethods;

  public String getFullName() {
    return name + " " + lastname;
  }

  public void verifyAddresses() throws MethodArgumentNotValidException {
    boolean hasDeliveryAddress = addresses != null && addresses.stream()
        .anyMatch(address -> address.getAddressType().contains("ENTREGA"));

    boolean hasBillingAddress = addresses != null && addresses.stream()
        .anyMatch(address -> address.getAddressType().contains("COBRANCA"));

    boolean hasResidenceAddress = addresses != null && addresses.stream()
        .anyMatch(address -> address.getAddressType().contains("RESIDENCIAL"));

    if (!hasDeliveryAddress || !hasBillingAddress || !hasResidenceAddress) {
      throw new IllegalArgumentException(
          "addresses: É necessário ter pelo menos um endereço de entrega, de cobrança e residencial");
    }
  }

  public void verifyPaymentMethods() throws MethodArgumentNotValidException {
    if (paymentMethods == null || paymentMethods.isEmpty()) {
      throw new IllegalArgumentException("paymentMethods: É necessário ter pelo menos um método de pagamento válido");
    }

    Timestamp now = new Timestamp(System.currentTimeMillis());
    boolean hasValidPaymentMethod = paymentMethods.stream()
        .anyMatch(paymentMethod -> {
          try {
            return paymentMethod.getExpirationTimestamp().after(now);
          } catch (IllegalArgumentException e) {
            return false;
          }
        });

    if (!hasValidPaymentMethod) {
      throw new IllegalArgumentException(
          "paymentMethods: É necessário ter pelo menos um método de pagamento válido e não expirado");
    }
  }
}
