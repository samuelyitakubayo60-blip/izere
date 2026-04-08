/* =====================================================
   IBANGA HealthBot Rwanda — Chatbot Engine
   Rule-based with Kinyarwanda + English support
   ===================================================== */

const IBANGA_BOT = (() => {

  /* ── Language & Mode ── */
  let simpleMode = false;
  let conversationContext = null; // last detected intent
  let messageHistory = [];

  /* ── Knowledge Base ── */
  const KB = {

    greetings: {
      patterns: ['hello','hi','hey','good morning','good evening','welcome','greetings','muraho','mwaramutse','mwiriwe'],
      response: `🌿 <strong>Hello! I'm IBANGA HealthBot.</strong><br>
Welcome! I'm here to help you access accurate sexual and reproductive health information.<br><br>
Ask me about:<br>
• 💊 <strong>Contraception</strong><br>
• 🤰 <strong>Pregnancy</strong><br>
• 🩸 <strong>Menstrual Health</strong><br>
• 🦠 <strong>STIs / STDs</strong><br>
• 🛡️ <strong>HIV Prevention (PrEP/PEP)</strong><br><br>
Ask any question — this is a safe, confidential space.`,
      simple: `👋 Hello! I am IBANGA HealthBot.<br>I can help with health questions. Ask me anything!`
    },

    hiv_prevention: {
      patterns: ['vih','sida','aids','hiv','kwirinda vih','kwirinda sida','kwibwira','hiv test','vih test','kwipimisha vih','kwipimisha sida','testing','test','ubupimo'],
      response: `🛡️ <strong>HIV Prevention</strong><br><br>
<strong>Ways to protect yourself:</strong><br>
• Use condoms correctly every time<br>
• Take PrEP if you're at high risk<br>
• Take PEP within 72 hours of unprotected exposure<br>
• Get regular HIV testing — free at health facilities<br>
• Stay faithful to one uninfected partner<br><br>
📍 <strong>Testing:</strong> Visit your nearest health center for free HIV testing.<br><br>
Would you like to know more about <strong>PrEP</strong> or <strong>PEP</strong>?`,
      simple: `🛡️ Protect against HIV:<br>• Use a condom<br>• Take PrEP medicine<br>• Take PEP within 72 hours<br>• Get tested`
    },

    prep_pep: {
      patterns: ['prep','pep','prophylaxie','imiti yo kwirinda','imiti y','p-r-e-p','p-e-p','gufata prep','gufata pep','kuru prep','kuru pep'],
      response: `💊 <strong>PrEP & PEP — HIV Prevention Medicines</strong><br><br>
<strong>PrEP (Pre-Exposure Prophylaxis):</strong><br>
• Taken daily BEFORE potential HIV exposure<br>
• Reduces HIV risk by up to 99% when taken correctly<br>
• Requires an HIV test before starting<br>
• Available free at health centers<br><br>
<strong>PEP (Post-Exposure Prophylaxis):</strong><br>
• Must be taken within 72 hours AFTER potential exposure<br>
• Taken for 28 days<br>
• Emergency medicine — act fast!<br><br>
⚠️ <strong>Important:</strong> Go to a health center as soon as possible!`,
      simple: `💊 PrEP = medicine taken BEFORE risk. PEP = medicine taken AFTER risk (within 72 hours). Go to a clinic fast!`
    },

    condom: {
      patterns: ['condom','agakingirizo','akingirizo','kaboni','condoms','agakingirizo gasaza','agakingirizo k','female condom','male condom','gakingirizo','koresha condom'],
      response_rw: `🔵 <strong>Agakingirizo (Condom)</strong><br><br>
<strong>Inyungu:</strong><br>
• Kirinda indwara zandurira mu mibonano (STI), harimo na VIH<br>
• Kirinda inda<br>
• Nta mishonga — byoroshye no kubona<br>
• Koreshwa igihe cyangwa igihe urashaka<br><br>
<strong>Ukoresha ute neza:</strong><br>
• Reba itariki yo kurangira<br>
• Fungura ngo wirinde kugwa<br>
• Shyira neza imitwe y'umugabo mbere y'imibonano<br>
• Nyuma y'imibonano, genda neza<br><br>
✅ Agakingirizo niyo nzira yonyine ikingira kandi indwara no gutwita!`,
      response_en: `🔵 <strong>Condoms</strong><br><br>
<strong>Advantages:</strong><br>
• Protects against STIs including HIV<br>
• Prevents pregnancy<br>
• No hormones — easy to get<br>
• Only use when needed<br><br>
<strong>How to use correctly:</strong><br>
• Check the expiry date<br>
• Open carefully — don't tear it<br>
• Place on erect penis before sex<br>
• Remove carefully after sex<br><br>
✅ Condoms are the ONLY method that protects against BOTH pregnancy AND STIs!`,
      simple_rw: `🔵 Agakingirizo:<br>• Kirinda STI na VIH<br>• Kirinda inda<br>• Reba itariki<br>• Koresha buri gihe`,
      simple_en: `🔵 Condom:<br>• Stops STIs and HIV<br>• Stops pregnancy<br>• Check expiry date<br>• Use every time`
    },

    contraception: {
      patterns: ['kuboneza','urubyaro','kuboneza urubyaro','family planning','contraception','inda','kugonda inda','guhagarika inda','gukuraho inda','imiti yo','pills','pilule','injection','piqûre','injectables','implant','iud','sterilet','akabanga','inda','gutwita'],
      response_rw: `💊 <strong>Uburyo bwo Kuboneza Urubyaro</strong><br><br>
Hari uburyo butandukanye. Ni ubuhe bushaka kumenya?<br><br>
• 🔵 <strong>Agakingirizo (Condom)</strong><br>
• 💊 <strong>Imiti (Pills)</strong><br>
• 💉 <strong>Injection (iminsi 90)</strong><br>
• 🔩 <strong>Implant (imyaka 3–5)</strong><br>
• 🔘 <strong>IUD/Sterilet (imyaka 5–10)</strong><br>
• 🚨 <strong>Emergency contraception (morning-after pill)</strong><br>
• 🌿 <strong>Uburyo bw'imvaho (calendar)</strong><br><br>
Baza uburyo bumwe na bumwe — nzakubwira inyungu n'ingaruka z'ubwo buryo.`,
      response_en: `💊 <strong>Contraceptive Methods</strong><br><br>
There are several options. Which would you like to know more about?<br><br>
• 🔵 <strong>Condoms</strong><br>
• 💊 <strong>Birth Control Pills</strong><br>
• 💉 <strong>Injectable (3-month shot)</strong><br>
• 🔩 <strong>Implant (3–5 years)</strong><br>
• 🔘 <strong>IUD / Coil (5–10 years)</strong><br>
• 🚨 <strong>Emergency contraception</strong><br>
• 🌿 <strong>Natural methods (calendar tracking)</strong><br><br>
Ask about any method and I'll explain the advantages and side effects.`,
      simple_rw: `💊 Uburyo bwo kwirinda inda:<br>• Condom • Pills • Injection • Implant • IUD<br>Baza uburyo umwe uzakubereza byinshi.`,
      simple_en: `💊 Methods to prevent pregnancy:<br>• Condom • Pills • Injection • Implant • IUD<br>Ask about any one for more details.`
    },

    emergency_contraception: {
      patterns: ['emergency','morning after','morning-after','imiti yo kumara inda','kuzuza','emergency contraception','plan b','ella','guhagarika inda vuba'],
      response_rw: `🚨 <strong>Kwirinda Inda Vuba (Emergency Contraception)</strong><br><br>
• Ifatwa mu gihe cy'amasaha 72 nyuma y'imibonano itakingiye<br>
• Ayihuta ni agace — hazaza gake ibyango ikora<br>
• Ntabwo ari imiti yo gusabwa rya ngombwa — ni ya ngombwa mu gihe cy'ibyago<br>
• Igurwa mu bitaro cyangwa farumasi munsi y'amasaha 72<br><br>
⚠️ Morning-after pill <strong>ntifata inda</strong> isanzwe — ni yo gukingira gusa nyuma y'ibyago.<br><br>
💡 Ngaho kuri farumasi uyange — umwanya uhabwa ni muto!`,
      response_en: `🚨 <strong>Emergency Contraception (Morning-After Pill)</strong><br><br>
• Must be taken within 72 hours of unprotected sex<br>
• The sooner you take it, the more effective it is<br>
• NOT for regular use — only for emergencies<br>
• Available at pharmacies and health centers<br><br>
⚠️ Emergency contraception does NOT end a pregnancy — it only prevents one.<br><br>
💡 Go to a pharmacy or clinic as soon as possible!`,
      simple_rw: `🚨 Imiti ya vuba nyuma y'imibonano: Fata mu masaa 72. Gana farumasi vuba!`,
      simple_en: `🚨 Morning-after pill: Take within 72 hours. Go to pharmacy fast!`
    },

    pregnancy_signs: {
      patterns: ['natwite','gutwita','inda','gusama','got pregnant','pregnancy','pregnant','missed period','natinze','imihango','ubutwite','bimenyetso byo gutwita','nshobora kuba natwite','ese natwite'],
      response_rw: `🤰 <strong>Bimenyetso byo Gutwita</strong><br><br>
<strong>Ibimenyetso bya mbere:</strong><br>
• Gutinda imihango — ikimenyetso kinini<br>
• Isesemi n'inzangano (nausea)<br>
• Impinduka z'amabere (kubabara, gufura)<br>
• Umunaniro wihuse<br>
• Kuja mu gikari kenshi<br>
• Impinduka z'amahu<br><br>
<strong>Umebye uko neza:</strong><br>
• Kora pregnancy test (ugurishwa mu bitaro no mw'ibiro<br> bya farumasi)<br>
• Gana ivuriro kwa muganga<br>
• Ultrasound irashobora gukoreshwa<br><br>
Wumva ufite bimenyetso? Gana ivuriro rikugereye cyangwa kora test hato.`,
      response_en: `🤰 <strong>Signs of Pregnancy</strong><br><br>
<strong>Early signs:</strong><br>
• Missed period — most common sign<br>
• Nausea / vomiting (morning sickness)<br>
• Breast tenderness or swelling<br>
• Unusual fatigue<br>
• Frequent urination<br>
• Mood changes<br><br>
<strong>How to confirm:</strong><br>
• Take a pregnancy test (available at pharmacies and clinics)<br>
• Visit a health facility for a blood test<br>
• Ultrasound scan for confirmation<br><br>
If you think you might be pregnant, visit your nearest health center soon.`,
      simple_rw: `🤰 Ushobora gutwita niba: imihango yaratinze, isesemi, uburuhe. Kora test cyangwa gana ivuriro.`,
      simple_en: `🤰 You might be pregnant if: period is late, nausea, tiredness. Take a test or go to a clinic.`
    },

    pregnancy_care: {
      patterns: ['antenatal','prenatal','inzego zo gutwita','trimester','kwita ku mwana','gutunga inda','kubaka abana','kujya muganga wakutwaye','ubuvuzi bw\'inda','ndi ku inda'],
      response_rw: `🤰 <strong>Kwita ku Buzima mu Gihe cy'Inda</strong><br><br>
<strong>Inzego 3:</strong><br>
• 1st Trimester (0–12 w): Imiyoboro y'umwana itangira gukura<br>
• 2nd Trimester (13–26 w): Umwana akura vuba<br>
• 3rd Trimester (27–40 w): Umwana areba ivuka<br><br>
<strong>Ibigomba gukorwa:</strong><br>
• Jya ku makuye yo gukurikiranwa (ANC)<br>
• Rya ibiryo byiza (icyuma, vitamini)<br>
• Fata imiti wagabiwe (iron, folic acid)<br>
• Irinda inzoga, itabi, n'ibiyobyabwenge<br><br>
<strong>⚠️ Imyitwarire y'akaga (Gana muganga vuba):</strong><br>
• Kubabara cyane mu nda<br>
• Kuva amaraso menshi<br>
• Gusvita cyane<br>
• Gufura mu maso cyangwa mu ntoki`,
      response_en: `🤰 <strong>Pregnancy Care</strong><br><br>
<strong>3 Trimesters:</strong><br>
• 1st Trimester (0–12 wks): Major development begins<br>
• 2nd Trimester (13–26 wks): Baby grows rapidly<br>
• 3rd Trimester (27–40 wks): Baby prepares for birth<br><br>
<strong>Important steps:</strong><br>
• Attend all antenatal care (ANC) visits<br>
• Eat balanced diet (iron, vitamins, protein)<br>
• Take prescribed supplements (iron, folic acid)<br>
• Avoid alcohol, smoking, and drugs<br><br>
<strong>⚠️ Danger signs (seek help immediately):</strong><br>
• Severe abdominal pain<br>
• Heavy bleeding<br>
• Severe headaches or blurred vision<br>
• Swelling of face or hands`,
      simple_rw: `🤰 Niba utwite: gana muganga, rya neza, fata imiti y'iron. Niba ubabaza cyane — gana ivuriro vuba!`,
      simple_en: `🤰 If pregnant: see a doctor, eat well, take iron pills. If you have bad pain — go to clinic now!`
    },

    menstrual: {
      patterns: ['imihango','period','periods','menstrual','menstruation','cycle','amasaha','imihango yaratinze','kujya mu mihango','imihango yanjye','kwirinda','pbm','pms','crampe','kubabara imihango','hygiene','sanitary'],
      response_rw: `🩸 <strong>Imihango (Menstrual Cycle)</strong><br><br>
• Cycle isanzwe igira iminsi 21–35<br>
• Kuva ku munsi wa mbere w'amaraso<br><br>
<strong>Inzego 4:</strong><br>
1. 📅 <strong>Kubura amaraso (Iminsi 1–5)</strong> — Imihango ikwira<br>
2. 🌱 <strong>Follicular Phase (Iminsi 1–13)</strong> — Umubiri witegura<br>
3. 🥚 <strong>Ovulation (Hagati, Ku munsi wa 14)</strong> — Ikifonyi gisohoka<br>
4. 🌙 <strong>Luteal Phase (Iminsi 15–28)</strong> — Umubiri witegura kuvuka<br><br>
<strong>Kwita ku bushobozi bwawe:</strong><br>
• Koresha ibikoresho byiza (pads, tampons, cups)<br>
• Bathe buri munsi<br>
• Rya ibiryo birimo icyuma<br>
• Kuruhuka nibawo<br><br>
Urashaka kumenya <strong>cycle yawe</strong> cyangwa <strong>PMS</strong>?`,
      response_en: `🩸 <strong>The Menstrual Cycle</strong><br><br>
• A normal cycle lasts 21–35 days<br>
• Day 1 = first day of bleeding<br><br>
<strong>4 Phases:</strong><br>
1. 📅 <strong>Menstrual Phase (Days 1–5)</strong> — Bleeding occurs<br>
2. 🌱 <strong>Follicular Phase (Days 1–13)</strong> — Body prepares an egg<br>
3. 🥚 <strong>Ovulation (Around Day 14)</strong> — Egg is released (most fertile)<br>
4. 🌙 <strong>Luteal Phase (Days 15–28)</strong> — Body prepares for pregnancy<br><br>
<strong>Period hygiene:</strong><br>
• Use clean sanitary products (pads, tampons, cups)<br>
• Change every 4–6 hours<br>
• Bathe regularly<br>
• Eat iron-rich foods<br><br>
Ask me about <strong>cycle tracking</strong> or <strong>PMS symptoms</strong>!`,
      simple_rw: `🩸 Imihango: Igica cy'amaraso gitura buri kwezi. Gufata ibikoresho byiza ni ngombwa. Ubabara bikabije — gana muganga.`,
      simple_en: `🩸 Period: Monthly bleeding — normal. Use clean pads. If very painful — see a doctor.`
    },

    sti_std: {
      patterns: ['sti','std','chlamydia','gonorrhea','gonorrhée','syphilis','herpes','hpv','papillomavirus','genital warts','verrues','indwara zandurira','indwara z','gon','kwandurira','indwara','uburibwe','kubyitwarira','discharge','uburwayi bw'],
      response_rw: `🦠 <strong>Indwara Zandurira mu Mibonano (STI/STD)</strong><br><br>
<strong>Indwara zisanzwe:</strong><br>
• 🔴 <strong>VIH</strong> — Itera uburwayi bw'ubudahangarwa<br>
• 🟠 <strong>Gonorrhea</strong> — Inkorora no kubabara<br>
• 🟡 <strong>Chlamydia</strong> — Kenshi nta bimenyetso<br>
• 🟢 <strong>Syphilis</strong> — Utange udakabya kubabara<br>
• 🔵 <strong>HPV</strong> — Ishobora gutera kanseri<br>
• 🟣 <strong>Herpes</strong> — Impota z'ububabare<br><br>
<strong>Ibimenyetso bisanzwe:</strong><br>
• Inkorora idatunguye<br>
• Kubabara igihe cy'imibonano<br>
• Impota, intumbi, cyangwa agakoko<br>
• Kubabara mu nda<br><br>
<strong>⚠️ Hari abagira STI batabizi!</strong> Kwipimisha rya ngombwa.`,
      response_en: `🦠 <strong>Sexually Transmitted Infections (STIs)</strong><br><br>
<strong>Common STIs:</strong><br>
• 🔴 <strong>HIV</strong> — Attacks the immune system<br>
• 🟠 <strong>Gonorrhea</strong> — Discharge and pain<br>
• 🟡 <strong>Chlamydia</strong> — Often no symptoms<br>
• 🟢 <strong>Syphilis</strong> — Starts with painless sores<br>
• 🔵 <strong>HPV</strong> — Can cause genital warts and cancer<br>
• 🟣 <strong>Herpes</strong> — Painful blisters<br><br>
<strong>Common symptoms:</strong><br>
• Unusual discharge<br>
• Pain during sex or urination<br>
• Sores, rashes, or bumps<br>
• Lower abdominal pain<br><br>
<strong>⚠️ Many STIs have NO symptoms!</strong> Regular testing is essential.`,
      simple_rw: `🦠 STI ni indwara z'imibonano. Bimenyetso: inkorora, kubabara, impota. Kwirinda: koresha condom. Kwipimisha ni ngombwa.`,
      simple_en: `🦠 STIs are infections from sex. Signs: discharge, pain, sores. Prevention: use condom. Get tested!`
    },

    referral: {
      patterns: ['clinic','hospital','ivuriro','muganga','doctor','health center','ikigo nderabuzima','health facility','referral','gana','nkugana','nearby','kugereye','kijye'],
      response_rw: `📍 <strong>Ivuriro ryakugereye</strong><br><br>
🏥 Mu Rwanda, ushobora gukoresha serivisi z'ubuzima z'imfashabere:<br><br>
• <strong>Ikigo nderabuzima cy'urugo</strong> — hato kubona ubuvuzi bw'ibanze<br>
• <strong>Indishyirwa nyarukuru</strong> — ubuvuzi bw'ibyimazeyo<br>
• <strong>Ubuvuzi bw'abana na benewacu</strong> — SRH services<br><br>
📞 <strong>Inomero z'ubufasha:</strong><br>
• Ministeri y'Ubuzima: <strong>114</strong><br>
• Ubufasha bwa ngombwa: <strong>912</strong><br><br>
Niba ufite ikibazo gikabije, jya vuba!`,
      response_en: `📍 <strong>Find a Health Facility</strong><br><br>
🏥 In Rwanda, you can access services at:<br><br>
• <strong>Community Health Centers</strong> — basic healthcare nearby<br>
• <strong>District Hospitals</strong> — specialized care<br>
• <strong>Youth-Friendly Health Units</strong> — SRH services<br><br>
📞 <strong>Helplines:</strong><br>
• Ministry of Health: <strong>114</strong><br>
• Emergency: <strong>912</strong><br><br>
If it's urgent, go to a clinic immediately!`,
      simple_rw: `📍 Gana ivuriro rikygereye. Inomero ya ngombwa: 114 (ubuzima), 912 (acure).`,
      simple_en: `📍 Go to your nearest clinic. Emergency numbers: 114 (health), 912 (emergency).`
    },

    fallback: {
      response_rw: `🤔 Mbabarira, simbishoboye gusobanukirwa neza ikibazo cyawe.<br><br>
Ushobora kugerageza:<br>
• Kubisobanuza ukundi<br>
• Guhitamo ikibazo muri menu yo hepfo<br>
• Gutekereza ku muganga (Dore kuri: <strong>114</strong>)<br><br>
Nzagerageza kukugirira akamaro!`,
      response_en: `🤔 I'm sorry, I didn't quite understand your question.<br><br>
You can try:<br>
• Rephrasing your question<br>
• Choosing a topic from the quick menu below<br>
• Speaking to a health professional (<strong>114</strong>)<br><br>
I'll do my best to help!`,
      simple_rw: `🤔 Simbishoboye gusobanukirwa. Gerageza ukundi cyangwa gana ivuriro.`,
      simple_en: `🤔 I didn't understand. Try again or call 114.`
    }
  };

  /* ── EMERGENCY triggers (always in any language) ── */
  const EMERGENCY_TRIGGERS = [
    'nafashwe ku ngufu','i was assaulted','raped','rape','sexual assault','viol','agression sexuelle',
    'ndimo kuva amaraso menshi','heavy bleeding','bleeding heavily','kuva amaraso',
    'ndumva ndwaye cyane','i feel very sick','very sick','very ill',
    'ndashaka kwiyahura','suicidal','want to kill myself','kill myself',
    'ndumva kubabara bikabije','severe pain','ndabona nabi','blurred vision',
    'inda iremeye cyane','complicated pregnancy','pregnancy emergency',
    'ndatwite ariko','pregnant and'
  ];

  /* ── Quick Replies ── */
  const QUICK_REPLIES_RW = ['💊 Kuboneza','🛡️ VIH/PrEP','🤰 Gutwita','🩸 Imihango','🦠 STI','📍 Ivuriro'];
  const QUICK_REPLIES_EN = ['💊 Contraception','🛡️ HIV/PrEP','🤰 Pregnancy','🩸 Periods','🦠 STIs','📍 Find Clinic'];

  /* ── Helpers ── */
  function normalize(text) {
    return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^\w\s]/g,' ').trim();
  }

  function detectIntent(text) {
    const t = normalize(text);
    for (const [intent, data] of Object.entries(KB)) {
      if (intent === 'fallback') continue;
      if (data.patterns && data.patterns.some(p => t.includes(normalize(p)))) {
        return intent;
      }
    }
    return null;
  }

  function isEmergency(text) {
    const t = normalize(text);
    return EMERGENCY_TRIGGERS.some(trigger => t.includes(normalize(trigger)));
  }

  function getResponse(intent) {
    const data = KB[intent] || KB.fallback;
    if (simpleMode) {
      return data.simple || data.response;
    }
    return data.response;
  }

  function getEmergencyResponse() {
    return `🚨 <strong>IMPORTANT: Urgent Help Needed</strong><br><br>
It sounds like you may be going through something serious.<br><br>
📞 <strong>Please contact immediately:</strong><br>
• Emergency: <strong>912</strong><br>
• Health Hotline: <strong>114</strong><br>
• Go to your nearest health facility now<br><br>
Nothing you're facing is too small to get help for. <strong>You deserve support.</strong><br><br>
Would you like me to connect you with a health counselor?`;
  }

  /* ── Public API ── */
  return {
    setSimple(val) { simpleMode = val; },
    getQuickReplies() { return QUICK_REPLIES_EN; },
    getGreeting() { return getResponse('greetings'); },
    process(userText) {
      messageHistory.push({ role: 'user', text: userText });
      if (isEmergency(userText)) {
        return { type: 'emergency', text: getEmergencyResponse() };
      }
      const intent = detectIntent(userText) || conversationContext;
      conversationContext = intent;
      const reply = intent ? getResponse(intent) : getResponse('fallback');
      messageHistory.push({ role: 'bot', text: reply });
      return { type: intent ? 'normal' : 'fallback', text: reply };
    }
  };
})();

