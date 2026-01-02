import React, { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { RefreshCw, Play, Square, Circle, Triangle, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';

// Simple implementation without Cannon for maximum compatibility if not installed,
// BUT since user wants "Immersive", we'll do a custom simple physics engine loop here
// to ensure it works without complex peer deps.

const Ball = ({ position, color }) => {
    const ref = useRef();
    const [velocity, setVelocity] = useState([0, 0, 0]);

    useFrame((state, delta) => {
        if (!ref.current) return;

        let [x, y, z] = ref.current.position;
        let [vx, vy, vz] = velocity;

        // Gravity
        vy -= 9.8 * delta;

        // Update position
        x += vx * delta;
        y += vy * delta;
        z += vz * delta;

        // Floor collision
        if (y < 0.5) {
            y = 0.5;
            vy = -vy * 0.8; // Bounce
        }

        // Walls (Simple bounds)
        if (Math.abs(x) > 10) vx = -vx * 0.9;
        if (Math.abs(z) > 10) vz = -vz * 0.9;

        ref.current.position.set(x, y, z);
        setVelocity([vx, vy, vz]);
        ref.current.rotation.x += vx * delta;
        ref.current.rotation.z -= vz * delta;
    });

    return (
        <mesh ref={ref} position={position} castShadow>
            <sphereGeometry args={[0.5, 32, 32]} />
            <meshStandardMaterial color={color} metalness={0.5} roughness={0.2} />
        </mesh>
    );
};

const Box = ({ position, color }) => {
    const ref = useRef();
    const [velocity, setVelocity] = useState([0, 0, 0]);

    useFrame((state, delta) => {
        if (!ref.current) return;

        let [x, y, z] = ref.current.position;
        let [vx, vy, vz] = velocity;

        // Gravity
        vy -= 9.8 * delta;

        // Update position
        x += vx * delta;
        y += vy * delta;
        z += vz * delta;

        // Floor collision
        if (y < 0.5) {
            y = 0.5;
            vy = -vy * 0.6; // Less bounce for box
        }

        ref.current.position.set(x, y, z);
        setVelocity([vx, vy, vz]);
        ref.current.rotation.x += vx * delta;
        ref.current.rotation.y += vy * delta;
    });

    return (
        <mesh ref={ref} position={position} castShadow>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={color} metalness={0.1} roughness={0.8} />
        </mesh>
    );
};

const PhysicsLab = () => {
    const [objects, setObjects] = useState([]);
    const [spawnType, setSpawnType] = useState('sphere');

    const spawnObject = () => {
        const id = Date.now();
        const x = (Math.random() - 0.5) * 5;
        const z = (Math.random() - 0.5) * 5;
        const color = `hsl(${Math.random() * 360}, 70%, 50%)`;
        setObjects(prev => [...prev, { id, type: spawnType, position: [x, 8, z], color }]);
    };

    const clearObjects = () => setObjects([]);

    return (
        <div className="h-screen flex flex-col bg-slate-950 text-white overflow-hidden">
            {/* Header */}
            <div className="p-4 bg-slate-900 border-b border-slate-800 flex justify-between items-center z-10 relative shadow-xl">
                <div className="flex items-center gap-4">
                    <Link to="/dashboard" className="text-slate-400 hover:text-white transition">Back</Link>
                    <h1 className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
                        Physics Lab: Gravity Simulation
                    </h1>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex bg-slate-800 rounded-lg p-1 border border-slate-700">
                        <button
                            onClick={() => setSpawnType('sphere')}
                            className={`p-2 rounded-md transition ${spawnType === 'sphere' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                        >
                            <Circle size={20} />
                        </button>
                        <button
                            onClick={() => setSpawnType('box')}
                            className={`p-2 rounded-md transition ${spawnType === 'box' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                        >
                            <Square size={20} />
                        </button>
                    </div>

                    <button
                        onClick={spawnObject}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded-lg font-bold shadow-lg shadow-emerald-900/20 transition flex items-center gap-2"
                    >
                        <Layers size={18} /> Spawn
                    </button>

                    <button
                        onClick={clearObjects}
                        className="p-2 text-slate-400 hover:text-red-400 transition"
                    >
                        <RefreshCw size={20} />
                    </button>
                </div>
            </div>

            {/* 3D Canvas */}
            <div className="flex-1 bg-gradient-to-b from-slate-900 to-black relative">
                <div className="absolute top-4 left-4 z-10 bg-black/50 backdrop-blur p-4 rounded-xl border border-slate-700 max-w-xs">
                    <h3 className="font-bold text-sm mb-2 text-blue-300">Controls</h3>
                    <p className="text-xs text-slate-400">
                        • Click <strong>Spawn</strong> to drop objects.<br />
                        • Left Click + Drag to rotate.<br />
                        • Right Click + Drag to pan.<br />
                        • Scroll to zoom.
                    </p>
                </div>

                <Canvas shadows camera={{ position: [0, 5, 10], fov: 60 }}>
                    <OrbitControls />
                    <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade />
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} intensity={1.5} castShadow />
                    <pointLight position={[-10, 10, -10]} intensity={0.5} color="blue" />

                    {/* Floor */}
                    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
                        <planeGeometry args={[50, 50]} />
                        <meshStandardMaterial color="#0f172a" roughness={0.5} metalness={0.5} />
                    </mesh>

                    {/* Grid */}
                    <gridHelper args={[50, 50, 0x1e293b, 0x0f172a]} position={[0, 0.01, 0]} />

                    {/* Objects */}
                    {objects.map(obj => (
                        obj.type === 'sphere'
                            ? <Ball key={obj.id} position={obj.position} color={obj.color} />
                            : <Box key={obj.id} position={obj.position} color={obj.color} />
                    ))}
                </Canvas>
            </div>
        </div>
    );
};

export default PhysicsLab;
