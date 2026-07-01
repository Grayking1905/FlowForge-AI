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
 * Handles WebDriver setup/teardown and screenshot capture on failures.
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
        if (result.getStatus() == ITestResult.FAILURE) {
            captureScreenshot(result.getName());
        }
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
