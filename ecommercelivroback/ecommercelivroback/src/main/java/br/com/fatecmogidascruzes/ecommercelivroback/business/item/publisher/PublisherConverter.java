package br.com.fatecmogidascruzes.ecommercelivroback.business.item.publisher;

import jakarta.persistence.AttributeConverter;

public class PublisherConverter implements AttributeConverter<String, Integer> {

  @Override
  public Integer convertToDatabaseColumn(String publisher) {
    return publisher == null ? null : Publisher.valueOf(publisher).getId();
  }

  @Override
  public String convertToEntityAttribute(Integer id) {
    return id == null ? null : Publisher.fromId(id).name();
  }
}
