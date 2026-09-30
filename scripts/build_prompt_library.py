# -*- coding: utf-8 -*-
"""
Gera content/Photo_Studio_TPV_Biblioteca_de_Prompts.xlsx — v2.

Reescrito a partir de prompts reais extraídos do concorrente (Studio
Pablita), aplicando os padrões observados: física de equilíbrio/gravidade,
vocabulário real de câmera e iluminação de estúdio, proteções explícitas
contra os erros clássicos de geração por IA (duplicação, flutuação,
reinterpretação de acabamento/escala, correntes/curvas simétricas demais),
composição sem rosto nas fotos humanizadas, sombra diagonal como assinatura
visual, e auto-checagem final antes de considerar a imagem pronta.
"""
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

FONT_NAME = "Arial"
ASPECTO_PADRAO = "3:4 (vertical)"

# ---------------------------------------------------------------------------
# Blocos fixos
# ---------------------------------------------------------------------------

FIDELIDADE = (
    "Utilize exclusivamente a joia da fotografia anexada como referência do "
    "produto. Antes de gerar, identifique exatamente quantas peças e "
    "quantas unidades de cada peça existem na fotografia anexada (por "
    "exemplo, um par de brincos conta como duas unidades) e reproduza "
    "exatamente essa mesma quantidade na imagem final — nunca invente, "
    "duplique, repita, clone, remova ou complete o conjunto adicionando "
    "peças, pingentes, pedras ou componentes que não estejam fisicamente "
    "presentes na foto original. Se a foto anexada não contiver "
    "determinado tipo de peça (por exemplo, não houver anel), essa peça "
    "não deve aparecer na imagem final sob nenhuma hipótese. Preserve com "
    "fidelidade absoluta: formato, proporções, espessura, acabamento, "
    "brilho, textura, cor do metal, pedras (corte, tamanho e posição), "
    "cravação, fechos e elos, e todos os demais detalhes originais da "
    "peça. Não redesenhe, reinterprete, estilize, complete, corrija ou "
    "invente nenhuma característica da joia — reproduza exatamente o que "
    "existe na imagem original. Não utilize a foto anexada como "
    "referência de cenário, iluminação, enquadramento ou composição — ela "
    "serve apenas para identificar a peça, sua quantidade exata e seus "
    "detalhes exatos; remova completamente quaisquer objetos, mãos ou "
    "fundos presentes na foto original. Atenção especial à espessura de "
    "correntes, elos e fios: é um erro comum de IA generativa deixar "
    "correntes finas e delicadas mais grossas, mais vistosas ou mais "
    "robustas do que a peça real. A corrente gerada precisa ter "
    "exatamente a mesma espessura, o mesmo diâmetro de elo e a mesma "
    "delicadeza da foto original — NUNCA mais grossa, mais larga ou mais "
    "chamativa do que o original, mesmo que isso a deixe visualmente mais "
    "sutil ou difícil de perceber na imagem gerada."
)

FECHO_UNIVERSAL = (
    "Qualidade: altíssima resolução, nitidez máxima na joia, excelente "
    "alcance dinâmico, texturas naturais, reflexos fisicamente corretos, "
    "cores absolutamente fiéis, acabamento fotográfico profissional. "
    "Eliminar completamente aparência de renderização 3D, ruído digital, "
    "granulado, halos ou qualquer aspecto artificial típico de imagem "
    "gerada por IA. A peça não deve parecer flutuando, tombada ou fora de "
    "escala — preserve rigorosamente suas proporções e comportamento "
    "físico real.{anatomia} Antes de finalizar, confirme item por item: a "
    "quantidade de peças geradas é idêntica à da foto original (nem a "
    "mais, nem a menos); nenhuma peça, pingente ou pedra foi inventado, "
    "duplicado ou removido; todos os detalhes de acabamento batem com o "
    "original. Formato final da imagem: {aspecto}."
)

# Checagem de anatomia — usada apenas nas poses humanizadas/lifestyle,
# onde partes do corpo (mão, dedos, pé) aparecem e são um ponto comum de
# erro de anatomia em imagens geradas por IA.
ANATOMIA_CHECK = {
    "Brinco": (
        " Garanta anatomia perfeita da orelha e do lóbulo — sem "
        "deformações, sem uma segunda orelha ou rosto fantasma aparecendo "
        "no enquadramento."
    ),
    "Anel": (
        " Mostre exatamente uma mão, com exatamente cinco dedos "
        "anatomicamente corretos — nunca dedos extras, dedos fundidos, "
        "articulações deformadas ou uma segunda mão/braço aparecendo "
        "parcialmente no enquadramento."
    ),
    "Aliança": (
        " Mostre exatamente duas mãos entrelaçadas, cada uma com "
        "exatamente cinco dedos anatomicamente corretos — nunca dedos "
        "extras, fundidos ou deformados."
    ),
    "Pulseira": (
        " Mostre exatamente um pulso e uma mão, com exatamente cinco "
        "dedos anatomicamente corretos — nunca dedos extras, fundidos ou "
        "uma segunda mão aparecendo no enquadramento."
    ),
    "Bracelete/Bangle": (
        " Mostre exatamente um pulso e uma mão, com exatamente cinco "
        "dedos anatomicamente corretos — nunca dedos extras, fundidos ou "
        "uma segunda mão aparecendo no enquadramento."
    ),
    "Tornozeleira": (
        " Mostre exatamente um tornozelo e um pé, com exatamente cinco "
        "dedos anatomicamente corretos — nunca dedos extras ou "
        "deformados."
    ),
}

# ---------------------------------------------------------------------------
# Física/composição por tipo de peça — usada nas poses "still" (sem modelo)
# ---------------------------------------------------------------------------

