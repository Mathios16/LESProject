package br.com.fatecmogidascruzes.ecommercelivroback.business.order.orderStatus;

public enum OrderStatus {
    PROCESSING(1),
    REPROVED(2),
    APPROVED(3),
    CANCELLED(4),
    IN_TRANSIT(5),
    DELIVERED(6),
    EXCHANGE_REQUESTED(7),
    EXCHANGE_APPROVED(8),
    EXCHANGE_REFUSED(9),
    EXCHANGE_COMPLETED(10),
    RETURN_REQUESTED(11),
    RETURN_APPROVED(12),
    RETURN_REFUSED(13),
    RETURN_COMPLETED(14);

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
