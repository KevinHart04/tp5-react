# Etapa 1: Construcción (Builder)
FROM golang:alpine AS builder

WORKDIR /app

# Copiamos los archivos de dependencias
COPY go.mod go.sum ./
RUN go mod download

# Copiamos el código fuente
COPY *.go ./

# Compilamos el binario de forma estática
RUN CGO_ENABLED=0 GOOS=linux go build -o task-server .

# Etapa 2: Producción
FROM alpine:latest

WORKDIR /app

# Traemos solo el binario compilado desde la etapa anterior
COPY --from=builder /app/task-server .

EXPOSE 8080

# Ejecutamos el binario
CMD ["./task-server"]
