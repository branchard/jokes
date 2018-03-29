let text = document.querySelector('blockquote p').innerHTML;
let audio = new Audio(`/speech/${encodeURI(text)}`);
audio.play();
