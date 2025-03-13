package br.com.fatecmogidascruzes.ecommercelivroback.business.paymentMethod.cardFlag;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class CardFlagConverter implements AttributeConverter<CardFlag, Integer> {
    
    @Override
    public Integer convertToDatabaseColumn(CardFlag cardFlag) {
        if (cardFlag == null) {
            return null;
        }
        return cardFlag.getId();
    }

    @Override
    public CardFlag convertToEntityAttribute(Integer id) {
        if (id == null) {
            return null;
        }
        return CardFlag.fromId(id);
    }
}