TIPO_COMPOSICAO_STILL = {
    "Brinco": (
        "Deixe um brinco apoiado em pé, em ângulo de aproximadamente 45° "
        "em relação à câmera, e o outro brinco deitado naturalmente sobre "
        "a superfície ao lado. Caso a peça tenha tarraxa, mantenha uma "
        "tarraxa presa em cada brinco — nunca deixe a tarraxa solta ou "
        "separada da peça."
    ),
    "Colar": (
        "Apoie o colar completamente sobre a superfície, deixando a "
        "corrente cair em curvas amplas e orgânicas, como o peso natural "
        "do metal realmente se comportaria — nunca reproduza o formato "
        "exato da foto original. Nunca crie círculos perfeitos, ovais, "
        "corações, gotas ou curvas espelhadas/simétricas dos dois lados; "
        "cada lado da corrente deve ter um desenho diferente, com raios e "
        "comprimentos de curva variados. Se houver pingente, ele deve ser "
        "o ponto focal da composição."
    ),
    "Choker/Gargantilha": (
        "Apoie a peça em uma curva aberta e levemente assimétrica sobre a "
        "superfície, sugerindo o formato do pescoço sem formar um círculo "
        "perfeito ou fechado."
    ),
    "Colar Longo": (
        "Apoie a corrente formando curvas amplas, orgânicas e "
        "assimétricas — nunca curvas espelhadas ou geométricas. Deixe o "
        "pingente (ou uma das extremidades) como ponto focal da "
        "composição, com o restante se estendendo de forma natural, como "
        "se tivesse acabado de cair sobre a superfície."
    ),
    "Pingente": (
        "Posicione o pingente como protagonista absoluto, com a corrente "
        "caindo ao redor em curvas orgânicas e assimétricas — nunca "
        "círculos, ovais ou formas espelhadas dos dois lados."
    ),
    "Corrente Masculina": (
        "Apoie a corrente em uma curva reta a levemente ondulada, "
        "transmitindo peso e robustez — nunca curvas perfeitamente "
        "simétricas ou decorativas demais."
    ),
    "Pulseira": (
        "Apoie a pulseira formando uma curva aberta e natural sobre a "
        "superfície, como se tivesse caído naturalmente — nunca um "
        "círculo perfeitamente fechado."
    ),
    "Bracelete/Bangle": (
        "Posicione o bracelete em pé, com o eixo central perpendicular à "
        "superfície (aproximadamente 90°) e inclinação máxima de 3° — o "
        "suficiente apenas para evitar aparência artificial de "
        "renderização. O centro de gravidade deve estar exatamente sobre "
        "o ponto de apoio, sem parecer tombado ou flutuando. A peça deve "
        "ocupar cerca de 65% da altura da imagem."
    ),
    "Anel": (
        "Posicione o anel em pé, levemente inclinado, mostrando "
        "claramente o aro e o detalhe frontal (pedra ou desenho "
        "principal). A peça deve parecer fisicamente apoiada e "
        "equilibrada, nunca flutuando ou tombada."
    ),
    "Aliança": (
        "Posicione as duas alianças em pé, lado a lado, uma levemente "
        "sobreposta à outra, ambas fisicamente equilibradas sobre a "
        "superfície — nunca flutuando."
    ),
    "Tornozeleira": (
        "Apoie a peça formando uma curva aberta e natural, como se "
        "tivesse caído sobre a superfície — nunca um círculo "
        "perfeitamente fechado."
    ),
    "Broche": (
        "Apoie o broche sobre uma prega de tecido, mostrando claramente o "
        "pino e o relevo frontal da peça, sem parecer flutuando."
    ),
    "Conjunto (colar + brinco)": (
        "Utilize exatamente as peças presentes na foto anexada, na mesma "
        "quantidade — nunca adicione, remova ou duplique nenhuma joia. Se "
        "não houver um tipo de peça na foto, não crie esse tipo de peça. "
        "Organize cada peça de acordo com seu próprio comportamento "
        "físico (colar em curvas orgânicas e assimétricas; brincos "
        "próximos entre si, mostrando a face principal), distribuindo os "
        "elementos em diferentes regiões da composição para um equilíbrio "
        "visual sofisticado, porém não perfeitamente simétrico."
    ),
}

# Parte do corpo mostrada nas poses humanizadas/lifestyle (sempre sem rosto)
TIPO_PARTE_CORPO = {
    "Brinco": "a orelha e a lateral do rosto (apenas esses elementos — não mostrar o restante do rosto)",
    "Colar": "o colo, as clavículas e a parte inferior do pescoço, terminando imediatamente abaixo da mandíbula",
    "Choker/Gargantilha": "o pescoço",
    "Colar Longo": "o colo e o decote",
    "Pingente": "o colo, próximo ao centro do peito",
    "Corrente Masculina": "o peito e a base do pescoço, com estilo masculino",
    "Pulseira": "o pulso",
    "Bracelete/Bangle": "o pulso e o antebraço",
    "Anel": "a mão e os dedos",
    "Aliança": "as mãos entrelaçadas, próximas ao dedo anelar",
    "Tornozeleira": "o tornozelo e o pé",
    "Broche": "a lapela de um blazer ou prega de tecido",
    "Conjunto (colar + brinco)": "o pescoço, o colo e a orelha",
}

GENERO_TIPO = {
    "Brinco": "feminino", "Colar": "feminino", "Choker/Gargantilha": "feminino",
    "Colar Longo": "feminino", "Pingente": "feminino", "Corrente Masculina": "masculino",
    "Pulseira": "feminino", "Bracelete/Bangle": "feminino", "Anel": "feminino",
    "Aliança": "unissex", "Tornozeleira": "feminino", "Broche": "feminino",
    "Conjunto (colar + brinco)": "feminino",
}

PERFIS_SUGERIDOS = {
    "feminino": "Mulher jovem (18-25), pele clara | Mulher adulta (30-45), pele morena | Mulher adulta (30-45), pele negra | Mulher idosa (60+), pele clara",
    "masculino": "Homem jovem (20-30), pele morena | Homem adulto (35-50), pele negra | Homem adulto (35-50), pele clara",
    "unissex": "Mulher adulta (30-45), pele morena | Homem adulto (35-50), pele clara | Mulher idosa (60+), pele negra",
}

TEXTURAS_SUPERFICIE = ["mármore branco", "madeira clara", "pedra calcária clara", "linho bege"]

# ---------------------------------------------------------------------------
# Especificação técnica por pose
# ---------------------------------------------------------------------------

def tech_still_branco():
    return (
        "Fotografia still de produto (packshot) profissional para "
        "e-commerce. Fundo branco puro (RGB 255,255,255), infinito, sem "
        "linha de horizonte, sem gradientes, sem textura e sem qualquer "
        "elemento decorativo. Iluminação de estúdio: uma fonte de luz "
        "principal ampla e difusa, uma luz de preenchimento suave do lado "
        "oposto para controlar sombras, e uma luz de contorno sutil para "
        "destacar a silhueta. Reflexos no metal limpos, contínuos e "
        "fisicamente corretos, sem brilhos estourados. Sombra de contato "
        "única, suave e difusa, com leve gradiente natural logo abaixo da "
        "peça. Lente equivalente entre 85mm e 105mm, foco perfeitamente "
        "nítido em toda a peça, sem distorção de perspectiva."
    )

def tech_still_sombra_editorial():
    return (
        "Fotografia editorial de joias com estética minimalista, "
        "sofisticada e contemporânea, semelhante a campanhas de marcas de "
        "luxo. A peça deve estar apoiada sobre um tecido branco ou "
        "off-white premium, fosco, encorpado, com textura delicada "
        "semelhante a crepe de seda estruturado, moldado à mão em ondas "
        "amplas e curvas orgânicas — nunca padrões repetitivos, simetria "
        "perfeita ou dobras geométricas/espirais matematicamente exatas "
        "(isso denuncia aparência de imagem gerada por IA). Câmera em "
        "ângulo de aproximadamente 45°, lente macro equivalente a "
        "85-100mm, enquadramento em close-up com a peça ocupando cerca da "
        "metade da imagem. Iluminação natural extremamente suave e "
        "difusa, como luz de uma grande janela lateral, criando sombras "
        "delicadas entre as dobras do tecido. Paleta restrita a branco "
        "quente, marfim e creme suave. Não adicionar flores, folhas, "
        "pedras decorativas, madeira, embalagens, mãos, pessoas ou "
        "qualquer elemento decorativo."
    )

def tech_still_textura(idx):
    textura = TEXTURAS_SUPERFICIE[idx % len(TEXTURAS_SUPERFICIE)]
    return (
        f"Fotografia still editorial sobre uma superfície de {textura}, "
        "de formato orgânico e bordas irregulares, apoiada sobre um "
        "tecido acetinado em tom bege claro e quente. Câmera em "
        "perspectiva oblíqua, entre 45° e 55° acima da superfície — nunca "
        "totalmente frontal nem top-down perfeitamente perpendicular; a "
        "composição pode aparecer levemente rotacionada dentro do quadro. "
        "Iluminação profissional de estúdio inspirada em luz solar suave "
        "entrando lateralmente, criando sombras pequenas e realistas que "
        "mostram a peça fisicamente apoiada sobre a superfície. Contraste "
        "moderado, cena clara, quente e sofisticada — evitar sombras "
        "muito escuras ou iluminação dramática."
    )

