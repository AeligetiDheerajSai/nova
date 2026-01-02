import React, { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text, Float } from '@react-three/drei';
import { Sphere, Cylinder } from '@react-three/drei';

const Atom = ({ position, color, size, label }) => (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <group position={position}>
            <Sphere args={[size, 32, 32]}>
                <meshStandardMaterial color={color} roughness={0.3} metalness={0.2} />
            </Sphere>
            <Text position={[0, 0, size + 0.1]} fontSize={size / 1.5} color="white" outlineWidth={0.02} outlineColor="black">
                {label}
            </Text>
        </group>
    </Float>
);

const Bond = ({ start, end }) => {
    const mid = [(start[0] + end[0]) / 2, (start[1] + end[1]) / 2, (start[2] + end[2]) / 2];
    const len = Math.sqrt(Math.pow(end[0] - start[0], 2) + Math.pow(end[1] - start[1], 2) + Math.pow(end[2] - start[2], 2));

    // Calculate rotation to align cylinder
    // This is a simplification; simpler to use LookAt in full scene, 
    // but here we just render a simple stick for demo

    return (
        <mesh position={mid}>
            {/* Simplified visual bond */}
            <cylinderGeometry args={[0.05, 0.05, len, 8]} />
            <meshStandardMaterial color="#888" />
        </mesh>
    );
};

const Molecule = () => {
    // Water Molecule (H2O)
    // O at center, H at angles
    return (
        <group>
            {/* Oxygen */}
            <Atom position={[0, 0, 0]} color="red" size={0.5} label="O" />

            {/* Hydrogen 1 */}
            <Atom position={[0.8, 0.6, 0]} color="white" size={0.3} label="H" />

            {/* Hydrogen 2 */}
            <Atom position={[-0.8, 0.6, 0]} color="white" size={0.3} label="H" />

            {/* Bonds (Visual approx) */}
            <group rotation={[0, 0, -1]}>
                <Cylinder args={[0.05, 0.05, 1, 8]} position={[0.4, 0.3, 0]} material-color="#aaa" />
            </group>
            <group rotation={[0, 0, 1]}>
                <Cylinder args={[0.05, 0.05, 1, 8]} position={[-0.4, 0.3, 0]} material-color="#aaa" />
            </group>
        </group>
    );
};

const ChemistryLab = () => {
    return (
        <div className="h-full w-full bg-slate-950 relative">
            <div className="absolute top-4 left-4 z-10 bg-slate-900/80 p-4 rounded-xl border border-slate-700 text-white w-64">
                <h3 className="font-bold text-lg mb-2">Molecular Viewer</h3>
                <p className="text-sm text-slate-400 mb-4">Interactive 3D representation of a Water (H2O) molecule.</p>
                <div className="flex gap-2">
                    <span className="px-2 py-1 rounded bg-red-500/20 text-red-300 text-xs">Oxygen</span>
                    <span className="px-2 py-1 rounded bg-slate-500/20 text-slate-300 text-xs">Hydrogen</span>
                </div>
            </div>

            <Canvas camera={{ position: [0, 0, 4], fov: 45 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <Molecule />
                <OrbitControls />
            </Canvas>
        </div>
    );
};

export default ChemistryLab;
