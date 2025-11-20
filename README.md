# Despliegue del proyecto
* Estructura de la aplicacion web
```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐  
│   Frontend      │     │   Backend       │     │   Base de       │  
│   (React/Vue)   │ ◄─► │   (Node.js/     │ ◄─► │   Datos         │  
│   Nginx         │     │   Express)      │     │   MongoDB       │  
│                 │     │   Nginx         │     │                 │  
└─────────────────┘     └─────────────────┘     └─────────────────┘  
```
# Componiendo el entorno

## 1. Levantar el entorno
Para ejecutar solamente en el directorio actual
```bash
docker compose up --build
```
## 2. Cargar la base de datos (Se debe esperar a que la base de datos este levantada)

Para asegurarse que la base de datos este recibiendo conexiones
```bash
docker logs -f proyectosoftware2-database-1
```
La salida deberia contener algo como:
```pgsql
database system is ready to accept connections
```

### 2.1 Cargando la estructura de la base de datos (Primera vez)
```bash
cat estructura_db.sql | docker exec -i proyectosoftware2-database-1 psql -U miusuario -d mibasededatos
```
y para poblar la base de datos de muestras de ejemplo
```bash
cat test_data_db.sql | docker exec -i proyectosoftware2-database-1 psql -U miusuario -d mibasededatos
```



## 3. Revisar que 

### 3.1 El backend tenga la direccion correcta del ./.env
Para saber si el backend se encuentra desplegado y sirviendo
```bash
curl http://<ipback>/ison
```


