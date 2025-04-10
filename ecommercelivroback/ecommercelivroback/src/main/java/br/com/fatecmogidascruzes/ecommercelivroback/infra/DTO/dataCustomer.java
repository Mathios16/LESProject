package br.com.fatecmogidascruzes.ecommercelivroback.infra.DTO;

import br.com.fatecmogidascruzes.ecommercelivroback.business.address.Address;
import br.com.fatecmogidascruzes.ecommercelivroback.business.customer.Customer;
import br.com.fatecmogidascruzes.ecommercelivroback.business.paymentMethod.PaymentMethod;
import jakarta.validation.Valid;

import java.util.List;

public record dataCustomer(@Valid Customer customer, List<Address> addresses, List<PaymentMethod> paymentMethods) {
}
