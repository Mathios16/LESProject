package br.com.fatecmogidascruzes.ecommercelivroback.business.item.category;

public enum Category {
  ACAO(1),
  FANTASIA(2),
  FICCAO_CIENTIFICA(3),
  ROMANCE(4);

  private final int id;

  Category(int id) {
    this.id = id;
  }

  public int getId() {
    return id;
  }

  public static Category fromId(int id) {
    for (Category category : Category.values()) {
      if (category.getId() == id) {
        return category;
      }
    }
    throw new IllegalArgumentException("Id inválido: " + id);
  }
}
