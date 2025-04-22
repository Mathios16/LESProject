package br.com.fatecmogidascruzes.ecommercelivroback.infra.DTO;

import br.com.fatecmogidascruzes.ecommercelivroback.business.address.Address;
import br.com.fatecmogidascruzes.ecommercelivroback.business.customer.Customer;
import br.com.fatecmogidascruzes.ecommercelivroback.business.paymentMethod.PaymentMethod;

import java.sql.Timestamp;
import java.util.List;

public record dataCustomer(Long id, String name, String lastname, String gender, String document, Timestamp birthdate,
    String email, String password, String phoneDdd, String phoneType, String phone, List<Address> addresses,
    List<PaymentMethod> paymentMethods) {
  public static dataCustomer fromCustomer(Customer customer) {
    return new dataCustomer(
        customer.getId(),
        customer.getName(),
        customer.getLastname(),
        customer.getGender(),
        customer.getDocument(),
        customer.getBirthdate(),
        customer.getEmail(),
        customer.getPassword(),
        customer.getPhoneDdd(),
        customer.getPhoneType(),
        customer.getPhone(),
        customer.getAddresses(),
        customer.getPaymentMethods());
  }
}
