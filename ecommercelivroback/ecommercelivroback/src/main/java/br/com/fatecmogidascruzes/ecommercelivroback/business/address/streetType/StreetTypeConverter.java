package br.com.fatecmogidascruzes.ecommercelivroback.business.address.streetType;

import jakarta.persistence.AttributeConverter;

public class StreetTypeConverter implements AttributeConverter<String, Integer> {

    @Override
    public Integer convertToDatabaseColumn(String streetType) {
        if (streetType == null) {
            return null;
        }
        return StreetType.valueOf(streetType).getId();
    }

    @Override
    public String convertToEntityAttribute(Integer id) {
        if (id == null) {
            return null;
        }
        return StreetType.fromId(id).name();
    }

}
