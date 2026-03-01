"use client";

import React, { useRef, useEffect, useCallback } from "react";

interface Node {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  vx: number;
  vy: number;
  layer: number;
  energy: number;
  pulsePhase: number;
  connections: number[];
  charge: number;
}

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
}

export const CosmicPlasma: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<Node[]>([]);
  const sparksRef = useRef<Spark[]>([]);
  const mouseRef = useRef({ x: 0, y: 0, active: false, intensity: 0 });
  const timeRef = useRef(0);
  const animationRef = useRef(0);

  const createNode = useCallback((x: number, y: number, layer: number, index: number): Node => {
    return {
      x,
      y,
      baseX: x,
      baseY: y,
      vx: 0,
      vy: 0,
      layer,
      energy: Math.random(),
      pulsePhase: Math.random() * Math.PI * 2,
      connections: [],
      charge: 0
    };
  }, []);

  const initParticles = useCallback((width: number, height: number) => {
    const nodes: Node[] = [];
    const layers = 4;
    const nodesPerLayer = 8;
    
    for (let layer = 0; layer < layers; layer++) {
      const radius = 120 + layer * 80;
      const angleOffset = layer * 0.3;
      
      for (let i = 0; i < nodesPerLayer; i++) {
        const angle = (i / nodesPerLayer) * Math.PI * 2 + angleOffset;
        const x = width / 2 + Math.cos(angle) * radius;
        const y = height / 2 + Math.sin(angle) * radius;
        const node = createNode(x, y, layer, nodes.length);
        
        if (layer > 0) {
          const prevLayerStart = (layer - 1) * nodesPerLayer;
          const prevLayerEnd = layer * nodesPerLayer;
          for (let j = prevLayerStart; j < prevLayerEnd; j++) {
            if (Math.random() > 0.4) {
              node.connections.push(j);
            }
          }
        }
        
        nodes.push(node);
      }
    }
    
    nodesRef.current = nodes;
    sparksRef.current = [];
  }, [createNode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      initParticles(rect.width, rect.height);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const newX = e.clientX - rect.left;
      const newY = e.clientY - rect.top;
      
      const dx = newX - mouseRef.current.x;
      const dy = newY - mouseRef.current.y;
      const velocity = Math.sqrt(dx * dx + dy * dy);
      
      mouseRef.current = {
        x: newX,
        y: newY,
        active: true,
        intensity: Math.min(velocity / 20 + 0.5, 2) // Intensity based on speed
      };

      // Structured 'data bit' trail rather than messy sparks
      if (velocity > 2 && sparksRef.current.length < 40) {
        sparksRef.current.push({
          x: newX,
          y: newY,
          vx: -dx * 0.1, // Trail follows opposite to movement
          vy: -dy * 0.1,
          life: 0,
          maxLife: 30,
          size: 1.5
        });
      }
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
      mouseRef.current.intensity *= 0.95;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const rect = canvas.getBoundingClientRect();
        mouseRef.current = {
          x: e.touches[0].clientX - rect.left,
          y: e.touches[0].clientY - rect.top,
          active: true,
          intensity: Math.min(mouseRef.current.intensity + 0.1, 1)
        };
      }
    };

    const createSpark = (x: number, y: number, targetX: number, targetY: number) => {
      const angle = Math.atan2(targetY - y, targetX - x);
      const speed = 2 + Math.random() * 3;
      sparksRef.current.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0,
        maxLife: 20 + Math.random() * 20,
        size: 1 + Math.random() * 2
      });
    };

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const animate = () => {
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      const centerX = width / 2;
      const centerY = height / 2;
      
      timeRef.current += 0.016;
      const t = timeRef.current;

      // Deep black background with subtle red vignette
      ctx.fillStyle = "rgba(0, 0, 0, 0.95)";
      ctx.fillRect(0, 0, width, height);
      
      const vignette = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, Math.max(width, height) * 0.7);
      vignette.addColorStop(0, "rgba(0, 0, 0, 0)");
      vignette.addColorStop(0.7, "rgba(20, 0, 0, 0.3)");
      vignette.addColorStop(1, "rgba(10, 0, 0, 0.6)");
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, width, height);

      const mouse = mouseRef.current;
      const nodes = nodesRef.current;

      // Update nodes
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        
        // Breathing motion
        const breathe = Math.sin(t * 0.5 + n.pulsePhase) * 15;
        const spiral = Math.sin(t * 0.3 + n.layer * 0.5) * 10;
        n.baseX = centerX + Math.cos((i / nodes.length) * Math.PI * 2 + t * 0.1 + n.layer * 0.3) * (120 + n.layer * 80 + breathe);
        n.baseY = centerY + Math.sin((i / nodes.length) * Math.PI * 2 + t * 0.1 + n.layer * 0.3) * (120 + n.layer * 80 + breathe) + spiral;

        // Mouse interaction
        if (mouse.active) {
          const dx = mouse.x - n.x;
          const dy = mouse.y - n.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 250) {
            const force = (1 - dist / 250) * mouse.intensity;
            n.charge = Math.min(n.charge + force * 0.15, 1.2);
            
            // Magnetic pull and orbit
            const pull = force * 3;
            n.vx += (dx / dist) * pull;
            n.vy += (dy / dist) * pull;
            
            // Subtle swirl around cursor
            n.vx += (dy / dist) * force * 1.5;
            n.vy -= (dx / dist) * force * 1.5;
            
            if (Math.random() < 0.08 && sparksRef.current.length < 100) {
              createSpark(n.x, n.y, mouse.x, mouse.y);
            }
          }
        }
        
        // Physics
        n.vx += (n.baseX - n.x) * 0.015;
        n.vy += (n.baseY - n.y) * 0.015;
        n.vx *= 0.94;
        n.vy *= 0.94;
        n.x += n.vx;
        n.y += n.vy;
        
        n.energy = (Math.sin(t * 2.5 + n.pulsePhase) + 1) / 2;
        n.charge *= 0.95;
      }

      // Draw connections
      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        
        for (const targetIdx of n.connections) {
          const target = nodes[targetIdx];
          const dx = target.x - n.x;
          const dy = target.y - n.y;
          
          // Data flow animation
          const flow = (Math.sin(t * 3 + i * 0.5) + 1) / 2;
          const pulsePos = flow;
          const px = n.x + dx * pulsePos;
          const py = n.y + dy * pulsePos;
          
          // Connection line with energy
          const energy = (n.energy + target.energy) / 2;
          const charge = Math.max(n.charge, target.charge);
          
          const gradient = ctx.createLinearGradient(n.x, n.y, target.x, target.y);
          gradient.addColorStop(0, `rgba(255, 0, 0, ${0.1 + energy * 0.2 + charge * 0.3})`);
          gradient.addColorStop(0.5, `rgba(255, 40, 40, ${0.2 + energy * 0.3 + charge * 0.4})`);
          gradient.addColorStop(1, `rgba(200, 0, 0, ${0.1 + energy * 0.2 + charge * 0.3})`);
          
          ctx.strokeStyle = gradient;
          ctx.beginPath();
          ctx.moveTo(n.x, n.y);
          ctx.lineTo(target.x, target.y);
          ctx.stroke();
          
          // Energy pulse
          if (energy > 0.7 || charge > 0.5) {
            const pulseGlow = ctx.createRadialGradient(px, py, 0, px, py, 8);
            pulseGlow.addColorStop(0, `rgba(255, 50, 50, ${0.8 + charge * 0.2})`);
            pulseGlow.addColorStop(0.4, `rgba(255, 20, 20, ${0.4 + charge * 0.3})`);
            pulseGlow.addColorStop(1, "rgba(255, 0, 0, 0)");
            ctx.fillStyle = pulseGlow;
            ctx.beginPath();
            ctx.arc(px, py, 8, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      // Draw nodes
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const size = 3 + n.layer * 1.5;
        const glow = 12 + n.energy * 8 + n.charge * 15;
        
        // Outer glow
        const outerGlow = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, glow);
        outerGlow.addColorStop(0, `rgba(255, ${20 + n.charge * 80}, ${20 + n.charge * 80}, ${0.6 + n.energy * 0.3})`);
        outerGlow.addColorStop(0.3, `rgba(255, 0, 0, ${0.3 + n.charge * 0.5})`);
        outerGlow.addColorStop(1, "rgba(255, 0, 0, 0)");
        ctx.fillStyle = outerGlow;
        ctx.beginPath();
        ctx.arc(n.x, n.y, glow, 0, Math.PI * 2);
        ctx.fill();
        
        // Core
        const coreGradient = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, size);
        coreGradient.addColorStop(0, `rgba(255, ${100 + n.charge * 155}, ${100 + n.charge * 155}, 1)`);
        coreGradient.addColorStop(0.6, `rgba(255, ${40 + n.charge * 100}, ${40 + n.charge * 100}, 0.9)`);
        coreGradient.addColorStop(1, `rgba(200, 0, 0, ${0.6 + n.charge * 0.4})`);
        ctx.fillStyle = coreGradient;
        ctx.beginPath();
        ctx.arc(n.x, n.y, size, 0, Math.PI * 2);
        ctx.fill();
        
        // Quantum ring
        if (n.charge > 0.3 || n.energy > 0.8) {
          ctx.strokeStyle = `rgba(255, 100, 100, ${0.3 + n.charge * 0.5})`;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(n.x, n.y, size + 4 + Math.sin(t * 4 + i) * 2, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      // Update and draw structured 'data bit' trails
      const sparks = sparksRef.current;
      ctx.lineWidth = 1;
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.life++;
        
        if (s.life > s.maxLife) {
          sparks.splice(i, 1);
          continue;
        }
        
        s.x += s.vx;
        s.y += s.vy;
        s.vx *= 0.95;
        s.vy *= 0.95;
        
        const alpha = (1 - s.life / s.maxLife) * 0.4;
        ctx.fillStyle = `rgba(255, 40, 40, ${alpha})`;
        // Small square 'data bits'
        ctx.fillRect(s.x - 1, s.y - 1, 2, 2);
      }

      // Gyroscopic Smart-Core Cursor (Futuristic & Minimalist)
      if (mouse.active) {
        const baseRad = 6;
        const color = `rgba(255, 30, 30, ${0.9 * Math.min(mouse.intensity, 1)})`;
        
        // 1. Tiny high-intensity center core
        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 1, 0, Math.PI * 2);
        ctx.fill();
        
        // 2. Gyroscopic Orbital Rings
        ctx.lineWidth = 0.5;
        
        // Ring 1 - Vertical-ish tilt
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.ellipse(mouse.x, mouse.y, baseRad, baseRad * Math.abs(Math.sin(t * 8)), t * 2, 0, Math.PI * 2);
        ctx.stroke();

        // Ring 2 - Horizontal-ish tilt
        ctx.beginPath();
        ctx.ellipse(mouse.x, mouse.y, baseRad, baseRad * Math.abs(Math.cos(t * 10)), -t * 1.5, 0, Math.PI * 2);
        ctx.stroke();

        // Ring 3 - Outer protective shell (faint)
        ctx.strokeStyle = `rgba(153, 27, 27, ${0.3 * Math.min(mouse.intensity, 1)})`;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, baseRad + 4, 0, Math.PI * 2);
        ctx.stroke();

        // Subtle surgical-grade pinpoint glow
        const glow = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, baseRad * 3);
        glow.addColorStop(0, `rgba(153, 27, 27, ${0.2 * Math.min(mouse.intensity, 1)})`);
        glow.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = glow;
        ctx.fillRect(mouse.x - baseRad * 3, mouse.y - baseRad * 3, baseRad * 6, baseRad * 6);
      }

      // Central core effect
      const coreIntensity = Math.sin(t * 2) * 0.3 + 0.5;
      const coreGlow = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 100);
      coreGlow.addColorStop(0, `rgba(80, 0, 0, ${0.2 + coreIntensity * 0.2})`);
      coreGlow.addColorStop(0.5, `rgba(40, 0, 0, ${0.1 + coreIntensity * 0.1})`);
      coreGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = coreGlow;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 100, 0, Math.PI * 2);
      ctx.fill();

      animationRef.current = requestAnimationFrame(animate);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);
    canvas.addEventListener("touchmove", handleTouchMove);
    canvas.addEventListener("touchend", handleMouseLeave);
    
    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      canvas.removeEventListener("touchmove", handleTouchMove);
      canvas.removeEventListener("touchend", handleMouseLeave);
      cancelAnimationFrame(animationRef.current);
    };
  }, [initParticles]);

  return (
    <div className="cosmic-plasma-container">
      <canvas
        ref={canvasRef}
        className="cosmic-plasma-canvas"
        aria-hidden="true"
      />
      <style jsx>{`
        .cosmic-plasma-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
          pointer-events: auto;
          overflow: hidden;
        }
        .cosmic-plasma-canvas {
          width: 100%;
          height: 100%;
          display: block;
        }
      `}</style>
    </div>
  );
};

export default CosmicPlasma;