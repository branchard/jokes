window.addEventListener('load', () => {
    let jokeId = document.querySelector('blockquote p').dataset.id;
    let audioCtx = new(window.AudioContext || window.webkitAudioContext)();
    let xhr = new XMLHttpRequest();
    xhr.open('GET', `/speech/${jokeId}`);
    xhr.responseType = 'arraybuffer';
    xhr.addEventListener('load', () => {
        let playsound = (audioBuffer) => {
            let source = audioCtx.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(audioCtx.destination);
            source.loop = false;
            source.start();
        };

        audioCtx.decodeAudioData(xhr.response).then(playsound);
    });
    xhr.send();
});
