import { SystemInfoResult } from '../models/SseMessage';

export function parseSystemInfo(output: string): SystemInfoResult {
    const lines = output.trim().split('\n');
    
    let kernelVersion: string | null = null;
    let productName: string | null = null;
    let boardName: string | null = null;
    
    // Parse the output from the system info script
    // The script outputs sections with headers like "Kernel Version:", "System Product Name:", etc.
    let currentSection = '';
    
    for (const line of lines) {
        const trimmedLine = line.trim();
        
        // Skip empty lines and separators
        if (!trimmedLine || trimmedLine === '--------------------------------') {
            continue;
        }
        
        // Check for section headers
        if (trimmedLine.includes('Kernel Version:')) {
            currentSection = 'kernel';
            continue;
        }
        
        if (trimmedLine.includes('System Product Name:')) {
            currentSection = 'product';
            continue;
        }
        
        if (trimmedLine.includes('Motherboard Name:')) {
            currentSection = 'board';
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
            case 'kernel':
                if (!kernelVersion && trimmedLine && !trimmedLine.startsWith('Reading')) {
                    kernelVersion = trimmedLine;
                }
                break;
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
        }
    }
    
    return {
        kernelVersion,
        productName,
        boardName
    };
}
