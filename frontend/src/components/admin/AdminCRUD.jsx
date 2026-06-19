import { useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';
import Spinner from '../common/Spinner';

/**
 * Generic admin CRUD table/form component.
 * Props:
 *   title, items, fields, api, onRefresh
 */
const AdminCRUD = ({ title, items = [], fields = [], api, onRefresh, itemLabel = 'item' }) => {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);

  const resetForm = () => { setForm({}); setEditing(null); setShowForm(false); };

  const openAdd = () => {
    const init = {};
    fields.forEach(f => init[f.name] = f.defaultValue ?? '');
    setForm(init); setEditing(null); setShowForm(true);
  };

  const openEdit = (item) => {
    const f = {};
    fields.forEach(field => f[field.name] = item[field.name] ?? '');
    setForm(f); setEditing(item); setShowForm(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Check required
      const missing = fields.filter(f => f.required && !form[f.name]);
      if (missing.length) { toast.error(`${missing[0].label} is required`); return; }

      // Handle file fields
      const hasFile = fields.some(f => f.type === 'file');
      let payload;
      if (hasFile) {
        payload = new FormData();
        Object.entries(form).forEach(([k, v]) => v && payload.append(k, v));
      } else {
        // Handle array fields (comma-separated)
        payload = {};
        fields.forEach(f => {
          if (f.type === 'array') payload[f.name] = form[f.name] ? form[f.name].split(',').map(s => s.trim()).filter(Boolean) : [];
          else payload[f.name] = form[f.name];
        });
      }

      if (editing) {
        await api.update(editing._id, payload);
        toast.success(`${itemLabel} updated!`);
      } else {
        await api.create(payload);
        toast.success(`${itemLabel} added!`);
      }
      resetForm(); onRefresh();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(`Delete this ${itemLabel}?`)) return;
    setDeleting(id);
    try {
      await api.delete(id);
      toast.success(`${itemLabel} deleted`);
      onRefresh();
    } catch { toast.error('Error deleting'); }
    finally { setDeleting(null); }
  };

  const displayValue = (item, field) => {
    const val = item[field.name];
    if (!val) return <span className="text-gray-400">—</span>;
    if (Array.isArray(val)) return <span className="text-xs">{val.join(', ')}</span>;
    if (field.type === 'range') return `${val}%`;
    if (typeof val === 'string' && val.length > 50) return val.substring(0, 50) + '…';
    return val;
  };

  // Columns shown in table (first 3 non-hidden fields)
  const tableCols = fields.filter(f => !f.hidden).slice(0, 3);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h2>
        <button onClick={openAdd} className="btn-primary text-sm px-4 py-2">
          <FiPlus size={16} /> Add {itemLabel}
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {editing ? `Edit ${itemLabel}` : `Add ${itemLabel}`}
              </h3>
              <button onClick={resetForm} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500">
                <FiX size={18} />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-5 space-y-4">
              {fields.map(field => (
                <div key={field.name}>
                  <label className="label">{field.label}{field.required && <span className="text-red-500 ml-1">*</span>}</label>
                  {field.type === 'textarea' ? (
                    <textarea value={form[field.name] || ''} onChange={e => setForm({...form,[field.name]:e.target.value})}
                      className="input min-h-[100px] resize-y" placeholder={field.placeholder} rows={3} />
                  ) : field.type === 'range' ? (
                    <div className="space-y-1">
                      <input type="range" min="0" max="100" value={form[field.name] || 0}
                        onChange={e => setForm({...form,[field.name]:e.target.value})} className="w-full" />
                      <span className="text-sm text-gray-500">{form[field.name] || 0}%</span>
                    </div>
                  ) : field.type === 'file' ? (
                    <input type="file" accept={field.accept || 'image/*'}
                      onChange={e => setForm({...form,[field.name]:e.target.files[0]})}
                      className="input py-2 text-sm" />
                  ) : (
                    <input type={field.type || 'text'} value={form[field.name] || ''}
                      onChange={e => setForm({...form,[field.name]:e.target.value})}
                      className="input" placeholder={field.placeholder} />
                  )}
                  {field.help && <p className="text-xs text-gray-500 mt-1">{field.help}</p>}
                </div>
              ))}
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="btn-primary flex-1 justify-center disabled:opacity-60">
                  {saving ? <Spinner size="sm" /> : <><FiCheck size={16} /> {editing ? 'Update' : 'Save'}</>}
                </button>
                <button type="button" onClick={resetForm} className="btn-secondary">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* List */}
      {items.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">No {title.toLowerCase()} yet. Add your first one!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map(item => (
            <div key={item._id} className="card flex items-start gap-4 group">
              <div className="flex-1 min-w-0">
                {tableCols.map(col => (
                  <div key={col.name} className={col === tableCols[0] ? 'font-semibold text-gray-900 dark:text-white mb-1' : 'text-sm text-gray-500 dark:text-gray-400'}>
                    {displayValue(item, col)}
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openEdit(item)}
                  className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors">
                  <FiEdit2 size={15} />
                </button>
                <button onClick={() => handleDelete(item._id)} disabled={deleting === item._id}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50">
                  {deleting === item._id ? <Spinner size="sm" /> : <FiTrash2 size={15} />}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminCRUD;
