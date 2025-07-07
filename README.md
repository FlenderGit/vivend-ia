# Vivend'ia
## Overview
Vivend'ia is a Chrome Extension that enables AI-powered conversations using Vivendi application context. The extension integrates with Microsoft Active Directory for authentication and leverages Azure OpenAI for AI capabilities.

## Key Features
- Context-aware AI: Imports application context using Azure OpenAI function calling
- Secure Authentication: Microsoft AD integration
- Dynamic Context: Receives app-specific information through headers (app name, entity type, ID, etc.)

## Architecture
- Frontend: Chrome Extension / Web Application
- Authentication: Microsoft Azure AD
- AI Service: Azure OpenAI
- Context Integration: [Azure OpenAI Function Calling](https://learn.microsoft.com/en-us/azure/ai-foundry/openai/how-to/responses#function-calling)
- Backend API: Project in development

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

Finally you can build the project :
- **Chrome Extension** : `npm run build`
- *Web application* : `npm run build --mode=web` 



## Todo list

### Key functionnalities
- [X] : Connect to Azure AD
- [X] : Global error handling
- [ ] : Edit conversation
- [ ] : Link to API

### Minor functionnalities
- [ ] : Theming
- [ ] : Date on sidebar
- [ ] : Code Highlight
- [ ] : Handle image generation
- [ ] : title to Popper black 
- [ ] : Add custom building mode for floating modal