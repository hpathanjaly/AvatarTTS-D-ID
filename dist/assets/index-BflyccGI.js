(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))o(a);new MutationObserver(a=>{for(const r of a)if(r.type==="childList")for(const i of r.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&o(i)}).observe(document,{childList:!0,subtree:!0});function s(a){const r={};return a.integrity&&(r.integrity=a.integrity),a.referrerPolicy&&(r.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?r.credentials="include":a.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function o(a){if(a.ep)return;a.ep=!0;const r=s(a);fetch(a.href,r)}})();var _=(e=>(e.Functional="Functional",e.TextOnly="TextOnly",e.Maintenance="Maintenance",e.Playground="Playground",e.DirectPlayback="DirectPlayback",e))(_||{}),R=(e=>(e.Embed="embed",e.Query="query",e.Partial="partial",e.Answer="answer",e.Complete="done",e))(R||{}),j=(e=>(e.Clip="clip",e.Talk="talk",e))(j||{}),x=(e=>(e.Start="START",e.Stop="STOP",e))(x||{}),te=(e=>(e.ChatAnswer="chat/answer",e.ChatPartial="chat/partial",e.StreamDone="stream/done",e.StreamStarted="stream/started",e.StreamFailed="stream/error",e.StreamReady="stream/ready",e.StreamCreated="stream/created",e.StreamVideoCreated="stream-video/started",e.StreamVideoDone="stream-video/done",e.StreamVideoError="stream-video/error",e.StreamVideoRejected="stream-video/rejected",e))(te||{}),b=(e=>(e.New="new",e.Fail="fail",e.Connected="connected",e.Connecting="connecting",e.Closed="closed",e.Completed="completed",e.Disconnected="disconnected",e))(b||{});const J="https://api.d-id.com",he="wss://notifications.d-id.com",pe="79f81a83a67430be2bc0fd61042b8faa",K=()=>Math.random().toString(16).slice(2);function se(){let e=window.localStorage.getItem("did_external_key_id");return e||(e=Math.random().toString(16).slice(2),window.localStorage.setItem("did_external_key_id",e)),e}let we=K();function ce(e){if(e.type==="bearer")return`Bearer ${e.token}`;if(e.type==="basic")return`Basic ${btoa(`${e.username}:${e.password}`)}`;if(e.type==="key")return`Client-Key ${e.clientKey}.${se()}_${we}`;throw new Error(`Unknown auth type: ${e}`)}function ne(e,n=J,s){const o=async(a,r)=>{const i=await fetch(n+(a!=null&&a.startsWith("/")?a:`/${a}`),{...r,headers:{...r==null?void 0:r.headers,Authorization:ce(e),"Content-Type":"application/json"}});if(!i.ok){let t=await i.text().catch(()=>"Failed to fetch");throw s&&s(new Error(t),{url:a,options:r,headers:i.headers}),new Error(t)}return i.json()};return{get(a,r){return o(a,{...r,method:"GET"})},post(a,r,i){return o(a,{...i,body:JSON.stringify(r),method:"POST"})},delete(a,r,i){return o(a,{...i,body:JSON.stringify(r),method:"DELETE"})},patch(a,r,i){return o(a,{...i,body:JSON.stringify(r),method:"PATCH"})}}}function ve(e,n=J,s){const o=ne(e,`${n}/agents`,s);return{create(a,r){return o.post("/",a,r)},getAgents(a,r){return o.get(`/${a?`?tag=${a}`:""}`,r).then(i=>i??[])},getById(a,r){return o.get(`/${a}`,r)},delete(a,r){return o.delete(`/${a}`,void 0,r)},update(a,r,i){return o.patch(`/${a}`,r,i)},newChat(a,r,i){return o.post(`/${a}/chat`,r,i)},chat(a,r,i,t){return o.post(`/${a}/chat/${r}`,i,t)},createRating(a,r,i,t){return o.post(`/${a}/chat/${r}/ratings`,i,t)},updateRating(a,r,i,t,d){return o.patch(`/${a}/chat/${r}/ratings/${i}`,t,d)},deleteRating(a,r,i,t){return o.delete(`/${a}/chat/${r}/ratings/${i}`,t)}}}const fe=e=>new Promise(n=>setTimeout(n,e));function ye(e){return new Promise((n,s)=>{const{callbacks:o,host:a,auth:r}=e,{onMessage:i=null,onOpen:t=null,onClose:d=null,onError:v=null}=o||{},f=new WebSocket(`${a}?authorization=${ce(r)}`);f.onmessage=i,f.onclose=d,f.onerror=m=>{console.error(m),v==null||v("Websocket failed to connect",m),s(m)},f.onopen=m=>{t==null||t(m),n(f)}})}async function be(e){const{retries:n=1}=e;let s=null;for(let o=0;(s==null?void 0:s.readyState)!==WebSocket.OPEN;o++)try{s=await ye(e)}catch(a){if(o===n)throw a;await fe(o*500)}return s}async function Se(e,n,s){const o=s!=null&&s.onMessage?[s.onMessage]:[],a=await be({auth:e,host:n,callbacks:{onError:s==null?void 0:s.onError,onMessage:r=>{const i=JSON.parse(r.data);o.forEach(t=>t(i.event,i))}}});return{socket:a,disconnect:()=>a.close(),subscribeToEvents:r=>o.push(r)}}const Me="X-Playground-Chat";function ke(e,n,s,o){const a=ne(e,`${n}/agents/${s}`,o);return{createStream(r){return a.post("/streams",{compatibility_mode:r.compatibility_mode,stream_warmup:r.stream_warmup,session_timeout:r.session_timeout})},startConnection(r,i,t){return a.post(`/streams/${r}/sdp`,{session_id:t,answer:i})},addIceCandidate(r,i,t){return a.post(`/streams/${r}/ice`,{session_id:t,...i})},sendStreamRequest(r,i,t){return a.post(`/streams/${r}`,{session_id:i,...t})},close(r,i){return a.delete(`/streams/${r}`,{session_id:i})}}}function Ce(e,n,s,o){const a=ne(e,`${n}/agents/${s}`,o);return{createStream(r,i){return a.post("/streams",{driver_url:r.driver_url,face:r.face,config:r.config,compatibility_mode:r.compatibility_mode,stream_warmup:r.stream_warmup,output_resolution:r.output_resolution,session_timeout:r.session_timeout},i)},startConnection(r,i,t,d){return a.post(`/streams/${r}/sdp`,{session_id:t,answer:i},d)},addIceCandidate(r,i,t,d){return a.post(`/streams/${r}/ice`,{session_id:t,...i},d)},sendStreamRequest(r,i,t,d){return a.post(`/streams/${r}`,{session_id:i,...t},d)},close(r,i,t){return a.delete(`/streams/${r}`,{session_id:i},t)}}}let le=!1;const O=(e,n)=>le&&console.log(e,n),_e=(window.RTCPeerConnection||window.webkitRTCPeerConnection||window.mozRTCPeerConnection).bind(window);function ae(e){switch(e){case"connected":return b.Connected;case"checking":return b.Connecting;case"failed":return b.Fail;case"new":return b.New;case"closed":return b.Closed;case"disconnected":return b.Disconnected;case"completed":return b.Completed;default:return b.New}}function Ee(){let e=0;return n=>{for(const s of n.values())if(s&&s.type==="inbound-rtp"&&s.kind==="video"){const o=s.bytesReceived,a=o-e>0;return e=o,a}return!1}}function $e(e,n){const s=Math.max(Math.ceil(10),1);let o=0,a=!1;const r=Ee();return setInterval(async()=>{const i=await e.getStats();r(i)?(o=0,a||(n==null||n(x.Start),a=!0)):a&&(o++,o>=s&&(n==null||n(x.Stop),a=!1))},100)}async function Te(e,n,{debug:s=!1,callbacks:o,auth:a,baseURL:r=J,warmup:i}){le=s;let t;const{startConnection:d,sendStreamRequest:v,close:f,createStream:m,addIceCandidate:g}=n.videoType===j.Clip?ke(a,r,e,o.onError):Ce(a,r,e,o.onError),{id:h,offer:X,ice_servers:V,session_id:M}=await m(n),y=new _e({iceServers:V});if(!M)throw new Error("Could not create session_id");const c=$e(y,o.onVideoStateChange);y.onicecandidate=l=>{O("peerConnection.onicecandidate",l),l.candidate&&l.candidate.sdpMid&&l.candidate.sdpMLineIndex!==null?g(h,{candidate:l.candidate.candidate,sdpMid:l.candidate.sdpMid,sdpMLineIndex:l.candidate.sdpMLineIndex},M):g(h,{candidate:null},M)},y.oniceconnectionstatechange=()=>{var l;O("peerConnection.oniceconnectionstatechange => "+y.iceConnectionState);const w=ae(y.iceConnectionState);w===b.Connected?t=setTimeout(()=>{var p;return(p=o.onConnectionStateChange)==null?void 0:p.call(o,b.Connected)},i?5e3:0):(clearTimeout(t),(l=o.onConnectionStateChange)==null||l.call(o,w))},y.ontrack=l=>{var w;O("peerConnection.ontrack",l),(w=o.onSrcObjectReady)==null||w.call(o,l.streams[0])},await y.setRemoteDescription(X),O("set remote description OK");const u=await y.createAnswer();return O("create answer OK"),await y.setLocalDescription(u),O("set local description OK"),await d(h,u,M),O("start connection OK"),{speak(l){return v(h,M,l)},async disconnect(){var l,w;if(h){const p=ae(y.iceConnectionState);if(y){if(p===b.New){(l=o.onVideoStateChange)==null||l.call(o,x.Stop),clearInterval(c);return}y.close(),y.oniceconnectionstatechange=null,y.onnegotiationneeded=null,y.onicecandidate=null,y.ontrack=null}try{p===b.Connected&&await f(h,M).catch(k=>{})}catch(k){O("Error on close stream connection",k)}(w=o.onVideoStateChange)==null||w.call(o,x.Stop),clearInterval(c)}},sessionId:M,streamId:h}}let Z={};function Oe(e){const n=window!=null&&window.hasOwnProperty("DID_AGENTS_API")?"agents-ui":"agents-sdk",s=e.agent.presenter,o={token:e.token||"testKey",distinct_id:e.distinctId||se(),agentId:e.agent.id,agentType:s.type==="clip"&&s.presenter_id.startsWith("v2_")?"clip_v2":s.type,owner_id:e.agent.owner_id??""};return{...o,isEnabled:e.isEnabled??!0,getRandom:()=>Math.random().toString(16).slice(2),track(a,r){if(!this.isEnabled)return Promise.reject("MixPanel analytics is disabled on creation");const{audioPath:i,...t}=r||{},d={method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:new URLSearchParams({data:JSON.stringify([{event:a,properties:{...t,...o,source:n,time:Date.now(),$insert_id:this.getRandom(),origin:window.location.href,"Screen Height":window.screen.height||window.innerWidth,"Screen Width":window.screen.width||window.innerHeight,"User Agent":navigator.userAgent}}])})};return fetch("https://api-js.mixpanel.com/track/?verbose=1&ip=1",d).then(v=>v.json()).catch(v=>console.error(v))},linkTrack(a,r,i,t){Z[a]||(Z[a]={events:{},resolvedDependencies:[]}),t.includes(i)||t.push(i);const d=Z[a];if(d.events[i]={props:r},d.resolvedDependencies.push(i),t.every(v=>d.resolvedDependencies.includes(v))){const v=t.reduce((f,m)=>d.events[m]?{...f,...d.events[m].props}:f,{});this.track(a,v),d.resolvedDependencies=d.resolvedDependencies.filter(f=>!t.includes(f)),t.forEach(f=>{delete d.events[f]})}}}}function Ie(e){var n,s,o,a;const r=()=>/Mobi|Android/i.test(navigator.userAgent)?"Mobile":"Desktop",i=()=>{const d=navigator.platform;return d.toLowerCase().includes("win")?"Windows":d.toLowerCase().includes("mac")?"Mac OS X":d.toLowerCase().includes("linux")?"Linux":"Unknown"},t=e.presenter;return{$os:`${i()}`,isMobile:`${r()=="Mobile"}`,browser:navigator.userAgent,origin:window.location.origin,agentType:t.type==="clip"&&t.presenter_id.startsWith("v2_")?"clip_v2":t.type,agentVoice:{voiceId:(s=(n=e.presenter)==null?void 0:n.voice)==null?void 0:s.voice_id,provider:(a=(o=e.presenter)==null?void 0:o.voice)==null?void 0:a.type}}}function De(e,n,s){var o,a;const{event:r,...i}=e,{template:t}=(n==null?void 0:n.llm)||{},{language:d}=((o=n==null?void 0:n.presenter)==null?void 0:o.voice)||{},{stitch:v}=(n==null?void 0:n.presenter)||{};return{...i,llm:{...i.llm,template:t},script:{...i.script,provider:{...(a=i==null?void 0:i.script)==null?void 0:a.provider,language:d}},stitch:v,...s}}let A=0;function Le(e,n){var s,o,a,r,i,t,d;return e.presenter.type===j.Clip?{videoType:j.Clip,session_timeout:(s=n==null?void 0:n.streamOptions)==null?void 0:s.sessionTimeout,stream_warmup:(o=n==null?void 0:n.streamOptions)==null?void 0:o.streamWarmup,compatibility_mode:(a=n==null?void 0:n.streamOptions)==null?void 0:a.compatibilityMode}:{videoType:j.Talk,session_timeout:(r=n==null?void 0:n.streamOptions)==null?void 0:r.sessionTimeout,stream_warmup:(i=n==null?void 0:n.streamOptions)==null?void 0:i.streamWarmup,compatibility_mode:(t=n==null?void 0:n.streamOptions)==null?void 0:t.compatibilityMode,output_resolution:(d=n==null?void 0:n.streamOptions)==null?void 0:d.outputResolution}}function de(e){return e===_.Playground?{headers:{[Me]:"true"}}:{}}async function ue(e,n,s,o){try{const a=await n.newChat(e,{persist:!0},de(o));return s.track("agent-chat",{event:"created",chat_id:a.id,agent_id:e,mode:o}),a}catch(a){try{console.error(a);const r=JSON.parse(a.message);if((r==null?void 0:r.kind)==="InsufficientCreditsError")throw new Error("InsufficientCreditsError")}catch(r){console.error("Error parsing the error message:",r)}throw new Error("Cannot create new chat")}}function Pe(e,n,s,o,a){return new Promise(async(r,i)=>{var t;A=0;const d=await Te(e.id,Le(e,n),{...n,analytics:o,warmup:(t=n.streamOptions)==null?void 0:t.streamWarmup,callbacks:{...n.callbacks,onConnectionStateChange:async v=>{var f,m;v===b.Connected&&(!a&&n.mode!==_.DirectPlayback&&(a=await ue(e.id,s,o,n.mode).catch(g=>{i(g)})),d?r({chat:a,streamingManager:d}):a&&i(new Error("Something went wrong while initializing the manager"))),(m=(f=n.callbacks).onConnectionStateChange)==null||m.call(f,v)},onVideoStateChange(v){var f,m;(m=(f=n.callbacks).onVideoStateChange)==null||m.call(f,v),A>0&&v===x.Start&&o.linkTrack("agent-video",{event:"start",latency:Date.now()-A},"start",[te.StreamVideoCreated])}}}).catch(i)})}function re(e,n){if(n&&n.length>0)return n;let s="";if(e.greetings&&e.greetings.length>0){const o=Math.floor(Math.random()*e.greetings.length);s=e.greetings[o]}else s=`Hi! I'm ${e.preview_name||"My Agent"}. How can I help you?`;return[{content:s,id:K(),role:"assistant",created_at:new Date().toISOString()}]}function Ae(e){if(e.answer!==void 0)return e.answer;let n=0,s="";for(;n in e;)s+=e[n],n++;return s}function Re(e,n,s,o,a){if(!(e===R.Partial||e===R.Answer))return;const r=o.messages[o.messages.length-1];if((r==null?void 0:r.role)!=="assistant")return;const{content:i,sequence:t}=n;e===R.Partial?s[t]=i:s.answer=i;const d=Ae(s);(r.content!==d||e===R.Answer)&&(r.content=d,a==null||a([...o.messages],e))}async function xe(e,n){var s,o,a;let r={},i=!0;const t={messages:[],chatMode:n.mode||_.Functional},d=n.baseURL||J,v=n.wsURL||he,f=n.mixpanelKey||pe,m=ve(n.auth,d,n.callbacks.onError),g=await m.getById(e);t.messages=re(g,n.initialMessages),(o=(s=n.callbacks).onNewMessage)==null||o.call(s,[...t.messages],"answer");const h=Oe({token:f,agent:g,...n});h.track("agent-sdk",{event:"loaded",...Ie(g)});const X={onMessage:(c,u)=>{var l,w;if("content"in u)Re(c,u,r,t,n.callbacks.onNewMessage),c===R.Answer&&h.track("agent-message-received",{messages:t.messages.length,mode:t.chatMode});else{const p=te,k=[p.StreamVideoDone,p.StreamVideoError,p.StreamVideoRejected],$=[p.StreamFailed,p.StreamVideoError,p.StreamVideoRejected],E=De(u,g,{mode:t.chatMode});if(c=c,c===p.StreamVideoCreated)h.linkTrack("agent-video",E,p.StreamVideoCreated,["start"]);else if(k.includes(c)){const S=c.split("/")[1];h.track("agent-video",{...E,event:S})}$.includes(c)&&((w=(l=n.callbacks).onError)==null||w.call(l,new Error(`Stream failed with event ${c}`),{data:u})),u.event===p.StreamDone&&M()}}};async function V(c){var u,l,w,p,k,$,E;(l=(u=n.callbacks).onConnectionStateChange)==null||l.call(u,b.Connecting),A=0,c&&!i&&(delete t.chat,t.messages=re(g),(p=(w=n.callbacks).onNewMessage)==null||p.call(w,[...t.messages],"answer"));const S=n.mode===_.DirectPlayback?Promise.resolve(void 0):Se(n.auth,v,X),T=Pe(g,n,m,h,t.chat).catch(L=>{var q,G;throw y(_.Maintenance),(G=(q=n.callbacks).onConnectionStateChange)==null||G.call(q,b.Fail),L}),[H,{streamingManager:D,chat:C}]=await Promise.all([S,T]);C&&C.id!==((k=t.chat)==null?void 0:k.id)&&((E=($=n.callbacks).onNewChat)==null||E.call($,C.id)),t.streamingManager=D,t.socketManager=H,t.chat=C,i=!1,y((C==null?void 0:C.chat_mode)??n.mode??_.Functional)}async function M(){var c,u,l,w;(c=t.socketManager)==null||c.disconnect(),await((u=t.streamingManager)==null?void 0:u.disconnect()),delete t.streamingManager,delete t.socketManager,(w=(l=n.callbacks).onConnectionStateChange)==null||w.call(l,b.Disconnected)}async function y(c){var u,l;c!==t.chatMode&&(h.track("agent-mode-change",{mode:c}),t.chatMode=c,t.chatMode!==_.Functional&&await M(),(l=(u=n.callbacks).onModeChange)==null||l.call(u,c))}return{agent:g,starterMessages:((a=g.knowledge)==null?void 0:a.starter_message)||[],changeMode:y,async connect(){var c;await V(!0),h.track("agent-chat",{event:"connect",chatId:(c=t.chat)==null?void 0:c.id,agentId:g.id,mode:t.chatMode})},async reconnect(){var c;await M(),await V(!1),h.track("agent-chat",{event:"reconnect",chatId:(c=t.chat)==null?void 0:c.id,agentId:g.id,mode:t.chatMode})},async disconnect(){var c;await M(),h.track("agent-chat",{event:"disconnect",chatId:(c=t.chat)==null?void 0:c.id,agentId:g.id,mode:t.chatMode})},async chat(c){var u,l,w,p,k,$;const E=K();r={};try{if(A=Date.now(),n.mode===_.DirectPlayback)throw new Error("Direct playback is enabled, chat is disabled");if(c.length>=800)throw new Error("Message cannot be more than 800 characters");if(c.length===0)throw new Error("Message cannot be empty");if(t.chatMode===_.Maintenance)throw new Error("Chat is in maintenance mode");if(![_.TextOnly,_.Playground].includes(t.chatMode))if(t.streamingManager){if(!t.chat)throw new Error("Chat is not initialized")}else throw new Error("Streaming manager is not initialized");t.messages.push({id:K(),role:"user",content:c,created_at:new Date(A).toISOString()}),(l=(u=n.callbacks).onNewMessage)==null||l.call(u,[...t.messages],"user"),t.chat||(t.chat=await ue(g.id,m,h,t.chatMode),(p=(w=n.callbacks).onNewChat)==null||p.call(w,t.chat.id));const S={id:E,role:"assistant",content:"",created_at:new Date().toISOString(),matches:[]},T=[...t.messages];t.messages.push(S);const H=C=>{var L,q;return m.chat(g.id,C,{sessionId:(L=t.streamingManager)==null?void 0:L.sessionId,streamId:(q=t.streamingManager)==null?void 0:q.streamId,chatMode:t.chatMode,messages:T.map(({matches:G,...me})=>me)},de(t.chatMode))},D=await H(t.chat.id).catch(async C=>{var L;if(!((L=C==null?void 0:C.message)!=null&&L.includes("missing or invalid session_id")))throw C;return await M(),await V(!1),H(t.chat.id)});return h.track("agent-message-send",{event:"success",mode:t.chatMode,messages:t.messages.length+1}),S.context=D.context,S.matches=D.matches,D.result&&(S.content=D.result,h.track("agent-message-received",{latency:Date.now()-A,mode:t.chatMode,messages:t.messages.length}),($=(k=n.callbacks).onNewMessage)==null||$.call(k,[...t.messages],"answer")),D}catch(S){throw t.messages[t.messages.length-1].id===E&&t.messages.pop(),h.track("agent-message-send",{event:"error",mode:t.chatMode,messages:t.messages.length}),S}},rate(c,u,l){var w,p,k,$;const E=t.messages.find(T=>T.id===c);if(t.chat){if(!E)throw new Error("Message not found")}else throw new Error("Chat is not initialized");const S=((w=E.matches)==null?void 0:w.map(T=>[T.document_id,T.id]))??[];return h.track("agent-rate",{event:l?"update":"create",thumb:u===1?"up":"down",knowledge_id:((p=g.knowledge)==null?void 0:p.id)??"",mode:t.chatMode,matches:S,score:u}),l?m.updateRating(g.id,t.chat.id,l,{knowledge_id:((k=g.knowledge)==null?void 0:k.id)??"",message_id:c,matches:S,score:u}):m.createRating(g.id,t.chat.id,{knowledge_id:(($=g.knowledge)==null?void 0:$.id)??"",message_id:c,matches:S,score:u})},deleteRate(c){var u;if(!t.chat)throw new Error("Chat is not initialized");return h.track("agent-rate-delete",{type:"text",chat_id:(u=t.chat)==null?void 0:u.id,id:c,mode:t.chatMode}),m.deleteRating(g.id,t.chat.id,c)},speak(c){if(!t.streamingManager)throw new Error("Please connect to the agent first");function u(){if(typeof c=="string"){if(!g.presenter.voice)throw new Error("Presenter voice is not initialized");return{type:"text",provider:g.presenter.voice,input:c,ssml:!1}}if(c.type==="text"&&!c.provider){if(!g.presenter.voice)throw new Error("Presenter voice is not initialized");return{type:"text",provider:g.presenter.voice,input:c.input,ssml:c.ssml}}return c}const l=u();return h.track("agent-speak",l),t.streamingManager.speak({script:l})}}}let Ne="agt_2Ln7eSse",ge={type:"key",clientKey:"Z29vZ2xlLW9hdXRoMnwxMDY2MDg2Mjg1ODMyNzI0ODg1NjY6VVhuNVJCVXFtMlkxQXppTnZtSGk4"},P=document.querySelector("#videoElement"),N=document.querySelector("#textArea"),Y=document.querySelector("#langSelect"),W=document.querySelector("#speechButton"),B=document.querySelector("#answers"),I=document.querySelector("#connectionLabel"),F=document.querySelector("#chatButton"),z=document.querySelector("#speakButton"),Ve=document.querySelector("#reconnectButton"),ee=document.querySelector("#sendButton"),Q;const qe={onSrcObjectReady(e){return console.log("onSrcObjectReady():",e),P.srcObject=e,Q=e,Q},onConnectionStateChange(e){console.log("onConnectionStateChange(): ",e),e=="connecting"?(I.innerHTML="Connecting..",document.querySelector("#container").style.display="flex",document.querySelector("#hidden").style.display="none"):e=="connected"?(N.addEventListener("keypress",n=>{n.key==="Enter"&&(n.preventDefault(),U())}),F.removeAttribute("disabled"),z.removeAttribute("disabled"),Y.removeAttribute("disabled"),W.removeAttribute("disabled"),ee.removeAttribute("disabled"),I.innerHTML="Online"):(e=="disconnected"||e=="closed")&&(N.removeEventListener("keypress",n=>{n.key==="Enter"&&(n.preventDefault(),U())}),document.querySelector("#hidden_h2").innerHTML=`${agentManager.agent.preview_name} Disconnected`,document.querySelector("#hidden").style.display="block",document.querySelector("#container").style.display="none",F.setAttribute("disabled",!0),z.setAttribute("disabled",!0),Y.setAttribute("disabled",!0),W.setAttribute("disabled",!0),ee.setAttribute("disabled",!0),I.innerHTML="")},onVideoStateChange(e){console.log("onVideoStateChange(): ",e),e=="STOP"?(P.muted=!0,P.srcObject=void 0,P.src=agentManager.agent.presenter.idle_video):(P.muted=!1,P.src="",P.srcObject=Q,I.innerHTML="Online")},onNewMessage(e,n){console.log("onNewMessage():",e,n);let s=e.length-1,o=e[s];o.role=="assistant"&&e.length!=1?n=="answer"&&(B.innerHTML+=`${ie()} - [${o.role}] : ${o.content}  <button id='${o.id}_plus' title='agentManager.rate() -> Rate this answer (+)'>+</button> <button id='${o.id}_minus' title='agentManager.rate() -> Rate this answer (-)'>-</button> <br>`,document.getElementById(`${o.id}_plus`).addEventListener("click",()=>oe(o.id,1)),document.getElementById(`${o.id}_minus`).addEventListener("click",()=>oe(o.id,-1))):B.innerHTML+=`${ie()} - [${o.role}] : ${o.content}  <br>`,B.scrollTop=B.scrollHeight},onError(e,n){I.innerHTML='<span style="color:red">Something went wrong :(</span>',console.log("Error:",e,"Error Data",n)}};let je={compatibilityMode:"auto",streamWarmup:!0,outputResolution:1080};function He(){let e=N.value;e!==""&&e.length>2&&(agentManager.speak({type:"text",input:e}),console.log(`agentManager.speak("${e}")`),I.innerHTML="Streaming..")}function U(){let e=N.value;e!==""&&(agentManager.chat(e),console.log("agentManager.chat()"),I.innerHTML="Thinking..",N.value="")}function oe(e,n){let s=agentManager.rate(e,n);console.log(`Message ID: ${e} Rated:${n}
`,"Result",s)}function Be(){console.log("clicked");let e=agentManager.reconnect();console.log("agentManager.reconnect()",e)}function ie(){const e=new Date,n=e.getHours().toString().padStart(2,"0"),s=e.getMinutes().toString().padStart(2,"0"),o=e.getSeconds().toString().padStart(2,"0");return`${n}:${s}:${o}`}ge.clientKey==""&&(I.innerHTML="<span style='color:red; font-weight:bold'> Missing agentID and auth.clientKey variables</span>",console.error("Missing agentID and auth.clientKey variables"),console.log(`Missing agentID and auth.clientKey variables:

Fetch the data-client-key and the data-agent-id as explained on the Agents SDK Overview Page:
https://docs.d-id.com/reference/agents-sdk-overview

Paste these into their respective variables at the top of the main.js file and save.`));F.addEventListener("click",()=>U());z.addEventListener("click",()=>He());Ve.addEventListener("click",()=>Be());W.addEventListener("click",()=>toggleStartStop());ee.addEventListener("click",()=>U());window.addEventListener("load",()=>{N.focus(),F.setAttribute("disabled",!0),z.setAttribute("disabled",!0),Y.setAttribute("disabled",!0),W.setAttribute("disabled",!0)});async function Ke(){await xe(Ne,{auth:ge,callbacks:qe,streamOptions:je})}Ke();console.log("sdk.createAgentManager()",agentManager);document.querySelector("#previewName").innerHTML=agentManager.agent.preview_name;console.log("agentManager.connect()");agentManager.connect();