/* =====================================================
   Chatbot UI Controller
   ===================================================== */
(function() {
  const panel    = document.getElementById('chatbot-panel');
  const fab      = document.getElementById('chatbot-fab-btn');
  const messages = document.getElementById('cb-messages');
  const input    = document.getElementById('cb-input');
  const sendBtn  = document.getElementById('cb-send');
  const qrRow    = document.getElementById('quick-replies');
  const cwRw     = document.getElementById('lang-rw');
  const cwEn     = document.getElementById('lang-en');
  const simpleBtn= document.getElementById('simple-mode-btn');
  const cbClose  = document.getElementById('cb-close');

  if (!panel) return;

  let isOpen = false;

  function togglePanel() {
    isOpen = !isOpen;
    panel.classList.toggle('open', isOpen);
    if (isOpen && messages.children.length === 0) {
      addBotMsg(IBANGA_BOT.getGreeting());
      renderQuickReplies();
    }
  }

  function addMsg(html, type) {
    const div = document.createElement('div');
    div.className = `cb-msg ${type}`;
    div.innerHTML = html;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
    return div;
  }

  function addBotMsg(html, emergency = false) {
    return addMsg(html, emergency ? 'bot emergency' : 'bot');
  }

  function addUserMsg(text) {
    return addMsg(escapeHtml(text), 'user');
  }

  function showTyping() {
    const t = document.createElement('div');
    t.className = 'cb-typing';
    t.id = 'cb-typing-indicator';
    t.innerHTML = '<span></span><span></span><span></span>';
    messages.appendChild(t);
    messages.scrollTop = messages.scrollHeight;
  }

  function hideTyping() {
    const t = document.getElementById('cb-typing-indicator');
    if (t) t.remove();
  }

  function renderQuickReplies() {
    if (!qrRow) return;
    qrRow.innerHTML = '';
    IBANGA_BOT.getQuickReplies().forEach(qr => {
      const btn = document.createElement('button');
      btn.className = 'qr-btn';
      btn.textContent = qr;
      btn.onclick = () => sendMessage(qr);
      qrRow.appendChild(btn);
    });
  }

  function sendMessage(text) {
    const trimmed = (text || input.value).trim();
    if (!trimmed) return;
    input.value = '';
    addUserMsg(trimmed);
    showTyping();
    setTimeout(() => {
      hideTyping();
      const result = IBANGA_BOT.process(trimmed);
      addBotMsg(result.text, result.type === 'emergency');
      renderQuickReplies();
    }, 900 + Math.random() * 600);
  }

  function escapeHtml(text) {
    return text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  if (fab) fab.addEventListener('click', togglePanel);
  if (cbClose) cbClose.addEventListener('click', togglePanel);
  if (sendBtn) sendBtn.addEventListener('click', () => sendMessage());
  if (input) input.addEventListener('keydown', e => { if (e.key === 'Enter') sendMessage(); });

  
  if (simpleBtn) simpleBtn.addEventListener('click', () => {
    const on = simpleBtn.classList.toggle('active');
    IBANGA_BOT.setSimple(on);
  });
})();
