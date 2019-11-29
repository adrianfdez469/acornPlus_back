# acornPlus_back
Backend
En proceso... contactar con el ruso...

Una vez instalado los paquetes necesario para porder correr el proyacto (npm install/yarn install) verificar el fichero ubicado en src/utils/bd/dbConnDataConf.json en el cual estan las cofiguraciones para la coneccion con la base de datos. Debe usarse postgres como gestor de base.
Segun el nombre de la base de datos que tengan puesto en el fichero dbConnDataConf.json será a donde el sistema iría a conectarse, automaticamente cuando se inicia el sistema (npm start/yarn start) corre todos los scripts necesarios para que la base de datos se llene con todos los esquemas y datos necesarios iniciales como usuario (admin) con sus respectivos permisos.
Para evitar este comportamiento en los futuros reinicios del servidor en el fichero app.js dentro de la carpeta src hay una llamada al siguiente metodo:
dbInit({
      syncOptions: {
        force: true        
      }
    });
lo que se debe hacer es cambiar la propiedad force: true por force: false y de esta manera al reiniciar el servidor no se borrarán y autogenerará mas la base de datos.
