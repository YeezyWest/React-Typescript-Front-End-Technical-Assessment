import { render, screen, fireEvent } from '@testing-library/react';
import { TaskCard } from '../TaskCard';
import { Task, Priority } from '../../types/Task';

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

const mockProps = {
  task: mockTask,
  onEdit: jest.fn(),
  onDelete: jest.fn(),
  onToggleComplete: jest.fn(),
};

describe('TaskCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders task information correctly', () => {
    render(<TaskCard {...mockProps} />);
    
    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('This is a test task')).toBeInTheDocument();
    expect(screen.getByText('Medium')).toBeInTheDocument();
    expect(screen.getByText('Dec 31, 2024')).toBeInTheDocument();
  });

  it('shows completed state correctly', () => {
    const completedTask = { ...mockTask, completed: true };
    render(<TaskCard {...mockProps} task={completedTask} />);
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
  });

  it('shows incomplete state correctly', () => {
    render(<TaskCard {...mockProps} />);
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
  });

  it('calls onToggleComplete when checkbox is clicked', () => {
    render(<TaskCard {...mockProps} />);
    
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    
    expect(mockProps.onToggleComplete).toHaveBeenCalledWith('1');
  });

  it('calls onEdit when edit button is clicked', () => {
    render(<TaskCard {...mockProps} />);
    
    const editButton = screen.getByLabelText('Edit task');
    fireEvent.click(editButton);
    
    expect(mockProps.onEdit).toHaveBeenCalledWith(mockTask);
  });

  it('calls onDelete when delete button is clicked', () => {
    render(<TaskCard {...mockProps} />);
    
    const deleteButton = screen.getByLabelText('Delete task');
    fireEvent.click(deleteButton);
    
    expect(mockProps.onDelete).toHaveBeenCalledWith('1');
  });

  it('displays correct priority color for high priority', () => {
    const highPriorityTask = { ...mockTask, priority: 'high' as Priority };
    render(<TaskCard {...mockProps} task={highPriorityTask} />);
    
    const priorityBadge = screen.getByText('High');
    expect(priorityBadge).toHaveClass('bg-red-100', 'text-red-800');
  });

  it('displays correct priority color for low priority', () => {
    const lowPriorityTask = { ...mockTask, priority: 'low' as Priority };
    render(<TaskCard {...mockProps} task={lowPriorityTask} />);
    
    const priorityBadge = screen.getByText('Low');
    expect(priorityBadge).toHaveClass('bg-green-100', 'text-green-800');
  });

  it('handles task without due date', () => {
    const taskWithoutDueDate = { ...mockTask, dueDate: undefined };
    render(<TaskCard {...mockProps} task={taskWithoutDueDate} />);
    
    expect(screen.queryByText(/Dec 31, 2024/)).not.toBeInTheDocument();
  });

  it('handles task without description', () => {
    const taskWithoutDescription = { ...mockTask, description: undefined };
    render(<TaskCard {...mockProps} task={taskWithoutDescription} />);
    
    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.queryByText('This is a test task')).not.toBeInTheDocument();
  });
});