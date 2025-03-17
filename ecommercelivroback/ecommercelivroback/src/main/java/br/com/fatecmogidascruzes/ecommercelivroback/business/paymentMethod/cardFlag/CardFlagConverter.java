package br.com.fatecmogidascruzes.ecommercelivroback.business.paymentMethod.cardFlag;

import jakarta.persistence.AttributeConverter;

public class CardFlagConverter implements AttributeConverter<String, Integer> {

    @Override
    public Integer convertToDatabaseColumn(String cardFlag) {
        if (cardFlag == null) {
            return null;
        }
        return CardFlag.valueOf(cardFlag).getId();
    }

    @Override
    public String convertToEntityAttribute(Integer id) {
        if (id == null) {
            return null;
        }
        return CardFlag.fromId(id).name();
    }
}
