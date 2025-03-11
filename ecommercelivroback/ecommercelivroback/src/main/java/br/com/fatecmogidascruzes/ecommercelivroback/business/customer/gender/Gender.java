package br.com.fatecmogidascruzes.ecommercelivroback.business.customer.gender;

public enum Gender {
    MASCULINO(1),
    FEMININO(2),
    OUTRO(3);

    private final int id;

    Gender(int id) {
        this.id = id;
    }

    public int getId() {
        return id;
    }

    public static Gender fromId(int id) {
        for (Gender gender : Gender.values()) {
            if (gender.getId() == id) {
                return gender;
            }
        }
        throw new IllegalArgumentException("Id inválido: " + id);
    }
}
