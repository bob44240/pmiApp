const User = require('../models/user'); // Import User Model Schema
const Participant = require('../models/participant'); // Import Participant Model Schema
const jwt = require('jsonwebtoken'); // Compact, URL-safe means of representing claims to be transferred between two parties.
const config = require('../config/database'); // Import database configuration
const { Console } = require('console');
module.exports = (router) => {
    
    router.post('/newParticipant', (req, res) => {
        console.log("Norma")

        if (!req.body.name) {
        res.json({ success: false, message: 'Name is required.' }); // Return error message
    } else {
                // Create the participant object for insertion into database
                const participant = new Participant({
                    name: req.body.name,
                    email: req.body.email,
                    created: req.body.created,
                    mutations: req.body.mutations,
                    exposure: req.body.exposure,
                    lastUpdate: req.body.lastUpdate,
                    age: req.body.age,
                    siblings: req.body.siblings
                });
                // Save participant into database
                participant.save((err) => {
                    // Check if error
                    if (err) {
                        console.log('error====================================');
                        console.log(err);

                        // Check if error is a validation error
                        if (err.errors) {
                            console.log(err.errors);
                            // Check if validation error is in the title field
                            if (err.errors.title) {
                                res.json({ success: false, message: err.errors.title.message }); // Return error message
                            } else {
                                // Check if validation error is in the body field
                                if (err.errors.body) {
                                    res.json({ success: false, message: err.errors.body.message }); // Return error message
                                } else {
                                    res.json({ success: false, message: err }); // Return general error message
                                }
                            }
                        } else {
                            res.json({ success: false, message: err }); // Return general error message
                        }
                    } else {
                        res.json({ success: true, message: 'Participant saved!' }); // Return success message
            }
            })}});


    /* ===============================================================
     GET ALL ParticipantS
     =============================================================== */
    router.get('/allParticipants', (req, res) => {
        // Search database for all participant posts
        Participant.find({}, (err, participants) => {
        // Check if error was found or not
        if (err) {
            res.json({ success: false, message: err }); // Return error message
        } else {
            // Check if participants were found in database
            if (!participants) {
        res.json({ success: false, message: 'No participants found.' }); // Return error of no participants found
    } else {
        res.json({ success: true, participants: participants }); // Return success and participants array
        console.log(participants);
    }
}
}).sort({ '_id': -1 }); // Sort participants from newest to oldest
});

    /* ===============================================================
     GET SINGLE Participant
     =============================================================== */
    router.get('/singleParticipant/:id', (req, res) => {
        // Check if id is present in parameters
        if (!req.params.id) {
        res.json({ success: false, message: 'No participant ID was provided.' }); // Return error message
    } else {
        // Check if the participant id is found in database
        Participant.findOne({ _id: req.params.id }, (err, participant) => {
            // Check if the id is a valid ID
            if (err) {
                res.json({ success: false, message: 'Not a valid participant id' }); // Return error message
            } else {
                // Check if participant was found by id
                if (!participant) {
            res.json({ success: false, message: 'Participant not found.' }); // Return error message
        } else {
            // Find the current user that is logged in
            User.findOne({ _id: req.decoded.userId }, (err, user) => {
                // Check if error was found
                if (err) {
                    res.json({ success: false, message: err }); // Return error
                } else {
                    // Check if username was found in database
                    if (!user) {
                res.json({ success: false, message: 'Unable to authenticate user' }); // Return error message
            } else {
                // Check if the user who requested single participant is the one who created it
                if (user.username !== participant.createdBy) {
                    res.json({ success: false, message: 'You are not authorized to edit this participant.' }); // Return authentication reror
                } else {
                    res.json({ success: true, participant: participant }); // Return success
                }
            }
        }
        });
        }
    }
    });
    }
});
    
    router.put('/updateParticipant', (req, res) => {
        // Check if id was provided
        if (!req.body._id) {
        res.json({ success: false, message: 'No participant id provided' }); // Return error message
    } else {
        // Check if id exists in database
        Participant.findOne({ _id: req.body._id }, (err, participant) => {
            // Check if id is a valid ID
            if (err) {
                res.json({ success: false, message: 'Not a valid participant id' }); // Return error message
            } else {
                // Check if id was found in the database
                if (!participant) {
            res.json({ success: false, message: 'Participant id was not found.' }); // Return error message
        } else {
            // Check who user is that is requesting participant update
            User.findOne({ _id: req.decoded.userId }, (err, user) => {
                // Check if error was found
                if (err) {
                    res.json({ success: false, message: err }); // Return error message
                } else {
                    // Check if user was found in the database
                    if (!user) {
                res.json({ success: false, message: 'Unable to authenticate user.' }); // Return error message
            } else {
                // Check if user logged in the the one requesting to update participant post
                if (user.username !== participant.createdBy) {
                    res.json({ success: false, message: 'You are not authorized to edit this participant post.' }); // Return error message
                } else {
                    participant.title = req.body.title; // Save latest participant title
                    participant.body = req.body.body; // Save latest body
                    participant.save((err) => {
                        if (err) {
                            if (err.errors) {
                                res.json({ success: false, message: 'Please ensure form is filled out properly' });
                            } else {
                                res.json({ success: false, message: err }); // Return error message
                            }
                        } else {
                            res.json({ success: true, message: 'Participant Updated!' }); // Return success message
                }
                });
                }
            }
        }
        });
        }
    }
    });
    }
});

    /* ===============================================================
     DELETE Participant POST
     =============================================================== */
    router.delete('/deleteParticipant/:id', (req, res) => {
        // Check if ID was provided in parameters
        if (!req.params.id) {
        res.json({ success: false, message: 'No id provided' }); // Return error message
    } else {
        // Check if id is found in database
        Participant.findOne({ _id: req.params.id }, (err, participant) => {
            // Check if error was found
            if (err) {
                res.json({ success: false, message: 'Invalid id' }); // Return error message
            } else {
                // Check if participant was found in database
                if (!participant) {
            res.json({ success: false, messasge: 'Participant was not found' }); // Return error message
        } else {
            // Get info on user who is attempting to delete post
            User.findOne({ _id: req.decoded.userId }, (err, user) => {
                // Check if error was found
                if (err) {
                    res.json({ success: false, message: err }); // Return error message
                } else {
                    // Check if user's id was found in database
                    if (!user) {
                res.json({ success: false, message: 'Unable to authenticate user.' }); // Return error message
            } else {
                // Check if user attempting to delete participant is the same user who originally posted the participant
                if (user.username !== participant.createdBy) {
                    res.json({ success: false, message: 'You are not authorized to delete this participant post' }); // Return error message
                } else {
                    // Remove the participant from database
                    participant.remove((err) => {
                        if (err) {
                            res.json({ success: false, message: err }); // Return error message
                        } else {
                            res.json({ success: true, message: 'Participant deleted!' }); // Return success message
                }
                });
                }
            }
        }
        });
        }
    }
    });
    }
});


    return router;
}
