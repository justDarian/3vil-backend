// ==UserScript==
// @name        3VIL Predictor
// @namespace   http://tampermonkey.net/
// @version     3.0
// @description 3VIL Predictor | cyxz | mahtab_3vil.
// @author      3VIL Predictor
// @match       https://bloxflip.com/*
// @icon        https://www.google.com/s2/favicons?sz=64&domain=bloxflip.com
// @grant       GM_xmlhttpRequest
// @grant       GM_addStyle
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_openInTab
// @connect     *
// @noframes
// @require     https://cdnjs.cloudflare.com/ajax/libs/js-sha256/0.10.1/sha256.min.js
// ==/UserScript==

GM_addStyle(`
    .methodsHolder {
      --sb-track-color: transparent;
      --sb-thumb-color: rgba(0, 0, 0, 0.3);
      --sb-size: 12px;
    }

    .methodsHolder::-webkit-scrollbar {
      width: var(--sb-size);
    }
    .methodsHolder::-webkit-scrollbar-track {
      background: var(--sb-track-color);
      border-radius: 8px;
    }
    .methodsHolder::-webkit-scrollbar-thumb {
      background: var(--sb-thumb-color);
      border-radius: 8px;
    }
    .container {
      width: 340px;
      margin-top: 6rem;
      position: fixed;
      top: 80px;
      right: 20px;
      padding: 20px;
      border-radius: 16px;
      z-index: 99999;
      color: #fff;
      overflow: hidden;
      background: linear-gradient(145deg, rgba(25, 25, 25, 0.8), rgba(50, 50, 50, 0.8));
      box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
      backdrop-filter: blur(12px);
    }
    .loginContainer {
      background: linear-gradient(135deg, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.9));
      width: 360px;
      padding: 24px;
      border-radius: 20px;
      z-index: 9999;
      text-align: center;
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      border: 2px solid rgba(255, 255, 255, 0.2);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
    }
    .VILnotification {
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(0, 0, 0, 0.8);
      padding: 16px;
      border-radius: 12px;
      text-align: center;
      z-index: 9999;
      transition: transform 0.5s ease, opacity 0.5s ease;
      opacity: 0;
      border: 2px solid rgba(255, 255, 255, 0.3);
      box-shadow: 0 6px 18px rgba(0, 0, 0, 0.4);
      height: 80px;
      width: 300px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
    .slide-in {
      transform: translate(-50%, 80px);
      opacity: 1;
    }
    .blurred {
      filter: blur(4px);
    }
    .slide-out {
      transform: translate(-50%, -80px);
      opacity: 0;
    }
    .VILnotificationText2,
    .VILnotificationText {
      font-weight: bold;
      color: #fff;
    }

    .VILnotificationText2 {
      font-size: 22px;
    }

    .VILnotificationText {
      font-size: 14px;
    }
    .loginButton {
      background-color: rgba(255, 255, 255, 0.1);
      color: #fff;
      width: 140px;
      height: 50px;
      border: none;
      border-radius: 12px;
      font-size: 18px;
      cursor: pointer;
      display: block;
      margin: 15px auto;
      transition: background-color 0.3s ease, transform 0.3s ease;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    }

    .loginButton:hover {
      background-color: rgba(255, 255, 255, 0.2);
      transform: scale(1.05);
    }
    #text-x {
      margin-bottom: 12px;
    }

    #display-prediction {
      color: #ff4d4d;
      font-size: 22px;
      font-weight: bold;
      margin-top: 16px;
    }

    #customg {
      padding: 0;
      margin: 0;
      background: rgba(0, 0, 0, 0.3);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
      border: 1px solid rgba(255, 255, 255, 0.2);
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 16px;
      width: 100%;
      border-radius: 16px;
      margin-top: 20px;
    }
    .custom-ele {
      color: #fff;
      font-weight: bold;
      padding: 12px;
      cursor: pointer;
      transition: transform 0.3s ease, background-color 0.3s ease;
      font-size: 24px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.1);
    }

    .custom-ele:hover {
      transform: scale(1.1);
      background-color: rgba(255, 255, 255, 0.2);
    }
        .button-grid {

    }

    .predictionBox {
      border: 2px solid rgba(128, 128, 128, 0.4);
      background: rgba(0, 0, 0, 0.80);
      border-radius: 16px;
      padding: 24px;
      backdrop-filter: blur(12px);
      width: 100%;
      padding: 20px;
      width: 100%;
      height: 210px;
      align-items: center;
      justify-content: center;
      box-shadow: 0 6px 18px rgba(0, 0, 0, 0.3);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    .predictionBox:hover {
      box-shadow: 0 12px 24px rgba(0, 0, 0, 0.5);
      transform: translateY(-8px);
    }
    .dashboardText {
      margin: 0;
      font-size: 54px;
      font-weight: bold;
      color: #e63946;
      text-align: center;
      letter-spacing: 1px;
      border-radius: 30px;
      text-shadow: 3px 3px 8px rgba(0, 0, 0, 0.6);
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .dataText {
      padding: 16px;
      text-align: center;
      font-weight: bold;
      font-size: 34px;
      color: #fff;
      font-family: 'Roboto', sans-serif;
      letter-spacing: 0.5px;
      background: rgba(0, 0, 0, 0.2);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      transition: color 0.3s ease;
    }
    .basicText {
      text-align: left;
      font-size: 18px;
      color: #fff;
    }
    .userButtons {
      opacity: 0.9;
      border: 2px solid rgba(0, 0, 0, 0.3);
      background-color: rgba(0, 0, 0, 0.4);
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }
    .userStatsText {
      font-size: 20px;
      color: #fff;
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      margin-bottom: 20px;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .userSettingsProfile {
      font-size: 24px;
      color: #fff;
      letter-spacing: 1px;
      margin: 12px;
    }
    .userSettingsProfileS {
      background: rgba(0, 0, 0, 0.8);
      position: relative;
      font-size: 40px;
      letter-spacing: 1px;
    }
    .textNearp {
      align-items: center;
      margin-left: 12px;
      font-size: 18px;
      color: #fff;
      display: block;
      justify-content: center;
    }
    .predictionText {
      margin-left: 12px;
      font-size: 24px;
      color: #fff;
      display: block;
    }
    .userInfoBox {
      margin-top: 20px;
      padding: 20px;
      background: rgba(0, 0, 0, 0.6);
      border-radius: 16px;
      color: #fff;
      box-shadow: 0 6px 18px rgba(0, 0, 0, 0.3);
    }
    .methodsHolder {
      border: 2px solid rgba(128, 128, 128, 0.3);
      border-radius: 16px;
      background: radial-gradient(circle, rgba(20, 24, 30, 0.829), transparent 100%);
      padding: 16px;
      margin-top: 3rem;
      height: auto;
      max-height: 45vh;
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
      transition: background-color 0.3s ease;
    }

    .loginContainer {
      background: linear-gradient(145deg, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.9));
      width: 360px;
      padding: 24px;
      border-radius: 20px;
      z-index: 9999;
      text-align: center;
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      border: 2px solid rgba(255, 255, 255, 0.3);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .loginContainer:hover {
      transform: translate(-50%, -50%) scale(1.02);
      box-shadow: 0 12px 24px rgba(0, 0, 0, 0.5);
    }
    .cbHolder {
      overflow-y: auto;
    }

    .method {
      background-color: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(8px);
      border-radius: 50%;
      margin-right: 8px;
      color: #ddd;
      padding: 6px;
      appearance: none;
      width: 14px;
      height: 14px;
      cursor: pointer;
      position: relative;
    }

    .method:checked {
      background-color: #fff;
    }

    .method:after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background-color: #000;
      display: none;
    }

    .method:checked:after {
      display: block;
    }

    .clickable-box {
      border-radius: 5px;
      margin: 2px;
      border: none;
      background-color: rgba(255, 255, 255, 0.1);
      box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
      transition: background-color 0.3s ease;
    }

    .clickable-box:hover {
        background-color: rgba(255, 255, 255, 0.3);
        transform: scale(1.02);
    }
    .welcomeText {
      font-size: 24px;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
      margin-bottom: 24px;
      color: #fff;
    }

    .loginInput {
      background-color: #fff;
      font-size: 18px;
      border-radius: 12px;
      padding: 12px;
      margin: 12px 0;
      width: 100%;
      height: 48px;
      border: 1px solid #ddd;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      transition: border-color 0.3s ease, box-shadow 0.3s ease;
    }
    .loginInput:focus {
      border-color: #bbb;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    }
    .loginText {
      margin: 0;
      font-family: 'Poppins', sans-serif;
      font-size: 50px;
      background: linear-gradient(135deg, #ff4d4d, #ff6f6f);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      transition: transform 0.3s ease;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
    }

    .loginText:hover {
      transform: scale(1.05);
    }


          .glassmorphic-container {
      background: radial-gradient(circle, rgba(2, 37, 79, 0.829), transparent 100%);
      border-radius: 15px;
      backdrop-filter: blur(10px);
      padding: 20px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      display: flex;
      flex-direction: column;
      margin-top: 10px;
    }
    .glassmorphic-title {
      padding: 0;
      text-align: center;
      display: block;
      font-weight: bold;
      font-size: 35px;
      color: #fff;
    }
    .glassmorphic-label {
      color: #5f6892;
      font-size: 18px;
      margin-bottom: 10px;

    }
    .glassmorphic-input-base {
      padding: 10px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .glassmorphic-color-input {
      border: none;
      background: transparent;
      cursor: pointer;
      margin-bottom: 40px;

    }
    .glassmorphic-button {
      background: rgba(27, 46, 115, 1);
      border: none;
      border-radius: 8px;
      color: #fff;
      margin-top: 10px;

      padding: 10px 20px;
      font-size: 16px;
      cursor: pointer;
      transition: background 0.3s ease;
    }
    .glassmorphic-button:hover {
      background: rgba(0, 0, 0, 0.2);
    }
    .glassmorphic-input {
      background: rgba(255, 255, 255, 0.2);
      border: none;
      border-radius: 8px;
      padding: 10px;
      color: #fff;
      font-size: 16px;
      width: 100%;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }
    .glassmorphic-input-label {
      color: #5f6892;
      font-size: 18px;
      margin-bottom: 10px;
    }
          .predictionBoxEdit {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      grid-auto-rows: minmax(20px, auto);
      grid-gap: 1px;
      grid-auto-flow: dense;

     }

     .predictionBoxEdit2 {
       display: grid;
       grid-template-columns: repeat(3, minmax(15px, 1fr));
       grid-auto-rows: minmax(5px, auto);
       grid-gap: 15px;
       grid-row-gap: 15px;
    }
      `);
    function loadFontAwesome() {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css';
        document.head.appendChild(link);
    }
    loadFontAwesome();


    class HTTPRequest {
      async post(url, headers = {}, json = {}) {
          return new Promise((callback, e) => {
              GM_xmlhttpRequest({
                  method: "POST",
                  url: url,
                  headers: headers,
                  data: JSON.stringify(json),
                  onload: function(data) {
                      callback(data);
                  },
                  onerror: function(data) {
                      callback(data);
                  }
              });
          })
      }
      async get(url, headers = {}, json = {}) {
          return new Promise((callback, e) => {
              GM_xmlhttpRequest({
                  method: "GET",
                  url: url,
                  headers: headers,
                  onload: function(data) {
                      callback(data);
                  },
                  onerror: function(data) {
                      callback(data);
                  }
              });
          })
      }
    }

    class GameEvent {
      constructor() {
        this.mines = false;
        this.towers = false;
      }

      update() {
        if (!this.mines) {
            this.updateMines()
        }
        if (this.towers) {
          this.updateTowers()
        }

      }
      updateMines() {
          const c = document.querySelector('#__next > div.layout_layout__JvcqL > div > div.layout_layoutColumn__e9oxs > div.game-layout_gameLayout__bgIOR > div.game-layout_gameLayoutColumn__q01vS.game-layout_gameLayoutColumnLeft__55fuZ > div:nth-child(1) > button');
          c.addEventListener('click', function() {
              if (c.textContent.includes('Start new game')) {
                  predictionMethod = null;
              }
          });
      }

      updateTowers() {
          const towers_button = document.querySelector('#__next > div.layout_layout__JvcqL > div > div.layout_layoutColumn__e9oxs > div.game-layout_gameLayout__bgIOR > div.game-layout_gameLayoutColumn__q01vS.game-layout_gameLayoutColumnLeft__55fuZ > div.gameBlock.gameBet.towers_towersBet__irweK > button');
          towers_button.addEventListener('click', function() {
              if (towers_button.textContent.includes('Start new game')) {
                  predictionMethod = null;
              }
          });
      }
    }

    let request_background;
    let base_config = {
    'base_color': "#1100ff"
    }

    class Notification {
      constructor() {
          this.nigger = true;
      }

      async create(message) {
         const holder = document.createElement('div');
         holder.style.backgroundColor = request_background === undefined ? base_config.base_color: request_background;
         holder.className = 'VILnotification';
         const text = document.createElement('label');
         text.className = "VILnotificationText";
         const info = document.createElement('label')
         info.textContent = "3VIL Notifications";
         info.className = "VILnotificationText2";

         text.textContent = message;
         holder.appendChild(info);
         holder.appendChild(text)

         document.body.appendChild(holder);

          await new Promise(resolve => setTimeout(resolve, 300));

          requestAnimationFrame(() => {
             holder.classList.add('slide-in');
          });

          await new Promise(resolve => setTimeout(resolve, 2000));

          holder.classList.remove('slide-in');
          holder.classList.add('slide-out');

          await new Promise(resolve => {
              holder.addEventListener('animationend', resolve, { once: true });
          });


          document.body.removeChild(holder);
      }
    }

    class GameStats {
      constructor() {
          this.holder = null;
      }


      async remove() {
         this.holder.classList.remove('slide-in');
         this.holder.classList.add('slide-out');

          await new Promise(resolve => {
              this.holder.addEventListener('animationend', resolve, { once: true });
          });
          document.body.removeChild(this.holder);
          this.holder = null;
      }

      async _grab_data() {
        const http_req = new HTTPRequest();
        const headers = {
          'content-type': 'application/json',
          'x-auth-token': localStorage.getItem('_DO_NOT_SHARE_BLOXFLIP_TOKEN')
        }
        const response = await http_req.get('https://api.bloxflip.com/user',headers)
        const data = JSON.parse(response.responseText);
        return data
      }

      async create() {
        if (this.holder) {
            document.body.removeChild(this.holder);
        }
        const n = await this._grab_data();
        const holder = document.createElement('div');
        holder.style.backgroundColor = request_background === undefined ? "blue" : request_background;
        holder.className = 'VILnotification';
        this.holder = holder;

        const info = document.createElement('label');
        info.innerHTML = '<i class="fas fa-chart-line"></i> Your Stats';
        info.className = 'VILnotificationText2';

        const calculate_profit = Math.max(n.user.wallet - starting_bal, 0);
        const wagered = parseInt(n.user.wager);

        const text = document.createElement('label');
        text.innerHTML = `
            <i class="fas fa-coins"></i> Profit Made: ${calculate_profit} rbx<br>
            <i class="fas fa-dice"></i> Wagered: ${wagered} rbx
        `;
        text.className = 'VILnotificationText';

        holder.appendChild(info);
        holder.appendChild(text);

        document.body.appendChild(holder);

        await new Promise(resolve => setTimeout(resolve, 300));

        requestAnimationFrame(() => {
            holder.classList.add('slide-in');
        });
    }

    }

    class Utilities {
     static async get_starting_bal() {
        const http_req = new HTTPRequest();
        const headers = {
          'content-type': 'application/json',
          'x-auth-token': localStorage.getItem('_DO_NOT_SHARE_BLOXFLIP_TOKEN')
        }
        const response = await http_req.get('https://api.bloxflip.com/user',headers)
        const data = JSON.parse(await response.responseText);

        return data.user.wallet
     }
    }

    class Cooldown {
      constructor() {
          this.time = 0;
          this.running = false;
      }

      run_cooldown() {
          return new Promise((resolve) => {
              const cooldown = setInterval(() => {
                  if (this.time === 0) {
                      this.running = false;
                      clearInterval(cooldown);
                      resolve();
                  } else {
                      this.time -= 1;
                  }
              }, 1000);
          });
      }



      run(time) {
          if (this.running) {
            return "Cooldown already running";
          }
          this.time = time;
          this.running = true;
          this.run_cooldown();
      }
    }

    function rgb_convert(hex) {
      hex = hex.replace('#', '');
      let c = parseInt(hex, 16);
      let r = (c >> 16) & 255;
      let g = (c >> 8) & 255;
      let b = c & 255;

      return {r,g,b};
    }

    function _create_gradient(color) {
      const rg_color = rgb_convert(color);
      const bg = 'rgba(0, 0, 0, 0.8)';

      const grad_color = `rgba(${rg_color.r}, ${rg_color.g}, ${rg_color.b}, 0.6)`;
      return `linear-gradient(45deg, ${bg}, ${grad_color})`;
    }

    const g = new GameStats();

    const api_url = "https://evil.lol";
    const BASE_URL = "https://api.bloxflip.com/games/";

    // main data
    let key;
    let container;
    let current_gamemode;
    let predictionMethod = null;
    let starting_bal;

    async function n() {
      starting_bal = await Utilities.get_starting_bal()
    }
    n()

    // extra
    const event = new GameEvent();
    const noti = new Notification();

    let displayPrediction = document.createElement('div');

    const data_settings = {
      max_gamemodes: 35
    }

    const streamer_settings = {
      profile: '#__next > div.layout_layout__JvcqL > header > div > div.header_headerUser__8phtj > a > span > span:nth-child(1) > img',
      robux: '#__next > div.layout_layout__JvcqL > header > div > div.header_headerUser__8phtj > div > div > span > span',
      logo: 'https://apis.evil.lol/static/asr.gif',
    };

    class dataDecrypt {
      static async decrypt_c_data(data, key) {
          let result = "";
          for (let i = 0; i < data.length; i++) {
              result += String.fromCharCode(data.charCodeAt(i) ^ i % key.length);
          }
          return result

      }

      static async check_c_data(data) {
          const decrypted_data = JSON.parse(await dataDecrypt.decrypt_c_data(atob(data), '3vil_xor'));
          const d_auth = decrypted_data.auth
          const current_auth = sha256(await get_roblox_username());
          return d_auth === current_auth;
      }
    }


    class PredictionCheck extends HTTPRequest {
      constructor() {
          super();
      }
      async gamemode(gamemode_1) {
          const url = BASE_URL + gamemode_1;
          const headers = {
              'x-auth-token': localStorage.getItem('_DO_NOT_SHARE_BLOXFLIP_TOKEN')
          };
          const v = await this.get(url, headers);
          const data = JSON.parse(v.responseText);
          return data;
      }
    }

    class AutoPlay {
      constructor(data) {
          this.data = data;

      }
      async mines() {
          for (let i = 0; i < 25; i++) {
              if (this.data[i] === 1) {
                  const select = i + 1;
                  const element = document.querySelector(`#__next > div.layout_layout__JvcqL > div > div.layout_layoutColumn__e9oxs > div.game-layout_gameLayout__bgIOR > div.game-layout_gameLayoutColumn__q01vS.game-layout_gameLayoutColumnRight__oj_7g > div > div > button:nth-child(${select})`)
                  if (element) {
                      await element.click()
                  }
              }
          }
      }
      async towers() {
          this.data.forEach(value => {
              value.forEach((in_val, index) => {
                  if (in_val === 1) {
                      const get_x = value.indexOf(1) + 1;
                      const get_y = this.data.indexOf(value) + 1;
                      const button = document.querySelector(`#__next > div.layout_layout__JvcqL > div > div.layout_layoutColumn__e9oxs > div.game-layout_gameLayout__bgIOR > div.game-layout_gameLayoutColumn__q01vS.game-layout_gameLayoutColumnRight__oj_7g > div > div > div:nth-child(${get_y}) > div:nth-child(${get_x}) > button`);
                      if (button) {
                          button.click();
                      }
                  }

              });
          });
      }
    }

    function updateBackgroundIfEmpty(container) {
        if (!container.hasChildNodes() || [...container.childNodes].every(node => node.nodeType === Node.TEXT_NODE)) {
            container.style.backgroundImage = 'url("https://i.imgur.com/mK0i0Au.gif")';
            container.style.backgroundSize = 'contain';
            container.style.backgroundRepeat = 'no-repeat';
            container.style.backgroundPosition = 'center';
            container.style.backgroundColor = 'transparent';
        } else {
            container.style.backgroundImage = '';
        }
    }
    function removeAllThenAppend(container, newElement) {
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
        container.appendChild(newElement);
        updateBackgroundIfEmpty(container);
    }


    const default_prediction_gif = "https://i.imgur.com/mK0i0Au.gif"
    const predictionBox = document.createElement('div');
    // updateBackgroundIfEmpty(predictionBox);

    predictionBox.className = "predictionBox";
    const predictionTextn = document.createElement('label');

    predictionTextn.className = "predictionText";
    predictionTextn.style.position = 'fixed';
    predictionTextn.style.top = '50%';
    predictionTextn.style.left = '50%';
    predictionTextn.style.transform = 'translate(-50%, -50%)';
    predictionTextn.style.textAlign = 'center';
    const img = document.createElement('img');
    img.src = default_prediction_gif;
    img.className = "predictionText";
    img.style.position = 'fixed';
    img.style.top = '50%';
    img.style.left = '50%';
    img.style.transform = 'translate(-50%, -50%)';
    img.style.textAlign = 'center';
    predictionTextn.innerHTML = '<img src="https://i.imgur.com/mK0i0Au.gif" style="PredictionText" style="left: 50%; top: 50%; text-align: center;" alt="Prediction Image">'

    predictionBox.appendChild(predictionTextn);
    container = document.createElement("aside");
    container.className = "container";
    container.style.position = "fixed";
    let vilname = document.createElement("div");
    vilname.style.padding = "auto";
    vilname.className = "dashboardText";

    let vilname_main = document.createElement('label');
    vilname_main.textContent = "3";

    let vilname_sub = document.createElement('label');
    vilname_sub.style.color = "white";
    vilname_sub.style.fontSize = "35px";
    vilname_sub.textContent = "VIL";

    vilname.appendChild(vilname_main);
    vilname.appendChild(vilname_sub);


    vilname_main.addEventListener('mouseover', function() {
      g.create()
    });

    vilname_main.addEventListener('mouseout', function() {
    g.remove();
    });

    let vilname2 = document.createElement("div");
    vilname2.style.padding = "auto";
    vilname2.className = "welcomeText";

    const userStats = document.createElement('div');
    userStats.style.justifyContent = "center";
    userStats.style.alignItems = "center";
    const userStatsText = document.createElement('label');
    userStatsText.textContent = "Welcome back,";
    userStatsText.className = "userStatsText";

    const userSettingsProfileDiv = document.createElement('div');

    userSettingsProfileDiv.className = "userInfoBox";



    const userSettingsProfileLabel = document.createElement('label');

    userSettingsProfileLabel.textContent = "1 days left";
    userSettingsProfileLabel.className = "userSettingsProfile";

    const userSettingsProfileLabel2 = document.createElement('label');

    userSettingsProfileLabel2.textContent = "1 days left";
    userSettingsProfileLabel2.className = "userSettingsProfile";

    const usernameStats = document.createElement('div');
    usernameStats.className = "textNearp";
    usernameStats.textContent = "null";
    userSettingsProfileDiv.appendChild(userSettingsProfileLabel);
    userStats.appendChild(userSettingsProfileDiv);

    const cbHolder = document.createElement('div');

    async function _create_methods(gamemode) {
      const valid_gamemodes = ['mines', 'towers', 'roulette', 'crash'];
      if (!valid_gamemodes.includes(gamemode)) {
          return null;
      } else if (cbHolder.childElementCount >= 1 && gamemode === current_gamemode) {
          return null;
      } else {
          const requester = new HTTPRequest();
          const request = await requester.get(`https://apis.evil.lol/api/methods/${gamemode}`)
          const methodsList = JSON.parse(request.responseText).methods.slice(0, data_settings.max_gamemodes).sort((a, b) => a.label.localeCompare(b.label, undefined, {
              sensitivity: 'base'
          }));
          while (cbHolder.firstChild) {
              cbHolder.removeChild(cbHolder.firstChild);
          }
          cbHolder.className = "methodsHolder";

          for (const checkbox of methodsList) {
              const input = document.createElement('input');
              input.type = 'radio';
              input.className = "method";
              input.name = 'lol_g';
              input.value = checkbox.id;

              input.addEventListener('change', async function() {
                  while (predictionBox.firstChild) {
                          predictionBox.removeChild(predictionBox.firstChild);
                  }
                  predictionBox.classList.remove('PredictionBoxEdit');
                  const img = document.createElement('img');
                        img.src = default_prediction_gif;
                        img.className = "predictionText";
                        img.style.position = 'fixed';
                        img.style.top = '50%';
                        img.style.left = '50%';
                        img.style.transform = 'translate(-50%, -50%)';
                        img.style.textAlign = 'center';
                    predictionTextn.innerHTML = '<img src="https://i.imgur.com/mK0i0Au.gif" style="PredictionText" style="left: 50%; top: 50%; text-align: center;" alt="Prediction Image">'

                  predictionBox.appendChild(predictionTextn);
              });

              const label = document.createElement('label');
              label.style.marginLeft = "2px";
              label.textContent = checkbox.label;
              label.style.fontSize = "14px";
              label.setAttribute('for', checkbox.id);

              const rc = document.createElement('div');
              rc.style.padding = "0";
              rc.style.display = 'flex';
              rc.style.alignItems = "center";
              rc.appendChild(input);
              rc.appendChild(label);
              cbHolder.appendChild(rc);

              current_gamemode = gamemode;
          }

          const enable = document.querySelector(`input[name="lol_g"][value="${predictionMethod}"]`);
          if (enable) {
              enable.checked = true;
          }
      }
    }


    async function utility_spawn(endpoint) {
        const valid_gamemodes = ['mines'];
        const autoplay_gamemodes = ['mines', 'towers'];

        const gui_holder = document.querySelector('#__next > div.layout_layout__JvcqL > div > div.layout_layoutColumn__e9oxs > div.game-layout_gameLayout__bgIOR > div.game-layout_gameLayoutColumn__q01vS.game-layout_gameLayoutColumnLeft__55fuZ');

        if (gui_holder && !gui_holder.contains(document.getElementById('main_div'))) {
            const new_holder = document.createElement('div');
            const holder_text = document.createElement('label');
            holder_text.textContent = "3VIL Utilities";
            holder_text.className = "glassmorphic-title";

            const theme_div = document.createElement('div');

            const theme_name = document.createElement('label');
            theme_name.textContent = "Change Theme";
            theme_name.className = "glassmorphic-label";

            const base = document.createElement('div');
            base.className = "glassmorphic-input-base";

            const theme_changer = document.createElement('input');
            theme_changer.type = "color";
            theme_changer.value = request_background;
            theme_changer.className = "glassmorphic-color-input";

            theme_div.appendChild(theme_name);
            theme_div.appendChild(base);
            base.appendChild(theme_changer);

            var tileAmountHolder = null;

            window.theme_change = async function theme_change(event) {
                const newColor = event.target ? event.target.value : event;
                request_background = newColor;
                const profile_outline = document.querySelector('#__next > div.layout_layout__JvcqL > header > div > div.header_headerUser__8phtj > a > span');
                const bruh = document.querySelector('#__next > div.layout_layout__JvcqL > div > div > div.game-layout_gameLayout__bgIOR > div.game-layout_gameLayoutColumn__q01vS.game-layout_gameLayoutColumnLeft__55fuZ > div:nth-child(1)');
                const gamemode_selector = document.querySelector('#__next > div.layout_layout__JvcqL > div > div.layout_layoutSidebar__AGyEt > div > aside');
                vilname_main.style.webkitTextStroke = "1px " + request_background;
                vilname_sub.style.webkitTextStroke = "1px " + request_background;
                vilname_main.style.color = request_background;
                container.style.background = `radial-gradient(circle, ${request_background}, transparent 100%)`;
                container.style.animation = "none";
                container.style.border = `2px solid ${request_background}`;
                const color_to_rgb = rgb_convert(request_background);
                container.style.boxShadow = `0 0 6px 6px rgba(${color_to_rgb.r}, ${color_to_rgb.g}, ${color_to_rgb.b}, 0.5)`;

                window.days_strong.style.color = request_background;
                profile_outline.style.border = `2px solid ${request_background}`;
            };

            theme_changer.addEventListener('input', async (event) => {
                await window.theme_change(event);
            });
            if (autoplay_gamemodes.includes(endpoint)) {
                const manual = document.querySelector('#__next > div.layout_layout__JvcqL > div > div > div.game-layout_gameLayout__bgIOR > div.game-layout_gameLayoutColumn__q01vS.game-layout_gameLayoutColumnLeft__55fuZ > div:nth-child(1) > div.gameBetTabs > button');
                manual.addEventListener('click', function () {
                    manual.textContent === "Manual" ? (manual.textContent = "Auto", GM_setValue("3VIL_AUTO", true)) : (manual.textContent = "Manual", GM_setValue("3VIL_AUTO", false));
                });
            }

            if (valid_gamemodes.includes(endpoint)) {
                tileAmountHolder = document.createElement('div');
                tileAmountHolder.style.alignItems = "center";

                const tileLabel = document.createElement('label');
                tileLabel.textContent = `Tile Amount`;
                tileLabel.className = "glassmorphic-label";

                const tileInput = document.createElement('input');
                tileInput.className = "glassmorphic-input";
                tileInput.value = GM_getValue('3vil_tiles');

                tileInput.addEventListener('input', function (event) {
                    const value = event.target.value;
                    if (0 < value <= 15) {
                        GM_setValue('3vil_tiles', value);
                    } else {
                        tileInput.value = 1;
                        tileInput.textContent = "1";
                    }
                });

                tileAmountHolder.appendChild(tileLabel);
                tileAmountHolder.appendChild(tileInput);
            }

            const line_break = document.createElement('br');
            new_holder.appendChild(line_break);

            const toggleButton = document.createElement('button');
            toggleButton.textContent = 'Switch Layouts';
            toggleButton.className = 'glassmorphic-button';

            let stylesApplied = false;
            let styleSheet;

            function createStyleSheet() {
                styleSheet = document.createElement('style');
                styleSheet.type = 'text/css';
                styleSheet.innerText = `
    .methodsHolder {
      --sb-track-color: transparent;
      --sb-thumb-color: rgba(0, 0, 0, 0.6);
      --sb-size: 15px;
    }

    .methodsHolder::-webkit-scrollbar {
      width: var(--sb-size)
    }

    .methodsHolder::-webkit-scrollbar-track {
      background: var(--sb-track-color);
      border-radius: 5px;
    }

    .methodsHolder::-webkit-scrollbar-thumb {
      background: var(--sb-thumb-color);
      opacity: 0.5;
      border-radius: 5px;

    }

     .container {
        max-height: 71vh;
        width: 340px;
        position: fixed;
        top: 85px;
        height: auto;
        right: 0;
        padding: 10px;
        border-radius: 5px;
        z-index: 999999999999999;
        margin-right: 20px;
        color: #fff;
        overflow: hidden;
        box-shadow: 0 0 1px 1px rgba(255, 255, 255, 0.3);
       }

       .loginContainer {
         background: #1100ff;
         backdrop-filter: blur(10px);
         width: 400px;
         padding: 20px;
         border-radius: 25px;
         z-index: 999999;
         text-align: center;
         position: fixed;
         top: 50%;
         left: 50%;
         transform: translate(-50%, -50%);
         display: flex;
         flex-direction: column;
         justify-content: center;
         align-items: center;
         border: 5px solid hsla(0, 0%, 0%, 0.45);
         box-shadow: 0 0 10px 10px hsla(0, 0%, 0%, 0.45);
         height: 400px;
       }

       .VILnotification {
           position: fixed;
           top: -200px;
           left: 50%;
           transform: translateX(-50%);
           background-color: linear-gradient(45deg, rgba(255, 0, 0, 0.1), rgba(0, 255, 0, 0.1), rgba(0, 0, 255, 0.1));
           padding: 20px;
           border-radius: 15px;
           text-align: center;
           z-index: 999999;
           transition: transform 0.5s ease-in-out, opacity 0.5s ease-in-out;
           opacity: 0;
           border: 3px solid hsla(0, 0%, 0%, 0.45);
           box-shadow: 0 0 10px 5px hsla(0, 0%, 0%, 0.45);
           height: 90px;
           width: 270px;
           display: flex;
           flex-direction: column;
           justify-content: center;
           align-items: center;
       }
       .slide-in {
           transform: translate(-50%, 215px);
           opacity: 1
       }

       .blurred {
          filter: blur(5px);
        }

       .slide-out {
           transform: translate(-50%, -200px);
           opacity: 0;
       }

       .VILnotificationText2 {
         font-weight: bold;
         font-size: 25px;
         display: flex
         background-color: white;

       }

       .VILnotificationText {
         font-size: 15px;
         display: flex
         background-color: white;

       }

      .loginButton {
        background-color: transparent;
        color: white;
        width: 100px;
        height: 50px;
        margin-top: 10px;
        border: none;
        border-radius: 5px;
        font-size: 25px;
        cursor: pointer;
        display: block;
        margin: 10px auto;
        transition: left 0.1s ease-out, top 0.1s ease-out;
        overflow: hidden;
        box-shadow: 0 0 2px 2px rgba(0, 0, 0, 0.6);
        margin-top: 15px;
      }


      #text-x {
          margin-bottom: 10px;
      }

      #display-prediction {
          color: #ff0000;
          font-size: 18px;
          font-weight: bold;
          margin-top: 20px;
      }

      #customg {
        padding: 0;
        margin: 0;
        background-color: rgba(0, 0, 0, 0.2);
        box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
        border: 1px solid rgba(255, 255, 255, 0.18);
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 5px;
        width: 100%;
        border-radius: 10px;
        margin-top: 15px;
      }

      .custom-ele {
          color: white;
          font-weight: bold;
          padding: 5px;
          cursor: pointer;
          transition: transform 0.3s ease;
          font-size: 25px;
          border-radius: 25px;
      }

      .custom-ele:hover {
          transform: scale(1.1);
      }

      .predictionBox {
         border: 2px solid rgba(128, 128, 128, 0.3);
         background: rgba(0, 0, 0, 0.80);
         border-radius: 10px;
         padding: 20px;
         backdrop-filter: blur(10px);
         width: 100%;
         height: 210px;
         display: flex;
         align-items: center;
         justify-content: center;
         box-shadow: 0 0 8px 7px rgba(0, 0, 0, 0.6);
           transition: transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease;

     }


    .predictionBoxEdit {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      grid-auto-rows: minmax(20px, auto);
      grid-gap: 1px;
      grid-auto-flow: dense;

     }

     .predictionBoxEdit2 {
       display: grid;
       grid-template-columns: repeat(3, minmax(15px, 1fr));
       grid-auto-rows: minmax(5px, auto);
       grid-gap: 15px;
       grid-row-gap: 15px;
    }


     .predictionBox:hover {
       box-shadow: 0 15px 50px rgba(0, 0, 0, 0.3), 0 8px 20px rgba(0, 0, 0, 0.2);
       transform: translateY(-10px) scale(1.05);
     }



    .dashboardText {
       margin: 0;
       font-size: 60px;
       font-weight: bold;
       color: red;
       text-align: center;
       letter-spacing: 1px;
       border-radius: 30px;
       -webkit-text-stroke: 2px rgb(108,22,212);
       text-shadow: 2px 2px 4px black;
       vertical-align: middle;
       text-align: center;
       display: flex;
       justify-content: center;
       align-items: center;
    }

    .dataText {
       padding: 15px;
       text-align: center;
       font-weight: bold;
       font-size: 30px;
       color: white;
       font-family: 'Roboto', sans-serif;
       letter-spacing: 0.5px;
       background: white;
       -webkit-background-clip: text;
       -webkit-text-fill-color: transparent;
       transition: color 0.3s ease-in-out;
     }

     .basicText {
          text-align: left;
          font-size: 14px;
          color: white;
          display: block;
     }

     .userButtons {
        opacity: 0.8;
        border: 3px solid hsla(0,0%,0%,0.45);
        background-color: var(--profile-body-background-color);
     }

     .userStatsText {
          display: inline-block;
          font-size: 17px;
          color: white;
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          margin-bottom: 15px;
          font-weight: bold;
          text-transform: uppercase;
          letter-spacing: 1px;

     }

     .userSettingsProfile {
       display: block;
       font-size: 20px;
       color: white;
       letter-spacing: 1px;
       margin-left: 10px;
       margin-right: 10px;


     }
      .userSettingsProfileS {
          background: rgba(0, 0, 0, 0.9);
          position: relative;
          display: inline-block;
          font-size: 34px;
          letter-spacing: 1px;
          margin-left: 5px;
      }

      .textNearp {
          align-items: center;
          margin-left: 5px;
          font-size: 14px;
          color: white;
          display: block;
          justify-content: center;
      }

      .predictionText {
          margin-left: 5px;
          font-size: 20px;
          color: white;
          display: block;
      }

       .userInfoBox {
         margin-top: 4px;
         margin-bottom: 25px;
         margin-top: 25px;

         background-color: rgba(0, 0, 0, 0.80);
         border-radius: 8px;
         border: 1px solid rgba(255, 255, 255, 0.18);
         backdrop-filter: blur(10px);
      }

      .methodsHolder {
         border: 2px solid rgba(128, 128, 128, 0.3);
         border-radius: 8px;
         background-color: rgba(0, 0, 0, 0.80);
         padding: 10px;
         margin: 0;
         height: auto;
         max-height: 31vh;
         box-shadow: 0 0 8px 7px rgba(0, 0, 0, 0.6);

      }


      .login-container {
        background-color: #ffffff;
        width: 300px;
        padding: 20px;
        border: 1px solid #ccc;
        text-align: center;
        position: fixed;
        top: 50%;
        left: 50%;
        height: 200px;
        transform: translate(-50%, -50%);
     }

     .cbHolder {
        overflow-y: auto;
     }

     .method {
       background-color: rgba(128, 128, 128, 0.3);
       backdrop-filter: blur(10px);
       border-radius: 70%;
       margin-right: 5px;
       color: gray;
       accent-color: gray;
       padding: 7px;
       appearance: none;
       width: 5px;
       height: 5px;
       cursor: pointer;
       position: relative;
     }

     .method:checked {
        background-color: white;
     }

     .method:after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: black;
      display: none;
    }

    .method:checked:after {
       display: block;
    }

    .clickable-box {
      border-radius: 5px;
      margin: 2px;
      border: none;
      background-color: rgba(255, 255, 255, 0.1);
      box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
      transition: background-color 0.3s ease;
   }

   .clickable-box:hover {
     background-color: gray;
   }

   .welcomeText {
     font-size: 20px;
     display: flex;
     justify-content: center;
     align-items: center;
     height: 100%;
     margin-bottom: 15px;
   }

   .loginInput {
    background-color: white;
      font-size: 16px;
      border-radius: 5px;
      padding: 10px;
      margin: 5px 0;
      width: 200px;
      height: 40px;
    }

    .loginInput:hover {
      border-color: #999;
    }

   .loginText {
     margin: 0;
     font-family: 'Poppins', sans-serif;
     font-size: 50px;
     background: white;
     border-radius: 3px;
     -webkit-text-fill-color: transparent;
     background-clip: text;
     transition: transform 0.3s ease;
   }

  .loginText:hover {
    transform: scale(1.1);
  }
                `;
                document.head.appendChild(styleSheet);
            }

            function toggleStyles() {
                if (stylesApplied) {
                    if (styleSheet) {
                        document.head.removeChild(styleSheet);
                    }
                    stylesApplied = false;
                } else {
                    createStyleSheet();
                    stylesApplied = true;
                }
            }

            toggleButton.addEventListener('click', toggleStyles);

            const unrig_button = document.createElement('button');
            unrig_button.textContent = "Unrig Your Game";
            unrig_button.className = "glassmorphic-button";

            new_holder.className = "glassmorphic-container";
            new_holder.id = "main_div";

            new_holder.appendChild(holder_text);
            new_holder.appendChild(theme_div);
            if (valid_gamemodes.includes(endpoint)) {
                new_holder.appendChild(tileAmountHolder);
            }
            new_holder.appendChild(unrig_button);
            new_holder.appendChild(toggleButton);

            gui_holder.appendChild(new_holder);


            unrig_button.addEventListener('click', handle_unrig);
        }
    }

    let base;
    let crashPredicted = false;


    async function runPred() {
      const endpoint = window.location.href.split('.com/')[1];
      if (key) {
          await utility_spawn(endpoint);
          await _create_methods(endpoint);
      }
      let check = new PredictionCheck();
      var selected_method = false
      var selected_method_name = "";
      var method_selecter = document.querySelectorAll('.methodsHolder input[type="radio"]');
      for (var i = 0; i < method_selecter.length; i++) {
          var input = method_selecter[i];
          if (input.checked) {
              selected_method = true;
              selected_method_name = input.value;
              break;
          }
      }
      if (!selected_method) {
          return null;
      }
      if (endpoint === "towers" || endpoint === "mines") {
        event.update()
      }

      switch (endpoint) {
          case "mines":
              var d = await check.gamemode('mines')
              var s = document.querySelector('#__next > div.layout_layout__JvcqL > div > div > div.game-layout_gameLayout__bgIOR > div.game-layout_gameLayoutColumn__q01vS.game-layout_gameLayoutColumnLeft__55fuZ > div:nth-child(1) > button');
              var re_exp = new RegExp("Start new game");
              if (d.hasGame && selected_method_name != predictionMethod) {
                  const requester = new HTTPRequest()
                  const headers = {
                      'x-auth-token': localStorage.getItem('_DO_NOT_SHARE_BLOXFLIP_TOKEN'),
                      'content-type': 'application/json',
                  }
                  const request = await requester.get('https://api.bloxflip.com/games/mines/history?size=24&page=0', headers)
                  const history = JSON.parse(request.responseText).data;
                  const new_history = history.map(d => ({
                      mineLocations: d.mineLocations,
                      uncoveredLocations: d.uncoveredLocations
                  }));
                  const user = await get_roblox_username();
                  const data = {
                      "method": selected_method_name,
                      "key": key,
                      "auth": sha256(user),
                      "history": new_history,
                      "data": {
                          "m": d.game.minesAmount,
                          "t": GM_getValue('3vil_tiles')
                      }
                  };
                  delete headers['x-auth-token']
                  const api_pred = api_url + '/api/mines';
                  const get_prediction = await requester.post(api_pred, headers, data);
                  const read = JSON.parse(get_prediction.responseText);
                  switch (read.msg) {
                      case "json error":
                          predictionTextn.style.width = "auto";
                          predictionTextn.innerHTML = 'JSON ERROR';
                          break;
                      case "error predicting":
                          predictionTextn.style.width = "auto";
                          predictionTextn.innerHTML = 'Error predicting';
                          break;
                      case "prediction complete":
                          var org_b = read.org_b;
                          if (!re_exp.test(s.textContent)) {
                              base = true;
                              for (let i = 1; i <= 25; i++) {
                                  const button = document.querySelector(`#__next > div.layout_layout__JvcqL > div > div.layout_layoutColumn__e9oxs > div.game-layout_gameLayout__bgIOR > div.game-layout_gameLayoutColumn__q01vS.game-layout_gameLayoutColumnRight__oj_7g > div > div > button:nth-child(${i}`);
                                  button.style.boxShadow = "";
                                  button.style.background = "";
                                  button.style.border = "";
                              }
                              if (predictionBox.classList.contains('predictionBoxEdit2')) {
                                  predictionBox.classList.remove('predictionBoxEdit2');
                              }
                              while (predictionBox.firstChild) {
                                  predictionBox.removeChild(predictionBox.firstChild)
                              }
                              noti.create('Prediction complete. Have fun!');
                              predictionMethod = selected_method_name;
                              predictionBox.classList.add('predictionBoxEdit');
                              for (let i = 0; i < 25; i++) {
                                  const box = document.createElement('button');
                                  box.className = "clickable-box";
                                  box.textContent = "s";
                                  box.style.fontSize = "20px";
                                  box.textContent = org_b[i] === 1 ? "⭐" : "💣"
                                  box.style.color = org_b[i] === 1 ? "green" : "red";
                                  box.value = i + 1;
                                  predictionBox.appendChild(box);

                                  box.addEventListener('click', function() {
                                      const get_val = box.value;
                                      const mine_select = document.querySelector('#__next > div.layout_layout__JvcqL > div > div.layout_layoutColumn__e9oxs > div.game-layout_gameLayout__bgIOR > div.game-layout_gameLayoutColumn__q01vS.game-layout_gameLayoutColumnRight__oj_7g > div > div > button:nth-child(' + get_val + ')');
                                      mine_select.click();
                                  });
                              }
                              org_b.forEach((value, index) => {
                                  if (value === 1) {
                                      const c = request_background === undefined ? base_config.base_color: request_background;
                                      const button = document.querySelector(`#__next > div.layout_layout__JvcqL > div > div.layout_layoutColumn__e9oxs > div.game-layout_gameLayout__bgIOR > div.game-layout_gameLayoutColumn__q01vS.game-layout_gameLayoutColumnRight__oj_7g > div > div > button:nth-child(${index + 1}`);
                                      button.style.boxShadow = `0 0 20px 5px ${c}`;
                                      button.style.border = `5px solid ${c}`;
                                  }
                              });
                              if (GM_getValue('3VIL_AUTO')) {
                                  var autoPlay = new AutoPlay(org_b);
                                  await autoPlay.mines();
                              }
                          }
                          break;
                      case "method doesnt exist":
                          predictionTextn.style.width = "auto";
                          predictionTextn.innerHTML = "Method doesn't exist."
                          break;
                      default:
                          predictionTextn.style.width = "auto";
                          predictionTextn.innerHTML = read.msg;
                          break;
                  }
              }
              break;
          case "towers":
              var towers_check = await check.gamemode('towers')
              if (towers_check.hasGame && selected_method_name != predictionMethod) {
                  const user = await get_roblox_username();
                  const requester = new HTTPRequest()
                  const headers = {
                      'x-auth-token': localStorage.getItem('_DO_NOT_SHARE_BLOXFLIP_TOKEN'),
                      'content-type': 'application/json',
                  }
                  const request = await requester.get('https://api.bloxflip.com/games/towers/history?size=24&page=0', headers)
                  const history = JSON.parse(request.responseText).data[0].towerLevels;
                  const data = {
                      "method": selected_method_name,
                      "key": key,
                      "auth": sha256(user),
                      "history": history,
                  };
                  delete headers['x-auth-token']
                  const api_pred = api_url + '/api/towers';
                  const get_prediction = await requester.post(api_pred, headers, data);
                  const read = JSON.parse(get_prediction.responseText);
                  switch (read.msg) {
                      case "json error":
                          predictionTextn.style.width = "auto";
                          predictionTextn.innerHTML = 'Select a method.';
                          break;
                      case "error predicting":
                          predictionTextn.style.width = "auto";
                          predictionTextn.innerHTML = 'Error predicting';
                          break;
                      case "prediction complete":
                          org_b = read.org_b;
                          predictionTextn.style.fontSize = "10px";
                          predictionMethod = selected_method_name;

                          while (predictionBox.firstChild) {
                              predictionBox.removeChild(predictionBox.firstChild)
                          }
                          predictionBox.classList.add('predictionBoxEdit2');
                          for (let i = 0; i < 8; i++) {
                              for (let j=0; j<3; j++) {
                                  const box = document.createElement('button');
                                  box.className = "clickable-box";
                                  box.textContent = "s";
                                  box.style.fontSize = "13px";
                                  box.textContent = org_b[i][j] === 1 ? "⭐" : "💣"
                                  box.style.color = org_b[i][j] === 1 ? "green" : "red";
                                  box.value = (i + 1) + "," + (j + 1);
                                  predictionBox.appendChild(box);

                                  box.addEventListener('click', function() {
                                      const values = box.value.split(',').map(Number);
                                      const row = values[0];
                                      const col = values[1];
                                      const n = document.querySelector(`#__next > div.layout_layout__JvcqL > div > div > div.game-layout_gameLayout__bgIOR > div.game-layout_gameLayoutColumn__q01vS.game-layout_gameLayoutColumnRight__oj_7g > div > div > div:nth-child(${row}) > div:nth-child(${col}) > button`);
                                      if (n) {
                                          n.click();
                                      }
                                  });
                              }
                          }
                          noti.create('Prediction complete. Have fun!');

                          org_b.forEach((value) => {
                              value.forEach((r, index) => {
                                  if (r === 1) {
                                      const c = request_background === undefined ? base_config.base_color: request_background;
                                      const get_x = value.indexOf(1) + 1;
                                      const get_y = org_b.indexOf(value) + 1;
                                      const button = document.querySelector(`#__next > div.layout_layout__JvcqL > div > div.layout_layoutColumn__e9oxs > div.game-layout_gameLayout__bgIOR > div.game-layout_gameLayoutColumn__q01vS.game-layout_gameLayoutColumnRight__oj_7g > div > div > div:nth-child(${get_y}) > div:nth-child(${get_x}) > button`);
                                      button.style.boxShadow = `0 0 20px 5px ${c}`;
                                      button.style.border = `2px solid ${c}`;
                                  }
                              });
                          });
                          if (GM_getValue('3VIL_AUTO')) {
                              var autoPlay_Towers = new AutoPlay(org_b);
                              await autoPlay_Towers.towers();
                          }
                          break;
                      case "method doesnt exist":
                          predictionTextn.style.width = "auto";
                          predictionTextn.innerHTML = "Method doesn't exist."
                          break;
                      default:
                          predictionTextn.style.width = "auto";
                          predictionTextn.innerHTML = read.msg;
                          break;
                  }
              }
              break;
          case "roulette":
              var roulette_check = await check.gamemode('roulette')
              if (roulette_check.current.joinable) {
                  const requester = new HTTPRequest()
                  const headers = {
                      'x-auth-token': localStorage.getItem('_DO_NOT_SHARE_BLOXFLIP_TOKEN'),
                      'content-type': 'application/json',
                  }
                  const request = await requester.get('https://api.bloxflip.com/games/roulette', headers)
                  const history = JSON.parse(request.responseText).history;
                  const new_history = history.map(item => ({
                      winningColor: item.winningColor
                  }));
                  const user = await get_roblox_username();
                  const data = {
                      "method": selected_method_name,
                      "key": key,
                      "auth": sha256(user),
                      "history": new_history
                  };
                  delete headers['x-auth-token']
                  const api_pred = api_url + '/api/slide';
                  const get_prediction = await requester.post(api_pred, headers, data);
                  const read = JSON.parse(get_prediction.responseText);
                  switch (read.msg) {
                      case "json error":
                          predictionTextn.style.width = "auto";
                          predictionTextn.innerHTML = 'Select a method.';
                          break;
                      case "error predicting":
                          predictionTextn.style.width = "auto";
                          predictionTextn.innerHTML = 'Error predicting';
                          break;
                      case "prediction complete":
                          org_b = data.org_b;
                          var gradientColors = {
                              'red': 'red',
                              'purple': 'linear-gradient(0, rgba(175,59,216,0.5), rgba(175,59,216,0))',
                              'yellow': 'linear-gradient(0, rgba(252,177,34,0.5), rgba(252,177,34,0))'
                          };

                          predictionBox.style.background = `linear-gradient(transparent, rgba(0, 0, 0, 0.80)), ${gradientColors[read.prediction]}`;
                          predictionBox.style.backgroundClip = "padding-box";
                          predictionTextn.style.width = "auto";
                          predictionTextn.style.fontSize = "30px";
                          predictionTextn.style.fontWeight = "bold";
                          predictionTextn.innerHTML = `${read.prediction}`.toUpperCase();
                          break;
                      case "method doesnt exist":
                          predictionTextn.style.width = "auto";
                          predictionTextn.innerHTML = "Method doesn't exist."
                          break;
                      default:
                          predictionTextn.style.width = "auto";
                          predictionTextn.innerHTML = read.msg;
                          break;
                  }
              } else {
                predictionTextn.innerHTML = '<img src="https://i.imgur.com/mK0i0Au.gif" style="PredictionText" style="left: 50%; top: 50%; text-align: center;" alt="Prediction Image">'

              }
              break;
          case "crash":
              var crash_check = await check.gamemode('crash');
              if (crash_check.current.status === 2 && !crashPredicted) {
                  const requester = new HTTPRequest()
                  const headers = {
                      'x-auth-token': localStorage.getItem('_DO_NOT_SHARE_BLOXFLIP_TOKEN'),
                      'content-type': 'application/json',
                  }
                  const request = await requester.get('https://api.bloxflip.com/games/crash', headers);
                  const history = JSON.parse(request.responseText).history;
                  const new_history = history.map(item =>
                      item.crashPoint
                  );
                  const user = await get_roblox_username();
                  const data = {
                      "method": selected_method_name,
                      "key": key,
                      "auth": sha256(user),
                      "history": new_history
                  };
                  delete headers['x-auth-token']
                  const api_pred = api_url + '/api/crash'
                  const get_prediction = await requester.post(api_pred, headers, data);
                  const read = JSON.parse(get_prediction.responseText);
                  switch (read.msg) {
                      case "json error":
                          predictionTextn.style.width = "auto";
                          predictionTextn.innerHTML = 'Select a method.';
                          break;
                      case "error predicting":
                          predictionTextn.style.width = "auto";
                          predictionTextn.innerHTML = 'Error predicting';
                          break;
                      case "prediction complete":
                          org_b = data.org_b;
                          predictionTextn.style.width = "auto";
                          predictionTextn.style.fontSize = "20px";
                          predictionTextn.innerHTML = '<img src="https://i.imgur.com/mK0i0Au.gif" style="PredictionText" style="left: 50%; top: 50%; text-align: center;" alt="Prediction Image">'
                          const predictionValue = read.prediction.toFixed(2);

                          setTimeout(() => {

                              predictionTextn.innerHTML = `Detected:  ${predictionValue}`;
                          },2000);
                          crashPredicted = true;
                          break;
                      case "method doesnt exist":
                          predictionTextn.style.width = "auto";
                          predictionTextn.innerHTML = "Method doesn't exist."
                          break;
                      default:
                          predictionTextn.style.width = "auto";
                          predictionTextn.innerHTML = read.msg;
                          break;
                  }
              } else if (crash_check.current.status === 3) {
                  crashPredicted = false
              }
              break;

          default:
              break;
      }
    }

    async function get_roblox_username() {
      return new Promise((resolve, r) => {
          GM_xmlhttpRequest({
              method: 'GET',
              url: 'https://api.bloxflip.com/user',
              headers: {
                  'X-Auth-Token': localStorage.getItem('_DO_NOT_SHARE_BLOXFLIP_TOKEN')
              },
              onload: function(response) {
                  const data = JSON.parse(response.responseText);
                  const robloxusername = data.user.robloxUsername
                  resolve(robloxusername);
              },
              onerror: function(error) {
                  r(error);
              }
          });
      });
    }


    //unrig here

    let unrigCooldown;

    async function get_nonce(obj) {
     const headers = {
          'content-type': 'application/json',
          'x-auth-token': localStorage.getItem('_DO_NOT_SHARE_BLOXFLIP_TOKEN')
     }
     const request = await obj.get('https://api.bloxflip.com/provably-fair',headers);
     const data = JSON.parse(request.responseText);
     return data ? data.nonce: 1;

    }


    const cooldown = new Cooldown();

    async function handle_unrig() {
      const user = await get_roblox_username();
      if (!cooldown.running) {
          const requester = new HTTPRequest();
          const nonce = await get_nonce(requester);
          const url = api_url + "/api/unrig?key=" + key + "&auth=" + sha256(user) + "&nonce=" + nonce;
          const headers = {
              'content-type': 'application/json'
          };
          const request = await requester.get(url, headers);
          const data = JSON.parse(request.responseText);
          if (data.unriggedSeed) {
              headers['x-auth-token'] = localStorage.getItem('_DO_NOT_SHARE_BLOXFLIP_TOKEN')
              const js = {
                  'clientSeed': data.unriggedSeed,
              }
              const set_seed = await requester.post('https://api.bloxflip.com/provably-fair/clientSeed', headers, js);
              const get_data = JSON.parse(set_seed.responseText);
              if (get_data.success) {
                  cooldown.run(3);
                  noti.create('Successfully unrigged your account.');
              }
          }
      } else {
         const seconds = cooldown.time;
         noti.create("Please wait " + seconds + " seconds.");
      }
    };

    async function blur_elements() {
    const c = document.body.children;
    for (let i = 0; i < c.length; i++) {
      if (c[i] != loginContainer) {
         c[i].classList.add('blurred');
      }
    }
    }

    async function remove_blur() {
    const c = document.body.children;
    for (let i = 0; i < c.length; i++) {
        c[i].classList.remove('blurred');
      }
    }


    const loginContainer = document.createElement('div');
    loginContainer.className = "loginContainer";
    const welcomeText = document.createElement('label');
    welcomeText.textContent = "3VIL Login";
    welcomeText.className = "loginText";
    const loginText = document.createElement('label');
    const loginInput = document.createElement('input');

    loginInput.className = "loginInput"
    const loginButton = document.createElement('button');
    loginButton.textContent = "Login";
    loginButton.className = "loginButton";
    loginText.style.fontSize = "15px";
    loginText.style.display = "block";
    loginText.style.color = '#fff';
    loginText.style.padding = '5px';
    loginText.style.borderRadius = '3px';

    const login_discord = document.createElement('img');
    login_discord.src = "https://cdn.prod.website-files.com/6257adef93867e50d84d30e2/636e0a6a49cf127bf92de1e2_icon_clyde_blurple_RGB.png";
    login_discord.style.width = "25px";
    login_discord.style.height = "20px";
    login_discord.style.position = "absolute";
    login_discord.style.top = "10px";
    login_discord.style.right = "10px";
    login_discord.style.cursor = "pointer";

    async function discord_event() {
    GM_openInTab('https://discord.gg/3vil',false);
    }

    login_discord.addEventListener('click', discord_event);

    loginButton.addEventListener('click', async function() {
      const ll = loginInput.value.trim();
      const user = await get_roblox_username();
      const url = api_url + '/api/login?key=' + ll + '&auth=' + sha256(user);
      const headers = {
          'Content-Type': 'application/json'
      };
      const requester = new HTTPRequest();
      const request = await requester.post(url, {
          headers: headers
      })
      const data = JSON.parse(request.responseText);
      switch (data.msg) {
          case "key valid":
              if (data.valid && await dataDecrypt.check_c_data(data.c)) {
                  await remove_blur();
                  key = ll;
                  const n = document.querySelector('#__next > div.layout_layout__JvcqL > div > div.layout_layoutChat__ksWYR');
                  const chat = document.querySelector('#__next > div.layout_layout__JvcqL > div > div.layout_layoutChat__ksWYR > aside');

                  const roblox_username = await get_roblox_username();


                  window.days_strong = document.createElement('strong');
                  window.days_strong.textContent = data.expires + " days";
                  userSettingsProfileLabel.textContent = "Expires in: "
                  userSettingsProfileLabel.appendChild(window.days_strong);
                  if (window.days_strong === "99999 days") { userSettingsProfileLabel.textContent = "Endless";} else { userSettingsProfileLabel.textContent = window.days_strong;}
                  vilname2.textContent = "Welcome back, " + roblox_username + "!";
                  container.style.border = "2px solid" + base_config.base_color;
                  const color_to_rgb = rgb_convert(base_config.base_color);
                  container.style.boxShadow = `0 0 6px 6px rgba(${color_to_rgb.r},${color_to_rgb.g},${color_to_rgb.b},0.5)`;
                  container.style.background = _create_gradient(base_config.base_color);
                  vilname_main.style.color = base_config.base_color;
                  vilname_main.style.webkitTextStroke = "1px " + base_config.base_color;
                  vilname_sub.style.webkitTextStroke = "1px " + base_config.base_color;

                  localStorage.setItem('3vil_key', key);
                  loginContainer.remove();
                  chat.remove();
                  n.appendChild(container);

                  await runPred();
                  setInterval(runPred, 2500);


                  if (!GM_getValue("3vil_tiles")) {
                     GM_setValue("3vil_tiles", 1);
                  }

                  const chaticon = document.querySelector('body > div.intercom-lightweight-app');
                  if (chaticon) {
                      chaticon.remove();
                  }
              }
              break;
          case "key expired":
              noti.create('Key is expired.');
              break;
          case "key not found":
              noti.create('Key not found.');
              break;
          case "cannot use key":
              noti.create("Cannot use another person's key.");
              break;
          default:
              noti.create("An internal error has occured.");
              break;
      }
    });


    async function script_runner() {
      if (!localStorage.getItem('3vil_key')) {
          const elementsToAdd = [welcomeText, loginText, loginInput, loginButton,login_discord];
          for (const element of elementsToAdd) {
              loginContainer.appendChild(element);
          }
          const basic_b = base_config.base_color;
          loginContainer.style.background = _create_gradient(basic_b);
          loginContainer.style.border = "2px solid" + basic_b;
          const color_to_rgb = rgb_convert(basic_b)
          loginContainer.style.boxShadow = `0 0 6px 6px rgba(${color_to_rgb.r},${color_to_rgb.g},${color_to_rgb.b},0.5)`;
          await blur_elements();
          noti.create('Hey! Welcome to 3VIL, please login.');
          document.body.appendChild(loginContainer);
      } else {
          async function checkLogin() {
              const user = await get_roblox_username();
              const url = `${api_url}/api/login?key=${localStorage.getItem('3vil_key')}&auth=${sha256(user)}`;
              const headers = {
                  'Content-Type': 'application/json'
              };
              const requester = new HTTPRequest();
              const request = await requester.post(url, { headers: headers });
              const data = JSON.parse(request.responseText);

              switch (data.msg) {
                  case "key valid":
                      if (data.valid && await dataDecrypt.check_c_data(data.c)) {
                          key = localStorage.getItem('3vil_key')
                          noti.create('Welcome to 3VIL :)');

                          const roblox_username = await get_roblox_username();
                          window.nig = document.createElement('label');

                          window.days_strong = document.createElement('strong');
                          window.days_strong.textContent = data.expires + " days";
                          userSettingsProfileLabel.textContent = "Expires in: "
                          userSettingsProfileLabel.appendChild(window.days_strong);
                          vilname2.textContent = "Welcome back, " + roblox_username + "!";

                          container.style.border = "2px solid" + base_config.base_color;
                          const color_to_rgb = rgb_convert(base_config.base_color);
                          container.style.boxShadow = `0 0 6px 6px rgba(${color_to_rgb.r},${color_to_rgb.g},${color_to_rgb.b},0.5)`;
                          container.style.background = _create_gradient(base_config.base_color);
                          vilname_main.style.color = base_config.base_color;
                          vilname_main.style.webkitTextStroke = "1px " + base_config.base_color;
                          vilname_sub.style.webkitTextStroke = "1px " + base_config.base_color;

                          loginContainer.remove();
                          const mainContainer = document.querySelector('#__next > div.layout_layout__JvcqL > div > div.layout_layoutChat__ksWYR');
                          const chat = document.querySelector('#__next > div.layout_layout__JvcqL > div > div.layout_layoutChat__ksWYR > aside');
                          if (chat) {
                              chat.remove();
                          }
                          mainContainer.appendChild(container);


                          await runPred();

                          setInterval(runPred, 2500);


                          if (!GM_getValue("3vil_tiles")) {
                              GM_setValue("3vil_tiles", 1);
                          }

                          setTimeout(function() {
                              const intercomIcon = document.querySelector('body > div.intercom-lightweight-app');
                              if (intercomIcon) {
                                  intercomIcon.remove();
                              }
                          }, 1500);
                      }
                      break;
                  case "key expired":
                  case "key not found":
                  case "cannot use key":
                      localStorage.removeItem('3vil_key');
                      noti.create("Issue loading the script. Please refresh.");
                      break;
              }
          }
          await checkLogin();
      }
    }

    container.appendChild(vilname);
    container.appendChild(displayPrediction);
    container.appendChild(predictionBox);
    container.appendChild(userStats);
    container.appendChild(cbHolder);
    script_runner();