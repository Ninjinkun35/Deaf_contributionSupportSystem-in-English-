document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById("readToggle");
    const label = document.getElementById("toggleLabel");
    const textarea = document.getElementById("Chat");
    const readToggle = document.getElementById("readToggle");
    const logArea = document.getElementById("logArea");
    let lastKeyWasEnter;

    let lastEnterTime = 0;

    toggle.addEventListener("change", () => {
        label.textContent = toggle.checked ? "Speech-to-Voice Output: ON" : "Speech-to-Voice Output: OFF";
    });

    textarea.addEventListener("keyup", function(e){
        if(e.key === 'Enter'){
            if(lastKeyWasEnter){
                textarea.value = '';
                lastKeyWasEnter = false;
                return;
            }

            const cursorPos = textarea.selectionStart;
            const textBeforeCursor = textarea.value.substring(0, cursorPos);

            const lines = textBeforeCursor.split('\n');
            const lastLine = lines[lines.length - 2] || '';

            if(readToggle.checked && lastLine.trim() !== ''){
                speak(lastLine);
            }
            else if(!readToggle.checked && lastLine.trim() !== ''){
                const logEntry = document.createElement("div");
                logEntry.textContent = lastLine;
                logArea.appendChild(logEntry);
                logEntry.scrollIntoView({ behavior: "smooth" });
            }
            lastKeyWasEnter = true;
        }else{
            lastKeyWasEnter = false;
        }
    });
});

function speak(text){
    const logArea = document.getElementById("logArea");

    const logEnrty = document.createElement("br");

    const spans = [...text].map(char => {
        const span = document.createElement("span");
        span.textContent = char;
        logArea.appendChild(span);
        logArea.appendChild(logEnrty);
        logEnrty.scrollIntoView({ behavior: "smooth" });
        return span;
    });

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 1.0;

    const charTime = 90;

    spans.forEach((span, i) => {
        setTimeout(() => {
            span.classList.add("red");
        }, i * charTime)
    });

    utterance.onend = () => {
        spans.forEach((span, i) => {
            span.classList.add("black");
        });
    };

    window.speechSynthesis.speak(utterance);
}

document.addEventListener('DOMContentLoaded', function(){
    const playButton = document.getElementById("Calling");
    const callingType = document.getElementById("CallingType");

    if(playButton){
        playButton.addEventListener("click", function(){
            const mode = callingType.value;

            playButton.disabled = true;
            playButton.textContent = "🔴 Calling...";
            playButton.classList.add("blink");

            if(mode === 'TextDisplay'){
                const utterance = new SpeechSynthesisUtterance("Excuse me");
                utterance.lang = "en-US";
                utterance.rate = 1.0;

                utterance.onend = () => {
                    resetCallButton();
                };

                window.speechSynthesis.speak(utterance);
            } else if(mode === 'ModeDisplay'){
                const audio = new Audio('CallingSound2.mp3');
                let playCount = 0;

                audio.addEventListener('ended', () => {
                    playCount++;
                    if(playCount < 2){
                        audio.currentTime = 0;
                        audio.play();
                    } else {
                        resetCallButton();
                    }
                });

                audio.play().catch(function(e){
                    console.log('Failed to play audio.', e);
                    resetCallButton();
                });
            } else if(mode === 'BlinkMode'){
                document.body.classList.add('blink-background');

                setTimeout(() => {
                    document.body.classList.remove('blink-background');
                    resetCallButton();
                }, 3000);
            }
        });

        function resetCallButton(){
            playButton.textContent = "Call";
            playButton.classList.remove("blink");
            playButton.disabled = false;
        }
    } else {
        console.error("The button does not exist in the DOM.");
    }
});

window.addEventListener('load', function(){
    let stream = null;
    const constraints = {
        audio: false,
        video: {
            width: 300,
            height: 300,
            facingMode: 'user',
        },
    }
    async function startCamera(constraints) {
        try{
            stream = await navigator.mediaDevices.getUserMedia(constraints);
            const video = document.getElementById('video');
            video.srcObject = stream;
            video.onloadedmetadata = () => {
                video.play();
            };
        } catch(err){
            console.error(err);
        }
    }
    function stopCamera(){
        const video = document.getElementById('video');
        const tracks = video.srcObject.getTracks();
        tracks.forEach((track) => {
            track.stop();
        });
        video.srcObject = null;
    }

    startCamera(constraints);
});