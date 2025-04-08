package br.com.fatecmogidascruzes.ecommercelivroback.infra.web.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.apache.catalina.mapper.Mapper;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.ObjectMapper;

import br.com.fatecmogidascruzes.ecommercelivroback.business.order.Order;
import br.com.fatecmogidascruzes.ecommercelivroback.business.order.OrderItem;
import br.com.fatecmogidascruzes.ecommercelivroback.business.order.cart.Cart;
import br.com.fatecmogidascruzes.ecommercelivroback.business.order.cart.CartItem;
import br.com.fatecmogidascruzes.ecommercelivroback.business.order.orderPayment.OrderPayment;
import br.com.fatecmogidascruzes.ecommercelivroback.infra.DTO.dataCartItem;
import br.com.fatecmogidascruzes.ecommercelivroback.infra.DTO.dataOrder;
import br.com.fatecmogidascruzes.ecommercelivroback.infra.DTO.dataOrderItem;
import br.com.fatecmogidascruzes.ecommercelivroback.infra.persistence.CartItemRepository;
import br.com.fatecmogidascruzes.ecommercelivroback.infra.persistence.CartRepository;
import br.com.fatecmogidascruzes.ecommercelivroback.infra.persistence.OrderItemRepository;
import br.com.fatecmogidascruzes.ecommercelivroback.infra.persistence.OrderRepository;

@RestController
@RequestMapping("/order")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @PostMapping("/{customerId}")
    public ResponseEntity<?> createOrder(@PathVariable Long customerId, @RequestBody dataOrder data) {
        Optional<Cart> cart = cartRepository.findByCustomerId(customerId);
        if (cart.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        List<CartItem> items = cartItemRepository.findByCartId(cart.get().getId());

        if (items.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Order order = new Order();
        // order.setCustomerId(customerId);
        order.setAddressId(cart.get().getAddressId());
        order.setAddress(cart.get().getAddress());

        if (data != null && data.orderPayments() != null) {
            List<OrderPayment> payments = new ArrayList<>();

            data.orderPayments().forEach(payment -> {
                OrderPayment orderPayment = new OrderPayment();
                orderPayment.setAmount(payment.getAmount());
                orderPayment.setPaymentMethodId(payment.getPaymentMethodId());
                // orderPayment.setOrderId(order.getId());
                payments.add(orderPayment);
            });
            order.setPayments(payments);
        }

        List<OrderItem> orderItems = new ArrayList<>();

        items.forEach(item -> {
            OrderItem orderItem = new OrderItem();
            orderItem.setItemId(item.getItemId());
            orderItem.setQuantity(item.getQuantity());
            orderItem.setPrice(item.getPrice());
            orderItems.add(orderItem);
        });

        order.setItems(orderItems);

        try {
            ObjectMapper mapper = new ObjectMapper();
            String jsonString = mapper.writeValueAsString(order);
            System.out.println(jsonString);
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }

        return ResponseEntity.ok(dataOrder.fromOrder(order));
    }

    @PutMapping("/{orderId}")
    public ResponseEntity<?> updateOrder(@PathVariable Long orderId, dataOrder data) {

        Optional<Order> existingOrder = orderRepository.findById(orderId);
        if (existingOrder.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Order updateOrder = new Order();
        updateOrder.setAddressId(data.addressId());
        updateOrder.setStatus(data.status());
        updateOrder.setPayments(data.orderPayments());
        updateOrder.setCupoms(data.cupoms());

        BeanUtils.copyProperties(existingOrder, updateOrder, "address", "customer");

        try {
            ObjectMapper mapper = new ObjectMapper();
            String jsonString = mapper.writeValueAsString(updateOrder);
            System.out.println(jsonString);
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }

        return ResponseEntity.ok(dataOrder.fromOrder(updateOrder));
    }

    @GetMapping("/{customerId}")
    public ResponseEntity<?> getOrder(@PathVariable Long customerId) {
        return ResponseEntity.ok(orderRepository.findByCustomerId(customerId));
    }

    @GetMapping
    public ResponseEntity<List<?>> getOrders() {
        return ResponseEntity.ok(orderRepository.findAll());
    }
}
