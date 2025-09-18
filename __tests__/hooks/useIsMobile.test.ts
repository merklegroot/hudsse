import { renderHook } from '@testing-library/react';
import { useIsMobile } from '../../hooks/useIsMobile';

// Mock window and navigator
const mockUserAgent = (userAgent: string) => {
  Object.defineProperty(navigator, 'userAgent', {
    writable: true,
    value: userAgent,
  });
};

const mockWindowSize = (width: number, height: number) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    value: width,
  });
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    value: height,
  });
};

const mockTouchSupport = (hasTouch: boolean) => {
  Object.defineProperty(window, 'ontouchstart', {
    writable: true,
    value: hasTouch ? {} : undefined,
  });
  Object.defineProperty(navigator, 'maxTouchPoints', {
    writable: true,
    value: hasTouch ? 1 : 0,
  });
};

describe('useIsMobile', () => {
  beforeEach(() => {
    // Reset mocks
    mockUserAgent('');
    mockWindowSize(1024, 768);
    mockTouchSupport(false);
  });

  it('should return false for desktop user agent', () => {
    mockUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);
  });

  it('should return true for mobile user agent', () => {
    mockUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)');
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);
  });

  it('should return true for Android user agent', () => {
    mockUserAgent('Mozilla/5.0 (Linux; Android 10; SM-G975F) AppleWebKit/537.36');
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);
  });

  it('should return true for small screen with touch support', () => {
    mockUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
    mockWindowSize(600, 800);
    mockTouchSupport(true);
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);
  });

  it('should return false for large screen with touch support', () => {
    mockUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
    mockWindowSize(1024, 768);
    mockTouchSupport(true);
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);
  });
});
