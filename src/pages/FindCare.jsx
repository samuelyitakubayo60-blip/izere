import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import T from '../components/T';
import { useLanguage } from '../contexts/LanguageContext';
import { getAnonymousId } from '../utils/anonymousSession';
import {
  applyAsPartner,
  getReferralMeta,
  listReferralLocations,
  lookupReferral,
  submitReferralFeedback,
  requestReferral,
  resolveReferralLocation,
  searchFacilities,
} from '../services/referralService';

const EMPTY_LOC = { province: '', district: '', sector: '', cell: '', village: '' };

function mapsUrl(name, district, sector) {
  const q = encodeURIComponent([name, sector, district, 'Rwanda'].filter(Boolean).join(', '));
  return `https://www.google.com/maps/search/?api=1&query=${q}`;
}

function telHref(phone) {
  if (!phone) return null;
  return `tel:${phone.replace(/\s+/g, '')}`;
}

export default function FindCare() {
  const { t, language } = useLanguage();
  const [tab, setTab] = useState('find');
  const [meta, setMeta] = useState({ services: [], privacy: {} });
  const [service, setService] = useState('sti');
  const [loc, setLoc] = useState(EMPTY_LOC);
  const [options, setOptions] = useState({ province: [], district: [], sector: [], cell: [], village: [] });
  const [gps, setGps] = useState({ lat: null, lng: null, error: '', ready: false });
  const [results, setResults] = useState(null);
  const [searching, setSearching] = useState(false);
  const [notice, setNotice] = useState('');
  const [referral, setReferral] = useState(null);
  const [consentShare, setConsentShare] = useState(false);
  const [lookupCode, setLookupCode] = useState('');
  const [lookupResult, setLookupResult] = useState(null);
  const [feedback, setFeedback] = useState({ rating: '5', received_care: 'yes', respectful_treatment: 'yes', privacy_respected: 'yes', comments: '' });
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [partner, setPartner] = useState({
    organisation_name: '',
    facility_type: 'clinic',
    contact_name: '',
    contact_role: '',
    phone: '',
    email: '',
    district_name: '',
    sector_name: '',
    address: '',
    services: ['sti'],
    licence_or_moh_code: '',
    message: '',
  });

  useEffect(() => {
    getReferralMeta().then(setMeta).catch(() => {});
  }, []);

  useEffect(() => {
    if (tab !== 'find') return undefined;
    if (!navigator.geolocation) {
      setGps((g) => ({ ...g, error: t('care.gpsUnavailable') }));
      return undefined;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGps({ lat: pos.coords.latitude, lng: pos.coords.longitude, error: '', ready: true });
      },
      () => setGps((g) => ({ ...g, error: t('care.gpsDenied'), ready: false })),
      { enableHighAccuracy: false, timeout: 12000, maximumAge: 300000 },
    );
    return undefined;
  }, [tab, t]);

  useEffect(() => {
    listReferralLocations({ lang: language }).then((names) => {
      setOptions((prev) => ({ ...prev, province: names }));
    }).catch(() => {});
  }, [language]);

  useEffect(() => {
    if (!loc.province) {
      setOptions((p) => ({ ...p, district: [], sector: [], cell: [], village: [] }));
      return;
    }
    listReferralLocations({ lang: language, province: loc.province }).then((names) => {
      setOptions((p) => ({ ...p, district: names, sector: [], cell: [], village: [] }));
    }).catch(() => setOptions((p) => ({ ...p, district: [], sector: [], cell: [], village: [] })));
  }, [language, loc.province]);

  useEffect(() => {
    if (!loc.province || !loc.district) return;
    listReferralLocations({ lang: language, province: loc.province, district: loc.district }).then((names) => {
      setOptions((p) => ({ ...p, sector: names, cell: [], village: [] }));
    }).catch(() => setOptions((p) => ({ ...p, sector: [], cell: [], village: [] })));
  }, [language, loc.province, loc.district]);

  useEffect(() => {
    if (!loc.sector) return;
    listReferralLocations({
      lang: language,
      province: loc.province,
      district: loc.district,
      sector: loc.sector,
    }).then((names) => {
      setOptions((p) => ({ ...p, cell: names, village: [] }));
    }).catch(() => setOptions((p) => ({ ...p, cell: [], village: [] })));
  }, [language, loc.province, loc.district, loc.sector]);

  useEffect(() => {
    if (!loc.cell) return;
    listReferralLocations({
      lang: language,
      province: loc.province,
      district: loc.district,
      sector: loc.sector,
      cell: loc.cell,
    }).then((names) => {
      setOptions((p) => ({ ...p, village: names }));
    }).catch(() => setOptions((p) => ({ ...p, village: [] })));
  }, [language, loc.province, loc.district, loc.sector, loc.cell]);

  const submitFeedback = async (event) => {
    event.preventDefault();
    setFeedbackMessage('');
    try {
      const response = await submitReferralFeedback({
        referral_code: lookupCode.trim().toUpperCase(), rating: Number(feedback.rating),
        received_care: feedback.received_care === 'yes',
        respectful_treatment: feedback.respectful_treatment === 'yes',
        privacy_respected: feedback.privacy_respected === 'yes', comments: feedback.comments.trim() || null,
      });
      setFeedbackMessage(response.message || 'Thank you for your feedback.');
    } catch (error) {
      setFeedbackMessage(error.response?.data?.detail || 'We could not submit feedback. Check the referral code or try again.');
    }
  };

  const serviceLabel = useMemo(() => {
    const item = (meta.services || []).find((s) => s.code === service);
    if (!item) return service;
    return language === 'rw' ? item.label_rw : item.label_en;
  }, [meta.services, service, language]);

  const setLocField = (field, value) => {
    setLoc((prev) => {
      const next = { ...prev, [field]: value };
      if (field === 'province') Object.assign(next, { district: '', sector: '', cell: '', village: '' });
      if (field === 'district') Object.assign(next, { sector: '', cell: '', village: '' });
      if (field === 'sector') Object.assign(next, { cell: '', village: '' });
      if (field === 'cell') Object.assign(next, { village: '' });
      return next;
    });
  };

  const runSearch = async (e) => {
    e?.preventDefault();
    setSearching(true);
    setNotice('');
    setReferral(null);
    try {
      const params = { service, lang: language };
      if (gps.lat != null && gps.lng != null) {
        params.lat = gps.lat;
        params.lng = gps.lng;
      }
      if (loc.province) params.province = loc.province;
      if (loc.district) params.district = loc.district;
      if (loc.sector) params.sector = loc.sector;
      const data = await searchFacilities(params);
      setResults(data);
      if (!data.facilities?.length) setNotice(t('care.noFacilities'));
    } catch (err) {
      setNotice(err.response?.data?.detail || err.message);
    } finally {
      setSearching(false);
    }
  };

  const makeReferral = async (facility) => {
    setNotice('');
    try {
      let locationId = null;
      if (loc.village) {
        const resolved = await resolveReferralLocation(loc);
        locationId = resolved.id;
      }
      const data = await requestReferral({
        facility_id: facility.id,
        service_code: service,
        anonymous_id: getAnonymousId(),
        location_id: locationId,
        consent_gps: gps.lat != null,
        consent_share: consentShare,
      });
      setReferral(data);
    } catch (err) {
      setNotice(err.response?.data?.detail || err.message);
    }
  };

  const submitPartner = async (e) => {
    e.preventDefault();
    setNotice('');
    try {
      const data = await applyAsPartner(partner);
      setNotice(data.message || t('care.partnerThanks'));
    } catch (err) {
      setNotice(err.response?.data?.detail || err.message);
    }
  };

  const doLookup = async (e) => {
    e.preventDefault();
    setLookupResult(null);
    try {
      setLookupResult(await lookupReferral(lookupCode.trim().toUpperCase()));
    } catch (err) {
      setNotice(err.response?.data?.detail || err.message);
    }
  };

  return (
    <div>
      <section className="page-hero">
        <div className="container">
          <span className="section-label"><T k="care.label" /></span>
          <h1 className="hero-title"><T k="care.title" /></h1>
          <p className="hero-desc mt-3"><T k="care.intro" /></p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="info-card warning" style={{ background: 'rgba(230,160,30,0.08)' }}>
            <p style={{ margin: 0 }}><T k="care.emergency" /></p>
          </div>

          <div className="care-tabs" role="tablist">
            {[
              ['find', 'care.tabFind'],
              ['partner', 'care.tabPartner'],
              ['lookup', 'care.tabLookup'],
            ].map(([id, key]) => (
              <button
                key={id}
                type="button"
                className={tab === id ? 'is-active' : ''}
                onClick={() => { setTab(id); setNotice(''); }}
              >
                <T k={key} />
              </button>
            ))}
          </div>

          {notice ? <p className="care-notice">{notice}</p> : null}

          {tab === 'find' && (
            <form className="care-form glass-card" onSubmit={runSearch}>
              <h2><T k="care.needTitle" /></h2>
              <div className="care-services">
                {(meta.services || []).map((item) => (
                  <label key={item.code} className={`care-choice${service === item.code ? ' is-on' : ''}`}>
                    <input
                      type="radio"
                      name="service"
                      value={item.code}
                      checked={service === item.code}
                      onChange={() => setService(item.code)}
                    />
                    {language === 'rw' ? item.label_rw : item.label_en}
                  </label>
                ))}
              </div>

              <h2><T k="care.whereTitle" /></h2>
              <p className="care-hint"><T k="care.whereHint" /></p>
              {gps.ready ? <p className="care-ok"><T k="care.gpsReady" /></p> : null}
              {gps.error ? <p className="care-notice">{gps.error}</p> : null}

              <div className="care-grid">
                {[
                  ['province', options.province, true],
                  ['district', options.district, Boolean(loc.province)],
                  ['sector', options.sector, Boolean(loc.district)],
                  ['cell', options.cell, Boolean(loc.sector)],
                  ['village', options.village, Boolean(loc.cell)],
                ].map(([field, names, enabled]) => (
                  <label key={field} className="admin-field">
                    <span><T k={`shop.${field}`} /></span>
                    <select
                      className="admin-input"
                      disabled={!enabled}
                      value={loc[field]}
                      onChange={(e) => setLocField(field, e.target.value)}
                    >
                      <option value="">{t(`shop.${field}`)}</option>
                      {names.map((name) => (
                        <option key={name} value={name}>{name}</option>
                      ))}
                    </select>
                  </label>
                ))}
              </div>

              <button type="submit" className="btn-primary-custom" disabled={searching}>
                {searching ? t('common.loading') : t('care.search')}
              </button>
            </form>
          )}

          {tab === 'find' && results?.facilities?.length ? (
            <div className="care-results">
              <h2><T k="care.resultsTitle" /></h2>
              <p className="care-hint">{serviceLabel} — {results.count}</p>
              <label className="care-check">
                <input
                  type="checkbox"
                  checked={consentShare}
                  onChange={(e) => setConsentShare(e.target.checked)}
                />
                <T k="care.shareConsent" />
              </label>
              {results.facilities.map((f) => (
                <article key={f.id} className="glass-card care-facility">
                  <div>
                    <h3>{f.name}</h3>
                    <p>
                      {[f.facility_type?.replace('_', ' '), f.district, f.sector].filter(Boolean).join(' · ')}
                      {f.distance_km != null ? ` · ${f.distance_km} km` : ''}
                    </p>
                    {f.hours ? <p>{f.hours}</p> : null}
                    {f.is_partner ? <span className="care-badge"><T k="care.partnerBadge" /></span> : null}
                  </div>
                  <div className="care-actions">
                    <a className="btn-outline-custom" href={mapsUrl(f.name, f.district, f.sector)} target="_blank" rel="noreferrer">
                      <T k="care.directions" />
                    </a>
                    {f.phone ? (
                      <a className="btn-outline-custom" href={telHref(f.phone)}><T k="care.call" /></a>
                    ) : null}
                    <button
                      type="button"
                      className="btn-primary-custom"
                      onClick={() => makeReferral(f)}
                    >
                      <T k="care.requestReferral" />
                    </button>
                  </div>
                </article>
              ))}
              {referral ? (
                <div className="info-card success">
                  <h3><T k="care.referralReady" /></h3>
                  <p className="care-code">{referral.referral_id}</p>
                  <p>{referral.message}</p>
                </div>
              ) : null}
            </div>
          ) : null}

          {tab === 'partner' && (
            <form className="care-form glass-card" onSubmit={submitPartner}>
              <h2><T k="care.partnerTitle" /></h2>
              <p className="care-hint"><T k="care.partnerIntro" /></p>
              <div className="care-grid">
                <label className="admin-field">
                  <span><T k="care.orgName" /></span>
                  <input className="admin-input" required value={partner.organisation_name} onChange={(e) => setPartner({ ...partner, organisation_name: e.target.value })} />
                </label>
                <label className="admin-field">
                  <span><T k="care.contactName" /></span>
                  <input className="admin-input" required value={partner.contact_name} onChange={(e) => setPartner({ ...partner, contact_name: e.target.value })} />
                </label>
                <label className="admin-field">
                  <span><T k="care.phone" /></span>
                  <input className="admin-input" required value={partner.phone} onChange={(e) => setPartner({ ...partner, phone: e.target.value })} />
                </label>
                <label className="admin-field">
                  <span><T k="care.email" /></span>
                  <input className="admin-input" type="email" required value={partner.email} onChange={(e) => setPartner({ ...partner, email: e.target.value })} />
                </label>
                <label className="admin-field">
                  <span><T k="shop.district" /></span>
                  <input className="admin-input" value={partner.district_name} onChange={(e) => setPartner({ ...partner, district_name: e.target.value })} />
                </label>
                <label className="admin-field">
                  <span><T k="shop.sector" /></span>
                  <input className="admin-input" value={partner.sector_name} onChange={(e) => setPartner({ ...partner, sector_name: e.target.value })} />
                </label>
                <label className="admin-field">
                  <span><T k="care.licence" /></span>
                  <input className="admin-input" value={partner.licence_or_moh_code} onChange={(e) => setPartner({ ...partner, licence_or_moh_code: e.target.value })} />
                </label>
              </div>
              <label className="admin-field">
                <span><T k="care.address" /></span>
                <input className="admin-input" value={partner.address} onChange={(e) => setPartner({ ...partner, address: e.target.value })} />
              </label>
              <fieldset className="care-services">
                <legend><T k="care.servicesOffered" /></legend>
                {(meta.services || []).map((item) => (
                  <label key={item.code} className="care-check">
                    <input
                      type="checkbox"
                      checked={partner.services.includes(item.code)}
                      onChange={(e) => {
                        const next = e.target.checked
                          ? [...partner.services, item.code]
                          : partner.services.filter((c) => c !== item.code);
                        setPartner({ ...partner, services: next });
                      }}
                    />
                    {language === 'rw' ? item.label_rw : item.label_en}
                  </label>
                ))}
              </fieldset>
              <button type="submit" className="btn-primary-custom"><T k="care.submitApplication" /></button>
            </form>
          )}

          {tab === 'lookup' && (
            <form className="care-form glass-card" onSubmit={doLookup}>
              <h2><T k="care.lookupTitle" /></h2>
              <label className="admin-field">
                <span><T k="care.referralCode" /></span>
                <input className="admin-input" value={lookupCode} onChange={(e) => setLookupCode(e.target.value)} placeholder="IZR-2026-000001" />
              </label>
              <button type="submit" className="btn-primary-custom"><T k="care.lookup" /></button>
              {lookupResult ? (
                <div className="info-card">
                  <p className="care-code">{lookupResult.referral_id}</p>
                  <p>{lookupResult.facility} · {lookupResult.service} · {lookupResult.status}</p>
                  <p className="care-hint">Keep this code private. The status shown here is limited and does not include sensitive clinical details.</p>
                  <form className="care-form" onSubmit={submitFeedback}>
                    <h3>Have you received care?</h3>
                    <label className="admin-field"><span>Overall experience (1 = poor, 5 = excellent)</span><select className="admin-input" value={feedback.rating} onChange={e => setFeedback({...feedback, rating:e.target.value})}>{[5,4,3,2,1].map(n => <option key={n} value={n}>{n}</option>)}</select></label>
                    <label className="admin-field"><span>Did you receive the service?</span><select className="admin-input" value={feedback.received_care} onChange={e => setFeedback({...feedback, received_care:e.target.value})}><option value="yes">Yes</option><option value="no">No</option></select></label>
                    <label className="admin-field"><span>Were you treated respectfully?</span><select className="admin-input" value={feedback.respectful_treatment} onChange={e => setFeedback({...feedback, respectful_treatment:e.target.value})}><option value="yes">Yes</option><option value="no">No</option></select></label>
                    <label className="admin-field"><span>Was your privacy respected?</span><select className="admin-input" value={feedback.privacy_respected} onChange={e => setFeedback({...feedback, privacy_respected:e.target.value})}><option value="yes">Yes</option><option value="no">No</option></select></label>
                    <label className="admin-field"><span>Optional comments (do not include private medical details)</span><textarea className="admin-input" maxLength={1500} rows={3} value={feedback.comments} onChange={e => setFeedback({...feedback, comments:e.target.value})} /></label>
                    <button className="btn-primary-custom" type="submit">Submit feedback</button>
                    {feedbackMessage ? <p role="status" className="care-hint">{feedbackMessage}</p> : null}
                  </form>
                </div>
              ) : null}
            </form>
          )}

          <p className="care-hint" style={{ marginTop: '2rem' }}>
            <Link to="/chat"><T k="care.askChat" /></Link>
          </p>
        </div>
      </section>
    </div>
  );
}
