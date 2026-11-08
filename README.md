# Ssupp - Encrypted Messaging & WebRTC Calls App

**Ssupp** is a WhatsApp-inspired messaging application with an **Instagram-style @username discovery and request system**, **Display Picture (DP) setup**, **end-to-end encryption (E2EE)** for messages & calls, photo & sticker sharing, voice note recording, and WebRTC voice & video calls.

---

## 🛡️ Agentic Threat Summary Table

| Threat Zone | Risk Scenario | Vulnerability / Impact | Countermeasure & Mitigation Strategy |
| :--- | :--- | :--- | :--- |
| **Input Surfaces** | Malicious photo upload or XSS payload in chat message | Reflected XSS or script execution in DOM | Input sanitization, strict React JSX text encoding, file type restrictions for DP and photo attachments. |
| **Planning & Reasoning** | Prompt injection via incoming message into Gemini smart replies | LLM hijacking or unexpected reply suggestion | Isolated prompt framing, strict output JSON schema parsing & sanitization in Express backend. |
| **Tool Execution** | Dynamic payload execution in AI sticker / reply API | Server-side execution / crash | Null-safe deserialization middleware in `server.ts` and API fallback ladders. |
| **Memory & State** | Unauthenticated user impersonation or session hijacking | Intercepting another user's encrypted messages | Local Web Crypto API key isolation (RSA-OAEP 2048-bit per user), local private keys never transmitted over network. |
| **Inter-System Communication** | Eavesdropping or MitM attack on WebSocket / WebRTC streams | Intercepting cleartext messages or call audio | E2EE hybrid encryption (AES-256-GCM + RSA-OAEP) and 60-digit security verification code comparison. |

---

## ✨ Features

- 📱 **WhatsApp Aesthetic UI**: Authentic WhatsApp dark mode theme (`#0b141a`, `#111b21`, `#00a884`) with doodle background pattern, day dividers, double ticks, and unread badges.
- 📸 **DP Setup & Profile Customization**: Upload custom photo DP, choose preset avatars, edit Display Name, Username (`@username`), and Bio.
- 👥 **Instagram-Style Username & Request System**:
  - Search any user by `@username`.
  - Send message request with optional introductory greeting.
  - Review **Incoming Requests** ("Accept & Chat E2EE", "Decline", "Block").
  - Review **Outgoing Requests**.
- 🔒 **End-to-End Encryption (E2EE)**:
  - Web Crypto API (`SubtleCrypto`) RSA-OAEP 2048-bit + AES-256-GCM hybrid encryption.
  - WhatsApp-style **60-digit Security Code Verification Modal** & fingerprint comparison.
- 🖼️ **Photos, Stickers & AI Sticker Generator**:
  - Upload & view photo attachments with lightbox preview.
  - Built-in sticker packs + AI custom sticker creator powered by Gemini (`/api/gemini/generate-sticker`).
- 🎙️ **Voice Notes**:
  - Real browser microphone recording using Web `MediaRecorder` API.
  - Waveform audio player with play/pause, scrub, and 1x / 1.5x / 2x speed controls.
- 📞 **WebRTC Voice & Video Calls**:
  - Full-screen WhatsApp Call UI with real camera & microphone media streams (`getUserMedia`).
  - Mute mic, toggle video, flip camera, screen share, duration timer, and ringtone sound synth.
  - **Calls Log** history tab.
- 🤖 **AI Smart Replies**:
  - Gemini-powered quick reply suggestions (`/api/gemini/smart-reply`) with model fallback ladder (`gemini-3.6-flash` -> `gemini-3.1-flash-lite` -> `gemini-flash-latest` -> `gemini-3.7-flash`).

---

## 🛠️ Step-by-Step Walkthrough for Testing

1. **Setup Display Picture (DP)**:
   - Click your profile avatar at the bottom of the left sidebar.
   - Click "Change DP" to upload a local photo or select one of the preset avatars.
   - Update your display name or `@username` and click "Save DP & Profile".
2. **Instagram Username Search & Friend Requests**:
   - Click the `+` User Request button in the header or sidebar.
   - Go to **Search @Username** tab and search `@maria_vance` or `@david_k`.
   - Click **Send Request**, write an optional greeting, and submit.
   - Switch active user from the bottom sidebar icon to `@maria_vance` to accept the request!
3. **End-to-End Encrypted Messaging**:
   - Open a chat (e.g. Alex Rivera `@alex_sky`).
   - Notice the "🔒 Messages and calls are end-to-end encrypted" banner.
   - Click **Verify Code** in the top header to inspect the 60-digit security code grid and QR code.
4. **Photos, Stickers & AI Sticker Generation**:
   - Click the paperclip icon -> **Send Photos** to send an image.
   - Click the smile icon -> **AI Sticker Generator** tab, type `Party avocado`, and click generate!
5. **Voice Notes**:
   - Tap or hold the microphone icon in the chat input bar to record real audio.
   - Click **Send Voice** to post the audio waveform message.
   - Play the voice note and toggle speed (1x, 1.5x, 2x).
6. **Voice & Video Calls**:
   - Click the Phone or Video icon in the chat header to initiate a call.
   - Accept the camera/mic permission to view your live camera stream.
   - Mute mic, toggle video, or click end call to save to the **Calls Log**.

---

## 🚀 Cloud Run Deployment & Secret Manager Setup

```bash
# 1. Create and populate Secret Manager secret for GEMINI_API_KEY
gcloud secrets create GEMINI_API_KEY --replication-policy="automatic"
echo -n "YOUR_GEMINI_API_KEY" | gcloud secrets versions add GEMINI_API_KEY --data-file=-

# 2. Grant Cloud Run service account access to read secret
gcloud secrets add-iam-policy-binding GEMINI_API_KEY \
  --member="serviceAccount:YOUR_PROJECT_NUMBER-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"

# 3. Deploy to Cloud Run
gcloud run deploy ssupp-app \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-secrets="GEMINI_API_KEY=GEMINI_API_KEY:latest"

# 4. Apply mandatory verification label
gcloud run services update ssupp-app \
  --update-labels=dev-tutorial=cloud-run-ai-challenge \
  --region=us-central1
```

---

## 🔒 Firestore Security Rules (Owner-Bound Access)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    match /chats/{chatId} {
      allow read, write: if request.auth != null && request.auth.uid in resource.data.participantIds;
    }
  }
}
```
