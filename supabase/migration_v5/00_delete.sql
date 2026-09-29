-- Migração v5: remove Relógio (categoria descontinuada) e a
-- estrutura antiga de Datas Comemorativas (nenhuma dessas linhas
-- chegou a ser aprovada, então é seguro apagar e recriar).

delete from public.reference_photos where nome_referencia like 'relogio\_%' escape '\';
delete from public.reference_photos where categoria = 'data_comemorativa';