def tech_still_humanizado():
    return (
        "Fotografia editorial extremamente realista para catálogo premium "
        "de joias, produzida como uma campanha de joalheria de luxo. "
        "Enquadramento fechado, mostrando apenas [PARTE DO CORPO] — nunca "
        "mostrar rosto, olhos, boca, nariz, cabelo ou outras partes do "
        "corpo além das indicadas. A pele deve ter aparência extremamente "
        "natural, saudável e uniforme, com tom: [PERFIL]. Criar uma única "
        "faixa de sombra diagonal, contínua e bem definida, inclinada "
        "aproximadamente 45°, atravessando a composição como luz entrando "
        "por uma janela — a sombra nunca deve cruzar ou escurecer a peça, "
        "que deve permanecer completamente iluminada e em destaque. "
        "Vestuário minimalista em tecido acetinado ou seda fosca, em tom "
        "off-white, extremamente discreto para não competir com a joia. "
        "Lente equivalente entre 85mm e 105mm, profundidade de campo "
        "rasa — a pele pode ficar levemente desfocada, mas a peça deve "
        "permanecer perfeitamente nítida. Fundo neutro (cinza quente "
        "muito suave ou bege acinzentado), sem textura, objetos ou "
        "elementos decorativos. Não adicionar outras joias, acessórios ou "
        "maquiagem chamativa."
    )

def tech_lifestyle():
    return (
        "Fotografia lifestyle editorial para redes sociais e e-commerce. "
        "Enquadramento fechado o suficiente para não mostrar o rosto da "
        "modelo — foco em [PARTE DO CORPO] usando a peça de forma "
        "natural, em um gesto espontâneo do dia a dia, compatível com o "
        "tipo de peça. Iluminação natural suave, como luz de uma janela "
        "lateral ampla, sem fonte artificial. Fundo desfocado "
        "(profundidade de campo rasa), sugerindo um ambiente interno "
        "elegante e minimalista, sem elementos que disputem atenção com a "
        "joia. Tons neutros e quentes (branco, off-white, bege). A peça "
        "deve permanecer perfeitamente nítida e iluminada, com reflexos "
        "naturais e fisicamente corretos no metal."
    )

POSES_ORDEM = [
    "Still Branco (Packshot)",
    "Still Humanizado",
    "Still com Sombra Editorial",
    "Still em Superfície Texturizada",
    "Lifestyle com Modelo",
]

TEM_MODELO = {
    "Still Branco (Packshot)": "Não",
    "Still Humanizado": "Sim (parte do corpo, sem rosto)",
    "Still com Sombra Editorial": "Não",
    "Still em Superfície Texturizada": "Não",
    "Lifestyle com Modelo": "Sim (parte do corpo, sem rosto)",
}

# ---------------------------------------------------------------------------
# Datas comemorativas
# ---------------------------------------------------------------------------

DATAS_TEMA = {
    "Natal": {
        "paleta": "tons de vermelho, dourado e verde",
        "props": "ramos verdes, pinha desfocada, luzes de natal desfocadas ao fundo (efeito bokeh dourado)",
        "clima": "aconchegante, festivo e brilhante",
    },
    "Dia das Mães": {
        "paleta": "tons de rosa suave e nude",
        "props": "flores (rosas) desfocadas ao fundo, tecido de seda rosa-claro",
        "clima": "afetivo, delicado e caloroso",
    },
    "Dia dos Namorados": {
        "paleta": "tons de vermelho e vinho",
        "props": "pétalas de rosa vermelha, velas acesas desfocadas ao fundo",
        "clima": "romântico, intimista, iluminação quente e noturna",
    },
    "Black Friday": {
        "paleta": "preto e dourado",
        "props": "fundo preto fosco, iluminação dramática lateral, reflexo dourado sutil",
        "clima": "luxuoso, de destaque, alto contraste",
    },
    "Dia dos Pais": {
        "paleta": "tons de azul-marinho e cinza-grafite",
        "props": "madeira escura, textura de couro ao fundo desfocado",
        "clima": "sóbrio, elegante e masculino",
    },
    "Dia Internacional da Mulher": {
        "paleta": "tons de roxo e violeta",
        "props": "flor de mimosa (amarela) desfocada ao fundo",
        "clima": "moderno, empoderado e sofisticado",
    },
    "Consciência Negra": {
        "paleta": "tons terrosos e dourados",
        "props": "tecido com estampa de padronagem africana desfocado ao fundo",
        "clima": "de valorização, orgulho e sofisticação",
    },
}

# 5 fotos por data, variando tipo de peça e enquadramento (still/lifestyle) —
# cada data começa em um ponto diferente da grade tipo×pose pra não repetir
# sempre a mesma combinação de peça/cenário de uma data pra outra.
TIPOS_DATA = ["Brinco", "Colar", "Anel", "Pulseira"]
POSES_DATA = ["Still com Tema", "Lifestyle com Tema"]
COMBOS_DATA = [(tipo, pose) for tipo in TIPOS_DATA for pose in POSES_DATA]  # 8 combinações
FOTOS_POR_DATA = 5

# ---------------------------------------------------------------------------
# Expositores — still de joia sobre um suporte físico de exibição
# ---------------------------------------------------------------------------

