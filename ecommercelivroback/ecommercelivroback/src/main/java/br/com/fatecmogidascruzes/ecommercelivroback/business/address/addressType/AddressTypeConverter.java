package br.com.fatecmogidascruzes.ecommercelivroback.business.address.addressType;

import jakarta.persistence.AttributeConverter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

public class AddressTypeConverter implements AttributeConverter<List<String>, String> {

    @Override
    public String convertToDatabaseColumn(List<String> addressTypes) {
        if (addressTypes == null || addressTypes.isEmpty()) {
            return null;
        }
        return addressTypes.stream()
                .map(addressType -> String.valueOf(AddressType.valueOf(addressType).getId()))
                .collect(Collectors.joining(","));
    }

    @Override
    public List<String> convertToEntityAttribute(String ids) {
        if (ids == null || ids.isEmpty()) {
            return new ArrayList<>();
        }
        return Arrays.stream(ids.split(","))
                .map(Integer::parseInt)
                .map(AddressType::fromId)
                .map(AddressType::name)
                .collect(Collectors.toList());
    }
}
