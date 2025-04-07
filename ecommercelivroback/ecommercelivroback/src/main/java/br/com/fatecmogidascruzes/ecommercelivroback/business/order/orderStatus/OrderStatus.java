package br.com.fatecmogidascruzes.ecommercelivroback.business.order.orderStatus;

public enum OrderStatus {
    PROCESSING(1),
    REPROVED(2),
    APPROVED(3),
    CANCELLED(4),
    IN_TRANSIT(5),
    DELIVERED(6);

    private final int id;

    OrderStatus(int id) {
        this.id = id;
    }

    public int getId() {
        return id;
    }

    public static OrderStatus fromId(int id) {
        for (OrderStatus status : values()) {
            if (status.getId() == id) {
                return status;
            }
        }
        throw new IllegalArgumentException("Status inválido: " + id);
    }
}
