import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Line } from '@react-three/drei';
import SceneContainer from './SceneContainer';
import * as THREE from 'three';

const Neuron = ({ position, color }) => {
    return <Sphere args={[0.3, 32, 32]} position={position} material-color={color} />;
};

const Connection = ({ start, end, active }) => {
    const points = useMemo(() => [start, end], [start, end]);
    return <Line points={points} color={active ? 'cyan' : '#1e293b'} lineWidth={active ? 2 : 1} transparent opacity={0.5} />;
}

const NeuralNetViz = () => {
    // Simple 3 layer network: 4 input, 5 hidden, 3 output
    const layers = [4, 5, 3];
    const layerDist = 3;
    const neuronDist = 1.5;

    const neurons = useMemo(() => {
        const n = [];
        layers.forEach((count, layerIndex) => {
            for (let i = 0; i < count; i++) {
                // Center the layer vertically
                const y = (i - (count - 1) / 2) * neuronDist;
                n.push({
                    id: `${layerIndex}-${i}`,
                    layer: layerIndex,
                    pos: [(layerIndex - 1) * layerDist, y, 0]
                });
            }
        });
        return n;
    }, []);

    // Generate connections
    const connections = useMemo(() => {
        const c = [];
        neurons.forEach(src => {
            neurons.forEach(dst => {
                if (src.layer + 1 === dst.layer) {
                    c.push({ start: new THREE.Vector3(...src.pos), end: new THREE.Vector3(...dst.pos), id: `${src.id}-${dst.id}` });
                }
            });
        });
        return c;
    }, [neurons]);

    // Animate activity logic could go here
    const [activeConn, setActiveConn] = React.useState(0);
    useFrame(({ clock }) => {
        // Simple animation to pulse connections
        setActiveConn(Math.floor(clock.getElapsedTime() * 5) % connections.length);
    });

    return (
        <SceneContainer>
            <group rotation={[0, -Math.PI / 6, 0]}>
                {neurons.map(n => (
                    <Neuron key={n.id} position={n.pos} color={n.layer === 0 ? '#4ade80' : n.layer === 2 ? '#f472b6' : '#60a5fa'} />
                ))}
                {connections.map((c, i) => (
                    <Connection key={c.id} start={c.start} end={c.end} active={i === activeConn || i === (activeConn + 1) % connections.length} />
                ))}
            </group>
        </SceneContainer>
    );
};

export default NeuralNetViz;
