import { useMessageStore } from '../../store/messageStore';
import { act, renderHook } from '@testing-library/react';

describe('messageStore', () => {
  it(`when a message is added, it should end up in the state's messages array`, () => {
    const { result } = renderHook(() => useMessageStore());
    
    // Initially, messages array should be empty
    expect(result.current.messages).toEqual([]);
    
    const testMessage = 'Test message';
    
    // Add a message
    act(() => {
      result.current.addMessage(testMessage);
    });
    
    // Verify the message was added to the state's messages array
    expect(result.current.messages).toHaveLength(1);
    expect(result.current.messages[0]).toEqual({
      type: 'other',
      contents: testMessage
    });
  });

  it(`should handle processing state`, () => {
    const { result } = renderHook(() => useMessageStore());
    
    // Initially, processing should be false
    expect(result.current.processingState.isProcessing).toBe(false);
    
    // Start processing
    act(() => {
      result.current.startProcessing('Test Title', 'Test Message');
    });
    
    // Verify processing state is updated
    expect(result.current.processingState.isProcessing).toBe(true);
    expect(result.current.processingState.title).toBe('Test Title');
    expect(result.current.processingState.message).toBe('Test Message');
    
    // Complete processing
    act(() => {
      result.current.completeProcessing();
    });
    
    // Verify processing state is reset
    expect(result.current.processingState.isProcessing).toBe(false);
    expect(result.current.processingState.title).toBe('');
    expect(result.current.processingState.message).toBe('');
  });
});