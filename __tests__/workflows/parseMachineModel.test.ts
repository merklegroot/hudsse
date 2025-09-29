import { parseMachineModel } from '@/workflows/parseMachineModel';

describe('parseMachineModel', () => {
    it('should parse machine model information correctly', () => {
        const mockOutput = `Reading machine model...
================================

Machine Model:
File: /sys/class/dmi/id/product_name
ROG Flow X13 GV301RE_GV301RE
--------------------------------

Machine model detection completed.`;

        const result = parseMachineModel(mockOutput);

        expect(result).toEqual({
            productName: 'ROG Flow X13 GV301RE_GV301RE',
            boardName: null,
            manufacturer: null
        });
    });

    it('should handle missing information gracefully', () => {
        const mockOutput = `Reading machine model...
================================

Machine Model:
File: /sys/class/dmi/id/product_name
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

    it('should handle empty output', () => {
        const mockOutput = `Reading machine model...
================================

Machine Model:
File: /sys/class/dmi/id/product_name

--------------------------------

Machine model detection completed.`;

        const result = parseMachineModel(mockOutput);

        expect(result).toEqual({
            productName: null,
            boardName: null,
            manufacturer: null
        });
    });
});
