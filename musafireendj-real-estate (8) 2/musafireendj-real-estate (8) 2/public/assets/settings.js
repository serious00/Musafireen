(() => {
  // ---- Storage helpers ----
  const storage = {
    get(k, d){ try { const v = localStorage.getItem(k); return v ?? d; } catch { return d; } },
    set(k, v){ try { localStorage.setItem(k, v); } catch {} }
  };

  // ---- Language phrase map (expand as needed) ----
  const phraseMap = {
    ar_to_en: {
      "مسافرين": "Musafireen",
      "تسجيل الدخول": "Sign in",
      "تسجيل": "Register",
      "إنشاء حساب": "Create account",
      "الرئيسية": "Home",
      "من نحن": "About",
      "اتصل بنا": "Contact",
      "تواصل معنا": "Contact us",
      "معلومات التواصل": "Contact info",
      "استفسار سريع": "Quick inquiry",
      "بحث": "Search",
      "العقارات": "Properties",
      "عقارات": "Properties",
      "فلتر": "Filter",
      "السعر": "Price",
      "الموقع": "Location",
      "المزيد": "More",
      "تفاصيل": "Details",
      "احجز الآن": "Book now",
      "أرسل": "Send",
      "إرسال": "Send",
      "تحميل": "Download",
      "اكتشف وجهتك المثالية في جيبوتي": "Discover your perfect destination in Djibouti",
      "شقق مفروشة فاخرة في قلب جيبوتي، مع إطلالات خلابة وخدمات منزلية متكاملة": "Luxury furnished apartments in the heart of Djibouti, with stunning views and full home services",
      "تابعنا": "Follow us",
      "حقوق النشر": "Copyright",
      "كل الحقوق محفوظة": "All rights reserved"
    },
    en_to_ar: {
      "Musafireen": "مسافرين",
      "Sign in": "تسجيل الدخول",
      "Register": "تسجيل",
      "Create account": "إنشاء حساب",
      "Home": "الرئيسية",
      "About": "من نحن",
      "Contact": "اتصل بنا",
      "Contact us": "تواصل معنا",
      "Contact info": "معلومات التواصل",
      "Quick inquiry": "استفسار سريع",
      "Search": "بحث",
      "Properties": "العقارات",
      "Filter": "فلتر",
      "Price": "السعر",
      "Location": "الموقع",
      "More": "المزيد",
      "Details": "تفاصيل",
      "Book now": "احجز الآن",
      "Send": "إرسال",
      "Download": "تحميل",
      "Discover your perfect destination in Djibouti": "اكتشف وجهتك المثالية في جيبوتي",
      "Luxury furnished apartments in the heart of Djibouti, with stunning views and full home services": "شقق مفروشة فاخرة في قلب جيبوتي، مع إطلالات خلابة وخدمات منزلية متكاملة",
      "Follow us": "تابعنا",
      "Copyright": "حقوق النشر",
      "All rights reserved": "كل الحقوق محفوظة"
    }
  };

  function normalize(s){ return s.replace(/\s+/g, ' ').trim(); }
  function walkText(fn){
    const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode(n){
        if (!n.nodeValue) return NodeFilter.FILTER_REJECT;
        const t = n.nodeValue.trim();
        if (!t) return NodeFilter.FILTER_REJECT;
        const p = n.parentElement && n.parentElement.closest('script,style,noscript,code,pre');
        if (p) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    const nodes=[]; while(w.nextNode()) nodes.push(w.currentNode);
    nodes.forEach(fn);
  }
  function autoTranslate(toLang){
    const map = toLang === 'ar' ? phraseMap.en_to_ar : phraseMap.ar_to_en;
    const keys = Object.keys(map);
    if (!keys.length) return;
    // exact text nodes
    walkText(node => {
      const current = normalize(node.nodeValue);
      if (map[current]) node.nodeValue = node.nodeValue.replace(current, map[current]);
    });
    // simple elements
    document.querySelectorAll('a,button,h1,h2,h3,h4,h5,h6,span,li,p,small,strong,em,div,label,th,td,option').forEach(el => {
      if (el.children.length) return;
      const current = normalize(el.textContent);
      if (map[current]) el.textContent = map[current];
      // placeholders
      if (el.matches('input,textarea') && el.getAttribute('placeholder')) {
        const ph = normalize(el.getAttribute('placeholder'));
        if (map[ph]) el.setAttribute('placeholder', map[ph]);
      }
    });
  }

  // ---- Theme handling ----
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  function applyTheme(theme){
    const html = document.documentElement;
    const effective = theme === 'system' ? (prefersDark ? 'dark' : 'light') : theme;
    html.setAttribute('data-theme', effective);
    storage.set('reem:theme', theme);
  }

  // ---- Language handling ----
  const dict = {
    en: {
      "settings.title": "Site Settings",
      "settings.theme": "Theme",
      "settings.theme.light": "Light",
      "settings.theme.dark": "Dark",
      "settings.theme.system": "System",
      "settings.language": "Language",
      "settings.language.en": "English",
      "settings.language.ar": "Arabic",
      "settings.note": "Tip: add data-i18n=\"key\" on elements and extend translations in assets/settings.js."
    },
    ar: {
      "settings.title": "إعدادات الموقع",
      "settings.theme": "السِمة",
      "settings.theme.light": "فاتح",
      "settings.theme.dark": "داكن",
      "settings.theme.system": "حسب النظام",
      "settings.language": "اللغة",
      "settings.language.en": "الإنجليزية",
      "settings.language.ar": "العربية",
      "settings.note": "معلومة: أضِف data-i18n=\"key\" للعناصر وأكمل القاموس في assets/settings.js."
    }
  };
  function t(key){
    const lang = storage.get('reem:lang', 'en');
    return (dict[lang] && dict[lang][key]) || (dict.en && dict.en[key]) || key;
  }
  function applyLang(lang){
    const html = document.documentElement;
    html.lang = lang;
    html.dir = (lang === 'ar') ? 'rtl' : 'ltr';
    storage.set('reem:lang', lang);
    // translate settings UI labels
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const translated = t(key);
      if (translated) el.textContent = translated;
    });
    // auto translate page
    autoTranslate(lang);
  }

  // ---- Shadow DOM Settings Component ----
  class ReemSettings extends HTMLElement {
    constructor(){
      super();
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.innerHTML = `
        <style>
          :host { all: initial; }
          /* Host is fixed to viewport edges; super high z-index */
          .host {
            position: fixed;
            inset: 0;
            pointer-events: none;
            z-index: 2147483647; /* on top of everything */
          }
          .fab {
            position: fixed;
            right: 20px; bottom: 20px;
            width: 56px; height: 56px; border-radius: 999px;
            display: grid; place-items: center;
            background: #2563eb; color: #fff;
            box-shadow: 0 10px 25px rgba(0,0,0,.2);
            cursor: pointer; border: none;
            pointer-events: auto;
            font-size: 20px;
          }
          .backdrop {
            position: fixed; inset: 0;
            background: rgba(0,0,0,.45);
            backdrop-filter: blur(4px);
            opacity: 0; visibility: hidden;
            transition: opacity .2s ease, visibility .2s ease;
            pointer-events: auto;
          }
          .panel {
            position: fixed;
            left: 50%; top: 50%;
            transform: translate(-50%,-50%) scale(.98);
            width: min(92vw, 520px);
            background: #0b1220;
            color: #e5e7eb;
            border: 1px solid rgba(255,255,255,.08);
            border-radius: 16px;
            box-shadow: 0 25px 80px rgba(0,0,0,.35);
            padding: 20px 20px 8px;
            opacity: 0; visibility: hidden;
            transition: opacity .2s ease, transform .2s ease, visibility .2s ease;
            pointer-events: auto;
            font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial;
          }
          :host(.open) .panel { opacity: 1; visibility: visible; transform: translate(-50%,-50%) scale(1); }
          :host(.open) .backdrop { opacity: 1; visibility: visible; }
          h3 { margin: 0 0 10px; font-size: 18px; }
          .row { display: grid; grid-template-columns: 1fr; gap: 10px; padding: 12px 0; border-top: 1px dashed rgba(255,255,255,.12); }
          .row:first-of-type { border-top: none; }
          .options { display: flex; gap: 14px; flex-wrap: wrap; }
          label { display: flex; gap: 6px; align-items: center; font-size: 14px; }
          .note { font-size: 12px; opacity: .75; }
          .close {
            position: absolute; right: 10px; top: 8px;
            background: transparent; border: none; color: #93a3b8; font-size: 22px; cursor: pointer;
          }
          /* Uninvert our component if page is inverted in dark mode */
          :host { filter: invert(1) hue-rotate(180deg); }
          :host-context(html:not([data-theme="dark"])) { filter: none; }
        </style>
        <div class="host">
          <button class="fab" title="Settings">⚙️</button>
          <div class="backdrop" part="backdrop"></div>
          <section class="panel" part="panel">
            <button class="close" aria-label="Close">×</button>
            <h3 data-i18n="settings.title">${t('settings.title')}</h3>

            <div class="row">
              <div>
                <div data-i18n="settings.theme">${t('settings.theme')}</div>
                <div class="note" data-i18n="settings.note">${t('settings.note')}</div>
              </div>
              <div class="options">
                <label><input type="radio" name="reem-theme" value="light"> <span data-i18n="settings.theme.light">${t('settings.theme.light')}</span></label>
                <label><input type="radio" name="reem-theme" value="dark"> <span data-i18n="settings.theme.dark">${t('settings.theme.dark')}</span></label>
                <label><input type="radio" name="reem-theme" value="system"> <span data-i18n="settings.theme.system">${t('settings.theme.system')}</span></label>
              </div>
            </div>

            <div class="row">
              <div><div data-i18n="settings.language">${t('settings.language')}</div></div>
              <div class="options">
                <label><input type="radio" name="reem-lang" value="en"> <span data-i18n="settings.language.en">${t('settings.language.en')}</span></label>
                <label><input type="radio" name="reem-lang" value="ar"> <span data-i18n="settings.language.ar">${t('settings.language.ar')}</span></label>
              </div>
            </div>
          </section>
        </div>
      `;
    }
    connectedCallback(){
      const root = this.shadowRoot;
      const host = this;

      const fab = root.querySelector('.fab');
      const backdrop = root.querySelector('.backdrop');
      const panel = root.querySelector('.panel');
      const closeBtn = root.querySelector('.close');

      function open(){ host.classList.add('open'); }
      function close(){ host.classList.remove('open'); }

      fab.addEventListener('click', open);
      backdrop.addEventListener('click', close);
      closeBtn.addEventListener('click', close);

      // Init choices
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      const themeChoice = storage.get('reem:theme', 'system');
      const themeInput = root.querySelector(`input[name="reem-theme"][value="${themeChoice}"]`) || root.querySelector(`input[name="reem-theme"][value="${prefersDark?'dark':'light'}"]`);
      if (themeInput) themeInput.checked = true;

      root.querySelectorAll('input[name="reem-theme"]').forEach(r => {
        r.addEventListener('change', e => applyTheme(e.target.value));
      });

      const browserLang = (navigator.language || 'en').slice(0,2);
      const langChoice = storage.get('reem:lang', document.documentElement.lang || (browserLang === 'ar' ? 'ar' : 'en'));
      const langInput = root.querySelector(`input[name="reem-lang"][value="${langChoice}"]`) || root.querySelector(`input[name="reem-lang"][value="en"]`);
      if (langInput) langInput.checked = true;

      root.querySelectorAll('input[name="reem-lang"]').forEach(r => {
        r.addEventListener('change', e => {
          applyLang(e.target.value);
          // refresh labels
          root.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            el.textContent = t(key);
          });
        });
      });
    }
  }
  customElements.define('reem-settings', ReemSettings);

  // Insert our host element (outside any app wrappers)
  const hostTag = document.createElement('reem-settings');
  // For uninvert targeting from global CSS
  hostTag.tagName; // no-op
  document.body.appendChild(hostTag);

  // Create an alias tag so CSS can target it for uninvert
  const alias = document.createElement('reem-settings-host');
  alias.style.display = 'none';
  document.body.appendChild(alias);

  // Apply initial theme/lang
  const initialTheme = storage.get('reem:theme', 'system');
  applyTheme(initialTheme);
  const browserLang = (navigator.language || 'en').slice(0,2);
  const initialLang = storage.get('reem:lang', document.documentElement.lang || (browserLang === 'ar' ? 'ar' : 'en'));
  applyLang(initialLang);

  // React to system theme if "system"
  if (window.matchMedia) {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    mq.addEventListener('change', () => {
      if (storage.get('reem:theme', 'system') === 'system') applyTheme('system');
    });
  }

  // Expose API
  window.ReemUI = { setTheme: applyTheme, setLang: applyLang, phraseMap };
})();