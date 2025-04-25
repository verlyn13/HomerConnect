-- Add indexes and RLS policies for performance and security (FND-03.4 & FND-03.5)

-- Indexes for core tables
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON public.profiles(created_at);

CREATE INDEX IF NOT EXISTS idx_events_creator_id ON public.events(creator_id);
CREATE INDEX IF NOT EXISTS idx_events_start_time ON public.events(start_time);
CREATE INDEX IF NOT EXISTS idx_events_end_time ON public.events(end_time);
CREATE INDEX IF NOT EXISTS idx_events_location_coords ON public.events USING GIST(location_coords);

CREATE INDEX IF NOT EXISTS idx_event_categories_event_id ON public.event_categories(event_id);
CREATE INDEX IF NOT EXISTS idx_event_categories_category_id ON public.event_categories(category_id);

CREATE INDEX IF NOT EXISTS idx_event_rsvps_event_id ON public.event_rsvps(event_id);
CREATE INDEX IF NOT EXISTS idx_event_rsvps_user_id ON public.event_rsvps(user_id);

-- RLS policies for categories
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid conflicts
DO $$
BEGIN
    BEGIN
        DROP POLICY IF EXISTS "Public categories are viewable by everyone" ON public.categories;
    EXCEPTION WHEN undefined_object THEN
        -- Policy doesn't exist, continue
    END;

    BEGIN
        DROP POLICY IF EXISTS "Authenticated users can insert categories" ON public.categories;
    EXCEPTION WHEN undefined_object THEN
        -- Policy doesn't exist, continue
    END;

    BEGIN
        DROP POLICY IF EXISTS "Authenticated users can update categories" ON public.categories;
    EXCEPTION WHEN undefined_object THEN
        -- Policy doesn't exist, continue
    END;

    BEGIN
        DROP POLICY IF EXISTS "Authenticated users can delete categories" ON public.categories;
    EXCEPTION WHEN undefined_object THEN
        -- Policy doesn't exist, continue
    END;
END
$$;

-- Create policies without IF NOT EXISTS
CREATE POLICY "Public categories are viewable by everyone" ON public.categories
    FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert categories" ON public.categories
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update categories" ON public.categories
    FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete categories" ON public.categories
    FOR DELETE USING (auth.role() = 'authenticated');

-- RLS policies for event_categories
ALTER TABLE public.event_categories ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DO $$
BEGIN
    BEGIN
        DROP POLICY IF EXISTS "Public event_categories are viewable by everyone" ON public.event_categories;
    EXCEPTION WHEN undefined_object THEN
        -- Policy doesn't exist, continue
    END;

    BEGIN
        DROP POLICY IF EXISTS "Event creators can insert event_categories" ON public.event_categories;
    EXCEPTION WHEN undefined_object THEN
        -- Policy doesn't exist, continue
    END;

    BEGIN
        DROP POLICY IF EXISTS "Event creators can delete event_categories" ON public.event_categories;
    EXCEPTION WHEN undefined_object THEN
        -- Policy doesn't exist, continue
    END;
END
$$;

-- Create policies
CREATE POLICY "Public event_categories are viewable by everyone" ON public.event_categories
    FOR SELECT USING (true);
CREATE POLICY "Event creators can insert event_categories" ON public.event_categories
    FOR INSERT WITH CHECK (
      EXISTS (
        SELECT 1 FROM public.events e
        WHERE e.id = public.event_categories.event_id
          AND e.creator_id = auth.uid()
      )
    );
CREATE POLICY "Event creators can delete event_categories" ON public.event_categories
    FOR DELETE USING (
      EXISTS (
        SELECT 1 FROM public.events e
        WHERE e.id = public.event_categories.event_id
          AND e.creator_id = auth.uid()
      )
    );

-- RLS policies for event_rsvps
ALTER TABLE public.event_rsvps ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DO $$
BEGIN
    BEGIN
        DROP POLICY IF EXISTS "Public RSVPs are viewable by everyone" ON public.event_rsvps;
    EXCEPTION WHEN undefined_object THEN
        -- Policy doesn't exist, continue
    END;

    BEGIN
        DROP POLICY IF EXISTS "Authenticated users can insert RSVPs" ON public.event_rsvps;
    EXCEPTION WHEN undefined_object THEN
        -- Policy doesn't exist, continue
    END;

    BEGIN
        DROP POLICY IF EXISTS "Users can update their own RSVPs" ON public.event_rsvps;
    EXCEPTION WHEN undefined_object THEN
        -- Policy doesn't exist, continue
    END;

    BEGIN
        DROP POLICY IF EXISTS "Users can delete their own RSVPs" ON public.event_rsvps;
    EXCEPTION WHEN undefined_object THEN
        -- Policy doesn't exist, continue
    END;
END
$$;
