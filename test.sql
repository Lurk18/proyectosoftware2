INSERT INTO Cliente (customer_name, contact_info) 
VALUES 
('Juan Pérez', 'juan.perez@example.com'),
('María Gómez', 'maria.gomez@example.com'),
('Carlos López', 'carlos.lopez@example.com');

SELECT * 
FROM Cliente 
WHERE customer_name = 'María Gómez';