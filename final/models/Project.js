var mongoose = require('mongoose');

// Create the projectSchema.
var projectSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    project_name: {
        type: String,
        required: true


    },

    data: {
        type: String,
        required: true
    }
});
var Project = mongoose.model("project", projectSchema);
// Export the model.
module.exports = Project;