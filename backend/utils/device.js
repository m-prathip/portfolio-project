// Tiny dependency-free user-agent parser — enough to recognise a device
// for "login from a new device" alerts. Not meant to be exhaustive.
const parseUserAgent = (ua = '') => {
  const s = ua || '';
  let os = 'Unknown OS';
  if (/windows/i.test(s)) os = 'Windows';
  else if (/iphone|ipad|ipod/i.test(s)) os = 'iOS';
  else if (/mac os x/i.test(s)) os = 'macOS';
  else if (/android/i.test(s)) os = 'Android';
  else if (/linux/i.test(s)) os = 'Linux';

  let browser = 'Unknown Browser';
  if (/edg\//i.test(s)) browser = 'Edge';
  else if (/chrome|crios/i.test(s)) browser = 'Chrome';
  else if (/firefox|fxios/i.test(s)) browser = 'Firefox';
  else if (/safari/i.test(s)) browser = 'Safari';

  const isMobile = /mobile|iphone|android/i.test(s);
  const device = `${browser} on ${os}${isMobile ? ' (mobile)' : ''}`;
  return { os, browser, device };
};

const getClientIp = (req) =>
  (req.headers['x-forwarded-for'] || '').split(',')[0].trim() ||
  req.ip ||
  req.socket?.remoteAddress ||
  'unknown';

module.exports = { parseUserAgent, getClientIp };
