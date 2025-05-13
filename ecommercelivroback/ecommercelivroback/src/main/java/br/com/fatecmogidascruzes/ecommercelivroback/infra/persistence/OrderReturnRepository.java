package br.com.fatecmogidascruzes.ecommercelivroback.infra.persistence;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.com.fatecmogidascruzes.ecommercelivroback.business.order.orderReturn.OrderReturn;

@Repository
public interface OrderReturnRepository extends JpaRepository<OrderReturn, Long> {
  Optional<List<OrderReturn>> findByOrderId(Long orderId);
}
