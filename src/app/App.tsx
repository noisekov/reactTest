import AppBackground from '@/app/ui/AppBackground/AppBackground';
import TasksPage from '@/pages/tasks/ui/TasksPage';
import styles from './App.module.scss';

function App() {
  return (
    <div className={styles.appShell}>
      <AppBackground />
      <TasksPage />
    </div>
  );
}

export default App;
