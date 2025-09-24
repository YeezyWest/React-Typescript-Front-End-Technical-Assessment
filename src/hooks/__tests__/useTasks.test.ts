import { renderHook, act } from '@testing-library/react';
import { useTasks } from '../useTasks';
import { Task, Priority } from '../../types/Task';

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

const mockTask: Task = {
  id: '1',
  title: 'Test Task',
  description: 'This is a test task',
  completed: false,
  priority: 'medium' as Priority,
  dueDate: new Date('2024-12-31'),
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
};

describe('useTasks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  it('initializes with empty tasks array', () => {
    const { result } = renderHook(() => useTasks());
    
    expect(result.current.tasks).toEqual([]);
    expect(result.current.filteredTasks).toEqual([]);
    expect(result.current.searchQuery).toBe('');
    expect(result.current.editingTask).toBeNull();
  });

  it('loads tasks from localStorage on initialization', () => {
    const storedTasks = [mockTask];
    localStorageMock.getItem.mockReturnValue(JSON.stringify(storedTasks));
    
    const { result } = renderHook(() => useTasks());
    
    expect(result.current.tasks).toHaveLength(1);
    expect(result.current.tasks[0].title).toBe('Test Task');
  });

  it('adds a new task', () => {
    const { result } = renderHook(() => useTasks());
    
    const newTaskData = {
      title: 'New Task',
      description: 'New Description',
      priority: 'high' as Priority,
      dueDate: new Date('2024-12-25'),
    };
    
    act(() => {
      result.current.addTask(newTaskData);
    });
    
    expect(result.current.tasks).toHaveLength(1);
    expect(result.current.tasks[0].title).toBe('New Task');
    expect(result.current.tasks[0].completed).toBe(false);
    expect(localStorageMock.setItem).toHaveBeenCalled();
  });

  it('updates an existing task', () => {
    localStorageMock.getItem.mockReturnValue(JSON.stringify([mockTask]));
    const { result } = renderHook(() => useTasks());
    
    const updatedTaskData = {
      title: 'Updated Task',
      description: 'Updated Description',
      priority: 'high' as Priority,
    };
    
    act(() => {
      result.current.startEditingTask(mockTask);
    });
    
    act(() => {
      result.current.editTask(updatedTaskData);
    });
    
    expect(result.current.tasks[0].title).toBe('Updated Task');
    expect(result.current.tasks[0].description).toBe('Updated Description');
    expect(result.current.tasks[0].priority).toBe('high');
    expect(localStorageMock.setItem).toHaveBeenCalled();
  });

  it('deletes a task', () => {
    localStorageMock.getItem.mockReturnValue(JSON.stringify([mockTask]));
    const { result } = renderHook(() => useTasks());
    
    act(() => {
      result.current.deleteTask('1');
    });
    
    expect(result.current.tasks).toHaveLength(0);
    expect(localStorageMock.setItem).toHaveBeenCalled();
  });

  it('toggles task completion', () => {
    localStorageMock.getItem.mockReturnValue(JSON.stringify([mockTask]));
    const { result } = renderHook(() => useTasks());
    
    act(() => {
      result.current.toggleTaskComplete('1');
    });
    
    expect(result.current.tasks[0].completed).toBe(true);
    expect(localStorageMock.setItem).toHaveBeenCalled();
  });

  it('filters tasks by search query', () => {
    const tasks = [
      { ...mockTask, id: '1', title: 'Task One' },
      { ...mockTask, id: '2', title: 'Task Two' },
      { ...mockTask, id: '3', title: 'Different Task' },
    ];
    localStorageMock.getItem.mockReturnValue(JSON.stringify(tasks));
    const { result } = renderHook(() => useTasks());
    
    act(() => {
      result.current.setSearchQuery('One');
    });
    
    expect(result.current.filteredTasks).toHaveLength(1);
    expect(result.current.filteredTasks[0].title).toBe('Task One');
  });

  it('filters tasks by description', () => {
    const tasks = [
      { ...mockTask, id: '1', title: 'Task One', description: 'Important task' },
      { ...mockTask, id: '2', title: 'Task Two', description: 'Regular task' },
    ];
    localStorageMock.getItem.mockReturnValue(JSON.stringify(tasks));
    const { result } = renderHook(() => useTasks());
    
    act(() => {
      result.current.setSearchQuery('Important');
    });
    
    expect(result.current.filteredTasks).toHaveLength(1);
    expect(result.current.filteredTasks[0].description).toBe('Important task');
  });

  it('sets and clears editing task', () => {
    localStorageMock.getItem.mockReturnValue(JSON.stringify([mockTask]));
    const { result } = renderHook(() => useTasks());
    
    act(() => {
      result.current.startEditingTask(mockTask);
    });
    
    expect(result.current.editingTask).toEqual(mockTask);
    
    act(() => {
      result.current.cancelEditing();
    });
    
    expect(result.current.editingTask).toBeNull();
  });

  it('clears all tasks', () => {
    localStorageMock.getItem.mockReturnValue(JSON.stringify([mockTask]));
    const { result } = renderHook(() => useTasks());
    
    act(() => {
      result.current.clearAllTasks();
    });
    
    expect(result.current.tasks).toHaveLength(0);
    expect(result.current.editingTask).toBeNull();
    expect(result.current.searchQuery).toBe('');
    expect(localStorageMock.setItem).toHaveBeenCalledWith('tasks', JSON.stringify([]));
  });
});