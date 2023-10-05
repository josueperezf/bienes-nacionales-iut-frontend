const { writeFileSync, mkdirSync} = require('fs');
require('dotenv').config();

const path = './src/environments';
const targetPath = `${path}/environment.ts`;

// aqui agregamos todas los nombres de las variables de entorno que necesitemos
const envFileContent = `
  export const environment = {
    API_URL: "${process.env['API_URL']}",
  }
`;

// creamos la carpeta environments si no existe. recursive es para que si existe el archivo lo sobreescriba
mkdirSync(path, {recursive: true});
// crea un archivo llamado environment.ts
writeFileSync(targetPath, envFileContent);
