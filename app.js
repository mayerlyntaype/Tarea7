const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

mongoose.connect('mongodb://0.0.0.0:27017/musica', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
    console.log('MongoDB connected!');
  }).catch((error) => {
    console.error('MongoDB connection error:', error);
  });
  

const cancionSchema = new mongoose.Schema({
  nombre: String,
  artista: String,
  album: String
});

const Cancion = mongoose.model('Cancion', cancionSchema);

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/canciones', function(req, res) {
  var cancion = new Cancion({
    nombre: req.body.nombre,
    artista: req.body.artista,
    album: req.body.album
  });

  cancion.save()
    .then(function() {
      res.redirect('/listado');
    })
    .catch(function(err) {
      console.error(err);
      res.sendStatus(500);
    });
});


app.set('view engine', 'ejs');
app.get('/listado', (req, res) => {
    Cancion.find()
      .then(canciones => {
        res.render('listado', { canciones: canciones });
      })
      .catch(err => {
        console.log(err);
      });
  });
  

app.listen(3000, () => {
  console.log('Servidor iniciado en el puerto 3000.');
});
