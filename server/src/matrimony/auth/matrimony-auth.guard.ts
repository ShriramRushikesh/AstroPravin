import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class MatrimonyAuthGuard extends AuthGuard('matrimony-jwt') {}
