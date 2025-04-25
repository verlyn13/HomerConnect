import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfilesService {
  private supabase: SupabaseClient;

  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseServiceKey = this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error(`Missing Supabase environment variables. URL: ${supabaseUrl}, Key exists: ${!!supabaseServiceKey}`);
    }

    // Allow HTTPS URLs or localhost during development
    if (!supabaseUrl.startsWith('https://') && !supabaseUrl.startsWith('http://localhost')) {
      throw new Error('Supabase URL must start with https:// or be a localhost URL');
    }

    this.supabase = createClient(supabaseUrl, supabaseServiceKey);
  }

  async getProfile(id: string) {
    const { data, error } = await this.supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();
    if (error || !data) {
      throw new NotFoundException(`Profile not found for user ${id}`);
    }
    return data;
  }

  async updateProfile(id: string, dto: UpdateProfileDto) {
    const { data, error } = await this.supabase
      .from('profiles')
      .update(dto)
      .eq('id', id)
      .single();
    if (error) {
      throw error;
    }
    return data;
  }
}
