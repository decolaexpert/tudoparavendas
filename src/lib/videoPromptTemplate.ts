// Template do "Studio Video" — monta o prompt mestre de vídeo UGC de joias
// substituindo os campos entre {{chaves}} pelas escolhas da usuária no
// formulário. O texto das regras/instruções é mantido palavra por palavra
// do prompt mestre original — só os campos de preenchimento viram tokens.

export type VideoFieldOption = { label: string; value: string };

export type VideoField = {
  id: string;
  label: string;
  options: VideoFieldOption[];
};

export type VideoFieldGroup = {
  title: string;
  fields: VideoField[];
};

export const FALA_FIELD_ID = "FALA";
export const OBSERVACAO_FIELD_ID = "OBSERVACAO";

export const FIELD_GROUPS: VideoFieldGroup[] = [
  {
    title: "As joias da sua foto",
    fields: [
      {
        id: "JOIAS_ANEXADAS",
        label: "O que você vai anexar",
        options: [
          { label: "Brinco", value: "Um par de brincos, visíveis com clareza na fotografia anexada." },
          { label: "Colar", value: "Um colar, visível com clareza na fotografia anexada." },
          { label: "Colar Longo", value: "Um colar longo, visível com clareza na fotografia anexada." },
          { label: "Choker/Gargantilha", value: "Uma choker/gargantilha, visível com clareza na fotografia anexada." },
          { label: "Anel", value: "Um anel, visível com clareza na fotografia anexada." },
          { label: "Aliança", value: "Uma aliança (ou par de alianças), visível com clareza na fotografia anexada." },
          { label: "Pulseira", value: "Uma pulseira, visível com clareza na fotografia anexada." },
          { label: "Bracelete/Bangle", value: "Um bracelete/bangle, visível com clareza na fotografia anexada." },
          { label: "Tornozeleira", value: "Uma tornozeleira, visível com clareza na fotografia anexada." },
          { label: "Corrente Masculina", value: "Uma corrente masculina, visível com clareza na fotografia anexada." },
          { label: "Pingente", value: "Um pingente, visível com clareza na fotografia anexada." },
          { label: "Broche", value: "Um broche, visível com clareza na fotografia anexada." },
          { label: "Conjunto (colar + brinco)", value: "Um conjunto de colar e brinco, ambos visíveis com clareza na fotografia anexada." },
          { label: "Conjunto (anel + pulseira)", value: "Um conjunto de anel e pulseira, ambos visíveis com clareza na fotografia anexada." },
          { label: "Mais de uma peça diferente", value: "Mais de uma peça, de tipos diferentes, todas visíveis com clareza na fotografia anexada." },
        ],
      },
      {
        id: "QUANTIDADE",
        label: "Quantidade exata de unidades",
        options: [
          { label: "1 peça", value: "1 unidade." },
          { label: "2 peças (par)", value: "2 unidades (par)." },
          { label: "3 peças", value: "3 unidades." },
          { label: "4 peças", value: "4 unidades." },
          { label: "Conjunto completo (todas as peças da foto)", value: "A quantidade exata de todas as peças presentes na fotografia anexada, sem adicionar ou remover nenhuma." },
        ],
      },
      {
        id: "CARACTERISTICAS",
        label: "Características visuais",
        options: [
          { label: "Dourado liso e brilhante", value: "Metal dourado liso e brilhante, sem pedras." },
          { label: "Dourado cravejado com pedras", value: "Metal dourado cravejado com pedras visíveis." },
          { label: "Prateado liso e brilhante", value: "Metal prateado liso e brilhante, sem pedras." },
          { label: "Prateado cravejado com pedras", value: "Metal prateado cravejado com pedras visíveis." },
          { label: "Ouro rosé", value: "Metal em tom ouro rosé, acabamento liso e brilhante." },
          { label: "Combinação dourado e prateado", value: "Combinação de metal dourado e prateado na mesma peça." },
          { label: "Com pérolas", value: "Peça com pérolas naturais ou sintéticas em destaque." },
          { label: "Com pedras coloridas em destaque", value: "Peça com pedras coloridas em destaque como ponto focal." },
        ],
      },
      {
        id: "COMO_USAR",
        label: "Como a modelo deve usar/segurar",
        options: [
          { label: "Na orelha (brinco)", value: "Usada na orelha, visível com clareza." },
          { label: "No pescoço (colar/corrente)", value: "Usada no pescoço, visível com clareza." },
          { label: "No pulso (pulseira/bracelete)", value: "Usada no pulso, visível com clareza." },
          { label: "No dedo (anel)", value: "Usada no dedo, visível com clareza." },
          { label: "Segurando nas mãos, próximo ao rosto", value: "Segurada delicadamente nas mãos, próximo ao rosto." },
          { label: "Combinação (parte no corpo, parte nas mãos)", value: "Parte das peças usadas diretamente no corpo e parte seguradas delicadamente nas mãos." },
        ],
      },
      {
        id: "PECA_PRINCIPAL",
        label: "Peça principal a destacar",
        options: [
          { label: "A única peça anexada", value: "A única peça presente na fotografia anexada." },
          { label: "A peça maior/mais chamativa", value: "A peça de maior destaque visual entre as anexadas." },
          { label: "O colar", value: "O colar, entre as peças anexadas." },
          { label: "O brinco", value: "O brinco, entre as peças anexadas." },
          { label: "O anel", value: "O anel, entre as peças anexadas." },
          { label: "A pulseira", value: "A pulseira, entre as peças anexadas." },
          { label: "Todas com destaque igual", value: "Todas as peças anexadas, com destaque visual equilibrado entre elas." },
        ],
      },
    ],
  },
  {
    title: "A modelo",
    fields: [
      {
        id: "SEXO",
        label: "Sexo/apresentação visual",
        options: [
          { label: "Mulher", value: "Mulher." },
          { label: "Homem", value: "Homem." },
          { label: "Outra apresentação", value: "Apresentação visual andrógina/neutra." },
        ],
      },
      {
        id: "APARENCIA",
        label: "Aparência e nacionalidade visual",
        options: [
          { label: "Brasileira, aparência natural", value: "Mulher brasileira com aparência natural, sem exageros de produção." },
          { label: "Brasileira morena", value: "Mulher brasileira morena, aparência natural." },
          { label: "Brasileira de pele clara", value: "Mulher brasileira de pele clara, aparência natural." },
          { label: "Brasileira negra", value: "Mulher brasileira negra, aparência natural." },
          { label: "Brasileiro, aparência natural", value: "Homem brasileiro com aparência natural, sem exageros de produção." },
        ],
      },
      {
        id: "IDADE",
        label: "Idade aparente",
        options: [
          { label: "18–24 anos", value: "Entre 18 e 24 anos." },
          { label: "25–34 anos", value: "Entre 25 e 34 anos." },
          { label: "35–44 anos", value: "Entre 35 e 44 anos." },
          { label: "45+ anos", value: "45 anos ou mais." },
        ],
      },
      {
        id: "TOM_PELE",
        label: "Tom de pele",
        options: [
          { label: "Muito clara", value: "Muito clara." },
          { label: "Clara", value: "Clara." },
          { label: "Morena clara", value: "Morena clara." },
          { label: "Morena", value: "Morena." },
          { label: "Negra", value: "Negra." },
        ],
      },
      {
        id: "ROSTO",
        label: "Características do rosto",
        options: [
          { label: "Oval, traços suaves, maquiagem leve", value: "Rosto oval, traços suaves, maquiagem leve e natural." },
          { label: "Alongado, maquiagem natural", value: "Rosto alongado, maquiagem natural." },
          { label: "Redondo, maquiagem discreta", value: "Rosto redondo, maquiagem discreta." },
          { label: "Traços marcantes, maquiagem sofisticada", value: "Traços marcantes, maquiagem sofisticada." },
        ],
      },
      {
        id: "CABELO",
        label: "Cabelo",
        options: [
          { label: "Liso e solto, altura dos ombros", value: "Liso, solto, na altura dos ombros." },
          { label: "Cacheado e volumoso, solto", value: "Cacheado, volumoso, solto." },
          { label: "Ondulado, preso em coque baixo", value: "Ondulado, preso em coque baixo." },
          { label: "Liso, comprido e solto", value: "Liso, comprido, solto." },
          { label: "Cacheado, preso em rabo de cavalo", value: "Cacheado, preso em rabo de cavalo." },
        ],
      },
      {
        id: "VESTUARIO",
        label: "Vestuário",
        options: [
          { label: "Blusa branca básica, decote discreto", value: "Blusa branca básica, decote discreto." },
          { label: "Vestido preto elegante, decote em V", value: "Vestido preto elegante, decote em V." },
          { label: "Camisa de seda nude", value: "Camisa de seda em tom nude." },
          { label: "Blusa de alcinha, tom neutro", value: "Blusa de alcinha, tom neutro." },
          { label: "Roupa casual chique, tom pastel", value: "Roupa casual chique, tom pastel." },
        ],
      },
      {
        id: "UNHAS",
        label: "Unhas",
        options: [
          { label: "Curtas, naturais, esmalte nude", value: "Curtas, formato natural, esmalte nude." },
          { label: "Médias, amendoadas, esmalte vermelho", value: "Médias, formato amendoado, esmalte vermelho." },
          { label: "Curtas, esmalte vinho", value: "Curtas, esmalte vinho." },
          { label: "Compridas, quadradas, esmalte nude", value: "Compridas, formato quadrado, esmalte nude." },
        ],
      },
      {
        id: "PERSONALIDADE",
        label: "Personalidade e expressão",
        options: [
          { label: "Elegante e discreta", value: "Elegante e discreta." },
          { label: "Simpática e espontânea", value: "Simpática e espontânea." },
          { label: "Sofisticada e confiante", value: "Sofisticada e confiante." },
          { label: "Alegre e descontraída", value: "Alegre e descontraída." },
        ],
      },
    ],
  },
  {
    title: "Ambiente e cenário",
    fields: [
      {
        id: "LOCAL",
        label: "Local da gravação",
        options: [
          { label: "Quarto", value: "Quarto." },
          { label: "Closet", value: "Closet." },
          { label: "Sala", value: "Sala." },
          { label: "Camarim", value: "Camarim." },
          { label: "Loja de joias", value: "Loja de joias." },
          { label: "Estúdio", value: "Estúdio." },
          { label: "Banheiro sofisticado", value: "Banheiro sofisticado." },
        ],
      },
      {
        id: "ESTILO_AMBIENTE",
        label: "Estilo do ambiente",
        options: [
          { label: "Minimalista", value: "Minimalista." },
          { label: "Luxuoso", value: "Luxuoso." },
          { label: "Moderno", value: "Moderno." },
          { label: "Aconchegante", value: "Aconchegante." },
          { label: "Natural", value: "Natural." },
        ],
      },
      {
        id: "CORES_CENARIO",
        label: "Cores predominantes do cenário",
        options: [
          { label: "Tons neutros (branco, bege, cinza)", value: "Tons neutros — branco, bege e cinza." },
          { label: "Tons terrosos (marrom, caramelo)", value: "Tons terrosos — marrom e caramelo." },
          { label: "Tons claros e pastel", value: "Tons claros e pastel." },
          { label: "Preto e dourado", value: "Preto e dourado." },
          { label: "Branco e dourado", value: "Branco e dourado." },
        ],
      },
      {
        id: "ELEMENTOS_FUNDO",
        label: "Elementos de fundo",
        options: [
          { label: "Nenhum elemento, ambiente limpo", value: "Nenhum elemento adicional, ambiente limpo." },
          { label: "Espelho desfocado ao fundo", value: "Um espelho desfocado ao fundo." },
          { label: "Móveis discretos desfocados", value: "Móveis discretos e desfocados ao fundo." },
          { label: "Plantas decorativas desfocadas", value: "Plantas decorativas desfocadas ao fundo." },
          { label: "Prateleira pessoal desfocada", value: "Uma prateleira com itens pessoais, desfocada ao fundo." },
        ],
      },
      {
        id: "PROFUNDIDADE",
        label: "Profundidade de campo",
        options: [
          { label: "Fundo nítido", value: "Fundo nítido." },
          { label: "Fundo levemente desfocado", value: "Fundo levemente desfocado." },
          { label: "Fundo desfocado", value: "Fundo desfocado." },
        ],
      },
    ],
  },
  {
    title: "Iluminação e aparência fotográfica",
    fields: [
      {
        id: "TEMPERATURA_LUZ",
        label: "Temperatura da luz",
        options: [
          { label: "Quente", value: "Quente." },
          { label: "Neutra", value: "Neutra." },
          { label: "Fria", value: "Fria." },
        ],
      },
      {
        id: "FONTE_LUZ",
        label: "Fonte de iluminação",
        options: [
          { label: "Luz natural de janela", value: "Luz natural de janela." },
          { label: "Softbox", value: "Softbox." },
          { label: "Iluminação de estúdio", value: "Iluminação de estúdio." },
          { label: "Combinação natural + artificial", value: "Combinação de luz natural com luz artificial." },
        ],
      },
      {
        id: "INTENSIDADE",
        label: "Intensidade",
        options: [
          { label: "Suave", value: "Suave." },
          { label: "Moderada", value: "Moderada." },
          { label: "Intensa", value: "Intensa." },
        ],
      },
      {
        id: "DIRECAO_LUZ",
        label: "Direção da luz",
        options: [
          { label: "Frontal", value: "Frontal." },
          { label: "Lateral", value: "Lateral." },
          { label: "Difusa", value: "Difusa." },
        ],
      },
      {
        id: "CONTRASTE",
        label: "Contraste",
        options: [
          { label: "Baixo", value: "Baixo." },
          { label: "Médio", value: "Médio." },
          { label: "Alto", value: "Alto." },
        ],
      },
      {
        id: "ESTETICA",
        label: "Estética final",
        options: [
          { label: "Natural", value: "Natural." },
          { label: "Premium", value: "Premium." },
          { label: "Cinematográfica", value: "Cinematográfica." },
          { label: "Editorial", value: "Editorial." },
          { label: "Comercial", value: "Comercial." },
        ],
      },
    ],
  },
  {
    title: "Direção de câmera e movimentos",
    fields: [
      {
        id: "ENQUADRAMENTO_INICIAL",
        label: "Enquadramento inicial",
        options: [
          { label: "Plano médio", value: "Plano médio." },
          { label: "Close do rosto", value: "Close do rosto." },
          { label: "Close da joia", value: "Close da joia." },
          { label: "Modelo com produto em mãos", value: "Modelo com o produto em mãos." },
        ],
      },
      {
        id: "MOVIMENTO_CAMERA",
        label: "Movimento de câmera",
        options: [
          { label: "Câmera estática", value: "Câmera estática." },
          { label: "Leve movimento de mão", value: "Leve movimento de mão." },
          { label: "Aproximação suave", value: "Aproximação suave." },
          { label: "Leve rotação ao redor do produto", value: "Leve rotação ao redor do produto." },
        ],
      },
      {
        id: "DEMONSTRACAO",
        label: "Como demonstrar o produto",
        options: [
          { label: "Tocando delicadamente a peça usada no corpo", value: "A modelo toca delicadamente a peça usada no corpo, revelando seus detalhes." },
          { label: "Girando a joia levemente entre os dedos", value: "A modelo gira levemente a joia entre os dedos, revelando seus detalhes." },
          { label: "Aproximando a peça da câmera com a mão", value: "A modelo aproxima delicadamente a peça da câmera com a mão." },
          { label: "Ajeitando o cabelo pra revelar a peça", value: "A modelo ajeita o cabelo delicadamente para revelar a peça." },
        ],
      },
      {
        id: "ENQUADRAMENTO_FINAL",
        label: "Enquadramento final",
        options: [
          { label: "Close da joia", value: "Close da joia." },
          { label: "Modelo olhando para a câmera", value: "Modelo olhando diretamente para a câmera." },
          { label: "Modelo sorrindo com a joia em destaque", value: "Modelo sorrindo suavemente, com a joia em destaque." },
        ],
      },
    ],
  },
  {
    title: "Fala da modelo",
    fields: [
      {
        id: "VOZ",
        label: "Características da voz",
        options: [
          { label: "Feminina, suave e jovem", value: "Feminina, suave e jovem." },
          { label: "Feminina, confiante e sofisticada", value: "Feminina, confiante e sofisticada." },
          { label: "Masculina, suave e natural", value: "Masculina, suave e natural." },
          { label: "Masculina, confiante e grave", value: "Masculina, confiante e grave." },
        ],
      },
      {
        id: "ESTILO_APRESENTACAO",
        label: "Estilo de apresentação",
        options: [
          { label: "Conversa espontânea", value: "Conversa espontânea." },
          { label: "Recomendação", value: "Recomendação." },
          { label: "Descoberta de produto", value: "Descoberta de produto." },
          { label: "Demonstração elegante", value: "Demonstração elegante." },
        ],
      },
    ],
  },
  {
    title: "Áudio e trilha sonora",
    fields: [
      {
        id: "TRILHA",
        label: "Trilha sonora",
        options: [
          { label: "Sem música", value: "Sem música." },
          { label: "Música instrumental suave", value: "Música instrumental suave, em volume baixo." },
        ],
      },
      {
        id: "SOM_AMBIENTE",
        label: "Som ambiente",
        options: [
          { label: "Silêncio controlado", value: "Silêncio controlado." },
          { label: "Ambiente natural", value: "Ambiente natural, discreto." },
        ],
      },
    ],
  },
];

