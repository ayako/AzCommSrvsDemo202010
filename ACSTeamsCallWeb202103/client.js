import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import { CommunicationIdentityClient } from "@azure/communication-identity";
import { CallClient, Features } from "@azure/communication-calling";

let connectionString = "YOUR_CONNECTION_STRING";

// Input
const calleeInput = document.getElementById("callee-id-input"); // VoIP UserId to call
const callButton = document.getElementById("call-button");      // Start VoIP call
const meetingUrlInput = document.getElementById("meeting-url-input");       // Teams Meeting URL
const joinMeetingButton = document.getElementById("join-meeting-button");   // Join Teams Meeting
const hangUpButton = document.getElementById("hang-up-button");             // Hang up call | meeting
// Output
const callerIdOutput = document.getElementById("caller-id-output");       // ACS UserId
const callerTokenOutput = document.getElementById("caller-token-output"); // ACS UserToken
const messageOutput = document.getElementById("message-output");          // Status messages


// Create ACS User and get User Token 
const identityClient = new CommunicationIdentityClient(connectionString);
const callClient = new CallClient();
let callAgent;
let call;

identityClient.createUser().then(identityResponse => {
    callerIdOutput.value = identityResponse.communicationUserId;    // ACS User Id output
    identityClient.getToken(identityResponse, ["voip"]).then(tokenResponse => {
        const userToken = tokenResponse.token;
        callerTokenOutput.value = userToken;                        // ACS User Token output
        messageOutput.innerText += "Got user token.";               // status messages output

        const tokenCredential = new AzureCommunicationTokenCredential(userToken);
        callClient.createCallAgent(tokenCredential, {displayName: 'ACS user'}).then(agent => {
          callAgent = agent;
          callButton.disabled = false;                              // Enable to VoIP Call Start
          joinMeetingButton.disabled = false;                       // Enable to Join Teams Meeing
          messageOutput.innerText += "\nReady to call | join MSTeam's Meeting.";        // Status messages output
        });
    });
});

// Start VoIP call when button clicked
callButton.addEventListener("click", () => {
    // Start Call
    call = callAgent.startCall(
        [{ id: calleeInput.value }],
        {}
    );

    // Button Enable | Disable change, show status messages 
    hangUpButton.disabled = false;      // Enable to Hang up
    callButton.disabled = true;         // Disable to VoIP Call Start
    joinMeetingButton.disabled = true;  // Disable to Join Teams Meeting
    messageOutput.innerText += "\nCall: started.";    // Status messages output
});

// Join Teams Meeting when button clicked
joinMeetingButton.addEventListener("click", () => {
    // Join Teams Meeting
    call = callAgent.join(
        { meetingLink: meetingUrlInput.value }, 
        {}
    );

    // Show Teams Meeting Join status
    call.on('stateChanged', () => {
        messageOutput.innerText += "\nMeeting:" + call.state;
    })

    // Button Enable | Disable change, show status messages 
    call.api(Features.Recording).on('isRecordingActiveChanged', () => {
        if (call.api(Features.Recording).isRecordingActive) {
            messageOutput.innerText += "\nThis call is being recorded";
        };
    });

    // Button Enable | Disable change, show status messages 
    hangUpButton.disabled = false;      // Enable to Hang up
    callButton.disabled = true;         // Disable to VoIP Call Start
    joinMeetingButton.disabled = true;  // Disable to Join Teams Meeting
});

hangUpButton.addEventListener("click", () => {
    // Hang up Call | Teams Meeting
    call.hangUp({ forEveryone: true });
  
    // Button Enable | Disable change, show status messages 
    hangUpButton.disabled = true;       // Enable to Hang up
    callButton.disabled = false;        // Disable to VoIP Call Start
    joinMeetingButton.disabled = false; // Disable to Join Teams Meeting
    messageOutput.innerText += "\nNow hanged up.";  // Status messages output
});