import { flexibleSseHandlerProps } from "@/workflows/sseFactory";
import { sseDotNetWorkflow } from "@/workflows/sseDotNetWorkflow";

describe('sseDotNetWorkflow', () => {
  it('should', () => {
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

    sseDotNetWorkflow.executeDotNetInfo(props as flexibleSseHandlerProps);
  });
});