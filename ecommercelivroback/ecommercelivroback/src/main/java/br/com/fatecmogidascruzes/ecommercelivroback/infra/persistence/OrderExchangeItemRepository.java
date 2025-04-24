package br.com.fatecmogidascruzes.ecommercelivroback.infra.persistence;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.com.fatecmogidascruzes.ecommercelivroback.business.order.orderExchange.OrderExchangeItem;

@Repository
public interface OrderExchangeItemRepository extends JpaRepository<OrderExchangeItem, Long> {
  List<OrderExchangeItem> findByOrderExchangeId(Long orderExchangeId);
}
