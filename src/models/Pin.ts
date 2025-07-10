import { Schema, models, model } from 'mongoose';

const PinSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  photos: [{ type: String }],
  locationFound: { type: String },
  category: { type: String },
  type: { type: String },
  countryOfOrigin: { type: String },
  eventOfOrigin: { type: String },
  value: { type: Number },
  dateFound: { type: String },
  timeFound: { type: String },
  specialCharacteristics: [{ type: String }],
  totalCount: { type: Number },
  tradeableCount: { type: Number },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

export default models.Pin || model('Pin', PinSchema);
