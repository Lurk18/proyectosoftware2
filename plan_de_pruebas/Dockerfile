# csv_processor/Dockerfile
FROM python:3.9

WORKDIR /app

# Instalar dependencias
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar scripts y datos
COPY ./process.py .

COPY ./data/fda_nutrition_data.csv ./data/fda_nutrition_data.csv

# Variable de entorno para MongoDB
ENV MONGODB_URI=mongodb://database:27017/

CMD ["bash", "-c", "python process.py && echo 'Carga de base de datos desde csv terminada'"]
