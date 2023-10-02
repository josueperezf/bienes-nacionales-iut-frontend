# etapa 1
FROM node:lts-bullseye as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

## etapa 2 Para meter en un nginx para exponer mi aplicacion ya compilada en la etapa 1
FROM nginx:alpine
ADD config/default.config /etc/nginx/conf.d/default.config
# la siguiente linea copia de la fase llamada build, los archivo que ella genera esta, y que estan en la carpeta /app/dist, ellos los pegamos en nuestro alpine en /var/www/app/
COPY --from=build /app/dist /var/www/app/
EXPOSE 80
CMD [ "nginx", "-g", "daemon off;" ]