EXPOSITOR_VARIACOES = [
    (
        "Expositor de Busto — Colar",
        "Colar",
        "Exiba a peça sobre um busto expositor feminino sem rosto, em "
        "resina fosca branca ou revestido em tecido linho cru, mostrando "
        "apenas a região do pescoço e dos ombros do busto (não mostrar a "
        "base nem o suporte inteiro). O colar deve cair naturalmente pela "
        "gravidade sobre a curva do busto, sem parecer colado ou "
        "flutuando.",
        "branco",
    ),
    (
        "Expositor de Busto — Colar Longo",
        "Colar Longo",
        "Exiba a peça sobre um busto expositor feminino sem rosto, em "
        "resina fosca off-white, enquadrado da base do pescoço até o "
        "meio do tórax. A corrente deve descer naturalmente acompanhando "
        "o volume do busto, sem parecer colada ou desenhada.",
        "sombra",
    ),
    (
        "Expositor de Mão — Anel",
        "Anel",
        "Exiba a peça em um suporte de mão expositor, em cerâmica ou "
        "resina fosca branca, com os dedos levemente afastados e "
        "curvatura anatômica realista — mostrar apenas a mão do "
        "expositor, sem pulso ou braço além do necessário.",
        "branco",
    ),
    (
        "Expositor de Mão — Pulseira/Bracelete",
        "Pulseira",
        "Exiba a peça em um suporte de pulso expositor cilíndrico, em "
        "madeira clara ou resina fosca, mostrando apenas o segmento do "
        "pulso — sem mão, dedos ou antebraço completo.",
        "textura0",
    ),
    (
        "Expositor de Orelha — Brinco",
        "Brinco",
        "Exiba o par de brincos em um suporte expositor no formato de "
        "orelha, em resina fosca branca ou acrílico transparente, "
        "mostrando apenas a peça do expositor (sem rosto ou cabeça). "
        "Caso a peça tenha tarraxa, mantenha uma tarraxa presa em cada "
        "brinco.",
        "branco",
    ),
    (
        "Expositor de Orelha — Brinco (Cenário)",
        "Brinco",
        "Exiba o par de brincos em um suporte expositor no formato de "
        "orelha, em cerâmica fosca bege claro, sobre um pano acetinado "
        "off-white com dobras suaves ao fundo.",
        "sombra",
    ),
    (
        "Expositor de Correntes — Corrente Masculina",
        "Corrente Masculina",
        "Exiba a peça em um suporte expositor de correntes tipo T "
        "(cabideiro de mesa), em madeira escura ou metal fosco preto, "
        "mostrando apenas a barra horizontal do suporte — sem a base "
        "inteira. A corrente deve cair naturalmente dos dois lados da "
        "barra, formando curvas assimétricas.",
        "textura1",
    ),
    (
        "Expositor de Correntes — Colar com Pingente",
        "Pingente",
        "Exiba a peça pendurada em um suporte expositor de correntes tipo "
        "T, em acrílico transparente ou resina fosca branca, com o "
        "pingente centralizado e voltado de frente para a câmera.",
        "branco",
    ),
    (
        "Expositor de Pescoço — Choker/Gargantilha",
        "Choker/Gargantilha",
        "Exiba a peça em um suporte expositor cilíndrico de pescoço, em "
        "veludo fosco cinza-claro ou resina branca, mostrando apenas o "
        "cilindro — sem base larga ou pedestal completo.",
        "textura2",
    ),
    (
        "Expositor Múltiplo — Conjunto",
        "Conjunto (colar + brinco)",
        "Exiba as peças do conjunto distribuídas entre um busto expositor "
        "(colar) e um pequeno suporte de orelha ao lado (brincos), ambos "
        "em resina fosca da mesma tonalidade off-white, criando um "
        "display coordenado de vitrine — utilize exatamente as peças "
        "presentes na foto anexada, na mesma quantidade, sem adicionar ou "
        "remover nenhuma joia.",
        "sombra",
    ),
]

# ---------------------------------------------------------------------------
# Lifestyle — still de joia em modelo genérica, rosto completo à mostra,
# variando gênero e etnia (10 fotos: 5 mulheres, 5 homens)
# ---------------------------------------------------------------------------

def tech_lifestyle_completo():
    return (
        "Fotografia lifestyle hiper-realista para campanha de joias, em "
        "formato vertical 3:4 e altíssima resolução. Rosto e expressão da "
        "modelo aparecem naturalmente, sem pose rígida ou artificial — a "
        "cena deve parecer um flagrante espontâneo do dia a dia, nunca uma "
        "fotografia de estúdio posada. Lente equivalente a 85mm, "
        "profundidade de campo rasa, fundo suavemente desfocado. A joia "
        "permanece perfeitamente nítida e prioritária no foco, com "
        "reflexos fisicamente corretos no metal. Pele com textura natural, "
        "sem efeito plástico ou de filtro. Mãos, quando aparecerem, devem "
        "ter anatomia perfeita — sempre cinco dedos, nunca deformados, "
        "duplicados ou fundidos."
    )

LIFESTYLE_VARIACOES = [
    (
        "Mulher — Colar (Terraço)",
        "Colar",
        "Mulher negra, aproximadamente 30 anos, cabelo cacheado natural "
        "com volume, pele com brilho saudável. Ela está sentada em um "
        "terraço ensolarado, apoiada em uma mesa de vime clara, segurando "
        "uma xícara de café com as duas mãos próximas ao colo, sorrindo "
        "de forma leve e genuína enquanto olha para o horizonte, fora da "
        "câmera. Veste uma blusa de linho branca de gola V. Luz natural "
        "da manhã, suave e dourada, incidindo lateralmente. Enquadramento "
        "da cintura para cima, evidenciando pescoço e colo para valorizar "
        "o colar.",
    ),
    (
        "Mulher — Brinco e Anel (Café de Rua)",
        "Brinco e Anel",
        "Mulher branca, cabelo loiro liso preso em um rabo de cavalo "
        "baixo, sentada em uma mesinha de um café de rua em uma cidade "
        "europeia, apoiando o queixo em uma das mãos enquanto segura um "
        "pequeno espresso com a outra. Sorriso discreto, olhar para o "
        "lado, fora da câmera. Veste um blazer bege sobre uma blusa "
        "branca. Luz natural de fim de manhã, fria e nublada, sombras "
        "suaves. Enquadramento da cintura para cima, valorizando a orelha "
        "e a mão que segura o queixo.",
    ),
    (
        "Mulher — Colar Longo (Janela)",
        "Colar Longo",
        "Mulher ruiva, cabelo ondulado solto sobre os ombros, em pé ao "
        "lado de uma grande janela com cortina translúcida, uma mão "
        "ajeitando delicadamente uma mecha de cabelo atrás da orelha "
        "enquanto olha para fora, expressão tranquila. Veste uma camisa "
        "de seda off-white. Luz natural lateral entrando pela janela, "
        "criando contraste suave entre luz e sombra no rosto. "
        "Enquadramento do peito para cima, evidenciando pescoço, colo e "
        "orelha.",
    ),
    (
        "Mulher — Brinco (Jardim)",
        "Brinco",
        "Mulher negra de pele clara, cabelo trançado preso para trás, "
        "caminhando em um jardim com vegetação desfocada ao fundo, com a "
        "cabeça levemente inclinada para trás enquanto sorri abertamente "
        "para o céu, em um gesto espontâneo de alegria. Veste um vestido "
        "de linho verde-oliva sem mangas. Luz natural de tarde, quente, "
        "levemente contraluz. Enquadramento da cintura para cima, "
        "valorizando pescoço e orelhas.",
    ),
    (
        "Mulher — Pulseira (Sofá)",
        "Pulseira",
        "Mulher branca, cabelo castanho-claro solto com ondas suaves, "
        "sentada em um sofá bege em ambiente doméstico aconchegante, com "
        "uma das pernas dobrada sobre o assento, segurando um celular "
        "com as duas mãos e olhando para a tela com expressão tranquila. "
        "Veste uma camisa branca oversized. Luz natural suave de janela "
        "lateral, ambiente claro e minimalista. Enquadramento evidenciando "
        "mãos, pulsos e colo.",
    ),
    (
        "Homem — Corrente (Escritório)",
        "Corrente Masculina",
        "Homem branco, aproximadamente 35 anos, cabelo curto bem cuidado, "
        "em pé junto a uma janela de um escritório moderno, uma mão no "
        "bolso da calça enquanto observa a paisagem urbana desfocada ao "
        "fundo, expressão séria e confiante. Veste uma camisa social "
        "azul-marinho com as mangas dobradas até o antebraço. Luz natural "
        "fria entrando pela janela, contraste moderado. Enquadramento do "
        "peito para cima, valorizando pescoço e punho.",
    ),
    (
        "Homem — Pulseira (Rua)",
        "Pulseira/Bracelete",
        "Homem negro, cabelo curto raspado nas laterais, caminhando em "
        "uma rua urbana com paredes de tijolo desfocadas ao fundo, mãos "
        "nos bolsos de uma jaqueta jeans, olhar confiante direcionado "
        "para o lado, fora da câmera. Veste uma camiseta branca básica "
        "sob a jaqueta. Luz natural de fim de tarde, dourada e lateral. "
        "Enquadramento da cintura para cima, valorizando pulso e "
        "antebraço.",
    ),
    (
        "Homem — Anel (Café)",
        "Anel",
        "Homem branco com barba curta bem aparada, sentado em uma mesa "
        "de madeira em um café, segurando uma xícara de café preta com "
        "uma das mãos apoiada sobre a mesa, olhando para baixo em direção "
        "à xícara com expressão relaxada. Veste um suéter cinza de gola "
        "redonda. Luz natural suave de janela, tons quentes. "
        "Enquadramento fechado na mão e no antebraço apoiados sobre a "
        "mesa.",
    ),
    (
        "Homem — Corrente (Varanda)",
        "Corrente Masculina",
        "Homem negro, cabelo curto, em pé em uma varanda ao entardecer, "
        "apoiado no parapeito com os dois antebraços, camisa social "
        "branca com os primeiros botões abertos, olhando para o horizonte "
        "com expressão tranquila. Luz dourada de fim de tarde, contraluz "
        "suave. Enquadramento do peito para cima, evidenciando pescoço e "
        "colo aberto pela camisa.",
    ),
    (
        "Homem — Pulseira (Externo)",
        "Pulseira",
        "Homem de pele morena clara, cabelo curto penteado para o lado, "
        "em pé em um ambiente externo arborizado, uma das mãos no bolso "
        "da calça e a outra relaxada ao lado do corpo, expressão "
        "descontraída, olhando levemente para baixo. Veste uma camisa de "
        "linho bege aberta sobre uma camiseta branca. Luz natural difusa "
        "de dia nublado. Enquadramento da cintura para cima, valorizando "
        "pulso e mão.",
    ),
]

