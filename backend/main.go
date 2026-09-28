package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	_ "github.com/jackc/pgx/v5/stdlib"
	"github.com/joho/godotenv"
)

// Task mapea exactamente los campos requeridos para la tarea del proyecto.
type Task struct {
	ID              uint   `json:"id"`
	NombreProyecto  string `json:"nombreProyecto"`
	TipoActividad   string `json:"tipoActividad"`
	Estado          string `json:"estado"`
	Resumen         string `json:"resumen"`
	Descripcion     string `json:"descripcion"`
	Prioridad       string `json:"prioridad"`
	Informador      string `json:"informador"`
	PersonaAsignada string `json:"personaAsignada"`
	Precondicion    string `json:"precondicion"`
	FechaCreacion   string `json:"fechaCreacion"`
	FechaCierre     string `json:"fechaCierre"`
	Sprint          string `json:"sprint"`
}

var db *sql.DB

func toNullString(s string) any {
	if s == "" {
		return nil
	}
	return s
}

func enableCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("Aviso: No se encontró el archivo .env, leyendo variables del sistema...")
	}

	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		log.Fatal("¡Error crítico! DATABASE_URL no está definida.")
	}

	var err error
	db, err = sql.Open("pgx", dbURL)
	if err != nil {
		log.Fatal("Error al abrir la conexión: ", err)
	}
	defer db.Close()

	for attempts := 1; attempts <= 10; attempts++ {
		err = db.Ping()
		if err == nil {
			break
		}
		log.Printf("Intento %d/10: esperando a Postgres (%v)...\n", attempts, err)
		time.Sleep(1 * time.Second)
	}

	if err != nil {
		log.Fatal("Error al contactar a Postgres tras múltiples intentos: ", err)
	}
	fmt.Println("Conexión a Postgres establecida.")

	mux := http.NewServeMux()

	mux.HandleFunc("GET /tasks", getTasks)
	mux.HandleFunc("POST /tasks", createTask)
	mux.HandleFunc("PUT /tasks/{id}", updateTask)
	mux.HandleFunc("DELETE /tasks/{id}", deleteTask)
	mux.HandleFunc("PATCH /tasks/{id}/finish", finishTask)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	fmt.Printf("Servidor backend escuchando en puerto %s...\n", port)
	log.Fatal(http.ListenAndServe(":"+port, enableCORS(mux)))
}

func getTasks(w http.ResponseWriter, r *http.Request) {
	query := `
		SELECT 
			id, 
			COALESCE(nombre_proyecto, ''), 
			COALESCE(tipo_actividad, ''), 
			COALESCE(estado, 'Pendiente'), 
			COALESCE(resumen, ''), 
			COALESCE(descripcion, ''), 
			COALESCE(prioridad, 'Media'), 
			COALESCE(informador, ''), 
			COALESCE(persona_asignada, ''), 
			COALESCE(precondicion, ''), 
			COALESCE(TO_CHAR(fecha_creacion, 'YYYY-MM-DD'), ''), 
			COALESCE(TO_CHAR(fecha_cierre, 'YYYY-MM-DD'), ''), 
			COALESCE(sprint, '') 
		FROM tasks 
		ORDER BY id ASC
	`

	rows, err := db.Query(query)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	tasks := make([]Task, 0)
	for rows.Next() {
		var t Task
		err := rows.Scan(
			&t.ID,
			&t.NombreProyecto,
			&t.TipoActividad,
			&t.Estado,
			&t.Resumen,
			&t.Descripcion,
			&t.Prioridad,
			&t.Informador,
			&t.PersonaAsignada,
			&t.Precondicion,
			&t.FechaCreacion,
			&t.FechaCierre,
			&t.Sprint,
		)
		if err != nil {
			log.Println("Error escaneando fila:", err)
			continue
		}
		tasks = append(tasks, t)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(tasks)
}

func createTask(w http.ResponseWriter, r *http.Request) {
	var t Task
	if err := json.NewDecoder(r.Body).Decode(&t); err != nil {
		http.Error(w, "JSON inválido", http.StatusBadRequest)
		return
	}

	query := `
		INSERT INTO tasks (
			nombre_proyecto, tipo_actividad, estado, resumen, descripcion, 
			prioridad, informador, persona_asignada, precondicion, 
			fecha_creacion, fecha_cierre, sprint
		) 
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) 
		RETURNING id
	`

	err := db.QueryRow(query,
		t.NombreProyecto,
		t.TipoActividad,
		t.Estado,
		t.Resumen,
		t.Descripcion,
		t.Prioridad,
		toNullString(t.Informador),
		toNullString(t.PersonaAsignada),
		toNullString(t.Precondicion),
		toNullString(t.FechaCreacion),
		toNullString(t.FechaCierre),
		toNullString(t.Sprint),
	).Scan(&t.ID)
	if err != nil {
		http.Error(w, "Error al insertar en la base de datos: "+err.Error(), http.StatusInternalServerError)
		log.Println("Error en createTask:", err)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(t)
}

func updateTask(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")

	var t Task
	if err := json.NewDecoder(r.Body).Decode(&t); err != nil {
		http.Error(w, "JSON inválido", http.StatusBadRequest)
		return
	}

	query := `
		UPDATE tasks SET 
			nombre_proyecto=$1, tipo_actividad=$2, estado=$3, resumen=$4, 
			descripcion=$5, prioridad=$6, informador=$7, persona_asignada=$8, 
			precondicion=$9, fecha_creacion=$10, fecha_cierre=$11, sprint=$12 
		WHERE id=$13
	`

	_, err := db.Exec(query,
		t.NombreProyecto,
		t.TipoActividad,
		t.Estado,
		t.Resumen,
		t.Descripcion,
		t.Prioridad,
		toNullString(t.Informador),
		toNullString(t.PersonaAsignada),
		toNullString(t.Precondicion),
		toNullString(t.FechaCreacion),
		toNullString(t.FechaCierre),
		toNullString(t.Sprint),
		id,
	)
	if err != nil {
		http.Error(w, "Error al actualizar en la base de datos: "+err.Error(), http.StatusInternalServerError)
		log.Println("Error en updateTask:", err)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Tarea actualizada correctamente"})
}

func deleteTask(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	query := `DELETE FROM tasks WHERE id = $1`

	_, err := db.Exec(query, id)
	if err != nil {
		http.Error(w, "Error al eliminar de la base de datos", http.StatusInternalServerError)
		log.Println("Error en deleteTask:", err)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func finishTask(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	query := `UPDATE tasks SET estado = 'Finalizada', fecha_cierre = COALESCE(fecha_cierre, CURRENT_DATE) WHERE id = $1`

	_, err := db.Exec(query, id)
	if err != nil {
		http.Error(w, "Error al finalizar la tarea", http.StatusInternalServerError)
		log.Println("Error en finishTask:", err)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Tarea finalizada"})
}
