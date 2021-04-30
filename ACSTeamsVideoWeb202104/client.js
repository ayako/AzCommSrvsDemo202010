import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import { CommunicationIdentityClient } from "@azure/communication-identity";
import { CallClient, VideoStreamRenderer, LocalVideoStream } from "@azure/communication-calling"; 

let connectionString = "YOUR_CONNECTION_STRING";

// 入力
const meetingUrlInput = document.getElementById("meeting-url-input");       // Teams Meeting URL
const joinMeetingButton = document.getElementById("join-meeting-button");   // Teams Meeting join button
const hangUpButton = document.getElementById("hang-up-button");             // Teams Meeting hang-up button
const startVideoButton = document.getElementById("start-video-button");     // Camera Start button
const stopVideoButton = document.getElementById("stop-video-button");       // Camera Stop button

// 出力
const callerIdOutput = document.getElementById("caller-id-output");       // ACS UserId
const callerTokenOutput = document.getElementById("caller-token-output"); // ACS UserToken
const messageOutput = document.getElementById("message-output");          // Status Message

let callAgent;
let call;

let deviceManager       // Camera Magagement
let localVideoStream;   // Camera Stream
let rendererLocal;      // Camera Stream Video Renderer
let rendererRemote;     // Teams Meeting's Video Renderer


// Create ACS User and get token
const identityClient = new CommunicationIdentityClient(connectionString);
const callClient = new CallClient();

identityClient.createUser().then(identityResponse => {
    callerIdOutput.value = identityResponse.communicationUserId;    // ACS User Id output
    identityClient.getToken(identityResponse, ["voip"]).then(tokenResponse => {
        const userToken = tokenResponse.token;
        callerTokenOutput.value = userToken;                        // ACS User Token output
        messageOutput.innerText += "Got user token.";               // Status Message output

        const tokenCredential = new AzureCommunicationTokenCredential(userToken);
        callClient.createCallAgent(tokenCredential, {displayName: 'ACS user'}).then(async agent => {
          callAgent = agent;
          deviceManager = await callClient.getDeviceManager()
          joinMeetingButton.disabled = false;                       // Teams Meeting join button Enable
          messageOutput.innerText += "\nReady to join MSTeam's Meeting.";        // Status Message output
        });
    });
});

// Place Camera video stream
async function localVideoView(){
    rendererLocal = new VideoStreamRenderer(localVideoStream);
    const view = await rendererLocal.createView({ scalingMode: 'Crop'});
    document.getElementById("myVideo").appendChild(view.target);
}

// Place Teams Meeting video stream
async function remoteVideoView(remoteVideoStream) {
    rendererRemote = new VideoStreamRenderer(remoteVideoStream);
    const view = await rendererRemote.createView({ scalingMode: 'Crop'});
    document.getElementById("remoteVideo").appendChild(view.target);
}

// Video Streams handling in Teams Meeting
// Get Meeting participants and each video stream
function subscribeToRemoteParticipantInCall(callInstance) {
    callInstance.on('remoteParticipantsUpdated', e => {
        e.added.forEach( p => {
            subscribeToParticipantVideoStreams(p);
        })
    });
    callInstance.remoteParticipants.forEach(p => {
        subscribeToPaticipantVideoStreams(p);
    })
}

function subscribeToParticipantVideoStreams(remoteParticipant){
    remoteParticipant.on('videoStreamsUpdated', e=> {
        e.added.forEach(v => {
            handleVideoStream(v);
        })
    });
    remoteParticipant.videoStreams.forEach(v => {
        handleVideoStream(v);
    });
}

// Place Meeting participant video stream
function handleVideoStream(remoteVideoStream) {
    remoteVideoStream.on('isAvailableChanged', async () => {
        if (remoteVideoStream.isAvailable) {
            remoteVideoView(remoteVideoStream);
        } else {
            rendererRemote.dispose();
        }
    });
    if (remoteVideoStream.isAvailable) {
        remoteVideoView(remoteVideoStream);
    }
}


joinMeetingButton.addEventListener("click", async () => {
    // Get Camera
    const videoDevices = await deviceManager.getCameras();
    const videoDeviceInfo = videoDevices[0];

    // Place Camera video stream
    localVideoStream = new LocalVideoStream(videoDeviceInfo);
    localVideoView();

    // Start | Stop local video stream
    startVideoButton.disabled = true;   // Disable Camera Start button
    stopVideoButton.disabled = false;   // Enable Camera Stop button

    // Send join request to Teams Meeting
    call = callAgent.join(
        { meetingLink: meetingUrlInput.value }, 
        { videoOptions: { localVideoStreams: [localVideoStream] } }
    );

    // Place Teams Meeting streams
    subscribeToRemoteParticipantInCall(call);

    // Meeting status update
    call.on('stateChanged', () => {
        messageOutput.innerText += "\nMeeting:" + call.state;
    })

    // Button update, Status Message output
    hangUpButton.disabled = false;      // Enable Teams Meeting hang-up button
    joinMeetingButton.disabled = true;  // Disable Teams Meeting join button
}); 

hangUpButton.addEventListener("click", () => {
    // Hang up Teams Meeting
    call.hangUp();

    // Dispose video renderer
    rendererLocal.dispose();
  
    // Buttons update, Status Message output
    hangUpButton.disabled = true;       // Disaable Teams Meeting hang-up button
    joinMeetingButton.disabled = false; // Enable Teams Meeting join button
    stopVideoButton.disabled = true;    // Disaable Camera Stop button
    messageOutput.innerText += "\nNow hanged up.";  // Status Message output
});

startVideoButton.addEventListener("click", async () => {
    await call.startVideo(localVideoStream);
    localVideoView();
    startVideoButton.disabled = true;   // Disaable Camera Start button
    stopVideoButton.disabled = false;   // Enable Camera Stop button
});

stopVideoButton.addEventListener("click", async () => {
    await call.stopVideo(localVideoStream);
    rendererLocal.dispose();
    startVideoButton.disabled = false;  // Enable Camera Start button
    stopVideoButton.disabled = true;    // Disable Camera Stop button
 });
