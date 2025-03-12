package br.com.fatecmogidascruzes.ecommercelivroback.business.address.streetType;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class StreetTypeConverter implements AttributeConverter<StreetType, Integer> {
    
    @Override
    public Integer convertToDatabaseColumn(StreetType streetType) {
        if (streetType == null) {
            return null;
        }
        return streetType.getId();
    }

    @Override
    public StreetType convertToEntityAttribute(Integer id) {
        if (id == null) {
            return null;
        }
        return StreetType.fromId(id);
    }

}
