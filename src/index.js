require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const Db = require('./Db');
const AWS = require('aws-sdk');
const Stream = require('stream');

const PORT = process.env.PORT;

AWS.config.update({region: 'eu-west-3'});
const polly = new AWS.Polly({signatureVersion: 'v4'});
const voiceIds = ['Mathieu', 'Celine', 'Chantal'];

let db = new Db(new AWS.DynamoDB({apiVersion: '2012-10-08'}), process.env.DB_NAME);

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, '/views/'));

app.use('/assets', express.static(path.join(__dirname + '/../assets')));

app.get('/', function(req, res) {
    db.getRandomJoke().then((joke) => {
        res.render('index', {
            joke: joke['JOKE']['S'],
            jokeId: joke['ID']['S'],
            audioUrl: `/speech/${encodeURI(joke['JOKE']['S'])}`
        });
    }).catch((e) => {
        console.error(e.message);
        res.status(400).end();
    });
});

app.get('/speech/:jokeId', function(req, res) {
    const jokeId = req.params.jokeId;
    db.getJokeFromId(jokeId).then((joke) => {
        polly.synthesizeSpeech({
            OutputFormat: 'mp3',
            Text: joke['JOKE']['S'],
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
    }).catch((e) => {
        console.error(e.message);
        res.status(400).end();
    });
});

app.listen(PORT, () => console.log(`App listen port ${PORT}`));
