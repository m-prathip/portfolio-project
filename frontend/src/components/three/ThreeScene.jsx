import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// ── Interactive particle field (drifts + subtle mouse parallax) ──
function Particles({ color, count = 1400 }) {
  const ref = useRef();
  const positions = useMemo(() => {
    const a = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) a[i] = (Math.random() - 0.5) * 12;
    return a;
  }, [count]);
  const { mouse } = useThree();
  useFrame((s, dt) => {
    if (!ref.current) return;
    ref.current.rotation.y += dt * 0.04;
    ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, mouse.y * 0.2, 0.05);
    ref.current.rotation.z = THREE.MathUtils.lerp(ref.current.rotation.z, mouse.x * 0.2, 0.05);
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.035} color={color} transparent opacity={0.8} sizeAttenuation depthWrite={false} />
    </points>
  );
}

// ── Neural network: nodes + edges between nearby nodes ──
function Neural({ color, count = 320 }) {
  const group = useRef();
  const { nodes, lines } = useMemo(() => {
    const n = new Float32Array(count * 3);
    const pts = [];
    for (let i = 0; i < count; i++) {
      const v = [(Math.random() - 0.5) * 10, (Math.random() - 0.5) * 6, (Math.random() - 0.5) * 6];
      pts.push(v); n.set(v, i * 3);
    }
    const seg = [];
    for (let i = 0; i < count; i++)
      for (let j = i + 1; j < count; j++) {
        const a = pts[i], b = pts[j];
        const d = Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
        if (d < 1.1) { seg.push(...a, ...b); }
      }
    return { nodes: n, lines: new Float32Array(seg) };
  }, [count]);
  useFrame((s, dt) => { if (group.current) group.current.rotation.y += dt * 0.05; });
  return (
    <group ref={group}>
      <points>
        <bufferGeometry><bufferAttribute attach="attributes-position" count={count} array={nodes} itemSize={3} /></bufferGeometry>
        <pointsMaterial size={0.07} color={color} transparent opacity={0.9} depthWrite={false} />
      </points>
      <lineSegments>
        <bufferGeometry><bufferAttribute attach="attributes-position" count={lines.length / 3} array={lines} itemSize={3} /></bufferGeometry>
        <lineBasicMaterial color={color} transparent opacity={0.18} />
      </lineSegments>
    </group>
  );
}

// ── Galaxy: spiral particle disc ──
function Galaxy({ color, count = 4000 }) {
  const ref = useRef();
  const positions = useMemo(() => {
    const a = new Float32Array(count * 3);
    const arms = 4;
    for (let i = 0; i < count; i++) {
      const r = Math.pow(Math.random(), 0.6) * 6;
      const arm = (i % arms) / arms * Math.PI * 2;
      const ang = arm + r * 0.6 + (Math.random() - 0.5) * 0.4;
      a[i * 3] = Math.cos(ang) * r;
      a[i * 3 + 1] = (Math.random() - 0.5) * (0.6 - r * 0.07);
      a[i * 3 + 2] = Math.sin(ang) * r;
    }
    return a;
  }, [count]);
  useFrame((s, dt) => { if (ref.current) ref.current.rotation.y += dt * 0.08; });
  return (
    <points ref={ref} rotation={[0.5, 0, 0]}>
      <bufferGeometry><bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} /></bufferGeometry>
      <pointsMaterial size={0.03} color={color} transparent opacity={0.85} sizeAttenuation depthWrite={false} />
    </points>
  );
}

// ── Cyber grid: receding wireframe floor ──
function Grid({ color }) {
  const ref = useRef();
  useFrame((s, dt) => { if (ref.current) { ref.current.position.z = (ref.current.position.z + dt * 1.2) % 2; } });
  return (
    <group rotation={[-Math.PI / 2.2, 0, 0]} position={[0, -1.5, 0]}>
      <gridHelper ref={ref} args={[40, 60, color, color]} />
    </group>
  );
}

