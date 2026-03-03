# FA (FTU App) Mobile Prototype

A beginner-friendly, mobile-first prototype for your FTU project presentation.

This guide is written for someone with **zero coding experience** and explains everything from installing tools to running the app on your laptop and phone.

---

## 0) What this prototype does

- iPhone-style UI mockup
- FTU red branding + logo
- Student login
- Wallet with a real scannable QR image (refreshes every ~15 seconds)
- 6-digit fallback payment code (safer for live demo)
- Merchant panel to charge wallet
- Balance updates + transaction list

---

## 1) Before anything: what you need

You need:

1. A laptop (Windows recommended for this guide)
2. Internet connection (to install tools)
3. A browser (Chrome/Edge)
4. Optional: a phone on same Wi-Fi for presentation demo

---

## 2) Install required software (first-time setup)

You only need **one** method to run this app:
- **Method A (easiest): Python built-in server**
- **Method B: VS Code Live Server extension**

I recommend Method A.

### 2.1 Install VS Code

1. Go to: https://code.visualstudio.com/
2. Click **Download for Windows**
3. Open installer `.exe`
4. Keep defaults, but make sure these are checked:
   - Add to PATH
   - Add “Open with Code”
5. Click **Install**

### 2.2 Install Python (for Method A)

1. Go to: https://www.python.org/downloads/
2. Download Python 3.x for Windows
3. Open installer
4. **IMPORTANT**: check **“Add Python to PATH”**
5. Click **Install Now**

Check installation:

Open **Command Prompt (CMD)** and run:

```bat
python --version
```

If that fails, try:

```bat
python3 --version
```

If one of those shows a version (like `Python 3.11.x`), you're good.

### 2.3 (Optional) Install Git

If you want to clone from GitHub:

1. Go to: https://git-scm.com/download/win
2. Install with default settings

Check:

```bat
git --version
```


### 2.4 Surface Laptop 7 (ARM) notes — important

Great news: this project is a simple static web app, so it runs well on ARM Windows.

What to do differently on **Surface Laptop 7 (Snapdragon / ARM64)**:

1. **Install ARM64 versions when available**
   - VS Code: use Windows ARM64 installer from official site.
   - Python: prefer Windows ARM64 build from python.org.
   - Git: current Windows Git installer usually works (native/emulated), both are fine for this project.

2. **Commands are the same**
   - You still run exactly:

```bat
python -m http.server 5173
```

3. **If one tool is x64-only, it can still run under emulation**
   - Windows on ARM has Prism/x64 emulation, so beginner setup is still okay.

4. **Browser recommendation on ARM**
   - Edge (built-in) is perfect for demo and usually fastest on Surface ARM.

5. **How to confirm you are on ARM Windows**
   - Go to **Settings → System → About → System type**
   - It should say ARM-based processor.

Bottom line: for this FA prototype, your Surface Laptop 7 should run it with the **same workflow** as Intel laptops.

---

## 3) Download the project files

You have 2 common ways.

### Option 1: Download ZIP (easiest for beginners)

1. Open your repository page on GitHub
2. Click **Code** → **Download ZIP**
3. Extract ZIP to a folder, for example:
   - `C:\Users\YourName\Desktop\FAf`

### Option 2: Clone with Git

Open CMD and run:

```bat
cd %USERPROFILE%\Desktop
git clone <YOUR_REPO_URL>
cd FAf
```

Replace `<YOUR_REPO_URL>` with your actual GitHub URL.

---

## 4) Open project in VS Code

1. Open VS Code
2. Click **File → Open Folder...**
3. Select the `FAf` folder
4. You should see files:
   - `index.html`
   - `styles.css`
   - `app.js`
   - `assets/ftu-logo.svg`
   - `README.md`

---

## 5) Run the app locally (Method A – recommended)

### Windows CMD (exact commands)

1. Open **Command Prompt**
2. Go to project folder:

```bat
cd C:\Users\YourName\Desktop\FAf
```

3. Start local server:

```bat
python -m http.server 5173
```

If `python` doesn’t work, use:

```bat
python3 -m http.server 5173
```

4. Open browser and go to:

```text
http://localhost:5173
```

✅ You should now see the FA app.

---

## 6) Alternative run method (Method B – VS Code Live Server)

Use this if Python command gives issues.

