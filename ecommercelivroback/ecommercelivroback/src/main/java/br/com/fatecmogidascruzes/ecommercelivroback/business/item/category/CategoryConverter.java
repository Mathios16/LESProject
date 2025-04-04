package br.com.fatecmogidascruzes.ecommercelivroback.business.item.category;

import jakarta.persistence.AttributeConverter;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

public class CategoryConverter implements AttributeConverter<List<String>, String> {

  @Override
  public String convertToDatabaseColumn(List<String> category) {
    if (category == null || category.isEmpty()) {
      return null;
    }
    return category.stream()
        .map(categoryType -> String.valueOf(Category.valueOf(categoryType).getId()))
        .collect(Collectors.joining(","));
  }

  @Override
  public List<String> convertToEntityAttribute(String ids) {
    if (ids == null || ids.isEmpty()) {
      return new ArrayList<>();
    }
    return Arrays.stream(ids.split(","))
        .map(Integer::parseInt)
        .map(Category::fromId)
        .map(Category::name)
        .collect(Collectors.toList());
  }

}
