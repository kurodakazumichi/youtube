//-----------------------------------------------------------------------------
// 使うグローバル変数
//-----------------------------------------------------------------------------
// RTCPeerConnectionのインスタンス
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
function createConnection() 
{
  console.log("called: createConnection.");

  let pc_config = {"iceServers":[]};
  pc = new RTCPeerConnection(pc_config);

  // 通信相手のトラックが届いた
  pc.ontrack = (e) => {
    console.log("called: ontrack");
    let stream = e.streams[0];
    playVideo(dom.videos.remote, stream);
  }

  // 通信経路の候補が見つかった
  pc.onicecandidate = (e) => 
  {
    console.log("called: onicecandidate");
    // ICE candidateの収集が終わるとe.candidateはnullになる
    // 収集が終わるのを待つ場合はe.candidateを見ればよい

    // ICE candidateの収集が完了していない場合
    if (e.candidate) {
      // Trickle ICEの場合はICE candidateを相手に送る
    } 
    
    // ICE candidateの収集が完了している場合
    else {
      console.log('completed: ICE candidate');
      dom.sdp.send.value = pc.localDescription.sdp;
    }
  }

  // var channel = pc.createDataChannel("chat");
  // channel.onopen = function(event) {
  //   channel.send('Hi you!');
  // }
  // channel.onmessage = function(event) {
  //   console.log(event.data);
  // }

  peerConnection = pc;
}

async function startVideo() 
{
  console.log("called: startVideo");
  try 
  {
    // メディア(今回はビデオ)を取得
    const config = { video: true, audio: false };
    const stream = await navigator.mediaDevices.getUserMedia(config);

    // コネクションにトラックを追加(今回はビデオ)
    // コネクションには映像、音声、何らかのデータなど何かしら通信するメディア(データ)
    // を関連付けないと通信に必要なSDPが得られないようである。
    // 通信するものがない状態と思えば当然な気もするが、addTrackをしていなかった時に
    // onicecandidateコールバックが呼ばれないという罠にハマった。
    stream.getTracks().forEach(function (track) {
      peerConnection.addTrack(track, stream);
    });
    playVideo(dom.videos.local, stream);
  } 
  catch(e) {
    console.error('getUserMedia error:', e);
  }
}

function playVideo(element, stream) 
{
  element.srcObject = stream;
  element.play();
  element.volume = 0;
}

// Offer側のSDPを作成する
async function createOffer() 
{
  console.log("called: createOffer");

  try {
    const sessionDescription = await peerConnection.createOffer();
    console.log(sessionDescription);
    await peerConnection.setLocalDescription(sessionDescription);
    console.log('setLocalDescription() succsess.');
  } catch(e) {
    console.error(e);
  }
}

// Offerから貰ったSDPを受け取る(Answer用の関数)
async function receiveRemoteSdpForAnswer() 
{
  console.log("called: receiveRemoteSdpForAnswer()")

  // Offerから受け取ったSDPを元にSessionDescriptionを生成
  const sdp = dom.sdp.recv.value;
  const offer = new RTCSessionDescription({
    type:'offer',
    sdp
  });

  try {
    await peerConnection.setRemoteDescription(offer);
  } catch (e) {
    console.error(e);
  }
}

// Answer側のSDPを作成する
async function createAnswer() {
  try {
    const sessionDescription = await peerConnection.createAnswer();
    console.log(sessionDescription);
    await peerConnection.setLocalDescription(sessionDescription);
    console.log('setLocalDescription() succsess.');
  } catch (e) {
    console.log(e);
  }
}

// Answerから貰ったSDPを受け取る(Offer用の関数)
async function receiveRemoteSdpForOffer() 
{
  console.log("called: receiveRemoteSdpForOffer()")

  const sdp = dom.sdp.recv.value;
  const answer = new RTCSessionDescription({
    type:'answer',
    sdp
  });

  try {
    await peerConnection.setRemoteDescription(answer);
  } catch (e) {
    console.error(e);
  }
}
