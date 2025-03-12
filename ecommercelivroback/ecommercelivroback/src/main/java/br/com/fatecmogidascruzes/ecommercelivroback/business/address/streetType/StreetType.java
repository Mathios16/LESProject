package br.com.fatecmogidascruzes.ecommercelivroback.business.address.streetType;

public enum StreetType {
    RUA(1),
    AVENIDA(2),
    CONDOMINIO(3),
    PRACA(4),
    ESTRADA(5);

    private final int id;

    StreetType(int id) {
        this.id = id;
    }

    public int getId() {
        return id;
    }

    public static StreetType fromId(int id) {
        for (StreetType type : StreetType.values()) {
            if (type.getId() == id) {
                return type;
            }
        }
        throw new IllegalArgumentException("ID inválido: " + id);
    }
}
