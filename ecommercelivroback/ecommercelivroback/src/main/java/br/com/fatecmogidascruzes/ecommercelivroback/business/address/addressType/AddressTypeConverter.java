package br.com.fatecmogidascruzes.ecommercelivroback.business.address.addressType;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class AddressTypeConverter implements AttributeConverter<AddressType, Integer> {
    
    @Override
    public Integer convertToDatabaseColumn(AddressType addressType) {
        if (addressType == null) {
            return null;
        }
        return addressType.getId();
    }

    @Override
    public AddressType convertToEntityAttribute(Integer id) {
        if (id == null) {
            return null;
        }
        return AddressType.fromId(id);
    }
}
