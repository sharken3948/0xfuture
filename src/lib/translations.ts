export type LangCode = 'EN' | 'TR' | 'ES' | 'PT' | 'FR' | 'DE' | 'RU' | 'ZH' | 'HI' | 'UR' | 'YO';

export interface Language {
  code: LangCode;
  name: string;
  countryCode: string;
}

export const LANGUAGES: Language[] = [
  { code: 'EN', name: 'English',   countryCode: 'gb' },
  { code: 'TR', name: 'Türkçe',    countryCode: 'tr' },
  { code: 'ES', name: 'Español',   countryCode: 'es' },
  { code: 'PT', name: 'Português', countryCode: 'br' },
  { code: 'FR', name: 'Français',  countryCode: 'fr' },
  { code: 'DE', name: 'Deutsch',   countryCode: 'de' },
  { code: 'RU', name: 'Русский',   countryCode: 'ru' },
  { code: 'ZH', name: '中文',       countryCode: 'cn' },
  { code: 'HI', name: 'हिन्दी',     countryCode: 'in' },
  { code: 'UR', name: 'اردو',       countryCode: 'pk' },
  { code: 'YO', name: 'Yoruba',    countryCode: 'ng' },
];

export const GROQ_LANG_NAMES: Record<LangCode, string> = {
  EN: 'English',
  TR: 'Turkish',
  ES: 'Spanish',
  PT: 'Brazilian Portuguese',
  FR: 'French',
  DE: 'German',
  RU: 'Russian',
  ZH: 'Simplified Chinese',
  HI: 'Hindi',
  UR: 'Urdu',
  YO: 'Yoruba',
};

export interface T {
  tabs: {
    numerology: string;
    astrology: string;
    tarot: string;
  };
  common: {
    howDoesThisWork: string;
    history: string;
    shareOnFarcaster: string;
    tryAgain: string;
    entertainment: string;
    oracleReading: string;
    connectWallet: string;
    payingLabel: string;
    reversed: string;
    devMode: string;
    ownerFree: string;
  };
  numerology: {
    description: string;
    buttonConnected: string;
    buttonConnect: string;
    loadingLabel: string;
    howItWorks: string;
    history: string;
    resultTitle: string;
    derivedFrom: string;
    shareText: (num: number) => string;
    readAgain: string;
  };
  astrology: {
    description: string;
    buttonConnected: string;
    loadingLabel: string;
    howItWorks: string;
    history: string;
    resultTitle: string;
    firstTx: string;
    birthSign: string;
    shareText: (sign: string) => string;
  };
  tarot: {
    description: string;
    buttonConnected: string;
    loadingLabel: string;
    howItWorks: string;
    history: string;
    positions: [string, string, string];
    shareText: (cards: string) => string;
  };
}

