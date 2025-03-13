package br.com.fatecmogidascruzes.ecommercelivroback.business.paymentMethod.cardFlag;

public enum CardFlag {
    VISA(1),
    MASTERCARD(2),
    AMERICANEXPRESS(3);

    private final int id;

    CardFlag(int id) {
        this.id = id;
    }

    public int getId() {
        return id;
    }

    public static CardFlag fromId(int id) {
        for (CardFlag flag : CardFlag.values()) {
            if (flag.getId() == id) {
                return flag;
            }
        }
        throw new IllegalArgumentException("ID inválido: " + id);
    }
}
