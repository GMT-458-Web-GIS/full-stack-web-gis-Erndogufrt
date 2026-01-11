const mongoose = require('mongoose');

const LandmarkSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['Mosque', 'Castle', 'Bridge', 'Ruins'] },
  description: String,
  // Requirements 6: NoSQL GeoJSON Support
  location: {
    type: { type: String, enum: ['Point'], required: true },
    coordinates: { type: [Number], required: true } // [Longitude, Latitude]
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

// Requirements 4: Performance Monitoring (Spatial Indexing)
// Sorgu hızını artırmak için 2dsphere indeksi oluşturuyoruz.
LandmarkSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Landmark', LandmarkSchema);
