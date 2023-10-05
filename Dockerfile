# etapa 1
FROM node:lts-bullseye as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

## etapa 2 Para meter en un nginx para exponer mi aplicacion ya compilada en la etapa 1
FROM nginx:alpine
# la siguiente linea es para que copiemos el servidor que estamos creando de nginx, la configuracion que nosotros tenemos en la carpeta config, esto es para que sobreescriba la configuracion por default del nginx
ADD ./config/default.conf /etc/nginx/conf.d/default.conf
# importante, la siguiente linea se coloca el nombre del proyecto, por ser un proyecto de angular, pero si estuvieramos corriendo esto para rect no necesitariamos colocar eso, colocariamos la ruta hasta dist
COPY --from=build /app/dist/angular-bienes-iut /var/www/app/

EXPOSE 80
CMD [ "nginx", "-g", "daemon off;" ]
