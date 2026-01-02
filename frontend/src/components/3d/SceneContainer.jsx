import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Grid } from '@react-three/drei';

const SceneContainer = ({ children }) => {
    return (
        <div className="w-full h-[600px] bg-slate-900 rounded-xl overflow-hidden border border-slate-700 relative">
            <Canvas camera={{ position: [5, 5, 5], fov: 50 }}>
                <Suspense fallback={null}>
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} intensity={1} />

                    {children}

                    <Grid infiniteGrid fadeDistance={30} sectionColor="#4f46e5" cellColor="#64748b" />
                    <Environment preset="city" />
                    <OrbitControls makeDefault />
                </Suspense>
            </Canvas>

            <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-md p-2 rounded-lg text-xs text-white">
                Left Click: Rotate | Right Click: Pan
            </div>
        </div>
    );
};

export default SceneContainer;
