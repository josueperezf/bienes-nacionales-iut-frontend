# Proyecto bienes nacionales version iut 'frontend'

  creado con angular version 16.1.6.
  como angular luego de la version 15 no crea las variables de entorno, aunque se pueden generar, se procedio a instalar ```npm install dotenv --save``` para esta funcion para manejar mas el estandar de nodejs. se agregaron cambios al archivo ```package.json``` en los ```scripts```, y se creó la carpeta ```scripts```
  
  se recomienda leer el siguien parrafo

## pasos levantar el proyecto

1. bastaria con clonar el repositorio, ejecutar ```npm install```
2. copiar y pegar el archivo ```.env.template``` en el mismo directorio, y renombrar el nuevo arvho a: ```.env```
3. Llenar las variables de entorno acorde al ambiente
4. debemos tener el backend corriendo, el mismo esta en: <https://github.com/josueperezf/bienes-nacionales-iut-backend>
5. para levantar el proyecto ```NO``` debemos ejecutar el comando ```ng serve```, si no ```npm start``` debido a que tiene un trato especial para las variables de entorno

<p style="color:red">IMPORTANTE</p>
Para agregar una variable de entorno debemos colocar el nombre y el valor de la misma en el archivo ```.env``` y solo el nombre de la nueva variable en ```set-envs.js```. para este proyecto no se deben colocar variables de entorno en ```environment.ts``` ya que este lo estamos auto generando al ejecutar el comando ```npm run start```, lo podemos ver en los ```scripts``` del ```package.json```
