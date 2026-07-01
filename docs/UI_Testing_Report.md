# FlowForge AI — UI Testing Report

## 1. Overview
This document serves as the formal UI Testing report for the **FlowForge AI** web application. We have implemented an automated UI testing suite using **Selenium WebDriver** in Java, managed via Maven, and orchestrated using the **TestNG** framework. 

The objective of these automated tests is to validate critical user flows, page navigation, form inputs, and ensure that the interactive elements of the SPA (Single Page Application) frontend communicate properly with the backend and render accurately.

## 2. Test Automation Architecture & Framework
The automated UI testing framework was built inside the `backend` module leveraging the following stack:
- **Selenium WebDriver (v4.25+)**: For programmatic browser interaction.
- **Java 21**: Test implementation language.
- **TestNG**: For test execution, assertions, and parameterized test lifecycle hooks (`@BeforeMethod`, `@AfterMethod`, `@Test`).
- **WebDriverManager (Bonigarcia)**: Automated driver binary management, removing the need for manual ChromeDriver binaries.

### Design Pattern: Page Object Model (POM)
To ensure maintainability and reduce code duplication, we adhered to the **Page Object Model**.
- **`BaseTest.java`**: Handles WebDriver initialization, implicit waits, window maximization, headless mode configurations, and automated teardown. It also implements an automatic screenshot capture mechanism on test failure.
- **`LoginPage.java`**: Encapsulates the UI locators (email input, password input, submit button) and interactions for the authentication flow.
- **`DashboardPage.java`**: Encapsulates interactions for the main dashboard post-login, including sidebar navigation to the Projects page.

## 3. Test Coverage & Executed Scenarios

The test suite validates the following core functionalities:

### A. Authentication & Form Input Validation (`LoginTests.java`)
- **`testLoginPageLoads()`**: Navigates to the base URL and verifies that the login form (email, password inputs, and submit button) renders correctly.
- **`testSuccessfulLogin()`**: 
  - Validates form input capabilities by injecting credentials (`alex@flowforge.ai` / `password`).
  - Simulates the button click to trigger the REST API authentication request.
  - Verifies that successful authentication properly triggers frontend routing (React Router) to redirect the user to the `/dashboard` route.
- **`testPageTitle()`**: Ensures the browser tab title is correctly set to "FlowForge".

### B. Navigation & Routing Validation (`ProjectTests.java`)
- **`loginFirst()` (Setup Hook)**: Uses existing Page Objects to perform a prerequisite login before executing protected route tests.
- **`testProjectsPageLoads()`**:
  - Uses the Sidebar navigation link to route from the Dashboard to the Projects Hub.
  - Implements explicit waits (`WebDriverWait`) to wait for DOM updates and URL changes (`ExpectedConditions.urlContains("/projects")`).
  - Asserts that the application successfully transitioned to the Projects page without reloading the entire window (validating the SPA behavior).
- **`testNavigateToDashboard()`**: Validates direct URL navigation to the `/dashboard` route for an authenticated session.

### C. Task Board Validations (`TaskTests.java`)
- **Kanban Board Navigation**: Verifies that the Tasks Board routes correctly and that columns (Backlog, In Progress, AI Review, Completed) render properly for the authenticated user.

## 4. Execution Configuration
Tests are configured to run headlessly during CI/CD pipelines to ensure speed and stability on server environments (e.g., Jenkins). 

```java
ChromeOptions options = new ChromeOptions();
options.addArguments("--headless", "--no-sandbox", "--disable-dev-shm-usage");
driver = new ChromeDriver(options);
```
Additionally, the framework supports Selenium Grid execution via the `selenium.grid.url` system property for distributed cross-browser testing.

## 5. Execution Proof

The automated test suite executed successfully against the local environment (Vite frontend + Spring Boot backend + TestNG). Below is the terminal output from the Maven Test phase:

```text
19:08:15.307 [TestNG-test-UI Tests-1] INFO io.github.bonigarcia.wdm.WebDriverManager -- Exporting webdriver.chrome.driver as C:\Users\shriv\.cache\selenium\chromedriver\win64\149.0.7827.155\chromedriver.exe
...
[INFO] Tests run: 8, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 30.81 s -- in TestSuite
[INFO] 
[INFO] Results:
[INFO] 
[INFO] Tests run: 8, Failures: 0, Errors: 0, Skipped: 0
[INFO] 
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
[INFO] Total time:  34.599 s
[INFO] Finished at: 2026-07-01T19:08:26+05:30
[INFO] ------------------------------------------------------------------------
```

## 6. Conclusion
The implementation of Selenium WebDriver automated tests successfully validates the primary user journeys—specifically login mechanisms, form interactions, and dynamic React routing. The use of the Page Object Model ensures that the testing suite is robust, maintainable, and easily extensible as new features (like AI Chat integration UI tests) are added to the application.
