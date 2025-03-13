package br.com.fatecmogidascruzes.ecommercelivroback.infra.web;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
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

import jakarta.validation.Valid;
import br.com.fatecmogidascruzes.ecommercelivroback.business.address.Address;
import br.com.fatecmogidascruzes.ecommercelivroback.business.customer.Customer;
import br.com.fatecmogidascruzes.ecommercelivroback.business.paymentMethod.PaymentMethod;
import br.com.fatecmogidascruzes.ecommercelivroback.infra.DTO.dataCustomer;
import br.com.fatecmogidascruzes.ecommercelivroback.infra.persistence.AddressRepository;
import br.com.fatecmogidascruzes.ecommercelivroback.infra.persistence.CustomerRepository;
import br.com.fatecmogidascruzes.ecommercelivroback.infra.persistence.PaymentMethodRepository;

import org.springframework.transaction.annotation.Transactional;

@RestController
@RequestMapping("/customers")
public class CustomerController {

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private PaymentMethodRepository paymentMethodRepository;

    @PostMapping
    @Transactional(rollbackFor = Exception.class)
    public ResponseEntity<?> createCustomer(@Valid @RequestBody dataCustomer data) throws Exception {
        Customer customer = data.customer();
        List<Address> addresses = data.addresses();
        List<PaymentMethod> paymentMethods = data.paymentMethods();

        customer.setAddresses(addresses);
        customer.setPaymentMethods(paymentMethods);
        
        customer.verifyAddresses();
        customer.verifyPaymentMethods();

        Customer savedCustomer = customerRepository.save(customer);
                    
        addresses.forEach(address -> address.setCustomer(savedCustomer.getId()));
        addressRepository.saveAll(addresses);

        paymentMethods.forEach(paymentMethod -> paymentMethod.setCustomer(savedCustomer.getId()));
        paymentMethodRepository.saveAll(paymentMethods);

        return ResponseEntity.status(HttpStatus.CREATED).body(savedCustomer);
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
    public ResponseEntity<Customer> getCustomerById(@PathVariable int id) {
        Optional<Customer> customer = customerRepository.findById(id);

        return ResponseEntity.ok(customer.get());
    }

    @PutMapping("/{id}")
    @Transactional(rollbackFor = Exception.class)
    public ResponseEntity<?> updateCustomer(@PathVariable int id,@Valid @RequestBody dataCustomer data) throws Exception {
        Optional<Customer> existingCustomer = customerRepository.findById(id);
        if (existingCustomer.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Customer customer = data.customer();
        List<Address> addresses = data.addresses();
        
        customer.setAddresses(addresses);
        customer.verifyAddresses();
        customer.setId(id);
        Customer updatedCustomer = customerRepository.save(customer);
        
        addresses.forEach(address -> address.setCustomer(updatedCustomer.getId()));
        addressRepository.saveAll(addresses);
        
        return ResponseEntity.ok(updatedCustomer);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCustomer(@PathVariable int id) {
        Optional<Customer> customer = customerRepository.findById(id);
        if (customer.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        customerRepository.delete(customer.get());
        return ResponseEntity.ok().build();
    }
}