# ---------------------------------------------------------------------------
# Peças em Você — usa DUAS fotos anexadas (a própria assinante + a joia),
# a IA compõe a identidade da FOTO 1 usando as joias da FOTO 2
# (10 fotos, poses variadas cobrindo brinco/colar/anel/pulseira/conjunto)
# ---------------------------------------------------------------------------

FIDELIDADE_IDENTIDADE = (
    "Serão anexadas duas fotografias: a FOTO 1, com o rosto da própria "
    "assinante, e a FOTO 2, com a(s) joia(s) do produto. A FOTO 1 "
    "determina exclusivamente a identidade da modelo: preserve fielmente "
    "formato do rosto, olhos, sobrancelhas, nariz, boca, mandíbula, "
    "proporções faciais, tom de pele e cabelo (cor, comprimento e textura "
    "reais) — a pessoa da imagem final deve continuar claramente "
    "reconhecível como a mesma pessoa da FOTO 1. Não a transforme em um "
    "rosto genérico, não rejuvenesça, não altere suas feições ou idade "
    "aparente. A FOTO 2 determina exclusivamente as joias: identifique "
    "exatamente quantas peças e de que tipo existem nela e utilize "
    "somente essas peças, na mesma quantidade — nunca invente, duplique, "
    "remova ou substitua nenhuma peça; preserve formato, proporções, "
    "espessura, acabamento, brilho, cor do metal, pedras e todos os "
    "detalhes originais. Se a FOTO 2 contiver outra pessoa, ignore "
    "completamente essa pessoa — rosto, corpo, pele, cabelo, roupa e pose "
    "não servem de referência, apenas as joias. Nunca misture as duas "
    "fotos: cabelo e tom de pele vêm sempre da FOTO 1; joias vêm sempre "
    "da FOTO 2. Se determinado tipo de joia não existir na FOTO 2, ele "
    "não deve aparecer na imagem final sob nenhuma hipótese."
)

FECHO_IDENTIDADE = (
    "Qualidade: altíssima resolução, nitidez máxima no rosto e na(s) "
    "joia(s), textura de pele natural e realista (sem efeito plástico ou "
    "de filtro de beleza), reflexos fisicamente corretos no metal, cores "
    "fiéis. Mãos e dedos, quando aparecerem, devem ter anatomia perfeita "
    "— sempre cinco dedos, nunca deformados, fundidos ou duplicados, e "
    "nunca uma segunda mão ou braço aparecendo acidentalmente no "
    "enquadramento. Antes de finalizar, confirme item por item: o rosto "
    "ainda é claramente reconhecível como a pessoa da FOTO 1; a "
    "quantidade e o tipo de joias são idênticos aos da FOTO 2; nenhuma "
    "peça foi inventada, duplicada ou removida. Formato final da imagem: "
    "{aspecto}."
)

