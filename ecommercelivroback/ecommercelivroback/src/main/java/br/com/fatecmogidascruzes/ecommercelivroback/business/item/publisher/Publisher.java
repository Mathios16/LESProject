package br.com.fatecmogidascruzes.ecommercelivroback.business.item.publisher;

public enum Publisher {
  DARKSIDE(1),
  MARVEL(2),
  DC(3),
  HUFFPOST(4);

  private final int id;

  Publisher(int id) {
    this.id = id;
  }

  public int getId() {
    return id;
  }

  public static Publisher fromId(int id) {
    for (Publisher publisher : Publisher.values()) {
      if (publisher.getId() == id) {
        return publisher;
      }
    }
    throw new IllegalArgumentException("Id inválido: " + id);
  }
}
