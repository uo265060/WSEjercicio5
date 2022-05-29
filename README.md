# WSEjercicio5
Se ha desarrollado una aplicación web Node.js que emplea la api de Wikibase para mostrar la información de los tornados publicados en nuestra instancia de Wikibase (http://156.35.98.119/wiki/Main_Page). La aplicación web está desplegada en la siguiente dirección: http://156.35.98.120:8080/ .
## Estructura del proyecto
El proyecto posee la siguiente estructura:
- Carpeta **public**: almaceno los ficheros css y las imágenes empleados en la aplicación.
- Carpeta **views**: almacena los ficheros html que son las diferentes vistas de la aplicación.
- Carpeta **wikibase**: almacena los ficheros js que se emplean para realizar operaciones contra nuestra instancia de wikibase. El fichero **queries.js** posee los métodos que se encargan de realizar peticiones a wikibase para obtener información de tornados y eventos. El fichero **conservor.js** tiene diferentes métodos que se encargan de juntar la información obtenida de wikibase en un único json.
- **main.js**: configuración del servidor y módulos de la aplicación.
- **routes.js**: fichero que contiene los controladores de la aplicación y los añade al servidor.
