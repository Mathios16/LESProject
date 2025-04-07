package br.com.fatecmogidascruzes.ecommercelivroback.infra.persistence;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.com.fatecmogidascruzes.ecommercelivroback.business.order.cart.Cart;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {
    Optional<Cart> findByCustomerId(Long customerId);
}
