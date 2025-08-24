const Ingredient = require('../models/Ingredient');

const campos = {
  "Main food description": 1,
  "WWEIA Category description": 1,
  _id: 1 // si no quieres que devuelva el _id
};

function crearRegex(palabra) {
  let partes = [];
  for (const letra of palabra) {
    partes.push(letra);
    partes.push('[^a-zA-Z]*');
  }
  let regexStr = partes.join('');
  regexStr = regexStr.slice(0, -'[^a-zA-Z]*'.length); // quitamos el último
  return new RegExp(regexStr, 'i');
}

// Buscar un ítem por Desc
exports.getItemByDesc = async (req, res) => {
  try {
    const regex = crearRegex(String(req.params.description));
    const description = req.params.description;
    console.log('■ ■ ■ Buscando findMany con desc:', description,"■ ■ ■ y regex = ",regex);

    const query = {
      $or: [
        { "Main food description": { $regex: regex } },
        { "WWEIA Category description": { $regex: regex } }
      ]
    };

    const ingredient = await Ingredient.find(query,campos);

    if (!ingredient) {
      return res.status(404).json({ message: 'Item no encontrado' });
    }
    res.json(ingredient);
  } catch (error) {
    res.status(500).json({ message: 'Error en la consulta', error });
  }
};
