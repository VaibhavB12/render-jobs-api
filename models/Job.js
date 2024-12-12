const mongoose = require('mongoose');
const JobSchema = new mongoose.Schema({
    company: {
        type: String,
        required: [true, 'Please provide company name'],
        maxLength: 50
    },
    position: {
        type: String,
        required: [true, 'Please provide position'],
        maxLength: 100
    },
    status: {
        type: String,
        enum: ['interview', 'declined', 'pending'],
        default: 'pending'
    },
    createdBy: { // tie Job model to the User model
        type: mongoose.Types.ObjectId, // everytime we create a job we assign it to one of the user
        ref: 'User',
        required: [true, 'Please provide a user']
    }
}, { timestamps: true } )
module.exports = mongoose.model('Job', JobSchema);
// every job we will create will be associated with a user