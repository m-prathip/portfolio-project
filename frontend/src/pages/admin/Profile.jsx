import React, { useState, useEffect } from 'react';
import { profileAPI, BASE_URL } from '../../services/api';
import toast from 'react-hot-toast';
import Spinner from '../../components/common/Spinner';

const Field = React.memo(({ label, children }) => (
  <div>
    <label className="label">{label}</label>
    {children}
  </div>
));

const AdminProfile = () => {
  console.log("AdminProfile Render");

  const [form, setForm] = useState({
    name: '',
    title: '',
    about: '',
    email: '',
    phone: '',
    location: '',
    domains: '',
    social: {
      linkedin: '',
      github: '',
      portfolio: '',
      twitter: '',
      instagram: ''
    }
  });

  const [files, setFiles] = useState({
    profileImage: null,
    resume: null
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [current, setCurrent] = useState(null);

  useEffect(() => {
  console.log("PROFILE API CALLED");

  profileAPI.getMine()
    .then(res => {
      const p = res.data;
      setCurrent(p);
      setForm({
        name: p.name || '',
        title: p.title || '',
        about: p.about || '',
        email: p.email || '',
        phone: p.phone || '',
        location: p.location || '',
        domains: p.domains?.join(', ') || '',
        social: {
          linkedin: p.social?.linkedin || '',
          github: p.social?.github || '',
          portfolio: p.social?.portfolio || '',
          twitter: p.social?.twitter || '',
          instagram: p.social?.instagram || ''
        }
      });
    })
    .catch(() => {})
    .finally(() => setLoading(false));
}, []);

  const handleChange = (e) => {
    console.log("Typing:", e.target.name, e.target.value);

    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSocialChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      social: {
        ...prev.social,
        [name]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);

    try {
      const fd = new FormData();

      Object.entries(form).forEach(([k, v]) => {
        if (k === 'social') {
          Object.entries(v).forEach(([sk, sv]) => {
            fd.append(`social[${sk}]`, sv);
          });
        } else if (k === 'domains') {
          const arr = v
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean);

          arr.forEach((d) => fd.append('domains[]', d));
        } else {
          fd.append(k, v);
        }
      });

      if (files.profileImage) {
        fd.append('profileImage', files.profileImage);
      }

      if (files.resume) {
        fd.append('resume', files.resume);
      }

      const res = await profileAPI.updateMine(fd);

      setCurrent(res.data);

      toast.success('Profile updated!');
    } catch (err) {
      toast.error(
        err.response?.data?.message || 'Error saving profile'
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
        Profile Settings
      </h2>

      {current?.profileImage && (
        <div className="mb-6 flex items-center gap-4">
          <img
            src={current.profileImage.startsWith('/uploads') ? `${BASE_URL}${current.profileImage}` : current.profileImage}
            alt="Profile"
            className="w-20 h-20 rounded-xl object-cover border-2 border-gray-200 dark:border-gray-700"
          />
          <p className="text-sm text-gray-500">
            Current profile photo
          </p>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-5 card"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Full Name *">
            <input
              name="name"
              className="input"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="John Doe"
            />
          </Field>

          <Field label="Professional Title *">
            <input
              name="title"
              className="input"
              value={form.title}
              onChange={handleChange}
              required
              placeholder="Full Stack Developer"
            />
          </Field>
        </div>

        <Field label="About Me *">
          <textarea
            name="about"
            className="input resize-y min-h-[120px]"
            value={form.about}
            onChange={handleChange}
            required
            placeholder="Tell us about yourself..."
            rows={4}
          />
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Field label="Email *">
            <input
              name="email"
              type="email"
              className="input"
              value={form.email}
              onChange={handleChange}
              required
            />
          </Field>

          <Field label="Phone">
            <input
              name="phone"
              className="input"
              value={form.phone}
              onChange={handleChange}
              placeholder="+1 234 567 8900"
            />
          </Field>

          <Field label="Location">
            <input
              name="location"
              className="input"
              value={form.location}
              onChange={handleChange}
              placeholder="New York, USA"
            />
          </Field>
        </div>

        <Field label="Interested Domains">
          <input
            name="domains"
            className="input"
            value={form.domains}
            onChange={handleChange}
            placeholder="Web Dev, ML, Cloud (comma-separated)"
          />
        </Field>

        <div>
          <p className="label mb-3">Social Links</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              'linkedin',
              'github',
              'portfolio',
              'twitter',
              'instagram'
            ].map((s) => (
              <div key={s}>
                <label className="text-xs text-gray-500 capitalize block mb-1">
                  {s}
                </label>

                <input
                  className="input text-sm"
                  name={s}
                  value={form.social[s]}
                  placeholder={`https://${s}.com/...`}
                  onChange={handleSocialChange}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Profile Photo">
            <input
              type="file"
              accept="image/*"
              className="input py-2 text-sm"
              onChange={(e) =>
                setFiles({
                  ...files,
                  profileImage: e.target.files[0]
                })
              }
            />
          </Field>

          <Field label="Resume (PDF)">
            <input
              type="file"
              accept=".pdf"
              className="input py-2 text-sm"
              onChange={(e) =>
                setFiles({
                  ...files,
                  resume: e.target.files[0]
                })
              }
            />
          </Field>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="btn-primary w-full justify-center py-3 disabled:opacity-60"
        >
          {saving ? (
            <>
              <Spinner size="sm" /> Saving...
            </>
          ) : (
            'Save Profile'
          )}
        </button>
      </form>
    </div>
  );
};

export default AdminProfile;
