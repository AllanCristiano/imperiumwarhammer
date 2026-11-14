export type Glyph =
  | 'astartes'
  | 'custodes'
  | 'militarum'
  | 'mechanicus'
  | 'sororitas'
  | 'inquisicao'
  | 'cavaleiros'
  | 'assassinorum';

export interface Stat {
  label: string;
  value: number; // 0..100
}

export interface Fact {
  label: string;
  value: string;
}

export interface Era {
  era: string;
  title: string;
  text: string;
}

export interface Faction {
  slug: string;
  glyph: Glyph;
  name: string;
  short: string;
  epithet: string;
  motto: string;
  color: string; // cor primária da facção
  accent: string; // cor de destaque / brilho
  summary: string;
  lore: string[];
  quote: { text: string; author: string };
  stats: Stat[];
  facts: Fact[];
  timeline: Era[];
}

export const FACTIONS: readonly Faction[] = [
  {
    slug: 'adeptus-astartes',
    glyph: 'astartes',
    name: 'Adeptus Astartes',
    short: 'Astartes',
    epithet: 'Os Anjos da Morte',
    motto: 'E eles não conhecerão o medo',
    color: '#1f4fa8',
    accent: '#e7c46a',
    summary:
      'Guerreiros transumanos forjados a partir da semente genética dos Primarcas, organizados em Capítulos autônomos que defendem a humanidade nas linhas mais desesperadas.',
    lore: [
      'Cada Astartes começa como um jovem recrutado de mundos brutais. Ao longo de anos, recebe órgãos implantados, treinamento hipnótico e doutrina — até se tornar algo além do humano: um Irmão de Batalha.',
      'Após a Heresia de Horus, as antigas Legiões foram divididas em Capítulos de cerca de mil guerreiros pelo Codex Astartes, garantindo que nenhum único comandante voltasse a reunir tamanho poder.',
    ],
    quote: {
      text: 'Somos o escudo que nunca se parte e a lâmina que nunca hesita.',
      author: 'Juramento de um Capelão',
    },
    stats: [
      { label: 'Fé', value: 78 },
      { label: 'Força', value: 94 },
      { label: 'Tecnologia', value: 72 },
      { label: 'Números', value: 28 },
      { label: 'Mobilidade', value: 88 },
    ],
    facts: [
      { label: 'Organização', value: 'Capítulos de ~1000' },
      { label: 'Arma-símbolo', value: 'Bolter' },
      { label: 'Origem', value: 'Semente genética' },
      { label: 'Doutrina', value: 'Codex Astartes' },
    ],
    timeline: [
      { era: 'M30', title: 'A Grande Cruzada', text: 'As Legiões reconquistam os mundos perdidos da humanidade sob o comando dos Primarcas.' },
      { era: 'M31', title: 'A Heresia', text: 'Metade das Legiões trai o Imperador. A galáxia arde em guerra civil.' },
      { era: 'M31', title: 'O Codex', text: 'As Legiões leais são divididas em Capítulos para nunca mais ameaçar o Trono.' },
      { era: 'M42', title: 'Indomitus', text: 'Uma nova geração de guerreiros cruza o Rubicão e reforça os Capítulos.' },
    ],
  },
  {
    slug: 'adeptus-custodes',
    glyph: 'custodes',
    name: 'Adeptus Custodes',
    short: 'Custodes',
    epithet: 'A Guarda Dourada',
    motto: 'Nenhum passa pelo Portão',
    color: '#b8862a',
    accent: '#ffe8a3',
    summary:
      'Os guardiões pessoais do Imperador, cada um criado individualmente com um processo jamais replicado. Raros, silenciosos e quase invencíveis.',
    lore: [
      'Os Custodes protegem o Palácio Imperial em Terra e o Trono Dourado. Cada guerreiro é uma obra única — mais forte, mais rápido e mais longevo que qualquer Astartes.',
      'Durante milênios mantiveram-se reclusos em Terra. Hoje, em tempos de crise sem precedentes, suas lanças douradas voltam a ser vistas entre as estrelas.',
    ],
    quote: {
      text: 'Não juramos a um império. Juramos a Ele.',
      author: 'Voto dos Dez Mil',
    },
    stats: [
      { label: 'Fé', value: 70 },
      { label: 'Força', value: 99 },
      { label: 'Tecnologia', value: 90 },
      { label: 'Números', value: 8 },
      { label: 'Mobilidade', value: 80 },
    ],
    facts: [
      { label: 'Contingente', value: 'Os Dez Mil' },
      { label: 'Arma-símbolo', value: 'Lança Guardiã' },
      { label: 'Base', value: 'Palácio Imperial' },
      { label: 'Juramento', value: 'O Trono Dourado' },
    ],
    timeline: [
      { era: 'M30', title: 'Criação', text: 'Os primeiros Custodes são moldados pelas mãos do próprio Imperador.' },
      { era: 'M31', title: 'O Cerco de Terra', text: 'A Guarda Dourada defende o Palácio contra as hostes traidoras.' },
      { era: 'M32–M41', title: 'O Silêncio', text: 'Milênios de vigília silenciosa ao redor do Trono.' },
      { era: 'M42', title: 'O Retorno', text: 'Escudos-Hosts partem de Terra para lutar onde a ruína é maior.' },
    ],
  },
  {
    slug: 'astra-militarum',
    glyph: 'militarum',
    name: 'Astra Militarum',
    short: 'Militarum',
    epithet: 'O Martelo do Imperador',
    motto: 'Somente na morte termina o dever',
    color: '#5c6b3a',
    accent: '#d8c27a',
    summary:
      'Bilhões de homens e mulheres comuns, armados com fuzis laser e tanques blindados, formando a maior força de combate que a galáxia já viu.',
    lore: [
      'Cada mundo imperial deve enviar regimentos ao dízimo. Eles partem para nunca mais ver seu lar, lutando em guerras de atrito que duram décadas.',
      'Comissários mantêm a disciplina, sacerdotes mantêm a fé e a artilharia mantém o inimigo de cabeça baixa. Sua força não é o indivíduo — é a massa.',
    ],
    quote: {
      text: 'Um homem com um fuzil laser é pouco. Um milhão deles é uma muralha.',
      author: 'Manual Tático, primeiro capítulo',
    },
    stats: [
      { label: 'Fé', value: 66 },
      { label: 'Força', value: 52 },
      { label: 'Tecnologia', value: 55 },
      { label: 'Números', value: 100 },
      { label: 'Mobilidade', value: 48 },
    ],
    facts: [
      { label: 'Efetivo', value: 'Bilhões' },
      { label: 'Arma-símbolo', value: 'Fuzil laser' },
      { label: 'Blindado', value: 'Leman Russ' },
      { label: 'Disciplina', value: 'Comissariado' },
    ],
    timeline: [
      { era: 'M31', title: 'A Divisão', text: 'O antigo Exército Imperial é separado da frota para evitar novas traições.' },
      { era: 'M41', title: 'As Cruzadas', text: 'Regimentos de mil mundos são lançados em campanhas intermináveis.' },
      { era: 'M41', title: 'A Queda do Portão', text: 'Uma fortaleza lendária resiste até o último bastião.' },
      { era: 'M42', title: 'A Fenda', text: 'Com a galáxia partida ao meio, a Guarda segura a linha no escuro.' },
    ],
  },
  {
    slug: 'adeptus-mechanicus',
    glyph: 'mechanicus',
    name: 'Adeptus Mechanicus',
    short: 'Mechanicus',
    epithet: 'Os Filhos de Marte',
    motto: 'A carne é fraca',
    color: '#a3241c',
    accent: '#ff9a5a',
    summary:
      'Sacerdotes-tecnólogos que veneram o Deus-Máquina. Guardam o conhecimento técnico da humanidade e forjam suas armas mais terríveis.',
    lore: [
      'Para o Culto Mecânico, toda máquina possui um espírito. Ritos, incensos e cânticos binários acompanham cada reparo, cada disparo, cada forja.',
      'Seus tecno-sacerdotes substituem a carne por metal em busca da perfeição. Exércitos de Skitarii e colossais Titãs marcham sob seus estandartes.',
    ],
    quote: {
      text: 'Do conhecimento vem o poder. Da máquina, a eternidade.',
      author: 'Litania da Forja',
    },
    stats: [
      { label: 'Fé', value: 84 },
      { label: 'Força', value: 76 },
      { label: 'Tecnologia', value: 100 },
      { label: 'Números', value: 62 },
      { label: 'Mobilidade', value: 44 },
    ],
    facts: [
      { label: 'Mundo-sede', value: 'Marte' },
      { label: 'Divindade', value: 'Omnissiah' },
      { label: 'Infantaria', value: 'Skitarii' },
      { label: 'Colossos', value: 'Legiões Titânicas' },
    ],
    timeline: [
      { era: 'M30', title: 'O Tratado', text: 'Marte e Terra selam uma aliança que une a forja ao trono.' },
      { era: 'M31', title: 'O Cisma', text: 'Guerra civil nas forjas de Marte durante a Heresia.' },
      { era: 'M41', title: 'Explorator', text: 'Frotas partem em busca de tecnologias perdidas da Idade das Trevas.' },
      { era: 'M42', title: 'O Rubicão', text: 'Uma descoberta ousada gera uma nova geração de guerreiros.' },
    ],
  },
  {
    slug: 'adepta-sororitas',
    glyph: 'sororitas',
    name: 'Adepta Sororitas',
    short: 'Sororitas',
    epithet: 'As Filhas do Imperador',
    motto: 'A fé é o nosso escudo',
    color: '#7d1420',
    accent: '#f2ece0',
    summary:
      'O braço militante da Eclesiarquia: guerreiras de fé inabalável, armadas com bolters, lança-chamas e a convicção de que o Imperador as protege.',
    lore: [
      'Nascidas de uma era de apostasia, as Irmãs de Batalha tornaram-se a espada da Igreja Imperial sem violar o decreto que proíbe à Eclesiarquia ter homens em armas.',
      'Diz-se que, em meio à batalha, a fé delas se manifesta em atos milagrosos. Santas lendárias retornam quando a escuridão é mais profunda.',
    ],
    quote: {
      text: 'Purificamos com chamas aquilo que a palavra não alcança.',
      author: 'Cântico das Ordens Militantes',
    },
    stats: [
      { label: 'Fé', value: 100 },
      { label: 'Força', value: 70 },
      { label: 'Tecnologia', value: 58 },
      { label: 'Números', value: 46 },
      { label: 'Mobilidade', value: 74 },
    ],
    facts: [
      { label: 'Ordens', value: 'Militantes' },
      { label: 'Arma-símbolo', value: 'Lança-chamas' },
      { label: 'Igreja', value: 'Eclesiarquia' },
      { label: 'Símbolo', value: 'Flor-de-lis' },
    ],
    timeline: [
      { era: 'M36', title: 'A Apostasia', text: 'Um tirano corrompe a Igreja e mergulha o Imperium no caos.' },
      { era: 'M36', title: 'O Decreto', text: 'Um decreto passivo transforma as Filhas em Irmãs de Batalha.' },
      { era: 'M41', title: 'Guerras da Fé', text: 'As Ordens marcham contra hereges, mutantes e xenos.' },
      { era: 'M42', title: 'Milagres', text: 'Santas vivas inspiram exércitos inteiros contra a escuridão.' },
    ],
  },
  {
    slug: 'inquisicao',
    glyph: 'inquisicao',
    name: 'Inquisição',
    short: 'Inquisição',
    epithet: 'Os Olhos do Trono',
    motto: 'Inocência não prova nada',
    color: '#5e1616',
    accent: '#e0b25a',
    summary:
      'Agentes com autoridade quase ilimitada, caçando hereges, xenos e demônios nas sombras. Podem requisitar exércitos — ou condenar mundos inteiros.',
    lore: [
      'A Inquisição divide-se em Ordos: o Malleus caça demônios, o Hereticus persegue hereges e o Xenos vigia as raças alienígenas.',
      'Cada inquisidor age conforme sua própria interpretação da vontade do Imperador. Alguns são puritanos rígidos; outros usam as armas do próprio inimigo.',
    ],
    quote: {
      text: 'Uma mente aberta é como uma fortaleza com os portões escancarados.',
      author: 'Máxima do Ordo Hereticus',
    },
    stats: [
      { label: 'Fé', value: 82 },
      { label: 'Força', value: 64 },
      { label: 'Tecnologia', value: 80 },
      { label: 'Números', value: 22 },
      { label: 'Mobilidade', value: 90 },
    ],
    facts: [
      { label: 'Divisões', value: 'Malleus · Hereticus · Xenos' },
      { label: 'Autoridade', value: 'A Roseta' },
      { label: 'Último recurso', value: 'Exterminatus' },
      { label: 'Agentes', value: 'Acólitos' },
    ],
    timeline: [
      { era: 'M31', title: 'Fundação', text: 'Das cinzas da Heresia nasce uma ordem dedicada a vigiar o Imperium.' },
      { era: 'M32', title: 'Os Ordos', text: 'A Inquisição se divide para enfrentar ameaças distintas.' },
      { era: 'M41', title: 'Expurgos', text: 'Mundos inteiros são investigados, julgados e, às vezes, apagados.' },
      { era: 'M42', title: 'Sombras', text: 'Conclaves secretos disputam o futuro da humanidade.' },
    ],
  },
  {
    slug: 'cavaleiros-imperiais',
    glyph: 'cavaleiros',
    name: 'Cavaleiros Imperiais',
    short: 'Cavaleiros',
    epithet: 'A Nobreza de Aço',
    motto: 'Honra é a nossa armadura',
    color: '#34508a',
    accent: '#e8d07a',
    summary:
      'Nobres de mundos feudais que pilotam máquinas de guerra colossais. Cada Cavaleiro carrega séculos de linhagem, honra e ressentimento.',
    lore: [
      'Ao ascender no Trono Mecânico, o piloto funde sua mente com a máquina e com os ecos de todos que a pilotaram antes.',
      'As Casas nobres juram lealdade ao Imperium ou ao Mechanicus. Em batalha, formam lanças de aço que esmagam tanques como brinquedos.',
    ],
    quote: {
      text: 'Meus antepassados caminham comigo. Cada passo é um juramento.',
      author: 'Herdeiro de uma Casa Nobre',
    },
    stats: [
      { label: 'Fé', value: 60 },
      { label: 'Força', value: 97 },
      { label: 'Tecnologia', value: 84 },
      { label: 'Números', value: 18 },
      { label: 'Mobilidade', value: 58 },
    ],
    facts: [
      { label: 'Piloto', value: 'Nobre herdeiro' },
      { label: 'Interface', value: 'Trono Mecânico' },
      { label: 'Linhagem', value: 'Casas Nobres' },
      { label: 'Altura', value: '~12 metros' },
    ],
    timeline: [
      { era: 'M22', title: 'Colonização', text: 'Os primeiros Cavaleiros protegem colônias distantes na Era Sombria.' },
      { era: 'M30', title: 'Redescoberta', text: 'A Grande Cruzada reencontra os mundos feudais e suas Casas.' },
      { era: 'M31', title: 'Juramentos', text: 'As Casas escolhem entre Terra e Marte.' },
      { era: 'M42', title: 'As Lanças', text: 'Cavaleiros marcham ao lado da cruzada de reconquista.' },
    ],
  },
  {
    slug: 'officio-assassinorum',
    glyph: 'assassinorum',
    name: 'Officio Assassinorum',
    short: 'Assassinorum',
    epithet: 'A Lâmina Oculta',
    motto: 'Um tiro. Uma guerra encerrada.',
    color: '#24242c',
    accent: '#9fb3c8',
    summary:
      'Os executores secretos dos Altos Senhores de Terra. Um único agente pode decapitar uma rebelião antes que ela comece.',
    lore: [
      'O Officio é dividido em Templos, cada um com métodos próprios: o atirador perfeito, o metamorfo infiltrado, a fúria química e o vazio que apaga psíquicos.',
      'Raramente são enviados — e, quando são, a missão costuma terminar com um alvo morto e nenhuma testemunha.',
    ],
    quote: {
      text: 'Eles nunca saberão quem foi. Apenas que acabou.',
      author: 'Dito de um Templo',
    },
    stats: [
      { label: 'Fé', value: 40 },
      { label: 'Força', value: 68 },
      { label: 'Tecnologia', value: 86 },
      { label: 'Números', value: 5 },
      { label: 'Mobilidade', value: 100 },
    ],
    facts: [
      { label: 'Templos', value: 'Vindicare · Callidus · Eversor · Culexus' },
      { label: 'Comando', value: 'Altos Senhores' },
      { label: 'Método', value: 'Decapitação' },
      { label: 'Registro', value: 'Inexistente' },
    ],
    timeline: [
      { era: 'M30', title: 'Origens', text: 'Clãs de assassinos de Terra são reunidos sob uma única autoridade.' },
      { era: 'M31', title: 'A Heresia', text: 'Missões desesperadas tentam deter os traidores antes da guerra.' },
      { era: 'M33', title: 'O Expurgo', text: 'Após um golpe interno, o Officio passa a exigir aprovação unânime.' },
      { era: 'M42', title: 'Sombras da Fenda', text: 'Alvos de altíssimo valor desaparecem em silêncio.' },
    ],
  },
];

export function findFaction(slug: string | null | undefined): Faction | undefined {
  return FACTIONS.find((f) => f.slug === slug);
}
