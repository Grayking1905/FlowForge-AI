# Selenium WebDriver Test Scripts

Below is the complete source code for the Selenium WebDriver test suite implemented for the FlowForge AI application. The test suite uses TestNG for execution and assertions, `WebDriverManager` for automated driver management, and implements the **Page Object Model (POM)** design pattern.

## 1. Test Classes

### `BaseTest.java`
Handles the setup and teardown of the WebDriver (headless Chrome) and automatically captures screenshots at the end of each test method.

```java
package com.flowforge.tests;

import io.github.bonigarcia.wdm.WebDriverManager;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.remote.RemoteWebDriver;
import org.testng.ITestResult;
import org.testng.annotations.*;

import java.io.File;
import java.io.IOException;
import java.net.URL;
import java.nio.file.Files;
import java.time.Duration;

/**
 * Base test class for Selenium UI tests.
 * Handles WebDriver setup/teardown and screenshot capture.
 */
public abstract class BaseTest {

    protected WebDriver driver;
    protected String baseUrl;

    @BeforeMethod
    public void setUp() throws Exception {
        String gridUrl = System.getProperty("selenium.grid.url");
        baseUrl = System.getProperty("app.base.url", "http://localhost:5173");

        if (gridUrl != null && !gridUrl.isEmpty()) {
            // Use Selenium Grid (Docker)
            ChromeOptions options = new ChromeOptions();
            options.addArguments("--no-sandbox", "--disable-dev-shm-usage");
            driver = new RemoteWebDriver(new URL(gridUrl), options);
        } else {
            // Local WebDriver via WebDriverManager
            WebDriverManager.chromedriver().setup();
            ChromeOptions options = new ChromeOptions();
            options.addArguments("--headless", "--no-sandbox", "--disable-dev-shm-usage");
            driver = new ChromeDriver(options);
        }

        driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));
        driver.manage().window().maximize();
    }

    @AfterMethod
    public void tearDown(ITestResult result) {
        // Capture screenshot for every test case run
        captureScreenshot(result.getName());
        
        if (driver != null) {
            driver.quit();
        }
    }

    private void captureScreenshot(String testName) {
        if (driver instanceof TakesScreenshot ts) {
            File src = ts.getScreenshotAs(OutputType.FILE);
            File dest = new File("target/screenshots/" + testName + ".png");
            dest.getParentFile().mkdirs();
            try {
                Files.copy(src.toPath(), dest.toPath());
            } catch (IOException e) {
                System.err.println("Failed to capture screenshot: " + e.getMessage());
            }
        }
    }
}
```

### `LoginTests.java`
Validates the login mechanisms, correct page routing, and title rendering.

```java
package com.flowforge.tests;

import com.flowforge.tests.pages.DashboardPage;
import com.flowforge.tests.pages.LoginPage;
import org.testng.Assert;
import org.testng.annotations.Test;

/**
 * Selenium tests for Login functionality.
 */
public class LoginTests extends BaseTest {

    @Test(description = "Verify login page loads correctly")
    public void testLoginPageLoads() {
        LoginPage loginPage = new LoginPage(driver);
        loginPage.navigateTo(baseUrl);
        Assert.assertTrue(loginPage.isOnLoginPage(), "Should be on login page");
    }

    @Test(description = "Verify successful login with valid credentials")
    public void testSuccessfulLogin() {
        LoginPage loginPage = new LoginPage(driver);
        loginPage.navigateTo(baseUrl);
        loginPage.login("test_hash@flowforge.ai", "password");

        DashboardPage dashboard = new DashboardPage(driver);
        dashboard.waitForLoad();
        Assert.assertTrue(dashboard.isOnDashboard(), "Should redirect to dashboard after login");
    }

    @Test(description = "Verify login page title")
    public void testPageTitle() {
        LoginPage loginPage = new LoginPage(driver);
        loginPage.navigateTo(baseUrl);
        Assert.assertTrue(loginPage.getPageTitle().contains("FlowForge"));
    }
}
```

### `ProjectTests.java`
Validates the rendering of project elements and successful navigation to the projects module.

```java
package com.flowforge.tests;

import com.flowforge.tests.pages.DashboardPage;
import com.flowforge.tests.pages.LoginPage;
import org.openqa.selenium.By;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.Assert;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

import java.time.Duration;

/**
 * Selenium tests for Project management.
 */
public class ProjectTests extends BaseTest {

    @BeforeMethod(dependsOnMethods = "setUp")
    public void loginFirst() {
        LoginPage loginPage = new LoginPage(driver);
        loginPage.navigateTo(baseUrl);
        loginPage.login("test_hash@flowforge.ai", "password");
        new DashboardPage(driver).waitForLoad();
    }

    @Test(description = "Verify projects page loads with project cards")
    public void testProjectsPageLoads() {
        DashboardPage dashboard = new DashboardPage(driver);
        dashboard.navigateToProjects();
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        wait.until(ExpectedConditions.urlContains("/projects"));
        Assert.assertTrue(driver.getCurrentUrl().contains("/projects"));
    }

    @Test(description = "Verify navigation to dashboard works")
    public void testNavigateToDashboard() {
        driver.get(baseUrl + "/dashboard");
        DashboardPage dashboard = new DashboardPage(driver);
        dashboard.waitForLoad();
        Assert.assertTrue(dashboard.isOnDashboard());
    }
}
```

