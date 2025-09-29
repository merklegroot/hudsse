import { MotherboardNameResult } from '../models/SseMessage';

export function parseMotherboardName(output: string): MotherboardNameResult {
    const lines = output.trim().split('\n');
    
    let motherboardName: string | null = null;
    
    // Parse the output from the motherboard detection script
    // The script outputs sections with headers like "Motherboard Name:"
    let currentSection = '';
    
    for (const line of lines) {
        const trimmedLine = line.trim();
        
        // Skip empty lines and separators
        if (!trimmedLine || trimmedLine === '--------------------------------') {
            continue;
        }
        
        // Check for section headers
        if (trimmedLine.includes('Motherboard Name:')) {
            currentSection = 'motherboard';
            continue;
        }
        
        // Skip file path lines (they start with "File:")
        if (trimmedLine.startsWith('File:')) {
            continue;
        }
        
        // Skip error messages
        if (trimmedLine.startsWith('Error:')) {
            currentSection = '';
            continue;
        }
        
        // Extract the actual content based on current section
        if (currentSection === 'motherboard' && !motherboardName && trimmedLine && !trimmedLine.startsWith('Reading') && !trimmedLine.includes('detection completed')) {
            motherboardName = trimmedLine;
        }
    }
    
    return {
        motherboardName
    };
}
