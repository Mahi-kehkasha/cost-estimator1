import mongoose from 'mongoose';

const payloadCacheSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  value: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  lastAccessedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: false // We're managing timestamps manually
});

// Update lastAccessedAt when document is accessed
payloadCacheSchema.pre('findOne', function() {
  this.setOptions({ runValidators: true });
});

// Method to update lastAccessedAt
payloadCacheSchema.methods.updateAccessTime = async function() {
  this.lastAccessedAt = new Date();
  await this.save();
};

// Static method to find and update access time
payloadCacheSchema.statics.findAndUpdateAccess = async function(query) {
  const doc = await this.findOne(query);
  if (doc) {
    doc.lastAccessedAt = new Date();
    await doc.save();
  }
  return doc;
};

export const PayloadCache = mongoose.model('PayloadCache', payloadCacheSchema);

