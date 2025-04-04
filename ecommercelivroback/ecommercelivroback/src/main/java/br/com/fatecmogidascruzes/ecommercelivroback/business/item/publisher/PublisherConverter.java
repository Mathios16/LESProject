package br.com.fatecmogidascruzes.ecommercelivroback.business.item.publisher;

import jakarta.persistence.AttributeConverter;

public class PublisherConverter implements AttributeConverter<Publisher, String> {

  @Override
  public String convertToDatabaseColumn(Publisher publisher) {
    return publisher == null ? null : publisher.name();
  }

  @Override
  public Publisher convertToEntityAttribute(String name) {
    return name == null ? null : Publisher.valueOf(name);
  }
}
