import { Suspense, lazy, useMemo } from 'react';
import { useBackground } from '../../context/BackgroundContext';
import { useTheme } from '../../context/ThemeContext';

const ThreeScene = lazy(() => import('./ThreeScene'));

// Reads the active theme's primary colour (CSS var) → hex, so the 3D
// scene recolours when the user switches themes.
function themeColor() {
  if (typeof window === 'undefined') return '#10a37f';
  const v = getComputedStyle(document.documentElement).getPropertyValue('--c-primary-500').trim();
  const parts = v.split(/\s+/).map(Number);
  if (parts.length === 3 && parts.every((n) => !Number.isNaN(n)))
    return '#' + parts.map((n) => n.toString(16).padStart(2, '0')).join('');
  return '#10a37f';
}

// Heuristic: skip WebGL on weak devices / reduced-motion preference.
function isLowEnd() {
  if (typeof window === 'undefined') return true;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return true;
  if ((navigator.hardwareConcurrency || 8) <= 2) return true;
  if (navigator.deviceMemory && navigator.deviceMemory <= 2) return true;
  return false;
}

const SceneBackground = () => {
  const { bg } = useBackground();
  const { theme, mode } = useTheme();
  const color = useMemo(() => themeColor(), [theme, mode]);
  const showThree = bg !== 'off' && !isLowEnd();

  return (
    <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* CSS gradient base — also the full fallback on low-end devices */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-primary-100
        dark:from-gray-950 dark:via-gray-900 dark:to-gray-950" />
      {showThree && (
        <div className="absolute inset-0 opacity-60 dark:opacity-70">
          <Suspense fallback={null}>
            <ThreeScene variant={bg} color={color} />
          </Suspense>
        </div>
      )}
    </div>
  );
};

export default SceneBackground;
