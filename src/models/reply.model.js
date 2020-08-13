const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

const ReplySchema = ({
    author: {type: Schema.Types.ObjectId, ref: 'user'},
    content: String
},
{
    versionKey: false
});

module.exports = Mongoose.model('reply', ReplySchema);