-- Anonymous IP-based case creation limits
CREATE TABLE IF NOT EXISTS public.anonymous_case_usage (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    ip_hash text NOT NULL,
    usage_date date NOT NULL,
    case_count int NOT NULL DEFAULT 0,
    created_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE(ip_hash, usage_date)
);

-- Authenticated user daily credits (cases, analyses, game plans)
CREATE TABLE IF NOT EXISTS public.user_daily_usage (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    usage_date date NOT NULL,
    cases_created int NOT NULL DEFAULT 0,
    analyses_used int NOT NULL DEFAULT 0,
    game_plans_used int NOT NULL DEFAULT 0,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE(user_id, usage_date)
);

-- RLS: only service role can access (bypasses RLS); anon/authenticated get no access without policies
ALTER TABLE public.anonymous_case_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_daily_usage ENABLE ROW LEVEL SECURITY;

COMMENT ON TABLE public.anonymous_case_usage IS 'Tracks anonymous case creation per IP per day for rate limiting';
COMMENT ON TABLE public.user_daily_usage IS 'Tracks authenticated user daily usage (cases, analyses, game plans) for credit limits';
