# Ali & Rayan: Ceuta 2026 Live Quiz — Local Hosting Guide

This guide provides step-by-step instructions for hosting the **Ali & Rayan Interactive Quiz Platform** completely locally on your PC, and ensuring **23+ players** can seamlessly connect at the same time using a **PC Mobile Hotspot** or **Smartphone Hotspot**.

---

## 1. Prerequisites on the Host PC

1. **Node.js**: Version 18, 20, or 22 installed on the hosting computer ([download from nodejs.org](https://nodejs.org/)).
2. **Wi-Fi Card or Hotspot**:
   - Option A: Windows Mobile Hotspot built into your laptop/desktop Wi-Fi.
   - Option B: A smartphone running a portable Wi-Fi Hotspot.
   - Option C: A classroom Wi-Fi router (internet is **not** required, only local Wi-Fi connectivity).

---

## 2. Installation & Starting the Server

1. Open your terminal (PowerShell, Command Prompt, or Terminal) in the project directory:
   ```bash
   cd Quiz-offline
   ```

2. Install dependencies (only required once):
   ```bash
   npm install
   ```

3. Launch the local server:
   ```bash
   npm run dev
   ```
   *(Or for production build: `npm run build && npm start`)*

4. When the server launches, you will see output like:
   ```text
   =========================================
   Ali & Rayan - Live Quiz & Study Server Started!
   Local LAN IP: http://192.168.137.1:3000
   Localhost:   http://localhost:3000
   Admin Code:  #*admin*# (enter as username)
   =========================================
   ```

---

## 3. Setting Up the Hotspot for 23 Players

### Option A: Windows PC Mobile Hotspot (Recommended)
1. In Windows, open **Settings → Network & Internet → Mobile hotspot**.
2. Set **"Share my Internet connection from"** to **Wi-Fi** (or Local Area Connection).
3. Click **Edit** and set:
   - **Network name (SSID):** e.g., `AliRayanQuiz`
   - **Network password:** e.g., `quiz2026`
   - **Network band:** Any available (2.4 GHz or 5 GHz). *5 GHz is faster; 2.4 GHz has greater range.*
4. Toggle **Mobile hotspot** to **ON**.
5. *Windows 10/11 natively supports up to 32 concurrent connected devices*, which easily supports all 23 students simultaneously.

### Option B: Smartphone Portable Hotspot
1. On your smartphone, turn on **Portable Hotspot / Personal Hotspot**.
2. Connect your **Host PC** to this hotspot network.
3. Connect all **23 student smartphones** to the same hotspot network.
4. Note: Some older Android phones default to a max connection limit of 10. Check **Hotspot settings → Manage devices / Max connections** and change it to **32** or **Unlimited**.

---

## 4. Allowing the Port Through Windows Firewall

To guarantee all 23 smartphones can reach the host PC on port 3000:

1. When you first run `npm run dev`, Windows Defender may show a pop-up saying **"Windows Defender Firewall has blocked some features of this app"**.
2. Check both **Private networks** and **Public networks**, then click **Allow access**.
3. **Manual 1-line command (PowerShell as Administrator):**
   ```powershell
   netsh advfirewall firewall add rule name="AliRayanQuizPort3000" dir=in action=allow protocol=TCP localport=3000
   ```

---

## 5. Host IP & QR Code Dynamic Adaptation

The platform includes **automatic network adapter detection** and **live in-app IP customization**:

1. On the Host PC, open your browser to:
   ```text
   http://localhost:3000
   ```
2. Enter `#*admin*#` into the nickname field to unlock **Host Screen** mode.
3. Look at the top banner in the Lobby:
   - You will see the detected IP (e.g., `http://192.168.137.1:3000`) and the QR code.
4. To adapt or change the IP:
   - Click the **"Edit IP / QR"** button in the lobby or click **"Wi-Fi LAN: [IP]"** in the top navigation bar.
   - The **Configure Host IP & QR Code** modal will open:
     - It displays all physical network cards and hotspot adapters detected on your PC.
     - Click on the Wi-Fi or Hotspot adapter (e.g. `Wi-Fi: 192.168.137.1`), or type a custom IP address.
     - Click **"Save & Update QR Code"**.
   - The QR code and address on the big projector screen update in real-time without needing a server restart!

---

## 6. Connecting the 23 Players

1. Instruct students to connect to the hotspot Wi-Fi (`AliRayanQuiz`).
2. Students open the camera on their phones:
   - **iPhone (iOS):** Open the default **Camera** app and point at the QR code on the projector screen. Tap the yellow link banner.
   - **Android:** Open **Camera** (Google Lens) or open Chrome/Safari and enter the IP shown on screen (e.g. `http://192.168.137.1:3000`).
3. Each student selects a character avatar and types their name.
4. They will instantly appear on the host PC's screen under **Connected Students (23)**.

---

## 7. Performance & 23-Player Concurrency Optimization

The application has been specifically engineered to handle 23+ concurrent clients with zero lag:
- **WebSocket Protocol (`socket.io`):** Rather than heavy HTTP polling, persistent bi-directional WebSockets are used.
- **Micro-payloads:** Each answer submission is under 150 bytes. 23 concurrent answers require less than 4 KB of total bandwidth, which is negligible even on weak 2.4 GHz mobile hotspot Wi-Fi.
- **Engine tuning:** Server heartbeat configured with `pingInterval: 10000ms` and `pingTimeout: 30000ms` to prevent accidental disconnects during intermittent mobile network bursts.
- **Client reconnect:** If any student locks their phone or refreshes their browser, the client automatically restores their session and score.

---

## 8. Quiz Workflow Overview

1. **Project Revision Summary (Study Briefing):**
   - Review key points of the 2026 Ceuta mass migration crisis: Causes, The Storm Event, Spain & Morocco Joint Response, Ceuta border enclave, and Human Impact.
   - Students can mark themselves "Ready for Quiz".
2. **Interactive Live Quiz:**
   - 10 targeted multiple-choice questions with 4 distinct geometric shapes/colors (Kahoot-style).
   - Real-time live scoreboards, answer distributions, speed bonuses, and flame streaks.
   - Final 3-tier podium celebration with confetti!
3. **Mystery Word Guess Game:**
   - Mystery words such as `CEUTA`, `ENCLAVE`, `MIGRATION`, `STORM`, and `FRONTIER`.
   - Admin can reveal hint letters in real-time while students guess on their phones.
