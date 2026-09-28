import React, { useState, useEffect } from "react";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  finishTask,
} from "./services/api";
import "./TaskManager.css";

/**
 * Componente App
 * Controlador principal que conecta con el backend en Go y PostgreSQL.
 *
 * @returns {JSX.Element} La aplicación completa.
 */
function App() {
  const [tasks, setTasks] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Carga todas las tareas desde el backend.
   */
  const loadTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTasks();
      setTasks(data || []);
    } catch (err) {
      console.error("Error al cargar tareas:", err);
      setError("No se pudo conectar con el servidor backend. Verifica que esté en ejecución.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  /**
   * Maneja el guardado o actualización de una tarea en el backend.
   *
   * @param {Object} taskData - Los datos recolectados del formulario.
   */
  const handleSaveTask = async (taskData) => {
    try {
      if (taskData.id) {
        await updateTask(taskData.id, taskData);
      } else {
        await createTask(taskData);
      }
      await loadTasks();
      setIsFormOpen(false);
      setTaskToEdit(null);
    } catch (err) {
      console.error("Error al guardar la tarea:", err);
      alert(`Error al guardar la tarea: ${err.message}`);
    }
  };

  /**
   * Prepara el formulario para editar una tarea existente.
   *
   * @param {Object} task - La tarea a editar.
   */
  const handleEdit = (task) => {
    setTaskToEdit(task);
    setIsFormOpen(true);
  };

  /**
   * Elimina una tarea del backend mediante su ID.
   *
   * @param {number} id - Identificador de la tarea.
   */
  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar esta tarea?")) {
      return;
    }
    try {
      await deleteTask(id);
      await loadTasks();
    } catch (err) {
      console.error("Error al eliminar la tarea:", err);
      alert(`Error al eliminar la tarea: ${err.message}`);
    }
  };

  /**
   * Cambia el estado de la tarea a 'Finalizada' en el backend.
   *
   * @param {number} id - Identificador de la tarea.
   */
  const handleFinish = async (id) => {
    try {
      await finishTask(id);
      await loadTasks();
    } catch (err) {
      console.error("Error al finalizar la tarea:", err);
      alert(`Error al finalizar la tarea: ${err.message}`);
    }
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1 className="title">Gestor de Tareas</h1>
        {!isFormOpen && (
          <button className="glass-btn" onClick={() => { setTaskToEdit(null); setIsFormOpen(true); }}>
            + Nueva Tarea
          </button>
        )}
      </header>

      {error && (
        <div
          style={{
            background: "rgba(255, 77, 79, 0.2)",
            border: "1px solid rgba(255, 77, 79, 0.5)",
            color: "#ff7b72",
            padding: "1rem",
            borderRadius: "8px",
            marginBottom: "1rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>{error}</span>
          <button
            className="glass-btn"
            style={{ fontSize: "0.8rem", padding: "4px 8px" }}
            onClick={loadTasks}
          >
            Reintentar
          </button>
        </div>
      )}

      {loading ? (
        <div className="glass-panel" style={{ textAlign: "center", padding: "2rem" }}>
          <p>Cargando tareas desde la base de datos...</p>
        </div>
      ) : isFormOpen ? (
        <TaskForm
          onSubmit={handleSaveTask}
          initialData={taskToEdit}
          onCancel={() => {
            setIsFormOpen(false);
            setTaskToEdit(null);
          }}
        />
      ) : (
        <TaskList
          tasks={tasks}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onFinish={handleFinish}
        />
      )}
    </div>
  );
}

export default App;
