import { parsePackageRepositories } from '@/workflows/parsePackageRepositories';
import { flexibleSseHandlerProps, commandArgsChainProp } from '@/workflows/sseFactory';
import { platformType, platformUtil } from '@/utils/platformUtil';
import { platform } from 'os';

const currentPlatform = platformUtil.detectPlatform();

const packageRepositoriesChainLinux: commandArgsChainProp = {
    commandAndArgs: { command: './scripts/detect_package_repositories.sh', args: [] },
    parser: parsePackageRepositories,
    onSuccess: 'Package repositories retrieved successfully'
};

const packageRepositoriesChainWindows: commandArgsChainProp = {
    commandAndArgs: { command: 'powershell.exe', args: ['-ExecutionPolicy', 'Bypass', '-File', './scripts/detect_package_repositories.ps1'] },
    parser: parsePackageRepositories,
    onSuccess: 'Package repositories retrieved successfully'
};

const packageRepositoriesChain = currentPlatform === platformType.windows 
    ? packageRepositoriesChainWindows 
    : packageRepositoriesChainLinux;

export const packageChains = {
    packageRepositoriesChain
};
