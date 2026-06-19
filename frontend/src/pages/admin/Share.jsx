import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FiCopy, FiCheck, FiDownload, FiExternalLink, FiShare2 } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { portfolioAPI } from '../../services/api';

const AdminShare = () => {
  const { user } = useAuth();
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [qrError, setQrError] = useState(false);

  // Fetched from the backend (not built from window.location) so the link
  // shown here always matches exactly what's encoded in the QR code below —
  // both come from the same FRONTEND_URL the server is configured with.
  useEffect(() => {
    portfolioAPI.getMyLink()
      .then(res => setUrl(res.data.url))
      .catch(() => setUrl(user?.username ? `${window.location.origin}/u/${user.username}` : ''))
      .finally(() => setLoading(false));
  }, [user?.username]);

  const qrUrl = user?.username ? portfolioAPI.qrCodeUrl(user.username) : '';

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success('Link copied!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Could not copy — copy it manually instead');
    }
  };

  const downloadQR = async () => {
    setDownloading(true);
    try {
      const res = await fetch(qrUrl);
      if (!res.ok) throw new Error('Request failed');
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = `${user.username}-portfolio-qr.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(blobUrl);
    } catch {
      toast.error('Could not download — try opening the QR code directly instead');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
        <FiShare2 className="text-primary-600 dark:text-primary-400" size={20} /> Share Your Portfolio
      </h2>
      <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
        Anyone with this link or QR code can view your live portfolio — no login required.
      </p>

      <div className="card space-y-6">
        {/* Link */}
        <div>
          <p className="label mb-2">Your portfolio link</p>
          <div className="flex flex-col sm:flex-row gap-2">
            <input readOnly value={loading ? 'Loading…' : url} className="input flex-1 text-sm" onFocus={e => e.target.select()} />
            <button onClick={copyLink} disabled={loading} className="btn-secondary justify-center whitespace-nowrap disabled:opacity-60">
              {copied ? <FiCheck size={16} /> : <FiCopy size={16} />} {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          {!loading && (
            <a href={url} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-primary-600 dark:text-primary-400 hover:underline mt-3">
              <FiExternalLink size={14} /> Open my portfolio
            </a>
          )}
        </div>

        <div className="border-t border-gray-100 dark:border-gray-700" />

        {/* QR Code */}
        <div>
          <p className="label mb-3">QR code</p>
          <div className="flex flex-col sm:flex-row items-start gap-5">
            <div className="w-[184px] h-[184px] flex items-center justify-center p-3 bg-white rounded-xl border border-gray-200 dark:border-gray-700 flex-shrink-0">
              {qrUrl && !qrError && (
                <img
                  src={qrUrl}
                  alt="QR code linking to your portfolio"
                  width={160}
                  height={160}
                  onError={() => setQrError(true)}
                />
              )}
              {qrError && (
                <p className="text-xs text-gray-400 text-center px-2">
                  Couldn't load the QR code — make sure the API server is running
                </p>
              )}
            </div>
            <div className="flex-1 space-y-3">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Print it on a resume, business card, or slide — scanning it opens your portfolio directly.
              </p>
              <button onClick={downloadQR} disabled={downloading || qrError}
                className="btn-primary text-sm px-4 py-2 disabled:opacity-60 disabled:cursor-not-allowed">
                <FiDownload size={16} /> {downloading ? 'Downloading…' : 'Download QR Code'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminShare;
