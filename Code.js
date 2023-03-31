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

// Represents spreadsheet and contains functions to build the email's body
class Spreadsheet {
  // Creates an instance of Spreadsheet and instance variables inside it
  constructor() {
    this.ss = SpreadsheetApp.getActiveSpreadsheet();
    this.sheet = this.ss.getSheetByName(SHEET_NAME);
    this.range = this.sheet.getDataRange();
    this.rows = this.range.getDisplayValues();
    this.lastRow = this.range.getLastRow();
    this.dataRow = HEADER_ROW + 1;
    this.timeZone = this.ss.getSpreadsheetTimeZone();
    this.emailDate = this.getEmailDate(this.timeZone);
    this.sheetURL = this.ss.getUrl();
    this.plan = this.ss.getRangeByName("PlanSelected").getValues().toString();
  }

  /**
   * Returns formatted date to send email in corresponding to the timeZone as a string
   * @param {string} timeZone - Your timezone
   * @returns {string} The formatted date to send the email
   */
  getEmailDate(timeZone) {
    let date = new Date();
    date.setDate(date.getDate() + DAYS_AHEAD_TO_SEND);
    return Utilities.formatDate(date, timeZone, "EEE, MMM d, yyyy");
  }

  /**
   * Returns content of the email
   * @returns {object} The content of the email as an object or null
   */
  getEmailContent() {
    // Iterates through rows (dates) to find a match and pull data
    for (let i = this.dataRow; i < this.lastRow; i++) {
      let row = this.rows[i];

      // Finds values from current date
      if (row[COLUMNS.date] === this.emailDate) {
        // Returns an array if "|" character is present in the exercise string
        const getExercise = (x) => (x.indexOf("|") > -1 ? x.split(" | ") : x);

        let emailContent = {
          date: row[COLUMNS.date],
          week: row[COLUMNS.week],
          dte: row[COLUMNS.dte],
          workout: row[COLUMNS.workout],
          exercises: getExercise(row[COLUMNS.exercise]),
          link: row[COLUMNS.link],
          plan: this.plan,
          sheetURL: this.sheetURL,
        };
        return emailContent;
      }
    }
    return null;
  }
}

// Represents an email sender and contains functions to assemble email from template and send it
class EmailSender {
  // Creates an instance of EmailSender with constants declared
  constructor() {
    this.recipient = Session.getActiveUser().getEmail();
    this.EMAIL_TEMPLATE_FILE = "email";
  }

  /**
   * Sends an email
   * @param {string} subject - The subject of the email
   * @param {object} content - The content of the email as an object
   */
  send(subject, content) {
    let template = HtmlService.createTemplateFromFile(this.EMAIL_TEMPLATE_FILE);
    template.content = content;
    const msg = template.evaluate();
    MailApp.sendEmail(this.recipient, subject, msg.getContent(), {
      htmlBody: msg.getContent(),
    });
  }
}

/**
 * The main function of the script, which orchestrates the sending of email
 * reminders for upcoming workouts. It creates instances of the Spreadsheet
 * and EmailSender classes, and uses them to retrieve the email content and
 * send the email if email reminders are turned on and there is an upcoming
 * workout scheduled for the current day. If there are no upcoming workouts
 * scheduled for the current day, or if email reminders are turned off, no
 * email is sent.
 *
 * @returns {void} - This function does not return a value.
 */
function main() {
  const spreadsheet = new Spreadsheet();
  const emailContent = spreadsheet.getEmailContent();
  if (EMAIL_ON && emailContent) {
    const emailSender = new EmailSender();
    const subject = `Training reminder: ${emailContent.workout}`;
    emailSender.send(subject, emailContent);
  }
}

// Samples: https://github.com/googleworkspace/apps-script-sample
// References: https://developers.google.com/apps-script/reference/
// Style: https://developer.mozilla.org/en-US/docs/MDN/Writing_guidelines/Writing_style_guide/Code_style_guide/JavaScript
// Date notations: https://docs.oracle.com/javase/7/docs/api/java/text/SimpleDateFormat.html
// Google Style: https://google.github.io/styleguide/jsguide.html
