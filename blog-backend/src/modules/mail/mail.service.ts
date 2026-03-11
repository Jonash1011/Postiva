import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { google } from 'googleapis';

@Injectable()
export class MailService {
  private readonly oAuth2Client;

  constructor(private readonly configService: ConfigService) {
    this.oAuth2Client = new google.auth.OAuth2(
      this.configService.get<string>('gmail.clientId'),
      this.configService.get<string>('gmail.clientSecret'),
      'https://developers.google.com/oauthplayground',
    );

    this.oAuth2Client.setCredentials({
      refresh_token: this.configService.get<string>('gmail.refreshToken'),
    });
  }

  private async createTransporter(): Promise<nodemailer.Transporter> {
    const accessTokenResponse = await this.oAuth2Client.getAccessToken();
    const accessToken = accessTokenResponse.token;

    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: this.configService.get<string>('gmail.user'),
        clientId: this.configService.get<string>('gmail.clientId'),
        clientSecret: this.configService.get<string>('gmail.clientSecret'),
        refreshToken: this.configService.get<string>('gmail.refreshToken'),
        accessToken: accessToken as string,
      },
    });
  }

  async sendOtpEmail(email: string, otp: string) {
    const transporter = await this.createTransporter();

    await transporter.sendMail({
      from: this.configService.get<string>('gmail.user'),
      to: email,
      subject: 'Password Reset OTP',
      html: `
        <h2>Password Reset</h2>
        <p>Your OTP is:</p>
        <h1>${otp}</h1>
        <p>This OTP expires in 10 minutes.</p>
      `,
    });
  }
}
