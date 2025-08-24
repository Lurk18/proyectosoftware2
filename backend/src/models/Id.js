const mongoose = require('mongoose');

const IdSchema = new mongoose.Schema({}, { strict: false }); // <– Esto permite guardar los demás campos sin definir todos

const Id = mongoose.model('Id', IdSchema, 'nutrition_data');

module.exports = Id;
