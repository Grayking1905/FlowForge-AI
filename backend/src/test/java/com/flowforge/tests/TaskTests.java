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
        loginPage.login("alex@flowforge.ai", "password");
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
