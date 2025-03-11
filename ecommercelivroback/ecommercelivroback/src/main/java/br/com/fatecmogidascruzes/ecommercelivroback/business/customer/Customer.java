package br.com.fatecmogidascruzes.ecommercelivroback.business.customer;

import java.sql.Timestamp;

import br.com.fatecmogidascruzes.ecommercelivroback.business.customer.gender.Gender;
import br.com.fatecmogidascruzes.ecommercelivroback.business.customer.gender.GenderConverter;
import br.com.fatecmogidascruzes.ecommercelivroback.business.customer.phoneType.PhoneType;
import br.com.fatecmogidascruzes.ecommercelivroback.business.customer.phoneType.PhoneTypeConverter;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

@Entity(name="Customers")
public class Customer {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "cst_id")
  private Long id;

  @NotBlank(message = "Nome não pode ser vazio")
  @Column(name = "cst_name", nullable = false)
  private String name;

  @NotBlank(message = "Sobrenome não pode ser vazio")
  @Column(name = "cst_lastname", nullable = false)
  private String lastname;

  @Column(name = "cst_birthdate", nullable = false)
  private Timestamp birthdate;

  @Email
  @NotBlank(message = "Email não pode ser vazio")
  @Column(name = "cst_email", nullable = false, unique = true)
  private String email;

  @Pattern(regexp = "^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*\\W)[\\w\\W]{8,}$", message = "Senha inválida")
  @NotBlank(message = "Senha não pode ser vazia")
  @Column(name = "cst_password", nullable = false)
  private String password;

  @Pattern(regexp = "^\\d{2}$", message = "DDD inválido")
  @NotBlank(message = "DDD não pode ser vazio")
  @Column(name = "cst_phone_ddd", nullable = false)
  private String phoneddd;

  @Pattern(regexp = "^\\d{8,9}$", message = "Telefone inválido")
  @NotBlank(message = "Telefone não pode ser vazio")
  @Column(name = "cst_phone", nullable = false)
  private String phone;

  @Convert(converter = GenderConverter.class)
  @Column(name = "cst_gnd_id", nullable = false)
  private Gender gender;

  @Convert(converter = PhoneTypeConverter.class)
  @Column(name = "cst_ptyp_id", nullable = false)
  private PhoneType phoneType;

  protected Customer() {
  }

  public Customer(String name, String lastname, Timestamp birthdate, String email, String password,
      String phoneddd, String phone) {
    setName(name);
    setLastname(lastname);
    setBirthdate(birthdate);
    setEmail(email);
    setPassword(password);
    setPhoneddd(phoneddd);
    setPhone(phone);
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getLastname() {
    return lastname;
  }

  public void setLastname(String lastname) {
    this.lastname = lastname;
  }

  public Timestamp getBirthdate() {
    return birthdate;
  }

  public void setBirthdate(Timestamp birthdate) {
    this.birthdate = birthdate;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public String getPassword() {
    return password;
  }

  public void setPassword(String password) {
    this.password = password;
  }

  public String getPhoneddd() {
    return phoneddd;
  }

  public void setPhoneddd(String phoneddd) {
    this.phoneddd = phoneddd;
  }

  public String getPhone() {
    return phone;
  }

  public void setPhone(String phone) {
    this.phone = phone;
  }

  public Gender getGender() {
    return gender;
  }

  public void setGender(Gender gender) {
    this.gender = gender;
  }

  public PhoneType getPhoneType() {
    return phoneType;
  }

  public void setPhoneType(PhoneType phoneType) {
    this.phoneType = phoneType;
  }
}
