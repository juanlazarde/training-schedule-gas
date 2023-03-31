# Email Reminder App for Training Schedule

This is an Apps Script code that sends email reminders about upcoming workouts from a Google Sheet that contains a training schedule. The code sets up the constants for the sheet name, header row and column names, and email settings. It then creates a `Spreadsheet` class that represents the training schedule, with methods for getting the email content. Finally, it creates an `EmailSender` class that sends the email using a template file and the `MailApp` service. The `main()` function brings everything together by creating instances of the `Spreadsheet` and `EmailSender` classes and sending the email if email reminders are turned on and there is an upcoming workout scheduled.

There're two working versions of this code. `Code` uses classes and it's the one that I use. `Code with functions` it's easier to understand.

## Google Sheet

This code requires a Google Spreadsheet to work. You can get a sample sheet [here](https://docs.google.com/spreadsheets/d/1OrGPV743KBXale8ZKQXNKI8ubKRcnBoipjITNq0zHm4/edit?usp=sharing). The sheet named "Training Schedule", should have a header row that contains the column names for the data, data for upcoming workouts scheduled in the future, the name should match the `SHEET_NAME` constant defined in the code, and a named range called "PlanSelected" that contains the name of the training plan.

## Email Template

This code uses an email template file called `email.html` to build the email. You can customize the template file to fit your needs.

## Installation

To use this code, and set up the Google Apps Script with triggers to run once a day, follow these steps:

1. Create a new Google Sheet or use the [sample sheet](https://docs.google.com/spreadsheets/d/1OrGPV743KBXale8ZKQXNKI8ubKRcnBoipjITNq0zHm4/edit?usp=sharing) and go to **File > Make a Copy**.
2. Open the sheet and go to **Extensions > Apps Script**.
3. Copy and paste the code from `Code.gs` into the script editor, similarly with `email.html`.
4. Set the constants in the code to match the settings in your Google Sheet.
5. Turn on email reminders by setting the `EMAIL_ON` constant to `true`.
6. Set the number of days ahead to send the email by changing the value of the `DAYS_AHEAD_TO_SEND` constant.
7. Save the project with a name of your choice.

## Setup

Before running this script, please set the following constants:

- `SHEET_NAME`: the name of the sheet containing the training schedule.
- `HEADER_ROW`: the row number where the header row starts in the training schedule sheet.
- `COLUMNS`: an object containing the column names and index numbers for the date, week, date, workout, exercise, and link columns in the training schedule sheet.
- `EMAIL_ON`: a boolean value indicating whether to send the email notification or not.
- `DAYS_AHEAD_TO_SEND`: the number of days ahead of the date to send the email.
- `EMAIL_TEMPLATE_FILE`: the name of the HTML template file to use for the email. Default is `email`.

## Usage

To use this code, follow the steps below:

1. Open the Google Sheet.
2. Enter the training schedule data in the correct format.
3. Run the `main` function to send the email reminder.

## Automation

1. Run the `main` function to test the code.
2. Click on **Triggers > + Add Trigger** button in the bottom right corner.
3. In the "Run" dropdown menu, select the "main" function.
4. In the "Events" dropdown menu, select "Time-driven".
5. In the "Select type of time based trigger" dropdown menu, select "Day timer".
6. Choose a time of day to run the script, considering the timezone.
7. Click on "Save".

The script will now run once a day at the selected time. You can check the execution log to verify that the script is running correctly. To view the execution log, click on "View" > "Logs" in the script editor menu.

## Credits

This code was developed by Juan Lazarde in 2023.

## References

- [Google Apps Script Reference](https://developers.google.com/apps-script/reference/)
- [JavaScript Code Style Guide](https://developer.mozilla.org/en-US/docs/MDN/Writing_guidelines/Writing_style_guide/Code_style_guide/JavaScript)
- [Java SimpleDateFormat](https://docs.oracle.com/javase/7/docs/api/java/text/SimpleDateFormat.html)
- [Google JavaScript Style Guide](https://google.github.io/styleguide/jsguide.html)