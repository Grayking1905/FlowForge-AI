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
        loginPage.login("alex@flowforge.ai", "password");

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
