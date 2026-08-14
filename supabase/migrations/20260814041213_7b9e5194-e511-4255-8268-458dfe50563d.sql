CREATE TABLE public.lesson_cache (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  topic_key TEXT NOT NULL UNIQUE,
  lesson JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE public.lesson_image_cache (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cache_key TEXT NOT NULL UNIQUE,
  image TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT ALL ON public.lesson_cache TO service_role;
GRANT ALL ON public.lesson_image_cache TO service_role;
ALTER TABLE public.lesson_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_image_cache ENABLE ROW LEVEL SECURITY;