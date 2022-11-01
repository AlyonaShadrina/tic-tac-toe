import { registerAs } from '@nestjs/config';
import { MongooseModuleOptions } from '@nestjs/mongoose';

export default registerAs(
  'webserver',
  (): MongooseModuleOptions => ({
    cors: {
      origin: process.env.HEADER_CORS_ALLOWED || false,
    },
  }),
);
