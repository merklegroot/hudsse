import { DotNetInfoResult } from '@/models';
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

  it(`should add dotnet sdk`, () => {
    const { result } = renderHook(() => useMessageStore());
        
    const testMessage = 'Test message';
    const sdkVersion = '1.0.0';
    const sdkPath = 'path';
    
    act(() => {
      result.current.addMessage(testMessage);
      const info: Partial<DotNetInfoResult> = {
        installedSdks: [{ path: sdkPath, version: sdkVersion }]
      };
      result.current.setDotnetInfo(info as DotNetInfoResult)
    });

    expect(result.current.dotnetState?.dotnetSdks).toHaveLength(1);
    expect(result.current.dotnetState?.dotnetSdks[0].version).toBe(sdkVersion);
    expect(result.current.dotnetState?.dotnetSdks[0].path).toBe(sdkPath);
  });

  it(`should remove the sdks when there are none in the dotnet info result`, () => {
    const { result } = renderHook(() => useMessageStore());

    const testMessage = 'Test message';
    const sdkVersion = '1.0.0';
    const sdkPath = 'path';
    
    // First, add an SDK to the state
    act(() => {
      result.current.addMessage(testMessage);
      const initialInfo: Partial<DotNetInfoResult> = {
        installedSdks: [{ path: sdkPath, version: sdkVersion }]
      };
      result.current.setDotnetInfo(initialInfo as DotNetInfoResult);
    });

    // Verify SDK is initially present
    expect(result.current.dotnetState?.dotnetSdks).toHaveLength(1);
    
    // Then set empty SDKs to test removal
    act(() => {
      const info: Partial<DotNetInfoResult> = {
        installedSdks: []
      };
      result.current.setDotnetInfo(info as DotNetInfoResult);
    });

    expect(result.current.dotnetState?.dotnetSdks).toHaveLength(0);
  });

  it(`should update the path when the sdk for that version already exists.`, () => {
    const { result } = renderHook(() => useMessageStore());

    const testMessage = 'Test message';
    const sdkVersion = '1.0.0';
    const initialPath = 'path1';
    const updatedPath = 'path2';
    
    // First, add an SDK with the initial path
    act(() => {
      result.current.addMessage(testMessage);
      const initialInfo: Partial<DotNetInfoResult> = {
        installedSdks: [{ path: initialPath, version: sdkVersion }]
      };
      result.current.setDotnetInfo(initialInfo as DotNetInfoResult);
    });

    // Verify SDK is initially present with the first path
    expect(result.current.dotnetState?.dotnetSdks).toHaveLength(1);
    expect(result.current.dotnetState?.dotnetSdks[0].version).toBe(sdkVersion);
    expect(result.current.dotnetState?.dotnetSdks[0].path).toBe(initialPath);
    
    // Update the same SDK version with a new path
    act(() => {
      const updatedInfo: Partial<DotNetInfoResult> = {
        installedSdks: [{ path: updatedPath, version: sdkVersion }]
      };
      result.current.setDotnetInfo(updatedInfo as DotNetInfoResult);
    });

    // Verify the SDK still exists with the same version but updated path
    expect(result.current.dotnetState?.dotnetSdks).toHaveLength(1);
    expect(result.current.dotnetState?.dotnetSdks[0].version).toBe(sdkVersion);
    expect(result.current.dotnetState?.dotnetSdks[0].path).toBe(updatedPath);
  });

  it(`when an sdk version existed before and the result only contains a different version, then it should remove the old one and add the new one.`, () => {
    const { result } = renderHook(() => useMessageStore());

    const testMessage = 'Test message';
    const oldSdkVersion = '1.0.0';
    const oldSdkPath = 'path1';
    const newSdkVersion = '2.0.0';
    const newSdkPath = 'path2';
    
    // First, add an SDK with the old version
    act(() => {
      result.current.addMessage(testMessage);
      const initialInfo: Partial<DotNetInfoResult> = {
        installedSdks: [{ path: oldSdkPath, version: oldSdkVersion }]
      };
      result.current.setDotnetInfo(initialInfo as DotNetInfoResult);
    });

    // Verify the old SDK is initially present
    expect(result.current.dotnetState?.dotnetSdks).toHaveLength(1);
    expect(result.current.dotnetState?.dotnetSdks[0].version).toBe(oldSdkVersion);
    expect(result.current.dotnetState?.dotnetSdks[0].path).toBe(oldSdkPath);
    
    // Update with a completely different SDK version
    act(() => {
      const updatedInfo: Partial<DotNetInfoResult> = {
        installedSdks: [{ path: newSdkPath, version: newSdkVersion }]
      };
      result.current.setDotnetInfo(updatedInfo as DotNetInfoResult);
    });

    // Verify the old SDK is removed and the new one is added
    expect(result.current.dotnetState?.dotnetSdks).toHaveLength(1);
    expect(result.current.dotnetState?.dotnetSdks[0].version).toBe(newSdkVersion);
    expect(result.current.dotnetState?.dotnetSdks[0].path).toBe(newSdkPath);
    
    // Verify the old version is no longer present
    const oldSdkExists = result.current.dotnetState?.dotnetSdks.some(sdk => sdk.version === oldSdkVersion);
    expect(oldSdkExists).toBe(false);
  });
});