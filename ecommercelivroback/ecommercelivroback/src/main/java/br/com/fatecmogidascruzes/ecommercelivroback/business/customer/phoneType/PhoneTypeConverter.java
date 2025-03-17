package br.com.fatecmogidascruzes.ecommercelivroback.business.customer.phoneType;

import jakarta.persistence.AttributeConverter;

public class PhoneTypeConverter implements AttributeConverter<String, Integer> {

    @Override
    public Integer convertToDatabaseColumn(String phoneType) {
        if (phoneType == null) {
            return null;
        }
        return PhoneType.valueOf(phoneType).getId();
    }

    @Override
    public String convertToEntityAttribute(Integer id) {
        if (id == null) {
            return null;
        }
        return PhoneType.fromId(id).name();
    }
}