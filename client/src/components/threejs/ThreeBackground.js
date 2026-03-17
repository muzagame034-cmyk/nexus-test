/**
 * ThreeBackground — Test mavzusidagi 3D fon
 *
 * Scroll bilan:
 *   - Sahnа айланади
 *   - Ob'yektlar harakat qiladi
 *   - Rang gradiyenti o'zgaradi
 *
 * Ob'yektlar:
 *   - Kitoblar (Box) — bilim
 *   - Savollar belgisi (?) — test
 *   - Qalam (Cylinder) — yozish
 *   - Diplom/medal (Torus) — yutuq
 *   - Atom (Sphere + Ring) — fan
 *   - DNA spiral (Tube) — biologiya
 *   - Formulalar (Text plane) — matematika
 *   - Particle field — fon
 *
 * Mobile: gyroscope parallax
 * Desktop: mouse parallax
 */

import React, { useRef, useMemo, Suspense, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial, Float, MeshDistortMaterial, Trail } from '@react-three/drei';
import * as THREE from 'three';

// ─────────────────────────────────────────────
// SCROLL TRACKER (global shared ref)
// ─────────────────────────────────────────────
const scrollRef = { current: 0, target: 0 };

function useScrollTracker() {
  useEffect(() => {
    const onScroll = () => {
      scrollRef.target = window.scrollY / (document.body.scrollHeight - window.innerHeight || 1);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
}

// ─────────────────────────────────────────────
// PARTICLE FIELD
// ─────────────────────────────────────────────
function Particles({ count = 1800 }) {
  const ref = useRef();
  const positions = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      p[i * 3]     = (Math.random() - 0.5) * 30;
      p[i * 3 + 1] = (Math.random() - 0.5) * 30;
      p[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return p;
  }, [count]);

  useFrame((state) => {
    if (!ref.current) return;
    // Scroll bilan birga yuqoriga ko'tariladi
    const scroll = scrollRef.current;
    ref.current.position.y = scroll * 10;
    ref.current.rotation.y = state.clock.elapsedTime * 0.015;
    ref.current.rotation.x = state.clock.elapsedTime * 0.008;
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent color="#00f5ff"
        size={0.022} sizeAttenuation
        depthWrite={false} opacity={0.5}
      />
    </Points>
  );
}

// ─────────────────────────────────────────────
// KITOB (Book) — bilim ramzi
// ─────────────────────────────────────────────
function Book({ position, color, scrollMult = 1, delay = 0 }) {
  const ref = useRef();
  const pageRef = useRef();

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime + delay;
    const scroll = scrollRef.current;

    // Suzib yuradi
    ref.current.position.y = position[1] + Math.sin(t * 0.6) * 0.4 + scroll * scrollMult * 3;
    ref.current.position.x = position[0] + Math.sin(t * 0.3) * 0.2;
    ref.current.rotation.y = t * 0.2;
    ref.current.rotation.x = Math.sin(t * 0.4) * 0.1;

    // "Sahifa aylanishi" animatsiyasi
    if (pageRef.current) {
      pageRef.current.rotation.y = Math.sin(t * 1.2) * 0.4;
    }
  });

  return (
    <group ref={ref} position={position}>
      {/* Kitob tanasi */}
      <mesh>
        <boxGeometry args={[0.8, 1.1, 0.15]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} transparent opacity={0.85} />
      </mesh>
      {/* Orqa muqova */}
      <mesh position={[-0.4, 0, 0]}>
        <boxGeometry args={[0.04, 1.1, 0.15]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6} />
      </mesh>
      {/* Sahifa */}
      <mesh ref={pageRef} position={[0.1, 0, 0.08]}>
        <boxGeometry args={[0.6, 0.95, 0.01]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.15} />
      </mesh>
      {/* Glow ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.7, 0.02, 8, 40]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1} transparent opacity={0.4} />
      </mesh>
    </group>
  );
}

// ─────────────────────────────────────────────
// SAVOL BELGISI (?) — test ramzi
// ─────────────────────────────────────────────
function QuestionMark({ position, color, scrollMult = 1, delay = 0 }) {
  const ref = useRef();
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime + delay;
    const scroll = scrollRef.current;
    ref.current.position.y = position[1] + Math.sin(t * 0.5) * 0.5 + scroll * scrollMult * 4;
    ref.current.rotation.y = t * 0.4;
    ref.current.rotation.z = Math.sin(t * 0.7) * 0.15;
    const s = 1 + Math.sin(t * 1.5) * 0.08;
    ref.current.scale.setScalar(s);
  });

  return (
    <group ref={ref} position={position}>
      {/* ? belgisini torus + cylinder bilan yasaymiz */}
      {/* Yuqori yoy */}
      <mesh position={[0, 0.45, 0]} rotation={[0, 0, -0.5]}>
        <torusGeometry args={[0.28, 0.07, 12, 30, Math.PI * 1.4]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.8} />
      </mesh>
      {/* O'rta qismi */}
      <mesh position={[0.05, 0.05, 0]}>
        <cylinderGeometry args={[0.07, 0.07, 0.28, 12]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.8} />
      </mesh>
      {/* Nuqta */}
      <mesh position={[0.05, -0.3, 0]}>
        <sphereGeometry args={[0.1, 12, 12]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1} />
      </mesh>
      {/* Glow sphere */}
      <mesh>
        <sphereGeometry args={[0.65, 16, 16]} />
        <meshStandardMaterial color={color} transparent opacity={0.05} side={THREE.BackSide} />
      </mesh>
    </group>
  );
}

// ─────────────────────────────────────────────
// ATOM — fan ramzi
// ─────────────────────────────────────────────
function Atom({ position, color, scrollMult = 1, delay = 0 }) {
  const ref = useRef();
  const ring1 = useRef();
  const ring2 = useRef();
  const ring3 = useRef();
  const electron1 = useRef();
  const electron2 = useRef();
  const electron3 = useRef();

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime + delay;
    const scroll = scrollRef.current;

    ref.current.position.y = position[1] + Math.sin(t * 0.4) * 0.6 + scroll * scrollMult * 5;
    ref.current.position.x = position[0] + Math.cos(t * 0.3) * 0.3;
    ref.current.rotation.y = t * 0.15;

    // Halqalar aylanadi
    if (ring1.current) ring1.current.rotation.z = t * 0.8;
    if (ring2.current) ring2.current.rotation.z = t * 1.1;
    if (ring3.current) ring3.current.rotation.z = t * 0.6;

    // Elektronlar orbita bo'ylab yuradi
    if (electron1.current) {
      electron1.current.position.x = Math.cos(t * 0.8) * 1.2;
      electron1.current.position.y = Math.sin(t * 0.8) * 0.4;
    }
    if (electron2.current) {
      electron2.current.position.x = Math.cos(t * 1.1 + 2) * 0.8;
      electron2.current.position.z = Math.sin(t * 1.1 + 2) * 0.8;
    }
    if (electron3.current) {
      electron3.current.position.y = Math.cos(t * 0.6 + 4) * 1.0;
      electron3.current.position.z = Math.sin(t * 0.6 + 4) * 0.5;
    }
  });

  return (
    <group ref={ref} position={position}>
      {/* Yadro */}
      <mesh>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.2} />
      </mesh>

      {/* 3 ta elliptik halqa */}
      <group ref={ring1} rotation={[0.4, 0, 0]}>
        <mesh>
          <torusGeometry args={[1.2, 0.04, 8, 60]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} transparent opacity={0.7} />
        </mesh>
        <mesh ref={electron1}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1} />
        </mesh>
      </group>

      <group ref={ring2} rotation={[-0.4, 0.8, 0]}>
        <mesh>
          <torusGeometry args={[0.9, 0.035, 8, 60]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.4} transparent opacity={0.6} />
        </mesh>
        <mesh ref={electron2}>
          <sphereGeometry args={[0.09, 8, 8]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1} />
        </mesh>
      </group>

      <group ref={ring3} rotation={[Math.PI / 2, 0.3, 0]}>
        <mesh>
          <torusGeometry args={[1.0, 0.03, 8, 60]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} transparent opacity={0.5} />
        </mesh>
        <mesh ref={electron3}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1} />
        </mesh>
      </group>
    </group>
  );
}

