const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');
const upload   = require('./multer.js');

const { getCollectionId }   = require('./utils.js');
const { Goods, Collection } = require('./models.js');

require('dotenv').config({ quiet: true });
const app = express();

const PORT = 3000;
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('\x1b[32m\x1b[1m~ Connected to MongoDB\x1b[0m'))
    .catch(err => console.log(`\x1b[31m\x1b[1m! Could not connect to MongoDB: \x1b[0m\x1b[1m\x1b[4m${err}\x1b[0m`));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));
app.use(cors());

// contributors names array
const contributors_ua = ['віталік', 'олег', 'андрій', 'арсен', 'діма'];
const contributors_en = ['vitalik', 'oleg', 'andriy', 'arsen', 'dima'];

// put goods to database
app.post('/add-goods', upload.single('image'), async (req, res) => {
    const id = await getCollectionId(req.body.collection);
    const newGoods = await Goods({
        name: req.body.name,
        image: '/uploads/' + req.file.filename,

        price: req.body.price,
        collection: id
    });

    newGoods.save().then(() => {
        res.json({ ok: true, msg: 'Goods saved succesfully!' })
    }).catch(err => {
        res.json({ ok: false, msg: 'Goods saved error!', error: err })
    });
});

// get all goods from db
app.get('/all-goods', (req, res) => {
    Goods.find().then(goods =>
        res.json(goods));
});

// get random goods
app.get('/random-goods', async (req, res) => {
    try {
        const randomGoods = await Goods.aggregate([{ $sample: { size: 1 } }]);
        res.json(randomGoods[0]);
    } catch (err) {
        res.json({ error: err.message });
    }
});

// get goods by id
app.get('/id-goods/:id', (req, res) => {
    Goods.findOne({_id: req.params.id}).then(goods => {
        res.json(goods);
    }).catch(() =>
        res.status(404).json({ msg: 'Page Not Found' }));
});

/* Collection */

// add new collection
app.post('/add-collection', upload.none(), async (req, res) => {
    const newCollection = await Collection({
        title: req.body.title,
        slug:  req.body.slug,
        description: req.body.description
    });

    newCollection.save().then(() =>
        res.json({ ok: true, msg: 'Collection saved succesfully!' })
    ).catch((err) =>
        res.json({ ok: false, msg: 'Collection saved error!', error: err }));
});

// get all collections
app.get('/all-collections', (req, res) => {
    Collection.find().then(collection =>
        res.json(collection));
});

// get random collection
app.get('/random-collection', async (req, res) => {
    try {
        const randomColl = await Collection.aggregate([{ $sample: { size: 1 } }]);
        res.json(randomColl[0]);
    } catch (err) {
        res.json({ error: err.message });
    }
});

app.get('/find-collection/:id', async (req, res) => {
    Collection.findOne(req.query.q == 'title' ? { title: req.params.id } : { _id: req.params.id } ).then(collection => 
        res.json(collection)
    ).catch((err) => res.status(404).json({ msg: 'Page Not Found', error: err }));
});

// get collections goods
app.get('/goods-in-collection/:collection', async (req, res) => {
    const collId = await getCollectionId(req.params.collection);
    Goods.find({ collection: collId }).then(goods => {
        res.json(goods);
    }).catch((err) =>
        res.status(404).json({ msg: 'Page Not Found', error: err }));
});

// "hello, ebRaw" endpoint
app.get('/hello', (req, res) => {
    res.json({ msg: 'hello, ebRaw!' });
});

// just a joke
app.get('/:name', (req, res) => {
    if(contributors_en.includes(req.params.name))
        res.json({ msg: `пішов в сраку ${contributors_ua[contributors_en.indexOf(req.params.name)]}` });
});

app.listen(PORT, (err) => {
    if(err) console.log(err);
    console.log(`Server is listening on port: \x1b[33m${PORT}\x1b[0m\n - \x1b[4mhttp://localhost:${PORT}\x1b[0m`);
});