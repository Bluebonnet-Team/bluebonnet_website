const SHEET_NAME = 'Booking Requests';
const SPREADSHEET_ID = '1t2lNN4ISQdZAaEzgV618uuxKhSDqhnx8KjfCAdITGo0'; // Recommended: paste the exact target spreadsheet ID here. If blank, the script uses the spreadsheet bound to this Apps Script project.

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
  'Form Loaded At',
  'Page URL',
  'User Agent'
];

const REQUIRED_FIELDS = [
  'student_name',
  'student_age',
  'email',
  'phone',
  'package',
  'preferred_area',
  'preferred_times'
];

const ALLOWED_PACKAGES = new Set([
  'Package 2 - Teen #2 - $450 (most popular)',
  'Package 2 - Teen #1 - $400',
  'Package 2 - Teen #3 - $470',
  'Package 1 - Adult Complete - $450',
  'Package 3 - Adult Extended - $450',
  'Package 4 - Road Test Only - $180',
  'Package 5 - Straight to Drive - $135'
]);

const ALLOWED_AREAS = new Set([
  'Plano',
  'Frisco',
  'Allen',
  'McKinney',
  'Richardson',
  'Garland'
]);

const MAX_LENGTHS = {
  student_name: 80,
  student_age: 2,
  email: 120,
  phone: 25,
  package: 80,
  preferred_area: 40,
  preferred_times: 120,
  pickup_address: 160,
  notes: 500,
  submitted_at: 40,
  form_loaded_at: 40,
  page_url: 300,
  user_agent: 500,
  company: 100
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[0-9+().\-\s]{7,25}$/;
const MIN_FORM_FILL_MS = 0;
const MAX_SUBMISSION_AGE_MS = 24 * 60 * 60 * 1000;
const MAX_FUTURE_SKEW_MS = 10 * 60 * 1000;
const DUPLICATE_WINDOW_SECONDS = 5 * 60;

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);

  try {
    const params = normalizeParams_(e && e.parameter ? e.parameter : {});
    fillMissingTimestamps_(params);
    validateSubmission_(params);
    rejectDuplicateSubmission_(params);

    const sheet = getTargetSheet_();
    ensureHeaders_(sheet);

    sheet.appendRow([
      new Date(),
      params.student_name,
      params.student_age,
      params.email,
      params.phone,
      params.package,
      params.preferred_area,
      params.preferred_times,
      params.pickup_address,
      params.notes,
      params.submitted_at,
      params.form_loaded_at,
      params.page_url,
      params.user_agent
    ]);

    return html_('ok', true);
  } catch (error) {
    return html_('error: ' + safeMessage_(error), false);
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  if (e && e.parameter && e.parameter.debug === '1') {
    const spreadsheet = getTargetSpreadsheet_();
    const sheet = spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.insertSheet(SHEET_NAME);
    return html_([
      'Bluebonnet booking endpoint is running.',
      'Spreadsheet: ' + spreadsheet.getName(),
      'Spreadsheet ID: ' + spreadsheet.getId(),
      'Sheet tab: ' + sheet.getName()
    ].join('\n'));
  }

  return html_('Bluebonnet booking endpoint is running.');
}

function getTargetSheet_() {
  const spreadsheet = getTargetSpreadsheet_();
  return spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.insertSheet(SHEET_NAME);
}

function getTargetSpreadsheet_() {
  const spreadsheet = SPREADSHEET_ID
    ? SpreadsheetApp.openById(SPREADSHEET_ID)
    : SpreadsheetApp.getActiveSpreadsheet();

  if (!spreadsheet) {
    throw new Error('No spreadsheet found. Bind this script to a Google Sheet or set SPREADSHEET_ID.');
  }

  return spreadsheet;
}

function ensureHeaders_(sheet) {
  const existing = sheet.getRange(1, 1, 1, HEADERS.length).getValues()[0];
  const needsHeaders = existing.join('\u0001') !== HEADERS.join('\u0001');

  if (needsHeaders) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    sheet.setFrozenRows(1);
  }
}

