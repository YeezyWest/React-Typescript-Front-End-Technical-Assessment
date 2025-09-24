import { useEffect } from 'react';

interface KeyboardShortcuts {
  [key: string]: () => void;
}

/**
 * Custom hook for handling keyboard shortcuts
 * @param shortcuts - Object mapping key combinations to callback functions
 * @param enabled - Whether shortcuts are enabled (default: true)
 */
export function useKeyboardShortcuts(
  shortcuts: KeyboardShortcuts,
  enabled: boolean = true
) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Create a key combination string
      const keys: string[] = [];
      
      if (event.ctrlKey || event.metaKey) keys.push('ctrl');
      if (event.shiftKey) keys.push('shift');
      if (event.altKey) keys.push('alt');
      
      // Add the main key (convert to lowercase)
      const mainKey = event.key.toLowerCase();
      keys.push(mainKey);
      
      const combination = keys.join('+');
      
      // Check if this combination has a handler
      if (shortcuts[combination]) {
        event.preventDefault();
        shortcuts[combination]();
      }
    };

    // Add event listener
    document.addEventListener('keydown', handleKeyDown);

    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [shortcuts, enabled]);
}

/**
 * Hook specifically for task management shortcuts
 */
export function useTaskShortcuts({
  onNewTask,
  onEscape,
  onSearch,
  onSave,
}: {
  onNewTask?: () => void;
  onEscape?: () => void;
  onSearch?: () => void;
  onSave?: () => void;
}) {
  const shortcuts: KeyboardShortcuts = {};

  if (onNewTask) shortcuts['ctrl+n'] = onNewTask;
  if (onEscape) shortcuts['escape'] = onEscape;
  if (onSearch) shortcuts['ctrl+f'] = onSearch;
  if (onSave) shortcuts['ctrl+s'] = onSave;

  useKeyboardShortcuts(shortcuts);
}