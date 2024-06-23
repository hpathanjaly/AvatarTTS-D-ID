// CSS and SDK imports
import './style.css'
import * as sdk from "@d-id/client-sdk"

// Enter your Agent's Embedded Client Key and ID (From D-ID Studio):
// PROD
// let auth = { type: 'key', clientKey: "CLIENT_KEY_FROM_STUDIO" };
// let agentId = "AGENT_ID_FROM_STUDIO"
// let baseURL = "https://api.d-id.com"
// let wsURL = "wss://notifications.d-id.com"

// STAGING
let auth = { type: 'key', clientKey: "CLIENT_KEY_FROM_STUDIO"};
let agentId = "AGENT_ID_FROM_STUDIO"
let baseURL = "https://api-dev.d-id.com"
let wsURL = "wss://notifications-dev.d-id.com"


// Variables declaration
let videoElement = document.querySelector("#videoElement")
let textArea = document.querySelector("#textArea")
let langSelect = document.querySelector("#langSelect")
let speechButton = document.querySelector("#speechButton");
let answers = document.querySelector("#answers")
let connectionLabel = document.querySelector("#connectionLabel")
let chatButton = document.querySelector('#chatButton')
let speakButton = document.querySelector('#speakButton')
let reconnectButton = document.querySelector('#reconnectButton')
let srcObject

// Define the Agent's SDK callback methods and their behavior: 
const callbacks = {

  // Link the HTML Video element with the WebRTC Stream Object (Video & Audio)
  onSrcObjectReady(value) {
    console.log("onSrcObjectReady()", value)
    videoElement.srcObject = value
    srcObject = value
    return srcObject
  },

  // Connection States callback method
  onConnectionStateChange(state) {

    console.log("onConnectionStateChange(): ", state)

    if (state == "connected") {
      // Setting the 'Enter' Key to Send a message
      textArea.addEventListener('keypress', (event) => { if (event.key === "Enter") { event.preventDefault(); chat() } })

      chatButton.removeAttribute("disabled")
      speakButton.removeAttribute("disabled")
      langSelect.removeAttribute("disabled")
      speechButton.removeAttribute("disabled")
      document.querySelector("#hidden").style.display = "none"
      connectionLabel.innerHTML = "Online"
    }

    else if (state == "disconnected" || state == "closed") {
      textArea.removeEventListener('keypress', (event) => { if (event.key === "Enter") { event.preventDefault(); chat() } })
      document.querySelector("#hidden_h2").innerHTML = `${agent.agent.preview_name} Disconnected`
      document.querySelector("#hidden").style.display = ""
      document.querySelector("#container").style.display = "none"
      chatButton.setAttribute("disabled", true)
      speakButton.setAttribute("disabled", true)
      langSelect.setAttribute("disabled", true)
      speechButton.setAttribute("disabled", true)
      connectionLabel.innerHTML = ""
    }
  },

  // Switching between the idle and streamed videos
  onVideoStateChange(state) {
    console.log("onVideoStateChange(): ", state)
    if (state == "STOP") {
      videoElement.srcObject = undefined
      videoElement.src = agent.agent.presenter.idle_video
    }
    else {
      videoElement.src = ""
      videoElement.srcObject = srcObject
      connectionLabel.innerHTML = "Online"
    }
  },

  // New messages callback method
  onNewMessage(messages) {
    // We want to show only the last message from the entire 'messages' array
    let lastIndex = messages.length - 1
    let msg = messages[lastIndex]
    console.log(msg)

    // Show Rating buttons only for the Agent's (assistant) answers
    if (msg.role == "assistant" && messages.length != 1) {
      answers.innerHTML += `${timeDisplay()} - [${msg.role}] : ${msg.content}  <button id='${msg.id}_plus' title='agent.rate() -> Rate this answer (+)'>+</button> <button id='${msg.id}_minus' title='agent.rate() -> Rate this answer (-)'>-</button> <br>`

      document.getElementById(`${msg.id}_plus`).addEventListener('click', () => rate(msg.id, 1))
      document.getElementById(`${msg.id}_minus`).addEventListener('click', () => rate(msg.id, -1))
    } else {
      answers.innerHTML += `${timeDisplay()} - [${msg.role}] : ${msg.content}  <br>`
    }

    // Auto-scroll to the last message 
    answers.scrollTop = answers.scrollHeight
  }
}

// Local functions to utilize the Agent's SDK methods:

// agent.speak() -> Streaming API (Bring your own LLM)
function speak() {
  let val = textArea.value
  // Minimum of 3 characters?
  if (val !== "" && val.length > 2) {
    let speak = agent.speak(
      {
        type: "text",
        input: val
      }
    )
    console.log(`agent.speak("${val}")`)

    connectionLabel.innerHTML = "Streaming.."
  }
}
// agent.chat() -> Agents API (Communicating with your created Agent and its knowledge - D-ID's LLM)
function chat() {
  let val = textArea.value
  if (val !== "") {
    let chat = agent.chat(val)
    console.log("agent.chat()")

    connectionLabel.innerHTML = "Thinking.."
    textArea.value = ""
  }

}

// agent.rate() -> Rating the Agent's answers - for future Agents Analytics feature
function rate(messageID, score) {
  let rate = agent.rate(messageID, score)
  console.log(`Message ID: ${messageID} Rated:${score}\n`, "Result", rate)
}

// agent.reconnect() -> Reconnect the Agent to a new WebRTC session
function reconnect() {
  let reconnect = agent.reconnect()
  console.log("agent.reconnect()", reconnect)

  // Hiding the Disconnection overlay and restoring the page:
  document.querySelector("#hidden").style.display = "none"
  document.querySelector("#container").style.display = "flex"
}

// agent.disconnect() -> Terminates the current Agent's WebRTC session (Not implemneted in this example)
function disconnect() {
  let terminate = agent.disconnect()
  console.log("agent.disconnect()", disconnect)
}

// JS utility function for 'cleaner' time display in (HH:MM:SS)
function timeDisplay() {
  const currentTime = new Date();
  const hours = currentTime.getHours().toString().padStart(2, '0');
  const minutes = currentTime.getMinutes().toString().padStart(2, '0');
  const seconds = currentTime.getSeconds().toString().padStart(2, '0');
  const formattedTime = `${hours}:${minutes}:${seconds}`;
  return formattedTime;
}

// Event Listeners for Agent's built-in methods
chatButton.addEventListener('click', () => chat())
speakButton.addEventListener('click', () => speak())
reconnectButton.addEventListener('click', () => reconnect())
speechButton.addEventListener('click', () => toggleStartStop())

// Focus on input and button disabling when loading
window.addEventListener('load', () => {
  textArea.focus(), 
  chatButton.setAttribute("disabled", true)
  speakButton.setAttribute("disabled", true)
  langSelect.setAttribute("disabled", true)
  speechButton.setAttribute("disabled", true)
})


// *** Finally ***
// Calling the SDK with all that is configured above!
let agent = await sdk.createAgentManager(agentId, { callbacks, auth, baseURL, wsURL });
console.log("sdk.createAgentManager()", agent.agent)

// console.log("sdk.getAgent()",sdk.getAgent(agentId, auth, baseURL))

// Showing the Agent's name in the Header
document.querySelector("#previewName").innerHTML = agent.agent.preview_name

// agent.connect() -> Connecting the Agent to a new WebRTC session
console.log("agent.connect()")
agent.connect()

// Happy Coding! 