// ─────────────────────────────────────────────
// DNA SPIRAL — biologiya ramzi
// ─────────────────────────────────────────────
function DNA({ position, scrollMult = 1, delay = 0 }) {
  const ref = useRef();
  const nodes = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 18; i++) {
      const t = (i / 17) * Math.PI * 4;
      arr.push({
        x1:  Math.cos(t) * 0.5, y: i * 0.22 - 2,
        x2: -Math.cos(t) * 0.5,
        z1:  Math.sin(t) * 0.5,
        z2: -Math.sin(t) * 0.5,
        color: i % 4 === 0 ? '#00f5ff' : i % 4 === 1 ? '#00ff88' : i % 4 === 2 ? '#bf00ff' : '#ff006e',
      });
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime + delay;
    const scroll = scrollRef.current;
    ref.current.position.y = position[1] + scroll * scrollMult * 4;
    ref.current.rotation.y = t * 0.25;
  });

  return (
    <group ref={ref} position={position}>
      {nodes.map((n, i) => (
        <group key={i}>
          {/* Chap nuqta */}
          <mesh position={[n.x1, n.y, n.z1]}>
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshStandardMaterial color={n.color} emissive={n.color} emissiveIntensity={0.9} />
          </mesh>
          {/* O'ng nuqta */}
          <mesh position={[n.x2, n.y, n.z2]}>
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshStandardMaterial color={n.color} emissive={n.color} emissiveIntensity={0.9} />
          </mesh>
          {/* Bog'lovchi chiziq */}
          {i < nodes.length - 1 && (
            <mesh
              position={[(n.x1 + n.x2) / 2, n.y, (n.z1 + n.z2) / 2]}
            >
              <cylinderGeometry args={[0.025, 0.025, 1.05, 6]} />
              <meshStandardMaterial color={n.color} emissive={n.color} emissiveIntensity={0.5} transparent opacity={0.6} />
            </mesh>
          )}
        </group>
      ))}
    </group>
  );
}

