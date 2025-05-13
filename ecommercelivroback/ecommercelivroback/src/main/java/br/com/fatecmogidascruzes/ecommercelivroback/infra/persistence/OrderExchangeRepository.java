package br.com.fatecmogidascruzes.ecommercelivroback.infra.persistence;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.com.fatecmogidascruzes.ecommercelivroback.business.order.orderExchange.OrderExchange;

@Repository
public interface OrderExchangeRepository extends JpaRepository<OrderExchange, Long> {
  Optional<List<OrderExchange>> findByOrderId(Long orderId);
}
