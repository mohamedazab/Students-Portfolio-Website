var mongoose = require('mongoose');

// Create the Schema.
var studentSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    profile_pic: {
        type: String,
        required: false

    },
    description: {
        type: String,
        required: true
    }
});

// Export the model.
var Student = mongoose.model('student', studentSchema);
module.exports = Student;