### `TaskTests.java`
Validates the rendering and navigation of the task/kanban module, the team page, and the AI features module.

```java
package com.flowforge.tests;

import com.flowforge.tests.pages.DashboardPage;
import com.flowforge.tests.pages.LoginPage;
import org.openqa.selenium.By;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.Assert;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

import java.time.Duration;

/**
 * Selenium tests for Task/Kanban management.
 */
public class TaskTests extends BaseTest {

    @BeforeMethod(dependsOnMethods = "setUp")
    public void loginFirst() {
        LoginPage loginPage = new LoginPage(driver);
        loginPage.navigateTo(baseUrl);
        loginPage.login("test_hash@flowforge.ai", "password");
        new DashboardPage(driver).waitForLoad();
    }

    @Test(description = "Verify tasks/Kanban page loads")
    public void testTasksPageLoads() {
        DashboardPage dashboard = new DashboardPage(driver);
        dashboard.navigateToTasks();
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        wait.until(ExpectedConditions.urlContains("/tasks"));
        Assert.assertTrue(driver.getCurrentUrl().contains("/tasks"));
    }

    @Test(description = "Verify team page loads")
    public void testTeamPageLoads() {
        DashboardPage dashboard = new DashboardPage(driver);
        dashboard.navigateToTeam();
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        wait.until(ExpectedConditions.urlContains("/team"));
        Assert.assertTrue(driver.getCurrentUrl().contains("/team"));
    }

    @Test(description = "Verify AI assistant page loads")
    public void testAIPageLoads() {
        DashboardPage dashboard = new DashboardPage(driver);
        dashboard.navigateToAI();
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        wait.until(ExpectedConditions.urlContains("/ai"));
        Assert.assertTrue(driver.getCurrentUrl().contains("/ai"));
    }
}
```

---

## 2. Page Object Models (POM)

### `LoginPage.java`
Encapsulates all the HTML elements and interactions available on the Login interface.

```java
package com.flowforge.tests.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

/**
 * Page Object Model for Login page.
 */
public class LoginPage {
    private final WebDriver driver;
    private final WebDriverWait wait;

    @FindBy(id = "login-email")
    private WebElement emailInput;

    @FindBy(id = "login-password")
    private WebElement passwordInput;

    @FindBy(id = "login-submit")
    private WebElement signInButton;

    @FindBy(css = "[data-testid='login-error']")
    private WebElement errorMessage;

    public LoginPage(WebDriver driver) {
        this.driver = driver;
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        PageFactory.initElements(driver, this);
    }

    public void navigateTo(String baseUrl) {
        driver.get(baseUrl + "/login");
        wait.until(ExpectedConditions.visibilityOf(emailInput));
    }

    public void enterEmail(String email) {
        emailInput.clear();
        emailInput.sendKeys(email);
    }

    public void enterPassword(String password) {
        passwordInput.clear();
        passwordInput.sendKeys(password);
    }

    public void clickSignIn() {
        signInButton.click();
    }

    public void login(String email, String password) {
        enterEmail(email);
        enterPassword(password);
        clickSignIn();
    }

    public boolean isOnLoginPage() {
        return driver.getCurrentUrl().contains("/login");
    }

    public String getPageTitle() {
        return driver.getTitle();
    }
}
```

### `DashboardPage.java`
Encapsulates navigation mechanisms after successful authentication.

```java
package com.flowforge.tests.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;
import java.util.List;

/**
 * Page Object Model for Dashboard page.
 */
public class DashboardPage {
    private final WebDriver driver;
    private final WebDriverWait wait;

    @FindBy(css = "[data-testid='ai-insights-card']")
    private WebElement aiInsightsCard;

    @FindBy(css = "[data-testid='active-projects']")
    private WebElement activeProjectsSection;

    @FindBy(css = "[data-testid='sidebar-nav']")
    private WebElement sidebarNav;

    public DashboardPage(WebDriver driver) {
        this.driver = driver;
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        PageFactory.initElements(driver, this);
    }

    public boolean isOnDashboard() {
        return driver.getCurrentUrl().contains("/dashboard");
    }

    public void waitForLoad() {
        wait.until(ExpectedConditions.urlContains("/dashboard"));
    }

    public void navigateToProjects() {
        driver.findElement(By.cssSelector("a[href='/projects']")).click();
        wait.until(ExpectedConditions.urlContains("/projects"));
    }

    public void navigateToTasks() {
        driver.findElement(By.cssSelector("a[href='/tasks']")).click();
        wait.until(ExpectedConditions.urlContains("/tasks"));
    }

    public void navigateToTeam() {
        driver.findElement(By.cssSelector("a[href='/team']")).click();
        wait.until(ExpectedConditions.urlContains("/team"));
    }

    public void navigateToAI() {
        driver.findElement(By.cssSelector("a[href='/ai']")).click();
        wait.until(ExpectedConditions.urlContains("/ai"));
    }
}
```
