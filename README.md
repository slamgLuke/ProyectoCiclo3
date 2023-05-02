# ProyectoCiclo3
Proyecto para DBP / BD

## Info del proyecto:
- Frontend: (HTML usando Bootstrap) + CSS
- Backend: Javascript (Expressjs + mysqljs)
- APIs: Expressjs
- Base de Datos: mysql


## FAQ:

### ¿Cómo inicializar la base de datos?
Pega el contenido de .instrucciones_mysql.txt en la consola de mysql.

̇### ¿Cómo hostear el sitio web?
Pasos:

1. Tener node.js instalado
2. clonar el repositorio:
```
$ git clone github.com/slamgLuke/ProyectoCiclo3 mi_carpeta
$ cd mi_carpeta
```
3. Configura el apartado de "Conexión a la base de datos 'automarket'" en server/server.js, para que se adapte a tu usuario y contraseña de tu base de datos mysql
4. Lanza el servidor:
```
$ node server/server.js
```

5. Si obtienes el siguiente output en consola, se lanzó exitosamente:
```
Servidor iniciado en el puerto  3000
Conexión exitosa con la base de datos
```
