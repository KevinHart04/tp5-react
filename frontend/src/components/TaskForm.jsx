import React, { useState, useEffect } from "react";
import { TextInput, SelectInput, DateInput } from "./Inputs";

/**
 * Componente TaskForm
 * Ensambla los 12 campos requeridos para crear o editar una tarea de software.
 *
 * @param {Object} props - Funciones y datos heredados del componente padre.
 * @returns {JSX.Element} Formulario de tareas modular.
 */
const TaskForm = ({ onSubmit, initialData, onCancel }) => {
  const getTodayDate = () => new Date().toISOString().split("T")[0];

  const defaultFormState = {
    nombreProyecto: "",
    tipoActividad: "",
    estado: "Pendiente",
    resumen: "",
    descripcion: "",
    prioridad: "Media",
    informador: "",
    personaAsignada: "",
    precondicion: "",
    fechaCreacion: getTodayDate(),
    fechaCierre: "",
    sprint: "",
  };

  const [formData, setFormData] = useState(defaultFormState);

  // Si hay datos iniciales (modo edición), cargarlos en el estado
  useEffect(() => {
    if (initialData) {
      setFormData({
        id: initialData.id,
        nombreProyecto: initialData.nombreProyecto || "",
        tipoActividad: initialData.tipoActividad || "",
        estado: initialData.estado || "Pendiente",
        resumen: initialData.resumen || "",
        descripcion: initialData.descripcion || "",
        prioridad: initialData.prioridad || "Media",
        informador: initialData.informador || "",
        personaAsignada: initialData.personaAsignada || "",
        precondicion: initialData.precondicion || "",
        fechaCreacion: initialData.fechaCreacion ? initialData.fechaCreacion.split("T")[0] : getTodayDate(),
        fechaCierre: initialData.fechaCierre ? initialData.fechaCierre.split("T")[0] : "",
        sprint: initialData.sprint || "",
      });
    } else {
      setFormData(defaultFormState);
    }
  }, [initialData]);

  /**
   * Maneja los cambios de los inputs.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * Empaqueta la tarea y la envía al componente principal.
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="glass-panel">
      <h2 style={{ marginBottom: "1rem" }}>
        {formData.id ? "Editar Tarea" : "Nueva Tarea"}
      </h2>
      <form onSubmit={handleSubmit} className="form-grid">
        <TextInput
          label="Nombre del Proyecto"
          name="nombreProyecto"
          value={formData.nombreProyecto}
          onChange={handleChange}
          required={true}
          placeholder="Ej. Sistema de Pagos"
        />
        <TextInput
          label="Tipo de Actividad"
          name="tipoActividad"
          value={formData.tipoActividad}
          onChange={handleChange}
          required={true}
          placeholder="Ej. Desarrollo Backend, Bugfix, etc."
        />
        <SelectInput
          label="Estado"
          name="estado"
          value={formData.estado}
          onChange={handleChange}
          options={[
            { label: "Pendiente", value: "Pendiente" },
            { label: "En Progreso", value: "En Progreso" },
            { label: "Finalizada", value: "Finalizada" },
          ]}
        />
        <SelectInput
          label="Prioridad"
          name="prioridad"
          value={formData.prioridad}
          onChange={handleChange}
          options={[
            { label: "Baja", value: "Baja" },
            { label: "Media", value: "Media" },
            { label: "Alta", value: "Alta" },
          ]}
        />
        <TextInput
          label="Informador"
          name="informador"
          value={formData.informador}
          onChange={handleChange}
          placeholder="Persona que reporta o crea la tarea"
        />
        <TextInput
          label="Persona Asignada"
          name="personaAsignada"
          value={formData.personaAsignada}
          onChange={handleChange}
          placeholder="Persona a cargo del desarrollo"
        />
        <DateInput
          label="Fecha de Creación"
          name="fechaCreacion"
          value={formData.fechaCreacion}
          onChange={handleChange}
          required={true}
        />
        <DateInput
          label="Fecha de Cierre"
          name="fechaCierre"
          value={formData.fechaCierre}
          onChange={handleChange}
        />
        <TextInput
          label="Sprint"
          name="sprint"
          value={formData.sprint}
          onChange={handleChange}
          placeholder="Ej. Sprint 1, Sprint 2..."
        />
        <TextInput
          label="Precondición"
          name="precondicion"
          value={formData.precondicion}
          onChange={handleChange}
          placeholder="Requisitos previos o dependencias"
        />
        <TextInput
          label="Resumen"
          name="resumen"
          value={formData.resumen}
          onChange={handleChange}
          required={true}
          placeholder="Breve resumen de la tarea"
        />
        <TextInput
          label="Descripción"
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
          isTextArea={true}
          required={true}
          placeholder="Detalle completo de los requisitos y actividades..."
        />

        <div
          className="full-width"
          style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}
        >
          <button type="submit" className="glass-btn">
            {formData.id ? "Guardar Cambios" : "Guardar Tarea"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="glass-btn"
            style={{
              background: "transparent",
              color: "var(--amber-honey)",
              border: "1px solid var(--amber-honey)",
            }}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;
