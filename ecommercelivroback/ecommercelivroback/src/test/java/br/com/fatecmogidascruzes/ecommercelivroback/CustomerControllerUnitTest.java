package br.com.fatecmogidascruzes.ecommercelivroback;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import br.com.fatecmogidascruzes.ecommercelivroback.business.address.Address;
import br.com.fatecmogidascruzes.ecommercelivroback.business.customer.Customer;
import br.com.fatecmogidascruzes.ecommercelivroback.infra.DTO.dataCustomer;
import br.com.fatecmogidascruzes.ecommercelivroback.infra.persistence.AddressRepository;
import br.com.fatecmogidascruzes.ecommercelivroback.infra.persistence.CustomerRepository;
import br.com.fatecmogidascruzes.ecommercelivroback.infra.persistence.PaymentMethodRepository;
import br.com.fatecmogidascruzes.ecommercelivroback.infra.web.controller.CustomerController;

@SpringBootTest
@TestPropertySource(properties = {
        "spring.datasource.url=jdbc:mysql://172.17.0.2:3306/ecommercelivro_test?createDatabaseIfNotExist=true",
        "spring.datasource.username=root",
        "spring.datasource.password=root",
        "spring.jpa.hibernate.ddl-auto=create-drop"
})
class CustomerControllerUnitTest {
    @MockitoBean
    private CustomerRepository customerRepository;

    @MockitoBean
    private AddressRepository addressRepository;

    @MockitoBean
    private PaymentMethodRepository paymentMethodRepository;

    @Autowired
    private CustomerController customerController;

    @Test
    void shouldCreateCustomer() throws Exception {
        // Arrange
        Customer customer = new Customer();
        customer.setName("Test User");
        customer.setEmail("test@example.com");

        Address address = new Address();
        address.setStreet("Test Street");

        dataCustomer data = new dataCustomer(customer, List.of(address), List.of());

        when(customerRepository.save(any(Customer.class)))
                .thenReturn(customer);

        // Act
        ResponseEntity<?> response = customerController.createCustomer(data);

        // Assert
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        verify(customerRepository).save(any(Customer.class));
    }
}