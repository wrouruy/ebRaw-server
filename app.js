const express  = require('express');
const mongoose = require('mongoose');
const multer   = require('multer');
require('dotenv').config({ quiet: true });
const app = express();

const PORT = 3000;
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('\x1b[32m\x1b[1m~ Connected to MongoDB\x1b[0m'))
    .catch(err => console.log(`\x1b[31m\x1b[1m! Could not connect to MongoDB: \x1b[0m\x1b[1m\x1b[4m${err}\x1b[0m`));

app.use(express.json());
app.use('/uploads', express.static('uploads'));

const goodsShema = new mongoose.Schema({
    name: String,
    image: String,
    price: Number,
    rating: Number
});
const Goods = mongoose.model('Goods', goodsShema);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage });

const contributors_ua = ['віталік', 'олег', 'андрій', 'арсен', 'діма'];
const contributors_en = ['vitalik', 'oleg', 'andriy', 'arsen', 'dima'];

app.get('/hello', (req, res) => {
    res.json({ msg: 'hello, ebRaw!' });
});

app.get('/:name', (req, res) => {
    if(contributors_en.includes(req.params.name))
        res.json({ msg: `пішов в сраку ${contributors_ua[contributors_en.indexOf(req.params.name)]}` });
});

app.post('/add-goods', upload.single('image'), async (req, res) => {
    const newGoods = await Goods({
        name: req.body.name,
        image: '/uploads/' + req.file.filename,

        price: req.body.price
    });
    
    try {
        newGoods.save();
        res.json({ msg: 'Goods saved succesfully!' });
    } catch (err) {
        res.json({ msg: 'Goods saved error!' });
        console.log(`\x1b[31m\x1b[1mError saving user:\x1b[0m ${err}`);
    }
})

app.get('/all-goods', (req, res) => {
    Goods.find().then(goods =>
        res.json(goods));
});

app.get('/random-goods', async (req, res) => {
    try {
        const randomGoods = await Goods.aggregate([{ $sample: { size: 1 } }]);
        res.json(randomGoods[0]);
    } catch (err) {
        res.json({ error: err.message });
    }
});

app.get('/id-goods/:id', (req, res) => {
    Goods.findOne({_id: req.params.id}).then(goods => {
        res.json(goods);
    }).catch(() =>
        res.status(404).json({ msg: 'Page Not Found' })
    );
});

app.listen(PORT, (err) => {
    if(err) console.log(err);
    console.log(`Server is listening on port: \x1b[33m${PORT}\x1b[0m\n - \x1b[4mhttp://localhost:${PORT}\x1b[0m`);
});