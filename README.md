# Despliegue del proyecto
* Para cargar sql a la base de datos usar
```bash
cat test.sql | docker exec -i proyectosoftware2-database-1 psql -U miusuario -d mibasededatos
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

### 2.2 Cargando la base de datos (Primera vez / Backup)
Para esto usamos el mismo metodo anterior, enviarle el contenido del archivo sql al contenedor para que postgres lo ejecute.
```bash
cat dump-postgres-202509301843.sql | docker exec -i proyectosoftware2-database-1 psql -U miusuario -d mibasededatos
```

## 3. Revisar que 

Para saber si el backend se encuentra desplegado y sirviendo
```bash
curl http://localhost:3000/ison
```

* Estructura de la aplicacion web
```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐  
│   Frontend      │     │   Backend       │     │   Base de       │  
│   (React/Vue)   │ ◄─► │   (Node.js/     │ ◄─► │   Datos         │  
│   Nginx         │     │   Express)      │     │   MongoDB       │  
│                 │     │   Nginx         │     │                 │  
└─────────────────┘     └─────────────────┘     └─────────────────┘  
```
