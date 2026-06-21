import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiFileText, FiExternalLink } from 'react-icons/fi';
import { certificatesAPI } from '../services/api';
import Section from '../components/common/Section';
import Seo from '../components/common/Seo';
import Tilt from '../components/common/Tilt';
import { PageLoader } from '../components/common/Spinner';

const Certificates = () => {
  const { profile, username } = useOutletContext();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    certificatesAPI.getPublic(username)
      .then((res) => setCertificates(res.data || []))
      .catch(() => setCertificates([]))
      .finally(() => setLoading(false));
  }, [username]);

  if (loading) return <PageLoader />;

  return (
    <div className="pt-16">
      <Seo
        title={`Certificates — ${profile?.name}`}
        description={`Professional credentials and certifications earned by ${profile?.name}.`}
        type="website"
      />
      <Section title="Certificates" subtitle="Professional credentials and certifications">
        {certificates.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No certificates available to display.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((cert, i) => (
              <motion.div key={cert._id}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.4, delay: (i % 3) * 0.08 }}>
                <Tilt className="h-full">
                  <div className="h-full flex flex-col rounded-2xl overflow-hidden bg-white/80 dark:bg-gray-800/70 backdrop-blur border border-white/50 dark:border-gray-700 shadow-sm hover:shadow-xl transition-shadow p-6">
                    <div className="mb-4">
                      <div className="h-12 w-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 mb-4">
                        <FiFileText size={24} />
                      </div>
                      <h3 className="font-bold text-gray-900 dark:text-white text-lg">{cert.name}</h3>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-1">{cert.issuer}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Issued: {cert.issueDate}</p>
                    </div>
                    {cert.credentialUrl && (
                      <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
                        <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
                          View Credential <FiExternalLink size={14} />
                        </a>
                      </div>
                    )}
                  </div>
                </Tilt>
              </motion.div>
            ))}
          </div>
        )}
      </Section>
    </div>
  );
};

export default Certificates;
