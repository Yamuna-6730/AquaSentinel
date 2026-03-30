"use client";

import React, { useState } from 'react';
import Navbar from '@/components/ui/Navbar';
import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import Technology from '@/components/sections/Technology';
import Footer from '@/components/ui/Footer';
import ModelViewer from '@/components/3d/ModelViewer';
import ControlPanel from '@/components/3d/ControlPanel';
import { motion } from 'framer-motion';

export default function Home() {
  const [wireframe, setWireframe] = useState(false);
  const [autoRotate, setAutoRotate] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [controls, setControls] = useState<any>(null);

  const resetCamera = () => {
    if (controls) {
      controls.object.position.set(5, 5, 5);
      controls.target.set(0, 0, 0);
      controls.update();
    }
  };

  return (
    <main className="min-h-screen bg-navy-900 text-white selection:bg-cyan-500/30">
      <Navbar />

      <Hero />

      <About />

      <Technology />

      {/* Dedicated 3D Model Section */}
      <section id="3d-model" className="py-24 relative">
        <div className="container mx-auto px-6">
          <div className="mb-16">
            <h2 className="text-sm font-bold tracking-[0.3em] text-cyan-400 uppercase mb-4 text-center">Engineering Analysis</h2>
            <h3 className="text-4xl lg:text-5xl font-black text-white text-center">Interactive Hardware Preview</h3>
          </div>

          <div className="relative h-[700px] w-full bg-navy-800/50 rounded-[40px] border border-white/5 overflow-hidden shadow-2xl">
            <ModelViewer
              modelPath="/object_0.glb"
              wireframe={wireframe}
              autoRotate={autoRotate}
              showGrid={showGrid}
              setControlsRef={setControls}
            />

            <div className="absolute top-8 left-8 z-10">
              <div className="glass-card p-6 rounded-2xl max-w-xs">
                <h4 className="text-cyan-400 font-bold uppercase tracking-widest text-xs mb-3">Model Details</h4>
                <p className="text-white/50 text-xs leading-relaxed">
                  High-fidelity GLB representation of the VASM monitoring unit.
                  Inspect the sensor placement, casing integrity, and mounting brackets.
                </p>
                <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-2 gap-4">
                  <div>
                    <span className="block text-[10px] text-white/30 uppercase">Triangles</span>
                    <span className="text-white font-mono text-sm font-bold">42.8k</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-white/30 uppercase">Materials</span>
                    <span className="text-white font-mono text-sm font-bold">Standard</span>
                  </div>
                </div>
              </div>
            </div>

            <ControlPanel
              wireframe={wireframe}
              setWireframe={setWireframe}
              autoRotate={autoRotate}
              setAutoRotate={setAutoRotate}
              showGrid={showGrid}
              setShowGrid={setShowGrid}
              onResetCamera={resetCamera}
              onViewFront={() => controls?.object.position.set(0, 0, 7) && controls.update()}
              onViewTop={() => controls?.object.position.set(0, 7, 0) && controls.update()}
              onViewSide={() => controls?.object.position.set(7, 0, 0) && controls.update()}
            />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
