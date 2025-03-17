package br.com.fatecmogidascruzes.ecommercelivroback;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.TestPropertySource;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;

import br.com.fatecmogidascruzes.ecommercelivroback.business.customer.Customer;
import br.com.fatecmogidascruzes.ecommercelivroback.infra.persistence.CustomerRepository;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@TestPropertySource(properties = {
    "spring.datasource.url=jdbc:mysql://172.17.0.2:3306/ecommercelivro_test?createDatabaseIfNotExist=true",
    "spring.datasource.username=root",
    "spring.datasource.password=root",
    "spring.jpa.hibernate.ddl-auto=create-drop"
})
class CustomerControllerIntegrationTest {
    @Autowired
    private TestRestTemplate restTemplate;
    
    @Autowired
    private CustomerRepository customerRepository;
    
    @BeforeEach
    void setup() {
        customerRepository.deleteAll();
    }
    
    @Test
    void shouldCreateAndRetrieveCustomer() {
        // Arrange
        Customer customer = new Customer();
        customer.setName("Integration Test User");
        customer.setEmail("integration@test.com");
        
        // Act
        ResponseEntity<Customer> createResponse = restTemplate.postForEntity(
            "/customers",
            customer,
            Customer.class
        );
        
        // Assert
        assertEquals(HttpStatus.CREATED, createResponse.getStatusCode());
        
        Customer created = createResponse.getBody();
        assertNotNull(created.getId());
        
        ResponseEntity<Customer> getResponse = restTemplate.getForEntity(
            "/customers/" + created.getId(),
            Customer.class
        );
        
        assertEquals(HttpStatus.OK, getResponse.getStatusCode());
        assertEquals(customer.getName(), getResponse.getBody().getName());
    }
}