import * as sdk from "@d-id/client-sdk"

// PROD
let auth = { type: 'key', clientKey: "XXXX" };
let agentId = "agt_lBMfZpOf"
let baseURL = "https://api.d-id.com"
let wsURL = "wss://notifications.d-id.com"

// STAGING
// let auth = { type: 'key', clientKey: "ZZZZ"};
// let agentId = "agt_kU9nzMjB"
// let baseURL = "https://api-dev.d-id.com"
// let wsURL = "wss://notifications-dev.d-id.com"


let videoElement = document.querySelector("#videoElement")
let textArea = document.querySelector("#textArea")
let answers = document.querySelector("#answers")
let connectionLabel = document.querySelector("#connectionLabel")
let chatButton = document.querySelector('#chatButton')
let speakButton = document.querySelector('#speakButton')
let reconnectButton = document.querySelector('#reconnectButton')
let srcObject

const callbacks = {

  onSrcObjectReady(value) {
    videoElement.srcObject = value
    console.log("onSrcObjectReady()", value, "Attached to:", videoElement)
    srcObject = value
    return srcObject
  },

  onConnectionStateChange(state) {
    console.log("onConnectionStateChange(): ", state)
    // if (state == "disconnected" || state == "closed") {
    if (state == 0) {
      textArea.removeEventListener('keypress', (event) => { if (event.key === "Enter") { event.preventDefault(); chat() } })
      document.querySelector("#hidden_h2").innerHTML = `${agent.agent.preview_name} Disconnected`
      document.querySelector("#hidden").style.display = ""
      connectionLabel.innerHTML = ""
      chatButton.setAttribute("disabled", true)
      speakButton.setAttribute("disabled", true)
    }
    // else if(state == "connected") {
    else if (state == 2) {
      textArea.addEventListener('keypress', (event) => { if (event.key === "Enter") { event.preventDefault(); chat() } })
      connectionLabel.innerHTML = "Online"
      chatButton.removeAttribute("disabled")
      speakButton.removeAttribute("disabled")
    }

  },

  onChatEvents(progress, data) {
    console.log("onChatEvents():\n", "Progress:", progress,"\n", "Data:", data)
  },

  onVideoStateChange(state, data) {
    console.log("onVideoStateChange(): ", state)
    if (state == "STOP") {
      videoElement.classList.toggle("animated")
      videoElement.srcObject = undefined
      videoElement.src = agent.agent.presenter.idle_video 
      setTimeout(() => {
        videoElement.classList.remove("animated")
      }, 1000);

    }
    else {
      videoElement.classList.toggle("animated")
      videoElement.src = ""
      videoElement.srcObject = srcObject

      //Display Agent Answer with Video
      let agentAnswer = document.querySelectorAll('.agentAnswer')
      let last = agentAnswer.length - 1;
      if (agentAnswer.length != 0){
        agentAnswer[last].style.display = ""
        answers.scrollTop = answers.scrollHeight
      }
    

      connectionLabel.innerHTML = "Online"

      setTimeout(() => {
        videoElement.classList.remove("animated")
      }, 1000);
    }
  },

  onNewMessage(messages) {
    let lastIndex = messages.length - 1
    let msg = messages[lastIndex]
    if (lastIndex == 0) {
      console.log("onNewMessage(), Welcome message",msg)
    
    } else {
      console.log("onNewMessage(), Last message in array:",msg)

        // Removing the weird empty one
      if (msg.content !== "" && msg.role == "assistant") {

        connectionLabel.innerHTML = "Thinking..."
        const formattedTime = timeDisplay();
      
        // To avoid flickering - used create elements and "append" instead of a simple '.innerHTML +='  
        let agentAnswer = document.createElement("div")
        agentAnswer.setAttribute("id", msg.id)
        agentAnswer.classList.add("agentAnswer")
        agentAnswer.style.display = "none"
        let innerDiv = document.createElement("div");
        innerDiv.classList.add("innerDiv")
        innerDiv.innerHTML = `<video class="idle" width="250" height="250" src="${agent.agent.presenter.idle_video}" style="display: none;"></video>`
        agentAnswer.appendChild(innerDiv)
        agentAnswer.innerHTML +=
        `<div style="display: flex;justify-content: space-between;">
          <span>${msg.content}</span>
          <span class='time'>${formattedTime}</span>
          </div>
          <div class="rateBtns">
          <button id='${msg.id}_plus'>+</button>
          <button id='${msg.id}_minus'>-</button>
          </div>
        `
        answers.append(agentAnswer)

        // Rating buttons event listeners
        document.getElementById(`${msg.id}_plus`).addEventListener('click', () => rate(msg.id,1))
        document.getElementById(`${msg.id}_minus`).addEventListener('click', () => rate(msg.id,-1))

        // Place the active video in the element
        let newParent = document.querySelectorAll('.innerDiv');
        let lastIndex = newParent.length - 1;
        newParent[lastIndex].appendChild(videoElement);
        videoElement.style.display = ""

        // Show the hidden video in the penultimate div (instead of empty space)
        let penu = lastIndex - 1
        if (penu !== -1) {
          let penuDiv = document.querySelectorAll(".innerDiv .idle")[penu]
          penuDiv.style.display = ""
        }
      }
    }
  }
};

function timeDisplay() {
  const currentTime = new Date();
  const hours = currentTime.getHours().toString().padStart(2, '0');
  const minutes = currentTime.getMinutes().toString().padStart(2, '0');
  const formattedTime = `${hours}:${minutes}`;
  return formattedTime;
}

function speak() {
  let val = textArea.value
  if (val !== "") {
    console.log("Called the 'Speak' method")
    let y = agent.speak(
      {
        type: "text",
        provider: agent.agent.presenter.voice,
        input: val
      }
    )
    console.log(y)
  }
}

function chat() {
  let val = textArea.value
  const formattedTime = timeDisplay()
  if (val !== "") {
    let div = document.createElement('div');
    div.classList.add("userMessage")
    div.innerHTML = `<span>${val}</span><span class='time'>${formattedTime}</span>`
    answers.append(div)

    console.log("agent.chat()")
    answers.scrollTop = answers.scrollHeight


    let y = agent.chat(val)
    // Clear textArea
    textArea.value = ""
    // console.log(y)
  }

}

function rate(messageID, score) {
  console.log("RATE:", messageID, score)
  let y = agent.rate(messageID, score)
  console.log("RATE RESULT:", y)
}

function reconnect() {
  document.querySelector("#hidden").style.display = "none"
  let y = agent.reconnect()
  console.log("agent.reconnect()")
  console.log(y)
}


function terminate() {
  console.log("Called the 'Disconnect' method")
  let y = agent.disconnect()
  console.log(y)
  videoElement.style.display = "none"
}

chatButton.addEventListener('click', () => chat())
speakButton.addEventListener('click', () => speak())
reconnectButton.addEventListener('click', () => reconnect())

window.addEventListener('load', () => { textArea.focus() })


let agent = await sdk.createAgentManager(agentId, { callbacks, auth, baseURL, wsURL });

console.log("sdk.createAgentManager", agent)

document.querySelector("#thumbnail").style.backgroundImage = `url(${agent.agent.preview_thumbnail})`
document.querySelector("#previewName").innerHTML = agent.agent.preview_name


console.log("agent.connect()")
agent.connect()