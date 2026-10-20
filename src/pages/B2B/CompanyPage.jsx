import { useState } from 'react';
import FormField from '../../components/common/FormField';
import { useAuth } from '../../hooks/useAuth';
import { useUI } from '../../hooks/useUI';
import { formatDate } from '../../utils/format';
import { hasErrors, validatePhone, validateRequired } from '../../utils/validate';

export default function CompanyPage() {
  const { user, updateUser } = useAuth();
  const { showToast } = useUI();
  const [form, setForm] = useState({ firstName: user.firstName, lastName: user.lastName, phone: user.phone || '' });
  const [errors, setErrors] = useState({});

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

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
    showToast('Contact details updated');
  };

  return (
    <>
      <div className="side-card" data-reveal="up">
        <h3 className="cs-title">Company</h3>
        <div className="cs-rows">
          <div className="cs-row">
            <span>Business name</span>
            <span>{user.company?.name}</span>
          </div>
          <div className="cs-row">
            <span>Business type</span>
            <span>{user.company?.type}</span>
          </div>
          <div className="cs-row">
            <span>GST / Tax ID</span>
            <span>{user.company?.gst || '-'}</span>
          </div>
          <div className="cs-row">
            <span>Payment terms</span>
            <span>{user.creditTermsDays} days</span>
          </div>
          <div className="cs-row">
            <span>Account since</span>
            <span>{user.createdAt ? formatDate(user.createdAt) : '-'}</span>
          </div>
        </div>
        <p className="muted">Company details are managed by our team. Contact us to change them.</p>
      </div>

      <div className="side-card" data-reveal="up">
        <h3 className="cs-title">Primary contact</h3>
        <form className="co-form" onSubmit={handleSubmit} noValidate>
          <div className="form-r2">
            <FormField id="bc-first" label="First Name" value={form.firstName} onChange={set('firstName')} error={errors.firstName} />
            <FormField id="bc-last" label="Last Name" value={form.lastName} onChange={set('lastName')} error={errors.lastName} />
          </div>
          <FormField id="bc-email" label="Email" value={user.email} disabled hint="Your login email is set by our team" />
          <FormField id="bc-phone" label="Phone" type="tel" value={form.phone} onChange={set('phone')} error={errors.phone} />
          <button type="submit" className="btn-gold">
            Save Changes
          </button>
        </form>
      </div>
    </>
  );
}
