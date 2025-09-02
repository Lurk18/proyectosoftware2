# FDA-tabla-nutricional
* Repo kubernetes para despliegue de web app

Para ejecutar solamente en el directorio actual
```bash
docker compose up --build
```

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
