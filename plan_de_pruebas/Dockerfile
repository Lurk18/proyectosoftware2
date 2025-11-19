# csv_processor/Dockerfile
FROM python:3.9

WORKDIR /app

# Instalar dependencias
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar scripts y datos
COPY ./process.py .

# Variable de entorno para MongoDB
ENV MONGODB_URI=mongodb://database:27017/

CMD ["bash", "-c", "python process.py && echo 'Plan de pruebas completado.'"]
