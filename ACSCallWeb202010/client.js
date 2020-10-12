import { AzureCommunicationUserCredential } from '@azure/communication-common';
import { CommunicationIdentityClient } from "@azure/communication-administration";
import { CallClient } from "@azure/communication-calling";

const callerIdOutput = document.getElementById("caller-id-output");
const callerTokenOutput = document.getElementById("caller-token-output");
const calleeInput = document.getElementById("callee-id-input");
const callButton = document.getElementById("call-button");
const hangUpButton = document.getElementById("hang-up-button");
const messageOutput = document.getElementById("message-output");

let connectionString = "YOUR_CONNECTION_STRING";
const identityClient = new CommunicationIdentityClient(connectionString);

const callClient = new CallClient();
let callAgent;
let call;

identityClient.createUser().then(userResponse => {
    callerIdOutput.value = userResponse.communicationUserId;
    identityClient.issueToken(userResponse, ["voip"]).then(tokenResponse => {
        const userToken = tokenResponse.token;
        callerTokenOutput.value = userToken;
        messageOutput.innerText += "Got user token.";        

        const tokenCredential = new AzureCommunicationUserCredential(userToken);
        callClient.createCallAgent(tokenCredential).then(agent => {
          callAgent = agent;
          callButton.disabled = false;
          messageOutput.innerText += "\nReady to call.";        
        });
    });
});

callButton.addEventListener("click", () => {
    // start a call
    const userToCall = calleeInput.value;
    call = callAgent.call(
        [{ communicationUserId: userToCall }],
        {}
    );

    // change button states & adding messages
    hangUpButton.disabled = false;
    callButton.disabled = true;
    messageOutput.innerText += "\nCall started.";        
});

hangUpButton.addEventListener("click", () => {
    // end the current call
    call.hangUp({ forEveryone: true });
  
    // change button states & adding messages
    hangUpButton.disabled = true;
    callButton.disabled = false;
    messageOutput.innerText += "\nNow hanged up.";
  });