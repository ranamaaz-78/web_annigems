import { useState } from 'react';
import { Link } from 'react-router-dom';
import FormField from '../../components/common/FormField';
import { useAuth } from '../../hooks/useAuth';
import { useUI } from '../../hooks/useUI';
import { formatPrice } from '../../utils/format';
import { hasErrors, validatePhone, validateRequired } from '../../utils/validate';

export default function ProfilePage() {
  const { user, updateUser, myOrders } = useAuth();
  const { showToast } = useUI();
  const [form, setForm] = useState({ firstName: user.firstName, lastName: user.lastName, phone: user.phone || '' });
  const [errors, setErrors] = useState({});

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const spent = myOrders.reduce((s, o) => s + o.totals.total, 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = {
      firstName: validateRequired(form.firstName, 'First name'),
      lastName: validateRequired(form.lastName, 'Last name'),
      phone: validatePhone(form.phone),
    };
    setErrors(errs);
    if (hasErrors(errs)) return;
    updateUser(form);
    showToast('Profile updated');
  };

  return (
    <>
      <div className="stat-row" data-stagger=".stat-card">
        <div className="stat-card">
          <span className="stat-num">{myOrders.length}</span>
          <span>Orders</span>
        </div>
        <div className="stat-card">
          <span className="stat-num">{user.addresses.length}</span>
          <span>Addresses</span>
        </div>
        <div className="stat-card">
          <span className="stat-num">{formatPrice(spent)}</span>
          <span>Total spent</span>
        </div>
      </div>

      <div className="side-card" data-reveal="up">
        <h3 className="cs-title">Profile details</h3>
        <form className="co-form" onSubmit={handleSubmit} noValidate>
          <div className="form-r2">
            <FormField id="pf-first" name="firstName" label="First Name" value={form.firstName} onChange={set('firstName')} error={errors.firstName} />
            <FormField id="pf-last" name="lastName" label="Last Name" value={form.lastName} onChange={set('lastName')} error={errors.lastName} />
          </div>
          <FormField id="pf-email" label="Email" value={user.email} disabled hint={user.provider === 'google' ? 'Signed in with Google' : 'Email cannot be changed in this demo'} />
          <FormField id="pf-phone" name="phone" label="Phone" type="tel" value={form.phone} onChange={set('phone')} error={errors.phone} placeholder="+91 98765 43210" />
          <div className="co-btns">
            <button type="submit" className="btn-gold">
              Save Changes
            </button>
            <Link to="/account/password" className="btn-outline">
              Change Password
            </Link>
          </div>
        </form>
      </div>
    </>
  );
}
