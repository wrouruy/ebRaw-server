const express = require('express');
const app = express();

const PORT = 3000;

app.get('/hello', (req, res) => {
    res.json({ msg: 'hello, ebRaw!' });
})

app.listen(PORT, (err) => {
    if(err) console.log(err);
    console.log('server has listen on port ' + PORT);

})
