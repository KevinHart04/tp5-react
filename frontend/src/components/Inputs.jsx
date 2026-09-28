import React from "react";

/**
 * Componente TextInput
 * Renderiza un campo de entrada de texto o área de texto estilizado.
 *
 * @param {Object} props - Propiedades del componente.
 * @returns {JSX.Element} Input de texto con glassmorphism.
 */
export const TextInput = ({
  label,
  name,
  value,
  onChange,
  isTextArea = false,
  required = false,
  placeholder = "",
}) => (
  <div className={`input-group ${isTextArea ? "full-width" : ""}`}>
    <label className="glass-label">
      {label} {required && <span style={{ color: "#ff7b72" }}>*</span>}
    </label>
    {isTextArea ? (
      <textarea
        name={name}
        value={value || ""}
        onChange={onChange}
        className="glass-input"
        rows="3"
        required={required}
        placeholder={placeholder}
      />
    ) : (
      <input
        type="text"
        name={name}
        value={value || ""}
        onChange={onChange}
        className="glass-input"
        required={required}
        placeholder={placeholder}
      />
    )}
  </div>
);

/**
 * Componente SelectInput
 * Renderiza un menú desplegable estilizado.
 *
 * @param {Object} props - Propiedades del componente.
 * @returns {JSX.Element} Elemento select con glassmorphism.
 */
export const SelectInput = ({
  label,
  name,
  value,
  onChange,
  options,
  required = false,
}) => (
  <div className="input-group">
    <label className="glass-label">
      {label} {required && <span style={{ color: "#ff7b72" }}>*</span>}
    </label>
    <select
      name={name}
      value={value || ""}
      onChange={onChange}
      className="glass-input"
      required={required}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

/**
 * Componente DateInput
 * Renderiza un selector de fecha estilizado.
 *
 * @param {Object} props - Propiedades del componente.
 * @returns {JSX.Element} Input de tipo fecha con glassmorphism.
 */
export const DateInput = ({
  label,
  name,
  value,
  onChange,
  required = false,
}) => (
  <div className="input-group">
    <label className="glass-label">
      {label} {required && <span style={{ color: "#ff7b72" }}>*</span>}
    </label>
    <input
      type="date"
      name={name}
      value={value || ""}
      onChange={onChange}
      className="glass-input"
      required={required}
    />
  </div>
);
