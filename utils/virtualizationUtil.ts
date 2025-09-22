

export enum VirtualizationType {
    Invalid = 0,
    PHYSICAL = 1,
    VERCEL = 2,
    AWS_LAMBDA = 3,
    AZURE_FUNCTIONS = 4,
    GOOGLE_CLOUD_PLATFORM = 5,
    HEROKU = 6,
    RAILWAY = 7,
    NETLIFY = 8,
    RENDER = 9,
    FLY_IO = 10,
    DIGITAL_OCEAN = 11,
    LINODE = 12,
    VULTR = 13,
    UNKNOWN = 100
}

function getVirtualizationFromEnv(): VirtualizationType {
    if (process.env.VERCEL === '1' || process.env.VERCEL_URL) {
        return VirtualizationType.VERCEL;
    }
    // Check for other cloud platforms
    if (process.env.AWS_LAMBDA_FUNCTION_NAME) {
        return VirtualizationType.AWS_LAMBDA;
    }
    if (process.env.AZURE_FUNCTIONS_WORKER_RUNTIME) {
        return VirtualizationType.AZURE_FUNCTIONS;
    }
    if (process.env.GOOGLE_CLOUD_PROJECT || process.env.GCP_PROJECT) {
        return VirtualizationType.GOOGLE_CLOUD_PLATFORM;
    }
    if (process.env.HEROKU_APP_NAME) {
        return VirtualizationType.HEROKU;
    }
    if (process.env.RAILWAY_ENVIRONMENT) {
        return VirtualizationType.RAILWAY;
    }
    if (process.env.NETLIFY) {
        return VirtualizationType.NETLIFY;
    }
    if (process.env.RENDER) {
        return VirtualizationType.RENDER;
    }
    if (process.env.FLY_APP_NAME) {
        return VirtualizationType.FLY_IO;
    }

    if (process.env.DIGITAL_OCEAN_APP_ID) {
        return VirtualizationType.DIGITAL_OCEAN;
    }

    if (process.env.LINODE_APP_ID) {
        return VirtualizationType.LINODE;
    }
    
    if (process.env.VULTR_APP_ID) {
        return VirtualizationType.VULTR;
    }
    
    return VirtualizationType.PHYSICAL;
}

const virtualizationTypeNames: Record<VirtualizationType, string> = {
    [VirtualizationType.Invalid]: 'Invalid',
    [VirtualizationType.PHYSICAL]: 'Physical Machine',
    [VirtualizationType.VERCEL]: 'Vercel',
    [VirtualizationType.AWS_LAMBDA]: 'AWS Lambda',
    [VirtualizationType.AZURE_FUNCTIONS]: 'Azure Functions',
    [VirtualizationType.GOOGLE_CLOUD_PLATFORM]: 'Google Cloud Platform',
    [VirtualizationType.HEROKU]: 'Heroku',
    [VirtualizationType.RAILWAY]: 'Railway',
    [VirtualizationType.NETLIFY]: 'Netlify',
    [VirtualizationType.RENDER]: 'Render',
    [VirtualizationType.FLY_IO]: 'Fly.io',
    [VirtualizationType.DIGITAL_OCEAN]: 'DigitalOcean',
    [VirtualizationType.LINODE]: 'Linode',
    [VirtualizationType.VULTR]: 'Vultr',
    [VirtualizationType.UNKNOWN]: 'Unknown'
};

function getVirtualizationFriendlyName(virtualizationType: VirtualizationType): string {
    if (virtualizationType === VirtualizationType.Invalid) {
        throw new Error('Invalid virtualization type provided');
    }
    
    return virtualizationTypeNames[virtualizationType] ?? 'Unknown';
}

export const virtualizationUtil = {
    getVirtualizationFromEnv,
    getVirtualizationFriendlyName
}