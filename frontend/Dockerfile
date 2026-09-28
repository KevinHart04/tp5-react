# Usamos una imagen de Node ligera
FROM node:20-alpine

# Establecemos el directorio de trabajo
WORKDIR /app

# Copiamos solo los package primero para cachear la instalación de dependencias
COPY package*.json ./

# Instalamos las dependencias
RUN npm install

# Copiamos el resto del código
COPY . .

# Exponemos el puerto
EXPOSE 5173

# Levantamos el servidor de desarrollo
CMD ["npm", "run", "dev"]
