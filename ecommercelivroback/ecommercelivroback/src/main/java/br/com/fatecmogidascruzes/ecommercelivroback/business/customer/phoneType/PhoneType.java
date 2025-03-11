package br.com.fatecmogidascruzes.ecommercelivroback.business.customer.phoneType;

public enum PhoneType {
    FIXO(1),
    CELULAR(2);

    private final int id;

    PhoneType(int id) {
        this.id = id;
    }

    public int getId() {
        return id;
    }

    public static PhoneType fromId(int id) {
        for (PhoneType type : PhoneType.values()) {
            if (type.getId() == id) {
                return type;
            }
        }
        throw new IllegalArgumentException("ID inválido: " + id);
    }
}
