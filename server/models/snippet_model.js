const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const SnippetSchema = mongoose.Schema({
    title : {type: 'String'},
    description :{type: 'String'},
    code :{type:'String'},
    user:{type: ObjectId, required : true}
},{
    timestamps: true
});

const SnippetModel = mongoose.model("SnippetModel", SnippetSchema);

module.exports = SnippetModel;
