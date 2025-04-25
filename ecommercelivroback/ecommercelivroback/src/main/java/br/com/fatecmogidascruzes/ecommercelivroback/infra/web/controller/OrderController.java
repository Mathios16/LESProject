package br.com.fatecmogidascruzes.ecommercelivroback.infra.web.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

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
import br.com.fatecmogidascruzes.ecommercelivroback.business.order.cupom.Cupom;
import br.com.fatecmogidascruzes.ecommercelivroback.business.order.orderExchange.OrderExchange;
import br.com.fatecmogidascruzes.ecommercelivroback.business.order.orderExchange.OrderExchangeItem;
import br.com.fatecmogidascruzes.ecommercelivroback.business.order.orderPayment.OrderPayment;
import br.com.fatecmogidascruzes.ecommercelivroback.business.order.orderReturn.OrderReturn;
import br.com.fatecmogidascruzes.ecommercelivroback.business.order.orderStatus.OrderStatus;
import br.com.fatecmogidascruzes.ecommercelivroback.infra.DTO.dataOrder;
import br.com.fatecmogidascruzes.ecommercelivroback.infra.DTO.dataOrderExchange;
import br.com.fatecmogidascruzes.ecommercelivroback.infra.DTO.dataOrderReturn;
import br.com.fatecmogidascruzes.ecommercelivroback.infra.persistence.AddressRepository;
import br.com.fatecmogidascruzes.ecommercelivroback.infra.persistence.CartItemRepository;
import br.com.fatecmogidascruzes.ecommercelivroback.infra.persistence.CartRepository;
import br.com.fatecmogidascruzes.ecommercelivroback.infra.persistence.CupomRepository;
import br.com.fatecmogidascruzes.ecommercelivroback.infra.persistence.OrderExchangeItemRepository;
import br.com.fatecmogidascruzes.ecommercelivroback.infra.persistence.OrderExchangeRepository;
import br.com.fatecmogidascruzes.ecommercelivroback.infra.persistence.OrderItemRepository;
import br.com.fatecmogidascruzes.ecommercelivroback.infra.persistence.OrderPaymentRepository;
import br.com.fatecmogidascruzes.ecommercelivroback.infra.persistence.OrderRepository;
import br.com.fatecmogidascruzes.ecommercelivroback.infra.persistence.OrderReturnRepository;

@RestController
@RequestMapping("/order")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private OrderPaymentRepository orderPaymentRepository;

    @Autowired
    private OrderReturnRepository orderReturnRepository;

    @Autowired
    private OrderExchangeRepository orderExchangeRepository;

    @Autowired
    private OrderExchangeItemRepository orderExchangeItemRepository;

    @Autowired
    private CupomRepository cupomRepository;

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
        order.setCustomerId(customerId);
        if (data != null && data.addressId() != null) {
            order.setAddressId(data.addressId());
            order.setAddress(addressRepository.findById(data.addressId()).get());
        } else {
            order.setAddress(cart.get().getAddress());
            order.setAddressId(cart.get().getAddressId());
        }

        List<OrderPayment> payments = new ArrayList<>();

        if (data != null && data.orderPayments() != null) {
            data.orderPayments().forEach(payment -> {
                OrderPayment orderPayment = new OrderPayment();
                orderPayment.setAmount(payment.getAmount());
                orderPayment.setPaymentMethodId(payment.getPaymentMethodId());
                payments.add(orderPayment);
            });
            order.setPayments(payments);
        }

        List<Cupom> cupoms = new ArrayList<>();

        if (data != null && data.cupoms() != null) {
            data.cupoms().forEach(cupom -> {
                Cupom cupomEntity = new Cupom();
                cupomEntity.setId(cupom.getId());
                cupomEntity.setCode(cupom.getCode());
                cupomEntity.setValue(cupom.getValue());
                cupomEntity.setExpirationDate(cupom.getExpirationDate());
                cupoms.add(cupomEntity);
            });
            order.setCupoms(cupoms);
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

        order.verifyPayment();

        Order saveOrder = new Order();

        BeanUtils.copyProperties(order, saveOrder, "items", "payments", "cupoms", "address", "customer");

        Order savedOrder = orderRepository.save(saveOrder);

        orderItems.forEach(orderItem -> {
            orderItem.setOrderId(savedOrder.getId());
        });
        orderItemRepository.saveAll(orderItems);
        payments.forEach(payment -> {
            payment.setOrderId(savedOrder.getId());
        });
        orderPaymentRepository.saveAll(payments);
        cupoms.forEach(cupom -> {
            cupom.setOrderId(savedOrder.getId());
        });
        cupomRepository.saveAll(cupoms);

        BeanUtils.copyProperties(order, savedOrder);
        return ResponseEntity.ok(dataOrder.fromOrder(savedOrder));
    }

    @PostMapping("/{orderId}/return")
    public ResponseEntity<?> returnOrder(@PathVariable Long orderId, dataOrderReturn data) {

        Optional<Order> existingOrder = orderRepository.findById(orderId);
        if (existingOrder.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Order updateOrder = new Order();
        updateOrder.setStatus(OrderStatus.RETURN_REQUESTED.name());

        BeanUtils.copyProperties(existingOrder, updateOrder, "address", "customer");

        orderRepository.save(updateOrder);

        OrderReturn orderReturn = new OrderReturn();
        orderReturn.setOrderId(orderId);
        orderReturn.setOrderItemsId(data.orderItemsId());

        OrderReturn savedReturn = orderReturnRepository.save(orderReturn);

        return ResponseEntity.ok(dataOrderReturn.fromReturn(savedReturn));
    }

    @PostMapping("/{orderId}/exchange")
    public ResponseEntity<?> exchangeOrder(@PathVariable Long orderId, dataOrderExchange data) {

        Optional<Order> existingOrder = orderRepository.findById(orderId);
        if (existingOrder.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Order updateOrder = new Order();
        updateOrder.setStatus(OrderStatus.EXCHANGE_REQUESTED.name());

        BeanUtils.copyProperties(existingOrder, updateOrder, "address", "customer");

        orderRepository.save(updateOrder);

        OrderExchange orderExchange = new OrderExchange();
        orderExchange.setOrderId(orderId);
        orderExchange.setOrderItemsId(data.orderItemsId());

        List<OrderExchangeItem> items = new ArrayList<>();

        data.items().forEach(item -> {
            OrderExchangeItem orderExchangeItem = new OrderExchangeItem();
            orderExchangeItem.setItemId(item.itemId());
            orderExchangeItem.setQuantity(item.quantity());
            orderExchangeItem.setPrice(item.price());
            items.add(orderExchangeItem);
        });

        orderExchange.setItems(items);

        OrderExchange savedExchange = orderExchangeRepository.save(orderExchange);

        items.forEach(item -> {
            item.setOrderExchangeId(savedExchange.getId());
        });

        orderExchangeItemRepository.saveAll(items);

        return ResponseEntity.ok(dataOrderExchange.fromExchange(savedExchange));
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

        orderRepository.save(updateOrder);

        return ResponseEntity.ok(updateOrder);
    }

    @GetMapping("/{customerId}")
    public ResponseEntity<?> getOrder(@PathVariable Long customerId) {
        return ResponseEntity
                .ok(orderRepository.findByCustomerId(customerId).stream().map(dataOrder::fromOrder).toList());
    }

    @GetMapping
    public ResponseEntity<List<?>> getOrders() {
        return ResponseEntity.ok(orderRepository.findAll().stream().map(dataOrder::fromOrder).toList());
    }
}
