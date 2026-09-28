# /database/Dockerfile
FROM postgres:15-alpine

# Copiamos el script SQL a la carpeta especial de inicialización de Postgres.
# Todo archivo .sql que caiga aquí se ejecutará automáticamente al crear la base de datos virgen.
COPY init.sql /docker-entrypoint-initdb.d/
