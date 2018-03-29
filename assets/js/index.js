window.addEventListener('load', () => {
    let text = document.querySelector('blockquote p').innerHTML;
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
        };

        audioCtx.decodeAudioData(xhr.response).then(playsound);
    });
    xhr.send();
});
