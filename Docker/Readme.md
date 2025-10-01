## Despliegue manual de la aplicacion
Esto es solo para testing

* Para cargar sql a la base de datos usar
```bash
cat test.sql | docker exec -i proyectosoftware2-database-1 psql -U miusuario -d mibasededatos
```