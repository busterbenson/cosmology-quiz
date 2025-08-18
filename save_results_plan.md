# Plan: Implement "Save Results via Email" Feature

This document outlines the steps to implement a feature allowing users to save their quiz results. The user will enter their email address on the results page, and a serverless function will submit this information to a pre-configured Google Form. This will trigger a Google Apps Script to email the user a permanent link to their results.

## Phase 1: Google Workspace Setup (Manual Steps)

*   [x] **1. Create a Google Form:**
    *   Go to [forms.google.com](https://forms.google.com).
    *   Create a new form named "Cosmology Quiz Results".
    *   Add a "Short answer" question for "Email Address". Enable response validation to ensure it's a valid email format.
    *   Add a "Short answer" question for "Results Link".

*   [x] **2. Link Form to Google Sheets:**
    *   In the "Responses" tab of the form, click the green "Link to Sheets" icon.
    *   Create a new spreadsheet. This will be used to trigger the email script.

*   [x] **3. Create and Configure Google Apps Script:**
    *   In the newly created Google Sheet, go to `Extensions > Apps Script`.
    *   Replace the placeholder code with the script below.
    *   Click the "Triggers" (clock) icon, add a new trigger, and configure it to run the `onFormSubmit` function from the spreadsheet on the "On form submit" event.
    *   Authorize the script when prompted.

    ```javascript
    // Google Apps Script Code
    function onFormSubmit(e) {
      const values = e.namedValues;
      const userEmail = values['Email Address'][0];
      const resultsLink = values['Results Link'][0];

      if (userEmail && resultsLink) {
        const subject = "Your Cosmology Quiz Results";
        const body = `
          Hello,

          Thank you for taking the cosmology quiz!

          You can view your results at any time by following this link:
          ${resultsLink}

          Regards,
          The Cosmology Project
        `;
        MailApp.sendEmail(userEmail, subject, body);
      }
    }
    ```

## Phase 2: Nuxt.js Implementation (Code)

*   [x] **1. Create Server API Endpoint:**
    *   Create a new file at `/server/api/save-results.post.ts`.
    *   This endpoint will act as a proxy, securely submitting data to the Google Form from the server-side to avoid browser CORS issues.

*   [x] **2. Create Frontend Vue Component:**
    *   Create a new file at `/components/results/SaveResultsForm.vue`.
    *   This component will contain the email input field and the "Save Results" button.
    *   It will handle the user interaction, call our new API endpoint, and display success or error messages.

*   [x] **3. Integrate Component into Results Page:**
    *   Modify `/pages/results.vue` to include the new `SaveResultsForm` component.
    *   Ensure the current page's URL (the results permalink) is correctly passed as a prop to the component.

## Phase 3: Configuration and Testing

*   [x] **1. Get Google Form Field IDs:**
    *   Open the Google Form in preview mode.
    *   Use your browser's "Inspect" tool to find the `name` attribute for the "Email Address" and "Results Link" input fields. They will look like `entry.123456789`.

*   [x] **2. Update Server Endpoint:**
    *   Paste the real Form ID and entry IDs into the `/server/api/save-results.post.ts` file.

*   [x] **3. End-to-End Test:**
    *   Run the application.
    *   Go to the results page.
    *   Enter an email address and click "Save Results".
    *   Verify that a new row appears in the Google Sheet.
    *   Confirm that an email is received with the correct link.
    *   Click the link in the email and verify that it correctly displays the saved results.
