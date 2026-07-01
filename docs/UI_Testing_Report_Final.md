# FlowForge AI — UI Testing Final Report

## 1. Overview
This document serves as the formal UI Testing report and Execution Proof for the **FlowForge AI** web application. We have implemented an automated UI testing suite using **Selenium WebDriver** in Java, managed via Maven, and orchestrated using the **TestNG** framework. 

The objective of these automated tests is to validate critical user flows, page navigation, form inputs, and ensure that the interactive elements of the SPA (Single Page Application) frontend communicate properly with the backend and render accurately.

## 2. Test Automation Architecture & Framework
The automated UI testing framework was built inside the `backend` module leveraging the following stack:
- **Selenium WebDriver (v4.25+)**: For programmatic browser interaction.
- **Java 17+**: Test implementation language.
- **TestNG**: For test execution, assertions, and parameterized test lifecycle hooks (`@BeforeMethod`, `@AfterMethod`, `@Test`).
- **WebDriverManager**: Automated driver binary management.

### Design Pattern: Page Object Model (POM)
To ensure maintainability and reduce code duplication, we adhered to the **Page Object Model**.
- **`BaseTest.java`**: Handles WebDriver initialization, implicit waits, window maximization, headless mode configurations, and automated teardown. It also implements an automatic screenshot capture mechanism on test failure.
- **`LoginPage.java`**: Encapsulates the UI locators (email input, password input, submit button) and interactions for the authentication flow.
- **`DashboardPage.java`**: Encapsulates interactions for the main dashboard post-login, including sidebar navigation to the Projects page.

## 3. Test Scenarios Implemented

The test suite validates the following core functionalities:

### A. Authentication & Form Input Validation (`LoginTests.java`)
- **`testLoginPageLoads()`**: Navigates to the base URL and verifies that the login form (email, password inputs, and submit button) renders correctly.
- **`testSuccessfulLogin()`**: 
  - Validates form input capabilities by injecting credentials (`test_hash@flowforge.ai` / `password`).
  - Simulates the button click to trigger the REST API authentication request.
  - Verifies that successful authentication properly triggers frontend routing (React Router) to redirect the user to the `/dashboard` route.
- **`testPageTitle()`**: Ensures the browser tab title is correctly set to "FlowForge".

### B. Navigation & Routing Validation (`ProjectTests.java`)
- **`loginFirst()` (Setup Hook)**: Uses existing Page Objects to perform a prerequisite login before executing protected route tests.
- **`testProjectsPageLoads()`**:
  - Uses the Sidebar navigation link to route from the Dashboard to the Projects Hub.
  - Asserts that the application successfully transitioned to the Projects page without reloading the entire window (validating the SPA behavior).
- **`testNavigateToDashboard()`**: Validates direct URL navigation to the `/dashboard` route for an authenticated session.

### C. Task Board Validations (`TaskTests.java`)
- **Kanban Board Navigation**: Verifies that the Tasks Board routes correctly and that columns (Backlog, In Progress, AI Review, Completed) render properly for the authenticated user.
- **AI & Team Views**: Tests the loading and routing to the Team and AI Assistant modules.

## 4. Execution Proof (Screenshots)

Below is the execution proof for each individual Selenium UI testcase. The testing framework captured these screenshots upon completion of each test method to verify that the target views rendered appropriately.


### 1. testPageTitle
<img width="1919" height="951" alt="Screenshot 2026-07-01 192701" src="https://github.com/user-attachments/assets/3b0c0c9a-b06f-4cdf-bcc1-69b84d03d1f0" />

### 2. testLoginPageLoads
<img width="1918" height="957" alt="Screenshot 2026-07-01 192824" src="https://github.com/user-attachments/assets/f23dc738-8971-426e-9308-b4b2fe35ef51" />

### 3. testSuccessfulLogin
<img width="1919" height="949" alt="Screenshot 2026-07-01 192842" src="https://github.com/user-attachments/assets/954a7e19-d3cc-4b39-88bd-e493066b5375" />

### 4. testNavigateToDashboard
<img width="1919" height="949" alt="Screenshot 2026-07-01 192842" src="https://github.com/user-attachments/assets/1df8edd3-6b6d-4bef-b793-70892e9578b9" />

### 5. testProjectsPageLoads
<img width="1919" height="936" alt="Screenshot 2026-07-01 192858" src="https://github.com/user-attachments/assets/0801c3d5-9a44-4382-b5d5-7683c33ab1ad" />


### 6. testTasksPageLoads
<img width="1919" height="936" alt="Screenshot 2026-07-01 192858" src="https://github.com/user-attachments/assets/84791080-93bc-40d3-ad00-c35ef568df04" />

### 7. testTeamPageLoads
<img width="1919" height="944" alt="Screenshot 2026-07-01 192915" src="https://github.com/user-attachments/assets/cf2803b6-5b55-4c58-8e43-a7e3aebc8f2b" />

### 8. testAIPageLoads
<img width="1919" height="946" alt="Screenshot 2026-07-01 192932" src="https://github.com/user-attachments/assets/daae3e1f-be7d-4985-a65c-588077f89274" />

## 5. Execution Proof (Terminal Output)

The automated test suite executed successfully against the local environment (Vite frontend + Spring Boot backend + TestNG). Below is the terminal output from the Maven Test phase:

<img width="1912" height="997" alt="Screenshot 2026-07-01 191358" src="https://github.com/user-attachments/assets/73474e6b-4060-49dd-ade5-195f830bbdc5" />


```text
[INFO] Tests run: 8, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 30.81 s -- in TestSuite
[INFO] 
[INFO] Results:
[INFO] 
[INFO] Tests run: 8, Failures: 0, Errors: 0, Skipped: 0
[INFO] 
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
```

## 6. Conclusion
The implementation of Selenium WebDriver automated tests successfully validates the primary user journeys—specifically login mechanisms, form interactions, and dynamic React routing. The use of the Page Object Model ensures that the testing suite is robust, maintainable, and easily extensible.
