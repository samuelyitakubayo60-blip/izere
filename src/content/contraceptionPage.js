export const contraceptionPage = {
  en: {
    label: 'Family Planning',
    labelStyle: { background: 'rgba(130,60,200,0.12)', borderColor: 'rgba(130,60,200,0.3)', color: 'var(--accent)' },
    heroStyle: 'radial-gradient(ellipse at 20% 50%,hsl(280,40%,12%) 0%,transparent 60%),var(--bg-dark)',
    titleAccent: 'Contraceptive',
    titleRest: 'Methods',
    description:
      'Understand all your options — advantages, side effects, and how to use them. Information aligned with Rwanda Ministry of Health and WHO guidelines.',
    badges: [
      { icon: 'shield-alt', color: 'var(--primary)', text: 'Medically Verified' },
      { icon: 'lock', color: 'var(--accent)', text: 'Private Reading' },
      { icon: 'globe', color: 'var(--info)', text: 'Rwanda MoH Guidelines' },
    ],
    nav: [
      { id: 'condoms', icon: 'shield-alt', label: 'Condoms' },
      { id: 'pills', icon: 'pills', label: 'Pills' },
      { id: 'injectables', icon: 'syringe', label: 'Injectables' },
      { id: 'implants', icon: 'hand-holding-medical', label: 'Implants' },
      { id: 'iud', icon: 'circle-notch', label: 'IUD' },
      { id: 'emergency', icon: 'bolt', label: 'Emergency' },
    ],
    remember:
      'Only condoms protect against both pregnancy AND STIs. Talk to a health provider to find the best method for you.',
    sections: [
      {
        id: 'condoms',
        icon: 'shield-alt',
        title: '1. Condoms (Male & Female)',
        intro: 'The only method that protects against BOTH pregnancy AND STIs including HIV.',
        prosCons: {
          pros: ['Protects against STIs and HIV', 'Prevents pregnancy', 'No hormones', 'Easily available & affordable', 'Used only when needed', 'Female condoms give women control'],
          cons: ['Must be used correctly every time', 'Can break or slip if used wrong', 'Some find it reduces sensation', 'Requires availability before sex'],
        },
        info: {
          variant: 'success',
          icon: 'check-double',
          title: 'Correct Use',
          list: ['Check expiry date', 'Open carefully — not with teeth', 'Put on before any sexual contact', 'Leave space at the tip', 'Remove carefully after sex'],
        },
      },
      {
        id: 'pills',
        icon: 'pills',
        title: '2. Birth Control Pills',
        intro: 'Hormonal pills taken daily to prevent pregnancy. Available at all health centers in Rwanda.',
        prosCons: {
          pros: ['Very effective when taken correctly', 'Regulates and lightens periods', 'Can reduce menstrual pain and acne', 'Fertility returns quickly after stopping'],
          cons: ['Must be taken every day at same time', 'May cause nausea, headaches initially', 'Does NOT protect against STIs', 'Less effective if you forget doses'],
        },
      },
      {
        id: 'injectables',
        icon: 'syringe',
        title: '3. Injectables (3-month shot)',
        intro: 'A hormonal injection given every 2–3 months at a health center. Very popular in Rwanda.',
        prosCons: {
          pros: ['Very effective (99%+)', 'Private — no one can see you using it', 'Lasts 2–3 months per injection', 'May reduce or stop periods'],
          cons: ['Requires clinic visits every 3 months', 'May cause irregular bleeding', 'Possible weight gain', 'Fertility may take 6–12 months to return', 'Does NOT protect against STIs'],
        },
      },
      {
        id: 'implants',
        icon: 'hand-holding-medical',
        title: '4. Implants (Jadelle, Implanon)',
        intro: 'Small rod placed under the skin of the arm. Lasts 3–5 years.',
        prosCons: {
          pros: ['Very effective (99%+)', 'Lasts 3–5 years', 'Private and discreet', 'No daily action needed'],
          cons: ['Requires trained provider for insertion/removal', 'May cause irregular bleeding', 'Does NOT protect against STIs', 'Minor procedure required'],
        },
      },
      {
        id: 'iud',
        icon: 'circle-notch',
        title: '5. IUD (Intrauterine Device)',
        intro: 'Small T-shaped device placed in the uterus by a health provider. Lasts 5–10 years.',
        prosCons: {
          pros: ['Very effective', 'Long-lasting', 'Copper IUD has no hormones', 'Hormonal IUD may lighten periods'],
          cons: ['Requires clinic visit for insertion', 'May cause cramping initially', 'Does NOT protect against STIs', 'Must be removed by a provider'],
        },
      },
      {
        id: 'emergency',
        icon: 'bolt',
        title: '6. Emergency Contraception',
        intro: 'Used after unprotected sex to prevent pregnancy. Most effective within 72 hours (3 days), but can work up to 5 days.',
        info: {
          variant: 'warning',
          icon: 'clock',
          title: 'Important',
          list: [
            'Available at pharmacies and health centers in Rwanda',
            'NOT for regular use — only for emergencies',
            'Does NOT protect against STIs',
            'The sooner you take it, the more effective it is',
          ],
        },
      },
    ],
  },
  rw: {
    label: "Gahunda y'umuryango",
    labelStyle: { background: 'rgba(130,60,200,0.12)', borderColor: 'rgba(130,60,200,0.3)', color: 'var(--accent)' },
    heroStyle: 'radial-gradient(ellipse at 20% 50%,hsl(280,40%,12%) 0%,transparent 60%),var(--bg-dark)',
    titleAccent: 'Uburyo',
    titleRest: 'bwo kuboneza urubyaro',
    description:
      "Menya amahitamo yawe yose — inyungu, ingaruka, n'uko bikoreshwa. Amakuru ahuje n'amabwiriza ya Minisiteri y'Ubuzima n'WHO.",
    badges: [
      { icon: 'shield-alt', color: 'var(--primary)', text: "Byemejwe n'abaganga" },
      { icon: 'lock', color: 'var(--accent)', text: 'Gusoma mu ibanga' },
      { icon: 'globe', color: 'var(--info)', text: "Amabwiriza y'u Rwanda" },
    ],
    nav: [
      { id: 'condoms', icon: 'shield-alt', label: 'Agakingirizo' },
      { id: 'pills', icon: 'pills', label: 'Ibinini' },
      { id: 'injectables', icon: 'syringe', label: 'Inshinge' },
      { id: 'implants', icon: 'hand-holding-medical', label: 'Implant' },
      { id: 'iud', icon: 'circle-notch', label: 'IUD / Sterilet' },
      { id: 'emergency', icon: 'bolt', label: 'Uburyo bwihutirwa' },
    ],
    remember:
      'Agakingirizo gusa ni ko karinda inda n\'indwara zandurira. Vugana na muganga kugira ngo uhitamo uburyo bukubereye.',
    sections: [
      {
        id: 'condoms',
        icon: 'shield-alt',
        title: '1. Agakingirizo (ka gabo n\'ak\'umugore)',
        intro: 'Uburyo bwonyine burinda inda n\'indwara zandurira harimo VIH/SIDA.',
        prosCons: {
          pros: [
            'Karinda STI na VIH',
            'Karinda inda',
            'Nta misemburo',
            'Byoroshye kubona kandi birahendutse',
            'Bikoreshwa igihe bikenewe gusa',
            "Agakingirizo k'umugore gaha umugore ububasha",
          ],
          cons: [
            'Bisaba gukoreshwa neza buri gihe',
            'Ashobora gushwanyuka cyangwa gusohoka niba atakoreshejwe neza',
            'Bamwe babona ko bigabanya uburyohe',
            'Bisaba kugira ako kanya mbere y\'imibonano',
          ],
        },
        info: {
          variant: 'success',
          icon: 'check-double',
          title: 'Uko gakoreshwa neza',
          list: [
            'Reba itariki yo kurangira',
            'Fungura neza — ntukoreshe amenyo',
            'Shyira mbere y\'imibonano yose',
            'Siga umwanya ku mutwe',
            'Kura neza nyuma y\'imibonano',
          ],
        },
      },
      {
        id: 'pills',
        icon: 'pills',
        title: '2. Ibinini byo kuboneza urubyaro',
        intro: 'Ibinini by\'imisemburo bifatwa buri munsi kugira ngo wirinde inda. Biboneka mu bigo nderabuzima byose mu Rwanda.',
        prosCons: {
          pros: [
            'Bikora neza iyo bifatwa neza',
            'Bituma imihango igenda neza kandi igabanyuka',
            'Bishobora kugabanya ububabare bw\'imihango n\'ibisebe by\'ubuso',
            'Ubushobozi bwo gutwita busubira vuba nyuma yo guhagarika',
          ],
          cons: [
            'Bisaba gufata buri munsi ku gihe kimwe',
            'Bishobora gutera isesemi cyangwa umutwe mu minsi ya mbere',
            'NTIBIRINDA STI',
            'Bigabanya ubushobozi niba wibagiwe',
          ],
        },
      },
      {
        id: 'injectables',
        icon: 'syringe',
        title: '3. Inshinge (amezi 2–3)',
        intro: 'Urushinge rw\'imisemburo rufatwa buri mezi 2–3 ku kigo nderabuzima. Rukundwa cyane mu Rwanda.',
        prosCons: {
          pros: [
            'Rukora neza cyane (99%+)',
            'Mu ibanga — nta wundi ubona urukoresha',
            'Rumara amezi 2–3 kuri buri rushinge',
            'Rishobora kugabanya cyangwa guhagarika imihango',
          ],
          cons: [
            'Bisaba gusura ikigo buri mezi 3',
            'Rishobora gutera imihango itagenda neza',
            'Ubushobozi bwo kongera ibiro',
            'Ubushobozi bwo gutwita bushobora gutinda amezi 6–12',
            'NTIRIRINDA STI',
          ],
        },
      },
      {
        id: 'implants',
        icon: 'hand-holding-medical',
        title: '4. Implant (Jadelle, Implanon)',
        intro: 'Agafundo gato gashyirwa munsi y\'uruhu rw\'ukuboko. Kamara imyaka 3–5.',
        prosCons: {
          pros: [
            'Gakora neza cyane (99%+)',
            'Kamara imyaka 3–5',
            'Mu ibanga',
            'Nta gikorwa cy\'umunsi gisabwa',
          ],
          cons: [
            'Bisaba umukozi wizeye wo gushyiramo no gukuraho',
            'Gashobora gutera imihango itagenda neza',
            'NTIGARINDA STI',
            'Bisaba ubuvuzi buto',
          ],
        },
      },
      {
        id: 'iud',
        icon: 'circle-notch',
        title: '5. IUD / Sterilet',
        intro: 'Igikoresho gito cy\'ishusho ya T gishyirwa muri nyababyeyi na muganga. Gimara imyaka 5–10.',
        prosCons: {
          pros: [
            'Gikora neza cyane',
            'Gimara igihe kirekire',
            'IUD ya copper nta misemburo ifite',
            'IUD y\'imisemburo ishobora kugabanya imihango',
          ],
          cons: [
            'Bisaba gusura ikigo kugira ngo gishyirwe',
            'Gishobora gutera ububabare mu minsi ya mbere',
            'NTIGIRINDA STI',
            'Gisabwa gukurwaho na muganga',
          ],
        },
      },
      {
        id: 'emergency',
        icon: 'bolt',
        title: '6. Uburyo bwihutirwa bwo kuboneza urubyaro',
        intro:
          'Bukoreshwa nyuma y\'imibonano idakingiye kugira ngo wirinde inda. Bukora neza cyane mu masaha 72 (iminsi 3), ariko bushobora gukora kugeza ku minsi 5.',
        info: {
          variant: 'warning',
          icon: 'clock',
          title: 'Icyitonderwa',
          list: [
            'Buboneka mu farumasi n\'ibigo nderabuzima mu Rwanda',
            'SI uburyo bwo gukoresha buri gihe — ni ubw\'ihutirwa gusa',
            'NTIBURINDA STI',
            'Uko ubufata vuba ni ko bukora neza',
          ],
        },
      },
    ],
  },
};