VOCE_MODELO_VARIACOES = [
    (
        "Retrato Frontal — Colar",
        "Colar",
        "Composição: retrato fechado, mostrando cabeça, pescoço, colo e "
        "ombros. O rosto permanece voltado quase totalmente para a "
        "câmera, com uma rotação lateral muito sutil e leve inclinação "
        "da cabeça para baixo. Olhar direto para a lente, expressão séria "
        "e segura, lábios relaxados sem sorriso. Cabelo completamente "
        "solto, penteado para trás com efeito levemente úmido, deixando "
        "testa, orelhas, pescoço e colo totalmente visíveis. Vestir uma "
        "peça preta tomara-que-caia minimalista, ombros e colo à mostra. "
        "Fundo liso em cinza-grafite bem escuro. Iluminação de estúdio "
        "forte e direcional vinda de um dos lados e ligeiramente de cima: "
        "o rosto deve ficar muito iluminado de um lado e com sombra mais "
        "marcada do outro, mas pescoço e colo permanecem claros o "
        "suficiente para valorizar plenamente o colar. Quando houver "
        "brincos, manter as duas orelhas visíveis.",
    ),
    (
        "Mão no Rosto — Anel e Pulseira",
        "Anel e Pulseira",
        "Composição: retrato fechado do rosto e ombros, com uma das mãos "
        "levantada cobrindo parcialmente um dos olhos, dorso da mão "
        "voltado para a câmera, dedos estendidos e relaxados. A outra "
        "mão não aparece no enquadramento. Expressão neutra e "
        "sofisticada, olhar direto para a lente através do espaço entre "
        "os dedos. Cabelo solto, repartido ao meio, caindo naturalmente "
        "atrás dos ombros. Vestir uma blusa de tricô canelado off-white "
        "sem mangas. Fundo liso em bege claro. Iluminação de estúdio "
        "suave e lateral, com leve sombra do lado oposto à luz. Quando "
        "houver anel, posicioná-lo no dedo correspondente da mão "
        "levantada; quando houver pulseira, mantê-la visível no pulso "
        "dessa mesma mão.",
    ),
    (
        "Perfil com Coque — Brinco e Colar",
        "Brinco e Colar",
        "Composição: retrato fechado em perfil de aproximadamente três "
        "quartos, cabeça claramente virada para o lado, queixo levemente "
        "elevado, pescoço alongado e visível. Olhar direcionado para o "
        "lado, fora do enquadramento. Lábios levemente entreabertos, sem "
        "sorriso. Cabelo preso em coque alto, deixando nuca, pescoço e "
        "orelha completamente visíveis. Vestir uma camisa branca ampla, "
        "caída sobre os ombros, decote em V comportado, sem expor o colo "
        "além das clavículas. Fundo liso em tom terracota quente. "
        "Iluminação de estúdio lateral e suave, destacando claramente "
        "pescoço, orelha e colo. Quando houver colar, mantê-lo totalmente "
        "visível sobre o colo; quando houver brinco, a orelha do lado "
        "virado para a câmera permanece livre de cabelo.",
    ),
    (
        "Mão na Cabeça — Anel",
        "Anel",
        "Composição: retrato fechado em perfil de três quartos, um dos "
        "braços dobrado para cima com a mão apoiada delicadamente na "
        "lateral da cabeça, próxima à têmpora — os dedos tocam apenas o "
        "cabelo, sem pressionar o rosto. Cotovelo apoiado sobre uma "
        "superfície fora de quadro. A outra mão não aparece. Olhar "
        "direcionado para o lado, expressão tranquila. Cabelo solto "
        "caindo sobre o ombro oposto ao braço levantado. Vestir uma "
        "blusa preta simples de alças finas. Fundo liso em cinza claro. "
        "Iluminação suave e difusa, levemente lateral. Quando houver "
        "anel, posicioná-lo no dedo visível da mão levantada.",
    ),
    (
        "Cadeira ao Contrário — Conjunto",
        "Conjunto (colar + brinco)",
        "Composição: modelo sentada ao contrário em uma cadeira branca "
        "minimalista, encosto voltado para a frente do corpo, tronco e "
        "cadeira levemente girados em diagonal (cerca de 20 a 30 graus) "
        "em relação à câmera. Um braço cruza a frente do encosto; o "
        "outro sobe com o cotovelo apoiado sobre o encosto e a mão "
        "repousando perto da têmpora. Cabeça inclinada suavemente em "
        "direção a essa mão, olhos voltados para a câmera, expressão "
        "tranquila e lábios levemente entreabertos. Cabelo preso em "
        "coque baixo com fios soltos ao redor do rosto. Vestir uma "
        "regata preta simples. Fundo liso off-white. Iluminação difusa e "
        "lateral, acompanhando a diagonal da pose. Quando houver "
        "pulseira, ela deve ficar no pulso da mão próxima ao rosto; "
        "quando houver colar e brincos, ambos permanecem visíveis e bem "
        "iluminados.",
    ),
    (
        "Debruçada na Mesa — Colar e Brinco",
        "Colar e Brinco",
        "Composição: modelo debruçada sobre uma mesa branca lisa, tronco "
        "inclinado para frente e levemente para o lado, um ombro mais "
        "próximo da câmera que o outro. Um braço sobe com a mão apoiada "
        "na lateral superior da cabeça, sobre o cabelo, sem cobrir a "
        "testa; o outro braço fica totalmente apoiado sobre a mesa, mão "
        "relaxada sobre a superfície, sem tocar o outro braço. Olhar "
        "direto para a câmera, expressão segura e elegante, sem sinais "
        "de cansaço. Cabelo solto, penteado para trás. Vestir uma camisa "
        "branca ampla e moderna. Fundo liso em cinza claro. Iluminação "
        "de estúdio clara e lateral, com sombras suaves da mesa e dos "
        "braços. Quando houver colar, mantê-lo visível sobre o colo; "
        "quando houver brinco, a orelha correspondente permanece livre; "
        "quando houver anel, posicioná-lo na mão apoiada sobre a mesa.",
    ),
    (
        "Regata Frontal — Colar",
        "Colar",
        "Composição: retrato fechado quase frontal, corpo levemente "
        "apoiado contra uma parede lisa atrás, ombros relaxados, cabeça "
        "praticamente reta com inclinação mínima. Olhar direto para a "
        "câmera, expressão neutra e contemporânea, lábios relaxados e "
        "suavemente entreabertos. Cabelo solto com leve movimento, uma "
        "mecha podendo cruzar parte do rosto de forma natural, mantendo "
        "pelo menos um olho sempre visível. Vestir uma regata preta lisa "
        "e minimalista, decote arredondado moderado. Fundo em parede "
        "branca lisa. Iluminação natural lateral, criando sombra suave "
        "da modelo sobre a parede ao fundo. Quando houver colar, o "
        "decote deve deixá-lo totalmente visível sobre o colo.",
    ),
    (
        "Vento no Cabelo — Brinco",
        "Brinco",
        "Composição: retrato fechado frontal, corpo praticamente reto e "
        "relaxado, cabeça reta, olhar direto para a câmera. O cabelo "
        "aparece solto e movimentado lateralmente por vento, com uma "
        "mecha cruzando parte do rosto e um dos olhos, mantendo a outra "
        "metade do rosto e uma orelha completamente visíveis. Expressão "
        "tranquila e natural. Vestir uma camisa social clara aberta nos "
        "ombros. Fundo liso e neutro. Iluminação lateral suave, simulando "
        "luz de sol filtrada. Quando houver brinco, a orelha visível deve "
        "ficar totalmente livre de cabelo para destacá-lo.",
    ),
    (
        "Apoiada em Cadeira — Pulseira",
        "Pulseira",
        "Composição: modelo em pé, apoiada casualmente no encosto de uma "
        "cadeira branca minimalista, um braço apoiado sobre o encosto "
        "com o pulso e a mão relaxados e visíveis, o outro braço relaxado "
        "ao lado do corpo. Corpo levemente girado em relação à câmera, "
        "olhar direto para a lente, expressão serena. Cabelo solto com "
        "ondas suaves. Vestir uma camisa de linho bege. Fundo liso em "
        "tom areia. Iluminação suave e natural, lateral. Quando houver "
        "pulseira, ela deve ficar visível no pulso apoiado sobre o "
        "encosto da cadeira.",
    ),
    (
        "Espelho com Celular — Brinco",
        "Brinco",
        "Composição: modelo em pé diante de um espelho de moldura fina "
        "preta com cantos arredondados, segurando um smartphone com as "
        "duas mãos em frente ao rosto, cobrindo boa parte dele — apenas "
        "testa, cabelo, mandíbula e uma orelha permanecem visíveis. "
        "Cabelo solto, penteado atrás da orelha visível. Vestir uma "
        "camisa branca oversized com um ombro levemente à mostra. Fundo "
        "minimalista, parede lisa em cinza muito claro. Iluminação "
        "suave, sugerindo uma janela fora do enquadramento, incidindo "
        "lateralmente. Quando houver brinco, a orelha visível deve "
        "permanecer totalmente livre de cabelo para destacá-lo.",
    ),
]

# ---------------------------------------------------------------------------
# Montagem dos prompts
# ---------------------------------------------------------------------------

def slug(txt):
    txt = txt.lower()
    repl = {
        "á": "a", "ã": "a", "â": "a", "à": "a", "é": "e", "ê": "e",
        "í": "i", "ó": "o", "ô": "o", "õ": "o", "ú": "u", "ç": "c",
        "(": "", ")": "", "/": "-", " ": "-",
    }
    for a, b in repl.items():
        txt = txt.replace(a, b)
    return txt

