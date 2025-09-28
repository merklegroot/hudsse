import { parseMachineModel } from '@/workflows/parseMachineModel';

describe('parseMachineModel', () => {
    it('should parse machine model information correctly', () => {
        const mockOutput = `Reading machine model information...
================================

System Product Name:
File: /sys/class/dmi/id/product_name
ROG Flow X13 GV301RE_GV301RE
--------------------------------

Motherboard Name:
File: /sys/class/dmi/id/board_name
GV301RE
--------------------------------

System Manufacturer:
File: /sys/class/dmi/id/sys_vendor
ASUSTeK COMPUTER INC.
--------------------------------

Machine model detection completed.`;

        const result = parseMachineModel(mockOutput);

        expect(result).toEqual({
            productName: 'ROG Flow X13 GV301RE_GV301RE',
            boardName: 'GV301RE',
            manufacturer: 'ASUSTeK COMPUTER INC.'
        });
    });

    it('should handle missing information gracefully', () => {
        const mockOutput = `Reading machine model information...
================================

System Product Name:
File: /sys/class/dmi/id/product_name
Error: File does not exist or is not readable
--------------------------------

Motherboard Name:
File: /sys/class/dmi/id/board_name
Error: File does not exist or is not readable
--------------------------------

System Manufacturer:
File: /sys/class/dmi/id/sys_vendor
Error: File does not exist or is not readable
--------------------------------

Machine model detection completed.`;

        const result = parseMachineModel(mockOutput);

        expect(result).toEqual({
            productName: null,
            boardName: null,
            manufacturer: null
        });
    });

    it('should handle partial information', () => {
        const mockOutput = `Reading machine model information...
================================

System Product Name:
File: /sys/class/dmi/id/product_name
ROG Flow X13 GV301RE_GV301RE
--------------------------------

Motherboard Name:
File: /sys/class/dmi/id/board_name
Error: File does not exist or is not readable
--------------------------------

System Manufacturer:
File: /sys/class/dmi/id/sys_vendor
ASUSTeK COMPUTER INC.
--------------------------------

Machine model detection completed.`;

        const result = parseMachineModel(mockOutput);

        expect(result).toEqual({
            productName: 'ROG Flow X13 GV301RE_GV301RE',
            boardName: null,
            manufacturer: 'ASUSTeK COMPUTER INC.'
        });
    });
});
