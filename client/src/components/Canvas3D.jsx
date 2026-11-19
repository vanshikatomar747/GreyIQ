import { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

function FloatingParticles(props) {
  const ref = useRef();
  // Generate random coordinates inside a sphere of radius R = 1.5
  const [sphere] = useState(() => {
    const points = new Float32Array(3000);
    for (let i = 0; i < 3000; i += 3) {
      const u = Math.random();
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 1.5 * Math.cbrt(u);
      
      points[i] = r * Math.sin(phi) * Math.cos(theta);
      points[i+1] = r * Math.sin(phi) * Math.sin(theta);
      points[i+2] = r * Math.cos(phi);
    }
    return points;
  });


  useFrame((state, delta) => {
    // Slow rotational drift
    ref.current.rotation.x -= delta / 10;
    ref.current.rotation.y -= delta / 15;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
        <PointMaterial
          transparent
          color="#22D3EE"
          size={0.005}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  );
}

function FloatingShapes() {
  const shapesRef = useRef([]);
  const { mouse } = useThree();
  const timer = useMemo(() => new THREE.Timer(), []);

  useFrame(() => {
    timer.update();
    const time = timer.getElapsed();
    
    // Slow rotation and mouse reaction
    if (shapesRef.current) {
      shapesRef.current.forEach((shape, index) => {
        if (!shape) return;
        const offset = index * 10;
        shape.rotation.x = time * 0.1 + offset;
        shape.rotation.y = time * 0.15 + offset;
        
        // Sway based on mouse coordinates
        shape.position.x = shape.userData.initialX + mouse.x * 0.5;
        shape.position.y = shape.userData.initialY + mouse.y * 0.5;
      });
    }
  });

  // 3 distinct geometry coordinates
  const positions = [
    { x: -1.8, y: 0.8, z: -1, type: 'torus', color: '#7C3AED' },
    { x: 1.8, y: -0.8, z: -1.5, type: 'sphere', color: '#22D3EE' },
    { x: 0, y: 1.5, z: -2, type: 'cone', color: '#FB7185' }
  ];

  return (
    <group>
      {positions.map((pos, i) => (
        <mesh
          key={i}
          ref={(el) => (shapesRef.current[i] = el)}
          position={[pos.x, pos.y, pos.z]}
          userData={{ initialX: pos.x, initialY: pos.y }}
        >
          {pos.type === 'torus' && <torusGeometry args={[0.4, 0.12, 16, 100]} />}
          {pos.type === 'sphere' && <sphereGeometry args={[0.3, 32, 32]} />}
          {pos.type === 'cone' && <coneGeometry args={[0.3, 0.6, 32]} />}
          <meshPhysicalMaterial
            color={pos.color}
            emissive={pos.color}
            emissiveIntensity={0.2}
            roughness={0.1}
            metalness={0.8}
            clearcoat={1.0}
            clearcoatRoughness={0.1}
            transmission={0.3}
            thickness={0.5}
          />
        </mesh>
      ))}
    </group>
  );
}

const detectWebGL = () => {
  try {
    const canvas = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
  } catch {
    return false;
  }
};

export default function Canvas3D() {
  const [webglSupported] = useState(detectWebGL);
  const [ecoMode, setEcoMode] = useState(() => localStorage.getItem('greyiq_eco_mode') === 'true');

  const handleToggleEco = () => {
    const nextMode = !ecoMode;
    setEcoMode(nextMode);
    localStorage.setItem('greyiq_eco_mode', String(nextMode));
  };

  return (
    <>
      <div className="fixed inset-0 w-full h-full -z-10 pointer-events-none select-none overflow-hidden">
        {/* Fallback CSS Aurora background beneath Canvas */}
        <div className="aurora-bg">
          <div className="aurora-blur aurora-1"></div>
          <div className="aurora-blur aurora-2"></div>
          <div className="aurora-blur aurora-3"></div>
        </div>

        {!ecoMode && webglSupported && (
          <Canvas camera={{ position: [0, 0, 3], fov: 60 }} dpr={[1, 2]}>
            <ambientLight intensity={0.6} />
            <pointLight position={[10, 10, 10]} intensity={1.5} color="#22D3EE" />
            <pointLight position={[-10, -10, -10]} intensity={1} color="#7C3AED" />
            <FloatingParticles />
            <FloatingShapes />
          </Canvas>
        )}
      </div>

      {/* Floating control button */}
      <div className="fixed bottom-3 left-3 md:bottom-6 md:left-6 z-[90] pointer-events-auto select-none no-print">
        <button
          onClick={handleToggleEco}
          title={ecoMode ? "Enable 3D Background Effects" : "Disable 3D Background Effects (Eco Mode)"}
          className={`flex items-center space-x-1 md:space-x-1.5 px-2 py-1 md:px-3 md:py-2 border rounded-full text-[8px] md:text-[10px] font-bold uppercase tracking-wider transition-all duration-300 shadow-md ${
            ecoMode 
              ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25' 
              : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
          }`}
        >
          <span className={`w-1 h-1 md:w-1.5 md:h-1.5 rounded-full ${ecoMode ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
          <span>{ecoMode ? "Eco Mode ON" : "3D Effects Active"}</span>
        </button>
      </div>
    </>
  );
}
