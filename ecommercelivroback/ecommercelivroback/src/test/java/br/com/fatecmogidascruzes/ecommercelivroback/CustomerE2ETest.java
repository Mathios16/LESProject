package br.com.fatecmogidascruzes.ecommercelivroback;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.TestMethodOrder;
import org.junit.jupiter.api.MethodOrderer.OrderAnnotation;
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

@SpringBootTest
@TestPropertySource(properties = {
        "spring.datasource.url=jdbc:mysql://localhost:3306/ecommercelivro_test?createDatabaseIfNotExist=true",
        "spring.datasource.username=root",
        "spring.datasource.password=root",
        "spring.jpa.hibernate.ddl-auto=create-drop"
})
@TestMethodOrder(OrderAnnotation.class)
class CustomerE2ETest {
    private WebDriver driver;
    private WebDriverWait wait;
    private final String BASE_URL = "http://localhost:5173";
    private final String TEST_CPF = "123.456.789-00";
    private static final Logger logger = Logger.getLogger(CustomerE2ETest.class.getName());

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

        // Preencher dados pessoais
        fillInputById("name", "João");
        fillInputById("lastname", "Silva");
        fillInputById("document", TEST_CPF);
        fillInputById("email", "joao.silva@test.com");
        fillInputById("password", "Test@123");
        fillInputById("confirmPassword", "Test@123");
        fillInputById("birthdate", "01/01/2000");

        // Selecionar gênero e tipo de telefone
        selectOptionById("gender", "MASCULINO");

        // Preencher telefone
        fillInputById("phone", "1198765-4321");

        // Adicionar endereço residencial
        clickButtonById("create-address");
        fillAddressForm("0", "0", "1", "Rua A", "123", "Apto 1", "Centro", "São Paulo", "SP", "Brasil", "01234-567");

        // Adicionar endereço de entrega
        clickButtonById("create-address");
        fillAddressForm("0", "1", "0", "Rua B", "456", "", "Jardim", "São Paulo", "SP", "Brasil", "04567-890");

        // Adicionar endereço de cobrança
        clickButtonById("create-address");
        fillAddressForm("1", "0", "0", "Rua C", "789", "", "Vila", "São Paulo", "SP", "Brasil", "06789-012");

        WebElement addressList = wait.until(ExpectedConditions.presenceOfElementLocated(By.className("addresses")));
        assertTrue(addressList.getText().contains("Rua A"));
        assertTrue(addressList.getText().contains("Residencial"));

        assertTrue(addressList.getText().contains("Rua B"));
        assertTrue(addressList.getText().contains("Entrega"));

        assertTrue(addressList.getText().contains("Rua C"));
        assertTrue(addressList.getText().contains("Cobrança"));

        // Adicionar método de pagamento
        clickButtonById("create-payment");
        fillPaymentForm("1", "4111111111111111", "João Silva", "12/30", "123", "VISA");

        // Verificar se o método de pagamento foi adicionado
        WebElement paymentList = wait
                .until(ExpectedConditions.presenceOfElementLocated(By.className("paymentMethods")));
        assertTrue(paymentList.getText().contains("João Silva"));
        assertTrue(paymentList.getText().contains("**** **** **** 1111"));

        // Submeter formulário
        WebElement submitButton = wait
                .until(ExpectedConditions.elementToBeClickable(By.cssSelector("button[type='submit']")));
        submitButton.click();

        // Verificar mensagem de sucesso
        WebElement successMessage = wait
                .until(ExpectedConditions.presenceOfElementLocated(By.className("success-message")));
        assertTrue(successMessage.getText().contains("Cliente cadastrado com sucesso"));

        // Verificar redirecionamento para a lista de clientes
        wait.until(ExpectedConditions.urlToBe(BASE_URL + "/clientes"));

        // Verificar se o cliente aparece na lista
        WebElement searchInput = wait.until(ExpectedConditions.presenceOfElementLocated(By.id("search-input")));
        searchInput.sendKeys(TEST_CPF);

