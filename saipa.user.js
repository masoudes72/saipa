// ==UserScript==
// @name         Saipa Automation Bot
// @namespace    http://tampermonkey.net/
// @version      2025-07-21
// @description  bot
// @author       masoud
// @match        *://saipa.iranecar.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

(function () {
    'use strict';

    // ===================================================================================
    // =========== مرحله ۱: لوگوی خود را اینجا جای‌گذاری کنید ===============================
    // ===================================================================================
    // ابتدا لوگوی خود را به فرمت Base64 تبدیل کرده و رشته متنی آن را در خط زیر قرار دهید
    const logoBase64 = "PASTE_YOUR_BASE64_STRING_HERE";
    // ===================================================================================


    // --- Global State for Auto-Captcha ---
    let isAutoCaptchaEnabled = GM_getValue('autoCaptchaEnabled', true);

    // --- Start: Modern Dark/Glowing Styles ---
    const styles = `
        :root {
            --dark-bg: #1A1B26;
            --dark-surface: #292A3D;
            --dark-primary: #33A1FF;
            --dark-primary-glow: rgba(51, 161, 255, 0.3);
            --dark-secondary: #8C67FF;
            --dark-text: #F0F0F0;
            --dark-text-muted: #828799;
            --dark-border: #4D5066;
            --dark-success: #28a745;
            --dark-danger: #e53935;
            --dark-warning: #ffc107;
            --dark-radius: 10px;
            --dark-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
            --dark-transition: 0.25s ease-out;
        }

        /* Main container styling */
        .saipa-bot-container {
            display: none;
            flex-direction: column;
            gap: 0;
            position: fixed !important;
            top: 15px !important;
            left: 15px !important;
            width: 480px !important;
            max-width: calc(100% - 30px) !important;
            height: auto !important;
            max-height: calc(100vh - 30px);
            background: var(--dark-bg) !important;
            color: var(--dark-text) !important;
            border: 1px solid var(--dark-border) !important;
            padding: 0 !important;
            z-index: 10000 !important;
            border-radius: var(--dark-radius) !important;
            box-shadow: var(--dark-shadow) !important;
            font-family: 'Vazirmatn', sans-serif !important;
            backdrop-filter: blur(10px);
            background: rgba(26, 27, 38, 0.85) !important;
            overflow: hidden;
        }

        /* Header Styling */
        .saipa-bot-header {
            width: 100%;
            background: rgba(0,0,0,0.2);
            color: var(--dark-text);
            padding: 12px 18px;
            border-bottom: 1px solid var(--dark-border);
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-sizing: border-box;
            flex-shrink: 0;
        }
        .saipa-bot-logo-img {
            height: 40px;
            width: 40px;
            border-radius: 50%;
            object-fit: cover;
            border: 2px solid var(--dark-primary);
        }
        .saipa-bot-header-title {
            font-size: 1.2em;
            font-weight: 700;
            text-shadow: 0 0 5px var(--dark-primary-glow);
        }
        .header-left-panel, .header-right-panel {
             display: flex;
             align-items: center;
             gap: 12px;
        }
        #saipa-bot-header-time, #saipa-bot-header-user {
             font-family: 'monospace';
             font-size: 0.9em;
             background-color: var(--dark-surface);
             padding: 5px 10px;
             border-radius: 6px;
             border: 1px solid var(--dark-border);
             color: var(--dark-text-muted);
        }

        /* Content area styles */
        .saipa-bot-content-area {
            flex-grow: 1;
            overflow-y: auto !important;
            padding: 24px;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 20px;
            width: 100%;
        }

        /* General Card Styling */
        .saipa-bot-card {
            display: flex;
            flex-direction: column;
            gap: 18px;
            padding: 22px;
            background-color: var(--dark-surface);
            border-radius: var(--dark-radius);
            width: 100%;
            max-width: 400px;
            margin: auto;
            border: 1px solid var(--dark-border);
            box-sizing: border-box;
        }

        /* Input field styles */
        .saipa-bot-input {
            height: 48px !important;
            width: 100% !important;
            padding: 12px !important;
            font-size: 16px !important;
            border: 1px solid var(--dark-border) !important;
            border-radius: var(--dark-radius) !important;
            box-sizing: border-box !important;
            background-color: var(--dark-bg) !important;
            color: var(--dark-text) !important;
            transition: var(--dark-transition) !important;
        }
        .saipa-bot-input::placeholder {
            color: var(--dark-text-muted);
        }
        .saipa-bot-input:focus {
            outline: none !important;
            border-color: var(--dark-primary) !important;
            box-shadow: 0 0 10px var(--dark-primary-glow);
        }
        .saipa-bot-captcha-image {
            height: 70px !important;
            margin: 5px auto !important;
            border: 1px solid var(--dark-border) !important;
            border-radius: var(--dark-radius) !important;
            display: block;
            background-color: white;
        }

        /* Modern Button styles */
        .saipa-bot-button {
            height: 45px !important;
            width: 100% !important;
            color: var(--dark-text) !important;
            background: linear-gradient(to right, var(--dark-primary), var(--dark-secondary));
            font-size: 15px !important;
            font-weight: 600 !important;
            border: none !important;
            border-radius: var(--dark-radius) !important;
            cursor: pointer !important;
            transition: var(--dark-transition) !important;
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            padding: 0 18px !important;
            text-transform: uppercase;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
            letter-spacing: 0.5px;
        }
        .saipa-bot-button:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 4px 15px var(--dark-primary-glow);
            filter: brightness(1.1);
        }
        .saipa-bot-button:disabled {
            background: var(--dark-border);
            opacity: 0.7;
            cursor: not-allowed;
            box-shadow: none;
        }
        .saipa-bot-button-submit { background: linear-gradient(to right, #28a745, #228f3a);
        }
        .saipa-bot-button-secondary { background: var(--dark-surface); border: 1px solid var(--dark-border) !important;
        }

        /* Search Area & Status */
         #search-status, #process-status {
             margin-top: 15px;
             font-weight: 500;
             padding: 12px;
             background-color: rgba(0,0,0,0.2);
             border: 1px solid var(--dark-border);
             border-radius: var(--dark-radius);
             text-align: center;
             color: var(--dark-text-muted);
             width: 100%;
             box-sizing: border-box;
        }

        /* Galaxy Search Button Styles (Re-integrated from your original script) */
        .btn {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            max-width: 250px;
            margin: 15px auto 0 auto !important;
            overflow: hidden;
            height: 3.5rem;
            background-size: 300% 300%;
            backdrop-filter: blur(1rem);
            border-radius: 5rem;
            transition: 0.5s;
            animation: gradient_301 5s ease infinite;
            border: double 4px transparent;
            background-image: linear-gradient(#212121, #212121), linear-gradient(137.48deg, #ffdb3b 10%, #fe53bb 45%, #8f51ea 67%, #0044ff 87%);
            background-origin: border-box;
            background-clip: content-box, border-box;
        }
        #container-stars { position: absolute; z-index: -1; width: 100%; height: 100%; overflow: hidden;
        transition: 0.5s; backdrop-filter: blur(1rem); border-radius: 5rem; }
        .btn strong { z-index: 2;
        font-family: 'Vazirmatn', sans-serif; font-size: 16px; letter-spacing: 2px; color: #ffffff; text-shadow: 0 0 4px white; font-weight: 700;
        }
        #glow { position: absolute; display: flex; width: 12rem;
        }
        .circle { width: 100%; height: 30px; filter: blur(2rem); animation: pulse_3011 4s infinite;
        z-index: -1; }
        .circle:nth-of-type(1) { background: rgba(254, 83, 186, 0.636);
        }
        .circle:nth-of-type(2) { background: rgba(142, 81, 234, 0.704);
        }
        .btn:hover #container-stars { z-index: 1; background-color: #212121;
        }
        .btn:hover { transform: scale(1.1);
        }
        .btn:active { border: double 4px #fe53bb; background-origin: border-box; background-clip: content-box, border-box;
        animation: none; }
        #stars { position: relative; background: transparent; width: 200rem; height: 200rem;
        }
        #stars::after { content: ""; position: absolute; top: -10rem; left: -100rem; width: 100%;
        height: 100%; animation: animStarRotate 90s linear infinite; background-image: radial-gradient(#ffffff 1px, transparent 1%); background-size: 50px 50px;
        }
        #stars::before { content: ""; position: absolute; top: 0; left: -50%; width: 170%;
        height: 500%; animation: animStar 60s linear infinite; background-image: radial-gradient(#ffffff 1px, transparent 1%); background-size: 50px 50px; opacity: 0.5;
        }
        @keyframes animStar { from { transform: translateY(0); } to { transform: translateY(-135rem);
        } }
        @keyframes animStarRotate { from { transform: rotate(360deg);
        } to { transform: rotate(0); } }
        @keyframes gradient_301 { 0% { background-position: 0% 50%;
        } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%;
        } }
        @keyframes pulse_3011 { 0% { transform: scale(0.75);
        box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.7); } 70% { transform: scale(1);
        box-shadow: 0 0 0 10px rgba(0, 0, 0, 0); } 100% { transform: scale(0.75);
        box-shadow: 0 0 0 0 rgba(0, 0, 0, 0); } }

        /* Floating Buttons */
        #saipa-bot-toggle-button-new {
            position: fixed !important;
            top: 25px !important;
            right: 25px !important;
            width: auto !important;
            height: 45px !important;
            padding: 0 20px !important;
            display: flex !important;
            align-items: center !important;
            gap: 10px !important;
            color: var(--dark-text) !important;
            background: var(--dark-primary) !important;
            border-radius: 28px !important;
            cursor: pointer !important;
            z-index: 10001 !important;
            border: none !important;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3) !important;
            transition: var(--dark-transition) !important;
        }
        #saipa-bot-toggle-button-new:hover {
            background: var(--dark-secondary) !important;
            transform: translateY(-2px) !important;
        }
        #saipa-bot-toggle-button-new svg {
            width: 24px !important;
            height: 24px !important;
            fill: white !important;
        }

        /* Action Buttons */
        .saipa-action-button {
            position: fixed !important;
            right: 25px !important;
            z-index: 10001 !important;
            width: 56px !important;
            height: 56px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            border-radius: 50% !important;
            background: var(--dark-surface) !important;
            border: 1px solid var(--dark-border) !important;
            cursor: pointer !important;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3) !important;
            transition: var(--dark-transition) !important;
        }
        .saipa-action-button:hover {
            transform: translateY(-3px) scale(1.05) !important;
            box-shadow: 0 0 20px var(--dark-primary-glow) !important;
            border-color: var(--dark-primary) !important;
        }
        .saipa-action-button svg {
            width: 24px !important;
            height: 24px !important;
            fill: var(--dark-text) !important;
            transition: var(--dark-transition) !important;
        }
        .saipa-action-button:hover svg {
            fill: var(--dark-primary) !important;
        }
        .saipa-button-new-reload {
            bottom: 25px !important;
            background-color: var(--dark-success) !important;
        }
        .saipa-button-new-clear {
            bottom: 95px !important;
            background-color: var(--dark-danger) !important;
        }
        .saipa-button-new-captcha {
            bottom: 165px !important;
            background-color: var(--dark-warning) !important;
        }
        .saipa-button-new-update {
            bottom: 235px !important;
            background-color: var(--dark-secondary) !important;
        }
        .saipa-button-new-captcha.auto-on svg {
            fill: lightgreen !important;
        }

        /* Product Selection Card Styling */
        .saipa-product-selection-container {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
            gap: 20px;
            width: 100%;
            padding: 10px;
            box-sizing: border-box;
        }
        .saipa-product-card {
            background-color: var(--dark-surface);
            border-radius: var(--dark-radius);
            border: 1px solid var(--dark-border);
            cursor: pointer;
            transition: var(--dark-transition);
            overflow: hidden;
            text-align: center;
        }
        .saipa-product-card:hover {
            transform: translateY(-5px);
            border-color: var(--dark-primary);
            box-shadow: 0 8px 20px var(--dark-primary-glow);
        }
        .saipa-product-card img {
            width: 100%;
            height: 120px;
            object-fit: cover;
            background-color: #fff; /* Fallback for transparent images */
        }
        .saipa-product-card-title {
            padding: 15px 10px;
            font-weight: 600;
            font-size: 1em;
            color: var(--dark-text);
        }
    `;
    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    // Add Google Font for Material look
    const fontLink = document.createElement('link');
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;500;600;700&display=swap';
    fontLink.rel = 'stylesheet';
    document.head.appendChild(fontLink);
    document.head.appendChild(styleSheet);
    // --- End of Styles ---

    // ===== Live Console Styles (string only; injected on init) =====
    const liveConsoleStyles = `
.saipa-live-console {
  position: fixed; bottom: 16px; right: 16px;
  width: 360px; max-height: 60vh;
  background: rgba(18,18,24,0.95);
  color: #f2f2f2; border-radius: 14px;
  border: 1px solid rgba(255,255,255,0.05);
  box-shadow: 0 4px 25px rgba(0,0,0,0.5);
  z-index: 99999; display: flex; flex-direction: column;
  font-family: 'Vazirmatn', sans-serif;
  transition: all 0.3s ease;
}
/* Embedded mode inside panel */
.saipa-live-console.embedded {
  position: static; right: auto; bottom: auto; width: 100%; max-height: 260px;
  background: var(--dark-surface); color: var(--dark-text);
  border: 1px solid var(--dark-border); box-shadow: none; margin-top: 8px;
}
.saipa-live-console .lc-header {
  display: flex; justify-content: space-between; align-items: center;
  padding: 10px 12px; font-weight: bold; border-bottom: 1px solid rgba(255,255,255,0.05);
}
.saipa-live-console.embedded .lc-header { border-bottom: 1px solid var(--dark-border); }
.saipa-live-console .lc-body { display:flex; gap:8px; padding:10px; flex-wrap:wrap; }
.saipa-live-console .lc-field { flex: 1 1 48%; font-size: 12px; }
.saipa-live-console .lc-field .label { color:#aaa; font-size:11px; }
.saipa-live-console.embedded .lc-field .label { color: var(--dark-text-muted); }
.saipa-live-console .lc-field .value {
  background: rgba(255,255,255,0.05); padding:5px 6px;
  border-radius:6px; font-weight:600;
}
.saipa-live-console.embedded .lc-field .value { background: var(--dark-bg); }
.saipa-live-console .lc-logs {
  max-height: 160px; overflow:auto;
  background: rgba(0,0,0,0.2); padding:8px; border-radius:8px; font-size:11px;
}
.saipa-live-console.embedded .lc-logs { background: rgba(0,0,0,0.15); }
.lc-log-item { margin-bottom:4px; color:#d0d0d0; }
.saipa-live-console.embedded .lc-log-item { color: var(--dark-text); opacity: 0.85; }
.lc-log-item .time { color:#9aa0b4; margin-right:4px; }
.saipa-live-console.embedded .lc-log-item .time { color: var(--dark-text-muted); }

.saipa-live-console.collapsed { width: 50px; height: 50px; overflow:hidden; }
.saipa-live-console.collapsed .lc-body, .saipa-live-console.collapsed .lc-logs { display:none; }
/* Embedded collapsed should not shrink */
.saipa-live-console.embedded.collapsed { width: 100%; height: auto; overflow: visible; }

@media (max-width: 600px) {
  .saipa-live-console {
    width: calc(100vw - 20px);
    right: 10px; bottom: 10px;
    max-height: 40vh;
    font-size: 11px;
  }
  .saipa-live-console .lc-body { flex-direction: column; }
  .saipa-live-console.embedded { max-height: 40vh; }
}
`;

    // Bank link toast styles (fade-in + responsive)
    const bankLinkStyles = `
.saipa-bank-link-toast {
  position: absolute; right: 12px; bottom: 12px;
  background: rgba(18,18,24,0.95);
  color: #f2f2f2; border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.08);
  box-shadow: 0 8px 24px rgba(0,0,0,0.4);
  padding: 12px 14px; z-index: 10002;
  max-width: calc(100% - 24px);
  opacity: 0; transform: translateY(10px);
  animation: bankFadeIn 0.35s ease forwards;
}
.saipa-bank-link-toast .title { font-weight: 700; color: #8C67FF; margin-bottom: 8px; }
.saipa-bank-link-toast a { color: #00e676; text-decoration: underline; word-break: break-all; }
@keyframes bankFadeIn { to { opacity: 1; transform: translateY(0); } }
@media (max-width: 600px) {
  .saipa-bank-link-toast { left: 12px; right: 12px; width: auto; }
}
`;


    // ****** HELPER FUNCTIONS FOR HEADER ******
    function getCookieValue(name) {
        const cookies = document.cookie.split('; ');
        for (let cookie of cookies) {
            const [key, value] = cookie.split('=');
            if (key.trim() === name) {
                try { return decodeURIComponent(value); }
                catch (e) { console.error(`Error decoding cookie ${name}:`, e); return value; }
            }
        }
        return null;
    }

    let timeIntervalId = null;
    function updateTehranTime(timeElement) {
        if (!timeElement) return;
        if (timeIntervalId) { clearInterval(timeIntervalId); }
        const formatTime = (unit) => unit.toString().padStart(2, '0');
        timeIntervalId = setInterval(() => {
            try {
                const now = new Date();
                const formatter = new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Tehran', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false });
                const parts = formatter.formatToParts(now);

                let hours = '', minutes = '', seconds = '';
                parts.forEach(part => {
                    if (part.type === 'hour') hours = formatTime(part.value);
                    else if (part.type === 'minute') minutes = formatTime(part.value);
                    else if (part.type === 'second') seconds = formatTime(part.value);
                });
                const tehranTime = `${hours}:${minutes}:${seconds}`;
                timeElement.textContent = tehranTime;
            } catch (e) {
                console.error("Error updating Tehran time:", e);
                timeElement.textContent = "خطا";
                clearInterval(timeIntervalId);
            }
        }, 1000);
    }

    function displayUserName(userElement) {
        if (!userElement) return;
        const firstName = getCookieValue('customerFirstName');
        const lastName = getCookieValue('customerLastName');
        if (firstName && lastName) {
            const displayFirstName = typeof firstName === 'string' ? firstName.trim() : firstName;
            const displayLastName = typeof lastName === 'string' ? lastName.trim() : lastName;
            userElement.textContent = `${displayFirstName} ${displayLastName}`;
        } else {
            userElement.textContent = 'کاربر مهمان';
        }
    }

    function setupHeader(container) {
        if (container.querySelector('.saipa-bot-header')) { return; }

        const headerDiv = document.createElement('div');
        headerDiv.classList.add('saipa-bot-header');
        headerDiv.innerHTML = '';

        const leftPanel = document.createElement('div');
        leftPanel.className = 'header-left-panel';

        if (logoBase64 && !logoBase64.includes("PASTE")) {
            const logoImg = document.createElement('img');
            logoImg.src = logoBase64;
            logoImg.classList.add('saipa-bot-logo-img');
            leftPanel.appendChild(logoImg);
        }

        const titleSpan = document.createElement('span');
        titleSpan.className = 'saipa-bot-header-title';
        titleSpan.textContent = 'اتوماسیون سایپا';
        leftPanel.appendChild(titleSpan);


        const rightPanel = document.createElement('div');
        rightPanel.className = 'header-right-panel';

        const userSpan = document.createElement('span');
        userSpan.id = 'saipa-bot-header-user';
        const timeSpan = document.createElement('span');
        timeSpan.id = 'saipa-bot-header-time';

        rightPanel.appendChild(userSpan);
        rightPanel.appendChild(timeSpan);

        headerDiv.appendChild(leftPanel);
        headerDiv.appendChild(rightPanel);
        if (container.firstChild) {
            container.insertBefore(headerDiv, container.firstChild);
        } else {
            container.appendChild(headerDiv);
        }

        updateTehranTime(timeSpan);
        displayUserName(userSpan);
    }
    // ****** END OF HELPER FUNCTIONS ******


    // ****** START OF CORE SCRIPT LOGIC (FUNCTIONALITY UNCHANGED) ******

    const homeItemsApiUrl = 'https://sapi.iranecar.com/api/v1/Product/GetHomeItems';
    const captchaSolveUrl = "https://siapa-bahman.viiona.ir/solve";
    const circulationApiUrl = 'https://sapi.iranecar.com/api/v1/Product/GetCirculationData';
    const circulationbranchcity = 'https://sauthapi.iranecar.com/api/v1/branch/circulationBranchProvinceCity';
    const circilationbranchcityget = 'https://sauthapi.iranecar.com/api/v1/branch/circulationBranchCity';
    const register = 'https://sapi.iranecar.com/api/v1/order/register';
    const confirmdata = 'https://sapi.iranecar.com/api/v1/order/getConfirmationData';
    const fillconfirm = "https://sapi.iranecar.com/api/v1/order/fillConfirm";
    const checkresult = "https://sapi.iranecar.com/api/v1/bank/checkResult";
    const getreverseurl = "https://sapi.iranecar.com/api/v1/Order/GetActiveReservedUrl";

    const provinces = [
        { id: 1, name: 'تهران' }, { id: 2, name: 'اصفهان' }, { id: 4, name: 'فارس' },
        { id: 5, name: 'خوزستان' }, { id: 6, name: 'آذربایجان شرقی' }, { id: 7, name: 'آذربایجان غربی' },
        { id: 8, name: 'گیلان' }, { id: 9, name: 'كرمان' }, { id: 10, name: 'یزد' },
        { id: 11, name: 'مازندران' }, { id: 12, name: 'قزوین' }, { id: 13, name: 'قم' },
        { id: 14, name: 'زنجان' }, { id: 15, name: 'گلستان' }, { id: 16, name: 'سمنان' },
        { id: 17, name: 'اردبیل' }, { id: 18, name: 'همدان' }, { id: 19, name: 'سیستان وبلوچستان' },
        { id: 20, name: 'هرمزگان' }, { id: 21, name: 'بوشهر' }, { id: 22, name: 'ایلام' },
        { id: 23, name: 'چهارمحال وبختیاری' }, { id: 24, name: 'كهكیلویه وبویر احمد' }, { id: 25, name: 'مركزی' },
        { id: 26, name: 'لرستان' }, { id: 27, name: 'كردستان' }, { id: 28, name: 'كرمانشاه' },
        { id: 29, name: 'خراسان شمالی' }, { id: 31, name: 'خراسان رضوی' }
    ];

    let mainContainer = null;
    let contentAreaContainer = null;
    let isLoggedIn = false;
    let searchAbortController = null;
    let isSearching = false;
    function createMainContainer() {
        const existingContainer = document.querySelector('.saipa-bot-container');
        if (existingContainer) { existingContainer.remove(); }
        const containerDiv = document.createElement('div');
        containerDiv.classList.add('saipa-bot-container');
        contentAreaContainer = document.createElement('div');
        contentAreaContainer.classList.add('saipa-bot-content-area');
        containerDiv.appendChild(contentAreaContainer);
        document.body.appendChild(containerDiv);
        containerDiv.style.display = 'none';
        return containerDiv;
    }

    function checkLoginStatus() {
        return document.cookie.split('; ').some(cookie => cookie.trim().startsWith('token='));
    }

    async function fetchCaptcha() {
        if (!contentAreaContainer) { return; }
        try {
            const visitorId = Math.random();
            const apiUrl = `https://recaptchag.iranecar.com/api/Captcha/GetCaptchaImage2?visitorId=${visitorId}`;
            const response = await fetch(apiUrl, { method: 'GET' });
            if (!response.ok) { throw new Error(response.statusText); }
            const tokenId = response.headers.get('token-id');
            const blob = await response.blob();
            const imageUrl = URL.createObjectURL(blob);
            updateCaptcha(imageUrl, tokenId);
        } catch (error) {
            console.error('Error Fetching Captcha:', error);
        }
    }

    async function fetchCaptchasstep2() {
        try {
            const visitorId = Math.random();
            const apiUrl = `https://recaptchag.iranecar.com/api/Captcha/GetCaptchaImage2?visitorId=${visitorId}`;
            const response = await fetch(apiUrl, { method: 'GET' });
            if (!response.ok) { throw new Error(response.statusText); }
            const tokenId = response.headers.get('token-id');
            const blob = await response.blob();
            const imageUrl = URL.createObjectURL(blob);
            return { image: imageUrl, tokenid: tokenId };
        } catch (error) {
            console.error('Error Fetching Step2 Captcha:', error);
            return null;
        }
    }

    async function solveCaptcha(img) {
        try {
            const response = await fetch(img);
            if (!response.ok) { throw new Error(`Failed to fetch blob: ${img}`); }
            const blob = await response.blob();
            const file = new File([blob], "image.jpg", { type: blob.type });
            const formData = new FormData();
            formData.append('file', file);
            const flaskResponse = await fetch(captchaSolveUrl, { method: 'POST', body: formData });
            return await flaskResponse.json();
        } catch (error) {
            console.error('Error Solving Captcha:', error);
            return null;
        }
    }

    async function updateCaptcha(imageUrl, tokenId) {
        if (!contentAreaContainer || isLoggedIn) return;
        let solvedcaptcha = isAutoCaptchaEnabled ? await solveCaptcha(imageUrl) : null;

        contentAreaContainer.innerHTML = '';
        const logindiv = document.createElement("div");
        logindiv.classList.add("saipa-bot-card");

        // لیست حساب‌های ذخیره‌شده (در صورت وجود)
        const savedAccounts = GM_getValue('savedAccounts', []);
        let selectAccount = null;
        if (Array.isArray(savedAccounts) && savedAccounts.length > 0) {
            // ردیف افقی شامل سلکت و دکمه پاکسازی
            const selectRow = document.createElement('div');
            selectRow.style.display = 'flex';
            selectRow.style.gap = '10px';

            selectAccount = document.createElement('select');
            selectAccount.id = 'saved-accounts-select';
            selectAccount.classList.add('saipa-bot-input');
            selectAccount.style.flex = '1 1 auto';

            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = 'انتخاب حساب کاربری ذخیره شده';
            selectAccount.appendChild(defaultOption);

            savedAccounts.forEach((acc, index) => {
                const option = document.createElement('option');
                option.value = String(index);
                option.textContent = (acc && acc.displayName ? acc.displayName : acc.username);
                selectAccount.appendChild(option);
            });

            const clearAccountsBtn = document.createElement('button');
            clearAccountsBtn.type = 'button';
            clearAccountsBtn.textContent = 'پاک‌سازی';
            clearAccountsBtn.classList.add('saipa-bot-button', 'saipa-bot-button-secondary');
            // Override full width to keep it beside select
            clearAccountsBtn.style.setProperty('width', 'auto', 'important');
            clearAccountsBtn.style.flex = '0 0 auto';
            clearAccountsBtn.addEventListener('click', () => {
                if (confirm('لیست حساب‌های ذخیره‌شده پاک شود؟')) {
                    GM_setValue('savedAccounts', []);
                    alert('لیست حساب‌ها پاک شد.');
                    fetchCaptcha();
                }
            });

            selectRow.appendChild(selectAccount);
            selectRow.appendChild(clearAccountsBtn);
            logindiv.appendChild(selectRow);
        }

        const fields = [
            { id: 'username-input', placeholder: 'کد ملی', type: 'text' },
            { id: 'password-input', placeholder: 'رمز عبور', type: 'password' },
            { id: 'captcha-input', placeholder: 'کد امنیتی', type: 'text', value: solvedcaptcha?.text || '' },
        ];
        fields.forEach(field => {
            const input = document.createElement('input');
            input.type = field.type;
            if (field.value) input.value = field.value;
            input.placeholder = field.placeholder;
            input.classList.add('saipa-bot-input');
            input.id = field.id;
            logindiv.appendChild(input);

        });

        // پر کردن خودکار فیلدها پس از انتخاب حساب از لیست
        if (selectAccount) {
            selectAccount.addEventListener('change', (e) => {
                const selectedIndex = e.target.value;
                if (selectedIndex !== '') {
                    const selectedAccount = savedAccounts[parseInt(selectedIndex, 10)];
                    const userInput = logindiv.querySelector('#username-input');
                    const passInput = logindiv.querySelector('#password-input');
                    if (userInput && passInput && selectedAccount) {
                        userInput.value = selectedAccount.username || '';
                        passInput.value = selectedAccount.password || '';
                    }
                }
            });
        }

        const img = document.createElement('img');
        img.src = imageUrl;
        img.alt = 'Captcha';
        img.classList.add('saipa-bot-captcha-image');
        logindiv.appendChild(img);
        const refreshButton = document.createElement('button');
        refreshButton.textContent = 'کپچای جدید';
        refreshButton.classList.add('saipa-bot-button', 'saipa-bot-button-secondary');
        refreshButton.addEventListener('click', fetchCaptcha);
        logindiv.appendChild(refreshButton);

        const submitButton = document.createElement('button');
        submitButton.textContent = 'ورود';
        submitButton.classList.add('saipa-bot-button', 'saipa-bot-button-submit');
        submitButton.addEventListener('click', async () => {
            const usernameValue = document.getElementById('username-input').value;
            const passwordValue = document.getElementById('password-input').value;
            const captchaValue = document.getElementById('captcha-input').value;
            if (!usernameValue || !passwordValue || !captchaValue) return;

            submitButton.disabled = true;
            submitButton.textContent = 'در حال ورود...';

            const requestData = { nationalCode: usernameValue, password: passwordValue, captchaResponse: null, captchaResult: captchaValue, captchaToken: tokenId };

            try {
                const response = await fetch('https://sauthapi.iranecar.com/api/v1/Account/SignIn', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(requestData) });
                const responseData = await response.json();


                if (response.ok && responseData?.data?.token) {
                    saveLoginDataToCookies(responseData);
                    const firstName = responseData?.data?.customer?.firstName || '';
                    const lastName = responseData?.data?.customer?.lastName || '';
                    const displayName = `${firstName} ${lastName}`.trim() || usernameValue;
                    saveAccount(usernameValue, passwordValue, displayName);
                    isLoggedIn = true;
                    displayUserName(document.getElementById('saipa-bot-header-user'));
                    contentAreaContainer.innerHTML = '';
                    displaySearchUI();
                } else {
                    alert(`Login failed: ${responseData?.message || `HTTP Error ${response.status}`}`);
                }
            } catch (error) {
                console.error('Login Submit Error:', error);
                alert('Login error occurred. Check console.');
            }
            submitButton.disabled = false;
            submitButton.textContent = 'ورود';
        });
        logindiv.appendChild(submitButton);
        contentAreaContainer.appendChild(logindiv);
    }

    function saveLoginDataToCookies(data) {
        const { token, customer } = data.data;
        const expires = new Date(Date.now() + 60 * 60 * 1000).toUTCString();
        document.cookie = `token=${token.token}; path=/; expires=${expires}; SameSite=Lax`;
        document.cookie = `customerFirstName=${encodeURIComponent(customer.firstName || '')}; path=/; expires=${expires}; SameSite=Lax`;
        document.cookie = `customerLastName=${encodeURIComponent(customer.lastName || '')}; path=/; expires=${expires}; SameSite=Lax`;
    }

    function saveAccount(username, password, displayName) {
        let accounts = GM_getValue("savedAccounts", []);
        // اگر این حساب از قبل وجود ندارد، اضافه کن
        if (!accounts.some(acc => acc.username === username)) {
            accounts.push({ username, password, displayName });
            GM_setValue("savedAccounts", accounts);
        } else {
            // در صورت وجود، فقط نمایش‌نام را به‌روزرسانی کن (برای پشتیبانی از تغییر نام کاربری نمایش داده‌شده)
            accounts = accounts.map(acc => acc.username === username ? { ...acc, displayName: displayName || acc.displayName } : acc);
            GM_setValue("savedAccounts", accounts);
        }
    }

    // ======= Search Presets Helpers =======
    function loadPresets() {
        return GM_getValue("searchPresets", []);
    }

    function savePreset(preset) {
        let presets = loadPresets();
        const existing = presets.find(p => p.name === preset.name);
        if (existing) {
            Object.assign(existing, preset);
        } else {
            presets.push(preset);
        }
        GM_setValue("searchPresets", presets);
    }

    function deletePreset(name) {
        let presets = loadPresets().filter(p => p.name !== name);
        GM_setValue("searchPresets", presets);
    }

    function getDefaultPresetName() {
        return GM_getValue("defaultPresetName", "");
    }

    function setDefaultPreset(name) {
        GM_setValue("defaultPresetName", name || "");
    }

    function applyPresetToForm(preset) {
        if (!preset) return;
        const searchTermEl = document.getElementById('search-term-input');
        const salesPlanEl = document.getElementById('sales-plan-input');
        const priceEl = document.getElementById('price-term-input');
        const cityEl = document.getElementById('city-term-input');
        const provinceEl = document.getElementById('province-select-input');
        const saleTypeEl = document.getElementById('sale-type-input');
        const exactMatchEl = document.getElementById('exact-match-checkbox');

        if (searchTermEl) searchTermEl.value = preset.searchTerm || "";
        if (salesPlanEl) salesPlanEl.value = preset.salesPlanTerm || "";
        if (priceEl) priceEl.value = preset.priceTerm || "";
        if (cityEl) cityEl.value = preset.city || "";
        if (provinceEl) provinceEl.value = preset.provinceId || "4";
        if (saleTypeEl) saleTypeEl.value = preset.saleType || "";
        if (exactMatchEl) exactMatchEl.checked = !!preset.exactMatch;
    }

    function buildPresetDropdown() {
        const presets = loadPresets();
        const select = document.createElement("select");
        select.id = "preset-select";
        select.classList.add("saipa-bot-input");

        const defaultOption = document.createElement("option");
        defaultOption.value = "";
        defaultOption.textContent = "انتخاب پریست ذخیره‌شده...";
        select.appendChild(defaultOption);

        presets.forEach(p => {
            const opt = document.createElement("option");
            opt.value = p.name;
            opt.textContent = p.name;
            select.appendChild(opt);
        });

        select.addEventListener("change", (e) => {
            const selected = presets.find(p => p.name === e.target.value);
            applyPresetToForm(selected);
        });

        return select;
    }

    function reloadContent() {
        if (!contentAreaContainer) return;
        isSearching = false;
        if (searchAbortController) searchAbortController.abort();
        contentAreaContainer.innerHTML = "";
        isLoggedIn = checkLoginStatus();
        displayUserName(document.getElementById('saipa-bot-header-user'));
        if (isLoggedIn) { displaySearchUI(); } else { fetchCaptcha(); }
    }

    function displaySearchUI() {
        if (!contentAreaContainer) return;
        contentAreaContainer.innerHTML = '';

        const searchAreaDiv = document.createElement('div');
        searchAreaDiv.classList.add('saipa-bot-card');

        // Preset controls row (dropdown + buttons)
        const presetRow = document.createElement('div');
        presetRow.style.display = 'flex';
        presetRow.style.gap = '10px';
        presetRow.style.alignItems = 'center';
        const presetSelect = buildPresetDropdown();
        presetSelect.style.flex = '1 1 auto';
        const newPresetBtn = document.createElement('button');
        newPresetBtn.type = 'button';
        newPresetBtn.textContent = 'پریست جدید';
        newPresetBtn.className = 'saipa-bot-button saipa-bot-button-secondary';
        newPresetBtn.style.setProperty('width', 'auto', 'important');
        const deletePresetBtn = document.createElement('button');
        deletePresetBtn.type = 'button';
        deletePresetBtn.textContent = 'حذف پریست';
        deletePresetBtn.className = 'saipa-bot-button saipa-bot-button-secondary';
        deletePresetBtn.style.setProperty('width', 'auto', 'important');
        const setDefaultBtn = document.createElement('button');
        setDefaultBtn.type = 'button';
        setDefaultBtn.textContent = 'ثبت به عنوان پیش‌فرض';
        setDefaultBtn.className = 'saipa-bot-button saipa-bot-button-secondary';
        setDefaultBtn.style.setProperty('width', 'auto', 'important');

        presetRow.appendChild(presetSelect);
        presetRow.appendChild(newPresetBtn);
        presetRow.appendChild(deletePresetBtn);
        presetRow.appendChild(setDefaultBtn);
        searchAreaDiv.appendChild(presetRow);

        // Preset editor (hidden until opened)
        const presetEditor = document.createElement('div');
        presetEditor.className = 'saipa-bot-card';
        presetEditor.style.display = 'none';
        presetEditor.innerHTML = `
            <h3 style="margin:0; text-align:center;">ایجاد/ویرایش پریست</h3>
            <input type="text" id="preset-name-input" class="saipa-bot-input" placeholder="نام پریست">
            <select id="editor-province-select" class="saipa-bot-input"></select>
            <input type="text" id="editor-search-term-input" class="saipa-bot-input" placeholder="نام خودرو">
            <input type="text" id="editor-sales-plan-input" class="saipa-bot-input" placeholder="نام طرح فروش (اختیاری)">
            <input type="text" id="editor-price-term-input" class="saipa-bot-input" placeholder="قیمت (اختیاری)">
            <input type="text" id="editor-city-term-input" class="saipa-bot-input" placeholder="نام شهر (اختیاری)">
            <select id="editor-sale-type-input" class="saipa-bot-input">
              <option value="">همه نوع فروش</option>
              <option value="3">فروش فوری</option>
              <option value="5">فروش فوری اعتباری</option>
            </select>
            <label style="display:flex; align-items:center; gap:8px; font-size:14px; color: var(--dark-text-muted);">
              <input type="checkbox" id="editor-exact-match-checkbox" style="width:auto;height:auto;"> جستجوی دقیق نام خودرو
            </label>
            <label style="display:flex; align-items:center; gap:8px; font-size:14px; color: var(--dark-text-muted);">
              <input type="checkbox" id="preset-default-checkbox" style="width:auto;height:auto;"> ذخیره به عنوان پیش‌فرض
            </label>
            <div style="display:flex; gap:10px; justify-content:flex-end;">
              <button id="preset-save-btn" class="saipa-bot-button saipa-bot-button-submit" style="width:auto !important;">ذخیره</button>
              <button id="preset-cancel-btn" class="saipa-bot-button saipa-bot-button-secondary" style="width:auto !important;">انصراف</button>
            </div>
        `;
        searchAreaDiv.appendChild(presetEditor);

        searchAreaDiv.insertAdjacentHTML('beforeend', `
            <h2 style="font-size: 1.4em; text-align: center; color: var(--dark-primary); margin:0;">جستجوی خودرو</h2>
            <select id="province-select-input" class="saipa-bot-input">
                <option value="4">تهران (پیش‌فرض)</option>
            </select>
            <input type="text" id="search-term-input" class="saipa-bot-input" placeholder="نام خودرو (مثال: شاهین)">
            <div style="display: flex; align-items: center; gap: 10px; margin-top: 5px;">
              <input type="checkbox" id="exact-match-checkbox" style="width: auto; height: auto;">
              <label for="exact-match-checkbox" style="font-size: 14px; color: var(--dark-text-muted);">جستجوی دقیق نام خودرو</label>
            </div>
            <input type="text" id="sales-plan-input" class="saipa-bot-input" placeholder="نام طرح فروش (اختیاری)">
            <input type="text" id="price-term-input" class="saipa-bot-input" placeholder="قیمت (اختیاری)">
            <input type="text" id="city-term-input" class="saipa-bot-input" placeholder="نام شهر (اختیاری)">
            <select id="sale-type-input" class="saipa-bot-input">
              <option value="">همه نوع فروش</option>
              <option value="3">فروش فوری</option>
              <option value="5">فروش فوری اعتباری</option>
            </select>
        `);

        // Hide legacy search form and show compact preset summary instead
        const legacyH2 = searchAreaDiv.querySelector('h2');
        if (legacyH2) legacyH2.style.display = 'none';
        const idsToHide = [
          'province-select-input', 'search-term-input', 'sales-plan-input',
          'price-term-input', 'city-term-input', 'sale-type-input', 'exact-match-checkbox'
        ];
        idsToHide.forEach(id => {
            const el = searchAreaDiv.querySelector('#' + id);
            if (el) {
                if (id === 'exact-match-checkbox' && el.parentElement) el.parentElement.style.display = 'none';
                el.style.display = 'none';
            }
        });

        // Preset summary block
        const presetSummary = document.createElement('div');
        presetSummary.id = 'preset-summary';
        presetSummary.className = 'saipa-bot-card';
        const renderPresetSummary = (p) => {
            if (!p) { presetSummary.innerHTML = '<div style="text-align:center;color:var(--dark-text-muted)">هیچ پریستی انتخاب نشده است.</div>'; return; }
            const provId = Number(p.provinceId || 4);
            const prov = provinces.find(pr => Number(pr.id) === provId);
            const provinceName = prov ? prov.name : String(provId);
            presetSummary.innerHTML = `
                <h3 style="margin:0;text-align:center;color:var(--dark-primary)">پریست انتخاب‌شده: ${p.name}</h3>
                <div style="display:grid;grid-template-columns:120px 1fr;gap:8px;">
                  <div style="color:var(--dark-text-muted)">استان</div><div>${provinceName}</div>
                  <div style="color:var(--dark-text-muted)">نام خودرو</div><div>${p.searchTerm || ''}</div>
                  <div style="color:var(--dark-text-muted)">طرح فروش</div><div>${p.salesPlanTerm || ''}</div>
                  <div style="color:var(--dark-text-muted)">قیمت</div><div>${p.priceTerm || ''}</div>
                  <div style="color:var(--dark-text-muted)">شهر</div><div>${p.city || ''}</div>
                  <div style="color:var(--dark-text-muted)">نوع فروش</div><div>${p.saleType || ''}</div>
                  <div style="color:var(--dark-text-muted)">دقیق</div><div>${p.exactMatch ? 'بله' : 'خیر'}</div>
                </div>
            `;
        };
        searchAreaDiv.appendChild(presetSummary);

        // Keep creating the search button below
        const searchButton = document.createElement('button');
        searchButton.type = 'button';
        searchButton.className = 'btn';
        searchButton.id = 'search-button';
        searchButton.innerHTML = `
            <strong>جستجو</strong>
            <div id="container-stars"><div id="stars"></div></div>
            <div id="glow"><div class="circle"></div><div class="circle"></div></div>
        `;
        searchAreaDiv.appendChild(searchButton);

        const statusDiv = document.createElement('div');
        statusDiv.id = 'search-status';
        searchAreaDiv.appendChild(statusDiv);

        contentAreaContainer.appendChild(searchAreaDiv);

        // Populate province dropdown
        const provinceSelect = document.getElementById('province-select-input');
        provinces.forEach(province => {
            const option = document.createElement('option');
            option.value = province.id;
            option.textContent = province.name;
            provinceSelect.appendChild(option);
        });

        // Populate editor province dropdown
        const editorProvince = searchAreaDiv.querySelector('#editor-province-select');
        if (editorProvince) {
            provinces.forEach(province => {
                const opt = document.createElement('option');
                opt.value = province.id;
                opt.textContent = province.name;
                editorProvince.appendChild(opt);
            });
        }

        const priceInput = document.getElementById('price-term-input');
        priceInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/,/g, '');
            if (value && !isNaN(value)) {
                e.target.value = Number(value).toLocaleString('en-US');
            } else {
                e.target.value = '';
            }
        });

        // New preset: toggle editor
        newPresetBtn.addEventListener('click', () => {
            presetEditor.style.display = presetEditor.style.display === 'none' ? 'flex' : 'none';
            presetEditor.style.flexDirection = 'column';
            const nameInput = presetEditor.querySelector('#preset-name-input');
            const defaultChk = presetEditor.querySelector('#preset-default-checkbox');
            const eProvince = presetEditor.querySelector('#editor-province-select');
            const eSearch = presetEditor.querySelector('#editor-search-term-input');
            const eSales = presetEditor.querySelector('#editor-sales-plan-input');
            const ePrice = presetEditor.querySelector('#editor-price-term-input');
            const eCity = presetEditor.querySelector('#editor-city-term-input');
            const eSaleType = presetEditor.querySelector('#editor-sale-type-input');
            const eExact = presetEditor.querySelector('#editor-exact-match-checkbox');
            if (nameInput) nameInput.value = '';
            if (defaultChk) defaultChk.checked = false;
            if (eProvince) eProvince.value = document.getElementById('province-select-input').value;
            if (eSearch) eSearch.value = document.getElementById('search-term-input').value.trim();
            if (eSales) eSales.value = document.getElementById('sales-plan-input').value.trim();
            if (ePrice) ePrice.value = document.getElementById('price-term-input').value.trim();
            if (eCity) eCity.value = document.getElementById('city-term-input').value.trim();
            if (eSaleType) eSaleType.value = document.getElementById('sale-type-input').value;
            if (eExact) eExact.checked = document.getElementById('exact-match-checkbox').checked;
        });

        // Save preset handler (from editor)
        const presetSaveBtn = searchAreaDiv.querySelector('#preset-save-btn');
        const presetCancelBtn = searchAreaDiv.querySelector('#preset-cancel-btn');
        if (presetSaveBtn) {
            presetSaveBtn.addEventListener('click', () => {
                const nameInput = presetEditor.querySelector('#preset-name-input');
                const defaultChk = presetEditor.querySelector('#preset-default-checkbox');
                const eProvince = presetEditor.querySelector('#editor-province-select');
                const eSearch = presetEditor.querySelector('#editor-search-term-input');
                const eSales = presetEditor.querySelector('#editor-sales-plan-input');
                const ePrice = presetEditor.querySelector('#editor-price-term-input');
                const eCity = presetEditor.querySelector('#editor-city-term-input');
                const eSaleType = presetEditor.querySelector('#editor-sale-type-input');
                const eExact = presetEditor.querySelector('#editor-exact-match-checkbox');
                const name = nameInput ? nameInput.value.trim() : '';
                if (!name) { alert('نام پریست را وارد کنید.'); return; }
                const preset = {
                    name,
                    searchTerm: eSearch ? eSearch.value.trim() : '',
                    salesPlanTerm: eSales ? eSales.value.trim() : '',
                    priceTerm: ePrice ? ePrice.value.trim() : '',
                    city: eCity ? eCity.value.trim() : '',
                    provinceId: eProvince ? eProvince.value : '4',
                    saleType: eSaleType ? eSaleType.value : '',
                    exactMatch: eExact ? !!eExact.checked : false,
                };
                savePreset(preset);
                if (defaultChk && defaultChk.checked) setDefaultPreset(name);
                // Rebuild dropdown options
                const currentSelect = searchAreaDiv.querySelector('#preset-select');
                const newSelect = buildPresetDropdown();
                newSelect.style.flex = '1 1 auto';
                presetRow.replaceChild(newSelect, currentSelect);
                presetEditor.style.display = 'none';
            });
        }
        if (presetCancelBtn) {
            presetCancelBtn.addEventListener('click', () => {
                presetEditor.style.display = 'none';
            });
        }

        // Delete preset handler
        deletePresetBtn.addEventListener('click', () => {
            const selectEl = searchAreaDiv.querySelector('#preset-select');
            const selectedName = selectEl ? selectEl.value : '';
            if (!selectedName) { alert('هیچ پریستی انتخاب نشده است.'); return; }
            if (!confirm(`پریست "${selectedName}" حذف شود؟`)) return;
            deletePreset(selectedName);
            // Refresh dropdown
            const newSelect = buildPresetDropdown();
            newSelect.style.flex = '1 1 auto';
            presetRow.replaceChild(newSelect, selectEl);
        });

        // Set selected preset as default
        setDefaultBtn.addEventListener('click', () => {
            const selectEl = searchAreaDiv.querySelector('#preset-select');
            const selectedName = selectEl ? selectEl.value : '';
            if (!selectedName) { alert('هیچ پریستی انتخاب نشده است.'); return; }
            setDefaultPreset(selectedName);
            alert('پریست پیش‌فرض تنظیم شد.');
        });

        // Auto-apply default preset if exists
        const defaultName = getDefaultPresetName();
        if (defaultName) {
            const presets = loadPresets();
            const def = presets.find(p => p.name === defaultName);
            if (def) {
                applyPresetToForm(def);
                // Also set dropdown selection to default
                const selectEl = searchAreaDiv.querySelector('#preset-select');
                if (selectEl) selectEl.value = defaultName;
                // Render summary
                renderPresetSummary(def);
            }
        } else {
            // Render empty summary initially
            const currentPresets = loadPresets();
            const selected = currentPresets.find(p => p.name === (searchAreaDiv.querySelector('#preset-select')?.value || ''));
            renderPresetSummary(selected);
        }

        // When user changes preset dropdown, update summary (and hidden inputs)
        const presetDd = searchAreaDiv.querySelector('#preset-select');
        if (presetDd) {
            presetDd.addEventListener('change', (e) => {
                const presets = loadPresets();
                const sel = presets.find(p => p.name === e.target.value);
                applyPresetToForm(sel);
                renderPresetSummary(sel);
            });
        }

        searchButton.addEventListener('click', () => {
            if (isSearching) {
                stopCarSearch();
            } else {
                // Read from selected preset rather than hidden inputs
                const presets = loadPresets();
                const selectedName = (searchAreaDiv.querySelector('#preset-select')?.value || '').trim();
                const selected = presets.find(p => p.name === selectedName) || presets.find(p => p.name === getDefaultPresetName());
                if (!selected || !selected.searchTerm) { alert('ابتدا یک پریست با نام خودرو انتخاب یا ایجاد کنید.'); return; }
                const searchTerm = selected.searchTerm.trim();
                const salesPlanTerm = (selected.salesPlanTerm || '').trim();
                const priceTerm = selected.priceTerm ? parseInt(String(selected.priceTerm).replace(/,/g, '')) : null;
                const saleTypeFilter = (selected.saleType || '').trim();
                const exactMatch = !!selected.exactMatch;
                const specificCity = (selected.city || '').trim();
                const provinceId = String(selected.provinceId || '4');
                if (searchTerm) {
                    startCarSearch(searchTerm, salesPlanTerm, priceTerm, saleTypeFilter, exactMatch, specificCity, provinceId);
                } else {
                    alert('نام خودرو در پریست خالی است.');
                }
            }
        });
    }

    function stopCarSearch() {
        isSearching = false;
        if (searchAbortController) {
            searchAbortController.abort();
        }
        const statusDiv = document.getElementById('search-status');
        if(statusDiv) statusDiv.textContent = 'جستجو لغو شد.';

        const searchButton = document.getElementById('search-button');
        if (searchButton) {
            searchButton.disabled = false;
            searchButton.querySelector('strong').textContent = 'جستجو';
        }
    }

    async function startCarSearch(searchTerm, salesPlanTerm, priceTerm, saleTypeFilter, exactMatch, specificCity, provinceId) {
        isSearching = true;
        const statusDiv = document.getElementById('search-status');
        const searchButton = document.getElementById('search-button');
        if (searchButton) {
            searchButton.disabled = false; // Keep it enabled to act as a stop button
            searchButton.querySelector('strong').textContent = 'لغو جستجو';
        }

        // Update province name in console at start
        try {
            const provObj = provinces.find(p => String(p.id) === String(provinceId));
            const provinceName = provObj ? provObj.name : String(provinceId || '');
            if (provinceName) updateLiveConsole({ province: provinceName });
        } catch (e) {}

        while (isSearching) {
            statusDiv.textContent = `جستجو برای "${searchTerm}"...`;
            updateLiveConsole({ status: `جستجو برای "${searchTerm}"` }, `شروع جستجو برای "${searchTerm}"`);
            const items = await fetchItemsData();

            if (!isSearching) break; // If search was cancelled, exit loop

            if (items) {
                 const foundItems = items.filter(item => {
                    const title = item.title.trim().toLowerCase();
                    const term = searchTerm.toLowerCase();
                    return exactMatch ? title === term : title.includes(term);
                });
                updateLiveConsole({}, `یافت شده: ${foundItems.length} مورد برای "${searchTerm}"`);

                if (foundItems.length === 1) {
                    isSearching = false;
                    const foundItem = foundItems[0];
                    statusDiv.textContent = `یک خودرو "${foundItem.title}" یافت شد. در حال پردازش...`;
                    updateLiveConsole({ car: foundItem.title, status: 'خودرو انتخاب شد' }, `خودرو انتخاب شد: ${foundItem.title}`);
                    handleItemButtonClick(foundItem, salesPlanTerm, priceTerm, saleTypeFilter, specificCity, provinceId);
                } else if (foundItems.length > 1) {
                    isSearching = false;
                    statusDiv.textContent = `${foundItems.length} خودرو یافت شد. لطفاً یکی را انتخاب کنید.`;
                    updateLiveConsole({ status: 'چند خودرو یافت شد' }, `${foundItems.length} خودرو یافت شد`);
                    displayProductSelection(foundItems, salesPlanTerm, priceTerm, saleTypeFilter, specificCity, provinceId);
                } else {
                    statusDiv.textContent = `خودرویی با نام "${searchTerm}" یافت نشد. تلاش مجدد...`;
                    updateLiveConsole({}, `عدم نتیجه برای "${searchTerm}", تلاش مجدد...`);
                    await new Promise(resolve => setTimeout(resolve, 1500));
                }
            } else {
                statusDiv.textContent = "خطا در دریافت لیست خودروها. تلاش مجدد...";
                updateLiveConsole({ status: 'خطای API لیست خودرو' }, 'خطا در دریافت لیست خودروها');
                await new Promise(resolve => setTimeout(resolve, 5000)); // Wait longer on API error
            }
        }

        // Reset button if loop finishes (e.g. was cancelled)
        if (!isSearching) {
            stopCarSearch();
        }
    }

    function displayProductSelection(items, salesPlanTerm, priceTerm, saleTypeFilter, specificCity, provinceId) {
        // Clear the search UI and show the selection grid
        contentAreaContainer.innerHTML = '';

        const container = document.createElement('div');
        container.className = 'saipa-product-selection-container';

        items.forEach(item => {
            const card = document.createElement('div');
            card.className = 'saipa-product-card';
            card.onclick = () => {
                // Disable all cards after one is clicked
                container.querySelectorAll('.saipa-product-card').forEach(c => c.style.pointerEvents = 'none');
                handleItemButtonClick(item, salesPlanTerm, priceTerm, saleTypeFilter, specificCity, provinceId);
            };

            const img = document.createElement('img');
            // Assuming item.imageUrl holds the image URL. If not, this will need adjustment.
            img.src = item.imageUrl || 'https://via.placeholder.com/300x200.png?text=No+Image';
            img.alt = item.title;

            const title = document.createElement('div');
            title.className = 'saipa-product-card-title';
            title.textContent = item.title;

            card.appendChild(img);
            card.appendChild(title);
            container.appendChild(card);
        });

        contentAreaContainer.appendChild(container);
    }

    async function fetchItemsData() {
        if (searchAbortController) { searchAbortController.abort(); }
        searchAbortController = new AbortController();
        try {
            const response = await fetch(homeItemsApiUrl, { signal: searchAbortController.signal });
            if (!response.ok) return null;
            const data = await response.json();
            return data.data;
        } catch(error) {
            if (error.name !== 'AbortError') console.error('Fetch Items Error:', error);
            return null;
        }
    }

    function handleItemButtonClick(item, salesPlanTerm, priceTerm, saleTypeFilter, specificCity, provinceId) {
        contentAreaContainer.innerHTML = '';
        const carDetailsDiv = document.createElement('div');
        carDetailsDiv.classList.add('saipa-bot-card');
        carDetailsDiv.innerHTML = `
            <h2 style="text-align: center; color: var(--dark-primary);">${item.title}</h2>
            <p>خودروی <strong>${item.title}</strong> به صورت خودکار انتخاب شد.</p>
            <div id="process-status">شروع مراحل ثبت نام...</div>
        `;
        contentAreaContainer.appendChild(carDetailsDiv);
        updateLiveConsole({ car: item.title, status: 'شروع فرآیند ثبت' }, `شروع فرآیند ثبت برای ${item.title}`);
        fetchData(item.id, salesPlanTerm, priceTerm, saleTypeFilter, specificCity, provinceId);
    }

    function updateProcessStatus(message, isError = false) {
        const statusDiv = document.getElementById('process-status');
        if (statusDiv) {
            statusDiv.textContent = message;
            statusDiv.style.color = isError ? 'var(--dark-danger)' : 'var(--dark-text-muted)';
            statusDiv.style.borderColor = isError ? 'var(--dark-danger)' : 'var(--dark-border)';
        }
    }

    async function fetchData(carModelId, salesPlanTerm = "", priceTerm = null, saleTypeFilter = "", specificCity = "", provinceId = 4) {
        while (true) {
            try {
                updateProcessStatus('دریافت اطلاعات طرح‌های فروش...');
                // Province name update if available
                try {
                    const provObj = provinces.find(p => String(p.id) === String(provinceId));
                    const provinceName = provObj ? provObj.name : String(provinceId || '');
                    if (provinceName) updateLiveConsole({ province: provinceName });
                } catch (e) {}
                updateLiveConsole({ status: 'دریافت طرح‌های فروش' }, 'در حال دریافت طرح‌های فروش');
                let result = null;
                while (result === null) {
                    const url = `${circulationApiUrl}?carModelId=${carModelId}`;
                    const response = await fetch(url);
                    if (!response.ok) throw new Error(`خطای شبکه در دریافت طرح فروش: ${response.statusText}`);
                    const data = await response.json();

                    if (!data?.data?.length) {
                        updateProcessStatus("هیچ طرح فعالی یافت نشد. تلاش مجدد...", true);
                        updateLiveConsole({ status: 'طرح فعال یافت نشد' }, 'طرح فعال یافت نشد، تلاش مجدد');
                        await new Promise(resolve => setTimeout(resolve, 5000));
                        continue;
                    }

                    let plans = data.data;
                    if (saleTypeFilter) {
                        plans = plans.filter(plan => plan.saleType === saleTypeFilter);
                    }

                    let foundPlan = null;
                    if (plans && plans.length > 0) {
                        if (salesPlanTerm) {
                            foundPlan = plans.find(plan =>
                                (plan.title?.toLowerCase() + plan.titleDetails?.toLowerCase())
                                .includes(salesPlanTerm.toLowerCase())
                            );
                        } else if (priceTerm) {
                            foundPlan = plans.reduce((best, current) => {
                                const bestDiff = Math.abs(Number(best.basePrice || 0) - priceTerm);
                                const currentDiff = Math.abs(Number(current.basePrice || 0) - priceTerm);
                                return currentDiff < bestDiff ? current : best;
                            });
                        } else {
                            foundPlan = plans[0];
                        }
                    }

                    if (foundPlan) {
                        updateProcessStatus(`طرح "${foundPlan.title}" با قیمت ${foundPlan.basePrice} انتخاب شد.`);
                        const formattedPrice = (foundPlan.basePrice !== undefined && foundPlan.basePrice !== null)
                            ? Number(foundPlan.basePrice).toLocaleString('fa-IR')
                            : '';
                        updateLiveConsole({ plan: foundPlan.title, price: formattedPrice, status: `طرح انتخاب شد: ${foundPlan.title}` }, `طرح انتخاب شد: ${foundPlan.title} | قیمت: ${formattedPrice}`);
                        result = foundPlan;
                    } else {
                        updateProcessStatus(`طرح "${salesPlanTerm || 'مناسب'}" یافت نشد. تلاش مجدد...`, true);
                        updateLiveConsole({}, `طرح موردنظر یافت نشد، تلاش مجدد...`);
                        await new Promise(resolve => setTimeout(resolve, 3000));
                    }
                }

                const checkedIds = result.options.filter(o => o.isChecked).map(o => o.id);
                let selectedBranch = null;

                updateProcessStatus('دریافت لیست شهرها...');
                updateLiveConsole({ status: 'دریافت شهرها' }, 'در حال دریافت شهرها');
                const requestDatacity = { provinceId: provinceId, circulationId: result.id };
                const cityResponse = await fetch(circulationbranchcity, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(requestDatacity) });
                 if (!cityResponse.ok) throw new Error(`خطای شبکه در دریافت شهرها: ${cityResponse.statusText}`);
                let availableCities = await cityResponse.json();

                if (!availableCities?.length) {
                    throw new Error("هیچ شهری برای این طرح فروش یافت نشد.");
                }

                function normalizePersian(str) {
                    if (!str) return "";
                    return str
                        .replace(/ي/g, 'ی')
                        .replace(/ك/g, 'ک')
                        .replace(/ؤ/g, 'و')
                        .replace(/[أإآ]/g, 'ا')
                        .replace(/ۀ/g, 'ه')
                        .replace(/ة/g, 'ه')
                        .replace(/\u200c/g, ' ')
                        .replace(/\s+/g, ' ')
                        .trim();
                }

                availableCities.sort(() => Math.random() - 0.5);

                let targetCity = null;
                if (specificCity) {
                    const cityNames = specificCity.split(/[،,]/).map(s => normalizePersian(s)).filter(Boolean);

                    const filteredCities = availableCities.filter(city =>
                        cityNames.some(name => normalizePersian(city.title).includes(name))
                    );

                    if (filteredCities.length > 0) {
                        availableCities = filteredCities;
                        updateProcessStatus(`فقط شهرهای ${cityNames.join('، ')} انتخاب شدند.`);
                        updateLiveConsole({ city: cityNames.join('، ') }, `فیلتر شهر: ${cityNames.join('، ')}`);
                    } else {
                        updateProcessStatus(`هیچ یک از شهرهای ${cityNames.join('، ')} یافت نشد. عملیات متوقف شد.`, true);
                        updateLiveConsole({ status: 'شهر معتبر یافت نشد' }, 'هیچ شهر معتبری یافت نشد');
                        return;
                    }
                } else {
                    availableCities.sort(() => Math.random() - 0.5);
                }

                for (const city of availableCities) {
                    targetCity = city;
                    updateProcessStatus(`تلاش برای شهر: "${targetCity.title}"...`);
                    updateLiveConsole({ city: targetCity.title, status: `تلاش در شهر ${targetCity.title}` }, `تلاش برای شهر: ${targetCity.title}`);

                    const requestDatacityBranch = { cityCode: targetCity.code, circulationId: result.id };
                    const branchResponse = await fetch(circilationbranchcityget, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(requestDatacityBranch) });

                    if (branchResponse.ok) {
                        let branches = await branchResponse.json();
                        if (branches?.length) {
                            branches.sort(() => Math.random() - 0.5);
                            for (const branch of branches) {
                                updateProcessStatus(`تلاش با نمایندگی "${branch.title}"...`);
                                updateLiveConsole({ branch: branch.title }, `تلاش با نمایندگی: ${branch.title}`);
                                const success = await registercar(branch.code, branch.id, result.id, result.carUsages[0].id, checkedIds, result.circulationColors[0].colorCode, result.companyCode, result.crcl_row);
                                if (success) {
                                    selectedBranch = branch;
                                    break;
                                }
                            }
                        }
                    }

                    if (selectedBranch) {
                        break;
                    }

                    updateProcessStatus(`نمایندگی موفقی در شهر "${targetCity.title}" یافت نشد. تلاش با شهر بعدی...`, true);
                    updateLiveConsole({}, `نمایندگی موفقی در ${targetCity.title} یافت نشد`);
                    await new Promise(resolve => setTimeout(resolve, 500));
                }

                if (!selectedBranch) {
                    throw new Error("در هیچ یک از شهرهای موجود، ثبت‌نام با نمایندگی موفقیت آمیز نبود.");
                }

                updateProcessStatus(`ثبت نام با نمایندگی "${selectedBranch.title}" در شهر "${targetCity.title}" موفق بود.`);
                updateLiveConsole({ status: `ثبت نام موفق در ${selectedBranch.title}` }, `ثبت نام موفق در نمایندگی ${selectedBranch.title}`);
                break; // Exit the while(true) loop on success
            } catch (error) {
                console.error('Fetch Data Error:', error);
                updateProcessStatus(`خطا: ${error.message}. تلاش مجدد...`, true);
                updateLiveConsole({ status: 'خطا در فرآیند' }, `خطا: ${error.message}`);
                await new Promise(resolve => setTimeout(resolve, 3000));
            }
        }
    }

    async function registercar(BranchCode, BranchId, CardId, CarUsageId, CirculationOptionIds, ColorCode, CompanyCode, CrclRow){
        const token = getTokenFromCookies("token");
        // This function will now return true on success and false on failure
        try {
            updateProcessStatus('دریافت کپچا برای ثبت...');
            appendConsoleLog('دریافت کپچای ثبت');
            const captchaReg = await fetchCaptchasstep2();
            if (!captchaReg) throw new Error("دریافت کپچای ثبت ناموفق بود.");
            const solvedCaptchaText = isAutoCaptchaEnabled
                ? (await solveCaptcha(captchaReg.image))?.text
                : await getManualCaptchaInput(captchaReg.image);
            if (!solvedCaptchaText) throw new Error("حل کپچا ناموفق بود.");

            updateProcessStatus('ثبت اولیه...');
            appendConsoleLog('ثبت اولیه ارسال شد');
            const requestDataRegister = { BranchCode, BranchId, CardId, CarUsageId, CircuLationId: CardId, CirculationOptionIds, ColorCode, ColorId: ColorCode, CompanyCode, CrclRow, HaveYoungModule: false, SecondInsurerCode:"507", SecondInsurerId:"7", captchaResult: solvedCaptchaText, captchaToken: captchaReg.tokenid, count: 1 };
            const response = await fetch(register, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify(requestDataRegister) });
            const data = await response.json();

            if (data?.isSuccess === false) throw new Error(data.messages[0]);
            if (!data?.banks?.length) throw new Error("لیست بانک نامعتبر یا ظرفیت تکمیل.");

            const randomBank = data.banks[Math.floor(Math.random() * data.banks.length)];
            updateLiveConsole({ bank: randomBank.bankName, status: `بانک انتخاب شد: ${randomBank.bankName}` }, `بانک انتخاب شد: ${randomBank.bankName}`);

            updateProcessStatus('تایید اطلاعات...');
            await fetch(confirmdata, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify({ id: randomBank.id }) });
            updateProcessStatus('دریافت کپچاهای نهایی...');
            appendConsoleLog('دریافت کپچاهای نهایی');
            const captcha1 = await fetchCaptchasstep2();
            const captcha2 = await fetchCaptchasstep2();
            if (!captcha1 || !captcha2) throw new Error("کپچای نهایی ناموفق.");

            const solvedCaptcha1Text = isAutoCaptchaEnabled ? (await solveCaptcha(captcha1.image))?.text : await getManualCaptchaInput(captcha1.image, "کپچای اول");
            const solvedCaptcha2Text = isAutoCaptchaEnabled ? (await solveCaptcha(captcha2.image))?.text : await getManualCaptchaInput(captcha2.image, "کپچای دوم");
            if (!solvedCaptcha1Text || !solvedCaptcha2Text) throw new Error("حل کپچای نهایی ناموفق.");

            updateProcessStatus('ارسال تایید نهایی...');
            appendConsoleLog('ارسال تایید نهایی');
            const requestDataFill = { bankName: randomBank.bankName, captchaResult: solvedCaptcha1Text, captchaToken: captcha1.tokenid, confirmAffidavit: true, isAccept: true, onlineshoppingId: data.id };
            const responseFillConfirm = await fetch(fillconfirm, { method: 'POST', headers: { "Accept": "application/json", "Authorization": `Bearer ${token}`, "Content-Type": "application/json" }, body: JSON.stringify(requestDataFill) });
            const resultfilldata = await responseFillConfirm.json();

            if (typeof resultfilldata.queueId === 'undefined') throw new Error(`تایید نهایی ناموفق: ${resultfilldata?.error?.Message || 'صف نامعتبر.'}`);
            await checkResultLoop(data.id, resultfilldata.queueId);

            updateProcessStatus('بررسی لینک رزرو...');
            appendConsoleLog('بررسی لینک رزرو');
            const serverdata = { megaCaptchaResult: solvedCaptcha2Text, megaCaptchaToken: captcha2.tokenid };
            const responseGetUrl = await fetch(getreverseurl, { method: "POST", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` }, body: JSON.stringify(serverdata) });
            const respomsegeturl = await responseGetUrl.json();

            // New bankUrl handling
            if (respomsegeturl?.data?.bankUrl) {
                const bankUrl = respomsegeturl.data.bankUrl;
                showBankLink(bankUrl);
                updateLiveConsole({ status: 'لینک بانک دریافت شد' }, 'لینک بانک دریافت شد');
                window.open(bankUrl, "_blank");
                return true;
            }
            if (respomsegeturl?.data?.url) {
                const bankUrl = respomsegeturl.data.url;
                updateProcessStatus('لینک رزرو دریافت شد.');
                updateLiveConsole({ status: 'لینک رزرو دریافت شد' }, 'لینک رزرو دریافت شد');
                showBankLink(bankUrl);
                window.open(bankUrl, "_blank");
            }
            return true; // Indicate success
        } catch (error) {
            console.error("Register/Confirm Error:", error);
            updateProcessStatus(`خطا در ثبت: ${error.message}. تلاش با گزینه‌ای دیگر...`, true);
            updateLiveConsole({ status: 'خطای ثبت/تایید' }, `خطای ثبت: ${error.message}`);
            await new Promise(resolve => setTimeout(resolve, 1500));
            return false; // Indicate failure
        }
    }

    async function checkResultLoop(orderId, queueId) {
        updateProcessStatus("ورود به صف...");
        const token = getTokenFromCookies("token");
        const requestDataCheckResult = { orderId, queueId };
        for (let i = 0; i < 3000; i++) {
            updateProcessStatus(`بررسی وضعیت صف (${i+1}/3000)...`);
            const response = await fetch(checkresult, { method: "POST", headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${token}` }, body: JSON.stringify(requestDataCheckResult) });
            const loopData = await response.json();

            if (loopData?.errorDescription) throw new Error(loopData.errorDescription);
            if (loopData?.data?.nextPageUrl) {
                updateProcessStatus("انتقال به درگاه پرداخت...");
                window.location.href = loopData.data.nextPageUrl;
                return;
            }
            if (loopData?.data?.activeOrderId) return;
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        throw new Error("پایان زمان انتظار در صف.");
    }

    function getTokenFromCookies(cookieName) {
        const cookies = document.cookie.split('; ');
        for (const cookie of cookies) {
            const [name, value] = cookie.split('=');
            if (name === cookieName) {
                return value;
            }
        }
        return null;
    }

    function getManualCaptchaInput(imageUrl, title = 'کپچا را وارد کنید') {
        return new Promise((resolve) => {
            const container = document.createElement('div');
            container.className = 'saipa-bot-card';
            container.style.marginTop = '15px';
            container.innerHTML = `<h3 style="text-align:center; margin:0;">${title}</h3><img src="${imageUrl}" class="saipa-bot-captcha-image">`;
            const input =
                document.createElement('input');
            input.type = 'text';
            input.className = 'saipa-bot-input';
            const button = document.createElement('button');
            button.textContent = 'ادامه';
            button.className = 'saipa-bot-button saipa-bot-button-submit';
            button.onclick = () => {

                const value = input.value.trim();
                if (value) { container.remove(); resolve(value); } else { alert('لطفا کپچا را وارد کنید.'); }
            };
            container.appendChild(input);
            container.appendChild(button);
            document.getElementById('process-status').after(container);
            input.focus();
        });
    }

    // ===== Live Console: init + update + logs =====
    let _saipaConsole = null;
    let _saipaState = { car:'', province:'', city:'', branch:'', bank:'', plan:'', price:'', status:'' };
    let _saipaBankShown = false;

    function initLiveConsole() {
        if (document.getElementById('saipa-live-console-styles') === null) {
            const s = document.createElement('style');
            s.id = 'saipa-live-console-styles';
            s.textContent = liveConsoleStyles;
            document.head.appendChild(s);
        }
        if (_saipaConsole) return;
        const c = document.createElement('div');
        c.className = 'saipa-live-console';
        c.innerHTML = `
            <div class="lc-header">
              <span>🔍 وضعیت ربات</span>
              <div><button id="lc-toggle" style="background:none;color:#fff;border:none;cursor:pointer">▤</button></div>
            </div>
            <div class="lc-body">
              <div class="lc-field"><div class="label">خودرو</div><div id="lc-car" class="value">—</div></div>
              <div class="lc-field"><div class="label">استان</div><div id="lc-province" class="value">—</div></div>
              <div class="lc-field"><div class="label">شهر</div><div id="lc-city" class="value">—</div></div>
              <div class="lc-field"><div class="label">نمایندگی</div><div id="lc-branch" class="value">—</div></div>
              <div class="lc-field"><div class="label">بانک</div><div id="lc-bank" class="value">—</div></div>
              <div class="lc-field"><div class="label">طرح</div><div id="lc-plan" class="value">—</div></div>
              <div class="lc-field"><div class="label">قیمت</div><div id="lc-price" class="value">—</div></div>
              <div class="lc-field"><div class="label">وضعیت</div><div id="lc-status" class="value">—</div></div>
            </div>
            <div class="lc-logs" id="lc-logs"></div>
        `;
        const host = document.querySelector('.saipa-bot-container');
        if (host) {
            c.classList.add('embedded');
            const headerInHost = host.querySelector('.saipa-bot-header');
            if (headerInHost && headerInHost.nextSibling) {
                host.insertBefore(c, headerInHost.nextSibling);
            } else {
                host.appendChild(c);
            }
        } else {
            document.body.appendChild(c);
        }
        const toggleBtn = c.querySelector('#lc-toggle');
        if (toggleBtn) toggleBtn.addEventListener('click', () => {
            c.classList.toggle('collapsed');
        });
        // Also allow clicking header to toggle in embedded mode
        const header = c.querySelector('.lc-header');
        if (header) header.addEventListener('click', (e) => {
            if ((e.target && e.target.id) === 'lc-toggle') return;
            c.classList.toggle('collapsed');
        });
        _saipaConsole = c;
    }

    function updateLiveConsole(data = {}, logMsg = '') {
        if (!_saipaConsole) initLiveConsole();
        Object.assign(_saipaState, data);
        for (const [key, val] of Object.entries(_saipaState)) {
            const el = document.getElementById('lc-' + key);
            if (el) el.textContent = val || '—';
        }
        if (logMsg) appendConsoleLog(logMsg);
    }

    function appendConsoleLog(msg) {
        const list = document.getElementById('lc-logs');
        if (!list) return;
        const time = new Date().toLocaleTimeString();
        const div = document.createElement('div');
        div.className = 'lc-log-item';
        div.innerHTML = `<span class="time">[${time}]</span>${msg}`;
        list.appendChild(div);
        list.scrollTop = list.scrollHeight;
    }

    function showBankLink(bankUrl) {
        // inject styles once
        if (!document.getElementById('saipa-bank-link-styles')) {
            const s = document.createElement('style');
            s.id = 'saipa-bank-link-styles';
            s.textContent = bankLinkStyles;
            document.head.appendChild(s);
        }
        if (_saipaBankShown) return;
        const host = document.querySelector('.saipa-bot-container') || document.body;
        const toast = document.createElement('div');
        toast.className = 'saipa-bank-link-toast';
        toast.innerHTML = `
          <div class="title">لینک درگاه بانکی آماده است</div>
          <div>در صورت عدم باز شدن خودکار، با دکمه زیر وارد شوید:</div>
          <div style="margin-top:10px; display:flex; gap:8px; justify-content:flex-end;">
            <button id="saipa-bank-open-btn" class="saipa-bot-button saipa-bot-button-submit" style="width:auto !important;">باز کردن درگاه</button>
          </div>
        `;
        host.appendChild(toast);
        const openBtn = toast.querySelector('#saipa-bank-open-btn');
        if (openBtn) openBtn.addEventListener('click', () => window.open(bankUrl, '_blank'));
        _saipaBankShown = true;
    }

    function initialize() {
        mainContainer = createMainContainer();
        setupHeader(mainContainer);
        initLiveConsole();
        reloadContent();
        setupFloatingButtons();
    }

    function setupFloatingButtons() {
        const svgNS = "http://www.w3.org/2000/svg";

        // 1. Main Panel Toggle Button (Top Left)
        const panelToggleButton = document.createElement('button');
        panelToggleButton.id = 'saipa-bot-toggle-button-new';
        panelToggleButton.title = 'باز/بسته کردن پنل';
        panelToggleButton.textContent = 'منوی اصلی';
        const panelToggleSvg = document.createElementNS(svgNS, "svg");
        panelToggleSvg.setAttribute("viewBox", "0 0 24 24");
        panelToggleSvg.innerHTML = `<path d="M4 18h16c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1s.45 1 1 1zm0-5h16c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1s.45 1 1 1zM3 7c0 .55.45 1 1 1h16c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1z"/>`;
        panelToggleButton.insertBefore(panelToggleSvg, panelToggleButton.firstChild);
        panelToggleButton.addEventListener('click', () => {
            mainContainer.style.display = (window.getComputedStyle(mainContainer).display === 'none') ? 'flex' : 'none';
        });
        document.body.appendChild(panelToggleButton);

        // 2. Action Buttons (Right Side)
        const actionButtons = [
            { title: 'دریافت بروزرسانی', icon: `<path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>`, onClick: () => { window.open('https://github.com/masoudes72/saipa/raw/refs/heads/main/saipa.user.js', '_blank'); }, class: 'saipa-button-new-update' },
            { title: 'کپچای خودکار', icon: ``, onClick: toggleAutoCaptcha, class: 'saipa-button-new-captcha', isCaptcha: true },
            { title: 'پاک کردن کوکی‌ها', icon: `<path d="M6,19c0,1.1,0.9,2,2,2h8c1.1,0,2-0.9,2-2V7H6V19z M19,4h-3.5l-1-1h-5l-1-1H5v2h14V4z"/>`, onClick: clearSiteCookies, class: 'saipa-button-new-clear' },
            { title: 'بارگذاری مجدد', icon: `<path d="M17.65,6.35C16.2,4.9,14.21,4,12,4c-4.42,0-7.99,3.58-7.99,8s3.57,8,7.99,8c3.73,0,6.84-2.55,7.73-6h-2.08 c-0.82,2.33-3.04,4-5.65,4c-3.31,0-6-2.69-6-6s2.69-6,6-6c1.66,0,3.14,0.69,4.22,1.78L13,11h7V4L17.65,6.35z"/>`, onClick: reloadContent, class: 'saipa-button-new-reload' },
        ];

        actionButtons.forEach(def => {
            const button = document.createElement('button');
            button.className = `saipa-action-button ${def.class}`;
            button.title = def.title;
            button.addEventListener('click', def.onClick);

            const svg = document.createElementNS(svgNS, "svg");
            svg.setAttribute("viewBox", "0 0 24 24");
            if (def.icon) svg.innerHTML = def.icon;
            button.appendChild(svg);

            if (def.isCaptcha) {
                updateCaptchaButtonState(button, svg);
            }

            document.body.appendChild(button);
        });
    }

    function toggleAutoCaptcha() {
        isAutoCaptchaEnabled = !isAutoCaptchaEnabled;
        GM_setValue('autoCaptchaEnabled', isAutoCaptchaEnabled);
        alert(`حل خودکار کپچا ${isAutoCaptchaEnabled ? 'روشن' : 'خاموش'} شد.`);
        const btn = document.querySelector('.saipa-button-new-captcha');
        const svg = btn.querySelector('svg');
        updateCaptchaButtonState(btn, svg);
    }

    function updateCaptchaButtonState(button, svg) {
        if (!button || !svg) return;
        button.classList.toggle('auto-on', isAutoCaptchaEnabled);
        svg.innerHTML = isAutoCaptchaEnabled
            ? `<path d="M9,16.2L4.8,12l-1.4,1.4L9,19,21,7l-1.4-1.4L9,16.2z"/>` // Check icon
            : `<path d="M19,6.41L17.59,5,12,10.59,6.41,5,5,6.41,10.59,12,5,17.59,6.41,19,12,13.41,17.59,19,19,17.59,13.41,12,19,6.41z"/>`; // Close icon
    }

    function clearSiteCookies() {
        if (!confirm("آیا مطمئن هستید که می‌خواهید تمام کوکی‌های سایت را پاک کنید؟")) return;
        const cookies = document.cookie.split(";");
        for (let cookie of cookies) {
            const name = cookie.split("=")[0].trim();
            document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
        }
        alert('کوکی‌ها پاک شدند. صفحه مجددا بارگذاری می‌شود.');
        window.location.reload();
    }

    initialize();

})();
