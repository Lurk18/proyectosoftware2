# Documentación de la API de Pedidos

Esta guía documenta los endpoints de la API de Pedidos. Todos los ejemplos de `curl` asumen que el servidor está corriendo en `http://localhost:3000`.

---

## 1. Crear Pedido

- **Endpoint:** `POST /pedidos`
- **Descripción:** Crea un nuevo pedido. Esta operación debe ser transaccional: crea el pedido en la tabla `Orders` y los productos asociados en la tabla `OrderDetails`.
- **Cuerpo de la solicitud (JSON):**
  ```json
  {
      "customer_id": 1,
      "productos": [
          { "productoId": 10, "cantidad": 2 },
          { "productoId": 5, "cantidad": 1 }
      ]
  }

* Respuesta JSON esperada
```json
{
    "order_id": 123,
    "mensaje": "Pedido creado exitosamente"
}
```

Ejemplo de uso con CURL
```bash
# Crear un pedido para el cliente 1, con dos productos
curl -X POST http://localhost:3000/pedidos \
     -H "Content-Type: application/json" \
     -d '{
         "customer_id": 1,
         "productos": [
             { "productoId": 10, "cantidad": 2 },
             { "productoId": 5, "cantidad": 1 }
         ]
     }'
```

## 2. Consultar Pedidos de un Cliente

* **Endpoint**: GET /pedidos/cliente/{customer_id}

* **Descripción**: Obtiene todos los pedidos (solo la cabecera o un resumen) de un cliente específico.

* **Respuesta exitosa** (200):
```json
[
    {
        "order_id": 123,
        "fecha": "2024-06-10",
        "estado": "Pendiente",
        "totalProductos": 3 
    },
    {
        "order_id": 124,
        "fecha": "2024-06-11",
        "estado": "Enviado",
        "totalProductos": 1
    }
]
```

Ejemplo de uso CURL
```bash
# Obtener todos los pedidos del cliente con ID 1
curl -X GET http://localhost:3000/pedidos/cliente/1
```

## 3. Obtener Detalles de un Pedido Específico

* **Endpoint**: GET /orden/{order_id}

* **Descripción**: Obtiene todos los detalles de un único pedido, incluyendo la lista de productos.

* **Respuesta exitosa** (200):

```json
{
    "order_id": 123,
    "customer_id": 1,
    "fecha": "2024-06-10",
    "estado": "Pendiente",
    "productos": [
        { "productoId": 10, "nombre": "Producto A", "cantidad": 2, "precioUnitario": 20.00 },
        { "productoId": 5, "nombre": "Producto B", "cantidad": 1, "precioUnitario": 50.00 }
    ],
    "totalPedido": 90.00
}
```
* ERR 404
```json
{ "error": "Pedido no encontrado" }
```

Ejemplo de uso CURL
```bash

curl -X GET http://localhost:3000/pedidos/orden/1
```
## 4. Actualizar Estado de un Pedido

* **Endpoint**: PATCH /pedidos/{order_id}

* **Descripción**: Actualiza el estado de un pedido. Es la operación de edición más común (ej. de 'Pendiente' a 'Procesando' o 'Enviado').

* Cuerpo de la solicitud (JSON):
```json
{
    "estado": "Enviado"
}
```

* Respuesta exitosa:
```json
{
    "order_id": 123,
    "estado": "Enviado",
    "mensaje": "Estado del pedido actualizado"
}
```

Ejemplo de uso CURL
```bash
# Actualizar el estado del pedido 123 a "Enviado"
curl -X PATCH http://localhost:3000/pedidos/update/1 \
     -H "Content-Type: application/json" \
     -d '{
         "estado": "Enviado"
     }'
```

# 5. Cancelar/Eliminar un Pedido

* **Endpoint**: DELETE /pedidos/{order_id}

* **Descripción**: Cancela o elimina un pedido. En un sistema real, esto usualmente cambia el estado a 'Cancelado' (soft delete) en lugar de borrar el registro.

* Respuesta exitosa (200):
```json
{
    "mensaje": "Pedido 123 cancelado exitosamente"
}
```

Ejemplo de uso CURL
```bash
# Cancelar (eliminar) el pedido con ID 123
curl -i -X DELETE http://localhost:3000/pedidos/remove/1
```

# 6. Presentar informe consolidado

* **Endpoint**: GET /informes/inventario

* **Descripción**: Muestra un informe consolidado

* Respuesta exitosa (200):

```json
{
    "titulo": "Informe Consolidado de Inventario",
    "fecha_generacion": "2025-11-19T12:34:56.789Z",
    "resumen": {
        "total_skus": 12,
        "total_unidades_stock": 542,
        "valor_total_inventario": 23450.75
    },
    "detalle": [
        {
            "item_id": 5,
            "producto_nombre": "Tornillo M4",
            "proveedor_nombre": "Proveedor A",
            "stock": 200,
            "precio_unitario": "0.10",
            "valor_total_item": "20.00"
        },
        {
            "item_id": 3,
            "producto_nombre": "Motor 12V",
            "proveedor_nombre": "Proveedor B",
            "stock": 10,
            "precio_unitario": "150.00",
            "valor_total_item": "1500.00"
        }
    ]
}
```

* Respuesta de error (500):

```json
{
    "error": "Error interno del servidor al generar el informe.",
    "detalle": "Se produjo un error al consultar la base de datos"
}
```

Ejemplo de uso Curl
```bash
curl -X GET http://localhost:3000/informes/inventario
```

# 7. Producto más vendido

* **Endpoint**: GET /informes/producto-mas-vendido

* **Descripción**: Devuelve el producto con mayor cantidad total vendida (se suma la columna `quantity` en `OrderDetails`).

* Respuesta exitosa (200):

```json
{
    "producto_mas_vendido": {
        "item_id": 10,
        "nombre": "Cámara HD",
        "total_vendido": 124
    }
}
```

* Respuesta cuando no hay ventas registradas (404):

```json
{
    "message": "No hay ventas registradas todavía."
}
```

* Respuesta de error (500):

```json
{
    "error": "Error interno del servidor al obtener el producto más vendido.",
    "detalle": "Se produjo un error al ejecutar la consulta"
}
```

Ejemplo de uso CURL
```bash
# Obtener el producto más vendido
curl -X GET http://localhost:3000/informes/producto-mas-vendido
```
