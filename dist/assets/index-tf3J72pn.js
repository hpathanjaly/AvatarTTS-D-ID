(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))r(a);new MutationObserver(a=>{for(const o of a)if(o.type==="childList")for(const i of o.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&r(i)}).observe(document,{childList:!0,subtree:!0});function s(a){const o={};return a.integrity&&(o.integrity=a.integrity),a.referrerPolicy&&(o.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?o.credentials="include":a.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function r(a){if(a.ep)return;a.ep=!0;const o=s(a);fetch(a.href,o)}})();var _=(e=>(e.Functional="Functional",e.TextOnly="TextOnly",e.Maintenance="Maintenance",e.Playground="Playground",e.DirectPlayback="DirectPlayback",e))(_||{}),x=(e=>(e.Embed="embed",e.Query="query",e.Partial="partial",e.Answer="answer",e.Complete="done",e))(x||{}),H=(e=>(e.Clip="clip",e.Talk="talk",e))(H||{}),N=(e=>(e.Start="START",e.Stop="STOP",e))(N||{}),ne=(e=>(e.ChatAnswer="chat/answer",e.ChatPartial="chat/partial",e.StreamDone="stream/done",e.StreamStarted="stream/started",e.StreamFailed="stream/error",e.StreamReady="stream/ready",e.StreamCreated="stream/created",e.StreamVideoCreated="stream-video/started",e.StreamVideoDone="stream-video/done",e.StreamVideoError="stream-video/error",e.StreamVideoRejected="stream-video/rejected",e))(ne||{}),b=(e=>(e.New="new",e.Fail="fail",e.Connected="connected",e.Connecting="connecting",e.Closed="closed",e.Completed="completed",e.Disconnected="disconnected",e))(b||{});const X="https://api.d-id.com",we="wss://notifications.d-id.com",ve="79f81a83a67430be2bc0fd61042b8faa",K=()=>Math.random().toString(16).slice(2);function ce(){let e=window.localStorage.getItem("did_external_key_id");return e||(e=Math.random().toString(16).slice(2),window.localStorage.setItem("did_external_key_id",e)),e}let fe=K();function le(e){if(e.type==="bearer")return`Bearer ${e.token}`;if(e.type==="basic")return`Basic ${btoa(`${e.username}:${e.password}`)}`;if(e.type==="key")return`Client-Key ${e.clientKey}.${ce()}_${fe}`;throw new Error(`Unknown auth type: ${e}`)}function ae(e,t=X,s){const r=async(a,o)=>{const i=await fetch(t+(a!=null&&a.startsWith("/")?a:`/${a}`),{...o,headers:{...o==null?void 0:o.headers,Authorization:le(e),"Content-Type":"application/json"}});if(!i.ok){let n=await i.text().catch(()=>"Failed to fetch");throw s&&s(new Error(n),{url:a,options:o,headers:i.headers}),new Error(n)}return i.json()};return{get(a,o){return r(a,{...o,method:"GET"})},post(a,o,i){return r(a,{...i,body:JSON.stringify(o),method:"POST"})},delete(a,o,i){return r(a,{...i,body:JSON.stringify(o),method:"DELETE"})},patch(a,o,i){return r(a,{...i,body:JSON.stringify(o),method:"PATCH"})}}}function ye(e,t=X,s){const r=ae(e,`${t}/agents`,s);return{create(a,o){return r.post("/",a,o)},getAgents(a,o){return r.get(`/${a?`?tag=${a}`:""}`,o).then(i=>i??[])},getById(a,o){return r.get(`/${a}`,o)},delete(a,o){return r.delete(`/${a}`,void 0,o)},update(a,o,i){return r.patch(`/${a}`,o,i)},newChat(a,o,i){return r.post(`/${a}/chat`,o,i)},chat(a,o,i,n){return r.post(`/${a}/chat/${o}`,i,n)},createRating(a,o,i,n){return r.post(`/${a}/chat/${o}/ratings`,i,n)},updateRating(a,o,i,n,d){return r.patch(`/${a}/chat/${o}/ratings/${i}`,n,d)},deleteRating(a,o,i,n){return r.delete(`/${a}/chat/${o}/ratings/${i}`,n)}}}const be=e=>new Promise(t=>setTimeout(t,e));function Se(e){return new Promise((t,s)=>{const{callbacks:r,host:a,auth:o}=e,{onMessage:i=null,onOpen:n=null,onClose:d=null,onError:v=null}=r||{},f=new WebSocket(`${a}?authorization=${le(o)}`);f.onmessage=i,f.onclose=d,f.onerror=m=>{console.error(m),v==null||v("Websocket failed to connect",m),s(m)},f.onopen=m=>{n==null||n(m),t(f)}})}async function ke(e){const{retries:t=1}=e;let s=null;for(let r=0;(s==null?void 0:s.readyState)!==WebSocket.OPEN;r++)try{s=await Se(e)}catch(a){if(r===t)throw a;await be(r*500)}return s}async function Me(e,t,s){const r=s!=null&&s.onMessage?[s.onMessage]:[],a=await ke({auth:e,host:t,callbacks:{onError:s==null?void 0:s.onError,onMessage:o=>{const i=JSON.parse(o.data);r.forEach(n=>n(i.event,i))}}});return{socket:a,disconnect:()=>a.close(),subscribeToEvents:o=>r.push(o)}}const Ce="X-Playground-Chat";function _e(e,t,s,r){const a=ae(e,`${t}/agents/${s}`,r);return{createStream(o){return a.post("/streams",{compatibility_mode:o.compatibility_mode,stream_warmup:o.stream_warmup,session_timeout:o.session_timeout})},startConnection(o,i,n){return a.post(`/streams/${o}/sdp`,{session_id:n,answer:i})},addIceCandidate(o,i,n){return a.post(`/streams/${o}/ice`,{session_id:n,...i})},sendStreamRequest(o,i,n){return a.post(`/streams/${o}`,{session_id:i,...n})},close(o,i){return a.delete(`/streams/${o}`,{session_id:i})}}}function Ee(e,t,s,r){const a=ae(e,`${t}/agents/${s}`,r);return{createStream(o,i){return a.post("/streams",{driver_url:o.driver_url,face:o.face,config:o.config,compatibility_mode:o.compatibility_mode,stream_warmup:o.stream_warmup,output_resolution:o.output_resolution,session_timeout:o.session_timeout},i)},startConnection(o,i,n,d){return a.post(`/streams/${o}/sdp`,{session_id:n,answer:i},d)},addIceCandidate(o,i,n,d){return a.post(`/streams/${o}/ice`,{session_id:n,...i},d)},sendStreamRequest(o,i,n,d){return a.post(`/streams/${o}`,{session_id:i,...n},d)},close(o,i,n){return a.delete(`/streams/${o}`,{session_id:i},n)}}}let de=!1;const I=(e,t)=>de&&console.log(e,t),$e=(window.RTCPeerConnection||window.webkitRTCPeerConnection||window.mozRTCPeerConnection).bind(window);function oe(e){switch(e){case"connected":return b.Connected;case"checking":return b.Connecting;case"failed":return b.Fail;case"new":return b.New;case"closed":return b.Closed;case"disconnected":return b.Disconnected;case"completed":return b.Completed;default:return b.New}}function Te(){let e=0;return t=>{for(const s of t.values())if(s&&s.type==="inbound-rtp"&&s.kind==="video"){const r=s.bytesReceived,a=r-e>0;return e=r,a}return!1}}function Oe(e,t){const s=Math.max(Math.ceil(10),1);let r=0,a=!1;const o=Te();return setInterval(async()=>{const i=await e.getStats();o(i)?(r=0,a||(t==null||t(N.Start),a=!0)):a&&(r++,r>=s&&(t==null||t(N.Stop),a=!1))},100)}async function Ie(e,t,{debug:s=!1,callbacks:r,auth:a,baseURL:o=X,warmup:i}){de=s;let n;const{startConnection:d,sendStreamRequest:v,close:f,createStream:m,addIceCandidate:g}=t.videoType===H.Clip?_e(a,o,e,r.onError):Ee(a,o,e,r.onError),{id:h,offer:G,ice_servers:q,session_id:k}=await m(t),y=new $e({iceServers:q});if(!k)throw new Error("Could not create session_id");const c=Oe(y,r.onVideoStateChange);y.onicecandidate=l=>{I("peerConnection.onicecandidate",l),l.candidate&&l.candidate.sdpMid&&l.candidate.sdpMLineIndex!==null?g(h,{candidate:l.candidate.candidate,sdpMid:l.candidate.sdpMid,sdpMLineIndex:l.candidate.sdpMLineIndex},k):g(h,{candidate:null},k)},y.oniceconnectionstatechange=()=>{var l;I("peerConnection.oniceconnectionstatechange => "+y.iceConnectionState);const w=oe(y.iceConnectionState);w===b.Connected?n=setTimeout(()=>{var p;return(p=r.onConnectionStateChange)==null?void 0:p.call(r,b.Connected)},i?5e3:0):(clearTimeout(n),(l=r.onConnectionStateChange)==null||l.call(r,w))},y.ontrack=l=>{var w;I("peerConnection.ontrack",l),(w=r.onSrcObjectReady)==null||w.call(r,l.streams[0])},await y.setRemoteDescription(G),I("set remote description OK");const u=await y.createAnswer();return I("create answer OK"),await y.setLocalDescription(u),I("set local description OK"),await d(h,u,k),I("start connection OK"),{speak(l){return v(h,k,l)},async disconnect(){var l,w;if(h){const p=oe(y.iceConnectionState);if(y){if(p===b.New){(l=r.onVideoStateChange)==null||l.call(r,N.Stop),clearInterval(c);return}y.close(),y.oniceconnectionstatechange=null,y.onnegotiationneeded=null,y.onicecandidate=null,y.ontrack=null}try{p===b.Connected&&await f(h,k).catch(M=>{})}catch(M){I("Error on close stream connection",M)}(w=r.onVideoStateChange)==null||w.call(r,N.Stop),clearInterval(c)}},sessionId:k,streamId:h}}let Q={};function Le(e){const t=window!=null&&window.hasOwnProperty("DID_AGENTS_API")?"agents-ui":"agents-sdk",s=e.agent.presenter,r={token:e.token||"testKey",distinct_id:e.distinctId||ce(),agentId:e.agent.id,agentType:s.type==="clip"&&s.presenter_id.startsWith("v2_")?"clip_v2":s.type,owner_id:e.agent.owner_id??""};return{...r,isEnabled:e.isEnabled??!0,getRandom:()=>Math.random().toString(16).slice(2),track(a,o){if(!this.isEnabled)return Promise.reject("MixPanel analytics is disabled on creation");const{audioPath:i,...n}=o||{},d={method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:new URLSearchParams({data:JSON.stringify([{event:a,properties:{...n,...r,source:t,time:Date.now(),$insert_id:this.getRandom(),origin:window.location.href,"Screen Height":window.screen.height||window.innerWidth,"Screen Width":window.screen.width||window.innerHeight,"User Agent":navigator.userAgent}}])})};return fetch("https://api-js.mixpanel.com/track/?verbose=1&ip=1",d).then(v=>v.json()).catch(v=>console.error(v))},linkTrack(a,o,i,n){Q[a]||(Q[a]={events:{},resolvedDependencies:[]}),n.includes(i)||n.push(i);const d=Q[a];if(d.events[i]={props:o},d.resolvedDependencies.push(i),n.every(v=>d.resolvedDependencies.includes(v))){const v=n.reduce((f,m)=>d.events[m]?{...f,...d.events[m].props}:f,{});this.track(a,v),d.resolvedDependencies=d.resolvedDependencies.filter(f=>!n.includes(f)),n.forEach(f=>{delete d.events[f]})}}}}function De(e){var t,s,r,a;const o=()=>/Mobi|Android/i.test(navigator.userAgent)?"Mobile":"Desktop",i=()=>{const d=navigator.platform;return d.toLowerCase().includes("win")?"Windows":d.toLowerCase().includes("mac")?"Mac OS X":d.toLowerCase().includes("linux")?"Linux":"Unknown"},n=e.presenter;return{$os:`${i()}`,isMobile:`${o()=="Mobile"}`,browser:navigator.userAgent,origin:window.location.origin,agentType:n.type==="clip"&&n.presenter_id.startsWith("v2_")?"clip_v2":n.type,agentVoice:{voiceId:(s=(t=e.presenter)==null?void 0:t.voice)==null?void 0:s.voice_id,provider:(a=(r=e.presenter)==null?void 0:r.voice)==null?void 0:a.type}}}function Pe(e,t,s){var r,a;const{event:o,...i}=e,{template:n}=(t==null?void 0:t.llm)||{},{language:d}=((r=t==null?void 0:t.presenter)==null?void 0:r.voice)||{},{stitch:v}=(t==null?void 0:t.presenter)||{};return{...i,llm:{...i.llm,template:n},script:{...i.script,provider:{...(a=i==null?void 0:i.script)==null?void 0:a.provider,language:d}},stitch:v,...s}}let R=0;function Ae(e,t){var s,r,a,o,i,n,d;return e.presenter.type===H.Clip?{videoType:H.Clip,session_timeout:(s=t==null?void 0:t.streamOptions)==null?void 0:s.sessionTimeout,stream_warmup:(r=t==null?void 0:t.streamOptions)==null?void 0:r.streamWarmup,compatibility_mode:(a=t==null?void 0:t.streamOptions)==null?void 0:a.compatibilityMode}:{videoType:H.Talk,session_timeout:(o=t==null?void 0:t.streamOptions)==null?void 0:o.sessionTimeout,stream_warmup:(i=t==null?void 0:t.streamOptions)==null?void 0:i.streamWarmup,compatibility_mode:(n=t==null?void 0:t.streamOptions)==null?void 0:n.compatibilityMode,output_resolution:(d=t==null?void 0:t.streamOptions)==null?void 0:d.outputResolution}}function ue(e){return e===_.Playground?{headers:{[Ce]:"true"}}:{}}async function ge(e,t,s,r){try{const a=await t.newChat(e,{persist:!0},ue(r));return s.track("agent-chat",{event:"created",chat_id:a.id,agent_id:e,mode:r}),a}catch(a){try{console.error(a);const o=JSON.parse(a.message);if((o==null?void 0:o.kind)==="InsufficientCreditsError")throw new Error("InsufficientCreditsError")}catch(o){console.error("Error parsing the error message:",o)}throw new Error("Cannot create new chat")}}function Re(e,t,s,r,a){return new Promise(async(o,i)=>{var n;R=0;const d=await Ie(e.id,Ae(e,t),{...t,analytics:r,warmup:(n=t.streamOptions)==null?void 0:n.streamWarmup,callbacks:{...t.callbacks,onConnectionStateChange:async v=>{var f,m;v===b.Connected&&(!a&&t.mode!==_.DirectPlayback&&(a=await ge(e.id,s,r,t.mode).catch(g=>{i(g)})),d?o({chat:a,streamingManager:d}):a&&i(new Error("Something went wrong while initializing the manager"))),(m=(f=t.callbacks).onConnectionStateChange)==null||m.call(f,v)},onVideoStateChange(v){var f,m;(m=(f=t.callbacks).onVideoStateChange)==null||m.call(f,v),R>0&&v===N.Start&&r.linkTrack("agent-video",{event:"start",latency:Date.now()-R},"start",[ne.StreamVideoCreated])}}}).catch(i)})}function re(e,t){if(t&&t.length>0)return t;let s="";if(e.greetings&&e.greetings.length>0){const r=Math.floor(Math.random()*e.greetings.length);s=e.greetings[r]}else s=`Hi! I'm ${e.preview_name||"My Agent"}. How can I help you?`;return[{content:s,id:K(),role:"assistant",created_at:new Date().toISOString()}]}function xe(e){if(e.answer!==void 0)return e.answer;let t=0,s="";for(;t in e;)s+=e[t],t++;return s}function Ne(e,t,s,r,a){if(!(e===x.Partial||e===x.Answer))return;const o=r.messages[r.messages.length-1];if((o==null?void 0:o.role)!=="assistant")return;const{content:i,sequence:n}=t;e===x.Partial?s[n]=i:s.answer=i;const d=xe(s);(o.content!==d||e===x.Answer)&&(o.content=d,a==null||a([...r.messages],e))}async function Ve(e,t){var s,r,a;let o={},i=!0;const n={messages:[],chatMode:t.mode||_.Functional},d=t.baseURL||X,v=t.wsURL||we,f=t.mixpanelKey||ve,m=ye(t.auth,d,t.callbacks.onError),g=await m.getById(e);n.messages=re(g,t.initialMessages),(r=(s=t.callbacks).onNewMessage)==null||r.call(s,[...n.messages],"answer");const h=Le({token:f,agent:g,...t});h.track("agent-sdk",{event:"loaded",...De(g)});const G={onMessage:(c,u)=>{var l,w;if("content"in u)Ne(c,u,o,n,t.callbacks.onNewMessage),c===x.Answer&&h.track("agent-message-received",{messages:n.messages.length,mode:n.chatMode});else{const p=ne,M=[p.StreamVideoDone,p.StreamVideoError,p.StreamVideoRejected],$=[p.StreamFailed,p.StreamVideoError,p.StreamVideoRejected],E=Pe(u,g,{mode:n.chatMode});if(c=c,c===p.StreamVideoCreated)h.linkTrack("agent-video",E,p.StreamVideoCreated,["start"]);else if(M.includes(c)){const S=c.split("/")[1];h.track("agent-video",{...E,event:S})}$.includes(c)&&((w=(l=t.callbacks).onError)==null||w.call(l,new Error(`Stream failed with event ${c}`),{data:u})),u.event===p.StreamDone&&k()}}};async function q(c){var u,l,w,p,M,$,E;(l=(u=t.callbacks).onConnectionStateChange)==null||l.call(u,b.Connecting),R=0,c&&!i&&(delete n.chat,n.messages=re(g),(p=(w=t.callbacks).onNewMessage)==null||p.call(w,[...n.messages],"answer"));const S=t.mode===_.DirectPlayback?Promise.resolve(void 0):Me(t.auth,v,G),O=Re(g,t,m,h,n.chat).catch(P=>{var B,Z;throw y(_.Maintenance),(Z=(B=t.callbacks).onConnectionStateChange)==null||Z.call(B,b.Fail),P}),[j,{streamingManager:D,chat:C}]=await Promise.all([S,O]);C&&C.id!==((M=n.chat)==null?void 0:M.id)&&((E=($=t.callbacks).onNewChat)==null||E.call($,C.id)),n.streamingManager=D,n.socketManager=j,n.chat=C,i=!1,y((C==null?void 0:C.chat_mode)??t.mode??_.Functional)}async function k(){var c,u,l,w;(c=n.socketManager)==null||c.disconnect(),await((u=n.streamingManager)==null?void 0:u.disconnect()),delete n.streamingManager,delete n.socketManager,(w=(l=t.callbacks).onConnectionStateChange)==null||w.call(l,b.Disconnected)}async function y(c){var u,l;c!==n.chatMode&&(h.track("agent-mode-change",{mode:c}),n.chatMode=c,n.chatMode!==_.Functional&&await k(),(l=(u=t.callbacks).onModeChange)==null||l.call(u,c))}return{agent:g,starterMessages:((a=g.knowledge)==null?void 0:a.starter_message)||[],changeMode:y,async connect(){var c;await q(!0),h.track("agent-chat",{event:"connect",chatId:(c=n.chat)==null?void 0:c.id,agentId:g.id,mode:n.chatMode})},async reconnect(){var c;await k(),await q(!1),h.track("agent-chat",{event:"reconnect",chatId:(c=n.chat)==null?void 0:c.id,agentId:g.id,mode:n.chatMode})},async disconnect(){var c;await k(),h.track("agent-chat",{event:"disconnect",chatId:(c=n.chat)==null?void 0:c.id,agentId:g.id,mode:n.chatMode})},async chat(c){var u,l,w,p,M,$;const E=K();o={};try{if(R=Date.now(),t.mode===_.DirectPlayback)throw new Error("Direct playback is enabled, chat is disabled");if(c.length>=800)throw new Error("Message cannot be more than 800 characters");if(c.length===0)throw new Error("Message cannot be empty");if(n.chatMode===_.Maintenance)throw new Error("Chat is in maintenance mode");if(![_.TextOnly,_.Playground].includes(n.chatMode))if(n.streamingManager){if(!n.chat)throw new Error("Chat is not initialized")}else throw new Error("Streaming manager is not initialized");n.messages.push({id:K(),role:"user",content:c,created_at:new Date(R).toISOString()}),(l=(u=t.callbacks).onNewMessage)==null||l.call(u,[...n.messages],"user"),n.chat||(n.chat=await ge(g.id,m,h,n.chatMode),(p=(w=t.callbacks).onNewChat)==null||p.call(w,n.chat.id));const S={id:E,role:"assistant",content:"",created_at:new Date().toISOString(),matches:[]},O=[...n.messages];n.messages.push(S);const j=C=>{var P,B;return m.chat(g.id,C,{sessionId:(P=n.streamingManager)==null?void 0:P.sessionId,streamId:(B=n.streamingManager)==null?void 0:B.streamId,chatMode:n.chatMode,messages:O.map(({matches:Z,...pe})=>pe)},ue(n.chatMode))},D=await j(n.chat.id).catch(async C=>{var P;if(!((P=C==null?void 0:C.message)!=null&&P.includes("missing or invalid session_id")))throw C;return await k(),await q(!1),j(n.chat.id)});return h.track("agent-message-send",{event:"success",mode:n.chatMode,messages:n.messages.length+1}),S.context=D.context,S.matches=D.matches,D.result&&(S.content=D.result,h.track("agent-message-received",{latency:Date.now()-R,mode:n.chatMode,messages:n.messages.length}),($=(M=t.callbacks).onNewMessage)==null||$.call(M,[...n.messages],"answer")),D}catch(S){throw n.messages[n.messages.length-1].id===E&&n.messages.pop(),h.track("agent-message-send",{event:"error",mode:n.chatMode,messages:n.messages.length}),S}},rate(c,u,l){var w,p,M,$;const E=n.messages.find(O=>O.id===c);if(n.chat){if(!E)throw new Error("Message not found")}else throw new Error("Chat is not initialized");const S=((w=E.matches)==null?void 0:w.map(O=>[O.document_id,O.id]))??[];return h.track("agent-rate",{event:l?"update":"create",thumb:u===1?"up":"down",knowledge_id:((p=g.knowledge)==null?void 0:p.id)??"",mode:n.chatMode,matches:S,score:u}),l?m.updateRating(g.id,n.chat.id,l,{knowledge_id:((M=g.knowledge)==null?void 0:M.id)??"",message_id:c,matches:S,score:u}):m.createRating(g.id,n.chat.id,{knowledge_id:(($=g.knowledge)==null?void 0:$.id)??"",message_id:c,matches:S,score:u})},deleteRate(c){var u;if(!n.chat)throw new Error("Chat is not initialized");return h.track("agent-rate-delete",{type:"text",chat_id:(u=n.chat)==null?void 0:u.id,id:c,mode:n.chatMode}),m.deleteRating(g.id,n.chat.id,c)},speak(c){if(!n.streamingManager)throw new Error("Please connect to the agent first");function u(){if(typeof c=="string"){if(!g.presenter.voice)throw new Error("Presenter voice is not initialized");return{type:"text",provider:g.presenter.voice,input:c,ssml:!1}}if(c.type==="text"&&!c.provider){if(!g.presenter.voice)throw new Error("Presenter voice is not initialized");return{type:"text",provider:g.presenter.voice,input:c.input,ssml:c.ssml}}return c}const l=u();return h.track("agent-speak",l),n.streamingManager.speak({script:l})}}}let qe="agt_2Ln7eSse",me={type:"key",clientKey:"Z29vZ2xlLW9hdXRoMnwxMDY2MDg2Mjg1ODMyNzI0ODg1NjY6VVhuNVJCVXFtMlkxQXppTnZtSGk4"},A=document.querySelector("#videoElement"),V=document.querySelector("#textArea"),ee=document.querySelector("#langSelect"),W=document.querySelector("#speechButton"),F=document.querySelector("#answers"),L=document.querySelector("#connectionLabel"),z=document.querySelector("#chatButton"),U=document.querySelector("#speakButton"),Be=document.querySelector("#reconnectButton"),te=document.querySelector("#sendButton"),Y;const He={onSrcObjectReady(e){return console.log("onSrcObjectReady():",e),A.srcObject=e,Y=e,Y},onConnectionStateChange(e){console.log("onConnectionStateChange(): ",e),e=="connecting"?(L.innerHTML="Connecting..",document.querySelector("#container").style.display="flex",document.querySelector("#hidden").style.display="none"):e=="connected"?(V.addEventListener("keypress",t=>{t.key==="Enter"&&(t.preventDefault(),J())}),z.removeAttribute("disabled"),U.removeAttribute("disabled"),ee.removeAttribute("disabled"),W.removeAttribute("disabled"),te.removeAttribute("disabled"),L.innerHTML="Online"):(e=="disconnected"||e=="closed")&&(V.removeEventListener("keypress",t=>{t.key==="Enter"&&(t.preventDefault(),J())}),document.querySelector("#hidden_h2").innerHTML=`${T.agent.preview_name} Disconnected`,document.querySelector("#hidden").style.display="block",document.querySelector("#container").style.display="none",z.setAttribute("disabled",!0),U.setAttribute("disabled",!0),ee.setAttribute("disabled",!0),W.setAttribute("disabled",!0),te.setAttribute("disabled",!0),L.innerHTML="")},onVideoStateChange(e){console.log("onVideoStateChange(): ",e),e=="STOP"?(A.muted=!0,A.srcObject=void 0,A.src=T.agent.presenter.idle_video):(A.muted=!1,A.src="",A.srcObject=Y,L.innerHTML="Online")},onNewMessage(e,t){console.log("onNewMessage():",e,t);let s=e.length-1,r=e[s];r.role=="assistant"&&e.length!=1?t=="answer"&&(F.innerHTML+=`${se()} - [${r.role}] : ${r.content}  <button id='${r.id}_plus' title='agentManager.rate() -> Rate this answer (+)'>+</button> <button id='${r.id}_minus' title='agentManager.rate() -> Rate this answer (-)'>-</button> <br>`,document.getElementById(`${r.id}_plus`).addEventListener("click",()=>ie(r.id,1)),document.getElementById(`${r.id}_minus`).addEventListener("click",()=>ie(r.id,-1))):F.innerHTML+=`${se()} - [${r.role}] : ${r.content}  <br>`,F.scrollTop=F.scrollHeight},onError(e,t){L.innerHTML='<span style="color:red">Something went wrong :(</span>',console.log("Error:",e,"Error Data",t)}};let je={compatibilityMode:"auto",streamWarmup:!0,outputResolution:1080};function Fe(){let e=V.value;e!==""&&e.length>2&&(T.speak({type:"text",input:e}),console.log(`agentManager.speak("${e}")`),L.innerHTML="Streaming..")}function J(){let e=V.value;e!==""&&(T.chat(e),console.log("agentManager.chat()"),L.innerHTML="Thinking..",V.value="")}function ie(e,t){let s=T.rate(e,t);console.log(`Message ID: ${e} Rated:${t}
`,"Result",s)}function Ke(){console.log("clicked");let e=T.reconnect();console.log("agentManager.reconnect()",e)}function se(){const e=new Date,t=e.getHours().toString().padStart(2,"0"),s=e.getMinutes().toString().padStart(2,"0"),r=e.getSeconds().toString().padStart(2,"0");return`${t}:${s}:${r}`}me.clientKey==""&&(L.innerHTML="<span style='color:red; font-weight:bold'> Missing agentID and auth.clientKey variables</span>",console.error("Missing agentID and auth.clientKey variables"),console.log(`Missing agentID and auth.clientKey variables:

Fetch the data-client-key and the data-agent-id as explained on the Agents SDK Overview Page:
https://docs.d-id.com/reference/agents-sdk-overview

Paste these into their respective variables at the top of the main.js file and save.`));z.addEventListener("click",()=>J());U.addEventListener("click",()=>Fe());Be.addEventListener("click",()=>Ke());W.addEventListener("click",()=>toggleStartStop());te.addEventListener("click",()=>J());window.addEventListener("load",()=>{V.focus(),z.setAttribute("disabled",!0),U.setAttribute("disabled",!0),ee.setAttribute("disabled",!0),W.setAttribute("disabled",!0)});async function We(){return await Ve(qe,{auth:me,callbacks:He,streamOptions:je})}let T=We();console.log("sdk.createAgentManager()",T);document.querySelector("#previewName").innerHTML=T.agent.preview_name;console.log("agentManager.connect()");T.connect();navigator.userAgent.includes("Firefox")?recognition=new SpeechRecognition:recognition=new webkitSpeechRecognition;recognition.lang=langSelect.value;recognition.continuous=!0;he();recognition.onend=he;recognition.onresult=function(e){console.log(e);for(var t=e.resultIndex;t<e.results.length;++t)e.results[t].isFinal&&(console.log(".."),textArea.value+=e.results[t][0].transcript)};function he(){speechButton.style.color="",speechButton.innerHTML='<span class="material-symbols-outlined">mic</span>',chatButton.removeAttribute("disabled"),speakButton.removeAttribute("disabled")}
