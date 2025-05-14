package br.com.fatecmogidascruzes.ecommercelivroback;

import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

import static org.junit.jupiter.api.Assertions.assertNotEquals;

import java.time.Duration;
import java.util.concurrent.CountDownLatch;
import java.util.logging.Logger;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

@SpringBootTest
@TestPropertySource(properties = {
    "spring.datasource.url=jdbc:mysql://localhost:3306/ecommercelivro_test?createDatabaseIfNotExist=true",
    "spring.datasource.username=root",
    "spring.datasource.password=root",
    "spring.jpa.hibernate.ddl-auto=create-drop"
})
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class OrderE2ETest {
  private WebDriver driver;
  private WebDriverWait wait;
  private final String BASE_URL_USER = "http://localhost:5173?type=user&id=11";
  private final String BASE_URL_ADMIN = "http://localhost:5173?type=admin&id=";
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
  void shouldAddToCart() {
    driver.get(BASE_URL_USER);
    setCheckboxById("search-category-Ficção Científica", "1");
    clickButtonById("item-card-10");

    wait.until(ExpectedConditions.urlContains("item/ver"));

    clickButtonById("add-to-cart-button");
    wait.until(ExpectedConditions.presenceOfElementLocated(By.id("cart-success-message")));
  }

  @Test
  @Order(2)
  void shouldCreateOrder() {
    driver.get(BASE_URL_USER);
    // Go to cart
    clickButtonById("cart-button");
    wait.until(ExpectedConditions.urlContains("carrinho"));

    // Proceed to checkout
    clickButtonById("checkout-button");
    wait.until(ExpectedConditions.urlContains("compra"));

    // Select delivery address if needed
    clickButtonById("address-22");

    // Select payment method if needed
    clickButtonById("add-order-payment-8");

    clickButtonById("submit-order-button");

    wait.until(ExpectedConditions.urlContains("/?"));

    // Count down latch to allow the next test to proceed
    latches[0].countDown();
  }

  @Test
  @Order(3)
  void shouldAlterOrderStatus() {
    try {
      // Wait for the previous test to complete
      latches[0].await();

      // Go to admin panel
      driver.get(BASE_URL_ADMIN);
      wait.until(ExpectedConditions.urlContains("admin"));

      // Change order status to "Aprovado"
      clickButtonById("order-select-8");
      clickButtonById("order-select-8-APROVAR");


      // Change order status to "Enviado"
      clickButtonById("order-select-8");
      clickButtonById("order-select-8-ENVIAR");

      // Change order status to "Entregue"
      clickButtonById("order-select-8");
      clickButtonById("order-select-8-ENTREGAR");

      // Count down latch to allow the next test to proceed
      latches[1].countDown();
    } catch (InterruptedException e) {
      Thread.currentThread().interrupt();
      logger.severe("Test interrupted: " + e.getMessage());
    }
  }

  @Test
  @Order(4)
  void shouldCreateOrderReturnRequest() {
    try {
      // Wait for the previous test to complete
      latches[1].await();

      // Go to user panel
      driver.get(BASE_URL_USER);
      wait.until(ExpectedConditions.urlContains("user"));

      // Go to orders page
      clickButtonById("my-orders-button");
      wait.until(ExpectedConditions.urlContains("pedidos"));

      // Find the order and request return
      clickButtonById("request-return-8"); // Assuming the first order is the one we created
      wait.until(ExpectedConditions.urlContains("devolucao"));

      // Select items to return
      fillInputById("return-item-", "1");

      // Submit return request
      clickButtonById("submit-return-request");

    wait.until(ExpectedConditions.urlContains("/pedidos/ver?"));

      // Count down latch to allow the next test to proceed
      latches[2].countDown();
    } catch (InterruptedException e) {
      Thread.currentThread().interrupt();
      logger.severe("Test interrupted: " + e.getMessage());
    }
  }

  @Test
  @Order(5)
  void shouldAlterOrderReturnRequestStatus() {
    try {
      // Wait for the previous test to complete
      latches[2].await();

      // Go to admin panel
      driver.get(BASE_URL_ADMIN); // Using admin ID 1
      wait.until(ExpectedConditions.urlContains("admin"));

      // Approve the return request
      clickButtonById("order-select-8");
      clickButtonById("order-select-8-RETURN_APPROVED");

      // Change status to completed when the product is received back
      clickButtonById("order-select-8");
      clickButtonById("order-select-8-RETURN_COMPLETED");

      // Count down latch to allow potential future tests to proceed
      latches[3].countDown();
    } catch (InterruptedException e) {
      Thread.currentThread().interrupt();
      logger.severe("Test interrupted: " + e.getMessage());
    }
  }

  @Test
  @Order(6)
  void shouldCreateOrderWithCupom() {
    try {
      // Wait for the previous test to complete
      latches[3].await();

      driver.get(BASE_URL_USER);
      // Go to cart
      clickButtonById("cart-button");
      wait.until(ExpectedConditions.urlContains("carrinho"));

      // Proceed to checkout
      clickButtonById("checkout-button");
      wait.until(ExpectedConditions.urlContains("compra"));

      // Select delivery address if needed
      clickButtonById("address-22");

      
    } catch (InterruptedException e) {
      Thread.currentThread().interrupt();
      logger.severe("Test interrupted: " + e.getMessage());
    }
  }

  private void fillInputById(String id, String value) {
    try {
      WebElement input = wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(@id,'" + id + "')]")));
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

  private void fillAddressForm(String billing, String delivery, String residence, String streetType,String number,
      String complement,  String zipcode) {
    try {
      fillInputById("zip", zipcode);
      fillInputById("street", "");
      wait.until(ExpectedConditions.not(ExpectedConditions.attributeToBe(By.id("street"), "value", "")));
      fillInputById("streetType", streetType);
      fillInputById("number", number);
      fillInputById("complement", complement);
      setCheckboxById("billing", billing);
      setCheckboxById("shipping", delivery);
      setCheckboxById("residential", residence);

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
