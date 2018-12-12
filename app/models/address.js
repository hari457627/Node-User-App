var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var addressSchema = new Schema({
      userId: { type: Schema.Types.ObjectId, ref: 'User' },
      flat_no : String,
      area : {type:String,required:true},
      landmark : String,
      city : {type:String,required:true},
      state : {type:String,required:true},
      zipcode : {type:String,required:true},
    })
    .set('toJSON',{
        virtuals: true,
        versionKey:false,
        transform: function(doc, ret){ delete ret._id }
    });
module.exports = mongoose.model('Address', addressSchema);