// ── Floating spheres ──
function Spheres({ color }) {
  const items = useMemo(
    () => Array.from({ length: 14 }, () => ({
      p: [(Math.random() - 0.5) * 9, (Math.random() - 0.5) * 5, (Math.random() - 0.5) * 4],
      s: 0.15 + Math.random() * 0.4, o: Math.random() * Math.PI * 2
    })), []);
  const group = useRef();
  useFrame((s) => {
    if (!group.current) return;
    group.current.children.forEach((m, i) => { m.position.y = items[i].p[1] + Math.sin(s.clock.elapsedTime + items[i].o) * 0.5; });
    group.current.rotation.y = s.clock.elapsedTime * 0.05;
  });
  return (
    <group>
      <group ref={group}>
        {items.map((it, i) => (
          <mesh key={i} position={it.p}>
            <sphereGeometry args={[it.s, 24, 24]} />
            <meshStandardMaterial color={color} transparent opacity={0.55} roughness={0.3} metalness={0.4} />
          </mesh>
        ))}
      </group>
      <ambientLight intensity={0.6} />
      <pointLight position={[5, 5, 5]} intensity={30} color={color} />
    </group>
  );
}

// ── Abstract waves: displaced plane ──
function Waves({ color }) {
  const geo = useRef();
  const seg = 64;
  useFrame((s) => {
    const g = geo.current; if (!g) return;
    const t = s.clock.elapsedTime;
    const pos = g.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i), y = pos.getY(i);
      pos.setZ(i, Math.sin(x * 0.6 + t) * 0.4 + Math.cos(y * 0.6 + t) * 0.4);
    }
    pos.needsUpdate = true;
  });
  return (
    <mesh rotation={[-Math.PI / 2.3, 0, 0]} position={[0, -1, 0]}>
      <planeGeometry ref={geo} args={[16, 16, seg, seg]} />
      <meshBasicMaterial color={color} wireframe transparent opacity={0.35} />
    </mesh>
  );
}

// ── Polygons: Premium floating low-poly geometry ──
function Polygons({ color }) {
  const items = useMemo(
    () => Array.from({ length: 8 }, () => ({
      p: [(Math.random() - 0.5) * 12, (Math.random() - 0.5) * 8, (Math.random() - 0.5) * 6],
      s: 0.8 + Math.random() * 1.5,
      rx: Math.random() * Math.PI, ry: Math.random() * Math.PI,
      rs: (Math.random() - 0.5) * 0.4
    })), []);
  const group = useRef();
  useFrame((s) => {
    if (!group.current) return;
    group.current.children.forEach((m, i) => {
      m.rotation.x += items[i].rs * 0.02;
      m.rotation.y += items[i].rs * 0.03;
      m.position.y = items[i].p[1] + Math.sin(s.clock.elapsedTime * 0.5 + i) * 0.4;
    });
    group.current.rotation.y = s.clock.elapsedTime * 0.02;
  });
  return (
    <group>
      <group ref={group}>
        {items.map((it, i) => (
          <mesh key={i} position={it.p} rotation={[it.rx, it.ry, 0]}>
            <icosahedronGeometry args={[it.s, 0]} />
            <meshStandardMaterial color={color} transparent opacity={0.4} flatShading roughness={0.1} metalness={0.6} />
          </mesh>
        ))}
      </group>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} color={color} />
      <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#ffffff" />
    </group>
  );
}

