package br.com.fatecmogidascruzes.ecommercelivroback.business.paymentMethod;

import java.sql.Timestamp;
import java.util.Calendar;

import br.com.fatecmogidascruzes.ecommercelivroback.business.paymentMethod.cardFlag.CardFlagConverter;
import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity(name = "paymentMethods")
public class PaymentMethod {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "pym_id")
    private Long id;

    @Column(name = "pym_primary", nullable = false)
    private boolean primary;

    @NotBlank(message = "cardNumber: Número do cartão não pode ser vazio")
    @Column(name = "pym_cardnumber", nullable = false)
    private String cardNumber;

    @NotBlank(message = "cardName: Nome do cartão não pode ser vazio")
    @Column(name = "pym_cardname", nullable = false)
    private String cardName;

    @NotNull(message = "cardExpiration: Data de expiração do cartão não pode ser vazia")
    @Column(name = "pym_cardexpiration", nullable = false)
    private String cardExpiration;

    @NotBlank(message = "cardCvv: CVV do cartão não pode ser vazio")
    @Column(name = "pym_cvv", nullable = false)
    private String cvv;

    @NotNull(message = "cardFlag: Bandeira do cartão não pode ser vazia")
    @Convert(converter = CardFlagConverter.class)
    @Column(name = "pym_cardflag", nullable = false)
    private String cardFlag;

    @Column(name = "pym_cst_id", nullable = false)
    private Long customer;

    public Timestamp getExpirationTimestamp() {
        try {
            // Formato esperado: "MM/YY"
            String[] parts = cardExpiration.split("/");
            if (parts.length != 2) {
                throw new IllegalArgumentException("Data de expiração inválida. Use o formato MM/YY");
            }

            int month = Integer.parseInt(parts[0]);
            int year = Integer.parseInt(parts[1]) + 2000; // Convertendo YY para YYYY

            // Validar mês e ano
            if (month < 1 || month > 12) {
                throw new IllegalArgumentException("Mês inválido");
            }
            if (year < 2000 || year > 2099) {
                throw new IllegalArgumentException("Ano inválido");
            }

            // Criar data do último dia do mês de expiração
            Calendar calendar = Calendar.getInstance();
            calendar.set(Calendar.YEAR, year);
            calendar.set(Calendar.MONTH, month - 1); // Calendar.MONTH é 0-based
            calendar.set(Calendar.DAY_OF_MONTH, calendar.getActualMaximum(Calendar.DAY_OF_MONTH));
            calendar.set(Calendar.HOUR_OF_DAY, 23);
            calendar.set(Calendar.MINUTE, 59);
            calendar.set(Calendar.SECOND, 59);
            calendar.set(Calendar.MILLISECOND, 999);

            return new Timestamp(calendar.getTimeInMillis());
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("Data de expiração inválida. Use o formato MM/YY");
        }
    }
}
