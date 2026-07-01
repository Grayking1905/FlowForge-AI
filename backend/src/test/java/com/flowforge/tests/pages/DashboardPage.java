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
