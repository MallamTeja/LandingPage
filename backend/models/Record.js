const mongoose = require('mongoose');

const RecordSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
    },
    phone: {
        type: String,
        trim: true
    },
    category: {
        type: String,
        trim: true,
        required: [true, 'Category is required']
    },
    date: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    notes: {
        type: String,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, { 
    timestamps: { 
        createdAt: 'createdAt', 
        updatedAt: 'updatedAt' 
    } 
});

// Pre-save hook to update the updatedAt field
RecordSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Virtual field for formatted date (not stored in DB)
RecordSchema.virtual('formattedDate').get(function() {
    return this.date ? this.date.toISOString().split('T')[0] : '';
});

// Configure the model to include virtuals when converting to JSON
RecordSchema.set('toJSON', { virtuals: true });
RecordSchema.set('toObject', { virtuals: true });

const Record = mongoose.model('Record', RecordSchema);

module.exports = Record;