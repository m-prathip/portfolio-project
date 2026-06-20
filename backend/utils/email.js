const nodemailer = require('nodemailer');
const FROM = process.env.EMAIL_FROM || 'Portfolio Publisher <no-reply@yourapp.com>';
const BRAND = (FROM.match(/^"?([^"<]+?)"?\s*</) || [, 'Portfolio Publisher'])[1].trim();
const FRONTEND_URL = (process.env.FRONTEND_URL || 'https://portfolio-project-prathip.vercel.app').split(',')[0].replace(/\/$/, '');
const hasSmtp =
  process.env.SMTP_HOST &&
  process.env.SMTP_USER &&
  process.env.SMTP_PASS;

let transporter = null;

if (hasSmtp) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,

    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    },

    tls: {
      rejectUnauthorized: false
    },

    connectionTimeout: 60000,
    greetingTimeout: 60000,
    socketTimeout: 60000
  });

  transporter.verify((err) => {
    if (err) {
      console.error('❌ SMTP VERIFY FAILED:', err);
    } else {
      console.log('✅ SMTP READY');
    }
  });
}

/**
 * Sends an email. With no SMTP configured it logs to the console (dev
 * fallback) so the whole flow stays testable without a mail server.
 */
async function sendMail({ to, subject, html, text }) {
  try {
    if (!transporter) {
      console.log('\n──────── 📧 EMAIL (dev fallback) ────────');
      console.log(`To: ${to}`);
      console.log(`Subject: ${subject}`);
      if (text) console.log(text);
      console.log('─────────────────────────────────────────\n');
      return { dev: true };
    }

    const info = await transporter.sendMail({
      from: FROM,
      to,
      subject,
      html,
      text
    });

    console.log('✅ Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('❌ EMAIL SEND ERROR:', error);
    throw error;
  }
}

// ── Premium, responsive, dark-mode-aware email shell ───────────────────
const layout = ({ title, preheader = '', intro = '', bodyHtml = '', cta }) => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light dark">
<meta name="supported-color-schemes" content="light dark">
<title>${title}</title>
<style>
  :root { color-scheme: light dark; }
  body { margin:0; padding:0; background:#f3f4f6; -webkit-font-smoothing:antialiased; }
  .wrap { width:100%; background:#f3f4f6; padding:32px 12px; }
  .card { max-width:480px; margin:0 auto; background:#ffffff; border-radius:20px; overflow:hidden;
          box-shadow:0 10px 40px rgba(0,0,0,.08); font-family:'Segoe UI',Inter,Arial,sans-serif; }
  .header { padding:28px 32px; background:linear-gradient(135deg,#10a37f,#0d9488); }
  .brand { color:#fff; font-size:18px; font-weight:800; letter-spacing:.3px; margin:0; }
  .body { padding:32px; color:#111827; }
  h1 { font-size:22px; margin:0 0 12px; color:#111827; }
  p { font-size:15px; line-height:1.6; color:#4b5563; margin:0 0 16px; }
  .code { font-size:34px; font-weight:800; letter-spacing:10px; text-align:center; color:#0d9488;
          background:#f0fdfa; border:1px dashed #5eead4; border-radius:14px; padding:18px 0; margin:8px 0 18px; }
  .btn { display:inline-block; background:#10a37f; color:#fff !important; text-decoration:none;
         font-weight:600; font-size:15px; padding:13px 26px; border-radius:12px; }
  .meta { background:#f9fafb; border-radius:12px; padding:14px 18px; font-size:14px; color:#374151; }
  .meta b { color:#111827; }
  .footer { padding:20px 32px 28px; color:#9ca3af; font-size:12px; text-align:center; }
  .preheader { display:none!important; visibility:hidden; opacity:0; height:0; width:0; overflow:hidden; }
  @media (prefers-color-scheme: dark) {
    body,.wrap { background:#0b0f19 !important; }
    .card { background:#111827 !important; box-shadow:0 10px 40px rgba(0,0,0,.5) !important; }
    .body { color:#e5e7eb !important; }
    h1 { color:#f9fafb !important; }
    p { color:#9ca3af !important; }
    .code { background:#0f1f1c !important; border-color:#134e4a !important; color:#5eead4 !important; }
    .meta { background:#0b0f19 !important; color:#cbd5e1 !important; }
    .meta b { color:#fff !important; }
  }
</style>
</head>
<body>
  <span class="preheader">${preheader}</span>
  <div class="wrap">
    <div class="card">
      <div class="header"><p class="brand">${BRAND}</p></div>
      <div class="body">
        <h1>${title}</h1>
        ${intro ? `<p>${intro}</p>` : ''}
        ${bodyHtml}
        ${cta ? `<p style="text-align:center;margin:24px 0 4px"><a class="btn" href="${cta.href}">${cta.label}</a></p>` : ''}
      </div>
      <div class="footer">
        You're receiving this because someone used this email on ${BRAND}.<br>
        If this wasn't you, you can safely ignore it.
      </div>
    </div>
  </div>
</body>
</html>`;

const emails = {
  verifyOtp: (code) => ({
    subject: `${code} is your ${BRAND} verification code`,
    text: `Your verification code is ${code}. It expires in 5 minutes.`,
    html: layout({
      title: 'Verify your email',
      preheader: `Your code is ${code}`,
      intro: 'Use the code below to activate your account. It expires in 5 minutes.',
      bodyHtml: `<div class="code">${code}</div><p style="font-size:13px">Never share this code with anyone.</p>`
    })
  }),
  resetOtp: (code) => ({
    subject: `${code} is your ${BRAND} password reset code`,
    text: `Your password reset code is ${code}. It expires in 5 minutes.`,
    html: layout({
      title: 'Reset your password',
      preheader: `Your reset code is ${code}`,
      intro: 'Use this code to reset your password. It expires in 5 minutes (max 5 attempts).',
      bodyHtml: `<div class="code">${code}</div><p style="font-size:13px">If you didn't request this, no action is needed.</p>`
    })
  }),
  welcome: (name) => ({
    subject: `Welcome to ${BRAND} 🎉`,
    text: `Welcome${name ? ', ' + name : ''}! Your account is now active.`,
    html: layout({
      title: `Welcome${name ? ', ' + name : ''} 🎉`,
      preheader: 'Your account is verified and ready.',
      intro: 'Your email is verified and your account is active. You can now sign in and start building your portfolio.',
      cta: { href: `${FRONTEND_URL}/admin/login`, label: 'Go to your dashboard' }
    })
  }),
  loginAlert: (device, ip, when) => ({
    subject: `New sign-in to your ${BRAND} account`,
    text: `New sign-in from ${device} (${ip}) at ${when}.`,
    html: layout({
      title: 'New sign-in detected',
      preheader: `New sign-in from ${device}`,
      intro: 'We noticed a sign-in from a new device:',
      bodyHtml: `<div class="meta"><b>Device:</b> ${device}<br><b>IP:</b> ${ip}<br><b>Time:</b> ${when}</div>
                 <p style="margin-top:16px">If this was you, you can ignore this email. If not, reset your password right away.</p>`
    })
  }),
  passwordChanged: () => ({
    subject: `Your ${BRAND} password was changed`,
    text: 'Your account password was just changed.',
    html: layout({
      title: 'Password changed',
      preheader: 'Your password was just changed.',
      intro: 'Your account password was just changed and all other active sessions were signed out.',
      bodyHtml: `<p style="font-size:13px">If you didn't do this, reset your password and contact support immediately.</p>`
    })
  }),
  contactNotification: (owner, { name, email, message }) => ({
    subject: `📬 New message from ${name} via your portfolio`,
    text: `${name} (${email}) wrote: ${message}`,
    html: layout({
      title: 'New contact message',
      preheader: `${name}: ${message.slice(0, 60)}`,
      intro: `Someone reached out through your portfolio${owner ? `, ${owner}` : ''}:`,
      bodyHtml: `<div class="meta"><b>Name:</b> ${name}<br><b>Email:</b> ${email}<br><br>${String(message).replace(/</g, '&lt;')}</div>`,
      cta: { href: `mailto:${email}`, label: `Reply to ${name}` }
    })
  })
};

module.exports = { sendMail, emails, BRAND };
