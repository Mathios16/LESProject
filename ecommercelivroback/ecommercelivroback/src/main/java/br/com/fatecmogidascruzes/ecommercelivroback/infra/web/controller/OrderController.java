package br.com.fatecmogidascruzes.ecommercelivroback.infra.web.controller;

import java.sql.Timestamp;
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

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import br.com.fatecmogidascruzes.ecommercelivroback.business.customer.Customer;
import br.com.fatecmogidascruzes.ecommercelivroback.business.item.Item;
import br.com.fatecmogidascruzes.ecommercelivroback.business.item.Item;
import br.com.fatecmogidascruzes.ecommercelivroback.business.order.Order;
import br.com.fatecmogidascruzes.ecommercelivroback.business.order.OrderItem;
import br.com.fatecmogidascruzes.ecommercelivroback.business.order.cart.Cart;
import br.com.fatecmogidascruzes.ecommercelivroback.business.order.cart.CartItem;
import br.com.fatecmogidascruzes.ecommercelivroback.business.order.cupom.Cupom;
import br.com.fatecmogidascruzes.ecommercelivroback.business.order.orderExchange.OrderExchange;
import br.com.fatecmogidascruzes.ecommercelivroback.business.order.orderExchange.OrderExchangeItem;
import br.com.fatecmogidascruzes.ecommercelivroback.business.order.orderPayment.OrderPayment;
import br.com.fatecmogidascruzes.ecommercelivroback.business.order.orderReturn.OrderReturn;
import br.com.fatecmogidascruzes.ecommercelivroback.business.order.orderReturn.OrderReturnItem;
import br.com.fatecmogidascruzes.ecommercelivroback.business.order.orderStatus.OrderStatus;
import br.com.fatecmogidascruzes.ecommercelivroback.infra.DTO.dataOrder;
import br.com.fatecmogidascruzes.ecommercelivroback.infra.DTO.dataOrderExchange;
import br.com.fatecmogidascruzes.ecommercelivroback.infra.DTO.dataOrderReturn;
import br.com.fatecmogidascruzes.ecommercelivroback.infra.persistence.AddressRepository;
import br.com.fatecmogidascruzes.ecommercelivroback.infra.persistence.CartItemRepository;
import br.com.fatecmogidascruzes.ecommercelivroback.infra.persistence.CartRepository;
import br.com.fatecmogidascruzes.ecommercelivroback.infra.persistence.CupomRepository;
import br.com.fatecmogidascruzes.ecommercelivroback.infra.persistence.CustomerRepository;
import br.com.fatecmogidascruzes.ecommercelivroback.infra.persistence.ItemRepository;
import br.com.fatecmogidascruzes.ecommercelivroback.infra.persistence.OrderExchangeItemRepository;
import br.com.fatecmogidascruzes.ecommercelivroback.infra.persistence.OrderExchangeRepository;
import br.com.fatecmogidascruzes.ecommercelivroback.infra.persistence.OrderItemRepository;
import br.com.fatecmogidascruzes.ecommercelivroback.infra.persistence.OrderPaymentRepository;
import br.com.fatecmogidascruzes.ecommercelivroback.infra.persistence.OrderRepository;
import br.com.fatecmogidascruzes.ecommercelivroback.infra.persistence.OrderReturnItemRepository;
import br.com.fatecmogidascruzes.ecommercelivroback.infra.persistence.OrderReturnRepository;

