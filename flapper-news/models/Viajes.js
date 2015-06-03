var mongoose = require('mongoose');

var ViajeSchema = new mongoose.Schema({
  nombre: String,
  usuario: String,
  fecha_inicio: Date,
  fecha_fin: Date,
  ciudades: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ciudad' }]

  }); //[{id:String, nombre: String, latitude: String, longitude: String, message: String}]

mongoose.model('Viaje', ViajeSchema);