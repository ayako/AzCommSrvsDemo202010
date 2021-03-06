# AzCommSrvsDemo202010
## Azure Communication Services Demo (Sample Codes)

Sample demo apps using [Azure Communication Services](https://azure.microsoft.com/en-us/services/communication-services/).

[Azure Communication Services](https://azure.microsoft.com/ja-jp/services/communication-services/) を利用したサンプルアプリです。

- Sample Demo Apps
    - ACSConsole (C#)
        - Azure Communication Services に接続してユーザー (CommunicationUser) を作成、スレッド (ChatThread) を通じてメッセージの送受信ができるコンソールアプリです。2 つ同時に起動させると (Master および Member)、Master が作成するスレッドに Member のユーザーを追加し、メッセージをやり取りすることが可能です。
        - Console app to create user (CommunicationUser) and send & get messages through thread (ChatThread) through Azure Communication Services. Running 2 consoles at same time (as Master and Member), able to add Member user to Master's thread and communicate each other.
    - ACSCallWeb (node.js)
        - Azure Communication Services 接続してユーザー (CommunicationUser) を作成、VoIP 通話を行うことができる Web アプリです。通話テストでは、Azure Communication Services 通話テスト用ユーザー (id: **8:echo123**) が利用できます。
        - Web app to create user (CommunicationUser) and make VoIP call through Azure Communication Services. Please use Azure Communication Services calling test user (id: **8:echo123**).
    - ACSTeamsCallWeb (node.js)
        - Azure Communication Services 接続してユーザー (CommunicationUser) を作成、VoIP 通話 および Microsoft Teams 会議へ音声参加 を行うことができる Web アプリです。通話テストでは、Azure Communication Services 通話テスト用ユーザー (id: **8:echo123**) が利用できます。
        - Web app to create user (CommunicationUser) and make VoIP call | join Microsoft Teams meeting through Azure Communication Services. Please use Azure Communication Services calling test user (id: **8:echo123**).
    - ACSTeamsVideoWeb (node.js)
        - Azure Communication Services 接続してユーザー (CommunicationUser) を作成、Microsoft Teams 会議へビデオ参加 (カメラ画像＋音声) を行うことができる Web アプリです。
        - Web app to create user (CommunicationUser) and join Microsoft Teams meeting with camera video and voice through Azure Communication Services. 

- Requirements
    - Azure サブスクリプション & Azure Communication Services サービス
        - Azure Portal から Azure Communication Services の接続文字列(Connection String) と エンドポイント(URL) を取得し、アプリ内の 接続文字列 および エンドポイント を書き換えてください
    - Azure Communication Services と Microsoft Teams の相互運用 (ACSTeamsCallWeb)
        - Azure Communication Services から Microsoft Teams テナントに接続するための設定リクエストを行ってください (-> [リクエストフォーム](https://forms.office.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbR21ouQM6BHtHiripswZoZsdURDQ5SUNQTElKR0VZU0VUU1hMOTBBMVhESS4u))
    - Azure Subscription & Azure Communication Services
        - Get Connection String and endpoint (URL) from Azure Portal. Replace connection string and endpoint in apps.
    - Azure Communication Services & Microsoft Teams Interop (ACSTeamsCallWeb | ACSTeamsVideoWeb)
        - Need to make request to enable Microsoft Teams tenant to accress from Azure Communication Services (-> [Request Form](https://forms.office.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbR21ouQM6BHtHiripswZoZsdURDQ5SUNQTElKR0VZU0VUU1hMOTBBMVhESS4u))

- Demo
    - ACSConsole
        - ![ACSConsole-Video](ACSConsole202010.gif)
    - ACSCallWeb
        - ![ACSCallWeb-Video](ACSCallWeb202010.gif)
    - ACSTeamsCallWeb
        - ![ACSTeamsCallWeb-Video-VoIP](ACSTeamsCallWeb202103_VoIP.gif)
        - ![ACSTeamsCallWeb-Video-Teams](ACSTeamsCallWeb202103_Teams.gif)
    - ACSTeamsVideoWeb
        - ![ACSTeamsVideoWeb-Video](ACSTeamsVideoWeb202104.gif)