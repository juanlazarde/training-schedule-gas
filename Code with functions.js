/**
 * Builds email with training information and sends it
 *
 * Explanation
 * This code sets up a Google Sheet that contains a training schedule, then
 * uses Apps Script to send email reminders to the user about upcoming workouts.
 * The code defines constants for the sheet name, header row and column names,
 * and email settings. It then creates a Spreadsheet class that represents the
 * training schedule, with methods for getting the email date and email content.
 * Finally, it creates an EmailSender class that sends the email using a template
 * file and the MailApp service. The main() function brings everything together
 * by creating instances of the Spreadsheet and EmailSender classes and sending
 * the email if email reminders are turned on and there is an upcoming workout
 * scheduled.
 *
 * This code needs a Google Spreadsheet and an email.html template.
 * Get the Google Spreadsheet here: https://docs.google.com/spreadsheets/d/1OrGPV743KBXale8ZKQXNKI8ubKRcnBoipjITNq0zHm4/edit?usp=sharing
 *
 * Developed by Juan Lazarde. 2023
 */

// Sets sheet name
const SHEET_NAME = "Training Schedule";

// Sets header-row and column names and index numbers
const HEADER_ROW = 3;
const COLUMNS = {
  date: 0,
  week: 1,
  dte: 2,
  workout: 3,
  exercise: 4,
  link: 5,
};

// Sets email to be sent and number of days from today to send it
const EMAIL_ON = true;
const DAYS_AHEAD_TO_SEND = 0; // Same day is 0

// Returns formatted date to send email in EST as a string
function getEmailDate(timeZone) {
  let date = new Date();
  date.setDate(date.getDate() + DAYS_AHEAD_TO_SEND);
  return Utilities.formatDate(date, timeZone, "EEE, MMM d, yyyy");
}

// Uses email.html as a template, evaluates the variables, and sends it as email
function sendEmailNotification(content, subject, emailAddress) {
  let template = HtmlService.createTemplateFromFile("email");
  template.content = content;
  const msg = template.evaluate();
  MailApp.sendEmail(emailAddress, subject, msg.getContent(), {
    htmlBody: msg.getContent(),
  });
}

function main() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAME);
  const range = sheet.getDataRange();
  const rows = range.getDisplayValues();
  const lastRow = range.getLastRow();
  const dataRow = HEADER_ROW + 1;
  const timeZone = ss.getSpreadsheetTimeZone();
  const emailDate = getEmailDate(timeZone);
  const sheetURL = ss.getUrl();
  const plan = ss.getRangeByName("PlanSelected").getValues().toString();

  // Creates empty dictionary to collect data for email
  let emailContent = {};

  // Iterates through rows (dates) to find a match and pull data
  for (let i = dataRow; i < lastRow; i++) {
    let row = rows[i];

    // Finds values from current date
    if (row[COLUMNS.date] === emailDate) {
      // Returns an array if "|" character is present in the exercise string
      const getExercise = (x) => (x.indexOf("|") > -1 ? x.split(" | ") : x);

      emailContent = {
        date: row[COLUMNS.date],
        week: row[COLUMNS.week],
        dte: row[COLUMNS.dte],
        workout: row[COLUMNS.workout],
        exercises: getExercise(row[COLUMNS.exercise]),
        link: row[COLUMNS.link],
        plan,
        sheetURL,
      };
      break;
    }
  }

  // Sends notification email if there's content
  if (Object.keys(emailContent).length > 0 && EMAIL_ON) {
    const recipient = Session.getActiveUser().getEmail();
    const subject = `Training reminder: ${emailContent.workout}`;
    sendEmailNotification(emailContent, subject, recipient);
  }
}

// Samples: https://github.com/googleworkspace/apps-script-sample
// References: https://developers.google.com/apps-script/reference/
// Style: https://developer.mozilla.org/en-US/docs/MDN/Writing_guidelines/Writing_style_guide/Code_style_guide/JavaScript
// Date notations: https://docs.oracle.com/javase/7/docs/api/java/text/SimpleDateFormat.html
// Google Style: https://google.github.io/styleguide/jsguide.html
