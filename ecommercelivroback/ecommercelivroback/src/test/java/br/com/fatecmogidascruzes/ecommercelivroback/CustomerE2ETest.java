package br.com.fatecmogidascruzes.ecommercelivroback;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.openqa.selenium.Alert;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

import java.time.Duration;
import java.util.logging.Logger;
import java.util.concurrent.CountDownLatch;

@SpringBootTest
@TestPropertySource(properties = {
        "spring.datasource.url=jdbc:mysql://localhost:3306/ecommercelivro_test?createDatabaseIfNotExist=true",
        "spring.datasource.username=root",
        "spring.datasource.password=root",
        "spring.jpa.hibernate.ddl-auto=create-drop"
})
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class CustomerE2ETest {
    private WebDriver driver;
    private WebDriverWait wait;
    private final String BASE_URL = "http://localhost:5173";
    private final String TEST_CPF = "123.456.789-00";
    private final String TEST_CPF_EDIT = "987.654.321-01";
    private static final Logger logger = Logger.getLogger(CustomerE2ETest.class.getName());

    // Static latches to ensure sequential test execution
    private static final CountDownLatch[] latches = new CountDownLatch[4];

    static {
        for (int i = 0; i < latches.length; i++) {
            latches[i] = new CountDownLatch(1);
        }
    }

    @BeforeEach
    void setUp() {
        driver = new ChromeDriver();
        wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        driver.manage().window().maximize();
    }

    @Test
    @Order(1)
    void shouldCreateCustomer() {
        driver.get(BASE_URL + "/clientes/criar");

        fillInputById("name", "João");
        fillInputById("lastname", "Silva");
        fillInputById("document", "123.456.789-00");
        fillInputById("email", "joao.silva@test.com");
        fillInputById("password", "Test@123");
        fillInputById("confirmPassword", "Test@123");
        fillInputById("birthdate", "01/01/2000");

        selectOptionById("gender", "MASCULINO");

        fillInputById("phone", "11987654321");

        clickButtonById("create-address");
        fillAddressForm("0", "0", "1", "Rua A", "123", "Apto 1", "Centro", "São Paulo", "SP", "Brasil", "01234-567");

        clickButtonById("create-address");
        fillAddressForm("0", "1", "0", "Rua B", "456", "", "Jardim", "São Paulo",
                "SP", "Brasil", "04567-890");

        clickButtonById("create-address");
        fillAddressForm("1", "0", "0", "Rua C", "789", "", "Vila", "São Paulo", "SP",
                "Brasil", "06789-012");

        WebElement addressList = wait.until(ExpectedConditions.presenceOfElementLocated(By.className("addresses")));
        assertTrue(addressList.getText().contains("Rua A"));
        assertTrue(addressList.getText().contains("Residencial"));

        assertTrue(addressList.getText().contains("Rua B"));
        assertTrue(addressList.getText().contains("Entrega"));

        assertTrue(addressList.getText().contains("Rua C"));
        assertTrue(addressList.getText().contains("Cobrança"));

        clickButtonById("create-payment");
        fillPaymentForm("1", "4111111111111111", "João Silva", "12/30", "123",
                "VISA");

        WebElement paymentList = wait
                .until(ExpectedConditions.presenceOfElementLocated(By.className("paymentMethods")));
        assertTrue(paymentList.getText().contains("João Silva"));
        assertTrue(paymentList.getText().contains("**** **** **** 1111"));

        WebElement submitButton = wait
                .until(ExpectedConditions.elementToBeClickable(By.cssSelector("button[type='submit']")));
        submitButton.click();

        WebElement successMessage = wait
                .until(ExpectedConditions.presenceOfElementLocated(By.className("alert-success")));
        assertTrue(successMessage.getText().contains("Cliente criado com sucesso!"));

    }

    @Test
    @Order(2)
    void shouldListAndFilterCustomers() throws InterruptedException {
        driver.get(BASE_URL + "/clientes");

        wait.until(ExpectedConditions.presenceOfElementLocated(By.className("table-container")));

        fillInputById("searchDocument", "123.456.789-00");

        WebElement customerRows = wait
                .until(ExpectedConditions.presenceOfElementLocated(By.className("table-container")));
        assertTrue(customerRows.getText().contains("João Silva"));
        assertTrue(customerRows.getText().contains("(11) 98765-4321"));
        assertTrue(customerRows.getText().contains("123.456.789-00"));
        assertTrue(customerRows.getText().contains("joao.silva@test.com"));
    }

    @Test
    @Order(3)
    void shouldEditCustomer() throws InterruptedException {
        driver.get(BASE_URL + "/clientes");

        fillInputById("searchName", "João");

        wait.until(ExpectedConditions.presenceOfElementLocated(By.className("table-container")));

        clickButtonByClass("edit");

        fillInputById("name", "");
        fillInputById("name", "João Editado");

        fillInputById("document", "");
        fillInputById("document", "987.654.321-01");

        clickButtonById("save-button");

        WebElement successMessage = wait
                .until(ExpectedConditions.presenceOfElementLocated(By.className("alert-success")));
        assertTrue(successMessage.getText().contains("Cliente atualizado com sucesso!"));

        driver.get(BASE_URL + "/clientes");

        WebElement customerRows = wait
                .until(ExpectedConditions.presenceOfElementLocated(By.className("table-container")));
        assertTrue(customerRows.getText().contains("João Editado"));
        assertTrue(customerRows.getText().contains("(11) 98765-4321"));
        assertTrue(customerRows.getText().contains("987.654.321-01"));
        assertTrue(customerRows.getText().contains("joao.silva@test.com"));
    }

    @Test
    @Order(4)
    void shouldDeleteCustomer() {
        driver.get(BASE_URL + "/clientes");

        wait.until(ExpectedConditions.presenceOfElementLocated(By.className("table-container")));

        clickButtonByClass("delete");

        Alert alert = wait.until(ExpectedConditions.alertIsPresent());
        alert.accept();
    }

    private void fillInputById(String id, String value) {
        try {
            WebElement input = wait.until(ExpectedConditions.presenceOfElementLocated(By.id(id)));
            input.clear();
            input.sendKeys(value);
            logger.info(String.format("Preenchido campo %s com valor: %s", id, value));
        } catch (Exception e) {
            logger.severe(String.format("Erro ao preencher campo %s: %s", id, e.getMessage()));
            throw e;
        }
    }

    private void selectOptionById(String id, String value) {
        try {
            WebElement select = wait.until(ExpectedConditions.presenceOfElementLocated(By.id(id)));
            select.findElement(By.cssSelector("option[value='" + value + "']")).click();
            logger.info(String.format("Selecionada opção %s no campo %s", value, id));
        } catch (Exception e) {
            logger.severe(String.format("Erro ao selecionar opção %s no campo %s: %s", value, id, e.getMessage()));
            throw e;
        }
    }

    private void clickButtonById(String id) {
        try {
            WebElement button = wait.until(ExpectedConditions.elementToBeClickable(By.id(id)));
            button.click();
            logger.info(String.format("Clicado botão %s", id));
        } catch (Exception e) {
            logger.severe(String.format("Erro ao clicar no botão %s: %s", id, e.getMessage()));
            throw e;
        }
    }

    private void clickButtonByClass(String className) {
        try {
            WebElement button = wait.until(ExpectedConditions.elementToBeClickable(By.className(className)));
            button.click();
            logger.info(String.format("Clicado botão %s", className));
        } catch (Exception e) {
            logger.severe(String.format("Erro ao clicar no botão %s: %s", className, e.getMessage()));
            throw e;
        }
    }

    private void setCheckboxById(String id, String value) {
        try {
            WebElement checkbox = wait.until(ExpectedConditions.presenceOfElementLocated(By.id(id)));
            boolean isChecked = checkbox.isSelected();
            boolean shouldBeChecked = value.equals("1");

            if (isChecked != shouldBeChecked) {
                checkbox.click();
            }

            logger.info(String.format("Checkbox %s definido como %s", id, shouldBeChecked ? "marcado" : "desmarcado"));
        } catch (Exception e) {
            logger.severe(String.format("Erro ao definir checkbox %s: %s", id, e.getMessage()));
            throw e;
        }
    }

    private void fillAddressForm(String billing, String delivery, String residence, String street, String number,
            String complement, String neighborhood, String city, String state, String country, String zipcode) {
        try {
            fillInputById("zip", zipcode);

            fillInputById("street", street);
            fillInputById("number", number);
            fillInputById("complement", complement);
            fillInputById("neighborhood", neighborhood);
            fillInputById("city", city);
            fillInputById("state", state);
            fillInputById("country", country);

            setCheckboxById("billing", billing);
            setCheckboxById("delivery", delivery);
            setCheckboxById("residence", residence);

            clickButtonById("add-address");
            logger.info("Endereço adicionado com sucesso");
        } catch (Exception e) {
            logger.severe(String.format("Erro ao preencher endereço: %s", e.getMessage()));
            throw e;
        }
    }

    private void fillPaymentForm(String primary, String cardNumber, String cardHolder, String expiration, String cvv,
            String cardFlag) {
        try {
            fillInputById("cardNumber", cardNumber);
            fillInputById("cardName", cardHolder);
            fillInputById("cardExpiration", expiration);
            fillInputById("cvv", cvv);
            selectOptionById("cardFlag", cardFlag);
            setCheckboxById("primary", primary);

            clickButtonById("add-payment");
            logger.info("Método de pagamento adicionado com sucesso");
        } catch (Exception e) {
            logger.severe(String.format("Erro ao preencher método de pagamento: %s", e.getMessage()));
            throw e;
        }
    }

    @AfterEach
    void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }
}