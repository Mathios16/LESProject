package br.com.fatecmogidascruzes.ecommercelivroback.business.item.statusItem;

public enum StatusItem {
    AVAILABLE(1),
    UNAVAILABLE(2);

    private final int id;

    StatusItem(int id) {
        this.id = id;
    }

    public int getId() {
        return id;
    }

    public static StatusItem fromId(int id) {
        for (StatusItem status : values()) {
            if (status.getId() == id) {
                return status;
            }
        }
        throw new IllegalArgumentException("Status inválido: " + id);
    }
}
