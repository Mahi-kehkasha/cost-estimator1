import { renderHook, act } from '@testing-library/react-hooks';
import { useProjectState } from './useProjectState';

test('should initialize with default state', () => {
  const { result } = renderHook(() => useProjectState());
  expect(result.current.step).toBe(1);
});

test('should update step', () => {
  const { result } = renderHook(() => useProjectState());
  act(() => {
    result.current.setStep(2);
  });
  expect(result.current.step).toBe(2);
});