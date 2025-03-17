package br.com.fatecmogidascruzes.ecommercelivroback.business.customer.gender;

import jakarta.persistence.AttributeConverter;

public class GenderConverter implements AttributeConverter<String, Integer> {

    @Override
    public Integer convertToDatabaseColumn(String gender) {
        if (gender == null) {
            return null;
        }
        return Gender.valueOf(gender).getId();
    }

    @Override
    public String convertToEntityAttribute(Integer id) {
        if (id == null) {
            return null;
        }
        return Gender.fromId(id).name();
    }
}