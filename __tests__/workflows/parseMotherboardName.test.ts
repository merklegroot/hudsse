import { parseMotherboardName } from '@/workflows/parseMotherboardName';

describe('parseMotherboardName', () => {
    it('should parse motherboard name correctly', () => {
        const mockOutput = `Reading motherboard information...
================================

Motherboard Name:
File: /sys/class/dmi/id/board_name
GV301RE
--------------------------------

Motherboard detection completed.`;

        const result = parseMotherboardName(mockOutput);

        expect(result).toEqual({
            motherboardName: 'GV301RE'
        });
    });

    it('should handle missing motherboard information gracefully', () => {
        const mockOutput = `Reading motherboard information...
================================

Motherboard Name:
File: /sys/class/dmi/id/board_name
Error: File does not exist or is not readable
--------------------------------

Motherboard detection completed.`;

        const result = parseMotherboardName(mockOutput);

        expect(result).toEqual({
            motherboardName: null
        });
    });

    it('should handle empty output', () => {
        const mockOutput = `Reading motherboard information...
================================

Motherboard Name:
File: /sys/class/dmi/id/board_name

--------------------------------

Motherboard detection completed.`;

        const result = parseMotherboardName(mockOutput);

        expect(result).toEqual({
            motherboardName: null
        });
    });

    it('should handle multiple lines and extract the first valid one', () => {
        const mockOutput = `Reading motherboard information...
================================

Motherboard Name:
File: /sys/class/dmi/id/board_name
GV301RE
Additional line that should be ignored
Another line
--------------------------------

Motherboard detection completed.`;

        const result = parseMotherboardName(mockOutput);

        expect(result).toEqual({
            motherboardName: 'GV301RE'
        });
    });
});
