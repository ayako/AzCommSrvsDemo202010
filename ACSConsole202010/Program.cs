using Azure;
using Azure.Communication;
using Azure.Communication.Administration;
using Azure.Communication.Chat;
using Azure.Communication.Identity;
using System;

namespace ACSConsole202010
{
    class Program
    {
        static string connectionString = "YOUR_CONNECTION_STRING";
        static Uri endpoint = new Uri("https://YOUR_SERVICE_NAME.communication.azure.com/");

        static void Main(string[] args)
        {
            Console.WriteLine("------ Azure Communication Services Console Demo ---\n");

            // Set user and get user access token
            Console.WriteLine("Type your name...");
            string userName = Console.ReadLine();
            var identityClient = new CommunicationIdentityClient(connectionString);

            CommunicationUser user = identityClient.CreateUser().Value;
            var chatThreadMember = new ChatThreadMember(user) { DisplayName = userName };

            string userToken = identityClient.IssueToken(user, scopes: new[] { CommunicationTokenScope.Chat }).Value.Token;
            var chatClient = new ChatClient(endpoint, new CommunicationUserCredential(userToken));

            ChatThreadClient chatThreadClient = null;

            string threadType = "";
            string threadId = "";
            while(chatThreadClient == null)
            {
                switch (threadType)
                {
                    case "n":
                        // Create new thread
                        chatThreadClient = chatClient.CreateChatThread(topic: userName + "'s thread", members: new[] { chatThreadMember });
                        threadId = chatThreadClient.Id;
                        break;

                    case "j":
                        // Show info to get join to existing thread
                        Console.WriteLine("Your user id is: " + user.Id + "\n" + "Tell your id to thread owner to join.");
                        Console.WriteLine("Get thread id from thread owner, and type here:");
                        threadId = Console.ReadLine();
                        chatThreadClient = chatClient.GetChatThreadClient(threadId);
                        break;

                    default:
                        Console.WriteLine("Create New Thread (type \"n\") or Join Existing Thread (type \"j\")?");
                        threadType = Console.ReadLine();
                        break;
                }
            }

            Console.WriteLine("You are: " + userName + "(userId: " + user.Id + ")");
            Console.WriteLine("You are in this thread: " + threadId + "\n");

            string userMessage = "--- new user " + userName + " joined ---";
            while (userMessage != "q")
            {
                if (userMessage == "a")
                {
                    // Add member to this thread
                    Console.WriteLine("Type user id to let join to this thread.");
                    string newUserId = Console.ReadLine();
                    var newMember = new ChatThreadMember(new CommunicationUser(newUserId));
                    chatThreadClient.AddMembers(new[] { newMember });
                    Console.WriteLine("Tell this thread id to your friend to join: " + chatThreadClient.Id + "\n");
                }
                else if (userMessage != "")
                {
                    // Send message to ACS
                    chatThreadClient.SendMessage(userMessage, ChatMessagePriority.Normal, userName);

                }

                // Get and show messages
                Pageable<ChatMessage> chatMessages = chatThreadClient.GetMessages();
                Console.WriteLine("\n--- message thread ---");
                foreach (var message in chatMessages)
                {
                    if (message.Type == "Text")
                    {
                        Console.WriteLine("[" + message.Id + "] " + message.SenderDisplayName + ": " + message.Content
                            + " (" + message.CreatedOn + ")");
                    }
                }
                Console.WriteLine("------\n");

                Console.WriteLine("Type new message to ACS. Type \"q\" to quit, type \"a\" to add user, or type enter to show messages.");
                userMessage = Console.ReadLine();
            }
        }


    }
}
