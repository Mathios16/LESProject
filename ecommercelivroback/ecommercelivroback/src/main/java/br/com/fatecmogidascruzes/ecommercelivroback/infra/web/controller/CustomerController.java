package br.com.fatecmogidascruzes.ecommercelivroback.infra.web.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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

import jakarta.validation.Valid;
import br.com.fatecmogidascruzes.ecommercelivroback.business.address.Address;
import br.com.fatecmogidascruzes.ecommercelivroback.business.customer.Customer;
import br.com.fatecmogidascruzes.ecommercelivroback.business.paymentMethod.PaymentMethod;
import br.com.fatecmogidascruzes.ecommercelivroback.infra.DTO.dataCustomer;
import br.com.fatecmogidascruzes.ecommercelivroback.infra.persistence.AddressRepository;
import br.com.fatecmogidascruzes.ecommercelivroback.infra.persistence.CustomerRepository;
import br.com.fatecmogidascruzes.ecommercelivroback.infra.persistence.PaymentMethodRepository;

import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

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
    public ResponseEntity<?> createCustomer(@Valid @RequestBody dataCustomer data) {
        try {
            List<Address> addresses = data.addresses();
            List<PaymentMethod> paymentMethods = data.paymentMethods();

            Customer customer = new Customer();
            customer.setName(data.name());
            customer.setLastname(data.lastname());
            customer.setGender(data.gender());
            customer.setDocument(data.document());
            customer.setBirthdate(data.birthdate());
            customer.setEmail(data.email());
            customer.setPassword(data.password());
            customer.setPhoneDdd(data.phoneDdd());
            customer.setPhoneType(data.phoneType());
            customer.setPhone(data.phone());
            customer.setAddresses(addresses);
            customer.setPaymentMethods(paymentMethods);

            customer.verifyAddresses();
            customer.verifyPaymentMethods();

            Customer savedCustomer = customerRepository.save(customer);

            addresses.forEach(address -> address.setCustomer(savedCustomer.getId()));
            addressRepository.saveAll(addresses);

            paymentMethods.forEach(paymentMethod -> paymentMethod.setCustomer(savedCustomer.getId()));
            paymentMethodRepository.saveAll(paymentMethods);

            return ResponseEntity.status(HttpStatus.CREATED).body(dataCustomer.fromCustomer(savedCustomer));
        } catch (IllegalArgumentException | IllegalStateException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "An unexpected error occurred while creating the customer.", e);
        }
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

        if (document != null && !document.isEmpty()) {
            customers = customers.stream()
                    .filter(customer -> customer.getDocument().equals(document))
                    .collect(Collectors.toList());
        }

        return ResponseEntity.ok(customers);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Customer> getCustomerById(@PathVariable Long id) {
        Optional<Customer> customerOpt = customerRepository.findById(id);
        if (customerOpt.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Customer not found with id: " + id);
        }
        return ResponseEntity.ok(customerOpt.get());
    }

    @PutMapping("/{id}")
    @Transactional(rollbackFor = Exception.class)
    public ResponseEntity<?> updateCustomer(@PathVariable Long id, @Valid @RequestBody dataCustomer data) {
        Optional<Customer> existingCustomerOpt = customerRepository.findById(id);

        if (existingCustomerOpt.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Customer not found with id: " + id);
        }

        Customer customerToUpdate = existingCustomerOpt.get();

        List<Address> addresses = data.addresses();
        List<PaymentMethod> paymentMethods = data.paymentMethods();

        customerToUpdate.setName(data.name());
        customerToUpdate.setLastname(data.lastname());
        customerToUpdate.setGender(data.gender());
        customerToUpdate.setDocument(data.document());
        customerToUpdate.setBirthdate(data.birthdate());
        customerToUpdate.setEmail(data.email());
        customerToUpdate.setPassword(data.password());
        customerToUpdate.setPhoneDdd(data.phoneDdd());
        customerToUpdate.setPhoneType(data.phoneType());
        customerToUpdate.setPhone(data.phone());

        customerToUpdate.getAddresses().clear();
        if (addresses != null) {
            addresses.forEach(addr -> addr.setCustomer(customerToUpdate.getId()));
            customerToUpdate.getAddresses().addAll(addresses);
        }

        customerToUpdate.getPaymentMethods().clear();
        if (paymentMethods != null) {
            paymentMethods.forEach(pm -> pm.setCustomer(customerToUpdate.getId()));
            customerToUpdate.getPaymentMethods().addAll(paymentMethods);
        }

        try {
            customerToUpdate.verifyAddresses();
            customerToUpdate.verifyPaymentMethods();

            Customer updatedCustomer = customerRepository.save(customerToUpdate);

            if (addresses != null) {
                addressRepository.saveAll(addresses);
            }
            if (paymentMethods != null) {
                paymentMethodRepository.saveAll(paymentMethods);
            }

            return ResponseEntity.ok(dataCustomer.fromCustomer(updatedCustomer));

        } catch (IllegalArgumentException | IllegalStateException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "An unexpected error occurred while updating the customer.", e);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCustomer(@PathVariable Long id,
            @RequestBody(required = false) dataCustomer data) {
        Optional<Customer> customer = customerRepository.findById(id);
        if (customer.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        if (data == null) {
            customerRepository.delete(customer.get());
        } else {
            List<Address> addresses = data.addresses();
            List<PaymentMethod> paymentMethods = data.paymentMethods();

            if (addresses != null) {
                addresses.forEach(address -> addressRepository.delete(address));
            }

            if (paymentMethods != null) {
                paymentMethods.forEach(paymentMethod -> paymentMethodRepository.delete(paymentMethod));
            }
        }
        return ResponseEntity.ok().build();
    }
}
