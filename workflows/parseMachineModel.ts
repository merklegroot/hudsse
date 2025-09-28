import { MachineModelResult } from '../models/SseMessage';

export function parseMachineModel(output: string): MachineModelResult {
    const lines = output.trim().split('\n');
    
    let productName: string | null = null;
    let boardName: string | null = null;
    let manufacturer: string | null = null;
    
    // Parse the output from the machine model detection script
    // The script outputs sections with headers like "System Product Name:", "Motherboard Name:", etc.
    let currentSection = '';
    
    for (const line of lines) {
        const trimmedLine = line.trim();
        
        // Skip empty lines and separators
        if (!trimmedLine || trimmedLine === '--------------------------------') {
            continue;
        }
        
        // Check for section headers
        if (trimmedLine.includes('System Product Name:')) {
            currentSection = 'product';
            continue;
        }
        
        if (trimmedLine.includes('Motherboard Name:')) {
            currentSection = 'board';
            continue;
        }
        
        if (trimmedLine.includes('System Manufacturer:')) {
            currentSection = 'manufacturer';
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
        switch (currentSection) {
            case 'product':
                if (!productName && trimmedLine && !trimmedLine.startsWith('Reading')) {
                    productName = trimmedLine;
                }
                break;
            case 'board':
                if (!boardName && trimmedLine && !trimmedLine.startsWith('Reading')) {
                    boardName = trimmedLine;
                }
                break;
            case 'manufacturer':
                if (!manufacturer && trimmedLine && !trimmedLine.startsWith('Reading')) {
                    manufacturer = trimmedLine;
                }
                break;
        }
    }
    
    return {
        productName,
        boardName,
        manufacturer
    };
}
