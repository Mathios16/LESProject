package br.com.fatecmogidascruzes.ecommercelivroback.infra.persistence;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.fatecmogidascruzes.ecommercelivroback.business.order.orderReturn.OrderReturnItem;

public interface OrderReturnItemRepository extends JpaRepository<OrderReturnItem, Long> {

  List<OrderReturnItem> findByOrderReturnId(Long orderReturnId);
}