        WebElement customersTable = wait
                .until(ExpectedConditions.presenceOfElementLocated(By.className("customers-table")));
        String tableText = customersTable.getText();
        assertTrue(tableText.contains("João"));
        assertTrue(tableText.contains("Silva"));
        assertTrue(tableText.contains(TEST_CPF));
        assertTrue(tableText.contains("joao.silva@test.com"));
    }

    // @Test
    // @Order(2)
    // void shouldListAndFilterCustomers() {
    // driver.get(BASE_URL + "/clientes");

    // // Esperar carregamento da lista
    // wait.until(ExpectedConditions.presenceOfElementLocated(By.className("customers-table")));

    // // Verificar se o cliente criado está na lista
    // WebElement searchInput = driver.findElement(By.id("search-input"));
    // searchInput.sendKeys(TEST_CPF);

    // // Verificar resultados filtrados
    // List<WebElement> customerRows =
    // driver.findElements(By.cssSelector(".customers-table tr"));
    // assertTrue(customerRows.size() > 0);
    // assertTrue(customerRows.get(1).getText().contains("João Silva"));
    // }

    // @Test
    // @Order(3)
    // void shouldEditCustomer() {
    // driver.get(BASE_URL + "/clientes");

    // // Buscar cliente para editar
    // WebElement searchInput = driver.findElement(By.id("search-input"));
    // searchInput.sendKeys(TEST_CPF);

    // // Clicar no botão de editar
    // clickButtonByClass("edit-button");

    // // Atualizar nome
    // WebElement nameInput =
    // wait.until(ExpectedConditions.presenceOfElementLocated(By.id("name")));
    // nameInput.clear();
    // nameInput.sendKeys("João Editado");

    // // Submeter edição
    // clickButtonById("submit");

    // // Verificar mensagem de sucesso
    // WebElement successMessage = wait
    // .until(ExpectedConditions.presenceOfElementLocated(By.className("success-message")));
    // assertTrue(successMessage.getText().contains("Cliente atualizado com
    // sucesso"));

    // // Verificar se a alteração foi aplicada na listagem
    // driver.get(BASE_URL + "/clientes");
    // searchInput =
    // wait.until(ExpectedConditions.presenceOfElementLocated(By.id("search-input")));
    // searchInput.sendKeys(TEST_CPF);

    // List<WebElement> customerRows =
    // driver.findElements(By.cssSelector(".customers-table tr"));
    // assertTrue(customerRows.get(1).getText().contains("João Editado"));
    // }

    // @Test
    // @Order(4)
    // void shouldDeleteCustomer() {
    // driver.get(BASE_URL + "/clientes");

    // // Buscar cliente para deletar
    // WebElement searchInput = driver.findElement(By.id("search-input"));
    // searchInput.sendKeys(TEST_CPF);

    // // Clicar no botão de deletar
    // clickButtonByClass("delete-button");

    // // Confirmar exclusão
    // WebElement confirmButton =
    // wait.until(ExpectedConditions.presenceOfElementLocated(By.id("confirm-delete")));
    // confirmButton.click();

    // // Verificar mensagem de sucesso
    // WebElement successMessage = wait
    // .until(ExpectedConditions.presenceOfElementLocated(By.className("success-message")));
    // assertTrue(successMessage.getText().contains("Cliente removido com
    // sucesso"));

    // // Verificar se o cliente foi removido
    // searchInput =
    // wait.until(ExpectedConditions.presenceOfElementLocated(By.id("search-input")));
    // searchInput.sendKeys(TEST_CPF);

    // List<WebElement> customerRows =
    // driver.findElements(By.cssSelector(".customers-table tr"));
    // assertEquals(1, customerRows.size()); // Apenas o header da tabela
    // }

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
            // Primeiro preenchemos o CEP para aproveitar a busca automática
            fillInputById("zip", zipcode);

            // Depois preenchemos os outros campos
            fillInputById("street", street);
            fillInputById("number", number);
            fillInputById("complement", complement);
            fillInputById("neighborhood", neighborhood);
            fillInputById("city", city);
            fillInputById("state", state);
            fillInputById("country", country);

            // Por último, marcamos os checkboxes
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
        // if (driver != null) {
        // driver.quit();
        // }
    }
}