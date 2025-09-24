import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from '../useLocalStorage';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('useLocalStorage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('returns initial value when localStorage is empty', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial-value'));
    
    expect(result.current[0]).toBe('initial-value');
    expect(localStorageMock.getItem).toHaveBeenCalledWith('test-key');
  });

  it('returns stored value from localStorage', () => {
    localStorageMock.getItem.mockReturnValue(JSON.stringify('stored-value'));
    
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial-value'));
    
    expect(result.current[0]).toBe('stored-value');
    expect(localStorageMock.getItem).toHaveBeenCalledWith('test-key');
  });

  it('handles complex objects', () => {
    const storedObject = { name: 'John', age: 30 };
    localStorageMock.getItem.mockReturnValue(JSON.stringify(storedObject));
    
    const { result } = renderHook(() => useLocalStorage('test-key', {}));
    
    expect(result.current[0]).toEqual(storedObject);
  });

  it('handles arrays', () => {
    const storedArray = [1, 2, 3, 4, 5];
    localStorageMock.getItem.mockReturnValue(JSON.stringify(storedArray));
    
    const { result } = renderHook(() => useLocalStorage('test-key', []));
    
    expect(result.current[0]).toEqual(storedArray);
  });

  it('updates value and saves to localStorage', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial-value'));
    
    act(() => {
      result.current[1]('new-value');
    });
    
    expect(result.current[0]).toBe('new-value');
    expect(localStorageMock.setItem).toHaveBeenCalledWith('test-key', JSON.stringify('new-value'));
  });

  it('updates value with function updater', () => {
    localStorageMock.getItem.mockReturnValue(JSON.stringify(10));
    const { result } = renderHook(() => useLocalStorage('test-key', 0));
    
    act(() => {
      result.current[1]((prev: number) => prev + 5);
    });
    
    expect(result.current[0]).toBe(15);
    expect(localStorageMock.setItem).toHaveBeenCalledWith('test-key', JSON.stringify(15));
  });

  it('handles localStorage errors gracefully', () => {
    localStorageMock.getItem.mockImplementation(() => {
      throw new Error('localStorage error');
    });
    
    const { result } = renderHook(() => useLocalStorage('test-key', 'fallback-value'));
    
    expect(result.current[0]).toBe('fallback-value');
  });

  it('handles setItem errors gracefully', () => {
    localStorageMock.setItem.mockImplementation(() => {
      throw new Error('localStorage setItem error');
    });
    
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial-value'));
    
    // Should not throw error when setting value
    act(() => {
      result.current[1]('new-value');
    });
    
    expect(result.current[0]).toBe('new-value');
  });

  it('handles invalid JSON in localStorage', () => {
    localStorageMock.getItem.mockReturnValue('invalid-json{');
    
    const { result } = renderHook(() => useLocalStorage('test-key', 'fallback-value'));
    
    expect(result.current[0]).toBe('fallback-value');
  });

  it('works with boolean values', () => {
    localStorageMock.getItem.mockReturnValue(JSON.stringify(true));
    
    const { result } = renderHook(() => useLocalStorage('test-key', false));
    
    expect(result.current[0]).toBe(true);
    
    act(() => {
      result.current[1](false);
    });
    
    expect(result.current[0]).toBe(false);
    expect(localStorageMock.setItem).toHaveBeenCalledWith('test-key', JSON.stringify(false));
  });

  it('works with null values', () => {
    localStorageMock.getItem.mockReturnValue(JSON.stringify(null));
    
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'));
    
    expect(result.current[0]).toBe(null);
  });
});