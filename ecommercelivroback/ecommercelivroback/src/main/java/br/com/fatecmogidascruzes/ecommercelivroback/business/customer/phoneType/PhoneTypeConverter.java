package br.com.fatecmogidascruzes.ecommercelivroback.business.customer.phoneType;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class PhoneTypeConverter implements AttributeConverter<PhoneType, Integer> {

    @Override
    public Integer convertToDatabaseColumn(PhoneType phoneType) {
        if (phoneType == null) {
            return null;
        }
        return phoneType.getId();
    }

    @Override
    public PhoneType convertToEntityAttribute(Integer id) {
        if (id == null) {
            return null;
        }
        return PhoneType.fromId(id);
    }
}