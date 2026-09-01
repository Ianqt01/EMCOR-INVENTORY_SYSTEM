# EMCOR Appliance Store — Web-Based Inventory System

A mobile-responsive inventory system for EMCOR, built with:
- **Database:** Google Sheets
- **Backend:** Google Apps Script (REST-like API)
- **Frontend:** Plain HTML/CSS/JS (no build tools needed), low-fidelity wireframe styling
- **Hosting:** Vercel (frontend) + Apps Script Web App (backend)
- **Security:** hashed + salted passwords, math CAPTCHA, email-based 2FA (OTP), session tokens, account lockout, role-based access (admin vs staff)

## Features (navigation menu)
1. Dashboard — stats + recent transactions
2. Products / Inventory — search, add products, low-stock flag
3. Stock In — receive stock from suppliers
4. Stock Out — record sales
5. Suppliers — manage supplier list
6. Reports — inventory value, sales, low stock, activity log (printable)
7. User Management — admin-only, manage staff/admin accounts

---

## PART 1 — Set up the Database (Google Sheets) & Backend (Apps Script)

1. Go to [sheets.google.com](https://sheets.google.com) and create a **new blank spreadsheet**. Name it `EMCOR Inventory DB`.
2. In the sheet, go to **Extensions > Apps Script**. This opens the script editor bound to your sheet.
3. Delete any starter code in `Code.gs`. Copy the entire contents of `apps-script/Code.gs` (from this package) and paste it in.
4. Click the gear icon (Project Settings) on the left, or click the `+` next to "Files" and add a new file named exactly `appsscript.json` (you may need to enable "Show manifest file" in Project Settings first). Replace its contents with `apps-script/appsscript.json` from this package.
5. In the toolbar function dropdown, select `setup` and click **Run** (▶️). This creates all the sheets (Users, Products, Suppliers, StockIn, StockOut, ActivityLog) with headers, and one default admin account.
   - The first time you run it, Google will ask you to authorize the script — click through **Advanced > Go to (project name) [unsafe]** (this is normal for your own scripts) and allow the permissions.
6. Open the **Users** sheet. Find the row for `admin` and replace the placeholder `youremail@example.com` in the **Email** column with a real email address you can access — this is where your 2FA login codes will be sent.
7. Default login: **username:** `admin` **password:** `Admin123!` — change this after your first login (via the Users page, or manually re-hash in the sheet if needed).

### Deploy the Web App
1. In the Apps Script editor, click **Deploy > New deployment**.
2. Click the gear icon next to "Select type" and choose **Web app**.
3. Settings:
   - Description: `EMCOR API v1`
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Click **Deploy**, authorize again if asked, and **copy the Web App URL** (ends in `/exec`). You'll need this in Part 2.

> Note: every time you edit `Code.gs` after this, use **Deploy > Manage deployments > Edit (pencil icon) > New version > Deploy** so your changes go live — the URL stays the same.

---

## PART 2 — Set up the Frontend (Visual Studio Code)

1. Install [Visual Studio Code](https://code.visualstudio.com/) if you don't have it, and (optional but handy) the **Live Server** extension for local preview.
2. Open the `frontend/` folder from this package in VS Code (`File > Open Folder`).
3. Open `frontend/js/api.js` and replace:
   ```js
   const API_URL = "PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE";
   ```
   with the Web App URL you copied in Part 1 (keep the quotes).
4. (Optional local test) Right-click `index.html` → **Open with Live Server**, or just double-click `index.html` to open it in your browser. Try logging in with the admin account — you should get an email with a 6-digit code.

---

## PART 3 — Deploy the Frontend to Vercel

1. Go to [vercel.com](https://vercel.com) and sign up/log in (you can use your GitHub account).
2. **Option A — via GitHub (recommended):**
   - Push the `frontend/` folder to a new GitHub repository.
   - In Vercel, click **Add New > Project**, import that repository.
   - Framework Preset: **Other**. Root Directory: `frontend` (if your repo contains the whole `emcor-system` folder) or leave blank if the repo *is* the frontend folder.
   - Click **Deploy**.
3. **Option B — via Vercel CLI (no GitHub needed):**
   ```bash
   npm install -g vercel
   cd frontend
   vercel
   ```
   Follow the prompts (link/create a project, accept defaults). Run `vercel --prod` when ready to publish.
4. Once deployed, Vercel gives you a live URL like `https://emcor-inventory.vercel.app`. Open it and confirm login → 2FA → dashboard all work.

---

## PART 4 — Turn it into a mobile app (MIT App Inventor)

Since the frontend is already mobile-responsive, you can wrap it as an app using MIT App Inventor's **WebViewer** component:

1. Go to [ai2.appinventor.mit.edu](https://ai2.appinventor.mit.edu) and create a new project.
2. From the **Palette > User Interface**, drag a **WebViewer** component onto the screen and resize it to **Fill Parent** (width and height).
3. Select the WebViewer, and in its **Properties**, set **HomeUrl** to your Vercel URL from Part 3.
4. (Recommended) In **Screen1** properties, disable scrolling on the screen itself so only the WebViewer scrolls, and set the screen's **Icon** to your EMCOR logo.
5. Test it in the **MIT AI Companion app** on your phone (scan the QR code), then use **Build > App (.apk)** when ready to produce an installable Android app.

---

## Security features included
- Passwords are never stored in plain text — SHA-256 hash + unique random salt per user.
- Simple math CAPTCHA required before every login attempt (prevents basic bots).
- Email-based two-factor authentication (6-digit OTP, 5-minute expiry) required after a correct password.
- Session tokens expire after 8 hours; every protected API call re-validates the token server-side.
- Accounts lock for 15 minutes after 5 failed password attempts.
- Role-based access: only `admin` accounts can view/manage Users; all actions are written to the Activity Log.
- Requests are sent as `text/plain` bodies (not `application/json`) specifically to avoid CORS preflight limitations in Apps Script — this is a deliberate, documented workaround, not an oversight.

## Folder structure
```
emcor-system/
├── apps-script/
│   ├── Code.gs            <- backend logic (paste into Apps Script editor)
│   └── appsscript.json    <- manifest (paste into Apps Script editor)
├── frontend/
│   ├── index.html         <- Login
│   ├── 2fa.html            <- Two-factor verification
│   ├── dashboard.html
│   ├── products.html
│   ├── stock-in.html
│   ├── stock-out.html
│   ├── suppliers.html
│   ├── reports.html
│   ├── users.html          <- admin only
│   ├── css/style.css
│   ├── js/ (api.js, auth.js, nav.js, + one file per page)
│   └── vercel.json
├── wireframes/             <- the approved low-fidelity SVG wireframes
└── README.md                <- this file
```

## Troubleshooting
- **"Failed to fetch" / blank data:** double-check `API_URL` in `js/api.js` matches your deployed Apps Script `/exec` URL exactly, and that the deployment's access is set to "Anyone".
- **No OTP email arrives:** check the `Email` column for that user in the Users sheet is a real, correct address, and check spam folder. `MailApp` sends from your own Google account.
- **"invalid_session" loops back to login:** your session token expired (8 hours) or you logged out elsewhere — just log in again.
- **Changes to Code.gs not showing up:** you must create a **new deployment version** (Deploy > Manage deployments > Edit > New version) — saving the script alone does not update a live Web App.
