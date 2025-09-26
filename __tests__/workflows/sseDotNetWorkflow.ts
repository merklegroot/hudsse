import { flexibleSseHandlerProps } from "@/workflows/sseFactory";
import { sseDotNetWorkflow } from "@/workflows/sseDotNetWorkflow";

describe('sseDotNetWorkflow', () => {
  it('should handle missing dotnet command gracefully', async () => {
    const mockController = {
        enqueue: jest.fn(),
        close: jest.fn(),
        error: jest.fn(),
        desiredSize: 1
    } as unknown as ReadableStreamDefaultController;

    const mockSendMessage = jest.fn();
    const mockOnError = jest.fn();

    const props: flexibleSseHandlerProps = {
        controller: mockController,
        sendMessage: mockSendMessage,
        onError: mockOnError,
        req: new Request('http://localhost:3000/api/sse/dotnet/info') as any
    };

    const result = await sseDotNetWorkflow.executeDotNetInfo(props);

    // Should handle missing dotnet command gracefully
    expect(result.wasSuccessful).toBe(false);
    expect(result.exitCode).toBeNull();
    expect(result.parsedData).toBeUndefined();
    expect(mockSendMessage).toHaveBeenCalledWith({ type: 'other', contents: 'Executing dotnet --info command...' });
  });
});