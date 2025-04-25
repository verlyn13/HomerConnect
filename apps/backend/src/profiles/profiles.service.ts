import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfilesService {
  private supabase: SupabaseClient;

  constructor() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error(`Missing Supabase environment variables. URL: ${supabaseUrl}, Key exists: ${!!supabaseServiceKey}`);
    }

    // Ensure URL is properly formatted
    const validUrl = supabaseUrl.startsWith('http://') || supabaseUrl.startsWith('https://') 
      ? supabaseUrl 
      : `https://${supabaseUrl}`;

    this.supabase = createClient(validUrl, supabaseServiceKey);
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
