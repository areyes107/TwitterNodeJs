const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

const RetweetSchema = Schema({
    creator: {type: Schema.Types.ObjectId, ref: 'user'},
    comment: String
},
{
    versionKey: false
}
)
module.exports = Mongoose.model('retweet', RetweetSchema)

