package br.com.fatecmogidascruzes.ecommercelivroback.business.address.addressType;

public enum AddressType {
    ENTREGA(1),
    COBRANCA(2),
    RESIDENCIAL(3);

    private final int id;

    AddressType(int id) {
        this.id = id;
    }

    public int getId() {
        return id;
    }

    public static AddressType fromId(int id) {
        for (AddressType type : AddressType.values()) {
            if (type.getId() == id) {
                return type;
            }
        }
        throw new IllegalArgumentException("ID inválido: " + id);
    }
}
