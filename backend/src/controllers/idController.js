const Id = require('../models/Id');
const mongoose = require('mongoose');

// Buscar un ítem por foodCode (o puedes ajustar el criterio)
exports.getItemByID = async (req, res) => {
  const mongoid = req.params.mongoid

  console.log('■ ■ ■ Buscando findById con {"id":', mongoid, "}");

  if (!mongoose.Types.ObjectId.isValid(mongoid)) {
    return res.status(400).json({ message: 'ID inválido' });
  }
  try {
    const data = await Id.findById(mongoid);
    if (!data) {
      return res.status(404).json({ error: 'No encontrado' });
    }
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error en la consulta', error });
  }
};
