import { Schema, models, model } from 'mongoose';

const WishlistPinSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  image: { type: String },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

export default models.WishlistPin || model('WishlistPin', WishlistPinSchema);
