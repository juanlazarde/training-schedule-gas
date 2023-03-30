// Builds email with training information and sends it
/**
 * Explanation
 * This code sends an email with training information to the user.
 * It first sets various constants such as sheet name, column names, and
 * the number of days to send the email ahead of the date.
 * Then it defines two functions: getEmailDate which returns the
 * formatted date for sending the email, and sendEmailNotification which
 * sends the actual email.
 *
 * The main function retrieves the spreadsheet, sheet, and range of data for the sheet.
 * It then goes through each row to find the row with the matching date as the emailDate.
 * If a match is found, it stores the data in an object called emailContent.
 * If emailContent is not empty and EMAIL_ON is true,
 * it sends the email using the sendEmailNotification function.
 */

// Sets sheet name
const SHEET_NAME = "Training Schedule";

// Sets header-row and column names and index numbers. Starts at 0
const HEADER_ROW = 5;
const COLUMNS = {
  date: 1,
  week: 2,
  dte: 3,
  workout: 4,
  exercise: 5,
  link: 6,
};

// Sets email to be sent or not and the number of days to send email ahead of the date. Same day is 0
const EMAIL_ON = true;
const DAYS_AHEAD_TO_SEND = 0;

// Returns formatted date to send email in EST as a string
function getEmailDate(timeZone) {
  let date = new Date();
  date.setDate(date.getDate() + DAYS_AHEAD_TO_SEND);
  return Utilities.formatDate(date, timeZone, "EEE, MMM d, yyyy");
}

// Uses ematil.html as a template, evaluates the variables, and sends it as email
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
  const sheetURL = ss.getUrl();
  const lastRow = range.getLastRow();
  const dataRow = HEADER_ROW + 1;
  const timeZone = ss.getSpreadsheetTimeZone();
  const emailDate = getEmailDate(timeZone);

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
        plan: rows[4][0],
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
