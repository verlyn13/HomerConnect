# Key Backend Code Structures

This document contains canonical examples of key backend code structures after they've been verified and refactored for consistency in Phase 4. These examples serve as a reference for the standardized patterns used throughout the application.

## Supabase Client Service Initialization

File: `backend/src/supabase/supabase.service.ts` (or equivalent path)

```typescript
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private client: SupabaseClient;

  constructor(private configService: ConfigService) {
    this.client = createClient(
      this.configService.get<string>('SUPABASE_URL'),
      this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY'),
    );
  }

  getClient(): SupabaseClient {
    return this.client;
  }

  // Additional helper methods as needed
}
```

## Auth Controller Methods

File: `backend/src/auth/auth.controller.ts` (or equivalent path)

### Signup Endpoint

```typescript
import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(signupDto);
  }

  // Other auth endpoints...
}
```

### Signin Endpoint

```typescript
import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninDto } from './dto/signin.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async signin(@Body() signinDto: SigninDto) {
    return this.authService.signin(signinDto);
  }

  // Other auth endpoints...
}
```

## Profile Service Methods

File: `backend/src/profile/profile.service.ts` (or equivalent path)

### Get Profile

```typescript
import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class ProfileService {
  constructor(private supabaseService: SupabaseService) {}

  async getProfile(userId: string) {
    const { data, error } = await this.supabaseService.getClient()
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      throw new NotFoundException('Profile not found');
    }

    return data;
  }

  // Other profile methods...
}
```

### Update Profile

```typescript
import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfileService {
  constructor(private supabaseService: SupabaseService) {}

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto) {
    const { data, error } = await this.supabaseService.getClient()
      .from('profiles')
      .update(updateProfileDto)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      throw new NotFoundException('Profile update failed');
    }

    return data;
  }

  // Other profile methods...
}
```

## Auth Guard

File: `backend/src/auth/auth.guard.ts` (or equivalent path)

```typescript
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private supabaseService: SupabaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid authorization header');
    }

    const token = authHeader.split(' ')[1];

    try {
      const { data: { user }, error } = await this.supabaseService.getClient().auth.getUser(token);

      if (error || !user) {
        throw new UnauthorizedException('Invalid token');
      }

      // Attach user to request for later use
      request.user = user;

      return true;
    } catch (error) {
      throw new UnauthorizedException('Authentication failed');
    }
  }
}
```

## Data Transfer Objects (DTOs)

File: `backend/src/auth/dto/signup.dto.ts` (or equivalent path)

```typescript
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SignupDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  // Other signup fields as needed
}
```

File: `backend/src/profile/dto/update-profile.dto.ts` (or equivalent path)

```typescript
import { IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsUrl()
  avatar_url?: string;

  @IsOptional()
  @IsUrl()
  website?: string;

  // Other profile fields as needed
}
```

## Error Handling

File: `backend/src/common/filters/supabase-exception.filter.ts` (or equivalent path)

```typescript
import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { PostgrestError } from '@supabase/supabase-js';

@Catch(PostgrestError)
export class SupabaseExceptionFilter implements ExceptionFilter {
  catch(exception: PostgrestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // Map Supabase errors to HTTP status codes
    let status = HttpStatus.INTERNAL_SERVER_ERROR;

    if (exception.code === '23505') {
      status = HttpStatus.CONFLICT; // Unique constraint violation
    } else if (exception.code === '23503') {
      status = HttpStatus.BAD_REQUEST; // Foreign key violation
    } else if (exception.code === '42P01') {
      status = HttpStatus.NOT_FOUND; // Relation does not exist
    }
    // Add other error code mappings as needed

    response.status(status).json({
      statusCode: status,
      message: exception.message,
      error: exception.code,
      details: exception.details,
    });
  }
}
```

## Logging

File: `backend/src/common/services/logger.service.ts` (or equivalent path)

```typescript
import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';

@Injectable()
export class LoggerService implements NestLoggerService {
  constructor(private context: string) {}

  log(message: string, context?: string) {
    console.log(`[${new Date().toISOString()}] [${context || this.context}] ${message}`);
  }

  error(message: string, trace?: string, context?: string) {
    console.error(`[${new Date().toISOString()}] [${context || this.context}] ERROR: ${message}`, trace);
  }

  warn(message: string, context?: string) {
    console.warn(`[${new Date().toISOString()}] [${context || this.context}] WARN: ${message}`);
  }

  debug(message: string, context?: string) {
    console.debug(`[${new Date().toISOString()}] [${context || this.context}] DEBUG: ${message}`);
  }

  verbose(message: string, context?: string) {
    console.log(`[${new Date().toISOString()}] [${context || this.context}] VERBOSE: ${message}`);
  }
}
```

## Module Configuration

File: `backend/src/app.module.ts` (or equivalent path)

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';
import { SupabaseModule } from './supabase/supabase.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    SupabaseModule,
    AuthModule,
    ProfileModule,
  ],
})
export class AppModule {}
```

## Consistency Standards

The backend code follows these standardized patterns:

1. **Configuration Access**: All environment variables are accessed through the NestJS ConfigService
2. **Supabase Client**: A single SupabaseService provides the Supabase client throughout the application
3. **API Endpoints**: Consistent route naming, HTTP methods, and status codes
4. **Validation**: All input is validated using DTOs with class-validator
5. **Authorization**: Protected routes use the AuthGuard
6. **Error Handling**: Consistent error handling and response formats
7. **Logging**: Standardized logging through the LoggerService

These structures represent the finalized, verified implementation that has been tested and confirmed to work correctly.
