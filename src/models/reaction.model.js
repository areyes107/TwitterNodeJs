const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

const ReactionSchema =Schema({
    interactors: [{type: Schema.Types.ObjectId, ref: 'user'}],
    likes: {type: Schema.Types.ObjectId, ref: 'tweet'}
},
{
    versionKey: false
});

module.exports = Mongoose.model('reaction', ReactionSchema);