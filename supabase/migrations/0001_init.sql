-- Photo Studio TPV — schema inicial
-- Rode este arquivo no SQL editor do Supabase (ou via `supabase db push`)

create extension if not exists "pgcrypto";

-- Assinantes liberados pelo Hotmart (1 linha por e-mail comprador)
create table if not exists public.members (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  hotmart_transaction_id text,
  hotmart_subscriber_code text,
  status text not null default 'inactive' check (status in ('active', 'inactive', 'refunded')),
  purchased_at timestamptz,
  updated_at timestamptz not null default now()
);

-- Catálogo de referências (importado da planilha de prompts)
create table if not exists public.reference_photos (
  id uuid primary key default gen_random_uuid(),
  categoria text not null check (categoria in ('evergreen', 'data_comemorativa')),
  tipo_peca text not null,
  pose text not null,
  data_comemorativa text,
  nome_referencia text not null unique,
  prompt_mestre text not null,
  perfis_sugeridos text,
  aspecto text,
  thumbnail_url text,
  status text not null default 'a_gerar' check (status in ('a_gerar', 'gerado', 'aprovado', 'inativo')),
  ordem int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_reference_photos_tipo on public.reference_photos (tipo_peca);
create index if not exists idx_reference_photos_categoria on public.reference_photos (categoria, data_comemorativa);

-- Row Level Security -------------------------------------------------------
-- Não há geração de imagem nem upload dentro da plataforma: a assinante
-- copia o prompt mestre e gera a foto na ferramenta de IA pessoal dela
-- (Gemini, ChatGPT etc.), fora daqui. Por isso não existe tabela de
-- "generations" — o catálogo é só leitura.

alter table public.members enable row level security;
alter table public.reference_photos enable row level security;

-- members: cada usuária só enxerga a própria linha (comparando e-mail do JWT)
drop policy if exists "members_select_own" on public.members;
create policy "members_select_own" on public.members
  for select using (email = auth.jwt() ->> 'email');

-- reference_photos: qualquer usuária autenticada e com assinatura ativa pode ler o catálogo aprovado
drop policy if exists "reference_photos_select_active_members" on public.reference_photos;
create policy "reference_photos_select_active_members" on public.reference_photos
  for select using (
    status = 'aprovado'
    and exists (
      select 1 from public.members m
      where m.email = auth.jwt() ->> 'email'
        and m.status = 'active'
    )
  );

-- Observação: a rota de servidor do webhook Hotmart usa a service_role key,
-- que ignora RLS — as políticas acima protegem o acesso direto do client
-- (browser).
