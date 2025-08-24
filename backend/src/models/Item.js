const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({}, { strict: false }); // <– Esto permite guardar los demás campos sin definir todos

const Item = mongoose.model('Item', itemSchema, 'nutrition_data');

module.exports = Item;
