import { useEffect, useState } from 'react';
import {
  adminDecideApplication,
  adminDeleteFacility,
  adminListApplications,
  adminListFacilities,
  adminListReferrals,
  adminListReferralFeedback,
  adminUpdateReferralStatus,
  adminSaveFacility,
  getReferralMeta,
  listReferralLocations,
  resolveReferralLocation,
} from '../../services/referralService';

const EMPTY = {
  name: '',
  facility_type: 'health_centre',
  status: 'verified',
  partnership: 'none',
  location_id: null,
  address: '',
  latitude: '',
  longitude: '',
  services: ['sti'],
  phone: '',
  email: '',
  hours_en: '',
  hours_rw: '',
  youth_friendly: true,
  notes_internal: '',
  province: '',
  district: '',
  sector: '',
  cell: '',
  village: '',
};

function Field({ label, children }) {
  return (
    <label className="admin-field">
      <span>{label}</span>
      {children}
    </label>
  );
}

export default function ReferralAdminPanel() {
  const [sub, setSub] = useState('facilities');
  const [meta, setMeta] = useState({ services: [], facility_types: [] });
  const [facilities, setFacilities] = useState([]);
  const [apps, setApps] = useState([]);
  const [refs, setRefs] = useState([]);
  const [feedbackRows, setFeedbackRows] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [msg, setMsg] = useState('');
  const [options, setOptions] = useState({ province: [], district: [], sector: [], cell: [], village: [] });

  const load = async () => {
    try {
      const [m, f, a, r, fb] = await Promise.all([
        getReferralMeta(), adminListFacilities(), adminListApplications(), adminListReferrals(), adminListReferralFeedback(),
      ]);
      setMeta(m);
      setFacilities(f);
      setApps(a);
      setRefs(r);
      setFeedbackRows(fb);
    } catch (e) {
      setMsg(e.response?.data?.detail || e.message);
    }
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    listReferralLocations({ lang: 'en' }).then((names) => {
      setOptions((p) => ({ ...p, province: names }));
    });
  }, []);

  useEffect(() => {
    if (!form.province) return;
    listReferralLocations({ lang: 'en', province: form.province }).then((names) => {
      setOptions((p) => ({ ...p, district: names }));
    });
  }, [form.province]);

  useEffect(() => {
    if (!form.district) return;
    listReferralLocations({ lang: 'en', province: form.province, district: form.district }).then((names) => {
      setOptions((p) => ({ ...p, sector: names }));
    });
  }, [form.province, form.district]);

  useEffect(() => {
    if (!form.sector) return;
    listReferralLocations({
      lang: 'en',
      province: form.province,
      district: form.district,
      sector: form.sector,
    }).then((names) => setOptions((p) => ({ ...p, cell: names })));
  }, [form.province, form.district, form.sector]);

  useEffect(() => {
    if (!form.cell) return;
    listReferralLocations({
      lang: 'en',
      province: form.province,
      district: form.district,
      sector: form.sector,
      cell: form.cell,
    }).then((names) => setOptions((p) => ({ ...p, village: names })));
  }, [form.province, form.district, form.sector, form.cell]);

  const save = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      let locationId = form.location_id;
      if (form.village) {
        const resolved = await resolveReferralLocation({
          province: form.province,
          district: form.district,
          sector: form.sector,
          cell: form.cell,
          village: form.village,
        });
        locationId = resolved.id;
      }
      await adminSaveFacility({
        name: form.name,
        facility_type: form.facility_type,
        status: form.status,
        partnership: form.partnership,
        location_id: locationId || null,
        address: form.address || null,
        latitude: form.latitude === '' ? null : Number(form.latitude),
        longitude: form.longitude === '' ? null : Number(form.longitude),
        services: form.services,
        phone: form.phone || null,
        email: form.email || null,
        hours_en: form.hours_en || null,
        hours_rw: form.hours_rw || null,
        youth_friendly: form.youth_friendly,
        notes_internal: form.notes_internal || null,
      }, editId);
      setForm(EMPTY);
      setEditId(null);
      setMsg('Saved. Only verified facilities appear on Find care.');
      await load();
    } catch (err) {
      setMsg(err.response?.data?.detail || err.message);
    }
  };

  return (
    <div>
      <h2>Referrals &amp; facilities</h2>
      <p className="admin-lead" style={{ marginTop: 0 }}>
        Izere staff add and verify facilities. Clinic applications stay pending until you approve them.
        Never publish a listing without a phone or confirmed services.
      </p>
      {msg ? <p className="admin-notice">{msg}</p> : null}
      <div className="admin-tabs" role="tablist">
        {[['facilities', 'Facilities'], ['apps', 'Applications'], ['refs', 'Referral codes'], ['feedback', 'Care feedback']].map(([id, label]) => (
          <button key={id} type="button" className={sub === id ? 'is-active' : ''} onClick={() => setSub(id)}>
            {label}
          </button>
        ))}
      </div>

      {sub === 'facilities' && (
        <div className="admin-split">
          <div>
            <h3>Verified directory</h3>
            <ul className="admin-list">
              {facilities.map((f) => (
                <li key={f.id}>
                  <strong>{f.name}</strong>
                  <span> {f.status} · {f.partnership} · {f.district || 'no district'}</span>
                  <div className="admin-actions">
                    <button type="button" className="admin-btn-ghost" onClick={() => {
                      setEditId(f.id);
                      setForm({
                        ...EMPTY,
                        name: f.name,
                        facility_type: f.facility_type,
                        status: f.status,
                        partnership: f.partnership === 'partner' ? 'partner' : 'none',
                        location_id: f.location_id,
                        address: f.address || '',
                        latitude: f.latitude ?? '',
                        longitude: f.longitude ?? '',
                        services: f.services || [],
                        phone: f.phone || '',
                        email: f.email || '',
                        hours_en: '',
                        hours_rw: '',
                        youth_friendly: f.youth_friendly,
                        notes_internal: f.notes_internal || '',
                      });
                    }}>Edit</button>
                    <button type="button" className="admin-btn-ghost" onClick={async () => {
                      if (!window.confirm('Remove this facility?')) return;
                      await adminDeleteFacility(f.id);
                      await load();
                    }}>Delete</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <form onSubmit={save}>
            <h3>{editId ? 'Edit facility' : 'Add verified facility'}</h3>
            <Field label="Name">
              <input className="admin-input" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </Field>
            <Field label="Type">
              <select className="admin-input" value={form.facility_type} onChange={(e) => setForm({ ...form, facility_type: e.target.value })}>
                {(meta.facility_types || []).map((tp) => <option key={tp} value={tp}>{tp}</option>)}
              </select>
            </Field>
            <Field label="Status">
              <select className="admin-input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="draft">draft</option>
                <option value="pending_review">pending_review</option>
                <option value="verified">verified (public)</option>
                <option value="unpublished">unpublished</option>
              </select>
            </Field>
            <Field label="Partnership">
              <select className="admin-input" value={form.partnership} onChange={(e) => setForm({ ...form, partnership: e.target.value })}>
                <option value="none">Listed only — not a signed partner</option>
                <option value="partner">Official Izere referral partner</option>
              </select>
            </Field>
            {['province', 'district', 'sector', 'cell', 'village'].map((field) => (
              <Field key={field} label={field}>
                <select
                  className="admin-input"
                  value={form[field]}
                  onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                >
                  <option value="">Select {field}</option>
                  {(options[field] || []).map((name) => <option key={name} value={name}>{name}</option>)}
                </select>
              </Field>
            ))}
            <Field label="Latitude"><input className="admin-input" value={form.latitude} onChange={(e) => setForm({ ...form, latitude: e.target.value })} /></Field>
            <Field label="Longitude"><input className="admin-input" value={form.longitude} onChange={(e) => setForm({ ...form, longitude: e.target.value })} /></Field>
            <Field label="Phone"><input className="admin-input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></Field>
            <Field label="Hours (EN)"><input className="admin-input" value={form.hours_en} onChange={(e) => setForm({ ...form, hours_en: e.target.value })} /></Field>
            <Field label="Hours (RW)"><input className="admin-input" value={form.hours_rw} onChange={(e) => setForm({ ...form, hours_rw: e.target.value })} /></Field>
            <fieldset className="care-services">
              <legend>Services</legend>
              {(meta.services || []).map((item) => (
                <label key={item.code} className="care-check">
                  <input
                    type="checkbox"
                    checked={form.services.includes(item.code)}
                    onChange={(e) => {
                      const next = e.target.checked
                        ? [...form.services, item.code]
                        : form.services.filter((c) => c !== item.code);
                      setForm({ ...form, services: next });
                    }}
                  />
                  {item.label_en}
                </label>
              ))}
            </fieldset>
            <div className="admin-actions">
              <button type="submit" className="admin-btn-primary">{editId ? 'Update' : 'Add facility'}</button>
              {editId ? (
                <button type="button" className="admin-btn-ghost" onClick={() => { setEditId(null); setForm(EMPTY); }}>Cancel</button>
              ) : null}
            </div>
          </form>
        </div>
      )}

      {sub === 'apps' && (
        <div>
          <h3>Clinic applications</h3>
          <table className="admin-table">
            <thead>
              <tr><th>Organisation</th><th>Contact</th><th>District</th><th>Status</th><th></th></tr>
            </thead>
            <tbody>
              {apps.map((a) => (
                <tr key={a.id}>
                  <td>{a.organisation_name}<br /><small>{a.licence_or_moh_code || 'no licence code'}</small></td>
                  <td>{a.contact_name}<br /><small>{a.phone} · {a.email}</small></td>
                  <td>{a.district_name} {a.sector_name}</td>
                  <td>{a.status}</td>
                  <td>
                    {a.status === 'pending' ? (
                      <div className="admin-actions">
                        <button type="button" className="admin-btn-primary" onClick={async () => {
                          await adminDecideApplication(a.id, { approve: true, as_partner: false });
                          await load();
                        }}>Verify listing</button>
                        <button type="button" className="admin-btn-primary" onClick={async () => {
                          await adminDecideApplication(a.id, { approve: true, as_partner: true });
                          await load();
                        }}>Approve as partner</button>
                        <button type="button" className="admin-btn-ghost" onClick={async () => {
                          await adminDecideApplication(a.id, { approve: false });
                          await load();
                        }}>Decline</button>
                      </div>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {sub === 'refs' && (
        <div>
          <h3>Recent referral codes (no names stored)</h3>
          <table className="admin-table">
            <thead>
              <tr><th>Code</th><th>Service</th><th>Facility</th><th>District</th><th>Status</th><th>When</th></tr>
            </thead>
            <tbody>
              {refs.map((r) => (
                <tr key={r.referral_id}>
                  <td>{r.referral_id}</td>
                  <td>{r.service}</td>
                  <td>{r.facility}</td>
                  <td>{r.district || '—'}</td>
                  <td><select aria-label={`Update status for ${r.referral_id}`} className="admin-input" value={r.status} onChange={async (e) => { try { await adminUpdateReferralStatus(r.referral_id, e.target.value); setMsg(`Updated ${r.referral_id}`); await load(); } catch (err) { setMsg(err.response?.data?.detail || err.message); } }}><option value="requested">Requested</option><option value="received">Received</option><option value="scheduled">Scheduled</option><option value="completed">Completed</option><option value="unable_to_contact">Unable to contact</option><option value="cancelled">Cancelled</option></select></td>
                  <td>{r.created_at ? new Date(r.created_at).toLocaleString() : ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {sub === 'feedback' && (
        <div>
          <h3>Care feedback</h3>
          <p className="admin-lead">Review reported care access, respectful treatment and privacy. Follow your approved complaints process for concerns; avoid copying unnecessary health details.</p>
          <table className="admin-table"><thead><tr><th>Referral</th><th>Facility</th><th>Rating</th><th>Care received</th><th>Respect</th><th>Privacy</th><th>Comments</th><th>Date</th></tr></thead>
            <tbody>{feedbackRows.map((f) => <tr key={`${f.referral_id}-${f.created_at}`}><td>{f.referral_id}</td><td>{f.facility || '—'}</td><td>{f.rating}/5</td><td>{f.received_care ? 'Yes' : 'No'}</td><td>{f.respectful_treatment == null ? '—' : f.respectful_treatment ? 'Yes' : 'No'}</td><td>{f.privacy_respected == null ? '—' : f.privacy_respected ? 'Yes' : 'No'}</td><td>{f.comments || '—'}</td><td>{f.created_at ? new Date(f.created_at).toLocaleString() : ''}</td></tr>)}</tbody>
          </table>
          {!feedbackRows.length ? <p>No feedback submitted yet.</p> : null}
        </div>
      )}
    </div>
  );
}
