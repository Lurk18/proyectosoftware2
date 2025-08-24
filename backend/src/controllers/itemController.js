const Item = require('../models/Item');

// Buscar un ítem por foodCode (o puedes ajustar el criterio)
exports.getItemByFoodCode = async (req, res) => {
  try {
    const foodCode = parseInt(req.params.foodCode); // Aseguramos que sea número
    console.log('■ ■ ■ Buscando findOne con {"Food code":', foodCode, "}");
    
    const item = await Item.findOne({"Food code": foodCode});

    if (!item) {
      return res.status(404).json({ message: 'Item no encontrado' });
    }

    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Error en la consulta', error });
  }
};
