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
The reply form uses the normal FormSubmit multipart POST in a same page so audio attachments are preserved reliably. The main birthday page stays open, and FormSubmit redirects the submission tab to `thanks.html` after processing.


### Direct submission
The reply form submits with FormSubmit's AJAX endpoint so the visitor stays on the birthday page. The form sends the recorded voice note as multipart `FormData`, and `_captcha=false` is used to suppress the visible reCAPTCHA. FormSubmit documents cross-origin AJAX submissions and native multipart file uploads separately.