def montar_still(tipo, pose, textura_idx):
    cena = f"Composição: {TIPO_COMPOSICAO_STILL[tipo]}"
    if pose == "Still Branco (Packshot)":
        tech = tech_still_branco()
    elif pose == "Still com Sombra Editorial":
        tech = tech_still_sombra_editorial()
    else:  # Still em Superfície Texturizada
        tech = tech_still_textura(textura_idx)
    fecho = FECHO_UNIVERSAL.format(aspecto=ASPECTO_PADRAO, anatomia="")
    return "\n\n".join([FIDELIDADE, cena, tech, fecho])

def montar_humanizado_ou_lifestyle(tipo, pose):
    parte = TIPO_PARTE_CORPO[tipo]
    cena = f"Composição: mostrar apenas {parte}, evidenciando a peça de forma natural."
    tech = tech_still_humanizado() if pose == "Still Humanizado" else tech_lifestyle()
    tech = tech.replace("[PARTE DO CORPO]", parte)
    fecho = FECHO_UNIVERSAL.format(aspecto=ASPECTO_PADRAO, anatomia=ANATOMIA_CHECK.get(tipo, ""))
    return "\n\n".join([FIDELIDADE, cena, tech, fecho])

def montar_prompt_evergreen(tipo, pose, textura_idx):
    if pose in ("Still Branco (Packshot)", "Still com Sombra Editorial", "Still em Superfície Texturizada"):
        return montar_still(tipo, pose, textura_idx)
    return montar_humanizado_ou_lifestyle(tipo, pose)

def montar_prompt_data(tipo, pose, data, tema):
    tema_txt = (
        f"Tema visual: {data}. Paleta de cores: {tema['paleta']}. "
        f"Elementos/props de cena: {tema['props']}. Clima geral: {tema['clima']}."
    )
    anatomia = ""
    if pose == "Still com Tema":
        cena = f"Composição: {TIPO_COMPOSICAO_STILL[tipo]}"
        tech = tech_still_sombra_editorial()
    else:  # Lifestyle com Tema
        parte = TIPO_PARTE_CORPO[tipo]
        cena = f"Composição: mostrar apenas {parte}, evidenciando a peça de forma natural."
        tech = tech_still_humanizado().replace("[PARTE DO CORPO]", parte)
        anatomia = ANATOMIA_CHECK.get(tipo, "")
    fecho = FECHO_UNIVERSAL.format(aspecto=ASPECTO_PADRAO, anatomia=anatomia)
    return "\n\n".join([FIDELIDADE, cena, tema_txt, tech, fecho])

def montar_prompt_expositor(composicao, tech_key):
    cena = f"Composição: {composicao}"
    if tech_key == "branco":
        tech = tech_still_branco()
    elif tech_key == "sombra":
        tech = tech_still_sombra_editorial()
    else:  # "texturaN"
        tech = tech_still_textura(int(tech_key[-1]))
    fecho = FECHO_UNIVERSAL.format(aspecto=ASPECTO_PADRAO, anatomia="")
    return "\n\n".join([FIDELIDADE, cena, tech, fecho])

def montar_prompt_lifestyle(cena):
    fecho = FECHO_UNIVERSAL.format(aspecto=ASPECTO_PADRAO, anatomia="")
    return "\n\n".join([FIDELIDADE, f"Composição: {cena}", tech_lifestyle_completo(), fecho])

def montar_prompt_voce_modelo(cena):
    fecho = FECHO_IDENTIDADE.format(aspecto=ASPECTO_PADRAO)
    return "\n\n".join([FIDELIDADE_IDENTIDADE, cena, fecho])

rows_evergreen = []
idx = 1
for tipo in TIPO_COMPOSICAO_STILL:
    genero = GENERO_TIPO[tipo]
    for ti, pose in enumerate(POSES_ORDEM):
        prompt = montar_prompt_evergreen(tipo, pose, ti)
        tem_modelo = TEM_MODELO[pose]
        perfis = PERFIS_SUGERIDOS[genero] if "Sim" in tem_modelo else ""
        nome_ref = f"{slug(tipo)}_{slug(pose)}"
        rows_evergreen.append([
            idx, tipo, pose, tem_modelo, perfis, nome_ref, prompt, ASPECTO_PADRAO, "A gerar", "", "",
        ])
        idx += 1

rows_datas = []
idx = 1
for di, (data, tema) in enumerate(DATAS_TEMA.items()):
    offset = (di * FOTOS_POR_DATA) % len(COMBOS_DATA)
    combos_rotacionados = COMBOS_DATA[offset:] + COMBOS_DATA[:offset]
    for tipo, pose in combos_rotacionados[:FOTOS_POR_DATA]:
        genero = GENERO_TIPO[tipo]
        prompt = montar_prompt_data(tipo, pose, data, tema)
        tem_modelo = "Não" if pose == "Still com Tema" else "Sim (parte do corpo, sem rosto)"
        perfis = PERFIS_SUGERIDOS[genero] if tem_modelo.startswith("Sim") else ""
        nome_ref = f"{slug(data)}_{slug(tipo)}_{slug(pose)}"
        rows_datas.append([
            idx, data, tipo, pose, tem_modelo, perfis, nome_ref, prompt, ASPECTO_PADRAO, "A gerar", "", "",
        ])
        idx += 1

rows_expositores = []
for idx, (nome, tipo, composicao, tech_key) in enumerate(EXPOSITOR_VARIACOES, start=1):
    prompt = montar_prompt_expositor(composicao, tech_key)
    nome_ref = f"expositor_{idx:02d}_{slug(tipo)}"
    rows_expositores.append([
        idx, "Expositor", nome, "Não", "", nome_ref, prompt, ASPECTO_PADRAO, "A gerar", "", "",
    ])

rows_lifestyle = []
for idx, (nome, combo, cena) in enumerate(LIFESTYLE_VARIACOES, start=1):
    prompt = montar_prompt_lifestyle(cena)
    nome_ref = f"lifestyle_{idx:02d}_{slug(nome.split('—')[0].strip())}"
    rows_lifestyle.append([
        idx, "Lifestyle", nome, "Sim (rosto completo)", "", nome_ref, prompt, ASPECTO_PADRAO, "A gerar", "", "",
    ])

rows_voce_modelo = []
for idx, (nome, combo, cena) in enumerate(VOCE_MODELO_VARIACOES, start=1):
    prompt = montar_prompt_voce_modelo(cena)
    nome_ref = f"voce_{idx:02d}_{slug(nome.split('—')[0].strip())}"
    rows_voce_modelo.append([
        idx, "Peças em Você", nome, "Sim (requer 2 fotos: sua + joia)", "", nome_ref, prompt, ASPECTO_PADRAO, "A gerar", "", "",
    ])

# ---------------------------------------------------------------------------
# Excel
# ---------------------------------------------------------------------------

wb = Workbook()

HEADER_FILL = PatternFill("solid", fgColor="1F2937")
HEADER_FONT = Font(name=FONT_NAME, size=10, bold=True, color="FFFFFF")
CELL_FONT = Font(name=FONT_NAME, size=10)
TITLE_FONT = Font(name=FONT_NAME, size=14, bold=True, color="1F2937")
SUB_FONT = Font(name=FONT_NAME, size=10, italic=True, color="555555")
THIN = Side(style="thin", color="D9D9D9")
BORDER = Border(left=THIN, right=THIN, top=THIN, bottom=THIN)

def style_header(ws, ncols, row=1):
    for c in range(1, ncols + 1):
        cell = ws.cell(row=row, column=c)
        cell.fill = HEADER_FILL
        cell.font = HEADER_FONT
        cell.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
        cell.border = BORDER

