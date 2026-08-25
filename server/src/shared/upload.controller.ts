import {
    Controller, Post, UseInterceptors, UploadedFile, BadRequestException, Req, UseGuards
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import type { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';

const uploadStorage = diskStorage({
    destination: (_req, _file, cb) => {
        const uploadDir = join(process.cwd(), 'public', 'uploads');
        if (!existsSync(uploadDir)) mkdirSync(uploadDir, { recursive: true });
        cb(null, uploadDir);
    },
    filename: (_req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
        const cleanExt = extname(file.originalname).toLowerCase().replace(/[^a-z0-9.]/g, '');
        cb(null, `upload-${uniqueSuffix}${cleanExt}`);
    },
});

@Controller('upload')
export class UploadController {
    @UseGuards(AuthGuard('jwt'))
    @Post()
    @UseInterceptors(
        FileInterceptor('image', {
            storage: uploadStorage,
            limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB maximum
            fileFilter: (_req, file, cb) => {
                const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'application/pdf'];
                if (!allowedMimes.includes(file.mimetype)) {
                    return cb(new BadRequestException('Invalid file format. Only JPG, PNG, WebP, AVIF, and PDF files are allowed.'), false);
                }
                cb(null, true);
            },
        }),
    )
    uploadImage(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
        if (!file) {
            throw new BadRequestException('No valid image or document file was provided.');
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
