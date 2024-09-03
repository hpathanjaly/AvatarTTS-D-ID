// Following code is for recognizing text from mic
var recognizing;

var recognition;

if (navigator.userAgent.includes("Firefox")) {
  recognition = new SpeechRecognition();
} else {
  recognition = new webkitSpeechRecognition();
}
recognition.lang = langSelect.value;
recognition.continuous = true;
reset();
// recognition.onend = reset;
recognition.onend = function () {
  console.log("Recognition ended.");
  reset();
};

recognition.onerror = function (event) {
  console.error("Speech recognition error:", event.error);
  console.error("Event:", event);
  reset();
};

recognition.onstart = function () {
  console.log("Recognition started.");
};

recognition.onaudiostart = function () {
  console.log("Audio capturing started.");
};

recognition.onresult = handleSpeechRecognitionResult;

function handleSpeechRecognitionResult(event) {
  console.log("onresult triggered");
  console.log(event);

  for (var i = event.resultIndex; i < event.results.length; ++i) {
    if (event.results[i].isFinal) {
      console.log("Final result:", event.results[i][0].transcript);
      textArea.value += event.results[i][0].transcript;
    }
  }
}

function reset() {
  recognizing = false;
  speechButton.style.color = "white";
  speechButton.innerHTML = `<span class="material-symbols-outlined">mic</span>`;
  chatButton.removeAttribute("disabled");
  speakButton.removeAttribute("disabled");
}

export function toggleStartStop() {
  recognition.lang = langSelect.value;
  if (recognizing) {
    textArea.focus();
    recognition.stop();
    reset();
  } else {
    textArea.value = "";
    recognition.start();
    recognizing = true;
    speechButton.style.color = "red";
    // speechButton.innerHTML = "&#x23F9;";
    chatButton.setAttribute("disabled", true);
    speakButton.setAttribute("disabled", true);
  }
}
