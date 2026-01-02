import React, { useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const Quiz = ({ data, onComplete }) => {
    // data is expected to be a JSON string or object: { questions: [{ q, options, a }] }
    // 'a' is the index of the correct answer
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);

    let quizContent;
    try {
        quizContent = typeof data === 'string' ? JSON.parse(data) : data;
    } catch (e) {
        return <div className="text-red-500">Invalid quiz data format.</div>;
    }

    const { questions } = quizContent;
    const currentQuestion = questions[currentIndex];

    const handleOptionSelect = (index) => {
        if (selectedOption !== null) return; // Prevent changing answer
        setSelectedOption(index);

        const isCorrect = index === currentQuestion.a;
        if (isCorrect) {
            setScore(prev => prev + 1);
        }

        setTimeout(() => {
            if (currentIndex < questions.length - 1) {
                setCurrentIndex(prev => prev + 1);
                setSelectedOption(null);
            } else {
                setShowResult(true);
                const finalScore = isCorrect ? score + 1 : score;
                const percentage = Math.round((finalScore / questions.length) * 100);
                onComplete(percentage); // Pass percentage back to parent
            }
        }, 1500);
    };

    if (showResult) {
        return (
            <div className="text-center p-8 bg-slate-900 rounded-xl border border-slate-800">
                <h2 className="text-2xl font-bold mb-4">Quiz Completed!</h2>
                <div className="text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400">
                    {Math.round((score / questions.length) * 100)}%
                </div>
                <p className="text-slate-400 mb-6">
                    You answered {score} out of {questions.length} questions correctly.
                </p>
                <div className="flex justify-center">
                    {score / questions.length >= 0.7 ? (
                        <div className="flex items-center gap-2 text-green-400 font-bold">
                            <CheckCircle /> Passed
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 text-red-400 font-bold">
                            <XCircle /> Try Again
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto bg-slate-900 rounded-xl border border-slate-800 p-8">
            <div className="flex justify-between items-center mb-8 text-slate-500 text-sm font-bold uppercase tracking-wider">
                <span>Question {currentIndex + 1} of {questions.length}</span>
                <span>Score: {score}</span>
            </div>

            <h2 className="text-xl font-bold mb-8">{currentQuestion.q}</h2>

            <div className="space-y-4">
                {currentQuestion.options.map((option, index) => {
                    let btnClass = "w-full text-left p-4 rounded-xl border transition-all font-medium flex justify-between items-center ";
                    if (selectedOption === null) {
                        btnClass += "bg-slate-800 border-slate-700 hover:border-blue-500 hover:bg-slate-700";
                    } else if (index === currentQuestion.a) {
                        btnClass += "bg-green-500/20 border-green-500 text-green-400";
                    } else if (index === selectedOption) {
                        btnClass += "bg-red-500/20 border-red-500 text-red-400";
                    } else {
                        btnClass += "bg-slate-800 border-slate-700 opacity-50";
                    }

                    return (
                        <button
                            key={index}
                            onClick={() => handleOptionSelect(index)}
                            disabled={selectedOption !== null}
                            className={btnClass}
                        >
                            {option}
                            {selectedOption !== null && index === currentQuestion.a && <CheckCircle size={20} />}
                            {selectedOption === index && index !== currentQuestion.a && <XCircle size={20} />}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default Quiz;