export const VIDEO_PROMPT_TEMPLATE = `PROMPT MESTRE — VÍDEO UGC HIPER-REALISTA DE JOIAS | YOUTUBE CREATE

1. OBJETIVO DO VÍDEO

Crie um vídeo publicitário UGC (User Generated Content) extremamente realista, com aparência de gravação autêntica feita por uma criadora de conteúdo brasileira usando um smartphone de alta qualidade.

A mulher deve apresentar as joias das fotografias anexadas como se estivesse mostrando seus próprios produtos para a câmera, com movimentos naturais, gestos delicados e expressões espontâneas.

O objetivo é valorizar a beleza real das joias, evidenciando seus detalhes, acabamento, proporções, brilho original e aparência física, sem qualquer alteração no produto.

O vídeo deve transmitir confiança, elegância, proximidade e desejo de compra, sem parecer uma animação, um vídeo artificial ou uma propaganda excessivamente produzida.

Duração: 8 segundos.
Formato: vertical, 9:16, resolução 1080 × 1920 ou superior, se disponível.
Estilo: UGC hiper-realista, fotografia comercial natural, qualidade premium e aparência de vídeo gravado com smartphone.
Idioma da fala: português brasileiro (pt-BR).
Público: consumidores de joias e acessórios.

⸻

2. REGRA ABSOLUTA: FIDELIDADE TOTAL ÀS JOIAS ANEXADAS

As fotografias anexadas são a referência visual exclusiva e prioritária para a reprodução dos produtos.

Antes de gerar o vídeo, analise cuidadosamente todas as fotografias e identifique cada peça e seus componentes físicos visíveis.

É expressamente proibido modificar, inventar, acrescentar, remover, substituir, duplicar ou reconstruir livremente qualquer elemento das joias.

Preserve rigorosamente:

* Cor original: mantenha exatamente a tonalidade real do metal, das pedras, das pérolas, dos cristais, do esmalte e de qualquer outro material visível. Não transforme ouro amarelo em ouro rosé, prata em dourado, pedras claras em escuras ou vice-versa.
* Formato original: preserve o desenho, a silhueta, a geometria, as curvas, os contornos, os elos, os fechos, as garras, os encaixes e todos os detalhes estruturais.
* Tamanho e proporção: reproduza as dimensões relativas e a escala visual da peça original. Não aumente pingentes, pedras, argolas, correntes ou outros componentes para torná-los mais chamativos.
* Quantidade exata: mantenha exatamente a quantidade de peças e componentes presentes nas fotografias. Um par de brincos corresponde a duas unidades. Não duplique, clone, complete ou elimine peças.
* Pedras e ornamentos: preserve a quantidade, a posição, o formato, o tamanho, a cor e a disposição de cada pedra, pérola, cristal ou elemento decorativo.
* Acabamento: preserve a textura, o polimento, o brilho, o relevo, os detalhes gravados e as características reais da superfície.
* Estrutura: não altere elos, espessuras, fechos, hastes, tarraxas, correntes, argolas, pingentes, articulações ou encaixes.
* Identidade visual: não acrescente logotipos, inscrições, símbolos, gravações ou elementos que não estejam efetivamente presentes no produto original.

Não crie uma versão inspirada na joia. Reproduza a própria joia fotografada, respeitando suas características reais.

Tratamento de imagens e perspectiva

Utilize as fotografias anexadas como referência direta para a aparência do produto. Não use referências genéricas de joias semelhantes para completar ou substituir detalhes.

Se houver mais de uma fotografia da mesma peça, utilize-as em conjunto para compreender seus ângulos e características, sem confundir peças diferentes.

Não invente detalhes ocultos, partes traseiras, fechos ou estruturas que não possam ser identificados nas referências.

Se algum detalhe não puder ser reproduzido com segurança, prefira um enquadramento que preserve a parte visível e fiel da peça, em vez de inventar uma solução.

O brilho deve ser fisicamente plausível e compatível com a iluminação da cena. Não adicione reflexos, partículas luminosas, brilhos artificiais ou efeitos que alterem a aparência do material.

A modelo, o cenário, a roupa, a câmera e a iluminação podem ser gerados. A identidade visual das joias não pode ser reinventada.

⸻

3. DESCRIÇÃO EXATA DAS JOIAS ANEXADAS

Joias anexadas:
{{JOIAS_ANEXADAS}}

Quantidade exata de unidades:
{{QUANTIDADE}}

Características visuais confirmadas:
{{CARACTERISTICAS}}

Como a modelo deverá usar ou segurar as joias:
{{COMO_USAR}}

Peça principal a destacar:
{{PECA_PRINCIPAL}}

Não presuma características que não estejam visíveis nas fotografias ou explicitamente informadas neste campo.

⸻

4. CARACTERÍSTICAS DA MODELO

Sexo/apresentação visual:
{{SEXO}}

Aparência e nacionalidade visual:
{{APARENCIA}}

Idade aparente:
{{IDADE}}

Tom de pele:
{{TOM_PELE}}

Características do rosto:
{{ROSTO}}

Cabelo:
{{CABELO}}

Vestuário:
{{VESTUARIO}}

Unhas:
{{UNHAS}}

Personalidade e expressão:
{{PERSONALIDADE}}

A modelo deve ter aparência humana convincente, pele com textura natural, mãos anatomicamente corretas, dedos proporcionais, unhas realistas e movimentos suaves.

Não aplique filtros de beleza excessivos. Evite pele artificialmente lisa, olhos exagerados, expressões congeladas ou movimentos robóticos.

A modelo deve manter a mesma identidade visual durante todo o vídeo, sem alterações repentinas no rosto, no cabelo, na roupa ou nas mãos.

⸻

5. AMBIENTE E CENÁRIO

Local da gravação:
{{LOCAL}}

Estilo do ambiente:
{{ESTILO_AMBIENTE}}

Cores predominantes do cenário:
{{CORES_CENARIO}}

Elementos de fundo:
{{ELEMENTOS_FUNDO}}

Profundidade de campo:
{{PROFUNDIDADE}}

O ambiente deve complementar o produto sem competir com ele. Evite elementos visuais excessivos, objetos flutuantes, textos aleatórios, marcas inventadas ou qualquer elemento que distraia da joia.

O cenário pode ser sofisticado, mas deve manter a naturalidade de um vídeo UGC real.

⸻

6. ILUMINAÇÃO E APARÊNCIA FOTOGRÁFICA

Temperatura da luz:
{{TEMPERATURA_LUZ}}

Fonte de iluminação:
{{FONTE_LUZ}}

Intensidade:
{{INTENSIDADE}}

Direção da luz:
{{DIRECAO_LUZ}}

Contraste:
{{CONTRASTE}}

Estética final:
{{ESTETICA}}

A iluminação deve revelar os detalhes das joias sem modificar suas cores reais. A temperatura de cor da cena não pode transformar visualmente o metal ou as pedras em materiais de tonalidades diferentes das fotografias de referência.

Evite áreas estouradas, reflexos que escondam os detalhes, sombras que deformem o produto e efeitos de brilho artificiais.

Preserve a textura realista da pele, dos tecidos e dos materiais.

⸻

7. DIREÇÃO DE CÂMERA E MOVIMENTOS

O vídeo deve parecer uma gravação real de uma criadora de conteúdo apresentando uma joia para seus seguidores.

Enquadramento inicial:
{{ENQUADRAMENTO_INICIAL}}

Movimento de câmera:
{{MOVIMENTO_CAMERA}}

Forma de demonstrar o produto:
{{DEMONSTRACAO}}

Enquadramento final:
{{ENQUADRAMENTO_FINAL}}

A câmera deve valorizar os detalhes sem distorcer a perspectiva ou modificar as proporções do produto.

A modelo deve executar movimentos pequenos, lentos e controlados. Se segurar a joia, deve fazê-lo com delicadeza, sem cobrir os principais detalhes com os dedos.

Se estiver usando a joia, ela deve permanecer corretamente posicionada no corpo, sem atravessar a pele, flutuar, mudar de tamanho, deformar-se ou trocar de formato entre os quadros.

Os closes devem mostrar os detalhes realmente presentes na referência. Não invente novas pedras, texturas, encaixes ou partes durante a aproximação.

Evite cortes excessivos. Em apenas oito segundos, priorize um movimento principal e uma demonstração clara do produto.

⸻

8. ROTEIRO VISUAL PARA 8 SEGUNDOS

0,0 a 2,0 segundos — Apresentação e atenção inicial

A modelo aparece de maneira natural, já usando ou segurando a joia conforme as instruções. O produto deve estar visível desde o início ou surgir imediatamente no enquadramento.

A expressão é espontânea e convidativa, sem gestos exagerados.

2,0 a 5,5 segundos — Demonstração dos detalhes

A câmera se aproxima suavemente ou a modelo movimenta delicadamente a joia para revelar seu formato, acabamento e detalhes reais.

O movimento deve ser lento o suficiente para que o espectador reconheça a peça, mas não tão lento que pareça artificial.

5,5 a 8,0 segundos — Destaque final

A modelo mantém a joia em posição favorável à câmera, com enquadramento limpo e boa visibilidade.

Finalize com uma expressão natural e confiante. Não altere o produto, não acrescente elementos gráficos e não introduza outra joia no final.

Adapte os tempos à ação escolhida, mantendo o vídeo dentro de oito segundos.

⸻

9. FALA DA MODELO EM PORTUGUÊS BRASILEIRO

Fala exata:
{{FALA}}

A fala deve ser pronunciada em português brasileiro natural, com sotaque brasileiro autêntico, dicção clara e entonação espontânea de uma criadora de conteúdo apresentando um produto.

Duração máxima da fala: 8 segundos.

Não traduza, reformule ou acrescente palavras à frase fornecida. Não invente informações sobre material, composição, banho, pedras, preço, durabilidade, garantia ou propriedades da joia.

A sincronia labial deve acompanhar precisamente as palavras pronunciadas. A voz deve combinar com a aparência e a idade da modelo.

Se a fala não preencher os oito segundos, mantenha pausas naturais e continue a demonstração visual, sem adicionar frases.

Características da voz:
{{VOZ}}

Estilo de apresentação:
{{ESTILO_APRESENTACAO}}

⸻

10. ÁUDIO E TRILHA SONORA

Trilha sonora:
{{TRILHA}}

Som ambiente:
{{SOM_AMBIENTE}}

A voz deve ser nítida, natural e estar em primeiro plano. Caso exista música, ela deve permanecer em volume baixo, sem competir com a fala.

Não adicione vozes de outras pessoas, diálogos improvisados, sons artificiais de joias ou efeitos sonoros que não tenham sido solicitados.

⸻

11. RESTRIÇÕES NEGATIVAS OBRIGATÓRIAS

Não modificar as joias.
Não alterar suas cores, formato, tamanho, espessura ou proporções.
Não acrescentar pedras, pérolas, pingentes, correntes, elos, fechos ou ornamentos.
Não remover nenhum componente original.
Não duplicar, clonar ou completar conjuntos.
Não transformar uma peça em outra.
Não substituir as joias por versões genéricas semelhantes.
Não inventar detalhes ocultos.
Não deformar o produto durante os movimentos.
Não permitir que a joia desapareça ou mude de aparência entre quadros.
Não gerar mãos deformadas, dedos extras, unhas distorcidas ou articulações impossíveis.
Não permitir que as mãos atravessem a joia ou que a peça flutue.
Não usar reflexos artificiais para esconder diferenças.
Não adicionar textos, preços, marcas-d'água, logotipos ou embalagens não solicitadas.
Não adicionar legendas automáticas, a menos que sejam solicitadas separadamente.
Não gerar transições que alterem a identidade visual do produto.
Não exagerar a saturação, a nitidez, o brilho ou o contraste a ponto de alterar a aparência da joia.

⸻

12. INSTRUÇÃO FINAL DE PRIORIDADE

A prioridade número um é preservar a identidade visual e física de cada joia das fotografias anexadas.

A prioridade número dois é garantir que a modelo apresente o produto de forma natural, elegante e convincente.

A prioridade número três é criar uma experiência audiovisual atraente, com iluminação adequada, enquadramento profissional e fala em português brasileiro.

Em caso de conflito entre um efeito visual bonito e a fidelidade ao produto, escolha sempre a fidelidade ao produto.

Não improvise, não embeleze artificialmente e não redesenhe as joias. Utilize as referências fornecidas para preservar sua aparência.

Gere o vídeo UGC vertical de oito segundos seguindo todas as instruções acima e respeitando os campos preenchidos pelo usuário.{{OBSERVACAO_SECTION}}`;

export function buildVideoPrompt(values: Record<string, string>, observacao: string): string {
  let result = VIDEO_PROMPT_TEMPLATE;
  for (const group of FIELD_GROUPS) {
    for (const field of group.fields) {
      const token = `{{${field.id}}}`;
      const value = values[field.id] ?? "";
      result = result.split(token).join(value);
    }
  }
  result = result.split(`{{${FALA_FIELD_ID}}}`).join(values[FALA_FIELD_ID] ?? "");

  const observacaoTrim = observacao.trim();
  const observacaoSection = observacaoTrim
    ? `\n\n⸻\n\n13. OBSERVAÇÃO ADICIONAL DA USUÁRIA\n\n${observacaoTrim}`
    : "";
  result = result.split("{{OBSERVACAO_SECTION}}").join(observacaoSection);

  return result;
}
