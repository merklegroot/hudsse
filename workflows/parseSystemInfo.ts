import { SystemInfoResult } from '../models/SseMessage';

export function parseSystemInfo(output: string): SystemInfoResult {
    const lines = output.trim().split('\n');
    
    let hostname: string | null = null;
    let ipAddress: string | null = null;
    let kernelVersion: string | null = null;
    let cpuModel: string | null = null;
    let distro: string | null = null;
    let productName: string | null = null;
    let boardName: string | null = null;
    
    // Parse the output from the system info script
    // The script outputs sections with headers like "Hostname:", "IP Address:", "Kernel Version:", etc.
    let currentSection = '';
    
    for (const line of lines) {
        const trimmedLine = line.trim();
        
        // Skip empty lines and separators
        if (!trimmedLine || trimmedLine === '--------------------------------') {
            continue;
        }
        
        // Check for section headers
        if (trimmedLine.includes('Hostname:')) {
            currentSection = 'hostname';
            continue;
        }
        
        if (trimmedLine.includes('IP Address:')) {
            currentSection = 'ip';
            continue;
        }
        
        if (trimmedLine.includes('Kernel Version:')) {
            currentSection = 'kernel';
            continue;
        }
        
        if (trimmedLine.includes('CPU Model:')) {
            currentSection = 'cpu';
            continue;
        }
        
        if (trimmedLine.includes('Distro:')) {
            currentSection = 'distro';
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
            case 'hostname':
                if (!hostname && trimmedLine && !trimmedLine.startsWith('Reading') && !trimmedLine.startsWith('hostname')) {
                    hostname = trimmedLine;
                }
                break;
            case 'ip':
                if (!ipAddress && trimmedLine && !trimmedLine.startsWith('Reading') && !trimmedLine.startsWith('hostname')) {
                    ipAddress = trimmedLine;
                }
                break;
            case 'kernel':
                if (!kernelVersion && trimmedLine && !trimmedLine.startsWith('Reading') && !trimmedLine.startsWith('uname')) {
                    kernelVersion = trimmedLine;
                }
                break;
            case 'cpu':
                if (!cpuModel && trimmedLine && !trimmedLine.startsWith('Reading') && !trimmedLine.startsWith('lscpu')) {
                    cpuModel = trimmedLine;
                }
                break;
            case 'distro':
                if (!distro && trimmedLine && !trimmedLine.startsWith('Reading') && !trimmedLine.startsWith('cat')) {
                    distro = trimmedLine;
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
        hostname,
        ipAddress,
        kernelVersion,
        cpuModel,
        distro,
        productName,
        boardName
    };
}
