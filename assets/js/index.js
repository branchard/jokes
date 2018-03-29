let text = document.querySelector('blockquote p').innerHTML;
window.addEventListener('load', () => {
    // noinspection JSUnresolvedVariable
    let audioCtx = new(window.AudioContext || window.webkitAudioContext)();
    let xhr = new XMLHttpRequest();
    xhr.open('GET', `/speech/${encodeURI(text)}`);
    xhr.responseType = 'arraybuffer';
    xhr.addEventListener('load', () => {
        let playsound = (audioBuffer) => {
            let source = audioCtx.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(audioCtx.destination);
            source.loop = false;
            source.start();

            setTimeout(function() {
                let t = document.createElement('p');
                t.appendChild(document.createTextNode((new Date()).toLocaleString() + ': Sound played'));
                document.querySelector('.output').appendChild(t);
                playsound(audioBuffer);
            }, 1000 + Math.random() * 2500);
        };

        audioCtx.decodeAudioData(xhr.response).then(playsound);
    });
    xhr.send();
});
