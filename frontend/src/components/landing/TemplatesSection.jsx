import { useState } from 'react';
import { motion } from 'framer-motion';
import SectionWrapper from './SectionWrapper';
import GradientText from './GradientText';
import GlassCard from './GlassCard';
import TemplatePreviewModal from './TemplatePreviewModal';

const TEMPLATES = [
  {
    name: 'Minimal Pro',
    category: 'Minimal',
    gradient: 'from-slate-800 to-zinc-900',
    accent: '#7c3aed',
    sections: ['About', 'Experience', 'Projects'],
  },
  {
    name: 'Creative Flow',
    category: 'Creative',
    gradient: 'from-violet-900/40 to-indigo-900/40',
    accent: '#ec4899',
    sections: ['Hero', 'Gallery', 'Testimonials'],
  },
  {
    name: 'Corporate Edge',
    category: 'Professional',
    gradient: 'from-blue-900/40 to-cyan-900/40',
    accent: '#3b82f6',
    sections: ['Summary', 'Skills', 'Resume'],
  },
  {
    name: 'Dev Terminal',
    category: 'Developer',
    gradient: 'from-emerald-900/30 to-teal-900/30',
    accent: '#10b981',
    sections: ['Code', 'Projects', 'GitHub'],
  },
  {
    name: 'AI Scientist',
    category: 'Deep Tech & ML',
    gradient: 'from-cyan-950/40 to-indigo-950/40',
    accent: '#06b6d4',
    sections: ['Research', 'Neural Nets', 'Publications'],
  },
  {
    name: 'SaaS Founder',
    category: 'Startup Vision',
    gradient: 'from-orange-950/30 to-pink-950/30',
    accent: '#f97316',
    sections: ['Pitch Deck', 'ARR Metrics', 'Roadmap'],
  },
];

const TemplatesSection = () => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  return (
    <SectionWrapper id="templates" variant="fadeUp" className="py-24 sm:py-32 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-sm font-medium text-emerald-400 tracking-wider uppercase mb-4"
          >
            Template Gallery
          </motion.p>
          <h2 className="text-3xl sm:text-5xl font-bold text-white leading-tight tracking-[-0.02em] mb-5">
            Start with an{' '}
            <GradientText from="#10b981" via="#3b82f6" to="#7c3aed">AI-crafted template</GradientText>
          </h2>
          <p className="text-gray-400 text-lg leading-relaxed">
            Choose from professionally engineered themes designed for every tech discipline. Click any card to preview interactive skills and project showcases.
          </p>
        </div>

        {/* Templates grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {TEMPLATES.map((template, i) => (
            <motion.div
              key={template.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
            >
              <div onClick={() => setSelectedTemplate(template)}>
                <GlassCard className="p-0 overflow-hidden cursor-pointer group h-full border border-white/[0.08] hover:border-violet-500/40 transition-all duration-300">
                  {/* Template preview */}
                  <div className={`relative aspect-[4/3] bg-gradient-to-br ${template.gradient} p-5 overflow-hidden`}>
                    {/* Mockup content lines */}
                    <div className="space-y-3 mt-4">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-8 h-8 rounded-full shadow-md flex items-center justify-center text-white font-bold text-xs"
                          style={{ backgroundColor: template.accent }}
                        >
                          {template.name[0]}
                        </div>
                        <div className="space-y-1.5 flex-1">
                          <div className="h-2.5 bg-white/[0.15] rounded-full w-2/3" />
                          <div className="h-1.5 bg-white/[0.08] rounded-full w-1/3" />
                        </div>
                      </div>
                      <div className="h-[1px] bg-white/[0.08] my-3" />
                      <div className="grid grid-cols-3 gap-2">
                        {template.sections.map((s) => (
                          <div key={s} className="space-y-1 bg-white/[0.02] p-2 rounded border border-white/[0.04]">
                            <div className="text-[9px] uppercase tracking-wider text-gray-400 font-bold">{s}</div>
                            <div className="h-1.5 bg-white/[0.1] rounded-full w-full" />
                            <div className="h-1.5 bg-white/[0.05] rounded-full w-3/4" />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                      <span className="text-sm font-semibold text-white px-5 py-2.5 rounded-xl border border-white/30 bg-violet-600/80 shadow-lg shadow-violet-600/30">
                        Preview Interactive Theme
                      </span>
                    </div>
                  </div>

                  {/* Template info */}
                  <div className="p-5 bg-[#070b19] flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-violet-400 transition-colors">{template.name}</h3>
                      <p className="text-xs text-gray-400 mt-0.5">{template.category}</p>
                    </div>
                    <span className="text-xs text-violet-400 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                      Open View →
                    </span>
                  </div>
                </GlassCard>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Template Preview Modal */}
      <TemplatePreviewModal
        isOpen={!!selectedTemplate}
        onClose={() => setSelectedTemplate(null)}
        template={selectedTemplate}
      />
    </SectionWrapper>
  );
};

export default TemplatesSection;
