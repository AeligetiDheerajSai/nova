import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Box, Text, Html } from '@react-three/drei';
import SceneContainer from './SceneContainer';

const Packet = ({ position, color }) => {
    const ref = useRef();
    useFrame((state) => {
        ref.current.position.x += 0.05;
        if (ref.current.position.x > 4) ref.current.position.x = -4;
    });
    return <Sphere args={[0.2, 16, 16]} position={position} ref={ref} material-color={color} />;
};

const Firewall = ({ active, toggle }) => (
    <group position={[0, 0, 0]} onClick={toggle}>
        <Box args={[1, 3, 3]} material-color={active ? "green" : "red"} material-opacity={0.5} material-transparent />
        <Html position={[0, 2, 0]} center>
            <div className={`bg-gray-900 text-white p-2 rounded text-xs whitespace-nowrap`}>
                Firewall: {active ? "Active" : "Disabled"}
            </div>
        </Html>
    </group>
);

const NetworkSecLab = () => {
    const [firewallActive, setFirewallActive] = useState(true);

    return (
        <SceneContainer>
            <Text position={[-4, 2, 0]} fontSize={0.5} color="white">Internet</Text>
            <Text position={[4, 2, 0]} fontSize={0.5} color="white">Local Network</Text>

            {/* Firewall */}
            <Firewall active={firewallActive} toggle={() => setFirewallActive(!firewallActive)} />

            {/* Packets */}
            {/* If firewall is active, stop packets at x=0? Visualization logic simplified here. */}
            <Packet position={[-4, 0, 0]} color="red" />
            <Packet position={[-2, 0.5, 0]} color="orange" />

            {/* Visual indicator logic would go here: e.g. packets disappearing if handled */}
        </SceneContainer>
    );
};

export default NetworkSecLab;
