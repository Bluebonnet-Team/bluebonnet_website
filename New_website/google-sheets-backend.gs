const SHEET_NAME = 'Booking Requests';
const SPREADSHEET_ID = ''; // Optional: paste a spreadsheet ID here if this script is not bound to a Sheet.

const HEADERS = [
  'Received At',
  'Student Name',
  'Student Age',
  'Email',
  'Phone',
  'Package',
  'Preferred Area',
  'Preferred Days/Times',
  'Pickup Address',
  'Notes',
  'Submitted At',
  'Page URL',
  'User Agent'
];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);

  try {
    const sheet = getTargetSheet_();
    ensureHeaders_(sheet);

    const params = e && e.parameter ? e.parameter : {};
    sheet.appendRow([
      new Date(),
      clean_(params.student_name),
      clean_(params.student_age),
      clean_(params.email),
      clean_(params.phone),
      clean_(params.package),
      clean_(params.preferred_area),
      clean_(params.preferred_times),
      clean_(params.pickup_address),
      clean_(params.notes),
      clean_(params.submitted_at),
      clean_(params.page_url),
      clean_(params.user_agent)
    ]);

    return html_('ok');
  } catch (error) {
    return html_('error: ' + error.message);
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return html_('Bluebonnet booking endpoint is running.');
}

function getTargetSheet_() {
  const spreadsheet = SPREADSHEET_ID
    ? SpreadsheetApp.openById(SPREADSHEET_ID)
    : SpreadsheetApp.getActiveSpreadsheet();

  if (!spreadsheet) {
    throw new Error('No spreadsheet found. Bind this script to a Google Sheet or set SPREADSHEET_ID.');
  }

  return spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.insertSheet(SHEET_NAME);
}

function ensureHeaders_(sheet) {
  const existing = sheet.getRange(1, 1, 1, HEADERS.length).getValues()[0];
  const needsHeaders = existing.join('\u0001') !== HEADERS.join('\u0001');

  if (needsHeaders) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    sheet.setFrozenRows(1);
  }
}

function clean_(value) {
  const text = value ? String(value).trim() : '';
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function html_(message) {
  return HtmlService
    .createHtmlOutput(String(message))
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}