// ─────────────────────────────────────────────
// FORMULA DISK — matematika ramzi
// ─────────────────────────────────────────────
function FormulaDisk({ position, color, scrollMult = 1, delay = 0 }) {
  const ref = useRef();
  const inner = useRef();

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime + delay;
    const scroll = scrollRef.current;
    ref.current.position.y = position[1] + Math.cos(t * 0.5) * 0.5 + scroll * scrollMult * 3.5;
    ref.current.rotation.x = t * 0.3;
    ref.current.rotation.z = t * 0.2;
    if (inner.current) inner.current.rotation.y = t * 1.2;
  });

  return (
    <group ref={ref} position={position}>
      {/* Tashqi halqa */}
      <mesh>
        <torusGeometry args={[0.9, 0.06, 12, 60]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.7} transparent opacity={0.8} />
      </mesh>
      {/* O'rta halqa */}
      <mesh rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[0.65, 0.04, 10, 50]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} transparent opacity={0.6} />
      </mesh>
      {/* Ichki ob'yekt */}
      <group ref={inner}>
        <mesh>
          <octahedronGeometry args={[0.3, 0]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1} wireframe />
        </mesh>
      </group>
      {/* Ko'plab kichik nuqtalar orbitada */}
      {[0, 1, 2, 3, 4, 5].map(i => (
        <mesh key={i} position={[
          Math.cos(i * Math.PI / 3) * 0.9,
          Math.sin(i * Math.PI / 3) * 0.9 * 0.4,
          0,
        ]}>
          <sphereGeometry args={[0.07, 8, 8]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1} />
        </mesh>
      ))}
    </group>
  );
}

// ─────────────────────────────────────────────
// QALAM (Pencil) — yozish ramzi
// ─────────────────────────────────────────────
function Pencil({ position, color, scrollMult = 1, delay = 0 }) {
  const ref = useRef();
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime + delay;
    const scroll = scrollRef.current;
    ref.current.position.y = position[1] + Math.sin(t * 0.7) * 0.4 + scroll * scrollMult * 3;
    ref.current.rotation.z = Math.sin(t * 0.5) * 0.3 + 0.4;
    ref.current.rotation.y = t * 0.15;
  });
  return (
    <group ref={ref} position={position}>
      {/* Qalam tanasi */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 1.6, 6]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
      </mesh>
      {/* Uchi */}
      <mesh position={[0, -0.95, 0]}>
        <coneGeometry args={[0.08, 0.35, 6]} />
        <meshStandardMaterial color="#f5deb3" emissive="#f5deb3" emissiveIntensity={0.3} />
      </mesh>
      {/* O'chkirgich */}
      <mesh position={[0, 0.9, 0]}>
        <cylinderGeometry args={[0.09, 0.09, 0.2, 6]} />
        <meshStandardMaterial color="#ff6b9d" emissive="#ff6b9d" emissiveIntensity={0.5} />
      </mesh>
      {/* Glow */}
      <mesh>
        <cylinderGeometry args={[0.2, 0.2, 1.8, 6]} />
        <meshStandardMaterial color={color} transparent opacity={0.05} side={THREE.BackSide} />
      </mesh>
    </group>
  );
}

