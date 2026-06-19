import { useState, useEffect } from 'react';
import { analyticsAPI } from '../../services/api';
import Spinner from '../../components/common/Spinner';
import {
  FiEye, FiDownload, FiMail, FiUsers, FiSmartphone, FiActivity, FiDroplet
} from 'react-icons/fi';

const StatCard = ({ icon, label, value, sub }) => (
  <div className="card flex items-center gap-4">
    <div className="h-11 w-11 flex items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">{icon}</div>
    <div>
      <div className="text-2xl font-bold text-gray-900 dark:text-white">{value}</div>
      <div className="text-sm text-gray-500 dark:text-gray-400">{label}{sub != null && <span className="text-primary-600 dark:text-primary-400"> · {sub}</span>}</div>
    </div>
  </div>
);

const BarList = ({ title, icon, items, labelKey, max }) => (
  <div className="card">
    <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">{icon} {title}</h3>
    {items.length === 0 ? <p className="text-sm text-gray-400">No data yet.</p> : (
      <div className="space-y-2">
        {items.map((it, i) => (
          <div key={i}>
            <div className="flex justify-between text-sm mb-0.5">
              <span className="text-gray-700 dark:text-gray-300 truncate">{it[labelKey] || 'Unknown'}</span>
              <span className="text-gray-400">{it.count}</span>
            </div>
            <div className="h-1.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
              <div className="h-full bg-primary-500 rounded-full" style={{ width: `${Math.max(6, (it.count / (max || 1)) * 100)}%` }} />
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

const Analytics = () => {
  const [data, setData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    Promise.all([analyticsAPI.get(), analyticsAPI.messages()])
      .then(([a, m]) => { setData(a.data); setMessages(m.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const markRead = async (id) => {
    await analyticsAPI.markRead(id).catch(() => {});
    setMessages((ms) => ms.map((m) => (m._id === id ? { ...m, read: true } : m)));
  };

  if (loading) return <div className="py-20"><Spinner size="lg" /></div>;
  if (!data) return <p className="text-gray-500">Couldn't load analytics.</p>;

  const maxDay = Math.max(1, ...data.visits.timeline.map((d) => d.count));
  const maxDevice = Math.max(1, ...data.devices.map((d) => d.count));
  const maxRef = Math.max(1, ...data.referrers.map((r) => r.count));
  const maxTheme = Math.max(1, ...data.themes.map((t) => t.count));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">Visitor insights, messages and account activity.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<FiEye />} label="Total visits" value={data.visits.total} sub={`${data.visits.last7} this week`} />
        <StatCard icon={<FiDownload />} label="Resume downloads" value={data.resumeDownloads.total} sub={`${data.resumeDownloads.last7} this week`} />
        <StatCard icon={<FiMail />} label="Messages" value={data.messages.total} sub={`${data.messages.unread} unread`} />
        <StatCard icon={<FiUsers />} label="Themes tried" value={data.themes.reduce((s, t) => s + t.count, 0)} />
      </div>

      {/* 14-day visit timeline */}
      <div className="card">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><FiActivity /> Visits (last 14 days)</h3>
        <div className="flex items-end gap-1.5 h-32">
          {data.visits.timeline.map((d) => (
            <div key={d.date} className="flex-1 flex flex-col items-center justify-end group" title={`${d.date}: ${d.count}`}>
              <div className="w-full rounded-t bg-primary-500/80 group-hover:bg-primary-500 transition-colors"
                style={{ height: `${(d.count / maxDay) * 100}%`, minHeight: d.count ? '4px' : '0' }} />
              <span className="text-[9px] text-gray-400 mt-1">{d.date.slice(5)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <BarList title="Devices" icon={<FiSmartphone size={16} />} items={data.devices} labelKey="device" max={maxDevice} />
        <BarList title="Referrers" icon={<FiUsers size={16} />} items={data.referrers} labelKey="referrer" max={maxRef} />
        <BarList title="Theme usage" icon={<FiDroplet size={16} />} items={data.themes} labelKey="theme" max={maxTheme} />
      </div>

      {/* Contact messages */}
      <div className="card">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2"><FiMail /> Messages</h3>
        {messages.length === 0 ? <p className="text-sm text-gray-400">No messages yet.</p> : (
          <div className="space-y-3">
            {messages.map((m) => (
              <div key={m._id} className={`rounded-xl p-4 border ${m.read ? 'border-gray-100 dark:border-gray-700' : 'border-primary-300 dark:border-primary-700 bg-primary-50/50 dark:bg-primary-900/10'}`}>
                <div className="flex items-center justify-between gap-2">
                  <div className="text-sm">
                    <span className="font-semibold text-gray-900 dark:text-white">{m.name}</span>
                    <a href={`mailto:${m.email}`} className="text-primary-600 dark:text-primary-400 ml-2">{m.email}</a>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-gray-400">{new Date(m.createdAt).toLocaleDateString()}</span>
                    {!m.read && <button onClick={() => markRead(m._id)} className="text-xs text-primary-600 hover:underline">Mark read</button>}
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 whitespace-pre-wrap">{m.message}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Account activity (OTP / login logs) */}
      <div className="card">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2"><FiActivity /> Recent account activity</h3>
        {data.activity.length === 0 ? <p className="text-sm text-gray-400">No activity yet.</p> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="text-left text-gray-400 border-b border-gray-100 dark:border-gray-700">
                <th className="py-2 pr-4 font-medium">Event</th><th className="py-2 pr-4 font-medium">Device</th>
                <th className="py-2 pr-4 font-medium">IP</th><th className="py-2 font-medium">When</th>
              </tr></thead>
              <tbody>
                {data.activity.map((a) => (
                  <tr key={a._id} className="border-b border-gray-50 dark:border-gray-800">
                    <td className="py-2 pr-4">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        a.event.includes('failed') ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                        : a.event === 'new_device' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                        : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'}`}>{a.event}</span>
                    </td>
                    <td className="py-2 pr-4 text-gray-600 dark:text-gray-300">{a.device || '—'}</td>
                    <td className="py-2 pr-4 text-gray-500">{a.ip || '—'}</td>
                    <td className="py-2 text-gray-500">{new Date(a.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;
