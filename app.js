const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const moongoose = require('moongoose');

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

app.set('view engine', 'ejs');

app.get('/', function(req, res) {
    
});



const PORT = process.env.PORT || 3000;

app.listen(PORT, function() {
    console.log(`Server started at port: ${PORT}`);
})