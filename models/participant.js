/* ===================
 Import Node Modules
 =================== */
const mongoose = require('mongoose'); // Node Tool for MongoDB
mongoose.Promise = global.Promise; // Configure Mongoose Promises
const Schema = mongoose.Schema; // Import Schema from Mongoose

// Validate Function to check participant name length
let nameLengthChecker = (name) => {
    // Check if participant name exists
    if (!name) {
        return false; // Return error
    } else {
        // Check the length of name
        if (name.length < 5 || name.length > 50) {
            return false; // Return error if not within proper length
        } else {
            return true; // Return as valid title
        }
    }
};

// Validate Function to check if valid name format
let alphaNumericNameChecker = (name) => {
    // Check if name exists
    if (!name) {
        return false; // Return error
    } else {
        // Regular expression to test for a valid title
        const regExp = new RegExp(/^[a-zA-Z0-9 ]+$/);
        return regExp.test(name); // Return regular expression test results (true or false)
    }
};

// Array of Name Validators
const commentsValidators = [
    {
        validator: nameLengthChecker,
        message: 'Name must be more than 5 characters but no more than 50'
    },
    {
        validator: alphaNumericNameChecker,
        message: 'Name must be alphanumeric'
    }
];

// Validate Function to check body length
let commentLengthChecker = (body) => {
    // Check if body exists
    if (!body) {
        return false; // Return error
    } else {
        // Check length of body
        if (body.length < 5 || body.length > 500) {
            return false; // Return error if does not meet length requirement
        } else {
            return true; // Return as valid body
        }
    }
};


// Participant Model Definition
const participantSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String },
    mutations: { type: String },
    exposure: { type: String},
    created: { type: Date, default: Date.now() },
    lastUpdate: { type: Date, default: Date.now() },
    age: { type: Number, min: 1, max: 125, default: 1},
    siblings: { type: Boolean, default: false}


});

// Export Module/Schema
module.exports = mongoose.model('Participant', participantSchema );
