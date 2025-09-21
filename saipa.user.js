// ==UserScript==
// @name         Saipa Automation Bot
// @namespace    http://tampermonkey.net/
// @version      2025-07-21
// @description  Fully redesigned with a modern, dark, glowing UI.
// @author       You (Redesigned by Gemini)
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

        searchAreaDiv.innerHTML = `
            <h2 style="font-size: 1.4em; text-align: center; color: var(--dark-primary); margin:0;">جستجوی خودرو</h2>
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
        `;
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

        const priceInput = document.getElementById('price-term-input');
        priceInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/,/g, '');
            if (value && !isNaN(value)) {
                e.target.value = Number(value).toLocaleString('en-US');
            } else {
                e.target.value = '';
            }
        });

        searchButton.addEventListener('click', () => {
            if (isSearching) {
                stopCarSearch();
            } else {
                const searchTerm = document.getElementById('search-term-input').value.trim();
                const salesPlanTerm = document.getElementById('sales-plan-input').value.trim();
                const priceTerm = parseInt(document.getElementById('price-term-input').value.trim().replace(/,/g, '')) || null;
                const saleTypeFilter = document.getElementById('sale-type-input').value.trim();
                const exactMatch = document.getElementById('exact-match-checkbox').checked;
                const specificCity = document.getElementById('city-term-input').value.trim();
                if (searchTerm) {
                    startCarSearch(searchTerm, salesPlanTerm, priceTerm, saleTypeFilter, exactMatch, specificCity);
                } else {
                    alert("نام خودرو را وارد کنید.");
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

    async function startCarSearch(searchTerm, salesPlanTerm, priceTerm, saleTypeFilter, exactMatch, specificCity) {
        isSearching = true;
        const statusDiv = document.getElementById('search-status');
        const searchButton = document.getElementById('search-button');
        if (searchButton) {
            searchButton.disabled = false; // Keep it enabled to act as a stop button
            searchButton.querySelector('strong').textContent = 'لغو جستجو';
        }

        while (isSearching) {
            statusDiv.textContent = `جستجو برای "${searchTerm}"...`;
            const items = await fetchItemsData();

            if (!isSearching) break; // If search was cancelled, exit loop

            if (items) {
                 const foundItems = items.filter(item => {
                    const title = item.title.trim().toLowerCase();
                    const term = searchTerm.toLowerCase();
                    return exactMatch ? title === term : title.includes(term);
                });

                if (foundItems.length === 1) {
                    isSearching = false;
                    const foundItem = foundItems[0];
                    statusDiv.textContent = `یک خودرو "${foundItem.title}" یافت شد. در حال پردازش...`;
                    handleItemButtonClick(foundItem, salesPlanTerm, priceTerm, saleTypeFilter, specificCity);
                } else if (foundItems.length > 1) {
                    isSearching = false;
                    statusDiv.textContent = `${foundItems.length} خودرو یافت شد. لطفاً یکی را انتخاب کنید.`;
                    displayProductSelection(foundItems, salesPlanTerm, priceTerm, saleTypeFilter, specificCity);
                } else {
                    statusDiv.textContent = `خودرویی با نام "${searchTerm}" یافت نشد. تلاش مجدد...`;
                    await new Promise(resolve => setTimeout(resolve, 1500));
                }
            } else {
                statusDiv.textContent = "خطا در دریافت لیست خودروها. تلاش مجدد...";
                await new Promise(resolve => setTimeout(resolve, 5000)); // Wait longer on API error
            }
        }

        // Reset button if loop finishes (e.g. was cancelled)
        if (!isSearching) {
            stopCarSearch();
        }
    }

    function displayProductSelection(items, salesPlanTerm, priceTerm, saleTypeFilter, specificCity) {
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
                handleItemButtonClick(item, salesPlanTerm, priceTerm, saleTypeFilter, specificCity);
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

    function handleItemButtonClick(item, salesPlanTerm, priceTerm, saleTypeFilter, specificCity) {
        contentAreaContainer.innerHTML = '';
        const carDetailsDiv = document.createElement('div');
        carDetailsDiv.classList.add('saipa-bot-card');
        carDetailsDiv.innerHTML = `
            <h2 style="text-align: center; color: var(--dark-primary);">${item.title}</h2>
            <p>خودروی <strong>${item.title}</strong> به صورت خودکار انتخاب شد.</p>
            <div id="process-status">شروع مراحل ثبت نام...</div>
        `;
        contentAreaContainer.appendChild(carDetailsDiv);
        fetchData(item.id, salesPlanTerm, priceTerm, saleTypeFilter, specificCity);
    }

    function updateProcessStatus(message, isError = false) {
        const statusDiv = document.getElementById('process-status');
        if (statusDiv) {
            statusDiv.textContent = message;
            statusDiv.style.color = isError ? 'var(--dark-danger)' : 'var(--dark-text-muted)';
            statusDiv.style.borderColor = isError ? 'var(--dark-danger)' : 'var(--dark-border)';
        }
    }

    async function fetchData(carModelId, salesPlanTerm = "", priceTerm = null, saleTypeFilter = "", specificCity = "") {
        while (true) {
            try {
                updateProcessStatus('دریافت اطلاعات طرح‌های فروش...');
                let result = null;
                while (result === null) {
                    const url = `${circulationApiUrl}?carModelId=${carModelId}`;
                    const response = await fetch(url);
                    if (!response.ok) throw new Error(`خطای شبکه در دریافت طرح فروش: ${response.statusText}`);
                    const data = await response.json();

                    if (!data?.data?.length) {
                        updateProcessStatus("هیچ طرح فعالی یافت نشد. تلاش مجدد...", true);
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
                        result = foundPlan;
                    } else {
                        updateProcessStatus(`طرح "${salesPlanTerm || 'مناسب'}" یافت نشد. تلاش مجدد...`, true);
                        await new Promise(resolve => setTimeout(resolve, 3000));
                    }
                }

                const checkedIds = result.options.filter(o => o.isChecked).map(o => o.id);
                let selectedBranch = null;

                while (!selectedBranch) {
                    updateProcessStatus('دریافت لیست شهرها...');
                    const requestDatacity = { provinceId: 4, circulationId: result.id };
                    const cityResponse = await fetch(circulationbranchcity, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(requestDatacity) });
                     if (!cityResponse.ok) throw new Error(`خطای شبکه در دریافت شهرها: ${cityResponse.statusText}`);
                    const availableCities = await cityResponse.json();

                    if (!availableCities?.length) {
                        updateProcessStatus(`هیچ شهری یافت نشد. تلاش مجدد...`, true);
                        await new Promise(resolve => setTimeout(resolve, 3000));
                        continue;
                    }

                    let targetCity = null;
                    if (specificCity) {
                        targetCity = availableCities.find(city => city.title.includes(specificCity));
                        if (!targetCity) {
                            updateProcessStatus(`شهر "${specificCity}" یافت نشد. انتخاب شهر تصادفی...`, true);
                        }
                    }

                    if (!targetCity) {
                        targetCity = availableCities[Math.floor(Math.random() * availableCities.length)];
                    }

                    updateProcessStatus(`شهر "${targetCity.title}" انتخاب شد.`);

                    const requestDatacityBranch = { cityCode: targetCity.code, circulationId: result.id };
                    const branchResponse = await fetch(circilationbranchcityget, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(requestDatacityBranch) });
                    if (!branchResponse.ok) throw new Error(`خطای شبکه در دریافت نمایندگی: ${branchResponse.statusText}`);
                    const branches = await branchResponse.json();

                    if (branches?.length) {
                        selectedBranch = branches[Math.floor(Math.random() * branches.length)];
                    } else {
                        updateProcessStatus(`نمایندگی در شهر "${targetCity.title}" یافت نشد. تلاش با شهری دیگر...`, true);
                        await new Promise(resolve => setTimeout(resolve, 1500));
                    }
                }

                if (!selectedBranch?.code || !selectedBranch?.id) throw new Error("نمایندگی نامعتبر.");
                updateProcessStatus(`نمایندگی "${selectedBranch.title}" انتخاب شد.`);
                registercar(selectedBranch.code, selectedBranch.id, result.id, result.carUsages[0].id, checkedIds, result.circulationColors[0].colorCode, result.companyCode, result.crcl_row);
                break; // Exit the while(true) loop on success
            } catch (error) {
                console.error('Fetch Data Error:', error);
                updateProcessStatus(`خطا: ${error.message}. تلاش مجدد...`, true);
                await new Promise(resolve => setTimeout(resolve, 3000)); // Wait before retrying the whole function
            }
        }
    }

    async function registercar(BranchCode, BranchId, CardId, CarUsageId, CirculationOptionIds, ColorCode, CompanyCode, CrclRow){
        const token = getTokenFromCookies("token");
        while (true) {
            try {
                updateProcessStatus('دریافت کپچا برای ثبت...');
                const captchaReg = await fetchCaptchasstep2();
                if (!captchaReg) throw new Error("دریافت کپچای ثبت ناموفق بود.");
                const solvedCaptchaText = isAutoCaptchaEnabled
                    ? (await solveCaptcha(captchaReg.image))?.text
                    : await getManualCaptchaInput(captchaReg.image);
                if (!solvedCaptchaText) throw new Error("حل کپچا ناموفق بود.");

                updateProcessStatus('ثبت اولیه...');
                const requestDataRegister = { BranchCode, BranchId, CardId, CarUsageId, CircuLationId: CardId, CirculationOptionIds, ColorCode, ColorId: ColorCode, CompanyCode, CrclRow, HaveYoungModule: false, SecondInsurerCode:"507", SecondInsurerId:"7", captchaResult: solvedCaptchaText, captchaToken: captchaReg.tokenid, count: 1 };
                const response = await fetch(register, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify(requestDataRegister) });
                const data = await response.json();

                if (data?.isSuccess === false) throw new Error(data.messages[0]);
                if (!data?.banks?.length) throw new Error("لیست بانک نامعتبر یا ظرفیت تکمیل.");

                const randomBank = data.banks[Math.floor(Math.random() * data.banks.length)];

                updateProcessStatus('تایید اطلاعات...');
                await fetch(confirmdata, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify({ id: randomBank.id }) });
                updateProcessStatus('دریافت کپچاهای نهایی...');
                const captcha1 = await fetchCaptchasstep2();
                const captcha2 = await fetchCaptchasstep2();
                if (!captcha1 || !captcha2) throw new Error("کپچای نهایی ناموفق.");

                const solvedCaptcha1Text = isAutoCaptchaEnabled ? (await solveCaptcha(captcha1.image))?.text : await getManualCaptchaInput(captcha1.image, "کپچای اول");
                const solvedCaptcha2Text = isAutoCaptchaEnabled ? (await solveCaptcha(captcha2.image))?.text : await getManualCaptchaInput(captcha2.image, "کپچای دوم");
                if (!solvedCaptcha1Text || !solvedCaptcha2Text) throw new Error("حل کپچای نهایی ناموفق.");

                updateProcessStatus('ارسال تایید نهایی...');
                const requestDataFill = { bankName: randomBank.bankName, captchaResult: solvedCaptcha1Text, captchaToken: captcha1.tokenid, confirmAffidavit: true, isAccept: true, onlineshoppingId: data.id };
                const responseFillConfirm = await fetch(fillconfirm, { method: 'POST', headers: { "Accept": "application/json", "Authorization": `Bearer ${token}`, "Content-Type": "application/json" }, body: JSON.stringify(requestDataFill) });
                const resultfilldata = await responseFillConfirm.json();

                if (typeof resultfilldata.queueId === 'undefined') throw new Error(`تایید نهایی ناموفق: ${resultfilldata?.error?.Message || 'صف نامعتبر.'}`);
                await checkResultLoop(data.id, resultfilldata.queueId);

                updateProcessStatus('بررسی لینک رزرو...');
                const serverdata = { megaCaptchaResult: solvedCaptcha2Text, megaCaptchaToken: captcha2.tokenid };
                const responseGetUrl = await fetch(getreverseurl, { method: "POST", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` }, body: JSON.stringify(serverdata) });
                const respomsegeturl = await responseGetUrl.json();

                if (respomsegeturl?.data?.url) {
                    updateProcessStatus('انتقال به لینک رزرو...');
                    window.location.href = respomsegeturl.data.url;
                }
                break;
            } catch (error) {
                console.error("Register/Confirm Error:", error);
                updateProcessStatus(`خطا: ${error.message}. تلاش مجدد...`, true);
                await new Promise(resolve => setTimeout(resolve, 3000));
            }
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

    function initialize() {
        mainContainer = createMainContainer();
        setupHeader(mainContainer);
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


