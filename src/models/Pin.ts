import { Schema, models, model } from 'mongoose';

const PinSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  image: { type: String },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

export default models.Pin || model('Pin', PinSchema);
