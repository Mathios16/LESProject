package br.com.fatecmogidascruzes.ecommercelivroback.business.paymentMethod;

import java.sql.Timestamp;

import br.com.fatecmogidascruzes.ecommercelivroback.business.paymentMethod.cardFlag.CardFlag;
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
@Entity(name="paymentMethods")
public class PaymentMethod {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "pym_id")
    private int id;

    @NotBlank(message = "cardNumber: Número do cartão não pode ser vazio")
    @Column(name = "pym_cardnumber", nullable = false)
    private String cardNumber;

    @NotBlank(message = "cardName: Nome do cartão não pode ser vazio")
    @Column(name = "pym_cardname", nullable = false)
    private String cardName;

    @NotNull(message = "cardExpiration: Data de expiração do cartão não pode ser vazia")
    @Column(name = "pym_cardexpiration", nullable = false)
    private Timestamp cardExpiration;

    @NotBlank(message = "cardCvv: CVV do cartão não pode ser vazio")
    @Column(name = "pym_cvv", nullable = false)
    private String cardCvv;
    
    @NotNull(message = "cardFlag: Bandeira do cartão não pode ser vazia")
    @Convert(converter = CardFlagConverter.class)
    @Column(name = "pym_cardflag", nullable = false)
    private CardFlag cardFlag;

    @Column(name = "pym_cst_id")
    private int customer;

    public void setCardFlag(int cardFlag) {
        this.cardFlag = CardFlag.fromId(cardFlag);
    }
}
