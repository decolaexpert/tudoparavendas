# Photo Studio TPV

Ferramenta de fotos de semijoias com IA do Clube Tudo para Vendas.
A cliente escolhe um estilo de foto no catálogo, envia a foto da peça real
dela, e o sistema gera uma nova fotografia profissional preservando 100% da
fidelidade da peça (via Gemini / modelo de imagem "Nano Banana").

## Stack

- **Next.js 15** (App Router) + TypeScript + Tailwind CSS
- **Supabase** — Auth (magic link), Postgres, Storage
- **Gemini API** (`gemini-2.5-flash-image`) — geração/edição de imagem
- **Hotmart** — checkout e liberação de acesso via webhook

## Como o acesso funciona

1. Cliente compra o Clube Tudo para Vendas na Hotmart.
2. A Hotmart dispara um webhook (`PURCHASE_APPROVED`) para
   `/api/webhooks/hotmart`, que grava/atualiza uma linha em `members` com
   `status = 'active'`, usando o e-mail do comprador.
3. A cliente acessa `studio.tudoparavendas.com.br/login`, digita o mesmo
   e-mail da compra e recebe um magic link (Supabase Auth) — sem senha.
4. Ao logar, o sistema confere se existe um `member` com aquele e-mail e
   `status = 'active'`. Se não existir, mostra a tela "assinatura não
   encontrada".
5. Reembolso/chargeback na Hotmart dispara o mesmo webhook com evento de
   cancelamento, e o acesso é revogado automaticamente (`status = 'refunded'`).

## Setup local

```bash
npm install
cp .env.example .env.local   # preencha as chaves (ver abaixo)
```

### 1. Supabase

1. Crie um projeto em [supabase.com](https://supabase.com).
2. Vá em **SQL Editor**, cole e rode `supabase/migrations/0001_init.sql`.
3. Rode também `supabase/seed.sql` (importa os 134 prompts da planilha —
   ver "Fluxo de conteúdo" abaixo).
4. Em **Storage**, crie dois buckets públicos: `uploads` (fotos que as
   clientes enviam) e `generated` (fotos geradas pela IA).
5. Em **Project Settings > API**, copie `URL`, `anon public key` e
   `service_role key` para o `.env.local`.
6. Em **Authentication > Providers**, confirme que o login por e-mail
   (magic link / OTP) está habilitado.
7. Em **Authentication > URL Configuration**, adicione
   `https://studio.tudoparavendas.com.br/auth/callback` (e a URL local,
   `http://localhost:3000/auth/callback`, para testes).

### 2. Gemini

1. Gere uma chave em [aistudio.google.com/apikey](https://aistudio.google.com/apikey).
2. Cole em `GEMINI_API_KEY`.

### 3. Hotmart

1. No painel da Hotmart, vá em **Ferramentas > Webhook** e cadastre:
   - URL: `https://studio.tudoparavendas.com.br/api/webhooks/hotmart`
   - Eventos: `PURCHASE_APPROVED`, `PURCHASE_COMPLETE`,
     `PURCHASE_REFUNDED`, `PURCHASE_CHARGEBACK`, `PURCHASE_CANCELED`,
     `PURCHASE_PROTEST`, `SUBSCRIPTION_CANCELLATION`
2. Copie o **Hottok** gerado e cole em `HOTMART_WEBHOOK_TOKEN`.

### Rodar

```bash
npm run dev
```

## Fluxo de conteúdo (fotos-mestre)

O catálogo é alimentado pela planilha `content/Photo_Studio_TPV_Biblioteca_de_Prompts.xlsx`
(134 combinações de tipo de peça × pose × data comemorativa, cada uma com
um prompt mestre pronto).

1. Time produz a foto-mestre no Gemini usando o prompt da planilha +
   uma foto de peça genérica (ver aba "Instruções" da planilha).
2. Sobe a imagem aprovada no bucket `generated` do Supabase (ou qualquer
   storage público) e copia a URL pública.
3. No Supabase, atualiza a linha correspondente em `reference_photos`
   (encontre pelo `nome_referencia`, que bate com o nome sugerido na
   planilha):
   ```sql
   update public.reference_photos
   set thumbnail_url = 'https://.../sua-imagem.jpg',
       status = 'aprovado'
   where nome_referencia = 'brinco_still-branco-packshot';
   ```
4. Só entram no catálogo (`/catalogo`) referências com `status = 'aprovado'`.

Se a planilha for editada (novos prompts, correções), rode de novo:

```bash
python3 scripts/seed_from_xlsx.py
```

Isso regenera `supabase/seed.sql` — o `on conflict (nome_referencia) do
nothing` garante que linhas já existentes (e já aprovadas) não são
sobrescritas.

### Testar a UI sem fotos-mestre prontas

Sem nenhuma linha `aprovado`, o catálogo fica vazio. Pra testar o fluxo
completo localmente, aprove algumas linhas manualmente com um placeholder:

```sql
update public.reference_photos
set status = 'aprovado'
where nome_referencia in ('brinco_still-branco-packshot', 'colar_lifestyle-com-modelo');
```

(o app já cai para `/placeholder-reference.svg` quando `thumbnail_url` é nulo)

## Estrutura

```
src/
  app/
    catalogo/           galeria de referências com filtros
    gerar/[id]/          upload da peça + geração
    minhas-fotos/        histórico de gerações da cliente
    login/                magic link
    api/webhooks/hotmart/ liberação/revogação de acesso
    api/generate/         chama o Gemini e salva o resultado
  components/
  lib/
    supabase/             clientes browser/server/admin
    gemini.ts             wrapper da API de geração de imagem
    member.ts             checagem de assinatura ativa
supabase/
  migrations/0001_init.sql  schema (members, reference_photos, generations)
  seed.sql                  gerado a partir da planilha de prompts
content/
  Photo_Studio_TPV_Biblioteca_de_Prompts.xlsx
scripts/
  seed_from_xlsx.py
```

## Deploy

Recomendado: Vercel, apontando o subdomínio
`studio.tudoparavendas.com.br` para o projeto. Configure as mesmas
variáveis de ambiente do `.env.local` no painel da Vercel.