def autofit(ws, widths):
    for i, w in enumerate(widths, start=1):
        ws.column_dimensions[get_column_letter(i)].width = w

ws0 = wb.active
ws0.title = "Instruções"
ws0.sheet_view.showGridLines = False
ws0["B2"] = "Photo Studio TPV — Biblioteca de Prompts (v2)"
ws0["B2"].font = TITLE_FONT
ws0["B3"] = "Reescrita com base em prompts reais do concorrente (Studio Pablita)"
ws0["B3"].font = SUB_FONT

instrucoes = [
    "",
    "O QUE MUDOU NA V2",
    "Os prompts foram reescritos incorporando técnicas reais observadas em prompts do "
    "concorrente: física de equilíbrio/gravidade das peças, vocabulário de câmera e "
    "iluminação de estúdio, proteções contra erros clássicos de geração por IA "
    "(duplicação, flutuação, correntes/curvas simétricas demais, reinterpretação de "
    "acabamento ou escala), composição sem rosto nas fotos humanizadas, sombra "
    "diagonal como assinatura visual, e auto-checagem final antes de considerar a "
    "imagem pronta.",
    "",
    "COMO USAR ESTA PLANILHA",
    "1. Abra a aba 'Evergreen' ou 'Datas Comemorativas'.",
    "2. Copie o texto da coluna 'Prompt Mestre' de uma linha.",
    "3. Se o prompt tiver [PERFIL], substitua por uma das opções de 'Perfis Sugeridos'.",
    "4. Cole no Gemini (ou ChatGPT), anexando a foto de uma peça genérica do catálogo.",
    "5. Gere a imagem. Se ficou boa, salve com o nome de 'Nome de Referência'.",
    "6. Suba no Supabase e marque a linha como 'aprovado' (ver README do projeto).",
    "",
    "LEGENDA",
    "Tem Modelo? — indica se a pose usa parte do corpo (sempre sem rosto).",
    "Perfis Sugeridos — variações de gênero/idade/tom de pele para gerar mais de uma "
    "vez o mesmo prompt, ampliando a diversidade de referências no catálogo.",
]

r = 5
for line in instrucoes:
    cell = ws0.cell(row=r, column=2, value=line)
    if line.isupper() and line != "":
        cell.font = Font(name=FONT_NAME, size=11, bold=True, color="1F2937")
    else:
        cell.font = CELL_FONT
    cell.alignment = Alignment(wrap_text=True, vertical="top")
    ws0.row_dimensions[r].height = 28 if len(line) > 70 else 16
    r += 1

autofit(ws0, [3, 110])
for rr in range(5, r):
    ws0.merge_cells(start_row=rr, start_column=2, end_row=rr, end_column=10)

ws1 = wb.create_sheet("Evergreen")
headers = ["ID", "Tipo de Peça", "Pose/Enquadramento", "Tem Modelo?", "Perfis Sugeridos",
           "Nome de Referência", "Prompt Mestre", "Proporção", "Status",
           "Link da Imagem Gerada", "Observações"]
ws1.append(headers)
style_header(ws1, len(headers))
for row in rows_evergreen:
    ws1.append(row)

widths1 = [5, 20, 24, 22, 40, 34, 80, 16, 12, 26, 22]
autofit(ws1, widths1)
for r_i in range(2, ws1.max_row + 1):
    for c_i in range(1, len(headers) + 1):
        cell = ws1.cell(row=r_i, column=c_i)
        cell.font = CELL_FONT
        cell.border = BORDER
        cell.alignment = Alignment(wrap_text=True, vertical="top")
    ws1.row_dimensions[r_i].height = 130
ws1.freeze_panes = "A2"
ws1.auto_filter.ref = ws1.dimensions

ws2 = wb.create_sheet("Datas Comemorativas")
headers2 = ["ID", "Data Comemorativa", "Tipo de Peça", "Pose/Enquadramento", "Tem Modelo?",
            "Perfis Sugeridos", "Nome de Referência", "Prompt Mestre", "Proporção",
            "Status", "Link da Imagem Gerada", "Observações"]
ws2.append(headers2)
style_header(ws2, len(headers2))
for row in rows_datas:
    ws2.append(row)

widths2 = [5, 24, 18, 20, 22, 40, 38, 80, 16, 12, 26, 22]
autofit(ws2, widths2)
for r_i in range(2, ws2.max_row + 1):
    for c_i in range(1, len(headers2) + 1):
        cell = ws2.cell(row=r_i, column=c_i)
        cell.font = CELL_FONT
        cell.border = BORDER
        cell.alignment = Alignment(wrap_text=True, vertical="top")
    ws2.row_dimensions[r_i].height = 140
ws2.freeze_panes = "A2"
ws2.auto_filter.ref = ws2.dimensions

ws3 = wb.create_sheet("Expositores")
ws3.append(headers)  # mesmo layout de colunas da aba Evergreen
style_header(ws3, len(headers))
for row in rows_expositores:
    ws3.append(row)

autofit(ws3, widths1)
for r_i in range(2, ws3.max_row + 1):
    for c_i in range(1, len(headers) + 1):
        cell = ws3.cell(row=r_i, column=c_i)
        cell.font = CELL_FONT
        cell.border = BORDER
        cell.alignment = Alignment(wrap_text=True, vertical="top")
    ws3.row_dimensions[r_i].height = 130
ws3.freeze_panes = "A2"
ws3.auto_filter.ref = ws3.dimensions

ws4 = wb.create_sheet("Lifestyle")
ws4.append(headers)  # mesmo layout de colunas da aba Evergreen
style_header(ws4, len(headers))
for row in rows_lifestyle:
    ws4.append(row)

autofit(ws4, widths1)
for r_i in range(2, ws4.max_row + 1):
    for c_i in range(1, len(headers) + 1):
        cell = ws4.cell(row=r_i, column=c_i)
        cell.font = CELL_FONT
        cell.border = BORDER
        cell.alignment = Alignment(wrap_text=True, vertical="top")
    ws4.row_dimensions[r_i].height = 130
ws4.freeze_panes = "A2"
ws4.auto_filter.ref = ws4.dimensions

ws5 = wb.create_sheet("Peças em Você")
ws5.append(headers)  # mesmo layout de colunas da aba Evergreen
style_header(ws5, len(headers))
for row in rows_voce_modelo:
    ws5.append(row)

autofit(ws5, widths1)
for r_i in range(2, ws5.max_row + 1):
    for c_i in range(1, len(headers) + 1):
        cell = ws5.cell(row=r_i, column=c_i)
        cell.font = CELL_FONT
        cell.border = BORDER
        cell.alignment = Alignment(wrap_text=True, vertical="top")
    ws5.row_dimensions[r_i].height = 160
ws5.freeze_panes = "A2"
ws5.auto_filter.ref = ws5.dimensions

out_path = "content/Photo_Studio_TPV_Biblioteca_de_Prompts.xlsx"
wb.save(out_path)
print("OK:", out_path)
print("Evergreen rows:", len(rows_evergreen))
print("Datas rows:", len(rows_datas))
print("Expositores rows:", len(rows_expositores))
print("Lifestyle rows:", len(rows_lifestyle))
print("Peças em Você rows:", len(rows_voce_modelo))
