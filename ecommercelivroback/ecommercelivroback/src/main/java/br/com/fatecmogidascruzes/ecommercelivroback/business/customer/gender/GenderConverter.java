package br.com.fatecmogidascruzes.ecommercelivroback.business.customer.gender;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class GenderConverter implements AttributeConverter<Gender, Integer> {

    @Override
    public Integer convertToDatabaseColumn(Gender gender) {
        if (gender == null) {
            return null;
        }
        return gender.getId();
    }

    @Override
    public Gender convertToEntityAttribute(Integer id) {
        if (id == null) {
            return null;
        }
        return Gender.fromId(id);
    }
}