function normalizeParams_(params) {
  const normalized = {};

  Object.keys(MAX_LENGTHS).forEach(function (key) {
    normalized[key] = clean_(params[key], MAX_LENGTHS[key]);
  });

  return normalized;
}

function fillMissingTimestamps_(params) {
  const now = new Date().toISOString();

  if (!params.submitted_at) {
    params.submitted_at = now;
  }

  if (!params.form_loaded_at) {
    params.form_loaded_at = params.submitted_at;
  }
}

function validateSubmission_(params) {
  REQUIRED_FIELDS.forEach(function (field) {
    if (!params[field]) {
      throw new Error('Missing required field: ' + field);
    }
  });

  if (params.company) {
    throw new Error('Spam submission rejected.');
  }

  if (!EMAIL_RE.test(params.email)) {
    throw new Error('Invalid email address.');
  }

  if (!PHONE_RE.test(params.phone)) {
    throw new Error('Invalid phone number.');
  }

  const age = Number(params.student_age);
  if (!/^\d{1,2}$/.test(params.student_age) || age < 14 || age > 99) {
    throw new Error('Invalid student age.');
  }

  if (!ALLOWED_PACKAGES.has(params.package)) {
    throw new Error('Invalid package selected.');
  }

  if (!ALLOWED_AREAS.has(params.preferred_area)) {
    throw new Error('Invalid preferred area selected.');
  }

  validateTimestamps_(params);
}

function validateTimestamps_(params) {
  const submittedAt = new Date(params.submitted_at);
  const formLoadedAt = new Date(params.form_loaded_at);
  const now = Date.now();

  if (isNaN(submittedAt.getTime()) || isNaN(formLoadedAt.getTime())) {
    throw new Error('Invalid submission timestamps.');
  }

  if (submittedAt.getTime() < formLoadedAt.getTime()) {
    throw new Error('Submitted time cannot be earlier than load time.');
  }

  if (MIN_FORM_FILL_MS && submittedAt.getTime() - formLoadedAt.getTime() < MIN_FORM_FILL_MS) {
    throw new Error('Form submitted too quickly.');
  }

  if (now - submittedAt.getTime() > MAX_SUBMISSION_AGE_MS) {
    throw new Error('Submission is too old.');
  }

  if (submittedAt.getTime() - now > MAX_FUTURE_SKEW_MS) {
    throw new Error('Submission timestamp is too far in the future.');
  }
}

function rejectDuplicateSubmission_(params) {
  const cache = CacheService.getScriptCache();
  const fingerprint = [
    params.email.toLowerCase(),
    params.phone,
    params.package,
    params.preferred_area
  ].join('|');
  const digest = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, fingerprint);
  const cacheKey = 'booking:' + Utilities.base64EncodeWebSafe(digest);

  if (cache.get(cacheKey)) {
    throw new Error('Duplicate submission detected. Please wait a few minutes before trying again.');
  }

  cache.put(cacheKey, '1', DUPLICATE_WINDOW_SECONDS);
}

function clean_(value, maxLength) {
  const text = value ? String(value).trim() : '';
  const clipped = maxLength ? text.slice(0, maxLength) : text;
  return /^[=+\-@]/.test(clipped) ? "'" + clipped : clipped;
}

function safeMessage_(error) {
  return error && error.message ? error.message : 'Unknown error';
}

function html_(message, ok) {
  const text = String(message);

  return HtmlService
    .createHtmlOutput('<!doctype html><html><body><pre style="white-space:pre-wrap;font:14px system-ui,sans-serif;">' + escapeHtml_(text) + '</pre>' + postMessageScript_(ok, text) + '</body></html>')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function postMessageScript_(ok, message) {
  if (typeof ok !== 'boolean') {
    return '';
  }

  const payload = JSON.stringify({
    source: 'bluebonnet-booking',
    ok: ok,
    message: message
  });

  return '<script>(function(){try{window.top.postMessage(' + payload + ', "*");}catch(error){}}());</script>';
}

function escapeHtml_(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
