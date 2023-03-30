# Training Schedule Email Notification
This Google Apps Script sends an email with training information to the user. The email is sent on a specific date, which is set to a number of days ahead of the current date using the DAYS_AHEAD_TO_SEND constant.

# Setup
Before running this script, please set the following constants:

* SHEET_NAME: the name of the sheet containing the training schedule.
* HEADER_ROW: the row number where the header row starts in the training schedule sheet.
* COLUMNS: an object containing the column names and index numbers for the date, week, date, workout, exercise, and link columns in the training schedule sheet.
* EMAIL_ON: a boolean value indicating whether to send the email notification or not.
* DAYS_AHEAD_TO_SEND: the number of days ahead of the date to send the email.
* EMAIL_TEMPLATE_FILE: the name of the HTML template file to use for the email.

# Functions

## getEmailDate(timeZone)
This function calculates the date to send the email based on the DAYS_AHEAD_TO_SEND constant and the current date and time zone. It returns the formatted date to send the email in Eastern Standard Time (EST) as a string.

## sendEmailNotification(content, subject, emailAddress)
This function uses an HTML template to send the email notification with the training information to the user. It populates the template with the training information and sends the email using the MailApp service.

## main()
This is the main function that retrieves the spreadsheet, sheet, and range of data for the training schedule sheet. It then goes through each row to find the row with the matching date as the email date. If a match is found, it stores the data in an object called emailContent. If emailContent is not empty and EMAIL_ON is true, it sends the email using the sendEmailNotification function.

## getSheetData(sheet)
This function retrieves the data from the specified sheet and returns it as a 2D array.

## getTrainingData(rows, emailDate)
This function filters the rows to find the row with the matching date as the email date. If a match is found, it stores the data in an object called emailContent.

# References
Apps Script Reference: <https://developers.google.com/apps-script/reference/>
JavaScript Code Style Guide: <https://developer.mozilla.org/en-US/docs/MDN/Writing_guidelines/Writing_style_guide/Code_style_guide/JavaScript>
Date Notations: <https://docs.oracle.com/javase/7/docs/api/java/text/SimpleDateFormat.html>

# Instructions
To set up the Google Apps Script with triggers to run once a day, follow these steps:

1. Open the script editor by clicking on "Tools" > "Script editor" in the Google Sheets menu.
2. Copy and paste the code provided in the previous section into the script editor. Include other files in the directory (i.e. email.html)
3. Set the constants in the code to match the settings in your Google Sheet.
4. Click on "Edit" > "Current project's triggers" in the script editor menu.
5. Click on the "+ Add Trigger" button in the bottom right corner.
6. In the "Run" dropdown menu, select the "main" function.
7. In the "Events" dropdown menu, select "Time-driven".
8. In the "Select type of time based trigger" dropdown menu, select "Day timer".
9. Choose a time of day to run the script, and select a timezone.
10. Click on "Save".

The script will now run once a day at the selected time. You can check the execution log to verify that the script is running correctly. To view the execution log, click on "View" > "Logs" in the script editor menu.