// ─────────────────────────────────────────────
// MEDAL / TROFEY — yutuq ramzi
// ─────────────────────────────────────────────
function Trophy({ position, scrollMult = 1, delay = 0 }) {
  const ref = useRef();
  const star = useRef();

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime + delay;
    const scroll = scrollRef.current;
    ref.current.position.y = position[1] + Math.sin(t * 0.45) * 0.5 + scroll * scrollMult * 4.5;
    ref.current.rotation.y = t * 0.3;
    if (star.current) {
      star.current.rotation.z = t * 1.5;
      const s = 1 + Math.sin(t * 2) * 0.12;
      star.current.scale.setScalar(s);
    }
  });

  return (
    <group ref={ref} position={position}>
      {/* Medalni doira qism */}
      <mesh>
        <torusGeometry args={[0.55, 0.1, 12, 40]} />
        <meshStandardMaterial color="#ffd700" emissive="#ffd700" emissiveIntensity={0.8} metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Ichki to'ldiruv */}
      <mesh>
        <circleGeometry args={[0.45, 32]} />
        <meshStandardMaterial color="#ffd700" emissive="#ffd700" emissiveIntensity={0.3} transparent opacity={0.3} />
      </mesh>
      {/* Yulduz */}
      <group ref={star}>
        {[0, 1, 2, 3, 4].map(i => (
          <mesh key={i} position={[
            Math.cos(i * Math.PI * 2 / 5) * 0.28,
            Math.sin(i * Math.PI * 2 / 5) * 0.28,
            0.01,
          ]}>
            <sphereGeometry args={[0.07, 8, 8]} />
            <meshStandardMaterial color="#fff7aa" emissive="#fff7aa" emissiveIntensity={1} />
          </mesh>
        ))}
      </group>
      {/* Lenta */}
      <mesh position={[0, 0.7, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.35, 8]} />
        <meshStandardMaterial color="#ff6b35" emissive="#ff6b35" emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}

// ─────────────────────────────────────────────
// FLOATING GRID — sathlar
// ─────────────────────────────────────────────
function FloatingGrid() {
  const ref = useRef();
  useFrame((state) => {
    if (!ref.current) return;
    const scroll = scrollRef.current;
    ref.current.position.y = -8 + scroll * 15;
    ref.current.material.opacity = 0.06 + scroll * 0.04;
  });
  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, -8, 0]}>
      <planeGeometry args={[40, 40, 20, 20]} />
      <meshStandardMaterial color="#00f5ff" wireframe transparent opacity={0.06} />
    </mesh>
  );
}

// ─────────────────────────────────────────────
// SCROLL-DRIVEN SCENE ROTATION
// ─────────────────────────────────────────────
function SceneController() {
  const { camera, scene } = useThree();
  const inputRef = useRef({ x: 0, y: 0 });

  // Mouse / gyroscope input
  useEffect(() => {
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    const permAsked = { v: false };

    if (isMobile) {
      const startGyro = () => {
        const handler = (e) => {
          inputRef.current.x =  (e.gamma || 0) / 45;
          inputRef.current.y = -((e.beta || 45) - 45) / 45;
        };
        window.addEventListener('deviceorientation', handler, true);
        return () => window.removeEventListener('deviceorientation', handler, true);
      };

      if (typeof DeviceOrientationEvent?.requestPermission === 'function') {
        const ask = () => {
          if (permAsked.v) return;
          permAsked.v = true;
          DeviceOrientationEvent.requestPermission()
            .then(s => { if (s === 'granted') startGyro(); })
            .catch(() => {});
        };
        document.addEventListener('touchstart', ask, { once: true });
        return () => document.removeEventListener('touchstart', ask);
      } else {
        return startGyro();
      }
    } else {
      const handler = (e) => {
        inputRef.current.x =  (e.clientX / window.innerWidth)  * 2 - 1;
        inputRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
      };
      window.addEventListener('mousemove', handler);
      return () => window.removeEventListener('mousemove', handler);
    }
  }, []);

  useFrame((state) => {
    // Smooth scroll
    scrollRef.current += (scrollRef.target - scrollRef.current) * 0.05;

    const scroll = scrollRef.current;
    const { x, y } = inputRef.current;
    const t = state.clock.elapsedTime;

    // Kamera harakat
    camera.position.x += (x * 0.4  - camera.position.x) * 0.04;
    camera.position.y += (y * 0.25 - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);

    // Sahna scroll bilan asta aylanadi
    scene.rotation.y += (scroll * Math.PI * 0.4 - scene.rotation.y) * 0.04;

    // Fog scroll bilan intensivlashadi
    if (scene.fog) {
      scene.fog.near  = 8  - scroll * 4;
      scene.fog.far   = 22 - scroll * 6;
    }
  });

  return null;
}

