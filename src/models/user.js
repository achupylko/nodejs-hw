import { model, Schema } from 'mongoose';

const userSchema = new Schema(
  {
    username: { type: String, trim: true },
    email: { type: String, unique: true, required: true, trim: true },
    password: { type: String, length: 8, required: true },
  },
  { timestamps: true },
);

// Set default username as email
userSchema.pre('save', function () {
  if (!this.username) {
    this.username = this.email;
  }
});

// Override the toJSON method
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export const User = model('User', userSchema);
