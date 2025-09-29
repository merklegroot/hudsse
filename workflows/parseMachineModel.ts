import { MachineModelResult } from '../models/SseMessage';

export function parseMachineModel(output: string): MachineModelResult {
    const lines = output.trim().split('\n');
    
    let productName: string | null = null;
    
    // Parse the output from the machine model detection script
    // The script outputs sections with headers like "Machine Model:"
    let currentSection = '';
    
    for (const line of lines) {
        const trimmedLine = line.trim();
        
        // Skip empty lines and separators
        if (!trimmedLine || trimmedLine === '--------------------------------') {
            continue;
        }
        
        // Check for section headers
        if (trimmedLine.includes('Machine Model:')) {
            currentSection = 'product';
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
        if (currentSection === 'product' && !productName && trimmedLine && !trimmedLine.startsWith('Reading') && !trimmedLine.includes('detection completed')) {
            productName = trimmedLine;
        }
    }
    
    return {
        productName,
        boardName: null,
        manufacturer: null
    };
}
