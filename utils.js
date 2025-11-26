const { Collection } = require('./models.js');

async function getCollectionId(title) {
    const collection = await Collection.findOne({ title });
    return collection ? collection._id : null;
}

module.exports = { getCollectionId };