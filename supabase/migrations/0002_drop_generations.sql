-- Remove a tabela de gerações: a plataforma não gera nem armazena mais
-- fotos — a assinante copia o prompt mestre e gera na ferramenta de IA
-- pessoal dela (Gemini, ChatGPT etc.), fora daqui.
--
-- Rode este arquivo no SQL Editor do Supabase se o projeto já tinha rodado
-- o 0001_init.sql antigo (com a tabela generations).

drop table if exists public.generations cascade;
