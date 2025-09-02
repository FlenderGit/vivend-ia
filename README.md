# Vivend'ia
## Overview
Vivend'ia is a Chrome Extension that enables AI-powered conversations using Vivendi application context. The extension integrates with Microsoft Active Directory for authentication and leverages Azure OpenAI for AI capabilities.

The goal is to expose a chat with AI with functionnalities depending of the web application aside. Some apps can access DB, some can fetch web information, some can access inner files...

## Key Features
- Context-aware AI: Imports application context using Azure OpenAI function calling
- Secure Authentication: Microsoft AD integration
- Dynamic Context: Receives app-specific information through headers (app name, entity type, ID, etc.)
- Internationnal translation using I18n

## Architecture
- **Frontend**: Svelte
- **Backend API**: PHP + Slim [Github not ready](https://example.com)
- **Authentication**: Microsoft Azure AD
- AI Service: Azure OpenAI

## Basic explaination
The extension can access the current tab of the user. Depending this, she can hide itself or show the chat.
When the user send a prompt to the AI, a call is send to the DB with a header containing the tab URL. The API use this data to analyse whose functionnalities are allowed and send the context to the AI using the [Azure OpenAI Function Calling](https://learn.microsoft.com/en-us/azure/ai-foundry/openai/how-to/responses#function-calling). The AI can ask the API to execute functions during it reasoning. When the AI's response is ready, the data is sended to the user as a stream. 

## How to install

In the first place, install dependencies :
`npm install`

Please add the `.env` file before building the project.
```env
VITE_API_URL='...'
VITE_AZURE_CLIENT_ID='...'
VITE_AZURE_TENANT_ID='...'
VITE_AZURE_REDIRECT_URI='...'
```

### ✨ Features
Before build, you can enable some features (depending the extension size you want):
- **VITE_FEATURES_CODE_PREVIEW**: View the code with highlighting

### Access extension
Finally you can build the project :
- **Chrome Extension** : `npm run build:extension`
- **Web application** : `npm run build:web` 


## Todo list

### Key functionnalities
- [X] : Authentification Azure AD SSO
- [X] : Global error handling
- [X] : Link to API
- [X] : Internationalization (i18n)

### Minor functionnalities
- [ ] : Build for extension and web
- [ ] : Theming
- [ ] : Date on sidebar
- [X] : Code Highlight
- [ ] : Handle image generation
- [X] : Popper popover 