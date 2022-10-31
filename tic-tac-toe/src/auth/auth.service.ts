import { Injectable } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class AuthService {
  private oAuthClient: OAuth2Client;
  private clientId: string = process.env.GOOGLE_OAUTH_CLIENT_ID;
  constructor() {
    this.oAuthClient = new OAuth2Client(this.clientId);
  }

  async verifyToken(token) {
    return this.oAuthClient.verifyIdToken({
      idToken: token,
      audience: this.clientId,
    });
  }
  async getUserIdFromToken(token) {
    const ticket = await this.verifyToken(token);
    const payload = ticket.getPayload();
    return payload?.['sub'];
  }
}
