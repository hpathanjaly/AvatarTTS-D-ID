import './style.css'
import * as sdk from "@d-id/client-sdk"

// Alon PROD AGENT
let auth =  { type: 'key', clientKey: "Z29vZ2xlLW9hdXRoMnwxMDE3OTU1MTM4Mjg1Mzg2MTE4MDY6MGpqdjZjdWJDY2k0TUhPcEVsTnBR"};
let agentId = "agt_lBMfZpOf"
let baseURL = "https://api.d-id.com"
let wsURL = "wss://notifications.d-id.com"
let options = { auth: auth , callbacks: {} }


// DEV
// let auth =  { type: 'key', clientKey: "Z29vZ2xlLW9hdXRoMnwxMDQ4MDE3MzUxNzUzMjQ1MTUwMzM6YnM3VFpHemkybVdKRE5JQ0tGcVRs"};
// let agentId = "agt_cjsSI9Ta"
// let baseURL = "https://api-dev.d-id.com"
// let wsURL = "wss://notifications-dev.d-id.com"

let x = await sdk.getAgent(agentId,auth)
console.log("Agent ID: ", x.id)


const callbacks = {

  onSrcObjectReady(value) { 
    let videoRef = document.querySelector("#testVideo")
    // videoRef.src = x.presenter.idle_video

    console.log(videoRef)
    console.log("onSrcObjectReady", value)

    videoRef.srcObject = value 

    console.log("VIDEO REF attached?", videoRef.srcObject)
  },

  onConnectionStateChange(state){
    console.log("Connection State Changed", state)
  },
  onVideoStateChange(state, data){
    console.log("Video State Changed")
    console.log("State:", state)
    // console.log("Data", data)
  },
};

let z = await sdk.createAgentManager(agentId, {callbacks,auth});
console.log(z)


function speak(){
  console.log("I just spoke")
  let y = z.speak(
    {
      type: "text",
      provider: z.agent.presenter.voice, 
      input: "I JUST SPOKE VIA SDK",
    }
  )
  console.log(y)
}

function chat(){
  console.log("I just spoke")
  let y = z.chat(
    {
      role:'user',
      content: "What is your purpose?",
      created_at: Date.now().toLocaleString()
  }
  )

  console.log(y)
}


/* <video src="${x.presenter.idle_video}" autoplay muted loop></video> */

// HTML
document.querySelector('#app').innerHTML = `
  <div>
    <h1>Hello Agent SDK</h1>
    <div class="card">
      <button id="counter" type="button">SAY SOMETHING</button>
    </div>
  </div>
`
document.querySelector('#counter').addEventListener('click', () => chat())

