package br.com.fatecmogidascruzes.ecommercelivroback.infra.web;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import br.com.fatecmogidascruzes.ecommercelivroback.business.customer.Customer;
import br.com.fatecmogidascruzes.ecommercelivroback.infra.persistence.CustomerRepository;

@RestController
@RequestMapping("/customers")
public class CustomerController {

    @Autowired
    private CustomerRepository customerRepository;

    @PostMapping
    public ResponseEntity<Customer> createCustomer(@RequestBody Customer customer) {
        Customer savedCustomer = customerRepository.save(customer);
        return ResponseEntity.ok(savedCustomer);
    }

    @GetMapping
    public ResponseEntity<List<Customer>> getAllCustomers(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String email,
            @RequestParam(required = false) String document) {
        
        List<Customer> customers = customerRepository.findAll();
        
        if (name != null && !name.isEmpty()) {
            customers = customers.stream()
                .filter(customer -> customer.getName().toLowerCase().contains(name.toLowerCase()))
                .collect(Collectors.toList());
        }
        
        if (email != null && !email.isEmpty()) {
            customers = customers.stream()
                .filter(customer -> customer.getEmail().toLowerCase().contains(email.toLowerCase()))
                .collect(Collectors.toList());
        }

        if(document != null && !document.isEmpty()) {
            customers = customers.stream()
                .filter(customer -> customer.getDocument().equals(document))
                .collect(Collectors.toList());
        }
        
        return ResponseEntity.ok(customers);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Customer> getCustomerById(@PathVariable Long id) {
        Optional<Customer> customer = customerRepository.findById(id);
        return ResponseEntity.of(customer);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Customer> updateCustomer(@PathVariable Long id, @RequestBody Customer customer) {
        Optional<Customer> existingCustomer = customerRepository.findById(id);
        if (existingCustomer.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        customer.setId(id);
        Customer updatedCustomer = customerRepository.save(customer);
        return ResponseEntity.ok(updatedCustomer);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCustomer(@PathVariable Long id) {
        Optional<Customer> customer = customerRepository.findById(id);
        if (customer.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        customerRepository.delete(customer.get());
        return ResponseEntity.ok().build();
    }
}
