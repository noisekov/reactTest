import styles from "./components/App.module.scss";

function App() {
  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <span className={styles.eyebrow}>шаблон</span>
        <h1>React + TypeScript + Webpack</h1>
        <div className={styles.stack}>
          <span>React 18</span>
        </div>
      </section>
    </main>
  );
}

export default App;
