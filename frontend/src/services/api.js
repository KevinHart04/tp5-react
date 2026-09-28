// /frontend/src/services/api.js

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export const getTasks = async () => {
  const response = await fetch(`${API_URL}/tasks`);
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Error al obtener las tareas");
  }
  return response.json();
};

export const createTask = async (taskData) => {
  const response = await fetch(`${API_URL}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(taskData),
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Error al crear la tarea");
  }
  return response.json();
};

export const updateTask = async (id, taskData) => {
  const response = await fetch(`${API_URL}/tasks/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(taskData),
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Error al actualizar la tarea");
  }
  return response.json();
};

export const deleteTask = async (id) => {
  const response = await fetch(`${API_URL}/tasks/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Error al eliminar la tarea");
  }
  return true;
};

export const finishTask = async (id) => {
  const response = await fetch(`${API_URL}/tasks/${id}/finish`, {
    method: "PATCH",
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Error al finalizar la tarea");
  }
  return response.json();
};
