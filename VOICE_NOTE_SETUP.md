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


## Submission confirmation
The form uses FormSubmit's multipart upload flow and redirects successful submissions to `thanks.html`. The parent page listens for the same-origin success message so it does not treat an arbitrary cross-origin iframe load as a successful submission.
