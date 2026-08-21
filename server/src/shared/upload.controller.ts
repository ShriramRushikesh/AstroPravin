import {
    Controller, Post, UseInterceptors, UploadedFile, BadRequestException, Req
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import type { Request } from 'express';

const uploadStorage = diskStorage({
    destination: (_req, _file, cb) => {
        const uploadDir = join(process.cwd(), 'public', 'uploads');
        if (!existsSync(uploadDir)) mkdirSync(uploadDir, { recursive: true });
        cb(null, uploadDir);
    },
    filename: (_req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
        const cleanName = file.originalname.replace(/[^a-zA-Z0-9.]/g, '-');
        cb(null, `upload-${uniqueSuffix}${extname(cleanName)}`);
    },
});

@Controller('upload')
export class UploadController {
    @Post()
    @UseInterceptors(FileInterceptor('image', { storage: uploadStorage }))
    uploadImage(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
        if (!file) {
            throw new BadRequestException('No image file was provided.');
        }

        const host = req.get('host') || 'localhost:5002';
        const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'http';
        const fileUrl = `${protocol}://${host}/public/uploads/${file.filename}`;

        return {
            success: true,
            url: fileUrl,
            filename: file.filename,
            path: `/public/uploads/${file.filename}`,
        };
    }
}
