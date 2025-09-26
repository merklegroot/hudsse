import { flexibleSseHandlerProps } from "@/workflows/sseFactory";
import { ssePathWorkflow } from "@/workflows/ssePathWorkflow";

describe('ssePathWorkflow', () => {
    it('should return the path', async () => {
        const mockController = {
            enqueue: jest.fn(),
            close: jest.fn(),
            error: jest.fn(),
            desiredSize: 1
        } as unknown as ReadableStreamDefaultController;

        const props: Partial<flexibleSseHandlerProps> = {
            controller: mockController,
            sendMessage: jest.fn(),
            onError: jest.fn()
        };
        
        const path = await ssePathWorkflow.executePath(props as flexibleSseHandlerProps);

        expect(path!.parsedData!.folders.length).toBeGreaterThan(0);
    });
});