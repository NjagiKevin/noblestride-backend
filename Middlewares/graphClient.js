const { Client } = require("@microsoft/microsoft-graph-client");
const { ClientSecretCredential } = require("@azure/identity");

const tenantId = process.env.O365_TENANT_ID;
const clientId = process.env.O365_CLIENT_ID;
const clientSecret = process.env.O365_CLIENT_SECRET;

const credential = new ClientSecretCredential(tenantId, clientId, clientSecret);

const graphClient = Client.initWithMiddleware({
  authProvider: {
    getAccessToken: async () => {
      const tokenResponse = await credential.getToken("https://graph.microsoft.com/.default");
      return tokenResponse.token;
    },
  },
});

module.exports = graphClient;