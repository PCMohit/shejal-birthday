# Voice note setup

The website records a voice note in the browser and attaches it to the existing reply form. The form is submitted as `multipart/form-data` to the FormSubmit endpoint configured in `config.js`.

## One-time setup

1. Open `config.js`.
2. Replace `YOUR_EMAIL@example.com` with the email address that should receive Shejal's reply.
3. Deploy the site through GitHub Pages (HTTPS). The browser will ask Shejal for microphone permission when she taps **Start recording**.

The recorder allows up to 3 minutes per note. FormSubmit documents a 10 MB combined upload limit, so the recorder uses a compressed audio format where the browser supports it.
