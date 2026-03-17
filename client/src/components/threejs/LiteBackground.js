/**
 * LiteBackground — scroll-reactive CSS animatsiya
 * Gyroscope ham ishlaydi (CSS transform orqali)
 */
import React, { useEffect, useRef } from 'react';

function LiteBackground() {
  const wrapRef  = useRef();
  const orb1Ref  = useRef();
  const orb2Ref  = useRef();
  const orb3Ref  = useRef();
  const gridRef  = useRef();
  const gyro     = useRef({ x: 0, y: 0 });

  useEffect(() => {
    let raf;
    let scrollY = 0;
    let targetScroll = 0;

    // Smooth scroll tracker
    const onScroll = () => { targetScroll = window.scrollY; };
    window.addEventListener('scroll', onScroll, { passive: true });

    // Gyroscope (mobile)
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    let cleanupGyro = () => {};

    const startGyro = () => {
      const handler = (e) => {
        gyro.current.x = ((e.gamma || 0) / 45) * 20;
        gyro.current.y = (((e.beta || 45) - 45) / 45) * 15;
      };
      window.addEventListener('deviceorientation', handler, true);
      return () => window.removeEventListener('deviceorientation', handler, true);
    };

    if (isMobile) {
      if (typeof DeviceOrientationEvent?.requestPermission === 'function') {
        const ask = () => {
          DeviceOrientationEvent.requestPermission()
            .then(s => { if (s === 'granted') cleanupGyro = startGyro(); })
            .catch(() => {});
        };
        document.addEventListener('touchstart', ask, { once: true });
      } else {
        cleanupGyro = startGyro();
      }
    } else {
      // Mouse parallax for desktop lite mode
      const onMouse = (e) => {
        gyro.current.x = ((e.clientX / window.innerWidth)  - 0.5) * 30;
        gyro.current.y = ((e.clientY / window.innerHeight) - 0.5) * 20;
      };
      window.addEventListener('mousemove', onMouse);
      cleanupGyro = () => window.removeEventListener('mousemove', onMouse);
    }

    // Animation loop
    const animate = () => {
      raf = requestAnimationFrame(animate);
      scrollY += (targetScroll - scrollY) * 0.06;
      const sp = scrollY / (document.body.scrollHeight - window.innerHeight || 1);
      const gx = gyro.current.x;
      const gy = gyro.current.y;

      if (wrapRef.current) {
        // Sahna scroll bilan asta siljiydi
        wrapRef.current.style.transform = `translateY(${sp * -60}px)`;
      }
      if (orb1Ref.current) {
        const x = -180 + sp * -120 + gx * 0.6;
        const y = -180 + sp * -80  + gy * 0.5;
        orb1Ref.current.style.transform = `translate(${x}px, ${y}px) scale(${1 + sp * 0.3})`;
      }
      if (orb2Ref.current) {
        const x = sp * 100 + gx * (-0.5);
        const y = sp * 80  + gy * (-0.4);
        orb2Ref.current.style.transform = `translate(${x}px, ${y}px) scale(${1 - sp * 0.2})`;
      }
      if (orb3Ref.current) {
        const x = -50 + sp * 60  + gx * 0.3;
        const y = -50 + sp * -50 + gy * 0.3;
        orb3Ref.current.style.transform = `translate(${x}px, ${y}px)`;
      }
      if (gridRef.current) {
        gridRef.current.style.transform = `perspective(600px) rotateX(${55 - sp * 20}deg) translateY(${sp * 80}px)`;
        gridRef.current.style.opacity = `${0.06 + sp * 0.08}`;
      }
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      cleanupGyro();
    };
  }, []);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 0,
      overflow: 'hidden',
      background: 'linear-gradient(135deg, #020209 0%, #070714 40%, #0a0a1e 70%, #020209 100%)',
    }}>
      <div ref={wrapRef} style={{ position: 'absolute', inset: 0, willChange: 'transform' }}>

        {/* Orb 1 — cyan */}
        <div ref={orb1Ref} style={{
          position: 'absolute', width: '700px', height: '700px',
          borderRadius: '50%', top: '10%', left: '5%',
          background: 'radial-gradient(circle, rgba(0,245,255,0.08) 0%, transparent 70%)',
          willChange: 'transform', transition: 'transform 0.1s linear',
          filter: 'blur(2px)',
        }} />

        {/* Orb 2 — purple */}
        <div ref={orb2Ref} style={{
          position: 'absolute', width: '600px', height: '600px',
          borderRadius: '50%', bottom: '5%', right: '5%',
          background: 'radial-gradient(circle, rgba(191,0,255,0.07) 0%, transparent 70%)',
          willChange: 'transform', transition: 'transform 0.1s linear',
          filter: 'blur(2px)',
        }} />

        {/* Orb 3 — green */}
        <div ref={orb3Ref} style={{
          position: 'absolute', width: '500px', height: '500px',
          borderRadius: '50%', top: '40%', left: '45%',
          background: 'radial-gradient(circle, rgba(0,255,136,0.05) 0%, transparent 70%)',
          willChange: 'transform', transition: 'transform 0.1s linear',
        }} />

        {/* CSS floating objects — test mavzuli */}
        {/* Kitob ikonkasi */}
        <div style={{
          position: 'absolute', top: '15%', left: '8%',
          width: '50px', height: '65px',
          border: '2px solid rgba(0,245,255,0.15)',
          borderRadius: '4px', borderLeft: '8px solid rgba(0,245,255,0.25)',
          animation: 'liteFloat1 7s ease-in-out infinite',
          opacity: 0.4,
        }} />
        <div style={{
          position: 'absolute', top: '60%', right: '10%',
          width: '40px', height: '55px',
          border: '2px solid rgba(191,0,255,0.15)',
          borderRadius: '4px', borderLeft: '7px solid rgba(191,0,255,0.25)',
          animation: 'liteFloat2 9s ease-in-out infinite',
          opacity: 0.35,
        }} />

        {/* Savol belgisi */}
        <div style={{
          position: 'absolute', top: '25%', right: '12%',
          fontSize: '60px', color: 'rgba(255,215,0,0.12)',
          fontFamily: 'Syne, sans-serif', fontWeight: 800,
          animation: 'liteFloat3 6s ease-in-out infinite',
          userSelect: 'none',
        }}>?</div>
        <div style={{
          position: 'absolute', bottom: '30%', left: '15%',
          fontSize: '45px', color: 'rgba(0,245,255,0.1)',
          fontFamily: 'Syne, sans-serif', fontWeight: 800,
          animation: 'liteFloat1 8s ease-in-out infinite 2s',
          userSelect: 'none',
        }}>?</div>

        {/* Formula belgisi */}
        <div style={{
          position: 'absolute', top: '70%', right: '20%',
          fontSize: '28px', color: 'rgba(0,255,136,0.1)',
          fontFamily: 'JetBrains Mono, monospace',
          animation: 'liteFloat2 10s ease-in-out infinite',
          userSelect: 'none',
        }}>E=mc²</div>
        <div style={{
          position: 'absolute', top: '40%', left: '5%',
          fontSize: '22px', color: 'rgba(191,0,255,0.1)',
          fontFamily: 'JetBrains Mono, monospace',
          animation: 'liteFloat3 11s ease-in-out infinite 1s',
          userSelect: 'none',
        }}>∑∫∞</div>

        {/* Atom halqa */}
        <div style={{
          position: 'absolute', top: '50%', right: '5%',
          width: '80px', height: '80px',
          border: '2px solid rgba(0,245,255,0.08)',
          borderRadius: '50%',
          animation: 'liteOrbit 6s linear infinite',
          opacity: 0.5,
        }} />
        <div style={{
          position: 'absolute', top: '50%', right: '5%',
          width: '80px', height: '80px',
          border: '2px solid rgba(191,0,255,0.08)',
          borderRadius: '50%',
          animation: 'liteOrbit 4s linear infinite reverse',
          opacity: 0.4,
          transform: 'rotate(60deg)',
        }} />

        {/* Gradient grid (scroll bilan tilt o'zgaradi) */}
        <div ref={gridRef} style={{
          position: 'absolute', bottom: '-20%', left: '-10%',
          width: '120%', height: '60%',
          backgroundImage: `
            linear-gradient(rgba(0,245,255,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,245,255,0.06) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          transformOrigin: '50% 100%',
          willChange: 'transform, opacity',
          opacity: 0.06,
        }} />

        {/* Floating particles (CSS) */}
        {[...Array(18)].map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            left: `${(i * 37 + 5) % 95}%`,
            top:  `${(i * 53 + 8) % 90}%`,
            width:  `${2 + (i % 3)}px`,
            height: `${2 + (i % 3)}px`,
            borderRadius: '50%',
            background: i % 3 === 0 ? 'rgba(0,245,255,0.35)' : i % 3 === 1 ? 'rgba(191,0,255,0.3)' : 'rgba(0,255,136,0.3)',
            animation: `litePulse ${3 + (i % 4)}s ease-in-out infinite ${(i * 0.4) % 3}s`,
          }} />
        ))}
      </div>

      <style>{`
        @keyframes liteFloat1 {
          0%,100% { transform: translateY(0px) rotate(0deg); }
          33%     { transform: translateY(-18px) rotate(3deg); }
          66%     { transform: translateY(10px) rotate(-2deg); }
        }
        @keyframes liteFloat2 {
          0%,100% { transform: translateY(0px) rotate(0deg); }
          50%     { transform: translateY(-25px) rotate(-5deg); }
        }
        @keyframes liteFloat3 {
          0%,100% { transform: translateY(0px) scale(1); }
          40%     { transform: translateY(-20px) scale(1.1); }
          80%     { transform: translateY(8px)  scale(0.95); }
        }
        @keyframes liteOrbit {
          from { transform: rotate(0deg) scaleX(1.8); }
          to   { transform: rotate(360deg) scaleX(1.8); }
        }
        @keyframes litePulse {
          0%,100% { opacity: 0.2; transform: scale(1); }
          50%     { opacity: 0.8; transform: scale(1.6); }
        }
      `}</style>
    </div>
  );
}

export default LiteBackground;
