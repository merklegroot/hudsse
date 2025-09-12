'use client';

import React, { useState } from 'react';
import { useMessageStore } from '../store/messageStore';

// shows the raw JSON of the zustand state.
// collapsed by default

export function StateViewer() {
    const [isExpanded, setIsExpanded] = useState(false);
    const state = useMessageStore();

    const toggleExpanded = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
            <button
                onClick={toggleExpanded}
                className="flex items-center justify-between w-full text-left font-medium text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded"
            >
                <span>State Viewer</span>
                <span className="text-lg">
                    {isExpanded ? '▼' : '▶'}
                </span>
            </button>
            
            {isExpanded && (
                <div className="mt-3">
                    <pre className="bg-white border border-gray-200 rounded p-3 text-xs overflow-auto max-h-96 whitespace-pre-wrap">
                        {JSON.stringify(state, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    );
}
