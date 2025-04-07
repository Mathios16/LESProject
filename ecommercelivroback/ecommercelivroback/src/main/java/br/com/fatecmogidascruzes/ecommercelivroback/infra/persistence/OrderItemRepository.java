package br.com.fatecmogidascruzes.ecommercelivroback.infra.persistence;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.com.fatecmogidascruzes.ecommercelivroback.business.order.OrderItem;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    public List<OrderItem> findByOrderId(Long orderId);
}
