package br.com.fatecmogidascruzes.ecommercelivroback.business.item.pricingGroup;

public enum PricingGroup {
  A(1, 2),
  B(2, 4),
  C(3, 6),
  D(4, 8),
  E(5, 10);

  private final int id;
  private final int percentage;

  PricingGroup(int id, int percentage) {
    this.id = id;
    this.percentage = percentage;
  }

  public int getId() {
    return id;
  }

  public static PricingGroup fromId(int id) {
    for (PricingGroup pricingGroup : PricingGroup.values()) {
      if (pricingGroup.getId() == id) {
        return pricingGroup;
      }
    }
    throw new IllegalArgumentException("Id inválido: " + id);
  }

  public int getPercentage() {
    return percentage;
  }
}
