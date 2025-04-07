package br.com.fatecmogidascruzes.ecommercelivroback.business.item.pricingGroup;

import jakarta.persistence.AttributeConverter;

public class PricingGroupConverter implements AttributeConverter<String, Integer> {

  @Override
  public Integer convertToDatabaseColumn(String pricingGroup) {
    if (pricingGroup == null) {
      return null;
    }
    return PricingGroup.valueOf(pricingGroup).getId();
  }

  @Override
  public String convertToEntityAttribute(Integer id) {
    if (id == null) {
      return null;
    }
    return PricingGroup.fromId(id).name();
  }

}
