import { Link } from 'react-router-dom';
import { FiLink, FiGrid, FiShare2, FiArrowRight, FiCheckCircle, FiMail, FiMessageSquare } from 'react-icons/fi';

const features = [
  { icon: <FiGrid size={24} />, title: 'Add your work', text: 'Showcase your profile, education, experience, projects, and skills all from one intuitive dashboard.' },
  { icon: <FiLink size={24} />, title: 'Get your unique link', text: 'Every account gets a permanent, professional portfolio URL: yoursite.com/u/yourname.' },
  { icon: <FiShare2 size={24} />, title: 'Share it anywhere', text: 'Copy the link or hand out your scannable QR code on a resume, badge, or business card.' },
  { icon: <FiCheckCircle size={24} />, title: 'Professional Templates', text: 'Stand out with beautiful, recruiter-approved layouts designed to highlight your best work.' },
];

const Landing = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* --- Header Section --- */}
      <header className="border-b border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          
          {/* Ultra-Premium Brand Logo */}
          <Link to="/" className="flex items-center gap-2 group tracking-tight">
            <span className="text-md font-medium text-gray-900 dark:text-white transition-colors duration-300 group-hover:text-primary-600 dark:group-hover:text-primary-400">
              PORTFOLIO
            </span>
            <span className="h-3 w-[1px] bg-gray-300 dark:bg-gray-700 block rotate-12 transition-transform duration-300 group-hover:rotate-0"></span>
            <span className="text-md font-serif italic font-semibold text-primary-600 dark:text-primary-400 tracking-wide">
              publisher
            </span>
          </Link>

          {/* Navigation Controls */}
          <div className="flex items-center gap-4">
            <Link to="/admin/login" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">Sign in</Link>
            <Link to="/admin/signup" className="btn-primary text-sm px-5 py-2">Get Started</Link>
          </div>
        </div>
      </header>

      {/* --- Main Content Section --- */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 pt-24 pb-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <h1 className="text-4xl sm:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight tracking-tight">
              One link. One QR code.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-indigo-600 dark:from-primary-400 dark:to-indigo-400">
                Your whole portfolio.
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 mt-6 max-w-2xl mx-auto leading-relaxed">
              Build your impressive portfolio in minutes. Get a personal URL and scannable QR code to share on your resume, LinkedIn, or business card.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 mt-10">
              <Link to="/admin/signup" className="btn-primary px-8 py-4 text-base shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 transition-all">
                Create your portfolio <FiArrowRight size={18} />
              </Link>
              <Link to="/admin/login" className="px-8 py-4 text-base font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">
                Sign in
              </Link>
            </div>
          </div>
        </section>

        {/* Dashboard Preview Section (Example Images) */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 -mt-8 relative z-10">
          <div className="rounded-2xl p-2 bg-white/50 dark:bg-gray-800/50 backdrop-blur border border-gray-200/50 dark:border-gray-700/50 shadow-2xl">
            <div className="rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-900 aspect-[16/9] relative border border-gray-200 dark:border-gray-700">
              <img 
                src="/portfolio_mockup.png" 
                alt="Portfolio Dashboard Preview" 
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 to-transparent pointer-events-none"></div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-white dark:bg-gray-900">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">Everything you need to stand out</h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">Our platform gives you the tools to create a stunning portfolio that captures attention and lands you opportunities.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((f, i) => (
                <div key={i} className="p-6 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center text-primary-600 dark:text-primary-400 mb-6">
                    {f.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{f.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{f.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact/CTA Section */}
        <section className="py-20 bg-indigo-50 dark:bg-gray-800/30 border-y border-indigo-100 dark:border-gray-800">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-12 bg-white dark:bg-gray-900 rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100 dark:border-gray-800">
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Have questions? We're here to help.</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md">
                  Whether you're curious about features, pricing, or need technical support, our team is ready to answer all your questions.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-gray-700 dark:text-gray-300">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                      <FiMail size={18} />
                    </div>
                    <a href="mailto:portfoliopublisher@gmail.com" className="font-medium hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">portfoliopublisher@gmail.com</a>
                  </div>
                  <div className="flex items-center gap-4 text-gray-700 dark:text-gray-300">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                      <FiMessageSquare size={18} />
                    </div>
                    <span className="font-medium flex items-center gap-2">Live Chat Support <span className="text-xs bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider">Premium</span></span>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-auto">
                <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-2xl border border-gray-100 dark:border-gray-700">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Get Started Today</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">Join thousands of professionals showcasing their work on our platform.</p>
                  <Link to="/admin/signup" className="btn-primary w-full justify-center py-3 text-base">
                    Create Free Account
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* --- Premium Footer Section --- */}
      <footer className="py-8 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500 dark:text-gray-400">
          <p>© {new Date().getFullYear()} PORTFOLIO publisher. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="flex items-center gap-1.5 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Terms <span className="text-[10px] bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 px-1.5 py-0.5 rounded uppercase font-bold">Premium</span></a>
            <a href="#" className="flex items-center gap-1.5 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Privacy <span className="text-[10px] bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 px-1.5 py-0.5 rounded uppercase font-bold">Premium</span></a>
            <a href="mailto:portfoliopublisher@gmail.com" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;