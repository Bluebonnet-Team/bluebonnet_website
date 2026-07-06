# Google Sheets Booking Backend

Use this once to connect `book.html` to a Google Sheet.

1. Create a new Google Sheet for booking requests.
2. In the Sheet, go to `Extensions > Apps Script`.
3. Paste the contents of `google-sheets-backend.gs` into Apps Script.
4. Click `Deploy > New deployment`.
5. Choose `Web app`.
6. Set `Execute as` to `Me`.
7. Set `Who has access` to `Anyone`.
8. Deploy and copy the web app URL that ends in `/exec`.
9. Copy the Google Sheet ID from the sheet URL and set `SPREADSHEET_ID` in `google-sheets-backend.gs`.
10. In `book.html`, set the `<form id="bookingForm">` `action` to that `/exec` URL.
11. Submit a test booking from the website.

Notes:

- Do not use the `/dev` test URL on the live site. `/dev` only works for the signed-in script owner.
- The frontend now validates the endpoint format and warns if it is still on `/dev`.
- After changing `google-sheets-backend.gs`, deploy a new Apps Script version. For an existing web app, use `Deploy > Manage deployments > Edit > Version: New version > Deploy` to keep the same `/exec` URL. The live `/exec` URL keeps running the old code until you redeploy.
- The backend now rejects obvious spam with a honeypot field, required-field checks, and short duplicate throttling. Client-side timestamps are recorded when available, but missing timestamps no longer block a valid booking.
- The backend posts an `ok` or error message back to the hidden iframe so the website can show real send failures instead of assuming every iframe load succeeded.
- After redeploying, open your `/exec?debug=1` URL once to confirm the exact spreadsheet ID and tab name the web app is writing to.

The script will create a `Booking Requests` tab automatically and append each valid form submission as a new row.
