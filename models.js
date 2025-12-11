const mongoose = require('mongoose');

const collectionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    slug:  String,
    description: String
});
const Collection = mongoose.model('Collection', collectionSchema);

const goodsSchema = new mongoose.Schema({
    name:   String,
    image:  WritableStream,
    price:  Number,
    rating: Number,
    collection: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Collection'
    }
});
const Goods = mongoose.model('Goods', goodsSchema); // init db model

module.exports = { Goods, Collection };