import React from "react";

/**
 * Componente TaskList
 * Muestra las tareas creadas y permite editarlas, eliminarlas o finalizarlas.
 *
 * @param {Object} props - Tareas y manejadores de eventos.
 * @returns {JSX.Element} Lista de tareas estilizada.
 */
const TaskList = ({ tasks, onEdit, onDelete, onFinish }) => {
  if (!tasks || tasks.length === 0) {
    return (
      <div className="glass-panel" style={{ textAlign: "center", padding: "2rem" }}>
        <p style={{ margin: 0, fontSize: "1.1rem" }}>No hay tareas registradas.</p>
        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.9rem", marginTop: "0.5rem" }}>
          Haz clic en <strong>+ Nueva Tarea</strong> para comenzar.
        </p>
      </div>
    );
  }

  const getPriorityColor = (prioridad) => {
    switch (prioridad) {
      case "Alta":
        return "#ff4d4f";
      case "Baja":
        return "#52c41a";
      default:
        return "#faad14";
    }
  };

  const getStatusColor = (estado) => {
    switch (estado) {
      case "Finalizada":
        return "#52c41a";
      case "En Progreso":
        return "#1890ff";
      default:
        return "#faad14";
    }
  };

  return (
    <div className="glass-panel">
      <h2 style={{ marginBottom: "1.5rem" }}>Listado de Tareas ({tasks.length})</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`task-item ${task.estado === "Finalizada" ? "task-completed" : ""}`}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.5rem" }}>
              <div>
                <h3 style={{ margin: 0, color: "var(--amber-honey)", fontSize: "1.2rem" }}>
                  {task.nombreProyecto} {task.sprint ? `• ${task.sprint}` : ""}
                </h3>
                <span style={{ fontSize: "0.85rem", color: "rgba(255, 255, 255, 0.7)" }}>
                  Tipo: {task.tipoActividad}
                </span>
              </div>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <span
                  style={{
                    fontSize: "0.8rem",
                    background: "rgba(0,0,0,0.4)",
                    color: getStatusColor(task.estado),
                    padding: "4px 8px",
                    borderRadius: "4px",
                    fontWeight: "bold",
                    border: `1px solid ${getStatusColor(task.estado)}44`,
                  }}
                >
                  {task.estado}
                </span>
                <span
                  style={{
                    fontSize: "0.8rem",
                    background: "rgba(0,0,0,0.4)",
                    color: getPriorityColor(task.prioridad),
                    padding: "4px 8px",
                    borderRadius: "4px",
                    fontWeight: "bold",
                    border: `1px solid ${getPriorityColor(task.prioridad)}44`,
                  }}
                >
                  {task.prioridad}
                </span>
              </div>
            </div>

            <p style={{ margin: "0.75rem 0 0.25rem 0", fontWeight: "600" }}>{task.resumen}</p>
            <p style={{ margin: "0 0 0.75rem 0", color: "rgba(255,255,255,0.85)", fontSize: "0.95rem", whiteSpace: "pre-line" }}>
              {task.descripcion}
            </p>

            {/* Metadatos adicionales */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0.5rem", fontSize: "0.85rem", color: "rgba(255,255,255,0.7)", background: "rgba(0,0,0,0.15)", padding: "0.5rem 0.75rem", borderRadius: "6px", marginBottom: "0.75rem" }}>
              {task.informador && <div><strong>Informador:</strong> {task.informador}</div>}
              {task.personaAsignada && <div><strong>Asignado a:</strong> {task.personaAsignada}</div>}
              {task.precondicion && <div><strong>Precondición:</strong> {task.precondicion}</div>}
              {task.fechaCreacion && <div><strong>Creación:</strong> {task.fechaCreacion.split("T")[0]}</div>}
              {task.fechaCierre && <div><strong>Cierre:</strong> {task.fechaCierre.split("T")[0]}</div>}
            </div>

            <div className="task-actions">
              <button className="glass-btn btn-edit" onClick={() => onEdit(task)}>
                Editar
              </button>
              <button
                className="glass-btn btn-delete"
                onClick={() => onDelete(task.id)}
              >
                Eliminar
              </button>
              {task.estado !== "Finalizada" && (
                <button
                  className="glass-btn btn-finish"
                  onClick={() => onFinish(task.id)}
                >
                  Finalizar
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskList;
