import { useState } from 'react';
import FormField from '../../components/common/FormField';
import { COUNTRIES } from '../../data/site';
import { useAuth } from '../../hooks/useAuth';
import { useUI } from '../../hooks/useUI';
import { hasErrors, validatePhone, validateRequired } from '../../utils/validate';

const EMPTY = { label: 'Home', name: '', line1: '', city: '', state: '', zip: '', country: COUNTRIES[0], phone: '', isDefault: false };

export default function AddressesPage() {
  const { user, saveAddress, deleteAddress } = useAuth();
  const { showToast } = useUI();
  const [editing, setEditing] = useState(null); // address object or EMPTY
  const [errors, setErrors] = useState({});

  const set = (key) => (e) => setEditing((a) => ({ ...a, [key]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = {
      name: validateRequired(editing.name, 'Full name'),
      line1: validateRequired(editing.line1, 'Address'),
      city: validateRequired(editing.city, 'City'),
      zip: validateRequired(editing.zip, 'PIN / ZIP'),
      phone: validatePhone(editing.phone),
    };
    setErrors(errs);
    if (hasErrors(errs)) return;
    saveAddress(editing);
    setEditing(null);
    showToast('Address saved');
  };

  return (
    <div className="side-card" data-reveal="up">
      <div className="acct-head">
        <h3 className="cs-title">Saved addresses</h3>
        {!editing && (
          <button className="btn-outline btn-sm" onClick={() => setEditing({ ...EMPTY, name: `${user.firstName} ${user.lastName}` })}>
            + Add address
          </button>
        )}
      </div>

      {editing ? (
        <form className="co-form" onSubmit={handleSubmit} noValidate>
          <div className="form-r2">
            <FormField id="ad-label" name="label" label="Label" value={editing.label} onChange={set('label')} placeholder="Home / Office" />
            <FormField id="ad-name" name="name" label="Full Name" value={editing.name} onChange={set('name')} error={errors.name} />
          </div>
          <FormField id="ad-line1" name="line1" label="Address" value={editing.line1} onChange={set('line1')} error={errors.line1} />
          <div className="form-r2">
            <FormField id="ad-city" name="city" label="City" value={editing.city} onChange={set('city')} error={errors.city} />
            <FormField id="ad-zip" name="zip" label="PIN / ZIP" value={editing.zip} onChange={set('zip')} error={errors.zip} />
          </div>
          <div className="form-r2">
            <FormField id="ad-state" name="state" label="State" value={editing.state} onChange={set('state')} />
            <FormField id="ad-country" name="country" label="Country" as="select" value={editing.country} onChange={set('country')}>
              {COUNTRIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </FormField>
          </div>
          <FormField id="ad-phone" name="phone" label="Phone" type="tel" value={editing.phone} onChange={set('phone')} error={errors.phone} />
          <label className="check">
            <input type="checkbox" checked={editing.isDefault} onChange={(e) => setEditing((a) => ({ ...a, isDefault: e.target.checked }))} /> Make this my default address
          </label>
          <div className="co-btns">
            <button type="submit" className="btn-gold">
              Save Address
            </button>
            <button type="button" className="btn-ghost" onClick={() => setEditing(null)}>
              Cancel
            </button>
          </div>
        </form>
      ) : user.addresses.length === 0 ? (
        <p className="muted">No saved addresses yet. Add one to speed up checkout.</p>
      ) : (
        <div className="addr-grid" data-stagger=".addr-card">
          {user.addresses.map((a) => (
            <div className="addr-card" key={a.id}>
              <div className="addr-top">
                <strong>{a.label}</strong>
                {a.isDefault && <span className="status-badge done">Default</span>}
              </div>
              <p>
                {a.name}
                <br />
                {a.line1}
                <br />
                {a.city}, {a.state} {a.zip}
                <br />
                {a.country}
                {a.phone && (
                  <>
                    <br />
                    {a.phone}
                  </>
                )}
              </p>
              <div className="addr-acts">
                <button className="auth-link" onClick={() => setEditing(a)}>
                  Edit
                </button>
                <button
                  className="auth-link"
                  onClick={() => {
                    deleteAddress(a.id);
                    showToast('Address removed');
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
