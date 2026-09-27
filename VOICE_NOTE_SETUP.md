# Voice note setup

The website records a voice note in the browser and attaches it to the reply form. The form is submitted as `multipart/form-data` to the FormSubmit endpoint configured in `config.js`.

## One-time setup

1. Open `config.js`.
2. Replace `YOUR_EMAIL@example.com` with the email address that should receive Shejal's reply.
3. Deploy the site through GitHub Pages (HTTPS). The browser will ask Shejal for microphone permission when she taps **Start recording**.

## Voice note behavior

- The voice note is **required** before the reply can be sent.
- After recording, a playable preview appears so she can listen before submission.
- A note can be recorded again before sending.
- Maximum recording time is 4 minutes.
- The page targets voice-note files below 15 MB.
- FormSubmit's current documented limit is **10 MB total across all uploaded files in one form submission**. That server-side limit cannot be increased from the website code alone.

### Reply submission behavior
The reply form uses FormSubmit's native `multipart/form-data` POST inside a hidden iframe. This keeps the visitor on the same birthday page and preserves the voice note as a real attachment. No new tab or visible thank-you page is opened.

### Why native POST is used
FormSubmit documents file uploads with a normal `POST` form using `enctype="multipart/form-data"`, while its AJAX documentation shows JSON-based field submission. The site therefore uses native multipart submission for the voice note and the hidden iframe only to keep the user on the page.
