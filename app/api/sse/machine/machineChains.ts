import { parseSystemInfo } from '@/workflows/parseSystemInfo';
import { flexibleSseHandlerProps, flexibleChainProp, commandArgsChainProp } from '@/workflows/sseFactory';
import { platformType, platformUtil } from '@/utils/platformUtil';
import { virtualizationUtil } from '@/utils/virtualizationUtil';
import { platform } from 'os';
import { parseHostname } from '@/workflows/parseHostname';
import { parseIpAddress } from '@/workflows/parseIpAddress';
import { parseKernelVersion } from '@/workflows/parseKernelVersion';
import { parseCpuModel } from '@/workflows/parseCpuModel';
import { parseDistroFlavor } from '@/workflows/parseDistroFlavor';
import { parseMachineModel } from '@/workflows/parseMachineModel';

const detectPlatformChain: flexibleChainProp = {
    workflow: async (props: flexibleSseHandlerProps) => {
        const detectedPlatform = platformUtil.detectPlatform();
        const platformResult = { platform: detectedPlatform };

        props.sendMessage({
            type: 'result',
            contents: `Platform: ${detectedPlatform}`,
            result: JSON.stringify(platformResult)
        });
    },
    onSuccess: 'Platform detected successfully'
};

const currentPlatform = platformUtil.detectPlatform();

const hostnameChainLinux: commandArgsChainProp = {
    commandAndArgs: { command: 'hostname', args: [] },
    parser: parseHostname,
    onSuccess: 'Hostname retrieved successfully'
};

const hostNameChainWindows: commandArgsChainProp = {
    commandAndArgs: { command: 'powershell.exe', args: ['-ExecutionPolicy', 'Bypass', '-Command', '[System.Net.Dns]::GetHostName()'] },
    parser: parseHostname,
    onSuccess: 'Hostname retrieved successfully'
};

const hostnameChain = currentPlatform === platformType.windows 
    ? hostNameChainWindows 
    : hostnameChainLinux;

const ipAddressChainLinux: commandArgsChainProp = {
    commandAndArgs: { command: 'hostname', args: ['-I'] },
    parser: parseIpAddress,
    onSuccess: 'IP address retrieved successfully'
};

const ipAddressChainWindows: commandArgsChainProp = {
    commandAndArgs: { command: 'powershell.exe', args: ['-ExecutionPolicy', 'Bypass', '-Command', '(Get-NetIPAddress -AddressFamily IPv4 | Where-Object {$_.IPAddress -ne "127.0.0.1"} | Select-Object -First 1).IPAddress'] },
    parser: parseIpAddress,
    onSuccess: 'IP address retrieved successfully'
};

const ipAddressChain = currentPlatform === platformType.windows 
    ? ipAddressChainWindows 
    : ipAddressChainLinux;

const kernelVersionChainLinux: commandArgsChainProp = {
    commandAndArgs: { command: 'uname', args: ['-r'] },
    parser: parseKernelVersion,
    onSuccess: 'Kernel version retrieved successfully'
};

const kernelVersionChainWindows: commandArgsChainProp = {
    commandAndArgs: { command: 'powershell.exe', args: ['-ExecutionPolicy', 'Bypass', '-Command', '[System.Environment]::OSVersion.VersionString'] },
    parser: parseKernelVersion,
    onSuccess: 'Kernel version retrieved successfully'
};

const kernelVersionChain = currentPlatform === platformType.windows 
    ? kernelVersionChainWindows 
    : kernelVersionChainLinux;

const cpuModelChainLinux: commandArgsChainProp = {
    commandAndArgs: { command: 'sh', args: ['-c', "lscpu | grep 'Model name' | cut -d':' -f2 | xargs"] },
    parser: parseCpuModel,
    onSuccess: 'CPU model retrieved successfully'
};

const cpuModelChainWindows: commandArgsChainProp = {
    commandAndArgs: { command: 'powershell.exe', args: ['-ExecutionPolicy', 'Bypass', '-Command', 'Get-WmiObject -Class Win32_Processor | Select-Object -ExpandProperty Name'] },
    parser: parseCpuModel,
    onSuccess: 'CPU model retrieved successfully'
};

const cpuModelChain = currentPlatform === platformType.windows 
    ? cpuModelChainWindows 
    : cpuModelChainLinux;

const distroFlavorChainLinux: commandArgsChainProp = {
    commandAndArgs: { command: './scripts/detect_distro_flavor.sh', args: [] },
    parser: parseDistroFlavor,
    onSuccess: 'Distro flavor retrieved successfully'
};

const distroFlavorChainWindows: commandArgsChainProp = {
    commandAndArgs: { command: 'powershell.exe', args: ['-ExecutionPolicy', 'Bypass', '-File', './scripts/detect_distro_flavor.ps1'] },
    parser: parseDistroFlavor,
    onSuccess: 'Distro flavor retrieved successfully'
};

const distroFlavorChain = currentPlatform === platformType.windows 
    ? distroFlavorChainWindows 
    : distroFlavorChainLinux;

const systemInfoChainLinux: commandArgsChainProp = {
    commandAndArgs: { command: './scripts/read_system_info.sh', args: [] },
    parser: parseSystemInfo,
    onSuccess: 'System information retrieved successfully'
};

const systemInfoChainWindows: commandArgsChainProp = {
    commandAndArgs: { command: 'powershell.exe', args: ['-ExecutionPolicy', 'Bypass', '-File', './scripts/read_system_info.ps1'] },
    parser: parseSystemInfo,
    onSuccess: 'System information retrieved successfully'
};

const systemInfoChain = currentPlatform === platformType.windows 
    ? systemInfoChainWindows 
    : systemInfoChainLinux;

const detectVirtualizationChain: flexibleChainProp = {
    workflow: async (props: flexibleSseHandlerProps) => {
        const detectedVirtualization = virtualizationUtil.getVirtualizationFromEnv();
        const virtualizationResult = { virtualization: detectedVirtualization };

        props.sendMessage({
            type: 'result',
            contents: `Virtualization: ${virtualizationUtil.getVirtualizationFriendlyName(detectedVirtualization)}`,
            result: JSON.stringify(virtualizationResult)
        });
    },
    onSuccess: 'Virtualization detected successfully'
};

const machineModelChainLinux: commandArgsChainProp = {
    commandAndArgs: { command: './scripts/detect_machine_model.sh', args: [] },
    parser: parseMachineModel,
    onSuccess: 'Machine model retrieved successfully'
};

const machineModelChainWindows: commandArgsChainProp = {
    commandAndArgs: { command: 'powershell.exe', args: ['-ExecutionPolicy', 'Bypass', '-File', './scripts/detect_machine_model.ps1'] },
    parser: parseMachineModel,
    onSuccess: 'Machine model retrieved successfully'
};

const machineModelChain = currentPlatform === platformType.windows 
    ? machineModelChainWindows 
    : machineModelChainLinux;

export const machineChains = {
    detectPlatformChain,
    hostnameChain,
    ipAddressChain,
    kernelVersionChain,
    cpuModelChain,
    distroFlavorChain,
    systemInfoChain,
    detectVirtualizationChain,
    machineModelChain
};