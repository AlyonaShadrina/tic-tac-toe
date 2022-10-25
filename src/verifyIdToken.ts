import {OAuth2Client} from 'google-auth-library';

// TODO: test with incorrect client id
const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;

const client = new OAuth2Client(clientId);
export async function verify(token: string) {
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: clientId,  // Specify the CLIENT_ID of the app that accesses the backend
  });
  const payload = ticket.getPayload();
  return payload?.['sub'];
}
