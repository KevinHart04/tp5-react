-- /database/init.sql
-- Tabla tasks que cumple con todos los campos del TP5

CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    nombre_proyecto VARCHAR(100) NOT NULL,
    tipo_actividad VARCHAR(100) NOT NULL,
    estado VARCHAR(50) DEFAULT 'Pendiente',
    resumen VARCHAR(255) NOT NULL,
    descripcion TEXT NOT NULL,
    prioridad VARCHAR(50) DEFAULT 'Media',
    informador VARCHAR(100),
    persona_asignada VARCHAR(100),
    precondicion VARCHAR(255),
    fecha_creacion DATE DEFAULT CURRENT_DATE,
    fecha_cierre DATE,
    sprint VARCHAR(100)
);

-- Insertamos un dato inicial de prueba
INSERT INTO tasks (
    nombre_proyecto,
    tipo_actividad,
    estado,
    resumen,
    descripcion,
    prioridad,
    informador,
    persona_asignada,
    precondicion,
    fecha_creacion,
    sprint
) VALUES (
    'Sistema de Gestión Empresarial',
    'Desarrollo de Módulo',
    'En Progreso',
    'Implementación de autenticación y roles de usuario',
    'Diseñar y desarrollar el flujo de autenticación JWT, control de acceso basado en roles (RBAC) y vistas protegidas para el panel de administración.',
    'Alta',
    'Líder Técnico',
    'Desarrollador Fullstack',
    'Esquema de base de datos migrado y endpoints base configurados',
    CURRENT_DATE,
    'Sprint 1'
);
