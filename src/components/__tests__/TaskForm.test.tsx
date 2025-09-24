import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TaskForm } from '../TaskForm';
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
  onSubmit: jest.fn(),
  onCancel: jest.fn(),
  isEditing: false,
};

describe('TaskForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders form fields correctly', () => {
    render(<TaskForm {...mockProps} />);
    
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/priority/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/due date/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create task/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });

  it('shows "Update Task" button when editing', () => {
    render(<TaskForm {...mockProps} isEditing={true} />);
    
    expect(screen.getByRole('button', { name: /update task/i })).toBeInTheDocument();
  });

  it('populates form with initial data when provided', () => {
    render(<TaskForm {...mockProps} initialData={mockTask} />);
    
    expect(screen.getByDisplayValue('Test Task')).toBeInTheDocument();
    expect(screen.getByDisplayValue('This is a test task')).toBeInTheDocument();
    expect(screen.getByDisplayValue('medium')).toBeInTheDocument();
  });

  it('submits form with valid data', async () => {
    const user = userEvent.setup();
    render(<TaskForm {...mockProps} />);
    
    await user.type(screen.getByLabelText(/title/i), 'New Task');
    await user.type(screen.getByLabelText(/description/i), 'New Description');
    await user.selectOptions(screen.getByLabelText(/priority/i), 'high');
    
    await user.click(screen.getByRole('button', { name: /create task/i }));
    
    await waitFor(() => {
      expect(mockProps.onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'New Task',
          description: 'New Description',
          priority: 'high',
        })
      );
    });
  });

  it('shows validation error for empty title', async () => {
    const user = userEvent.setup();
    render(<TaskForm {...mockProps} />);
    
    await user.click(screen.getByRole('button', { name: /create task/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/title is required/i)).toBeInTheDocument();
    });
    
    expect(mockProps.onSubmit).not.toHaveBeenCalled();
  });

  it('shows validation error for title that is too short', async () => {
    const user = userEvent.setup();
    render(<TaskForm {...mockProps} />);
    
    await user.type(screen.getByLabelText(/title/i), 'A');
    await user.click(screen.getByRole('button', { name: /create task/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/title must be at least 2 characters/i)).toBeInTheDocument();
    });
    
    expect(mockProps.onSubmit).not.toHaveBeenCalled();
  });

  it('calls onCancel when cancel button is clicked', async () => {
    const user = userEvent.setup();
    render(<TaskForm {...mockProps} />);
    
    await user.click(screen.getByRole('button', { name: /cancel/i }));
    
    expect(mockProps.onCancel).toHaveBeenCalled();
  });

  it('resets form after successful submission', async () => {
    const user = userEvent.setup();
    render(<TaskForm {...mockProps} />);
    
    const titleInput = screen.getByLabelText(/title/i);
    const descriptionInput = screen.getByLabelText(/description/i);
    
    await user.type(titleInput, 'New Task');
    await user.type(descriptionInput, 'New Description');
    
    await user.click(screen.getByRole('button', { name: /create task/i }));
    
    await waitFor(() => {
      expect(mockProps.onSubmit).toHaveBeenCalled();
    });
    
    // Form should be reset after submission
    await waitFor(() => {
      expect(titleInput).toHaveValue('');
      expect(descriptionInput).toHaveValue('');
    });
  });

  it('handles date input correctly', async () => {
    const user = userEvent.setup();
    render(<TaskForm {...mockProps} />);
    
    const dateInput = screen.getByLabelText(/due date/i);
    await user.type(dateInput, '2024-12-25');
    
    await user.type(screen.getByLabelText(/title/i), 'Task with Date');
    await user.click(screen.getByRole('button', { name: /create task/i }));
    
    await waitFor(() => {
      expect(mockProps.onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Task with Date',
          dueDate: expect.any(Date),
        })
      );
    });
  });
});