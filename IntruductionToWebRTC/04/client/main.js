//-----------------------------------------------------------------------------
// グローバル変数
//-----------------------------------------------------------------------------
const WSS_URL      = "wss://localhost:3000"; // WebSocketServerのURL
let server         = null;
let peerConnection = null;

// videoタグやtextareaなどのHTML要素
const dom = {
  videos: {
    local : document.getElementById('local_video'), // ローカル
    remote: document.getElementById('remote_video'), // ローカル
  },
  sdp: {
    send: document.getElementById("text_for_send_sdp"),
    recv: document.getElementById("text_for_recv_sdp"),
  }
};

//-----------------------------------------------------------------------------
// 関数
//-----------------------------------------------------------------------------
function prepare() {
  prepareWebSocket();
  prepareRTCPeerConnection();
  wakeupVideo();
}

function connect() {
  createOffer();
}

//-----------------------------------------------------------------------------
// WebSocket系
function prepareWebSocket() 
{
  server = new WebSocket(WSS_URL);
  server.onopen = onOpen;
  server.onerror = onError;
  server.onmessage = onMessage;
}

function onOpen(e) {
  console.log("open web socket server.");
}

function onError(e) {
  console.error(e);
}

async function onMessage(e) 
{
  const text = await e.data.text();
  const msg = JSON.parse(text);

  if (msg.type === 'offer') {
    receiveSessionDescription(msg);
    await createAnswer();
    return;
  }

  if (msg.type === 'answer') {
    receiveSessionDescription(msg);
    return;
  }

  if (msg.type === 'candidate') {
    const candidate = new RTCIceCandidate(msg.ice);
    peerConnection.addIceCandidate(candidate);
  }
}

//-----------------------------------------------------------------------------
// PeerConnection系

// RTCPeerConnectionの準備
function prepareRTCPeerConnection() 
{
  const config = {"iceServers": []};
  peerConnection = new RTCPeerConnection(config);

  peerConnection.ontrack        = onTrack;
  peerConnection.onicecandidate = onIceCandidate;
}

// OfferのSessionDescriptionを作成・セット
async function createOffer() 
{
  const sessionDescription = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(sessionDescription);
  sendSessionDescription(sessionDescription);
}

// AnswerのSessionDescriptionを作成・セット
async function createAnswer() 
{
  const sessionDescription = await peerConnection.createAnswer();
  await peerConnection.setLocalDescription(sessionDescription);
  sendSessionDescription(sessionDescription);
}

function sendSessionDescription(description) 
{
  // JSONを文字列にして送信
  const data = JSON.stringify(description);
  server.send(data);

  // textareaに表示
  dom.sdp.send.value = description.sdp;
}

async function receiveSessionDescription(description) 
{
  // コネクションに設定
  await peerConnection.setRemoteDescription(description);

  // textareに表示
  dom.sdp.recv.value = description.sdp;
}

function onTrack(e) {
  let stream = e.streams[0];
  playVideo(dom.videos.remote, stream);
}

function onIceCandidate (e) 
{
  console.log("onicecandidate");

  if (e.candidate === null) return;

  const data = {
    type: 'candidate',
    ice : e.candidate,
  }
  server.send(JSON.stringify(data));
}

//-----------------------------------------------------------------------------
// カメラ関係
async function wakeupVideo() 
{
  const config = {video:true, audio:false};

  const stream = await navigator.mediaDevices.getUserMedia(config);

  stream.getTracks().forEach((track) => {
    peerConnection.addTrack(track, stream);
  })

  playVideo(dom.videos.local, stream);
}

function playVideo(element, stream) 
{
  element.srcObject = stream;
  element.play();
  element.volume = 0;
}
