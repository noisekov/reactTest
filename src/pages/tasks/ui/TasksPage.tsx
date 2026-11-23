import { useCallback, useMemo, useState } from 'react';
import type { Task, TaskDraft, TaskStatus } from '@/entities/task/model/task.types';
import { filterTasks } from '@/features/task-search/model/filterTasks';
import { useTaskBoard } from '@/pages/tasks/model/useTaskBoard';
import KanbanBoard from '@/widgets/kanban-board/ui/KanbanBoard';
import TaskSearch from '@/features/task-search/ui/TaskSearch';
import styles from './TasksPage.module.scss';

type EditorState =
  | { mode: 'create'; status: TaskStatus }
  | { mode: 'edit'; taskId: number }
  | null;

function TasksPage() {
  const { tasks, createTask, updateTask, deleteTask, moveTask } = useTaskBoard();
  const [searchQuery, setSearchQuery] = useState('');
  const [editor, setEditor] = useState<EditorState>(null);

  const filteredTasks = useMemo(
    () => filterTasks(tasks, searchQuery),
    [tasks, searchQuery]
  );

  const editingTaskId = editor?.mode === 'edit' ? editor.taskId : null;
  const creatingStatus = editor?.mode === 'create' ? editor.status : null;

  const visibleTasks = useMemo(() => {
    if (editingTaskId === null) return filteredTasks;

    const editingTask = tasks.find((task) => task.id === editingTaskId);
    if (!editingTask || filteredTasks.some((task) => task.id === editingTaskId)) {
      return filteredTasks;
    }

    return [...filteredTasks, editingTask];
  }, [editingTaskId, filteredTasks, tasks]);

  const handleCreateTask = useCallback((status: TaskStatus) => {
    setEditor({ mode: 'create', status });
  }, []);

  const handleEditTask = useCallback((task: Task) => {
    setEditor({ mode: 'edit', taskId: task.id });
  }, []);

  const handleCancelEditor = useCallback(() => {
    setEditor(null);
  }, []);

  const handleSaveTask = useCallback((task: Task | null, draft: TaskDraft) => {
    if (task) {
      updateTask(task.id, draft);
    } else {
      createTask(draft);
    }

    setEditor(null);
  }, [createTask, updateTask]);

  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <header className={styles.header}>
          <h1>Your tasks</h1>
          <TaskSearch value={searchQuery} onChange={setSearchQuery} />
        </header>

        <KanbanBoard
          tasks={visibleTasks}
          totalTasks={tasks.length}
          editingTaskId={editingTaskId}
          creatingStatus={creatingStatus}
          onEditTask={handleEditTask}
          onDeleteTask={deleteTask}
          onCreateTask={handleCreateTask}
          onMoveTask={moveTask}
          onCancelEditor={handleCancelEditor}
          onSaveTask={handleSaveTask}
        />
      </div>
    </main>
  );
}

export default TasksPage;
