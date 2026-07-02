# Google Sheets Booking Backend

Use this once to connect `book.html` to a Google Sheet.

1. Create a new Google Sheet for booking requests.
2. In the Sheet, go to `Extensions > Apps Script`.
3. Paste the contents of `google-sheets-backend.gs` into Apps Script.
4. Click `Deploy > New deployment`.
5. Choose `Web app`.
6. Set `Execute as` to `Me`.
7. Set `Who has access` to `Anyone`.
8. Deploy and copy the web app URL.
9. In `book.html`, replace `PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE` with that URL.
10. Submit a test booking from the website.

The script will create a `Booking Requests` tab automatically and append each form submission as a new row.
