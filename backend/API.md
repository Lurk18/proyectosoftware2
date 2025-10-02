# API de Pedidos

## Crear Pedido

- **Endpoint:** `POST /pedidos`
- **Descripción:** Crea un nuevo pedido.
- **Cuerpo de la solicitud (JSON):**
    ```json
    {
        "clienteId": 1,
        "productos": [
            { "productoId": 10, "cantidad": 2 },
            { "productoId": 5, "cantidad": 1 }
        ]
    }
    ```
- **Respuesta exitosa (201):**
    ```json
    {
        "pedidoId": 123,
        "mensaje": "Pedido creado exitosamente"
    }
    ```

---

## Consultar Pedidos de un Cliente

- **Endpoint:** `GET /pedidos/cliente/{clienteId}`
- **Descripción:** Obtiene todos los pedidos de un cliente específico.
- **Ejemplo:**  
    `GET http://localhost:3000/pedidos/cliente/1`
- **Respuesta exitosa (200):**
    ```json
    [
        {
            "pedidoId": 123,
            "fecha": "2024-06-10",
            "estado": "pendiente",
            "productos": [
                { "productoId": 10, "cantidad": 2 }
            ]
        }
    ]
    ```