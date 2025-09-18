import { flexibleSseHandlerProps } from "./sseFactory";
import { promises as fs } from 'fs';
import path from 'path';

export async function sseDownloadFileWorkflow(props: flexibleSseHandlerProps, url: string, localFilePath: string): Promise<string> {
    // if the file already exists, just return the local file path
    try {
        await fs.stat(localFilePath);
        return localFilePath;
    } catch (error) {
        // File doesn't exist, proceed with download
    }

    // Ensure the directory exists
    const dir = path.dirname(localFilePath);
    await fs.mkdir(dir, { recursive: true });

    // otherwise, download the file
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to download file: ${response.statusText}`);
    }

    const buffer = await response.arrayBuffer();
    await fs.writeFile(localFilePath, Buffer.from(buffer));

    return localFilePath;
}