// ── Cubes: Premium wireframe tumbling cubes ──
function Cubes({ color }) {
  const count = 40;
  const group = useRef();
  const items = useMemo(() => Array.from({ length: count }, () => ({
    p: [(Math.random() - 0.5) * 15, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10],
    s: 0.3 + Math.random() * 0.6,
    r: [Math.random() * Math.PI, Math.random() * Math.PI, 0],
    rs: [(Math.random() - 0.5) * 0.02, (Math.random() - 0.5) * 0.02, 0]
  })), [count]);
  
  useFrame((s) => {
    if (!group.current) return;
    group.current.children.forEach((m, i) => {
      m.rotation.x += items[i].rs[0];
      m.rotation.y += items[i].rs[1];
    });
    group.current.rotation.y = s.clock.elapsedTime * 0.03;
    group.current.rotation.x = Math.sin(s.clock.elapsedTime * 0.1) * 0.2;
  });
  
  return (
    <group ref={group}>
      {items.map((it, i) => (
        <mesh key={i} position={it.p} rotation={it.r}>
          <boxGeometry args={[it.s, it.s, it.s]} />
          <meshBasicMaterial color={color} wireframe transparent opacity={0.4} />
        </mesh>
      ))}
    </group>
  );
}

// ── Aurora: Flowing colourful light ribbons ──
function Aurora({ color }) {
  const geo = useRef();
  const seg = 128;
  useFrame((s) => {
    const g = geo.current; if (!g) return;
    const t = s.clock.elapsedTime * 0.5;
    const pos = g.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i), y = pos.getY(i);
      const z = Math.sin(x * 0.8 + t) * Math.cos(y * 0.4 + t) * 1.5;
      pos.setZ(i, z);
    }
    g.computeVertexNormals();
    pos.needsUpdate = true;
  });
  return (
    <mesh rotation={[-Math.PI / 2.5, 0, 0]} position={[0, -2, -3]}>
      <planeGeometry ref={geo} args={[25, 15, seg, 64]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6} wireframe transparent opacity={0.15} side={THREE.DoubleSide} />
    </mesh>
  );
}

// ── Prism: Rotating crystalline structure ──
function Prism({ color }) {
  const group = useRef();
  const items = useMemo(
    () => Array.from({ length: 12 }, () => ({
      p: [(Math.random() - 0.5) * 8, (Math.random() - 0.5) * 8, (Math.random() - 0.5) * 8],
      s: 0.5 + Math.random() * 1.5,
      r: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI],
      rs: [(Math.random() - 0.5) * 0.05, (Math.random() - 0.5) * 0.05, (Math.random() - 0.5) * 0.05]
    })), []);
    
  useFrame((s) => {
    if (!group.current) return;
    group.current.children.forEach((m, i) => {
      m.rotation.x += items[i].rs[0];
      m.rotation.y += items[i].rs[1];
      m.rotation.z += items[i].rs[2];
    });
    group.current.rotation.y = Math.sin(s.clock.elapsedTime * 0.2) * 0.5;
    group.current.rotation.x = Math.cos(s.clock.elapsedTime * 0.15) * 0.3;
  });
  return (
    <group>
      <group ref={group}>
        {items.map((it, i) => (
          <mesh key={i} position={it.p} rotation={it.r}>
            <octahedronGeometry args={[it.s, 0]} />
            <meshPhysicalMaterial 
              color={color} 
              transparent 
              opacity={0.6} 
              roughness={0.1} 
              metalness={0.8} 
              transmission={0.9} 
              ior={1.5} 
            />
          </mesh>
        ))}
      </group>
      <ambientLight intensity={1} />
      <pointLight position={[10, 10, 10]} intensity={50} color="#ffffff" />
      <pointLight position={[-10, -10, -10]} intensity={30} color={color} />
    </group>
  );
}

const SCENES = { particles: Particles, neural: Neural, galaxy: Galaxy, grid: Grid, spheres: Spheres, waves: Waves, polygons: Polygons, cubes: Cubes, aurora: Aurora, prism: Prism };

export default function ThreeScene({ variant = 'particles', color = '#10a37f' }) {
  const Scene = SCENES[variant] || Particles;
  const camZ = variant === 'grid' || variant === 'waves' ? 7 : 6;
  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, variant === 'grid' ? 2 : 0, camZ], fov: 60 }}
      style={{ position: 'absolute', inset: 0 }}
    >
      <Scene color={color} />
    </Canvas>
  );
}
