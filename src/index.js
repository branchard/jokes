require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const AWS = require('aws-sdk');
const Fs = require('fs');
const Stream = require('stream')

const PORT = process.env.PORT;

const JOKES = [
    "Ta mère est tellement grosse que lorsqu'on prend une photo de sa maison, on la voit à toutes les fenêtres !",
    "Ta mère est tellement moche, que des fois j'me dis qu'être aveugle c'est pas si mal.",
    "Ta mère est tellement grosse qu'elle vient d'être déclarée nouvelle planète par la NASA.",
    "Ta mère est tellement vieille qu'elle a assisté à la naissance de Jésus, c'était la vache dans l'étable.",
    "Ta mère est tellement grosse que quand elle met un tee-shirt avec un H, les hélicos se posent dessus !",
    "Si tu vois un bateau qui flote sur l'eau, c'est que ta mère n'est pas à bord !",
    "Ta mère est tellement grosse qu'on la voit sans zoom sur Google Earth !",
    "Ta mère est tellement grosse que pour faire du skate, elle prend une planche de surf et des roues de tracteur!",
    "Ta mère est tellement grosse que sa ceinture, c'est l'équateur.",
    "Ta mère est tellement grosse que quand elle porte un panier, les gens la prennent pour une montgolfière.",
    "Ta mère est tellement grosse que quand elle marche en talon aiguille elle trouve du pétrole.",
    "Ta mère est tellement grosse qu'elle flotte sur l'eau quand elle fait une bombe.",
    "Ta mère est tellement grosse que chuck norris n'arrive pas à la soulever.",
    "Ta mère elle tellement grosse qu'elle fait planter Google.",
    "Ta mère elle est tellement radine que dans la rue, elle imite le cri des pigeons pour qu'on lui donne du pain.",
    "Ta mère a tellement de bourrelets que pour trouver son nombril, il faut des chiens d'avalanche.",
    "Ta mère est tellement grosse qu'elle marche sur ses bourlets.",
    "Ta mère est tellement grosse que pour la photographier, il faut un satellite."
];

const polly = new AWS.Polly({signatureVersion: 'v4', region: 'eu-west-3'});
const voiceIds = ['Mathieu', 'Celine'];

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, '/views/'));

app.use('/assets', express.static(path.join(__dirname + '/../assets')));

app.get('/', function(req, res) {
    res.render('index', {
        joke: JOKES[Math.floor(Math.random() * JOKES.length)]
    });
});

app.get('/speech/:text', function(req, res) {
    const text = req.params.text;

    // if joke does not exist
    if(!JOKES.includes(text)){
        res.status(400).end();
        return;
    }

    polly.synthesizeSpeech({
        OutputFormat: 'mp3',
        Text: text,
        VoiceId: voiceIds[Math.floor(Math.random() * voiceIds.length)]
    }, (err, data) => {
        if (err) {
            res.status(400).send(err);
        } else {
            const bufferStream = new Stream.PassThrough();
            bufferStream.end(new Buffer(data.AudioStream));
            res.set({'Content-Type': 'audio/mpeg'});
            bufferStream.on('error', bufferError => {
                res.status(400).end();
            });
            bufferStream.pipe(res);
        }
    });
});

app.listen(PORT, () => console.log(`App listen port ${PORT}`));
