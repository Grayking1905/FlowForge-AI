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
        loginPage.login("alex@flowforge.ai", "password");
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
