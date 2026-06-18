import { useEffect, useRef } from 'react';

const Section = ({ id, className = '', children, title, subtitle }) => {
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.1 }
    );
    const els = ref.current?.querySelectorAll('.animate-on-scroll');
    els?.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section id={id} ref={ref} className={`py-16 md:py-20 ${className}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {(title || subtitle) && (
          <div className="mb-12 animate-on-scroll">
            {title && <h2 className="section-title">{title}</h2>}
            {subtitle && <p className="section-subtitle">{subtitle}</p>}
            <div className="h-1 w-16 bg-primary-600 rounded-full mt-3" />
          </div>
        )}
        {children}
      </div>
    </section>
  );
};

export default Section;
