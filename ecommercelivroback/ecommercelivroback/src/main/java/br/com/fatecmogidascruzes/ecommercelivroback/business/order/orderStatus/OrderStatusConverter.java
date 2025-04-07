package br.com.fatecmogidascruzes.ecommercelivroback.business.order.orderStatus;

import jakarta.persistence.AttributeConverter;

public class OrderStatusConverter implements AttributeConverter<String, Integer> {

    @Override
    public Integer convertToDatabaseColumn(String status) {
        return status == null ? null : OrderStatus.valueOf(status).getId();
    }

    @Override
    public String convertToEntityAttribute(Integer id) {
        return id == null ? null : OrderStatus.fromId(id).name();
    }
}