export const TRANSLATIONS: Record<LangCode, T> = {

  EN: {
    tabs: { numerology: 'Numerology', astrology: 'Astrology', tarot: 'Tarot' },
    common: {
      howDoesThisWork: 'How does this work?',
      history: '✦ History',
      shareOnFarcaster: 'Share on Farcaster',
      tryAgain: 'Try Again',
      entertainment: 'Readings are for entertainment purposes only.',
      oracleReading: 'Oracle Reading',
      connectWallet: 'Connect Wallet',
      payingLabel: 'Awaiting payment confirmation...',
      reversed: '↑ Reversed',
      devMode: 'DEV MODE, Payment Simulated',
      ownerFree: 'OWNER, Free Reading',
    },
    numerology: {
      description: 'Every wallet holds a destiny hidden in numbers. Decode the secret and begin to illuminate your path...',
      buttonConnected: 'Reveal My Number',
      buttonConnect: 'Connect & Read',
      loadingLabel: 'Calculating your life path...',
      howItWorks: 'Your wallet address contains a unique sequence of hex numbers. We extract these values and calculate your Life Path Number using Pythagorean numerology, the same system used for thousands of years. This number is permanent, like your onchain fingerprint. It will never change.',
      history: 'Numerology dates back over 2,500 years to ancient Babylon and Egypt. Pythagoras, the Greek mathematician, formalized it around 500 BC, believing numbers were the foundation of all existence. From the Kabbalah to Renaissance scholars, numerology has been used to decode personality, destiny, and cosmic purpose. Today, your wallet address becomes your numerical identity in the onchain universe.',
      resultTitle: 'Life Path Number',
      derivedFrom: 'Derived from',
      shareText: (num) => `I just discovered my onchain Life Path Number is ${num} ✦ Find yours at 0xfuture.xyz #0xFUTURE #Base`,
      readAgain: 'Read Again',
    },
    astrology: {
      description: 'Your first transaction is your onchain birth. The stars recorded your sign that day. Claim your cosmic identity. Illuminate your path every midnight...',
      buttonConnected: 'Read My Stars',
      loadingLabel: 'Consulting the stars...',
      howItWorks: 'Your zodiac sign is determined by the exact date your wallet was first created onchain. Just like a birth chart, this moment is permanent and your onchain birth sign never changes. However, the cosmic interpretation evolves daily, giving you fresh guidance every single day based on current planetary alignments.',
      history: 'Astrology is one of humanity\'s oldest sciences, originating in Mesopotamia over 3,000 years ago. The Babylonians mapped the first zodiac around 700 BC. Ancient Egyptians, Greeks, and Romans all relied on celestial charts to guide decisions. From Ptolemy\'s Tetrabiblos to modern psychological astrology, the belief that the stars influence our path has endured across every civilization.',
      resultTitle: 'Your Onchain Zodiac',
      firstTx: 'First TX:',
      birthSign: 'Onchain Birth Sign',
      shareText: (sign) => `My onchain birth sign is ${sign} ✦ Discover yours at 0xfuture.xyz #0xFUTURE #Base`,
    },
    tarot: {
      description: 'Your wallet and today\'s energy choose your cards. A new reading awaits at midnight...',
      buttonConnected: 'Let The Cards Speak',
      loadingLabel: 'The cards are being drawn...',
      howItWorks: 'Each day, 3 cards are drawn from a full 78 card Rider Waite deck. The selection is uniquely seeded by your wallet address combined with today\'s date, making your reading personal to you. Cards reset at midnight UTC, reflecting the energy of each new day. The three positions reveal your Past, Present, and Future.',
      history: 'Tarot cards originated in 15th century northern Italy as playing cards. By the 18th century, French occultists began using them for divination. The iconic Rider Waite deck illustrated by Pamela Colman Smith in 1909 became the world standard and is the deck used here. Today tarot is practiced by millions worldwide as a tool for reflection, intuition and self discovery.',
      positions: ['Past', 'Present', 'Future'],
      shareText: (cards) => `My onchain tarot reading for today: ${cards} ✦ Get yours at 0xfuture.xyz #0xFUTURE #Base`,
    },
  },

  TR: {
    tabs: { numerology: 'Numeroloji', astrology: 'Astroloji', tarot: 'Tarot' },
    common: {
      howDoesThisWork: 'Bu nasıl çalışır?',
      history: '✦ Tarih',
      shareOnFarcaster: "Farcaster'da Paylaş",
      tryAgain: 'Tekrar Dene',
      entertainment: 'Okumalar yalnızca eğlence amaçlıdır.',
      oracleReading: 'Kehanet Okuma',
      connectWallet: 'Cüzdanı Bağla',
      payingLabel: 'Ödeme onayı bekleniyor...',
      reversed: '↑ Tersine',
      devMode: 'GELİŞTİRİCİ MODU, Ödeme Simüle Edildi',
      ownerFree: 'SAHİP, Ücretsiz Okuma',
    },
    numerology: {
      description: 'Her cüzdan sayılarda gizli bir kader taşır. Sırrı çöz ve yolunu aydınlatmaya başla...',
      buttonConnected: 'Sayımı Aç',
      buttonConnect: 'Bağlan & Oku',
      loadingLabel: 'Yaşam yolunuz hesaplanıyor...',
      howItWorks: 'Cüzdan adresiniz benzersiz bir hex sayı dizisi içerir. Bu değerleri çıkararak binlerce yıldır kullanılan Pisagor numerolojisi sistemiyle Yaşam Yolu Numaranızı hesaplıyoruz. Bu sayı onchain parmak iziniz gibi kalıcıdır. Asla değişmeyecek.',
      history: 'Numeroloji 2.500 yılı aşkın bir süre önce antik Babil ve Mısır dönemlerine dayanır. Yunanlı matematikçi Pisagor MÖ 500 civarında sayıların tüm varoluşun temeli olduğuna inanarak bunu resmileştirdi. Kabala\'dan Rönesans bilginlerine kadar numeroloji kişilik, kader ve kozmik amacı çözmek için kullanılmıştır. Bugün cüzdan adresiniz onchain evrendeki sayısal kimliğiniz haline geliyor.',
      resultTitle: 'Yaşam Yolu Sayısı',
      derivedFrom: 'Türetilen',
      shareText: (num) => `Onchain Yaşam Yolu Numaram ${num} olduğunu yeni keşfettim ✦ Seninkini bul 0xfuture.xyz #0xFUTURE #Base`,
      readAgain: 'Tekrar Oku',
    },
    astrology: {
      description: 'İlk işleminiz onchain doğumunuzdur. O gün yıldızlar burcunuzu kaydetti. Kozmik kimliğini sahiplen. Yolunu her gece yarısı aydınlat...',
      buttonConnected: 'Yıldızlarımı Oku',
      loadingLabel: 'Yıldızlara danışılıyor...',
      howItWorks: 'Zodyak işaretiniz cüzdanınızın ilk kez onchain\'de oluşturulduğu kesin tarihe göre belirlenir. Doğum haritasında olduğu gibi bu an kalıcıdır ve onchain doğum işaretiniz asla değişmez. Ancak kozmik yorum günlük olarak gelişir ve mevcut gezegen dizilişlerine göre her gün size taze rehberlik sunar.',
      history: 'Astroloji insanlığın en eski bilimlerinden biridir ve 3.000 yılı aşkın bir süre önce Mezopotamya\'da ortaya çıkmıştır. Babilliler MÖ 700 civarında ilk zodyağı haritaladı. Antik Mısırlılar Yunanlılar ve Romalılar kararlarına rehberlik etmek için gök çizelgelerine güvendiler. Ptolemaios\'un Tetrabiblos\'undan modern psikolojik astrolojiye kadar yıldızların yolumuzu etkilediğine dair inanç her uygarlıkta süregelmiştir.',
      resultTitle: 'Onchain Zodyakınız',
      firstTx: 'İlk İşlem:',
      birthSign: 'Onchain Doğum Burcu',
      shareText: (sign) => `Onchain doğum burcum ${sign} ✦ Seninkini keşfet 0xfuture.xyz #0xFUTURE #Base`,
    },
    tarot: {
      description: 'Cüzdanınız ve bugünün enerjisi kartlarınızı seçer. Gece yarısında yeni bir okuma sizi bekliyor...',
      buttonConnected: 'Kartlar Konuşsun',
      loadingLabel: 'Kartlar çekiliyor...',
      howItWorks: 'Her gün tam bir 78 kartlık Rider Waite destesinden 3 kart çekilir. Seçim bugünün tarihiyle birleştirilmiş cüzdan adresinizle benzersiz biçimde belirlenir ve okumayı size özel kılar. Kartlar UTC gece yarısında sıfırlanır ve her yeni günün enerjisini yansıtır. Üç pozisyon Geçmişinizi Şimdinizi ve Geleceğinizi ortaya koyar.',
      history: 'Tarot kartları 15. yüzyılda Kuzey İtalya\'da oyun kartları olarak ortaya çıktı. 18. yüzyılda Fransız okültistler onları kehanet için kullanmaya başladı. 1909\'da Pamela Colman Smith tarafından illüstre edilen ikonik Rider Waite destesi dünya standardı haline geldi ve burada kullanılan deste budur. Bugün tarot dünya genelinde milyonlarca kişi tarafından yansıtma sezgi ve öz keşif aracı olarak uygulanmaktadır.',
      positions: ['Geçmiş', 'Şimdiki', 'Gelecek'],
      shareText: (cards) => `Bugünkü onchain tarot okuması: ${cards} ✦ Seninki için 0xfuture.xyz #0xFUTURE #Base`,
    },
  },

  ES: {
    tabs: { numerology: 'Numerología', astrology: 'Astrología', tarot: 'Tarot' },
    common: {
      howDoesThisWork: '¿Cómo funciona esto?',
      history: '✦ Historia',
      shareOnFarcaster: 'Compartir en Farcaster',
      tryAgain: 'Intentar de Nuevo',
      entertainment: 'Las lecturas son solo para fines de entretenimiento.',
      oracleReading: 'Lectura del Oráculo',
      connectWallet: 'Conectar Billetera',
      payingLabel: 'Esperando confirmación de pago...',
      reversed: '↑ Invertida',
      devMode: 'MODO DEV, Pago Simulado',
      ownerFree: 'PROPIETARIO, Lectura Gratis',
    },
    numerology: {
      description: 'Cada billetera esconde un destino en los números. Descifra el secreto e ilumina tu camino...',
      buttonConnected: 'Revelar Mi Número',
      buttonConnect: 'Conectar & Leer',
      loadingLabel: 'Calculando tu camino de vida...',
      howItWorks: 'Tu dirección de billetera contiene una secuencia única de números hexadecimales. Extraemos estos valores y calculamos tu Número del Camino de Vida usando la numerología pitagórica, el mismo sistema usado por miles de años. Este número es permanente como tu huella digital onchain. Nunca cambiará.',
      history: 'La numerología se remonta más de 2.500 años a la antigua Babilonia y Egipto. Pitágoras el matemático griego la formalizó alrededor del 500 a.C. creyendo que los números eran la base de toda existencia. Desde la Cábala hasta los eruditos del Renacimiento la numerología se ha utilizado para descifrar la personalidad el destino y el propósito cósmico. Hoy tu dirección de billetera se convierte en tu identidad numérica en el universo onchain.',
      resultTitle: 'Número del Camino de Vida',
      derivedFrom: 'Derivado de',
      shareText: (num) => `Acabo de descubrir que mi Número del Camino de Vida onchain es ${num} ✦ Encuentra el tuyo en 0xfuture.xyz #0xFUTURE #Base`,
      readAgain: 'Leer de Nuevo',
    },
    astrology: {
      description: 'Tu primera transacción es tu nacimiento onchain. Las estrellas registraron tu signo ese día. Reclama tu identidad cósmica. Ilumina tu camino cada medianoche...',
      buttonConnected: 'Leer Mis Estrellas',
      loadingLabel: 'Consultando las estrellas...',
      howItWorks: 'Tu signo del zodiaco está determinado por la fecha exacta en que tu billetera fue creada por primera vez onchain. Al igual que una carta natal este momento es permanente y tu signo de nacimiento onchain nunca cambia. Sin embargo la interpretación cósmica evoluciona diariamente dándote orientación fresca cada día según las alineaciones planetarias actuales.',
      history: 'La astrología es una de las ciencias más antiguas de la humanidad originándose en Mesopotamia hace más de 3.000 años. Los babilonios trazaron el primer zodíaco alrededor del 700 a.C. Los antiguos egipcios griegos y romanos dependían de las cartas celestiales para guiar sus decisiones. Desde el Tetrabiblos de Ptolomeo hasta la astrología psicológica moderna la creencia de que las estrellas influyen en nuestro camino ha perdurado en toda civilización.',
      resultTitle: 'Tu Zodiaco Onchain',
      firstTx: 'Primera TX:',
      birthSign: 'Signo de Nacimiento Onchain',
      shareText: (sign) => `Mi signo de nacimiento onchain es ${sign} ✦ Descubre el tuyo en 0xfuture.xyz #0xFUTURE #Base`,
    },
    tarot: {
      description: 'Tu billetera y la energía de hoy eligen tus cartas. Una nueva lectura te espera a medianoche...',
      buttonConnected: 'Que Hablen Las Cartas',
      loadingLabel: 'Las cartas están siendo reveladas...',
      howItWorks: 'Cada día se extraen 3 cartas de una baraja completa de 78 cartas del Rider Waite. La selección se genera únicamente a partir de tu dirección de billetera combinada con la fecha de hoy haciendo tu lectura personal. Las cartas se reinician a medianoche UTC reflejando la energía de cada nuevo día. Las tres posiciones revelan tu Pasado Presente y Futuro.',
      history: 'Las cartas del tarot se originaron en el norte de Italia del siglo XV como cartas de juego. Para el siglo XVIII los ocultistas franceses comenzaron a usarlas para la adivinación. La icónica baraja Rider Waite ilustrada por Pamela Colman Smith en 1909 se convirtió en el estándar mundial y es la baraja utilizada aquí. Hoy el tarot es practicado por millones en todo el mundo como herramienta de reflexión intuición y autodescubrimiento.',
      positions: ['Pasado', 'Presente', 'Futuro'],
      shareText: (cards) => `Mi lectura de tarot onchain de hoy: ${cards} ✦ Obtén la tuya en 0xfuture.xyz #0xFUTURE #Base`,
    },
  },

  PT: {
    tabs: { numerology: 'Numerologia', astrology: 'Astrologia', tarot: 'Tarot' },
    common: {
      howDoesThisWork: 'Como isso funciona?',
      history: '✦ História',
      shareOnFarcaster: 'Compartilhar no Farcaster',
      tryAgain: 'Tentar Novamente',
      entertainment: 'As leituras são apenas para fins de entretenimento.',
      oracleReading: 'Leitura do Oráculo',
      connectWallet: 'Conectar Carteira',
      payingLabel: 'Aguardando confirmação de pagamento...',
      reversed: '↑ Invertida',
      devMode: 'MODO DEV, Pagamento Simulado',
      ownerFree: 'PROPRIETÁRIO, Leitura Grátis',
    },
    numerology: {
      description: 'Toda carteira guarda um destino oculto nos números. Desvende o segredo e ilumine seu caminho...',
      buttonConnected: 'Revelar Meu Número',
      buttonConnect: 'Conectar & Ler',
      loadingLabel: 'Calculando seu caminho de vida...',
      howItWorks: 'Seu endereço de carteira contém uma sequência única de números hexadecimais. Extraímos esses valores e calculamos seu Número do Caminho de Vida usando a numerologia pitagórica o mesmo sistema usado por milhares de anos. Este número é permanente como sua impressão digital onchain. Nunca mudará.',
      history: 'A numerologia remonta a mais de 2.500 anos para a antiga Babilônia e Egito. Pitágoras o matemático grego a formalizou por volta de 500 a.C. acreditando que os números eram a base de toda a existência. Da Cabala aos estudiosos renascentistas a numerologia tem sido usada para decifrar personalidade destino e propósito cósmico. Hoje seu endereço de carteira torna-se sua identidade numérica no universo onchain.',
      resultTitle: 'Número do Caminho de Vida',
      derivedFrom: 'Derivado de',
      shareText: (num) => `Acabei de descobrir que meu Número do Caminho de Vida onchain é ${num} ✦ Encontre o seu em 0xfuture.xyz #0xFUTURE #Base`,
      readAgain: 'Ler Novamente',
    },
    astrology: {
      description: 'Sua primeira transação é seu nascimento onchain. As estrelas registraram seu signo naquele dia. Reivindique sua identidade cósmica. Ilumine seu caminho a cada meia-noite...',
      buttonConnected: 'Ler Minhas Estrelas',
      loadingLabel: 'Consultando as estrelas...',
      howItWorks: 'Seu signo do zodíaco é determinado pela data exata em que sua carteira foi criada pela primeira vez onchain. Assim como um mapa natal esse momento é permanente e seu signo de nascimento onchain nunca muda. No entanto a interpretação cósmica evolui diariamente dando-lhe orientação fresca todos os dias com base nos alinhamentos planetários atuais.',
      history: 'A astrologia remonta a mais de 3.000 anos para a antiga Mesopotâmia. Os babilônicos mapearam o primeiro zodíaco por volta de 700 a.C. Egípcios gregos e romanos antigos confiavam em cartas celestes para orientar decisões. Do Tetrabiblos de Ptolomeu à astrologia psicológica moderna a crença de que as estrelas influenciam nosso caminho perdurou em todas as civilizações.',
      resultTitle: 'Seu Zodíaco Onchain',
      firstTx: 'Primeira TX:',
      birthSign: 'Signo de Nascimento Onchain',
      shareText: (sign) => `Meu signo de nascimento onchain é ${sign} ✦ Descubra o seu em 0xfuture.xyz #0xFUTURE #Base`,
    },
    tarot: {
      description: 'Sua carteira e a energia de hoje escolhem suas cartas. Uma nova leitura aguarda à meia-noite...',
      buttonConnected: 'Que as Cartas Falem',
      loadingLabel: 'As cartas estão sendo reveladas...',
      howItWorks: 'Todos os dias 3 cartas são retiradas de um baralho completo de 78 cartas do Rider Waite. A seleção é gerada exclusivamente pelo seu endereço de carteira combinado com a data de hoje tornando sua leitura pessoal. As cartas se reiniciam à meia-noite UTC refletindo a energia de cada novo dia. As três posições revelam seu Passado Presente e Futuro.',
      history: 'As cartas de tarot se originaram no norte da Itália do século XV como cartas de baralho. No século XVIII ocultistas franceses começaram a usá-las para adivinhação. O icônico baralho Rider Waite ilustrado por Pamela Colman Smith em 1909 tornou-se o padrão mundial e é o baralho usado aqui. Hoje o tarot é praticado por milhões em todo o mundo como ferramenta de reflexão intuição e autodescoberta.',
      positions: ['Passado', 'Presente', 'Futuro'],
      shareText: (cards) => `Minha leitura de tarot onchain de hoje: ${cards} ✦ Obtenha a sua em 0xfuture.xyz #0xFUTURE #Base`,
    },
  },

  FR: {
    tabs: { numerology: 'Numérologie', astrology: 'Astrologie', tarot: 'Tarot' },
    common: {
      howDoesThisWork: 'Comment ça fonctionne ?',
      history: '✦ Histoire',
      shareOnFarcaster: 'Partager sur Farcaster',
      tryAgain: 'Réessayer',
      entertainment: 'Les lectures sont uniquement à des fins de divertissement.',
      oracleReading: "Lecture de l'Oracle",
      connectWallet: 'Connecter le Portefeuille',
      payingLabel: 'En attente de confirmation de paiement...',
      reversed: '↑ Inversée',
      devMode: 'MODE DEV, Paiement Simulé',
      ownerFree: 'PROPRIÉTAIRE, Lecture Gratuite',
    },
    numerology: {
      description: 'Chaque portefeuille cache un destin dans les chiffres. Déchiffre le secret et éclaire ton chemin...',
      buttonConnected: 'Révéler Mon Nombre',
      buttonConnect: 'Connecter & Lire',
      loadingLabel: 'Calcul de votre chemin de vie...',
      howItWorks: "Votre adresse de portefeuille contient une séquence unique de chiffres hexadécimaux. Nous extrayons ces valeurs et calculons votre Nombre du Chemin de Vie en utilisant la numérologie pythagoricienne le même système utilisé depuis des millénaires. Ce nombre est permanent comme votre empreinte digitale onchain. Il ne changera jamais.",
      history: "La numérologie remonte à plus de 2.500 ans dans l'ancienne Babylone et l'Égypte. Pythagore le mathématicien grec l'a formalisée vers 500 avant J.C. croyant que les nombres étaient le fondement de toute existence. De la Kabbale aux érudits de la Renaissance la numérologie a été utilisée pour décoder la personnalité le destin et le but cosmique. Aujourd'hui votre adresse de portefeuille devient votre identité numérique dans l'univers onchain.",
      resultTitle: 'Nombre du Chemin de Vie',
      derivedFrom: 'Dérivé de',
      shareText: (num) => `Je viens de découvrir que mon Nombre du Chemin de Vie onchain est ${num} ✦ Trouvez le vôtre sur 0xfuture.xyz #0xFUTURE #Base`,
      readAgain: 'Relire',
    },
    astrology: {
      description: "Votre première transaction est votre naissance onchain. Les étoiles ont enregistré votre signe ce jour là. Réclamez votre identité cosmique. Illuminez votre chemin chaque minuit...",
      buttonConnected: 'Lire Mes Étoiles',
      loadingLabel: 'Consultation des étoiles...',
      howItWorks: "Votre signe du zodiaque est déterminé par la date exacte à laquelle votre portefeuille a été créé pour la première fois onchain. Tout comme un thème natal ce moment est permanent et votre signe de naissance onchain ne change jamais. Cependant l'interprétation cosmique évolue quotidiennement vous donnant de nouvelles orientations chaque jour en fonction des alignements planétaires actuels.",
      history: "L'astrologie est l'une des plus anciennes sciences de l'humanité née en Mésopotamie il y a plus de 3.000 ans. Les Babyloniens ont cartographié le premier zodiaque vers 700 avant J.C. Les anciens Égyptiens Grecs et Romains se fiaient aux cartes célestes pour guider leurs décisions. Du Tétrabiblos de Ptolémée à l'astrologie psychologique moderne la croyance que les étoiles influencent notre chemin a perduré dans toutes les civilisations.",
      resultTitle: 'Votre Zodiaque Onchain',
      firstTx: 'Première TX:',
      birthSign: 'Signe de Naissance Onchain',
      shareText: (sign) => `Mon signe de naissance onchain est ${sign} ✦ Découvrez le vôtre sur 0xfuture.xyz #0xFUTURE #Base`,
    },
    tarot: {
      description: "Votre portefeuille et l'énergie d'aujourd'hui choisissent vos cartes. Une nouvelle lecture vous attend à minuit...",
      buttonConnected: 'Que Les Cartes Parlent',
      loadingLabel: 'Les cartes sont en train d\'être tirées...',
      howItWorks: "Chaque jour 3 cartes sont tirées d'un jeu complet de 78 cartes Rider Waite. La sélection est générée uniquement à partir de votre adresse de portefeuille combinée à la date d'aujourd'hui rendant votre lecture personnelle. Les cartes se réinitialisent à minuit UTC reflétant l'énergie de chaque nouveau jour. Les trois positions révèlent votre Passé Présent et Futur.",
      history: "Les cartes de tarot sont nées dans le nord de l'Italie au XVe siècle comme cartes à jouer. Au XVIIIe siècle les occultistes français ont commencé à les utiliser pour la divination. L'emblématique jeu Rider Waite illustré par Pamela Colman Smith en 1909 est devenu la norme mondiale et c'est le jeu utilisé ici. Aujourd'hui le tarot est pratiqué par des millions de personnes dans le monde entier comme outil de réflexion d'intuition et de découverte de soi.",
      positions: ['Passé', 'Présent', 'Futur'],
      shareText: (cards) => `Ma lecture de tarot onchain d'aujourd'hui: ${cards} ✦ Obtenez la vôtre sur 0xfuture.xyz #0xFUTURE #Base`,
    },
  },

  DE: {
    tabs: { numerology: 'Numerologie', astrology: 'Astrologie', tarot: 'Tarot' },
    common: {
      howDoesThisWork: 'Wie funktioniert das?',
      history: '✦ Geschichte',
      shareOnFarcaster: 'Auf Farcaster teilen',
      tryAgain: 'Nochmal versuchen',
      entertainment: 'Lesungen dienen ausschließlich Unterhaltungszwecken.',
      oracleReading: 'Orakel Lesung',
      connectWallet: 'Wallet verbinden',
      payingLabel: 'Warte auf Zahlungsbestätigung...',
      reversed: '↑ Umgekehrt',
      devMode: 'DEV MODUS, Zahlung Simuliert',
      ownerFree: 'INHABER, Kostenlose Lesung',
    },
    numerology: {
      description: 'Jede Wallet birgt ein Schicksal in Zahlen. Entschlüssle das Geheimnis und erleuchte deinen Weg...',
      buttonConnected: 'Meine Zahl Enthüllen',
      buttonConnect: 'Verbinden & Lesen',
      loadingLabel: 'Berechnung deines Lebenswegs...',
      howItWorks: 'Deine Wallet-Adresse enthält eine einzigartige Sequenz von Hexadezimalzahlen. Wir extrahieren diese Werte und berechnen deine Lebenspfad-Zahl mit pythagoräischer Numerologie demselben System das seit Jahrtausenden verwendet wird. Diese Zahl ist permanent wie dein onchain Fingerabdruck. Sie wird sich niemals ändern.',
      history: 'Numerologie reicht über 2.500 Jahre zurück bis ins antike Babylon und Ägypten. Pythagoras der griechische Mathematiker formalisierte sie um 500 v. Chr. mit der Überzeugung dass Zahlen das Fundament aller Existenz seien. Von der Kabbala bis zu Renaissance-Gelehrten wurde Numerologie verwendet um Persönlichkeit Schicksal und kosmischen Zweck zu entschlüsseln. Heute wird deine Wallet-Adresse zu deiner numerischen Identität im Onchain-Universum.',
      resultTitle: 'Lebenspfad-Zahl',
      derivedFrom: 'Abgeleitet von',
      shareText: (num) => `Ich habe gerade meine Onchain Lebenspfad-Zahl ${num} entdeckt ✦ Finde deine auf 0xfuture.xyz #0xFUTURE #Base`,
      readAgain: 'Nochmal lesen',
    },
    astrology: {
      description: 'Deine erste Transaktion ist deine Onchain-Geburt. Die Sterne haben dein Zeichen an jenem Tag aufgezeichnet. Beanspruche deine kosmische Identität. Erhelle deinen Weg jeden Mitternacht...',
      buttonConnected: 'Meine Sterne lesen',
      loadingLabel: 'Die Sterne werden befragt...',
      howItWorks: 'Dein Tierkreiszeichen wird durch das genaue Datum bestimmt an dem deine Wallet erstmals onchain erstellt wurde. Wie ein Geburtshoroskop ist dieser Moment permanent und dein onchain Geburtszeichen ändert sich nie. Die kosmische Interpretation entwickelt sich jedoch täglich und gibt dir jeden Tag frische Führung basierend auf aktuellen planetarischen Konstellationen.',
      history: 'Astrologie ist eine der ältesten Wissenschaften der Menschheit die vor über 3.000 Jahren in Mesopotamien entstand. Die Babylonier kartographierten den ersten Tierkreis um 700 v. Chr. Alte Ägypter Griechen und Römer verließen sich auf himmlische Karten um Entscheidungen zu treffen. Vom Tetrabiblos des Ptolemäus bis zur modernen psychologischen Astrologie hat der Glaube dass die Sterne unseren Weg beeinflussen in jeder Zivilisation Bestand gehabt.',
      resultTitle: 'Dein Onchain-Tierkreis',
      firstTx: 'Erste TX:',
      birthSign: 'Onchain-Geburtszeichen',
      shareText: (sign) => `Mein Onchain-Geburtszeichen ist ${sign} ✦ Entdecke deines auf 0xfuture.xyz #0xFUTURE #Base`,
    },
    tarot: {
      description: 'Deine Wallet und die Energie des Tages wählen deine Karten. Eine neue Lesung wartet um Mitternacht...',
      buttonConnected: 'Lass die Karten sprechen',
      loadingLabel: 'Die Karten werden gezogen...',
      howItWorks: 'Jeden Tag werden 3 Karten aus einem vollständigen 78-Karten Rider Waite Deck gezogen. Die Auswahl wird einzigartig durch deine Wallet-Adresse kombiniert mit dem heutigen Datum generiert was deine Lesung persönlich macht. Die Karten werden um Mitternacht UTC zurückgesetzt und spiegeln die Energie jedes neuen Tages wider. Die drei Positionen enthüllen deine Vergangenheit Gegenwart und Zukunft.',
      history: 'Tarotkarten entstanden im 15. Jahrhundert in Norditalien als Spielkarten. Im 18. Jahrhundert begannen französische Okkultisten sie für die Weissagung zu verwenden. Das ikonische Rider Waite Deck illustriert von Pamela Colman Smith im Jahr 1909 wurde zum weltweiten Standard und ist das hier verwendete Deck. Heute wird Tarot von Millionen weltweit als Werkzeug zur Reflexion Intuition und Selbstentdeckung praktiziert.',
      positions: ['Vergangenheit', 'Gegenwart', 'Zukunft'],
      shareText: (cards) => `Meine Onchain Tarot Lesung für heute: ${cards} ✦ Hol deine auf 0xfuture.xyz #0xFUTURE #Base`,
    },
  },

  RU: {
    tabs: { numerology: 'Нумерология', astrology: 'Астрология', tarot: 'Таро' },
    common: {
      howDoesThisWork: 'Как это работает?',
      history: '✦ История',
      shareOnFarcaster: 'Поделиться в Farcaster',
      tryAgain: 'Попробовать снова',
      entertainment: 'Чтения предназначены только для развлекательных целей.',
      oracleReading: 'Чтение Оракула',
      connectWallet: 'Подключить кошелёк',
      payingLabel: 'Ожидание подтверждения оплаты...',
      reversed: '↑ Перевёрнутая',
      devMode: 'РЕЖ. РАЗРАБОТКИ, Оплата Симулирована',
      ownerFree: 'ВЛАДЕЛЕЦ, Бесплатное Чтение',
    },
    numerology: {
      description: 'В каждом кошельке скрыта судьба зашифрованная в числах. Раскрой секрет и освети свой путь...',
      buttonConnected: 'Раскрыть Моё Число',
      buttonConnect: 'Подключить & Читать',
      loadingLabel: 'Вычисление вашего жизненного пути...',
      howItWorks: 'Ваш адрес кошелька содержит уникальную последовательность шестнадцатеричных чисел. Мы извлекаем эти значения и вычисляем ваше Число Жизненного Пути с помощью пифагорейской нумерологии той же системы которая используется тысячелетиями. Это число постоянно как ваш онлайн отпечаток пальца. Оно никогда не изменится.',
      history: 'Нумерология восходит к более чем 2500 годам в древнем Вавилоне и Египте. Пифагор греческий математик формализовал её около 500 г. до н.э. полагая что числа являются основой всего существования. От Каббалы до учёных эпохи Возрождения нумерология использовалась для расшифровки личности судьбы и космической цели. Сегодня адрес вашего кошелька становится вашей числовой идентичностью в онлайн вселенной.',
      resultTitle: 'Число Жизненного Пути',
      derivedFrom: 'Производное от',
      shareText: (num) => `Я только что обнаружил своё Число Жизненного Пути онлайн: ${num} ✦ Найдите своё на 0xfuture.xyz #0xFUTURE #Base`,
      readAgain: 'Читать снова',
    },
    astrology: {
      description: 'Ваша первая транзакция это ваше ончейн рождение. Звёзды записали ваш знак в тот день. Примите вашу космическую идентичность. Освещайте свой путь каждую полночь...',
      buttonConnected: 'Читать мои Звёзды',
      loadingLabel: 'Консультация со звёздами...',
      howItWorks: 'Ваш знак зодиака определяется точной датой когда ваш кошелёк был впервые создан в сети. Как и натальная карта этот момент постоянен и ваш онлайн знак рождения никогда не меняется. Однако космическая интерпретация развивается ежедневно давая вам свежие указания каждый день на основе текущих планетарных конфигураций.',
      history: 'Астрология одна из древнейших наук человечества зародившаяся в Месопотамии более 3000 лет назад. Вавилоняне составили первый зодиак около 700 г. до н.э. Древние египтяне греки и римляне полагались на небесные карты для принятия решений. От Тетрабиблоса Птолемея до современной психологической астрологии вера в то что звёзды влияют на наш путь сохранялась во всех цивилизациях.',
      resultTitle: 'Ваш Ончейн Зодиак',
      firstTx: 'Первая TX:',
      birthSign: 'Ончейн Знак Рождения',
      shareText: (sign) => `Мой ончейн знак рождения ${sign} ✦ Узнайте свой на 0xfuture.xyz #0xFUTURE #Base`,
    },
    tarot: {
      description: 'Ваш кошелёк и энергия сегодняшнего дня выбирают ваши карты. Новое чтение ждёт вас в полночь...',
      buttonConnected: 'Пусть Карты Говорят',
      loadingLabel: 'Карты раскрываются...',
      howItWorks: 'Каждый день из полной колоды Райдера Уэйта из 78 карт вытягиваются 3 карты. Выбор уникально формируется вашим адресом кошелька в сочетании с сегодняшней датой делая чтение личным для вас. Карты обнуляются в полночь по UTC отражая энергию каждого нового дня. Три позиции раскрывают ваше Прошлое Настоящее и Будущее.',
      history: 'Карты Таро возникли в 15 веке в Северной Италии как игральные карты. К 18 веку французские оккультисты начали использовать их для гадания. Культовая колода Райдера Уэйта проиллюстрированная Памелой Колман Смит в 1909 году стала мировым стандартом и является колодой используемой здесь. Сегодня Таро практикуют миллионы людей по всему миру как инструмент для размышлений интуиции и самопознания.',
      positions: ['Прошлое', 'Настоящее', 'Будущее'],
      shareText: (cards) => `Моё ончейн таро чтение сегодня: ${cards} ✦ Получите своё на 0xfuture.xyz #0xFUTURE #Base`,
    },
  },

  ZH: {
    tabs: { numerology: '数字命理', astrology: '占星术', tarot: '塔罗' },
    common: {
      howDoesThisWork: '这是如何工作的？',
      history: '✦ 历史',
      shareOnFarcaster: '分享到 Farcaster',
      tryAgain: '再试一次',
      entertainment: '解读仅供娱乐目的。',
      oracleReading: '神谕解读',
      connectWallet: '连接钱包',
      payingLabel: '等待付款确认...',
      reversed: '↑ 逆位',
      devMode: '开发模式, 付款已模拟',
      ownerFree: '所有者, 免费解读',
    },
    numerology: {
      description: '每个钱包都藏着数字中隐秘的命运。解读秘密开始照亮你的道路...',
      buttonConnected: '揭示我的数字',
      buttonConnect: '连接并阅读',
      loadingLabel: '正在计算你的生命路径...',
      howItWorks: '您的钱包地址包含独特的十六进制数字序列。我们提取这些值使用毕达哥拉斯数字命理学计算您的生命路径数这一系统已使用了数千年。这个数字是永久的就像您的链上指纹。它永远不会改变。',
      history: '数字命理学可追溯至2500多年前的古巴比伦和埃及。希腊数学家毕达哥拉斯在公元前500年将其系统化他相信数字是所有存在的基础。从卡巴拉到文艺复兴学者数字命理学一直被用于解读个性命运和宇宙目的。今天您的钱包地址成为了链上宇宙中您的数字身份。',
      resultTitle: '生命路径数',
      derivedFrom: '来自',
      shareText: (num) => `我刚发现我的链上生命路径数是 ${num} ✦ 在 0xfuture.xyz 发现你的 #0xFUTURE #Base`,
      readAgain: '再次阅读',
    },
    astrology: {
      description: '您的第一笔交易是您的链上诞生。那天星辰记录了您的星座。认领您的宇宙身份。每个午夜照亮您的道路...',
      buttonConnected: '解读我的星象',
      loadingLabel: '正在咨询星象...',
      howItWorks: '您的星座由您的钱包首次在链上创建的确切日期决定。就像星盘一样这个时刻是永久的您的链上出生星座永不改变。然而宇宙解读每天都在演变根据当前行星排列每天为您提供新的指引。',
      history: '占星术是人类最古老的科学之一起源于3000多年前的美索不达米亚。巴比伦人在公元前700年左右绘制了第一个黄道。古埃及人希腊人和罗马人都依靠星象图来指导决策。从托勒密的占星四书到现代心理占星学星辰影响我们命运的信念在每一个文明中都延续至今。',
      resultTitle: '你的链上星座',
      firstTx: '首次交易：',
      birthSign: '链上出生星座',
      shareText: (sign) => `我的链上出生星座是 ${sign} ✦ 在 0xfuture.xyz 发现你的 #0xFUTURE #Base`,
    },
    tarot: {
      description: '您的钱包和今日能量为您选牌。每天午夜等待新的解读...',
      buttonConnected: '让牌说话',
      loadingLabel: '牌正在被抽取...',
      howItWorks: '每天从完整的78张牌骑士韦特牌组中抽取3张牌。选择由您的钱包地址与今日日期组合唯一确定使您的解读专属于您。牌在UTC午夜重置反映每个新日的能量。三个位置揭示您的过去现在和未来。',
      history: '塔罗牌起源于15世纪北意大利的纸牌游戏。到18世纪法国神秘主义者开始将其用于占卜。1909年由帕梅拉科尔曼史密斯绘制的标志性骑士韦特牌组成为世界标准也是本处使用的牌组。如今塔罗被全球数百万人用作反思直觉和自我发现的工具。',
      positions: ['过去', '现在', '未来'],
      shareText: (cards) => `我今天的链上塔罗解读: ${cards} ✦ 在 0xfuture.xyz 获取你的 #0xFUTURE #Base`,
    },
  },

  HI: {
    tabs: { numerology: 'अंकज्योतिष', astrology: 'ज्योतिष', tarot: 'टैरो' },
    common: {
      howDoesThisWork: 'यह कैसे काम करता है?',
      history: '✦ इतिहास',
      shareOnFarcaster: 'Farcaster पर शेयर करें',
      tryAgain: 'फिर से प्रयास करें',
      entertainment: 'पाठ केवल मनोरंजन प्रयोजनों के लिए हैं।',
      oracleReading: 'दैवज्ञ पाठ',
      connectWallet: 'वॉलेट कनेक्ट करें',
      payingLabel: 'भुगतान पुष्टि की प्रतीक्षा...',
      reversed: '↑ उल्टा',
      devMode: 'डेव मोड, भुगतान सिमुलेटेड',
      ownerFree: 'मालिक, मुफ्त पाठ',
    },
    numerology: {
      description: 'हर वॉलेट में संख्याओं में छिपी एक नियति है। रहस्य को सुलझाओ और अपना मार्ग प्रशस्त करो...',
      buttonConnected: 'मेरा नंबर प्रकट करें',
      buttonConnect: 'कनेक्ट करें और पढ़ें',
      loadingLabel: 'आपका जीवन पथ गणना हो रही है...',
      howItWorks: 'आपके वॉलेट पते में हेक्स संख्याओं का एक अनोखा क्रम है। हम इन मूल्यों को निकालकर पायथागोरियन अंकज्योतिष का उपयोग करके आपका जीवन पथ संख्या की गणना करते हैं जो हजारों वर्षों से उपयोग की जाती है। यह संख्या स्थायी है जैसे आपका ऑनचेन फिंगरप्रिंट। यह कभी नहीं बदलेगी।',
      history: 'अंकज्योतिष 2500 से अधिक वर्षों पहले प्राचीन बेबीलोन और मिस्र से आता है। यूनानी गणितज्ञ पाइथागोरस ने लगभग 500 ईसा पूर्व इसे औपचारिक रूप दिया यह मानते हुए कि संख्याएं सभी अस्तित्व का आधार हैं। कबाला से लेकर पुनर्जागरण के विद्वानों तक अंकज्योतिष का उपयोग व्यक्तित्व भाग्य और ब्रह्मांडीय उद्देश्य को समझने के लिए किया गया है। आज आपका वॉलेट पता ऑनचेन ब्रह्मांड में आपकी संख्यात्मक पहचान बन जाता है।',
      resultTitle: 'जीवन पथ संख्या',
      derivedFrom: 'से व्युत्पन्न',
      shareText: (num) => `मैंने अभी खोजा कि मेरा ऑनचेन जीवन पथ संख्या ${num} है ✦ अपना खोजें 0xfuture.xyz पर #0xFUTURE #Base`,
      readAgain: 'फिर से पढ़ें',
    },
    astrology: {
      description: 'आपका पहला लेनदेन आपका ऑनचेन जन्म है। उस दिन सितारों ने आपकी राशि दर्ज की। अपनी ब्रह्मांडीय पहचान को स्वीकार करें। हर आधी रात अपना मार्ग प्रकाशित करें...',
      buttonConnected: 'मेरे सितारे पढ़ें',
      loadingLabel: 'सितारों से परामर्श...',
      howItWorks: 'आपकी राशि उस सटीक तारीख से निर्धारित होती है जब आपका वॉलेट पहली बार ऑनचेन बनाया गया था। जन्म कुंडली की तरह यह पल स्थायी है और आपकी ऑनचेन जन्म राशि कभी नहीं बदलती। हालांकि ब्रह्मांडीय व्याख्या प्रतिदिन विकसित होती है जो वर्तमान ग्रहीय संरेखण के आधार पर आपको हर दिन ताजा मार्गदर्शन देती है।',
      history: 'ज्योतिष मानवजाति के सबसे पुराने विज्ञानों में से एक है जो 3000 से अधिक वर्ष पहले मेसोपोटामिया में उत्पन्न हुआ। बेबीलोनियों ने लगभग 700 ईसा पूर्व पहला राशिचक्र बनाया। प्राचीन मिस्रवासी यूनानी और रोमन सभी निर्णयों को मार्गदर्शन देने के लिए आकाशीय चित्रों पर निर्भर थे। टॉलेमी के टेट्राबिब्लोस से आधुनिक मनोवैज्ञानिक ज्योतिष तक यह विश्वास कि सितारे हमारे मार्ग को प्रभावित करते हैं हर सभ्यता में बना रहा।',
      resultTitle: 'आपकी ऑनचेन राशि',
      firstTx: 'पहला TX:',
      birthSign: 'ऑनचेन जन्म राशि',
      shareText: (sign) => `मेरी ऑनचेन जन्म राशि ${sign} है ✦ अपनी खोजें 0xfuture.xyz पर #0xFUTURE #Base`,
    },
    tarot: {
      description: 'आपका वॉलेट और आज की ऊर्जा आपके पत्ते चुनती है। आधी रात को एक नया पाठ इंतजार करता है...',
      buttonConnected: 'पत्तों को बोलने दो',
      loadingLabel: 'पत्ते खींचे जा रहे हैं...',
      howItWorks: 'प्रत्येक दिन पूरे 78 पत्तों के राइडर वेट डेक से 3 पत्ते निकाले जाते हैं। चयन आपके वॉलेट पते के साथ आज की तारीख के संयोजन से अनोखे रूप से तय होता है जो आपके पाठ को आपके लिए व्यक्तिगत बनाता है। पत्ते UTC आधी रात को रीसेट होते हैं जो हर नए दिन की ऊर्जा को दर्शाते हैं। तीन स्थितियाँ आपके अतीत वर्तमान और भविष्य को प्रकट करती हैं।',
      history: 'टैरो पत्ते 15वीं शताब्दी के उत्तरी इटली में खेल के पत्तों के रूप में उत्पन्न हुए। 18वीं शताब्दी तक फ्रांसीसी रहस्यवादियों ने उन्हें भविष्यवाणी के लिए उपयोग करना शुरू किया। 1909 में पमेला कोलमैन स्मिथ द्वारा सचित्र प्रतिष्ठित राइडर वेट डेक विश्व मानक बन गया और यहाँ उपयोग किया जाने वाला डेक है। आज टैरो दुनिया भर में लाखों लोगों द्वारा प्रतिबिंब अंतर्ज्ञान और आत्म खोज के साधन के रूप में प्रचलित है।',
      positions: ['अतीत', 'वर्तमान', 'भविष्य'],
      shareText: (cards) => `आज मेरा ऑनचेन टैरो पाठ: ${cards} ✦ अपना प्राप्त करें 0xfuture.xyz पर #0xFUTURE #Base`,
    },
  },

  UR: {
    tabs: { numerology: 'نمرولوجی', astrology: 'علم نجوم', tarot: 'ٹیرو' },
    common: {
      howDoesThisWork: 'یہ کیسے کام کرتا ہے؟',
      history: '✦ تاریخ',
      shareOnFarcaster: 'Farcaster پر شیئر کریں',
      tryAgain: 'دوبارہ کوشش کریں',
      entertainment: 'قرأتیں صرف تفریحی مقاصد کے لیے ہیں۔',
      oracleReading: 'پیشین گوئی',
      connectWallet: 'والیٹ کنیکٹ کریں',
      payingLabel: 'ادائیگی کی تصدیق کا انتظار...',
      reversed: '↑ الٹا',
      devMode: 'ڈیو موڈ, ادائیگی سمولیٹڈ',
      ownerFree: 'مالک, مفت قرأت',
    },
    numerology: {
      description: 'ہر والیٹ میں اعداد میں پوشیدہ ایک مقدر ہے۔ راز کو سمجھو اور اپنا راستہ روشن کرو...',
      buttonConnected: 'میرا نمبر ظاہر کریں',
      buttonConnect: 'کنیکٹ کریں اور پڑھیں',
      loadingLabel: 'آپ کا راستہ حیات حساب کیا جا رہا ہے...',
      howItWorks: 'آپ کے والیٹ پتے میں hex اعداد کی ایک منفرد ترتیب ہے۔ ہم ان اقدار کو نکال کر فیثا غورث عددیات کا استعمال کرتے ہوئے آپ کا زندگی کا راستہ نمبر حساب کرتے ہیں یہی وہ نظام ہے جو ہزاروں سالوں سے استعمال ہو رہا ہے۔ یہ نمبر مستقل ہے آپ کے آن چین فنگر پرنٹ کی طرح۔ یہ کبھی نہیں بدلے گا۔',
      history: 'عددیات 2500 سے زیادہ سال پہلے قدیم بابل اور مصر سے شروع ہوئی۔ یونانی ریاضی دان فیثا غورث نے تقریباً 500 قبل مسیح میں اسے باقاعدہ شکل دی یہ یقین رکھتے ہوئے کہ اعداد تمام وجود کی بنیاد ہیں۔ کبالا سے لے کر نشاۃ ثانیہ کے علماء تک عددیات کو شخصیت مقدر اور کائناتی مقصد کو سمجھنے کے لیے استعمال کیا گیا ہے۔ آج آپ کا والیٹ پتہ آن چین کائنات میں آپ کی عددی شناخت بن جاتا ہے۔',
      resultTitle: 'زندگی کا راستہ نمبر',
      derivedFrom: 'سے ماخوذ',
      shareText: (num) => `میں نے ابھی دریافت کیا کہ میرا آن چین لائف پاتھ نمبر ${num} ہے ✦ اپنا تلاش کریں 0xfuture.xyz پر #0xFUTURE #Base`,
      readAgain: 'دوبارہ پڑھیں',
    },
    astrology: {
      description: 'آپ کا پہلا لین دین آپ کی آن چین پیدائش ہے۔ اس دن ستاروں نے آپ کی علامت درج کی۔ اپنی کائناتی شناخت کا دعوی کریں۔ ہر آدھی رات اپنا راستہ روشن کریں...',
      buttonConnected: 'میرے ستارے پڑھیں',
      loadingLabel: 'ستاروں سے مشورہ...',
      howItWorks: 'آپ کی زودیاکی علامت اس درست تاریخ سے طے ہوتی ہے جب آپ کا والیٹ پہلی بار آن چین بنایا گیا تھا۔ پیدائشی کنڈلی کی طرح یہ لمحہ دائمی ہے اور آپ کی آن چین پیدائشی علامت کبھی نہیں بدلتی۔ تاہم کائناتی تعبیر روزانہ ارتقاء پذیر ہوتی ہے موجودہ سیاروں کی ترتیب کی بنیاد پر آپ کو ہر روز نئی رہنمائی فراہم کرتی ہے۔',
      history: 'علم نجوم انسانیت کے قدیم ترین علوم میں سے ایک ہے جو 3000 سال سے زیادہ پہلے میسوپوٹامیا میں پیدا ہوا۔ بابلیوں نے تقریباً 700 قبل مسیح میں پہلا زودیاک بنایا۔ قدیم مصری یونانی اور رومی سب فیصلوں کی رہنمائی کے لیے فلکی نقشوں پر انحصار کرتے تھے۔ بطلیموس کی ٹیٹرابیبلوس سے لے کر جدید نفسیاتی علم نجوم تک یہ عقیدہ کہ ستارے ہمارے راستے کو متاثر کرتے ہیں ہر تہذیب میں برقرار رہا۔',
      resultTitle: 'آپ کا آن چین زودیاک',
      firstTx: 'پہلا TX:',
      birthSign: 'آن چین پیدائشی نشان',
      shareText: (sign) => `میری آن چین پیدائشی علامت ${sign} ہے ✦ اپنی دریافت کریں 0xfuture.xyz پر #0xFUTURE #Base`,
    },
    tarot: {
      description: 'آپ کا والیٹ اور آج کی توانائی آپ کے پتے منتخب کرتی ہے۔ آدھی رات کو ایک نئی قرأت منتظر ہے...',
      buttonConnected: 'پتوں کو بولنے دیں',
      loadingLabel: 'پتے نکالے جا رہے ہیں...',
      howItWorks: 'ہر روز مکمل 78 پتوں کے رائیڈر ویٹ ڈیک سے 3 پتے نکالے جاتے ہیں۔ انتخاب آج کی تاریخ کے ساتھ آپ کے والیٹ پتے کے امتزاج سے منفرد طور پر طے ہوتا ہے جو آپ کی قرأت کو آپ کے لیے ذاتی بناتا ہے۔ پتے UTC آدھی رات کو ری سیٹ ہوتے ہیں ہر نئے دن کی توانائی کی عکاسی کرتے ہیں۔ تین مقامات آپ کے ماضی حال اور مستقبل کو ظاہر کرتے ہیں۔',
      history: 'ٹیرو پتے 15ویں صدی میں شمالی اٹلی میں کھیل کے پتوں کے طور پر پیدا ہوئے۔ 18ویں صدی تک فرانسیسی اوکلٹسٹوں نے انہیں پیشگوئی کے لیے استعمال کرنا شروع کیا۔ 1909 میں پمیلا کولمین اسمتھ کی طرف سے مصور مشہور رائیڈر ویٹ ڈیک عالمی معیار بن گیا اور یہی وہ ڈیک ہے جو یہاں استعمال ہوتا ہے۔ آج ٹیرو دنیا بھر میں لاکھوں لوگ غور و فکر وجدان اور خود دریافت کے آلے کے طور پر استعمال کرتے ہیں۔',
      positions: ['ماضی', 'حال', 'مستقبل'],
      shareText: (cards) => `آج میری آن چین ٹیرو قرأت: ${cards} ✦ اپنا حاصل کریں 0xfuture.xyz پر #0xFUTURE #Base`,
    },
  },

  YO: {
    tabs: { numerology: 'Nọ́mbà', astrology: 'Ìràwọ̀', tarot: 'Tarot' },
    common: {
      howDoesThisWork: 'Báwo ni èyí ṣe ń ṣiṣẹ?',
      history: '✦ Ìtàn',
      shareOnFarcaster: 'Pín lori Farcaster',
      tryAgain: 'Gbìyànjú Lẹ́ẹ̀kan Sí',
      entertainment: 'Àwọn kíkà jẹ́ fún ìdárayá nìkan.',
      oracleReading: 'Kíkà Ọ̀rọ̀ Àwídìí',
      connectWallet: 'Sopọ Wọ́lẹ́ọ̀tì',
      payingLabel: 'Ń dúró de ìmúdájú ìsanwó...',
      reversed: '↑ Yípadà',
      devMode: 'ÌPELE DEV, Ìsanwó Ṣiṣeṣe',
      ownerFree: 'ONÍGBẸ̀SẸ̀, Kíkà Ọfẹ',
    },
    numerology: {
      description: 'Wọ́lẹ́ọ̀tì kọ̀ọ̀kan ni ayanmọ́ tí ó farapamọ́ nínú àwọn nọ́mbà. Ṣàwárí ìkọ̀kọ̀ náà kí o sì tàn imọ́lẹ̀ sí ọ̀nà rẹ...',
      buttonConnected: 'Ṣàfihàn Nọ́mbà Mi',
      buttonConnect: 'Sopọ & Ka',
      loadingLabel: 'Ń ṣe ìṣirò ọ̀nà ìgbésí ayé rẹ...',
      howItWorks: 'Àdírẹ́sì wọ́lẹ́ọ̀tì rẹ ní ìtòlẹ̀sẹẹsẹ àkànṣe ti àwọn nọ́mbà hex. A ń gba àwọn iye wọ̀nyí jáde kí a sì ṣe ìṣirò Nọ́mbà Ọ̀nà Ìgbésí Ayé rẹ pẹ̀lú numerology Pythagorean ètò kan náà tí a ti ń lò fún ẹgbẹ̀rún ọdún. Nọ́mbà yìí jẹ́ títí ayé gẹ́gẹ́ bí ìtẹ̀ ọwọ́ onchain rẹ. Kò ní yí padà rí.',
      history: 'Numerology ń ṣàpèjúwe ìgbà tó ju 2500 ọdún sẹ́yìn ní Bábílónì àtijọ́ àti Íjíbítì. Pythagoras onímọ̀ ìṣirò Gírìíkì ṣe àkójọpọ̀ rẹ ní nǹkan bí 500 BC ó gbàgbọ́ pé àwọn nọ́mbà jẹ́ ìpilẹ̀ gbogbo ìwàláàyè. Láti Kabbalah sí àwọn ọ̀mọ̀wé Renaissance a ti ń lò numerology láti tú àwa ènìyàn ayanmọ́ àti èrò àgbálá. Lónìí àdírẹ́sì wọ́lẹ́ọ̀tì rẹ di ìdánimọ̀ nọ́mbà rẹ nínú àgbáálá onchain.',
      resultTitle: 'Nọ́mbà Ọ̀nà Ìgbésí Ayé',
      derivedFrom: 'Gba jáde láti',
      shareText: (num) => `Mo ṣẹ̀ṣẹ̀ ṣàwárí pé Nọ́mbà Ọ̀nà Ìgbésí Ayé Onchain mi jẹ́ ${num} ✦ Wá tirẹ ni 0xfuture.xyz #0xFUTURE #Base`,
      readAgain: 'Ka Lẹ́ẹ̀kan Sí',
    },
    astrology: {
      description: 'Ìṣòwò àkọ́kọ́ rẹ ni ìbí rẹ lori Onchain. Àwọn ìràwọ̀ gbasilẹ àmì rẹ ní ọjọ́ yẹn. Ṣe àkọsílẹ̀ ìdánimọ̀ rẹ nínú àgbálá. Tàn imọ́lẹ̀ sí ọ̀nà rẹ ní aago àárọ̀ kọ̀ọ̀kan...',
      buttonConnected: 'Ka Àwọn Ìràwọ̀ Mi',
      loadingLabel: 'Ń béèrè ìmọ̀ lọ́wọ́ àwọn ìràwọ̀...',
      howItWorks: 'Àmì zodiac rẹ jẹ́ ìpinnu nípa ọjọ́ gangan tí wọ́lẹ́ọ̀tì rẹ jẹ́ ṣíṣẹ̀dá àkọ́kọ́ lori onchain. Gẹ́gẹ́ bí chart ìbí àkókò yìí jẹ́ títí ayé àti àmì ìbí onchain rẹ kò yí padà rí. Síbẹ̀síbẹ̀ ìtumọ̀ àgbálá ń yí padà lójoojúmọ́ ó ń fún ọ ní ìtọ́sọ́nà tuntun lójoojúmọ́ gẹ́gẹ́ bí ìtò àwọn pílánẹ̀ẹ̀tì lọ́wọ́lọ́wọ́.',
      history: 'Astrology jẹ́ ọ̀kan lára àwọn ìmọ̀ àtijọ́ jù lọ ti ẹ̀dá ènìyàn tí ó wáyé ní Mesopotamia tó ju 3000 ọdún sẹ́yìn. Àwọn ará Bábílónì ṣe àwòrán zodiac àkọ́kọ́ ní nǹkan bí 700 BC. Àwọn ará Íjíbítì Gírìíkì àti Róòmù tẹ́lẹ̀ gbéṣẹ̀ àwọn àwòrán ọ̀run fún ìmọ̀ ìpinnu. Láti Tetrabiblos Ptolemy sí astrology ọpọlọ òde òní ìgbàgbọ́ pé àwọn ìràwọ̀ ń nípa lórí ọ̀nà wa ti wà ní gbogbo ọlaju.',
      resultTitle: 'Zodiac Onchain Rẹ',
      firstTx: 'TX Àkọ́kọ́:',
      birthSign: 'Àmì Ìbí Onchain',
      shareText: (sign) => `Àmì ìbí onchain mi jẹ́ ${sign} ✦ Ṣàwárí tirẹ ni 0xfuture.xyz #0xFUTURE #Base`,
    },
    tarot: {
      description: 'Wọ́lẹ́ọ̀tì rẹ àti agbára òní yan káàdì rẹ. Kíkà tuntun ndúró de rẹ ní aago àárọ̀...',
      buttonConnected: 'Jẹ́ Káàdì Sọ̀rọ̀',
      loadingLabel: 'Àwọn káàdì ń jẹ́ fà...',
      howItWorks: "Lójoojúmọ́ a máa ń fa káàdì 3 jáde nínú kọ́nù Rider Waite tó ní káàdì 78 nínú. Ìyàn náà jẹ́ ìpínlẹ̀ àkànṣe nípa àdírẹ́sì wọ́lẹ́ọ̀tì rẹ tí a dàpọ̀ mọ́ ọjọ́ òde òní ó ń mú kíkà rẹ jẹ́ ti ara rẹ. Àwọn káàdì máa ń tún bẹ̀rẹ̀ ní aago àárọ̀ UTC ó ń ṣàfihàn agbára ọjọ́ tuntun kọ̀ọ̀kan. Ipò mẹ́ta náà ṣàfihàn Àkókò tẹlẹ Lónìí àti Ọjọ́ iwájú rẹ.",
      history: 'Àwọn káàdì Tarot wáyé ní ọ̀rúndún kẹẹ̀ẹ́dógún ní Ìhà Àríwá Ítálì gẹ́gẹ́ bí káàdì eré. Ní ọ̀rúndún kejidilogun àwọn occultist Faransé bẹ̀rẹ̀ sí í lò wọn fún díẹ̀díẹ̀. Kọ́nù Rider Waite olókìkí tí Pamela Colman Smith ṣàfihàn ní 1909 di ìpele àgbáyé àti kọ́nù tí a ń lò níbí. Lónìí ẹgbẹẹgbẹ̀rún ènìyàn káàkiri àgbáyé máa ń ṣe tarot gẹ́gẹ́ bí ohun èlò fún ìrònú ìmọ̀lára àti ìṣàwárí ara ẹni.',
      positions: ['Àkókò tẹlẹ', 'Lónìí', 'Ọjọ́ iwájú'],
      shareText: (cards) => `Kíkà tarot onchain mi fún òní: ${cards} ✦ Gba tirẹ ni 0xfuture.xyz #0xFUTURE #Base`,
    },
  },

};
