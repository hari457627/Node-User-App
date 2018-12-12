var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var userSchema = new Schema({
    name  :String,
    username:{type: String, unique:true, required:true},
    password:{type: String, required:true},
    email     : {type: String,unique:true,
                    validate: {
                        validator: function(v) {
                            return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(v);
                        },
                        message: '{VALUE} is not a valid email!'
                }},
    mobile    : {type: String,
                    unique:true,
                    validate: {
                        validator: function(v) {
                            return /\d{10}/.test(v);
                        },
                        message: '{VALUE} is not a valid phone number!'
                }}
    })
    .set('toJSON',{
        virtuals: true,
        versionKey:false,
        transform: function(doc, ret){ delete ret._id }
    });
module.exports = mongoose.model('User', userSchema);