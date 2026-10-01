-- Sessão única por conta: guarda o session_id (claim do JWT) da sessão mais
-- recente. A cada novo login, o proxy sobrescreve esse valor; qualquer
-- sessão com um session_id diferente é derrubada no próximo acesso. Evita
-- que o link de acesso de uma assinante seja usado por duas pessoas ao
-- mesmo tempo, sem precisar do Supabase Pro.

alter table public.members add column if not exists active_session_id uuid;
