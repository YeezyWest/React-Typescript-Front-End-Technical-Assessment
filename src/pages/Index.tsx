import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, CheckCircle2, Plus, FileText, AlertTriangle, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useTimer } from "@/hooks/useTimer";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Task, TaskFormData } from "@/types/Task";
import { TaskCard } from "@/components/TaskCard";
import { TaskForm } from "@/components/TaskForm";
import { useTasks } from "@/hooks/useTasks";
import { useTaskShortcuts } from "@/hooks/useKeyboardShortcuts";
import { motion, AnimatePresence } from "framer-motion";

const Index = () => {
  const [showForm, setShowForm] = useState(false);
  const [testStarted, setTestStarted] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  const { timeRemaining, isTimeUp, formatTime, startTimer, resetTimer } = useTimer(3600); // 60 minutes
  
  // Use custom hooks for task management
  const {
    tasks,
    editingTask,
    searchQuery,
    filteredTasks,
    taskStats,
    addTask,
    editTask,
    deleteTask,
    toggleTaskComplete,
    startEditingTask,
    cancelEditing,
    clearAllTasks,
    setSearchQuery,
  } = useTasks();

  // Handle task form submission
  const handleAddTask = async (formData: TaskFormData) => {
    addTask(formData);
    setShowForm(false);
  };

  const handleEditTask = async (formData: TaskFormData) => {
    editTask(formData);
    setShowForm(false);
  };

  const handleEditClick = (task: Task) => {
    startEditingTask(task);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    cancelEditing();
  };

  // Keyboard shortcuts
  useTaskShortcuts({
    onNewTask: () => {
      if (!showForm) {
        setShowForm(true);
        cancelEditing();
      }
    },
    onEscape: () => {
      if (showForm) {
        handleCancelForm();
      }
    },
    onSearch: () => {
      searchInputRef.current?.focus();
    },
  });

  const handleStartTest = () => {
    setTestStarted(true);
    startTimer();
  };
  
  const handleResetTest = () => {
    setTestStarted(false);
    resetTimer();
    clearAllTasks();
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-destructive bg-clip-text text-transparent">
                60-Minute Frontend Test
              </h1>
              <p className="text-muted-foreground mt-2">
                Build a Task Management Application
              </p>
            </div>
            <div className="flex items-center gap-4">
              {!testStarted ? (
                <Button onClick={handleStartTest} size="lg" className="bg-primary hover:bg-primary/90">
                  Start Test
                </Button>
              ) : (
                <>
                  <div className={`flex items-center gap-2 text-sm font-medium px-3 py-1 rounded-full ${
                    timeRemaining <= 300 ? 'bg-destructive/20 text-destructive' : 
                    timeRemaining <= 900 ? 'bg-warning/20 text-warning' : 
                    'bg-muted text-muted-foreground'
                  }`}>
                    <Clock className="w-4 h-4" />
                    <span>Time Remaining: {formatTime(timeRemaining)}</span>
                  </div>
                  <Button onClick={handleResetTest} variant="outline" size="sm">
                    Reset Test
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Time Up Alert */}
        {isTimeUp && (
          <Alert className="mb-6 border-destructive bg-destructive/10">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <AlertDescription className="text-destructive font-medium">
              Time's up! The 60-minute test period has ended. Please stop coding and review your work.
            </AlertDescription>
          </Alert>
        )}
        
        {/* Test Not Started State */}
        {!testStarted && (
          <div className="flex items-center justify-center min-h-[60vh]">
            <Card className="max-w-2xl">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Ready to Start Your 60-Minute Test?</CardTitle>
                <CardDescription className="text-lg">
                  Once you click "Start Test", the timer will begin and you'll have exactly 60 minutes to complete the task management application.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">What you'll be building:</h3>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• TaskCard component with proper TypeScript interfaces</li>
                    <li>• CRUD operations with localStorage persistence</li>
                    <li>• Validated task form with error handling</li>
                    <li>• Responsive design with smooth animations</li>
                    <li>• One advanced feature (search, sort, or drag & drop)</li>
                  </ul>
                </div>
                <div className="flex justify-center pt-4">
                  <Button onClick={handleStartTest} size="lg" className="bg-primary hover:bg-primary/90">
                    <Clock className="w-4 h-4 mr-2" />
                    Start 60-Minute Test
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        
        {/* Test Content - Only show when test is started */}
        {testStarted && (
        <>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Requirements Panel */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Test Requirements
                </CardTitle>
                <CardDescription>
                  Complete these features within 60 minutes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">✅ Project Setup (5min)</h4>
                  <p className="text-xs text-muted-foreground">Understanding the codebase and technologies</p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">🔲 TaskCard Component (15min)</h4>
                  <p className="text-xs text-muted-foreground">Create reusable task display component</p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm">🔲 State Management (10min)</h4>
                  <p className="text-xs text-muted-foreground">CRUD operations with localStorage</p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm">🔲 Task Form (15min)</h4>
                  <p className="text-xs text-muted-foreground">Form with validation and error handling</p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm">🔲 Styling & UX (10min)</h4>
                  <p className="text-xs text-muted-foreground">Animations, responsive design, accessibility</p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm">🔲 Advanced Feature (5min)</h4>
                  <p className="text-xs text-muted-foreground">Search, sort, or drag & drop</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Application Area */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {/* Action Bar */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-semibold">My Tasks</h2>
                  <p className="text-muted-foreground">
                    {tasks.length === 0 ? "No tasks yet" : `${tasks.length} tasks`}
                  </p>
                </div>
                <Button 
                  onClick={() => setShowForm(!showForm)}
                  className="bg-primary hover:bg-primary/90"
                  disabled={isTimeUp}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Task
                </Button>
              </div>

              {/* TaskForm component */}
              <AnimatePresence mode="wait">
                {showForm && (
                  <motion.div
                    key="task-form"
                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 30,
                      mass: 0.8
                    }}
                  >
                    <TaskForm
                      initialData={editingTask || undefined}
                      onSubmit={editingTask ? handleEditTask : handleAddTask}
                      onCancel={handleCancelForm}
                      isEditing={!!editingTask}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Search Bar */}
              {tasks.length > 0 && (
                <div className="relative animate-in slide-in-from-top-2 duration-300">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 transition-colors duration-200" />
                  <Input
                    ref={searchInputRef}
                    placeholder="Search tasks... (Ctrl+F)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              )}

              {/* Task List Area */}
              <div className="space-y-4">
                {tasks.length === 0 ? (
                  <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <CheckCircle2 className="w-12 h-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">No tasks yet</h3>
                      <p className="text-muted-foreground text-center max-w-sm">
                        Get started by creating your first task. Click the "Add Task" button above.
                      </p>
                    </CardContent>
                  </Card>
                ) : filteredTasks.length === 0 ? (
                  <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <Search className="w-12 h-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">No tasks found</h3>
                      <p className="text-muted-foreground text-center max-w-sm">
                        Try adjusting your search query.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <motion.div 
                    className="grid gap-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <AnimatePresence mode="popLayout">
                      {filteredTasks.map((task, index) => (
                        <motion.div
                          key={task.id}
                          initial={{ opacity: 0, y: 20, scale: 0.95 }}
                          animate={{ 
                            opacity: 1, 
                            y: 0, 
                            scale: 1,
                            transition: { 
                              delay: index * 0.05,
                              type: "spring",
                              stiffness: 300,
                              damping: 30
                            }
                          }}
                          exit={{ 
                            opacity: 0, 
                            y: -20, 
                            scale: 0.95,
                            transition: { duration: 0.2 }
                          }}
                          layout
                        >
                          <TaskCard
                            task={task}
                            onEdit={handleEditClick}
                            onDelete={deleteTask}
                            onToggleComplete={toggleTaskComplete}
                          />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Instructions Footer */}
        <div className="mt-12 pt-8 border-t border-border">
          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-3">Getting Started Instructions:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-medium mb-2">1. Create TypeScript Interfaces</h4>
                  <p className="text-muted-foreground">Define the Task interface with proper types</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">2. Build TaskCard Component</h4>
                  <p className="text-muted-foreground">Display task info with edit/delete actions</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">3. Implement State Management</h4>
                  <p className="text-muted-foreground">CRUD operations with localStorage persistence</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">4. Create Task Form</h4>
                  <p className="text-muted-foreground">Validated form with error handling</p>
                </div>
              </div>
              <div className="mt-4 p-4 bg-primary/10 rounded-lg">
                <p className="text-sm">
                  <strong>💡 Pro tip:</strong> Focus on functionality first, then polish the styling. 
                  Use the design system tokens (priority.high, priority.medium, priority.low) for consistent colors.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
        </>
        )}
      </div>
    </div>
  );
};

export default Index;