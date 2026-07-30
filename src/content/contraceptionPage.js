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
    titleRest: 'bwo gukuramo',
    description: 'Menya amahitamo yawe — ibyiruto, ingaruka, n\'uko bikoreshwa. Bihuje n\'amabwiriza ya Minisiteri y\'Ubuzima.',
    badges: [
      { icon: 'shield-alt', color: 'var(--primary)', text: 'Byemejwe n\'abaganga' },
      { icon: 'lock', color: 'var(--accent)', text: 'Mu ibanga' },
      { icon: 'globe', color: 'var(--info)', text: 'Amabwiriza ya Rwanda' },
    ],
    nav: [
      { id: 'condoms', icon: 'shield-alt', label: 'Ibigabo' },
      { id: 'pills', icon: 'pills', label: 'Imiti' },
      { id: 'injectables', icon: 'syringe', label: 'Umuti w\'injection' },
      { id: 'implants', icon: 'hand-holding-medical', label: 'Implant' },
      { id: 'iud', icon: 'circle-notch', label: 'IUD' },
      { id: 'emergency', icon: 'bolt', label: 'Byihutirwa' },
    ],
    remember: 'Ibigabo gusa birinda imyaka n\'indwara zihurira. Vugana na muganga kugira ngo uhitamo uburyo bwiza.',
    sections: [
      {
        id: 'condoms',
        icon: 'shield-alt',
        title: '1. Ibigabo',
        intro: 'Uburyo bwonyine burinda imyaka n\'indwara zihurira harimo SIDA.',
        prosCons: {
          pros: ['Birinda STIs na SIDA', 'Birinda imyaka', 'Nta myitwarire', 'Byoroshye kubona', 'Bikoreshwa igihe gikenewe'],
          cons: ['Bisaba gukoreshwa neza buri gihe', 'Bishobora gutemba', 'Ntibirengera STIs niba bitakoreshejwe'],
        },
        info: {
          variant: 'success',
          icon: 'check-double',
          title: 'Uko bikoreshwa neza',
          list: ['Reba itariki', 'Fungura neza', 'Shyira mbere yo guhunda', 'Kura neza nyuma'],
        },
      },
      {
        id: 'pills',
        icon: 'pills',
        title: '2. Imiti y\'imitiyure',
        intro: 'Imiti ifatwa buri munsi. Iboneka mu matorero y\'ubuzima.',
        prosCons: {
          pros: ['Ikora neza iyo ifatwa neza', 'Ituma amenzi agenda neza', 'Fertility isubira vuba'],
          cons: ['Buri munsi ku gihe kimwe', 'Ntirengera STIs', 'Gusibira imiti bigabanya imbaraga'],
        },
      },
      {
        id: 'injectables',
        icon: 'syringe',
        title: '3. Injection (amezi 2–3)',
        intro: 'Umuti w\'injection ku kigo cy\'ubuzima. Ukundwa cyane mu Rwanda.',
        prosCons: {
          pros: ['Ikora neza cyane', 'Mu ibanga', 'Imara amezi 2–3'],
          cons: ['Gusura kliniki buri mezi 3', 'Amenzi atagenda neza', 'Ntirengera STIs'],
        },
      },
      {
        id: 'implants',
        icon: 'hand-holding-medical',
        title: '4. Implant',
        intro: 'Agafundo gato mu ukuboko. Kamara imyaka 3–5.',
        prosCons: {
          pros: ['Ikora neza', 'Imara imyaka', 'Mu ibanga'],
          cons: ['Bisaba muganga', 'Ntirengera STIs'],
        },
      },
      {
        id: 'iud',
        icon: 'circle-notch',
        title: '5. IUD',
        intro: 'Igikoresho gishyirwa mu matera. Gimara imyaka 5–10.',
        prosCons: {
          pros: ['Ikora neza', 'Igihe kirekire'],
          cons: ['Bisaba muganga', 'Ntirengera STIs'],
        },
      },
      {
        id: 'emergency',
        icon: 'bolt',
        title: '6. Immitiyure y\'ihutirwa',
        intro: 'Nyuma yo guhunda nta kurinda. Ikora neza mu masaha 72.',
        info: {
          variant: 'warning',
          icon: 'clock',
          title: 'Ibuka',
          list: ['Iboneka mu ma pharmacy', 'Si yo gukoresha buri gihe', 'Ntirengera STIs', 'Fata vuba'],
        },
      },
    ],
  },
};