@RestController
@RequestMapping("/order")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private CustomerRepository customerRepository;

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
    private OrderReturnItemRepository orderReturnItemRepository;

    @Autowired
    private OrderExchangeRepository orderExchangeRepository;

    @Autowired
    private OrderExchangeItemRepository orderExchangeItemRepository;

    @Autowired
    private CupomRepository cupomRepository;

    @Autowired
    private ItemRepository itemRepository;

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

        Optional<Customer> customer = customerRepository.findById(customerId);
        if (customer.isPresent()) {
            order.setCustomer(customer.get());
        } else {
            return ResponseEntity.notFound().build();
        }

        if (data != null && data.addressId() != null) {
            order.setAddressId(data.addressId());
            order.setAddress(addressRepository.findById(data.addressId()).get());
        } else {
            order.setAddress(cart.get().getAddress());
            order.setAddressId(cart.get().getAddressId());
        }

        order.setDate(new Timestamp(System.currentTimeMillis()));

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

        items.forEach(cartItem -> {
            Optional<Item> itemEntityOpt = itemRepository.findById(cartItem.getItemId());
            if (itemEntityOpt.isEmpty())
                return;
            Item actualItem = itemEntityOpt.get();

            OrderItem orderItem = new OrderItem();
            orderItem.setItem(actualItem);
            orderItem.setItemId(actualItem.getId());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setPrice(actualItem.getPrice());
            orderItems.add(orderItem);
        });

        order.setItems(orderItems);

        Optional<Cupom> remainingCoupon = order.verifyPayment();

        if (remainingCoupon.isPresent()) {
            cupomRepository.save(remainingCoupon.get());
            order.setCupomId(remainingCoupon.get().getId());
        }

        Order savedOrder = orderRepository.save(order);

        orderItems.forEach(orderItem -> {
            orderItem.setOrderId(savedOrder.getId());
        });
        orderItemRepository.saveAll(orderItems);
        payments.forEach(payment -> {
            payment.setOrderId(savedOrder.getId());
        });
        orderPaymentRepository.saveAll(payments);

        return ResponseEntity.ok(dataOrder.fromOrder(savedOrder));
    }

    @PostMapping("/{orderId}/return")
    public ResponseEntity<?> returnOrder(@PathVariable Long orderId, @RequestBody dataOrderReturn data) {

        Optional<Order> existingOrder = orderRepository.findById(orderId);
        if (existingOrder.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Order updateOrder = existingOrder.get();
        updateOrder.setStatus(OrderStatus.RETURN_REQUESTED.name());
        orderRepository.save(updateOrder);

        OrderReturn orderReturn = new OrderReturn();
        orderReturn.setOrderId(orderId);

        List<OrderReturnItem> orderReturnItems = new ArrayList<>(data.orderReturnItems());

        Cupom returnCupom = new Cupom();
        returnCupom.setValue(data.value());
        returnCupom.setExpirationDate(new Timestamp(System.currentTimeMillis() + 3600000));
        returnCupom.setCode("RETURN" + orderId);
        Cupom savedCupom = cupomRepository.save(returnCupom);

        orderReturn.setCupomId(savedCupom.getId());

        OrderReturn savedOrderReturn = orderReturnRepository.save(orderReturn);

        for (OrderReturnItem item : orderReturnItems) {
            item.setOrderReturnId(savedOrderReturn.getId());
        }
        orderReturnItemRepository.saveAll(orderReturnItems);

        savedOrderReturn.setOrderReturnItems(orderReturnItems);

        return ResponseEntity.ok(dataOrderReturn.fromReturn(savedOrderReturn));
    }

    @GetMapping("/{orderId}/return")
    public ResponseEntity<?> getReturnCupom(@PathVariable Long orderId) {
        Optional<List<OrderReturn>> existingOrder = orderReturnRepository.findByOrderId(orderId);
        if (existingOrder.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        List<OrderReturn> orders = existingOrder.get();

        return ResponseEntity.ok(orders.stream().map(dataOrderReturn::fromReturn).toList());
    }

    @PostMapping("/{orderId}/exchange")
    public ResponseEntity<?> exchangeOrder(@PathVariable Long orderId, @RequestBody dataOrderExchange data) {

        Optional<Order> existingOrder = orderRepository.findById(orderId);
        if (existingOrder.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Optional<Cart> existingCart = cartRepository.findByCustomerId(existingOrder.get().getCustomerId());
        if (existingCart.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        List<CartItem> orderItems = cartItemRepository.findByCartId(existingCart.get().getId());
        if (orderItems.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Order updateOrder = existingOrder.get();
        updateOrder.setStatus(OrderStatus.EXCHANGE_REQUESTED.name());

        orderRepository.save(updateOrder);

        OrderExchange orderExchange = new OrderExchange();
        orderExchange.setOrderId(orderId);
        orderExchange.setOrderItems(data.orderItems());
        orderExchange.setAddressId(data.addressId());

        List<OrderExchangeItem> items = new ArrayList<>();

        data.items().forEach(item -> {
            Optional<Item> itemEntityOpt = itemRepository.findById(item.itemId());
            if (itemEntityOpt.isEmpty())
                return;
            Item actualItem = itemEntityOpt.get();

            OrderExchangeItem orderExchangeItem = new OrderExchangeItem();
            orderExchangeItem.setItem(actualItem);
            orderExchangeItem.setItemId(item.itemId());
            orderExchangeItem.setQuantity(item.quantity());
            orderExchangeItem.setPrice(item.price());
            items.add(orderExchangeItem);
        });

        List<OrderPayment> payments = new ArrayList<>();

        data.orderPayments().forEach(payment -> {
            OrderPayment orderPayment = new OrderPayment();
            orderPayment.setAmount(payment.getAmount());
            payments.add(orderPayment);
        });

        orderExchange.setItems(items);
        orderExchange.setPayments(payments);

        if (data.value() != null && data.value() > 0) {
            Cupom exchangeCupom = new Cupom();
            exchangeCupom.setValue(data.value());
            exchangeCupom.setExpirationDate(new Timestamp(System.currentTimeMillis() + 3600000));
            exchangeCupom.setCode("EXCHANGE" + orderId);
            Cupom savedCupom = cupomRepository.save(exchangeCupom);

            orderExchange.setCupomId(savedCupom.getId());
            orderExchange.setCupom(savedCupom);
        }

        OrderExchange savedExchange = orderExchangeRepository.save(orderExchange);

        items.forEach(item -> {
            item.setOrderExchangeId(savedExchange.getId());
        });

        payments.forEach(payment -> {
            payment.setOrderExchangeId(savedExchange.getId());
        });

        orderExchangeItemRepository.saveAll(items);
        orderPaymentRepository.saveAll(payments);

        return ResponseEntity.ok(dataOrderExchange.fromExchange(savedExchange));
    }

    @GetMapping("/{orderId}/exchange")
    public ResponseEntity<?> getExchangeCupom(@PathVariable Long orderId) {
        Optional<List<OrderExchange>> existingOrder = orderExchangeRepository.findByOrderId(orderId);
        if (existingOrder.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        List<OrderExchange> orders = existingOrder.get();
        return ResponseEntity.ok(orders.stream().map(dataOrderExchange::fromExchange).toList());
    }

    @PutMapping("/{orderId}")
    public ResponseEntity<?> updateOrder(@PathVariable Long orderId, @RequestBody dataOrder data) {

        Optional<Order> existingOrder = orderRepository.findById(orderId);
        if (existingOrder.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Order updateOrder = existingOrder.get();
        if (data.addressId() != null) {
            updateOrder.setAddressId(data.addressId());
        }
        if (data.status() != null) {
            updateOrder.setStatus(data.status());
        }
        if (data.orderPayments() != null) {
            updateOrder.setPayments(data.orderPayments());
        }
        if (data.cupoms() != null) {
            updateOrder.setCupoms(data.cupoms());
        }

        orderRepository.save(updateOrder);

        return ResponseEntity.ok(dataOrder.fromOrder(updateOrder));
    }

    @GetMapping("/{entityId}/{entity}")
    public ResponseEntity<List<?>> getOrder(@PathVariable Long entityId, @PathVariable String entity) {
        return entity.equals("customer")
                ? ResponseEntity
                        .ok(orderRepository.findByCustomerId(entityId).stream().map(dataOrder::fromOrder).toList())
                : ResponseEntity.ok(orderRepository.findById(entityId).stream().map(dataOrder::fromOrder).toList());
    }

    @GetMapping
    public ResponseEntity<List<?>> getOrders() {
        return ResponseEntity.ok(orderRepository.findAll().stream().map(dataOrder::fromOrder).toList());
    }
}
