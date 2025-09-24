import { useState, useMemo } from 'react';
import { Task, TaskFormData } from '../types/Task';
import { useLocalStorage } from './useLocalStorage';

/**
 * Custom hook for managing tasks with CRUD operations and search functionality
 * @returns Object containing tasks state and all task management functions
 */
export function useTasks() {
  const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', []);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Generate unique ID for new tasks
  const generateId = (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };

  // Add a new task
  const addTask = (taskData: TaskFormData) => {
    const newTask: Task = {
      id: generateId(),
      title: taskData.title,
      description: taskData.description,
      priority: taskData.priority,
      completed: false,
      dueDate: taskData.dueDate,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setTasks(prev => [...prev, newTask]);
  };

  // Edit an existing task
  const editTask = (taskData: TaskFormData) => {
    if (!editingTask) return;
    
    setTasks(prev => prev.map(task => 
      task.id === editingTask.id 
        ? {
            ...task,
            title: taskData.title,
            description: taskData.description,
            priority: taskData.priority,
            dueDate: taskData.dueDate,
            updatedAt: new Date(),
          }
        : task
    ));
    setEditingTask(null);
  };

  // Delete a task
  const deleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
    if (editingTask?.id === taskId) {
      setEditingTask(null);
    }
  };

  // Toggle task completion status
  const toggleTaskComplete = (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { 
            ...task, 
            completed: !task.completed,
            updatedAt: new Date(),
          }
        : task
    ));
  };

  // Start editing a task
  const startEditingTask = (task: Task) => {
    setEditingTask(task);
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingTask(null);
  };

  // Clear all tasks
  const clearAllTasks = () => {
    setTasks([]);
    setEditingTask(null);
    setSearchQuery('');
  };

  // Filter tasks based on search query
  const filteredTasks = useMemo(() => {
    if (!searchQuery.trim()) return tasks;
    
    const query = searchQuery.toLowerCase();
    return tasks.filter(task => 
      task.title.toLowerCase().includes(query) ||
      task.description.toLowerCase().includes(query)
    );
  }, [tasks, searchQuery]);

  // Get task statistics
  const taskStats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const pending = total - completed;
    const overdue = tasks.filter(task => {
      if (!task.dueDate || task.completed) return false;
      return new Date(task.dueDate) < new Date();
    }).length;

    return { total, completed, pending, overdue };
  }, [tasks]);

  return {
    // State
    tasks,
    editingTask,
    searchQuery,
    filteredTasks,
    taskStats,
    
    // Actions
    addTask,
    editTask,
    deleteTask,
    toggleTaskComplete,
    startEditingTask,
    cancelEditing,
    clearAllTasks,
    setSearchQuery,
  };
}