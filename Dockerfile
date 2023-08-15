# # Utiliza una imagen base oficial de Node.js en su variante "alpine"
# FROM node:19.0-alpine
# EXPOSE 3000

# # Establece el directorio de trabajo dentro del contenedor
# WORKDIR /usr/src/app

# # Agrega el directorio /usr/src/app/node_modules/.bin al $PATH
# ENV PATH /usr/src/app/node_modules/.bin:$PATH

# # Copia el archivo package.json al directorio de trabajo
# COPY package.json .

# # Copia el archivo package-lock.json al directorio de trabajo
# COPY package-lock.json .

# # Instala las dependencias de la aplicación utilizando npm
# RUN npm install --production

# # Copia todos los archivos del proyecto al directorio de trabajo
# COPY . .


# FROM node:16-alpine as builder
# WORKDIR /app

# COPY package.json ./
# RUN npm i
# COPY . .

# # RUN npm run build

# EXPOSE 3000

# CMD ["npm", "startDev"]


FROM node:16-alpine as build
WORKDIR /app
COPY package.json ./

RUN npm install
COPY . .
RUN npm run build


FROM nginx:1.19.0-alpine AS prod-stage
COPY --from=build /app/build / usr/share/nginx/html
expose 80
CMD ["nginx","-g","daemon off;"]

