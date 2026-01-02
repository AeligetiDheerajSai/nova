import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import SceneContainer from '../components/3d/SceneContainer';
import NetworkSecLab from '../components/3d/NetworkSecLab';
import NeuralNetViz from '../components/3d/NeuralNetViz';
import CircuitLab from '../components/3d/CircuitLab';
import SortingViz from '../components/3d/SortingViz';
import PhysicsLab from '../components/3d/PhysicsLab';
import ChemistryLab from '../components/3d/ChemistryLab';

const LabView = () => {
    const { labId } = useParams();

    const renderLab = () => {
        switch (labId) {
            case 'network-defense':
                return <NetworkSecLab />;
            case 'neural-network':
                return <NeuralNetViz />;
            case 'circuit-logic':
                return <CircuitLab />;
            case 'sorting-algo':
                return <SortingViz />;
            case 'physics':
                return <PhysicsLab />;
            case 'chemistry':
                return <ChemistryLab />;
            default:
                return (
                    <div className="flex items-center justify-center h-full text-white">
                        <p>Lab module not found: {labId}</p>
                    </div>
                );
        }
    };

    const getLabTitle = () => {
        switch (labId) {
            case 'network-defense': return "Network Defense Lab: Packet Filtering";
            case 'neural-network': return "Neural Network Visualizer";
            case 'circuit-logic': return "Circuit Logic Lab";
            case 'sorting-algo': return "Sorting Visualizer";
            case 'physics': return "Physics Lab: Electrical Circuits";
            case 'chemistry': return "Chemistry Lab: Molecular Viewer";
            default: return "Unknown Lab";
        }
    };

    return (
        <div className="flex flex-col h-screen bg-slate-950">
            <header className="p-4 bg-slate-900 border-b border-slate-800 flex items-center space-x-4">
                <Link to="/dashboard" className="text-slate-400 hover:text-white transition-colors">
                    <ArrowLeft size={24} />
                </Link>
                <h1 className="text-xl font-bold text-white">{getLabTitle()}</h1>
            </header>
            <main className="flex-1 p-6 relative">
                <div className="absolute inset-0">
                    {renderLab()}
                </div>
            </main>
        </div>
    );
};

export default LabView;
