import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Html } from '@react-three/drei';
import * as THREE from 'three';

// 3D Bar Component
const Bar = ({ height, position, color, label }) => {
    // Height determines scale Y. Position Y needs to be height/2
    return (
        <group position={position}>
            <mesh position={[0, height / 2, 0]}>
                <boxGeometry args={[0.5, height, 0.5]} />
                <meshStandardMaterial color={color} />
            </mesh>
            <Text position={[0, -0.5, 0]} fontSize={0.3} color="white">
                {label}
            </Text>
        </group>
    );
};

// Main Scene
const SortingScene = ({ array, activeIndices, sortedIndices }) => {
    return (
        <>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <group position={[-array.length / 2, -2, 0]}>
                {array.map((value, idx) => {
                    let color = "#3b82f6"; // default blue
                    if (activeIndices.includes(idx)) color = "#ef4444"; // active red
                    if (sortedIndices.includes(idx)) color = "#4ade80"; // sorted green

                    return (
                        <Bar
                            key={idx}
                            height={value}
                            position={[idx * 0.8, 0, 0]}
                            color={color}
                            label={value}
                        />
                    );
                })}
            </group>
            <Html position={[0, -4, 0]} center>
                <div className="bg-slate-900/80 p-4 rounded-xl backdrop-blur-md text-white border border-slate-700 w-80 text-center">
                    <h3 className="font-bold mb-2">Sorting Visualizer (Bubble Sort)</h3>
                    <p className="text-sm text-gray-300">Bars turn RED when comparing/swapping. GREEN when sorted.</p>
                </div>
            </Html>
        </>
    );
};

export default function SortingViz() {
    const [array, setArray] = useState([5, 2, 8, 1, 9, 3, 7, 4, 6]);
    const [activeIndices, setActiveIndices] = useState([]);
    const [sortedIndices, setSortedIndices] = useState([]);
    const [isSorting, setIsSorting] = useState(false);

    // Bubble Sort Step Generator
    const sortMetrics = useRef({ i: 0, j: 0, arr: [...array] });

    useEffect(() => {
        if (!isSorting) return;

        const interval = setInterval(() => {
            let { i, j, arr } = sortMetrics.current;

            if (i < arr.length) {
                if (j < arr.length - i - 1) {
                    setActiveIndices([j, j + 1]);
                    if (arr[j] > arr[j + 1]) {
                        // Swap
                        let temp = arr[j];
                        arr[j] = arr[j + 1];
                        arr[j + 1] = temp;
                        setArray([...arr]);
                    }
                    sortMetrics.current.j++;
                } else {
                    // Inner loop finished
                    setSortedIndices(prev => [...prev, arr.length - 1 - i]);
                    sortMetrics.current.j = 0;
                    sortMetrics.current.i++;
                }
            } else {
                setSortedIndices(Array.from({ length: arr.length }, (_, k) => k));
                setIsSorting(false);
                clearInterval(interval);
            }
        }, 300); // Speed

        return () => clearInterval(interval);
    }, [isSorting]);

    const handleReset = () => {
        setArray([5, 2, 8, 1, 9, 3, 7, 4, 6]);
        setActiveIndices([]);
        setSortedIndices([]);
        sortMetrics.current = { i: 0, j: 0, arr: [5, 2, 8, 1, 9, 3, 7, 4, 6] };
        setIsSorting(false);
    };

    return (
        <div className="h-full w-full bg-slate-950 relative">
            <Canvas camera={{ position: [0, 0, 12] }}>
                <OrbitControls />
                <SortingScene array={array} activeIndices={activeIndices} sortedIndices={sortedIndices} />
            </Canvas>

            <div className="absolute top-4 right-4 flex space-x-2">
                <button
                    onClick={() => setIsSorting(true)}
                    disabled={isSorting}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50 font-bold"
                >
                    {isSorting ? "Sorting..." : "Start Sort"}
                </button>
                <button
                    onClick={handleReset}
                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-bold"
                >
                    Reset
                </button>
            </div>
        </div>
    );
}
