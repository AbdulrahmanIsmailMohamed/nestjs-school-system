import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';

const config = new ConfigService();

cloudinary.config({
  cloud_name: config.get<string>('CLOUDINARY_NAME'),
  api_key: config.get<string>('CLOUDINARY_KEY'),
  api_secret: config.get<string>('CLOUDINARY_SECRET'),
});

export default cloudinary;
