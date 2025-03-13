package br.com.fatecmogidascruzes.ecommercelivroback.business.address.addressType;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Converter(autoApply = true)
public class AddressTypeConverter implements AttributeConverter<List<AddressType>, String> {
    
    @Override
    public String convertToDatabaseColumn(List<AddressType> addressTypes) {
        if (addressTypes == null || addressTypes.isEmpty()) {
            return null;
        }
        return addressTypes.stream()
            .map(addressType -> String.valueOf(addressType.getId()))
            .collect(Collectors.joining(","));
    }

    @Override
    public List<AddressType> convertToEntityAttribute(String ids) {
        if (ids == null || ids.isEmpty()) {
            return new ArrayList<>();
        }
        return Arrays.stream(ids.split(","))
            .map(Integer::parseInt)
            .map(AddressType::fromId)
            .collect(Collectors.toList());
    }
}
