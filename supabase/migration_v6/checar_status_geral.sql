-- Visão geral: quantas fotos existem x quantas estão aprovadas, por categoria
select
  case
    when categoria = 'data_comemorativa' then 'Datas Comemorativas'
    when tipo_peca in ('Expositor', 'Lifestyle', 'Peças em Você') then tipo_peca
    else 'Evergreen (produto)'
  end as categoria_visivel,
  count(*) as total,
  count(*) filter (where status = 'aprovado') as aprovadas,
  count(*) filter (where status != 'aprovado') as pendentes
from public.reference_photos
group by 1
order by 1;

-- Detalhe: quais nome_referencia ainda não estão aprovados (se houver)
select categoria, tipo_peca, nome_referencia, status
from public.reference_photos
where status != 'aprovado'
order by categoria, tipo_peca, ordem;
