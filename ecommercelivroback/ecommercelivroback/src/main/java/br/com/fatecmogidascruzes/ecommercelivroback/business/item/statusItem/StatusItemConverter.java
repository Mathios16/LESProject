package br.com.fatecmogidascruzes.ecommercelivroback.business.item.statusItem;

import jakarta.persistence.AttributeConverter;

public class StatusItemConverter implements AttributeConverter<String, Integer> {

    @Override
    public Integer convertToDatabaseColumn(String status) {
        return status == null ? null : StatusItem.valueOf(status).getId();
    }

    @Override
    public String convertToEntityAttribute(Integer id) {
        return id == null ? null : StatusItem.fromId(id).name();
    }
}