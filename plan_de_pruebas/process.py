import os
import pandas as pd
from pymongo import MongoClient

# Ruta del archivo CSV
CSV_PATH = './data/fda_nutrition_data.csv'

# Conexión a MongoDB local
client = MongoClient('mongodb://database:27017/')

# Obtener lista de bases de datos existentes
existing_dbs = client.list_database_names()

# Nombre de la base de datos y colección
db_name = 'fda'
collection_name = 'nutrition_data'

# Revisar si la base de datos existe
if db_name in existing_dbs:
    print(f"La base de datos '{db_name}' ya existe✅✅✅. No se realizará ninguna importación.")
else:
    print(f"La base de datos '{db_name}' no existe. Creando y poblando con datos del CSV...")

    # Leer el CSV con pandas
    if not os.path.exists(CSV_PATH):
        print(f"❌ No se encontró el archivo: {CSV_PATH}")
        exit(1)

    df = pd.read_csv(CSV_PATH)

    # Convertir a diccionarios
    data = df.to_dict(orient='records')

    # Insertar en MongoDB
    db = client[db_name]
    collection = db[collection_name]
    collection.insert_many(data)

    print(f"✅ Se insertaron {len(data)} documentos en la colección '{collection_name}'.")
