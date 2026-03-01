import { DiskInfoResult, DiskInfo, PhysicalDisk } from '../models/SseMessage';
import { platformType, platformUtil } from '@/utils/platformUtil';

// Helper to format bytes (similar to old project)
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function parseDiskInfo(output: string): DiskInfo[] {
  const currentPlatform = platformUtil.detectPlatform();
  const disks: DiskInfo[] = [];
  const lines = output.split('\n').filter(line => line.trim().length > 0);

  if (currentPlatform === platformType.linux || currentPlatform === platformType.mac) {
    // Parse df output: source,target,size,used,avail,pcent
    // Skip header line
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      const parts = line.trim().split(/\s+/);
      
      if (parts.length >= 6) {
        const filesystem = parts[0];
        const mount = parts[1];
        const total = parts[2];
        const used = parts[3];
        const available = parts[4];
        const usedPercentStr = parts[5].replace('%', '');
        const usedPercent = parseInt(usedPercentStr) || 0;

        // Filter out virtual filesystems
        if (!filesystem.includes('tmpfs') && !filesystem.includes('devtmpfs') && mount !== 'none') {
          if (mount.startsWith('/') || mount === '/') {
            disks.push({
              mount,
              total,
              used,
              available,
              usedPercent,
              filesystem
            });
          }
        }
      }
    }
  } else if (currentPlatform === platformType.windows) {
    // Parse wmic logicaldisk output (CSV format)
    // Format: Node,Caption,FreeSpace,Size
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      const parts = line.split(',');

      if (parts.length >= 4 && parts[1] && parts[2] && parts[3]) {
        const caption = parts[1].trim();
        const freeSpace = parseInt(parts[2]) || 0;
        const totalSpace = parseInt(parts[3]) || 0;
        const usedSpace = totalSpace - freeSpace;
        const usedPercent = totalSpace > 0 ? Math.round((usedSpace / totalSpace) * 100) : 0;

        disks.push({
          mount: caption,
          total: formatBytes(totalSpace),
          used: formatBytes(usedSpace),
          available: formatBytes(freeSpace),
          usedPercent,
          filesystem: 'NTFS'
        });
      }
    }
  }

  return disks.length > 0 ? disks : [];
}

export function parsePhysicalDisks(output: string): PhysicalDisk[] {
  const currentPlatform = platformUtil.detectPlatform();
  const physicalDisks: PhysicalDisk[] = [];
  const lines = output.split('\n').filter(line => line.trim().length > 0);

  if (currentPlatform === platformType.linux) {
    // Parse lsblk output: NAME,SIZE,MODEL,ROTA
    // Format: sda 500G Samsung SSD 860 EVO 0
    for (const line of lines) {
      const parts = line.trim().split(/\s+/);

      if (parts.length >= 3) {
        const device = parts[0];
        const size = parts[1];
        const model = parts.slice(2, -1).join(' ') || 'Unknown';
        const isRotational = parts[parts.length - 1] === '1';
        const type = isRotational ? 'HDD' : 'SSD';

        // Filter out loop and ram devices
        if (!device.includes('loop') && !device.includes('ram')) {
          physicalDisks.push({
            device: `/dev/${device}`,
            size,
            model: model.trim() || 'Unknown',
            type
          });
        }
      }
    }
  } else if (currentPlatform === platformType.windows) {
    // Parse wmic diskdrive output (CSV format)
    // Format: Node,Caption,Model,Size
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      const parts = line.split(',');

      if (parts.length >= 4 && parts[1] && parts[2] && parts[3]) {
        const caption = parts[1].trim();
        const model = parts[2].trim() || 'Unknown';
        const sizeBytes = parseInt(parts[3]) || 0;
        const size = formatBytes(sizeBytes);

        physicalDisks.push({
          device: caption,
          size,
          model,
          type: 'Unknown'
        });
      }
    }
  }

  return physicalDisks;
}
