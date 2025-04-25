import { Injectable, NotFoundException } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfilesService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );
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
