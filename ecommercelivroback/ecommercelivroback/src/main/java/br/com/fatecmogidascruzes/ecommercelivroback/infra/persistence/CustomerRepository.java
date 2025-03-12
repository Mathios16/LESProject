package br.com.fatecmogidascruzes.ecommercelivroback.infra.persistence;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.com.fatecmogidascruzes.ecommercelivroback.business.customer.Customer;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Integer> {
}