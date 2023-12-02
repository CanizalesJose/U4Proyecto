## Guia de instalación

### Requisitos
- Antes de poder hacer funcionar el proyecto, hay una serie de programas que se deben instalar para iniciar el programa.
    - `Python 3.8.0` Se decidió usar esta versión de Python debido a ciertos problemas con las versiones mas recientes de Python, siendo que las librerías de mysqldb no eran instaladas correctamente.
    - `MySQL 8.2` La base de datos se creó usando como referencia la ultima versión de MySQL Community hasta la fecha. No implementa funciones propias de dicha versión, sin embargo es preferible usarla para reducir riesgo de errores.
- Una vez con estos programas instalados se debe iniciar el entorno virtual de Python e instalar las librerías extendidas desde el archivo `U4Proyecto/requirements.txt`.
    - Para instalar estas librerías se debe iniciar el entorno con el comando `env\Scripts\activate` desde el cmd en la carpeta raíz del proyecto.
    - Con el entorno iniciado, se ejecuta el comando `pip install -r requirements.txt` para instalar las librerías.

### Generar Base de Datos
- Dentro del proyecto podemos encontrar varias carpetas, en la carpeta `U4Proyecto/database` se encuentra un script que se encargará de generar las distintas tablas y procedimientos del proyecto, asi como pre-cargar un usuario cliente y un administrador, al igual que cuatro productos.
    - Este script se puede ejecutar desde el cmd (asumiendo que el PATH este configurado) dirigiéndose a la carpeta `database` y usando los comandos `mysql -u root -p` para ingresar a MySQL.
    - El comando `source scriptGeneral.sql` va a leer y ejecutar los comandos contenidos dentro del Script y generará una base de datos con el nombre `tiendaflora`. Por tanto, es importante asegurarse de realizar un respaldo si es que ya se tiene una base de datos con este nombre.

### Iniciando la Aplicación
- Se debe ingresar al entorno virtual del proyecto con el comando mencionado anteriormente: `env\Scripts\activate`.
    - Usando Python, se debe ejecutar el archivo `app.py` para iniciar el servidor. Este archivo se encuentra en `U4Proyecto/src/app.py`
    - Se ejecuta `py src/app.py` desde la carpeta raíz del proyecto. Esto pondrá en marcha el servidor.
    - Si todo salió bien, se puede acceder al servidor desde la dirección del `localhost` o `127.0.0.1` con el puerto `5000`.