// ─────────────────────────────────────────────
// MAIN BACKGROUND
// ─────────────────────────────────────────────
function ThreeBackground() {
  useScrollTracker();

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0,
      width: '100%', height: '100%',
      zIndex: 0, pointerEvents: 'none',
    }}>
      <Canvas
        camera={{ position: [0, 0, 10], fov: 55 }}
        gl={{ antialias: false, alpha: true }}
        dpr={Math.min(window.devicePixelRatio, 1.5)}
        style={{ background: 'transparent' }}
        onCreated={({ scene }) => {
          scene.fog = new THREE.FogExp2('#020209', 0.035);
        }}
      >
        <Suspense fallback={null}>
          {/* Yorug'lik */}
          <ambientLight intensity={0.15} />
          <pointLight position={[8,  8,  8]}  intensity={1.2} color="#00f5ff" />
          <pointLight position={[-8,-6, -6]}  intensity={0.8} color="#bf00ff" />
          <pointLight position={[0,  10, -5]} intensity={0.6} color="#00ff88" />
          <pointLight position={[6, -4,  4]}  intensity={0.5} color="#ffd700" />

          {/* Particle fon */}
          <Particles count={1600} />

          {/* Test mavzuli ob'yektlar — scroll ko'tarilganda harakat */}
          <Book         position={[-5,  1.5, -3]} color="#00f5ff"  scrollMult={-1.2} delay={0}   />
          <Book         position={[ 4,  3,   -5]} color="#bf00ff"  scrollMult={-0.8} delay={2}   />
          <Book         position={[-3, -2,   -4]} color="#00ff88"  scrollMult={-1.5} delay={4}   />

          <QuestionMark position={[ 5,  0,   -3]} color="#ffd700"  scrollMult={-1.0} delay={1}   />
          <QuestionMark position={[-4,  4,   -6]} color="#ff006e"  scrollMult={-1.4} delay={3}   />
          <QuestionMark position={[ 2, -3,   -2]} color="#00f5ff"  scrollMult={-0.6} delay={5}   />

          <Atom         position={[ 6,  2,   -5]} color="#00f5ff"  scrollMult={-1.1} delay={0.5} />
          <Atom         position={[-6, -1,   -7]} color="#bf00ff"  scrollMult={-0.9} delay={2.5} />

          <DNA          position={[-7,  0,   -6]}                  scrollMult={-1.3} delay={1}   />

          <FormulaDisk  position={[ 3,  5,   -4]} color="#ff6b35"  scrollMult={-1.0} delay={3}   />
          <FormulaDisk  position={[-2, -4,   -3]} color="#7b61ff"  scrollMult={-0.7} delay={1.5} />

          <Pencil       position={[ 0,  3,   -3]} color="#00ff88"  scrollMult={-1.2} delay={2}   />
          <Pencil       position={[-5,  3,   -5]} color="#ffd700"  scrollMult={-0.8} delay={4}   />

          <Trophy       position={[ 0,  0,   -4]}                  scrollMult={-1.0} delay={0}   />
          <Trophy       position={[ 5, -3,   -6]}                  scrollMult={-1.5} delay={3}   />

          {/* Grid pol */}
          <FloatingGrid />

          {/* Kamera + scroll controller */}
          <SceneController />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default ThreeBackground;