1. In VS Code, open **Extensions** (left panel)
2. Search: `Live Server` by Ritwick Dey
3. Install it
4. Open `index.html`
5. Click **Go Live** (bottom-right of VS Code)
6. Browser opens automatically

---

## 7) Login and test flow (for presentation practice)

Use any demo account (all passwords are `1`), for example:

- Student ID: `2312280041`
- PIN: `1`

### Test steps

1. Login as student
2. On home, click **Wallet**
3. Note the 6-digit code below the token box
4. Open Wallet → Pay and copy the 6-digit code
5. In right-side merchant panel:
   - choose service
   - enter amount (e.g. 35000)
   - paste 6-digit code
6. Click **Charge Student Wallet**
7. Verify:
   - success message appears
   - student balance decreases
   - transaction appears in recent history

### Extra tests you can show teacher

- **Expired token test**: wait 15+ sec, use old code → should fail
- **Reuse token test**: use same code twice → second charge should fail
- **Insufficient balance test**: charge huge amount → should fail

---

## 8) Run on phone + laptop for class demo (best setup)

### Goal
- Student app on phone
- Merchant panel on laptop

### Steps

1. Connect phone + laptop to the **same Wi-Fi**
2. Start server on laptop:

```bat
cd C:\Users\YourName\Desktop\FAf
python -m http.server 5173
```

3. Find laptop local IP:

```bat
ipconfig
```

Look for IPv4, like `192.168.1.45`

4. On phone browser, open:

```text
http://192.168.1.45:5173
```

(replace with your real IP)

5. Keep laptop screen on merchant panel
6. Show student side on phone

---

## 9) Exactly how to present in class (script)

1. “This is FA FTU mobile super-app prototype.”
2. Login with student ID.
3. Show Home with feature circles.
4. Open Wallet and show rotating token.
5. Merchant enters code and amount.
6. Click charge.
7. Show balance reduced + transaction list updated.
8. Mention: “This is phase-1 prototype; backend/payment integrations are future phase.”

---

## 10) Troubleshooting (very important)

### Problem: `python is not recognized`
- Reinstall Python and check **Add Python to PATH**
- Restart CMD
- Try `python3 -m http.server 5173`

### Problem: Browser says cannot access localhost
- Confirm CMD is still running and shows server message
- Ensure you are in correct project folder before running server

### Problem: Phone cannot open laptop IP
- Same Wi-Fi on both devices
- Turn off VPN
- Allow Python through Windows Firewall
- Check correct IP from `ipconfig`

### Problem: Port already in use
Use another port:

```bat
python -m http.server 8080
```

Then open:

```text
http://localhost:8080
```

---

## 11) File structure (what each file is)

- `index.html` → app layout / UI structure
- `styles.css` → colors, spacing, iPhone-like design
- `app.js` → login + wallet logic + token + merchant charge
- `assets/ftu-logo.svg` → legacy FTU logo
- `assets/ftu-seal.svg` → current FTU seal logo used on login and menu watermark

---

## 12) Important disclaimer

This is a **course prototype** only.

It is intentionally simplified and does **not** include:
- real bank integration
- production-grade security
- real backend database

For a real deployment, you would add secure backend APIs, encrypted token validation, user authentication infrastructure, and regulated payment provider integration.


### Problem: QR image does not show
- The QR image is generated from `api.qrserver.com`, so make sure your internet is connected.
- If blocked by network, still use the 6-digit fallback code in the Wallet screen for demo.


### Receive screen (demo top-up)
- Go to **Wallet → Receive**.
- Enter amount and tap **Generate new top-up QR**.
- Tap **I paid this QR (demo add balance)** to simulate successful bank transfer and add money to wallet balance.


## 13) How to import your own local photo/logo

If you want to use your own PNG/JPG logo file:

1. Copy your image into the `assets/` folder (example: `assets/my-logo.png`).
2. Update login logo in `index.html`:

```html
<img src="assets/my-logo.png" class="logo" alt="FTU Logo" />
```

3. Update menu watermark in `styles.css` (`#homeScreen::before`):

```css
background: url('assets/my-logo.png') center center / contain no-repeat;
```

4. Save files and refresh browser (`Ctrl + F5`).

Tip: Use a square image (for example 1024x1024) with transparent background for best result.
