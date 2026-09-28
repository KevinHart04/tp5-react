# TP5 - Gestor de Tareas de Proyectos de Software

Aplicacion web desarrollada para la catedra de Programacion Avanzada (Licenciatura en Sistemas de Informacion). Permite gestionar el ciclo de vida de tareas en proyectos de software (creacion, edicion, finalizacion y eliminacion) con persistencia en base de datos relacional y contenedorizacion completa.

---

## Arquitectura y Tecnologias

- **Frontend**: React 18 + Vite (Javascript). Interfaz modular con componentes reutilizables y estilos Glassmorphism.
- **Backend**: Go (Golang) utilizando el router nativo de `net/http` y el driver `jackc/pgx/v5`.
- **Base de Datos**: PostgreSQL 15 Alpine con inicializacion automatica mediante scripts SQL.
- **Contenedores**: Docker y Docker Compose, con orquestacion basada en healthchecks para garantizar la disponibilidad de la base de datos antes del inicio de los servicios dependientes.

---

## Estructura del Proyecto

```text
tp5-react/
├── .env                  # Variables de entorno para la base de datos y backend
├── compose.yaml          # Orquestacion de servicios Docker
├── README.md             # Documentacion del proyecto
├── backend/
│   ├── Dockerfile        # Construccion multi-etapa del servidor en Go
│   ├── go.mod            # Dependencias de Go
│   ├── go.sum
│   └── main.go           # Logica del servidor, conexion a DB y endpoints REST
├── database/
│   ├── Dockerfile        # Imagen personalizada de PostgreSQL
│   └── init.sql          # Esquema de la tabla tasks y datos iniciales de prueba
└── frontend/
    ├── Dockerfile        # Imagen Node para entorno de desarrollo Vite
    ├── package.json      # Dependencias de React
    ├── vite.config.js    # Configuracion de Vite y servidor
    └── src/
        ├── App.jsx       # Componente principal y manejo de estado global
        ├── components/
        │   ├── Inputs.jsx    # Componentes de entrada genericos (texto, select, fecha)
        │   ├── TaskForm.jsx  # Formulario con los 12 campos de la tarea
        │   └── TaskList.jsx  # Listado y visualizacion de tareas
        └── services/
            └── api.js        # Cliente HTTP para consumo de la API REST
```

---

## Campos del Modelo de Tareas

Cada tarea contiene los 12 campos solicitados por la consigna:

1. **nombreProyecto** (`VARCHAR(100)`): Nombre del proyecto al que pertenece la tarea.
2. **tipoActividad** (`VARCHAR(100)`): Tipo de actividad (ej. Desarrollo, Bugfix, QA).
3. **estado** (`VARCHAR(50)`): Estado de la tarea (`Pendiente`, `En Progreso`, `Finalizada`).
4. **resumen** (`VARCHAR(255)`): Resumen breve o titulo descriptivo.
5. **descripcion** (`TEXT`): Detalle completo de la tarea.
6. **prioridad** (`VARCHAR(50)`): Nivel de prioridad (`Baja`, `Media`, `Alta`).
7. **informador** (`VARCHAR(100)`): Persona que reporta o crea la tarea.
8. **personaAsignada** (`VARCHAR(100)`): Desarrollador o responsable a cargo.
9. **precondicion** (`VARCHAR(255)`): Requisitos previos requeridos.
10. **fechaCreacion** (`DATE`): Fecha en la que se creo la tarea.
11. **fechaCierre** (`DATE`): Fecha estimada o efectiva de cierre.
12. **sprint** (`VARCHAR(100)`): Sprint correspondiente (ej. Sprint 1).

---

## Endpoints de la API REST

La API responde en el puerto `8080` e incluye soporte completo de CORS.

