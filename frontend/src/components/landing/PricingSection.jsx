import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SectionWrapper from './SectionWrapper';
import GradientText from './GradientText';
import GlassCard from './GlassCard';
import MagneticButton from './MagneticButton';

const PLANS = [
  {
    name: 'Free',
    price: { monthly: 0, yearly: 0 },
    description: 'Perfect for getting started',
    features: [
      'One portfolio page',
      'Personal URL (yourname.portfoliopub.com)',
      'QR code generation',
      'Basic templates',
      '100 monthly views tracking',
    ],
    cta: 'Get Started Free',
    popular: false,
    gradient: 'from-gray-500/10 to-gray-600/10',
  },
  {
    name: 'Pro',
    price: { monthly: 12, yearly: 9 },
    description: 'For serious professionals',
    features: [
      'Unlimited portfolio sections',
      'Custom domain support',
      'All premium templates',
      'AI portfolio generator',
      'Advanced analytics dashboard',
      'Resume builder & PDF export',
      'Priority support',
    ],
    cta: 'Start Pro Trial',
    popular: true,
    gradient: 'from-violet-500/10 to-blue-500/10',
  },
  {
    name: 'Team',
    price: { monthly: 29, yearly: 24 },
    description: 'For teams & organizations',
    features: [
      'Everything in Pro',
      'Up to 50 team members',
      'Centralized team dashboard',
      'Custom branding & white-label',
      'Recruiter view analytics',
      'API access',
      'Dedicated account manager',
      'SSO & advanced security',
    ],
    cta: 'Contact Sales',
    popular: false,
    gradient: 'from-cyan-500/10 to-emerald-500/10',
  },
];

const PricingSection = () => {
  const [yearly, setYearly] = useState(false);

  return (
    <SectionWrapper id="pricing" variant="fadeUp" className="py-24 sm:py-32 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-violet-500/[0.03] rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-sm font-medium text-violet-400 tracking-wider uppercase mb-4"
          >
            Pricing
          </motion.p>
          <h2 className="text-3xl sm:text-5xl font-bold text-white leading-tight tracking-[-0.02em] mb-5">
            Simple, transparent{' '}
            <GradientText>pricing</GradientText>
          </h2>
          <p className="text-gray-400 text-lg leading-relaxed">
            Start free. Upgrade when you need more power.
          </p>
        </div>

        {/* Toggle */}
        <div className="flex items-center justify-center gap-4 mb-14">
          <span className={`text-sm font-medium ${!yearly ? 'text-white' : 'text-gray-500'}`}>Monthly</span>
          <button
            onClick={() => setYearly(!yearly)}
            className="relative w-14 h-7 rounded-full bg-white/[0.06] border border-white/[0.08] transition-colors duration-300"
          >
            <motion.div
              className="absolute top-0.5 w-6 h-6 rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 shadow-lg"
              animate={{ left: yearly ? '28px' : '2px' }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            />
          </button>
          <span className={`text-sm font-medium ${yearly ? 'text-white' : 'text-gray-500'}`}>
            Yearly
            <span className="ml-1.5 text-[10px] text-green-400 font-semibold px-1.5 py-0.5 rounded-full bg-green-500/10 border border-green-500/20">
              Save 25%
            </span>
          </span>
        </div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.5 }}
              className={plan.popular ? 'relative' : ''}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
                  <span className="px-3 py-1 rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 text-white text-[10px] font-semibold uppercase tracking-wider shadow-lg shadow-violet-500/25">
                    Most Popular
                  </span>
                </div>
              )}
              <GlassCard
                className={`p-6 sm:p-8 h-full flex flex-col ${
                  plan.popular ? 'landing-glass-card--highlight border-violet-500/20' : ''
                }`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${plan.gradient} rounded-2xl opacity-30`} />

                <div className="relative z-10 flex flex-col h-full">
                  <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
                  <p className="text-sm text-gray-500 mt-1 mb-5">{plan.description}</p>

                  {/* Price */}
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-4xl font-bold text-white">
                      ${yearly ? plan.price.yearly : plan.price.monthly}
                    </span>
                    {plan.price.monthly > 0 && (
                      <span className="text-sm text-gray-500">/month</span>
                    )}
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 mb-8 flex-1">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5 text-sm">
                        <svg className="w-4 h-4 text-violet-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-400">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <MagneticButton className="w-full">
                    <Link
                      to="/admin/signup"
                      className={`block w-full text-center py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                        plan.popular
                          ? 'landing-btn-primary'
                          : 'bg-white/[0.04] border border-white/[0.08] text-white hover:bg-white/[0.08]'
                      }`}
                    >
                      {plan.cta}
                    </Link>
                  </MagneticButton>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
};

export default PricingSection;
