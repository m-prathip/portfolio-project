import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import { activitiesAPI } from '../services/api';
import Section from '../components/common/Section';
import Seo from '../components/common/Seo';
import Tilt from '../components/common/Tilt';
import { PageLoader } from '../components/common/Spinner';

const Activities = () => {
  const { profile, username } = useOutletContext();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile?.collections?.activities) {
      setActivities(profile.collections.activities);
      setLoading(false);
    } else {
      activitiesAPI.getPublic(username)
        .then((res) => setActivities(res.data || []))
        .catch(() => setActivities([]))
        .finally(() => setLoading(false));
    }
  }, [profile, username]);

  if (loading) return <PageLoader />;

  return (
    <div className="pt-16">
      <Seo
        title={`Activities — ${profile?.name}`}
        description={`Extra-curricular activities and involvement of ${profile?.name}.`}
        type="website"
      />
      <Section title="Activities" subtitle="Beyond the code">
        {activities.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No activities available to display.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {activities.map((a, i) => (
              <motion.div key={a._id}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.4, delay: (i % 3) * 0.08 }}>
                <Tilt className="h-full">
                  <div className="h-full flex flex-col rounded-2xl overflow-hidden bg-white/80 dark:bg-gray-800/70 backdrop-blur border border-white/50 dark:border-gray-700 shadow-sm hover:shadow-xl transition-shadow p-6">
                    <h4 className="font-bold text-gray-900 dark:text-white text-lg mb-2">{a.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed flex-1">{a.description}</p>
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

export default Activities;