### 1. Obtener todas las tareas
- **Metodo**: `GET`
- **Ruta**: `/tasks`
- **Respuesta exitosa** (`200 OK`):
  ```json
  [
    {
      "id": 1,
      "nombreProyecto": "Sistema de Gestion Empresarial",
      "tipoActividad": "Desarrollo de Modulo",
      "estado": "En Progreso",
      "resumen": "Implementacion de autenticacion y roles de usuario",
      "descripcion": "Disenar y desarrollar el flujo de autenticacion JWT...",
      "prioridad": "Alta",
      "informador": "Lider Tecnico",
      "personaAsignada": "Desarrollador Fullstack",
      "precondicion": "Esquema de base de datos migrado",
      "fechaCreacion": "2026-09-27",
      "fechaCierre": "",
      "sprint": "Sprint 1"
    }
  ]
  ```

### 2. Crear una nueva tarea
- **Metodo**: `POST`
- **Ruta**: `/tasks`
- **Cuerpo de la peticion** (`application/json`):
  ```json
  {
    "nombreProyecto": "Portal Web",
    "tipoActividad": "Frontend",
    "estado": "Pendiente",
    "resumen": "Crear vista de login",
    "descripcion": "Implementar formulario responsivo con validaciones",
    "prioridad": "Media",
    "informador": "Kevin",
    "personaAsignada": "Dev Frontend",
    "precondicion": "Disenos aprobados en Figma",
    "fechaCreacion": "2026-09-27",
    "fechaCierre": "",
    "sprint": "Sprint 2"
  }
  ```
- **Respuesta exitosa** (`201 Created`): Retorna el objeto creado con su `id` asignado.

### 3. Actualizar una tarea existente
- **Metodo**: `PUT`
- **Ruta**: `/tasks/{id}`
- **Cuerpo de la peticion** (`application/json`): Envia todos los campos actualizados de la tarea.
- **Respuesta exitosa** (`200 OK`):
  ```json
  {
    "message": "Tarea actualizada correctamente"
  }
  ```

### 4. Finalizar una tarea
- **Metodo**: `PATCH`
- **Ruta**: `/tasks/{id}/finish`
- **Descripcion**: Actualiza el estado de la tarea a `Finalizada` y asigna la fecha actual si no poseia fecha de cierre.
- **Respuesta exitosa** (`200 OK`):
  ```json
  {
    "message": "Tarea finalizada"
  }
  ```

### 5. Eliminar una tarea
- **Metodo**: `DELETE`
- **Ruta**: `/tasks/{id}`
- **Respuesta exitosa** (`204 No Content`)

---

## Como ejecutar el proyecto

### Requisitos previos
- [Docker](https://docs.docker.com/get-docker/) instalado.
- [Docker Compose](https://docs.docker.com/compose/) instalado.

### 1. Variables de Entorno
Verificar el archivo `.env` en la raiz del proyecto:
```env
POSTGRES_USER=admin
POSTGRES_PASSWORD=super_secreto_123
POSTGRES_DB=taskdb
DATABASE_URL=postgres://admin:super_secreto_123@db:5432/taskdb?sslmode=disable
```

### 2. Levantar el entorno con Docker Compose
Ejecutar en la terminal desde la raiz del repositorio:

```bash
docker compose up --build -d
```

Docker construira las imagenes de frontend, backend y database, esperara a que PostgreSQL complete su inicializacion y reporte estado saludable (`healthy`), y posteriormente iniciara el backend y el frontend.

### 3. Acceso a las aplicaciones
- **Frontend (Aplicacion React)**: [http://localhost:5173](http://localhost:5173)
- **Backend (API REST en Go)**: [http://localhost:8080](http://localhost:8080)
- **Base de Datos (PostgreSQL)**: `localhost:5433` (mapeado al puerto interno `5432`)

### 4. Detener el entorno
Para detener los contenedores:
```bash
docker compose down
```

Para detener los contenedores y reiniciar los datos de la base de datos:
```bash
docker compose down -v
```

---

## Eleccion tecnologica del Backend

Para la implementacion del backend se selecciono **Go (Golang)** con el objetivo de experimentar con el lenguaje, explorar su rendimiento y simplicidad en la construccion de APIs REST, y profundizar en el aprendizaje de su ecosistema y sintaxis.
