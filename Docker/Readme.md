## Despliegue manual de la aplicacion
Esto es solo para testing


### 3. Backend
Construccion de la imagen
```bash
docker build -t pro-backend ./backend
```
Para el despliege tenemos que usar
```bash
docker run -d \
  --name backend \
  -p 3000:3000 \
  -e MONGODB_URI=mongodb://nutrition-db:27017/nutrition \
  --link pro-db:pro-db \
  --restart unless-stopped \
  pro-backend
```

### 4. Frontend
Se puede obtener la ip del backend asignando variables de entorno al sistema, aunque no es necesario si se encuentra en local
```bash
BACKEND_IP=$(docker inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' pro-backend)
```

Para el despliegue tenemos que usar
```bash
docker run -d \
  --name pro-frontend \
  -p 80:80 \
  -v $(pwd)/frontend/build:/usr/share/nginx/html \
  -e REACT_APP_API_URL=http://${BACKEND_IP}:3000 \
  --restart unless-stopped \
  nginx:alpine
```
