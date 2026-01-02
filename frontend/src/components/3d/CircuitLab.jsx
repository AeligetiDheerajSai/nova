import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Html } from '@react-three/drei';
import * as THREE from 'three';

// Simple wire component
const Wire = ({ start, end, active }) => {
    const points = [start, end];
    const curve = new THREE.CatmullRomCurve3(points);
    return (
        <mesh>
            <tubeGeometry args={[curve, 20, 0.05, 8, false]} />
            <meshStandardMaterial color={active ? "#4ade80" : "#334155"} emissive={active ? "#4ade80" : "#000000"} emissiveIntensity={active ? 2 : 0} />
        </mesh>
    );
};

// Gate Component
const Gate = ({ position, type, inputs, output, onToggle }) => {
    const color = type === 'AND' ? '#ef4444' : (type === 'OR' ? '#3b82f6' : '#eab308');

    return (
        <group position={position}>
            {/* Gate Body */}
            <mesh position={[0, 0, 0]}>
                <boxGeometry args={[1.5, 1, 0.2]} />
                <meshStandardMaterial color={color} />
            </mesh>
            <Text position={[0, 0.2, 0.11]} fontSize={0.3} color="white">
                {type}
            </Text>

            {/* Input Nodes */}
            {inputs.map((active, i) => (
                <mesh key={i} position={[-0.8, (i === 0 ? 0.3 : -0.3), 0]} onClick={(e) => { e.stopPropagation(); onToggle(i); }}>
                    <sphereGeometry args={[0.15, 16, 16]} />
                    <meshStandardMaterial color={active ? "#4ade80" : "#ef4444"} />
                </mesh>
            ))}

            {/* Output Node */}
            <mesh position={[0.8, 0, 0]}>
                <sphereGeometry args={[0.15, 16, 16]} />
                <meshStandardMaterial color={output ? "#4ade80" : "#ef4444"} emissive={output ? "#4ade80" : "#000000"} />
            </mesh>
        </group>
    );
};

const CircuitScene = () => {
    // State for inputs
    const [inputs, setInputs] = useState({ and1: false, and2: false, or1: false, or2: false });

    // Logic
    const andResult = inputs.and1 && inputs.and2;
    const orResult = inputs.or1 || inputs.or2;
    const finalResult = andResult && !orResult; // Complex logic example

    return (
        <>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />

            {/* AND Gate */}
            <Gate
                position={[-2, 1, 0]}
                type="AND"
                inputs={[inputs.and1, inputs.and2]}
                output={andResult}
                onToggle={(idx) => setInputs(prev => ({ ...prev, [idx === 0 ? 'and1' : 'and2']: !prev[idx === 0 ? 'and1' : 'and2'] }))}
            />

            {/* OR Gate */}
            <Gate
                position={[-2, -1, 0]}
                type="OR"
                inputs={[inputs.or1, inputs.or2]}
                output={orResult}
                onToggle={(idx) => setInputs(prev => ({ ...prev, [idx === 0 ? 'or1' : 'or2']: !prev[idx === 0 ? 'or1' : 'or2'] }))}
            />

            {/* Wire Connections to a Final NOT Gate */}
            <Gate
                position={[2, 0, 0]}
                type="NOT"
                inputs={[orResult]}
                output={!orResult}
                onToggle={() => { }} // Not interactive driven output
            />

            <Html position={[0, -3, 0]} center>
                <div className="bg-slate-900/80 p-4 rounded-xl backdrop-blur-md text-white border border-slate-700 w-80">
                    <h3 className="font-bold mb-2">Digital Logic Lab</h3>
                    <p className="text-sm text-gray-300">Click input nodes (red/green) on the left gates to toggle signals. Watch the logic propagate!</p>
                </div>
            </Html>
        </>
    );
};

export default function CircuitLab() {
    return (
        <div className="h-full w-full bg-slate-950">
            <Canvas camera={{ position: [0, 0, 8] }}>
                <OrbitControls />
                <CircuitScene />
            </Canvas>
        </div>
    );
}
