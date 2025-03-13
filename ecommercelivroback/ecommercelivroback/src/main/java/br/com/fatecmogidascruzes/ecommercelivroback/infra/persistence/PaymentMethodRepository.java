package br.com.fatecmogidascruzes.ecommercelivroback.infra.persistence;

import br.com.fatecmogidascruzes.ecommercelivroback.business.paymentMethod.PaymentMethod;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentMethodRepository extends JpaRepository<PaymentMethod, Integer> {
    List<PaymentMethod> findByCustomer(int customerId);
}
