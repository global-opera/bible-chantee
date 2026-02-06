/**
 * Dictionnaire sémantique enrichi pour Bible Chantée
 * 12 familles thématiques + thèmes modernes
 * 7 langues: FR, EN, PT, ES, DE, IT, TL
 */

const SemanticDictionary = {
    // FAMILLE 1: DIEU & SA NATURE (dieu_nature)
    dieu_nature: {
        FR: [
            "dieu", "éternel", "seigneur", "créateur", "tout-puissant", "sainteté", "gloire", "majesté",
            "souveraineté", "omniscience", "omnipotence", "omniprésence", "fidélité", "amour divin",
            "justice divine", "miséricorde", "grâce", "vérité", "lumière", "roi", "père", "rocher", "refuge",
            "forteresse", "berger", "yahweh", "adonaï", "el shaddaï", "je suis", "alpha omega",
            "trinité", "saint-esprit", "jésus", "christ", "messie", "sauveur", "rédempteur",
            "immutabilité", "eternité", "infinité", "perfection", "bonté", "bienveillance",
            "providence", "transcendance", "immanence", "sagesse divine", "puissance", "autorité",
            "maître", "gouverneur", "juge", "défenseur", "protecteur", "guérisseur", "libérateur",
            "consolateur", "ami fidèle", "époux céleste", "père des orphelins", "avocat",
            "intercesseur", "médiateur", "grand prêtre", "agneau de dieu", "lion de juda",
            "étoile du matin", "soleil de justice", "pain de vie", "eau vive", "chemin", "porte",
            "vigne", "lumière du monde", "résurrection", "vie", "emmanuel", "prince de paix",
            "saint", "très-haut", "ancien des jours", "source", "rocher des siècles", "bouclier",
            "tour forte", "salut", "espérance", "ancre", "fondement", "pierre angulaire", "chef",
            "tête", "souverain sacrificateur", "prophète", "sacrificateur", "pasteur", "maître",
            "seigneur des seigneurs", "roi des rois", "alpha", "omega", "premier", "dernier"
        ],
        EN: [
            "god", "lord", "creator", "almighty", "holiness", "glory", "majesty", "sovereignty",
            "omniscience", "omnipotence", "omnipresence", "faithfulness", "divine love",
            "divine justice", "mercy", "grace", "truth", "light", "king", "father", "rock", "refuge",
            "fortress", "shepherd", "yahweh", "adonai", "el shaddai", "i am", "alpha omega",
            "trinity", "holy spirit", "jesus", "christ", "messiah", "savior", "redeemer",
            "immutability", "eternity", "infinity", "perfection", "goodness", "kindness",
            "providence", "transcendence", "immanence", "divine wisdom", "power", "authority",
            "master", "ruler", "judge", "defender", "protector", "healer", "deliverer",
            "comforter", "faithful friend", "heavenly bridegroom", "father to the fatherless",
            "advocate", "intercessor", "mediator", "high priest", "lamb of god", "lion of judah",
            "morning star", "sun of righteousness", "bread of life", "living water", "way", "door",
            "vine", "light of the world", "resurrection", "life", "emmanuel", "prince of peace",
            "holy", "most high", "ancient of days", "fountain", "rock of ages", "shield",
            "strong tower", "salvation", "hope", "anchor", "foundation", "cornerstone", "head",
            "chief", "high priest", "prophet", "priest", "pastor", "teacher",
            "lord of lords", "king of kings", "alpha", "omega", "first", "last"
        ],
        PT: [
            "deus", "senhor", "criador", "todo-poderoso", "santidade", "glória", "majestade",
            "soberania", "onisciência", "onipotência", "onipresença", "fidelidade", "amor divino",
            "justiça divina", "misericórdia", "graça", "verdade", "luz", "rei", "pai", "rocha", "refúgio",
            "fortaleza", "pastor", "yahweh", "adonai", "el shaddai", "eu sou", "alfa ômega",
            "trindade", "espírito santo", "jesus", "cristo", "messias", "salvador", "redentor",
            "imutabilidade", "eternidade", "infinidade", "perfeição", "bondade", "benevolência",
            "providência", "transcendência", "imanência", "sabedoria divina", "poder", "autoridade",
            "mestre", "governante", "juiz", "defensor", "protetor", "curador", "libertador",
            "consolador", "amigo fiel", "noivo celestial", "pai dos órfãos", "advogado",
            "intercessor", "mediador", "sumo sacerdote", "cordeiro de deus", "leão de judá",
            "estrela da manhã", "sol da justiça", "pão da vida", "água viva", "caminho", "porta",
            "videira", "luz do mundo", "ressurreição", "vida", "emanuel", "príncipe da paz",
            "santo", "altíssimo", "ancião de dias", "fonte", "rocha eterna", "escudo",
            "torre forte", "salvação", "esperança", "âncora", "fundamento", "pedra angular", "cabeça",
            "chefe", "sumo sacerdote", "profeta", "sacerdote", "pastor", "mestre",
            "senhor dos senhores", "rei dos reis", "alfa", "ômega", "primeiro", "último"
        ],
        ES: [
            "dios", "señor", "creador", "todopoderoso", "santidad", "gloria", "majestad",
            "soberanía", "omnisciencia", "omnipotencia", "omnipresencia", "fidelidad", "amor divino",
            "justicia divina", "misericordia", "gracia", "verdad", "luz", "rey", "padre", "roca", "refugio",
            "fortaleza", "pastor", "yahvé", "adonai", "el shaddai", "yo soy", "alfa omega",
            "trinidad", "espíritu santo", "jesús", "cristo", "mesías", "salvador", "redentor",
            "inmutabilidad", "eternidad", "infinidad", "perfección", "bondad", "benevolencia",
            "providencia", "trascendencia", "inmanencia", "sabiduría divina", "poder", "autoridad",
            "maestro", "gobernante", "juez", "defensor", "protector", "sanador", "libertador",
            "consolador", "amigo fiel", "novio celestial", "padre de huérfanos", "abogado",
            "intercesor", "mediador", "sumo sacerdote", "cordero de dios", "león de judá",
            "lucero de la mañana", "sol de justicia", "pan de vida", "agua viva", "camino", "puerta",
            "vid", "luz del mundo", "resurrección", "vida", "emanuel", "príncipe de paz",
            "santo", "altísimo", "anciano de días", "fuente", "roca eterna", "escudo",
            "torre fuerte", "salvación", "esperanza", "ancla", "fundamento", "piedra angular", "cabeza",
            "jefe", "sumo sacerdote", "profeta", "sacerdote", "pastor", "maestro",
            "señor de señores", "rey de reyes", "alfa", "omega", "primero", "último"
        ],
        DE: [
            "gott", "herr", "schöpfer", "allmächtiger", "heiligkeit", "herrlichkeit", "majestät",
            "souveränität", "allwissenheit", "allmacht", "allgegenwart", "treue", "göttliche liebe",
            "göttliche gerechtigkeit", "barmherzigkeit", "gnade", "wahrheit", "licht", "könig", "vater",
            "fels", "zuflucht", "festung", "hirte", "jahwe", "adonai", "el schaddai", "ich bin",
            "alpha und omega", "dreieinigkeit", "heiliger geist", "jesus", "christus", "messias",
            "retter", "erlöser", "unveränderlichkeit", "ewigkeit", "unendlichkeit", "vollkommenheit",
            "güte", "wohlwollen", "vorsehung", "transzendenz", "immanenz", "göttliche weisheit",
            "macht", "autorität", "meister", "herrscher", "richter", "verteidiger", "beschützer",
            "heiler", "befreier", "tröster", "treuer freund", "himmlischer bräutigam",
            "vater der waisen", "anwalt", "fürsprecher", "mittler", "hohepriester",
            "lamm gottes", "löwe von juda", "morgenstern", "sonne der gerechtigkeit",
            "brot des lebens", "lebendiges wasser", "weg", "tür", "weinstock", "licht der welt",
            "auferstehung", "leben", "immanuel", "friedefürst",
            "heilig", "höchster", "uralter", "quelle", "fels der zeiten", "schild",
            "starker turm", "heil", "hoffnung", "anker", "fundament", "eckstein", "haupt",
            "oberhaupt", "hoherpriester", "prophet", "priester", "pastor", "lehrer",
            "herr der herren", "könig der könige", "alpha", "omega", "erster", "letzter"
        ],
        IT: [
            "dio", "signore", "creatore", "onnipotente", "santità", "gloria", "maestà",
            "sovranità", "onniscienza", "onnipotenza", "onnipresenza", "fedeltà", "amore divino",
            "giustizia divina", "misericordia", "grazia", "verità", "luce", "re", "padre", "roccia",
            "rifugio", "fortezza", "pastore", "yahweh", "adonai", "el shaddai", "io sono",
            "alfa e omega", "trinità", "spirito santo", "gesù", "cristo", "messia", "salvatore",
            "redentore", "immutabilità", "eternità", "infinità", "perfezione", "bontà", "benevolenza",
            "provvidenza", "trascendenza", "immanenza", "sapienza divina", "potere", "autorità",
            "maestro", "governante", "giudice", "difensore", "protettore", "guaritore", "liberatore",
            "consolatore", "amico fedele", "sposo celeste", "padre degli orfani", "avvocato",
            "intercessore", "mediatore", "sommo sacerdote", "agnello di dio", "leone di giuda",
            "stella del mattino", "sole di giustizia", "pane della vita", "acqua viva", "via",
            "porta", "vite", "luce del mondo", "risurrezione", "vita", "emmanuele", "principe della pace",
            "santo", "altissimo", "antico di giorni", "fonte", "roccia eterna", "scudo",
            "torre forte", "salvezza", "speranza", "ancora", "fondamento", "pietra angolare", "capo",
            "sommo", "sommo sacerdote", "profeta", "sacerdote", "pastore", "maestro",
            "signore dei signori", "re dei re", "alfa", "omega", "primo", "ultimo"
        ],        TL: [
            "diyos", "panginoon", "manlalalang", "makapangyarihan", "kabanalan", "kaluwalhatian",
            "kadakilaan", "kataas-taasang kapangyarihan", "omnisyensya", "omnipotensya",
            "omnipresensya", "katapatan", "banal na pag-ibig", "banal na hustisya", "awa",
            "biyaya", "katotohanan", "liwanag", "hari", "ama", "bato", "kanlungan", "kuta", "pastol",
            "yahweh", "adonai", "el shaddai", "ako nga", "alpha at omega", "trinidad", "banal na espiritu",
            "hesus", "kristo", "mesiyas", "tagapagligtas", "manunubos",
            "banal", "kataas-taasan", "matanda ng mga araw", "bukal", "walang hanggang bato", "kalasag",
            "malakas na tore", "kaligtasan", "pag-asa", "angkla", "pundasyon", "batong panulukan",
            "ulo", "punong pari", "propeta", "pari", "pastor", "guro", "panginoon ng mga panginoon",
            "hari ng mga hari", "alpha", "omega", "una", "huli"
        ],        chapters: [
            "01_GEN_001", "02_EXO_003", "02_EXO_015", "02_EXO_033", "02_EXO_034",
            "18_JOB_038", "18_JOB_039", "18_JOB_040", "18_JOB_041",
            "19_PSA_008", "19_PSA_019", "19_PSA_024", "19_PSA_029", "19_PSA_033",
            "19_PSA_046", "19_PSA_047", "19_PSA_050", "19_PSA_068", "19_PSA_089",
            "19_PSA_090", "19_PSA_093", "19_PSA_095", "19_PSA_096", "19_PSA_097",
            "19_PSA_099", "19_PSA_100", "19_PSA_103", "19_PSA_104", "19_PSA_111",
            "19_PSA_113", "19_PSA_115", "19_PSA_135", "19_PSA_136", "19_PSA_139",
            "19_PSA_145", "19_PSA_147", "19_PSA_148",
            "23_ISA_006", "23_ISA_040", "23_ISA_042", "23_ISA_043", "23_ISA_044",
            "23_ISA_045", "23_ISA_046", "23_ISA_048", "23_ISA_055", "23_ISA_057",
            "43_JOH_001", "43_JOH_004", "43_JOH_017",
            "45_ROM_001", "45_ROM_009", "45_ROM_011",
            "51_COL_001", "54_1TI_001", "54_1TI_006",
            "58_HEB_001", "58_HEB_011", "58_HEB_012",
            "62_1JO_001", "62_1JO_004",
            "66_REV_001", "66_REV_004", "66_REV_015", "66_REV_019", "66_REV_021", "66_REV_022"
        ]
    },

    // FAMILLE 2: FOI & CONFIANCE (foi_confiance)
    foi_confiance: {
        FR: [
            "foi", "confiance", "croire", "croyance", "espérance", "certitude", "assurance", "conviction",
            "fidélité", "engagement", "persévérance", "endurance", "patience", "attente", "abandon",
            "lâcher prise", "dépendance", "soumission", "obéissance", "écoute", "acceptation",
            "humilité", "simplicité", "innocence", "pureté de coeur", "sincérité", "authenticité",
            "intégrité", "droiture", "honnêteté", "transparence", "vulnérabilité", "fragilité",
            "faiblesse reconnue", "besoin de dieu", "dépendance totale", "remise entre ses mains",
            "confier", "se fier", "compter sur", "s'appuyer", "reposer", "se reposer sur",
            "faire confiance", "avoir foi", "garder la foi", "perdre la foi", "retrouver la foi",
            "affermir sa foi", "fortifier", "renforcer", "consolider", "enraciner", "fonder",
            "bâtir sur le roc", "marcher par la foi", "vivre par la foi", "pas par la vue",
            "sans voir", "croire sans voir", "foi aveugle", "foi éprouvée", "foi testée",
            "foi victorieuse", "foi qui déplace les montagnes", "foi comme un grain de moutarde",
            "foi des ancêtres", "foi des pères", "héritage de foi", "transmission", "témoignage",
            "espoir", "confiant", "sûr", "certain", "ferme", "stable", "inébranlable",
            "tenir bon", "tenir ferme", "ne pas douter", "croire fermement", "avoir l'assurance"
        ],
        EN: [
            "faith", "trust", "believe", "belief", "hope", "certainty", "assurance", "conviction",
            "faithfulness", "commitment", "perseverance", "endurance", "patience", "waiting", "surrender",
            "let go", "dependence", "submission", "obedience", "listening", "acceptance",
            "humility", "simplicity", "innocence", "purity of heart", "sincerity", "authenticity",
            "integrity", "righteousness", "honesty", "transparency", "vulnerability", "fragility",
            "acknowledged weakness", "need for god", "total dependence", "giving over to his hands",
            "entrust", "rely on", "count on", "lean on", "rest", "rest on",
            "have faith", "keep the faith", "lose faith", "find faith again",
            "strengthen faith", "fortify", "reinforce", "consolidate", "root", "found",
            "build on the rock", "walk by faith", "live by faith", "not by sight",
            "without seeing", "believe without seeing", "blind faith", "tested faith",
            "victorious faith", "faith that moves mountains", "faith like a mustard seed",
            "faith of ancestors", "faith of fathers", "heritage of faith", "transmission", "testimony",
            "hopeful", "confident", "sure", "certain", "firm", "stable", "unshakeable",
            "hold on", "stand firm", "do not doubt", "believe firmly", "have assurance"
        ],
        PT: [
            "fé", "confiança", "crer", "crença", "esperança", "certeza", "segurança", "convicção",
            "fidelidade", "compromisso", "perseverança", "resistência", "paciência", "espera", "entrega",
            "deixar ir", "dependência", "submissão", "obediência", "escuta", "aceitação",
            "humildade", "simplicidade", "inocência", "pureza de coração", "sinceridade", "autenticidade",
            "integridade", "retidão", "honestidade", "transparência", "vulnerabilidade", "fragilidade",
            "fraqueza reconhecida", "necessidade de deus", "dependência total", "entregar nas suas mãos",
            "confiar", "depender de", "contar com", "apoiar-se", "descansar", "descansar em",
            "ter fé", "guardar a fé", "perder a fé", "encontrar a fé novamente",
            "fortalecer a fé", "fortificar", "reforçar", "consolidar", "enraizar", "fundar",
            "construir sobre a rocha", "andar pela fé", "viver pela fé", "não pela vista",
            "sem ver", "crer sem ver", "fé cega", "fé provada",
            "fé vitoriosa", "fé que move montanhas", "fé como grão de mostarda",
            "fé dos ancestrais", "fé dos pais", "herança de fé", "transmissão", "testemunho",
            "esperançoso", "confiante", "seguro", "certo", "firme", "estável", "inabalável",
            "segurar firme", "permanecer firme", "não duvidar", "crer firmemente", "ter segurança"
        ],
        ES: [
            "fe", "confianza", "creer", "creencia", "esperanza", "certeza", "seguridad", "convicción",
            "fidelidad", "compromiso", "perseverancia", "resistencia", "paciencia", "espera", "entrega",
            "soltar", "dependencia", "sumisión", "obediencia", "escucha", "aceptación",
            "humildad", "simplicidad", "inocencia", "pureza de corazón", "sinceridad", "autenticidad",
            "integridad", "rectitud", "honestidad", "transparencia", "vulnerabilidad", "fragilidad",
            "debilidad reconocida", "necesidad de dios", "dependencia total", "entrega en sus manos",
            "confiar", "fiarse de", "contar con", "apoyarse", "descansar", "descansar en",
            "tener fe", "guardar la fe", "perder la fe", "encontrar la fe nuevamente",
            "fortalecer la fe", "fortificar", "reforzar", "consolidar", "arraigar", "fundar",
            "edificar sobre la roca", "andar por fe", "vivir por fe", "no por vista",
            "sin ver", "creer sin ver", "fe ciega", "fe probada",
            "fe victoriosa", "fe que mueve montañas", "fe como grano de mostaza",
            "fe de los ancestros", "fe de los padres", "herencia de fe", "transmisión", "testimonio",
            "esperanzado", "confiado", "seguro", "cierto", "firme", "estable", "inquebrantable",
            "mantenerse firme", "permanecer firme", "no dudar", "creer firmemente", "tener seguridad"
        ],
        DE: [
            "glaube", "vertrauen", "glauben", "überzeugung", "hoffnung", "gewissheit", "sicherheit", "zuversicht",
            "treue", "engagement", "ausdauer", "beharrlichkeit", "geduld", "warten", "hingabe",
            "loslassen", "abhängigkeit", "unterwerfung", "gehorsam", "zuhören", "akzeptanz",
            "demut", "einfachheit", "unschuld", "reinheit des herzens", "aufrichtigkeit", "authentizität",
            "integrität", "rechtschaffenheit", "ehrlichkeit", "transparenz", "verletzlichkeit", "zerbrechlichkeit",
            "anerkannte schwäche", "bedürfnis nach gott", "völlige abhängigkeit", "übergabe in seine hände",
            "anvertrauen", "sich verlassen auf", "zählen auf", "sich stützen auf", "ruhen", "ruhen in",
            "glauben haben", "glauben bewahren", "glauben verlieren", "glauben wiederfinden",
            "glauben stärken", "befestigen", "verstärken", "festigen", "verwurzeln", "gründen",
            "auf den felsen bauen", "im glauben wandeln", "im glauben leben", "nicht durch sehen",
            "ohne zu sehen", "glauben ohne zu sehen", "blinder glaube", "geprüfter glaube",
            "siegreicher glaube", "glaube der berge versetzt", "glaube wie ein senfkorn",
            "glaube der vorfahren", "glaube der väter", "glaubenserbe", "weitergabe", "zeugnis",
            "hoffnungsvoll", "zuversichtlich", "sicher", "gewiss", "fest", "stabil", "unerschütterlich",
            "festhalten", "standhaft bleiben", "nicht zweifeln", "fest glauben", "gewissheit haben"
        ],
        IT: [
            "fede", "fiducia", "credere", "credenza", "speranza", "certezza", "sicurezza", "convinzione",
            "fedeltà", "impegno", "perseveranza", "resistenza", "pazienza", "attesa", "abbandono",
            "lasciare andare", "dipendenza", "sottomissione", "obbedienza", "ascolto", "accettazione",
            "umiltà", "semplicità", "innocenza", "purezza di cuore", "sincerità", "autenticità",
            "integrità", "rettitudine", "onestà", "trasparenza", "vulnerabilità", "fragilità",
            "debolezza riconosciuta", "bisogno di dio", "dipendenza totale", "affidamento nelle sue mani",
            "affidare", "fidarsi di", "contare su", "appoggiarsi", "riposare", "riposare in",
            "avere fede", "mantenere la fede", "perdere la fede", "ritrovare la fede",
            "rafforzare la fede", "fortificare", "rinforzare", "consolidare", "radicare", "fondare",
            "costruire sulla roccia", "camminare per fede", "vivere per fede", "non per vista",
            "senza vedere", "credere senza vedere", "fede cieca", "fede provata",
            "fede vittoriosa", "fede che muove le montagne", "fede come un granello di senape",
            "fede degli antenati", "fede dei padri", "eredità di fede", "trasmissione", "testimonianza",
            "speranzoso", "fiducioso", "sicuro", "certo", "fermo", "stabile", "incrollabile",
            "tenere duro", "rimanere saldi", "non dubitare", "credere fermamente", "avere certezza"
        ],        TL: [
            "pananampalataya", "tiwala", "maniwala", "paniniwala", "pag-asa", "katiyakan", "kapanatagan", "paninindigan",
            "katapatan", "pangako", "pagtitiyaga", "pagtitiis", "pasensya", "paghihintay", "pagsuko",
            "bitawan", "pag-asa", "pagsunod", "pagsunod", "pakikinig", "pagtanggap",
            "kababaang-loob", "simpleng", "kawalang-sala", "kalinisan ng puso", "katapatan", "pagka-tunay",
            "integridad", "katuwiran", "katapatan", "transparency", "kahinaan", "karupukan",
            "kinikilalang kahinaan", "pangangailangan sa diyos", "ganap na pag-asa", "pagbibigay sa kanyang mga kamay",
            "magtiwala", "umasa sa", "umasa sa", "sumandal", "magpahinga", "magpahinga sa"
        ],        chapters: [
            "01_GEN_012", "01_GEN_015", "01_GEN_022",
            "02_EXO_014", "02_EXO_017",
            "06_JOS_001", "06_JOS_003",
            "07_JDG_006", "07_JDG_007",
            "09_1SAM_001", "09_1SAM_017",
            "11_1KI_008", "11_1KI_017", "11_1KI_018", "11_1KI_019",
            "12_2KI_004", "12_2KI_005", "12_2KI_006", "12_2KI_019",
            "14_2CH_020",
            "19_PSA_027", "19_PSA_037", "19_PSA_040", "19_PSA_046", "19_PSA_056",
            "19_PSA_062", "19_PSA_091", "19_PSA_112", "19_PSA_118", "19_PSA_121",
            "19_PSA_125", "19_PSA_131",
            "20_PRO_003",
            "23_ISA_026", "23_ISA_030", "23_ISA_040",
            "24_JER_017",
            "27_DAN_003", "27_DAN_006",
            "35_HAB_002", "35_HAB_003",
            "40_MAT_008", "40_MAT_009", "40_MAT_014", "40_MAT_015", "40_MAT_017",
            "41_MAR_002", "41_MAR_004", "41_MAR_005", "41_MAR_009", "41_MAR_010", "41_MAR_011",
            "42_LUK_005", "42_LUK_007", "42_LUK_008", "42_LUK_017", "42_LUK_018",
            "43_JOH_003", "43_JOH_004", "43_JOH_006", "43_JOH_011", "43_JOH_014", "43_JOH_020",
            "44_ACT_003", "44_ACT_014", "44_ACT_016", "44_ACT_027",
            "45_ROM_001", "45_ROM_004", "45_ROM_005", "45_ROM_010",
            "48_GAL_002", "48_GAL_003",
            "49_EPH_002", "49_EPH_006",
            "58_HEB_011", "58_HEB_012",
            "59_JAS_001", "59_JAS_002", "59_JAS_005",
            "60_1PE_001"
        ]
    },

    // FAMILLE 3: AMOUR & RELATIONS (amour_relations)
    amour_relations: {
        FR: [
            "amour", "aimer", "affection", "tendresse", "douceur", "gentillesse", "bonté", "bienveillance",
            "compassion", "empathie", "sympathie", "solidarité", "fraternité", "communion", "unité",
            "harmonie", "réconciliation", "pardon", "grâce", "miséricorde", "pitié", "clémence",
            "indulgence", "tolérance", "acceptation", "accueil", "hospitalité", "générosité",
            "don", "partage", "service", "dévouement", "sacrifice", "abnégation", "altruisme",
            "désintéressement", "humilité", "respect", "honneur", "dignité", "valeur", "estime",
            "considération", "attention", "soin", "sollicitude", "prévenance", "délicatesse",
            "famille", "couple", "mariage", "époux", "épouse", "mari", "femme", "enfants", "parents",
            "père", "mère", "fils", "fille", "frère", "soeur", "grand-parent", "petit-enfant",
            "ami", "amitié", "compagnon", "camarade", "prochain", "voisin", "étranger", "ennemi",
            "communauté", "église", "assemblée", "corps de christ", "membres", "communion des saints",
            "charité", "aide", "soutien", "encouragement", "consolation", "réconfort", "paix",
            "joie", "bonheur", "plaisir", "satisfaction", "contentement", "gratitude", "reconnaissance"
        ],
        EN: [
            "love", "to love", "affection", "tenderness", "gentleness", "kindness", "goodness", "benevolence",
            "compassion", "empathy", "sympathy", "solidarity", "brotherhood", "communion", "unity",
            "harmony", "reconciliation", "forgiveness", "grace", "mercy", "pity", "clemency",
            "indulgence", "tolerance", "acceptance", "welcome", "hospitality", "generosity",
            "gift", "sharing", "service", "devotion", "sacrifice", "selflessness", "altruism",
            "unselfishness", "humility", "respect", "honor", "dignity", "value", "esteem",
            "consideration", "attention", "care", "solicitude", "thoughtfulness", "delicacy",
            "family", "couple", "marriage", "husband", "wife", "husband", "wife", "children", "parents",
            "father", "mother", "son", "daughter", "brother", "sister", "grandparent", "grandchild",
            "friend", "friendship", "companion", "comrade", "neighbor", "neighbor", "stranger", "enemy",
            "community", "church", "assembly", "body of christ", "members", "communion of saints",
            "charity", "help", "support", "encouragement", "consolation", "comfort", "peace",
            "joy", "happiness", "pleasure", "satisfaction", "contentment", "gratitude", "thankfulness"
        ],
        PT: [
            "amor", "amar", "afeição", "ternura", "doçura", "gentileza", "bondade", "benevolência",
            "compaixão", "empatia", "simpatia", "solidariedade", "fraternidade", "comunhão", "unidade",
            "harmonia", "reconciliação", "perdão", "graça", "misericórdia", "piedade", "clemência",
            "indulgência", "tolerância", "aceitação", "acolhimento", "hospitalidade", "generosidade",
            "dom", "partilha", "serviço", "dedicação", "sacrifício", "abnegação", "altruísmo",
            "desinteresse", "humildade", "respeito", "honra", "dignidade", "valor", "estima",
            "consideração", "atenção", "cuidado", "solicitude", "previdência", "delicadeza",
            "família", "casal", "casamento", "esposo", "esposa", "marido", "mulher", "filhos", "pais",
            "pai", "mãe", "filho", "filha", "irmão", "irmã", "avô", "neto",
            "amigo", "amizade", "companheiro", "camarada", "próximo", "vizinho", "estrangeiro", "inimigo",
            "comunidade", "igreja", "assembleia", "corpo de cristo", "membros", "comunhão dos santos",
            "caridade", "ajuda", "apoio", "encorajamento", "consolação", "conforto", "paz",
            "alegria", "felicidade", "prazer", "satisfação", "contentamento", "gratidão", "reconhecimento"
        ],
        ES: [
            "amor", "amar", "afecto", "ternura", "dulzura", "amabilidad", "bondad", "benevolencia",
            "compasión", "empatía", "simpatía", "solidaridad", "fraternidad", "comunión", "unidad",
            "armonía", "reconciliación", "perdón", "gracia", "misericordia", "piedad", "clemencia",
            "indulgencia", "tolerancia", "aceptación", "acogida", "hospitalidad", "generosidad",
            "don", "compartir", "servicio", "dedicación", "sacrificio", "abnegación", "altruismo",
            "desinterés", "humildad", "respeto", "honor", "dignidad", "valor", "estima",
            "consideración", "atención", "cuidado", "solicitud", "previsión", "delicadeza",
            "familia", "pareja", "matrimonio", "esposo", "esposa", "marido", "mujer", "hijos", "padres",
            "padre", "madre", "hijo", "hija", "hermano", "hermana", "abuelo", "nieto",
            "amigo", "amistad", "compañero", "camarada", "prójimo", "vecino", "extranjero", "enemigo",
            "comunidad", "iglesia", "asamblea", "cuerpo de cristo", "miembros", "comunión de los santos",
            "caridad", "ayuda", "apoyo", "ánimo", "consolación", "consuelo", "paz",
            "alegría", "felicidad", "placer", "satisfacción", "contentamiento", "gratitud", "reconocimiento"
        ],
        DE: [
            "liebe", "lieben", "zuneigung", "zärtlichkeit", "sanftheit", "freundlichkeit", "güte", "wohlwollen",
            "mitgefühl", "empathie", "sympathie", "solidarität", "brüderlichkeit", "gemeinschaft", "einheit",
            "harmonie", "versöhnung", "vergebung", "gnade", "barmherzigkeit", "mitleid", "nachsicht",
            "nachsicht", "toleranz", "akzeptanz", "willkommen", "gastfreundschaft", "großzügigkeit",
            "gabe", "teilen", "dienst", "hingabe", "opfer", "selbstlosigkeit", "altruismus",
            "uneigennützigkeit", "demut", "respekt", "ehre", "würde", "wert", "wertschätzung",
            "rücksicht", "aufmerksamkeit", "fürsorge", "sorge", "vorsorge", "feingefühl",
            "familie", "paar", "ehe", "ehemann", "ehefrau", "mann", "frau", "kinder", "eltern",
            "vater", "mutter", "sohn", "tochter", "bruder", "schwester", "großeltern", "enkelkind",
            "freund", "freundschaft", "gefährte", "kamerad", "nächster", "nachbar", "fremder", "feind",
            "gemeinschaft", "kirche", "versammlung", "leib christi", "mitglieder", "gemeinschaft der heiligen",
            "nächstenliebe", "hilfe", "unterstützung", "ermutigung", "trost", "trost", "frieden",
            "freude", "glück", "vergnügen", "zufriedenheit", "zufriedenheit", "dankbarkeit", "anerkennung"
        ],
        IT: [
            "amore", "amare", "affetto", "tenerezza", "dolcezza", "gentilezza", "bontà", "benevolenza",
            "compassione", "empatia", "simpatia", "solidarietà", "fraternità", "comunione", "unità",
            "armonia", "riconciliazione", "perdono", "grazia", "misericordia", "pietà", "clemenza",
            "indulgenza", "tolleranza", "accettazione", "accoglienza", "ospitalità", "generosità",
            "dono", "condivisione", "servizio", "dedizione", "sacrificio", "abnegazione", "altruismo",
            "disinteresse", "umiltà", "rispetto", "onore", "dignità", "valore", "stima",
            "considerazione", "attenzione", "cura", "sollecitudine", "premura", "delicatezza",
            "famiglia", "coppia", "matrimonio", "sposo", "sposa", "marito", "moglie", "figli", "genitori",
            "padre", "madre", "figlio", "figlia", "fratello", "sorella", "nonno", "nipote",
            "amico", "amicizia", "compagno", "camerata", "prossimo", "vicino", "straniero", "nemico",
            "comunità", "chiesa", "assemblea", "corpo di cristo", "membri", "comunione dei santi",
            "carità", "aiuto", "sostegno", "incoraggiamento", "consolazione", "conforto", "pace",
            "gioia", "felicità", "piacere", "soddisfazione", "contentezza", "gratitudine", "riconoscenza"
        ],        TL: [
            "pag-ibig", "mahalin", "pagmamahal", "lambing", "kahinahunan", "kabaitan", "kabutihan", "mabuting kalooban",
            "habag", "pakikiramay", "simpatiya", "pagkakaisa", "pagkakapatiran", "pakikipag-ugnayan", "pagkakaisa",
            "pagkakaisa", "pagkakasundo", "kapatawaran", "biyaya", "awa", "awa", "habag",
            "pagpapaubaya", "pagtitiis", "pagtanggap", "pagtanggap", "pagtanggap", "mapagbigay",
            "kaloob", "pagbabahagi", "paglilingkod", "dedikasyon", "sakripisyo", "pagkakait sa sarili", "altruismo",
            "kawalan ng interes sa sarili", "kababaang-loob", "paggalang", "karangalan", "dignidad", "halaga", "paggalang",
            "konsiderasyon", "pansin", "pag-aalaga", "pag-aalaga", "pag-iingat", "pinong damdamin",
            "pamilya", "mag-asawa", "kasal", "asawa", "asawa", "lalaki", "babae", "mga anak", "mga magulang",
            "ama", "ina", "anak na lalaki", "anak na babae", "kapatid na lalaki", "kapatid na babae", "lolo", "apo",
            "kaibigan", "pagkakaibigan", "kasama", "kasamahan", "kapwa", "kapitbahay", "estranghero", "kaaway",
            "komunidad", "simbahan", "kapulungan", "katawan ni kristo", "mga miyembro"
        ],        chapters: [
            "01_GEN_002", "01_GEN_024", "01_GEN_029", "01_GEN_045",
            "08_RUT_001", "08_RUT_002", "08_RUT_003", "08_RUT_004",
            "09_1SAM_018", "09_1SAM_020",
            "10_2SAM_001", "10_2SAM_009",
            "22_SON_001", "22_SON_002", "22_SON_003", "22_SON_004", "22_SON_005", "22_SON_006", "22_SON_007", "22_SON_008",
            "28_HOS_001", "28_HOS_002", "28_HOS_003", "28_HOS_011", "28_HOS_014",
            "40_MAT_005", "40_MAT_018", "40_MAT_019", "40_MAT_022", "40_MAT_025",
            "41_MAR_010", "41_MAR_012",
            "42_LUK_006", "42_LUK_010", "42_LUK_015",
            "43_JOH_003", "43_JOH_013", "43_JOH_015", "43_JOH_017", "43_JOH_021",
            "45_ROM_005", "45_ROM_008", "45_ROM_012", "45_ROM_013",
            "46_1CO_007", "46_1CO_013",
            "47_2CO_005",
            "48_GAL_005", "48_GAL_006",
            "49_EPH_003", "49_EPH_004", "49_EPH_005",
            "50_PHP_001", "50_PHP_002",
            "51_COL_003",
            "52_1TH_003", "52_1TH_004",
            "57_PHM_001",
            "58_HEB_013",
            "59_JAS_002",
            "60_1PE_001", "60_1PE_003", "60_1PE_004",
            "62_1JO_002", "62_1JO_003", "62_1JO_004",
            "63_2JO_001",
            "64_3JO_001"
        ]
    },

    // FAMILLE 4: SOUFFRANCE & ÉPREUVES (souffrance_epreuves)
    souffrance_epreuves: {
        FR: [
            "souffrance", "douleur", "peine", "chagrin", "affliction", "détresse", "angoisse", "anxiété",
            "peur", "crainte", "terreur", "effroi", "frayeur", "panique", "stress", "tension", "pression",
            "épreuve", "test", "tentation", "tribulation", "persécution", "oppression", "injustice",
            "maladie", "infirmité", "handicap", "faiblesse", "fragilité", "vulnérabilité",
            "deuil", "perte", "mort", "séparation", "abandon", "rejet", "trahison", "déception",
            "échec", "défaite", "humiliation", "honte", "culpabilité", "regret", "remords",
            "solitude", "isolement", "marginalisation", "exclusion", "incompréhension",
            "dépression", "désespoir", "découragement", "abattement", "lassitude", "fatigue",
            "épuisement", "burnout", "surmenage", "usure", "vieillissement", "fin de vie",
            "crise", "catastrophe", "désastre", "accident", "guerre", "violence", "agression",
            "injure", "insulte", "calomnie", "médisance", "faux témoignage", "accusation",
            "prison", "captivité", "esclavage", "servitude", "oppression", "tyrannie",
            "larmes", "pleurs", "sanglots", "cris", "gémissements", "lamentations",
            "tourment", "torture", "supplice", "calvaire", "croix", "épreuve du feu"
        ],
        EN: [
            "suffering", "pain", "sorrow", "grief", "affliction", "distress", "anguish", "anxiety",
            "fear", "dread", "terror", "fright", "panic", "stress", "tension", "pressure",
            "trial", "test", "temptation", "tribulation", "persecution", "oppression", "injustice",
            "sickness", "infirmity", "disability", "weakness", "fragility", "vulnerability",
            "mourning", "loss", "death", "separation", "abandonment", "rejection", "betrayal", "disappointment",
            "failure", "defeat", "humiliation", "shame", "guilt", "regret", "remorse",
            "loneliness", "isolation", "marginalization", "exclusion", "misunderstanding",
            "depression", "despair", "discouragement", "dejection", "weariness", "fatigue",
            "exhaustion", "burnout", "overwork", "wear", "aging", "end of life",
            "crisis", "catastrophe", "disaster", "accident", "war", "violence", "aggression",
            "insult", "insult", "slander", "gossip", "false witness", "accusation",
            "prison", "captivity", "slavery", "servitude", "oppression", "tyranny",
            "tears", "weeping", "sobs", "cries", "groans", "lamentations",
            "torment", "torture", "agony", "calvary", "cross", "trial by fire"
        ],
        PT: [
            "sofrimento", "dor", "tristeza", "luto", "aflição", "angústia", "angústia", "ansiedade",
            "medo", "pavor", "terror", "medo", "pânico", "estresse", "tensão", "pressão",
            "provação", "teste", "tentação", "tribulação", "perseguição", "opressão", "injustiça",
            "doença", "enfermidade", "deficiência", "fraqueza", "fragilidade", "vulnerabilidade",
            "luto", "perda", "morte", "separação", "abandono", "rejeição", "traição", "decepção",
            "fracasso", "derrota", "humilhação", "vergonha", "culpa", "arrependimento", "remorso",
            "solidão", "isolamento", "marginalização", "exclusão", "incompreensão",
            "depressão", "desespero", "desânimo", "abatimento", "cansaço", "fadiga",
            "exaustão", "esgotamento", "sobrecarga", "desgaste", "envelhecimento", "fim da vida",
            "crise", "catástrofe", "desastre", "acidente", "guerra", "violência", "agressão",
            "insulto", "insulto", "calúnia", "fofoca", "falso testemunho", "acusação",
            "prisão", "cativeiro", "escravidão", "servidão", "opressão", "tirania",
            "lágrimas", "choro", "soluços", "gritos", "gemidos", "lamentações",
            "tormento", "tortura", "agonia", "calvário", "cruz", "prova de fogo"
        ],
        ES: [
            "sufrimiento", "dolor", "pena", "duelo", "aflicción", "angustia", "angustia", "ansiedad",
            "miedo", "temor", "terror", "espanto", "pánico", "estrés", "tensión", "presión",
            "prueba", "prueba", "tentación", "tribulación", "persecución", "opresión", "injusticia",
            "enfermedad", "enfermedad", "discapacidad", "debilidad", "fragilidad", "vulnerabilidad",
            "duelo", "pérdida", "muerte", "separación", "abandono", "rechazo", "traición", "decepción",
            "fracaso", "derrota", "humillación", "vergüenza", "culpa", "arrepentimiento", "remordimiento",
            "soledad", "aislamiento", "marginación", "exclusión", "incomprensión",
            "depresión", "desesperación", "desánimo", "abatimiento", "cansancio", "fatiga",
            "agotamiento", "agotamiento", "sobrecarga", "desgaste", "envejecimiento", "fin de la vida",
            "crisis", "catástrofe", "desastre", "accidente", "guerra", "violencia", "agresión",
            "insulto", "insulto", "calumnia", "chisme", "falso testimonio", "acusación",
            "prisión", "cautiverio", "esclavitud", "servidumbre", "opresión", "tiranía",
            "lágrimas", "llanto", "sollozos", "gritos", "gemidos", "lamentaciones",
            "tormento", "tortura", "agonía", "calvario", "cruz", "prueba de fuego"
        ],
        DE: [
            "leiden", "schmerz", "kummer", "trauer", "bedrängnis", "not", "angst", "besorgnis",
            "furcht", "angst", "schrecken", "entsetzen", "panik", "stress", "spannung", "druck",
            "prüfung", "test", "versuchung", "trübsal", "verfolgung", "unterdrückung", "ungerechtigkeit",
            "krankheit", "schwäche", "behinderung", "schwäche", "zerbrechlichkeit", "verletzlichkeit",
            "trauer", "verlust", "tod", "trennung", "verlassenheit", "ablehnung", "verrat", "enttäuschung",
            "versagen", "niederlage", "demütigung", "scham", "schuld", "bedauern", "reue",
            "einsamkeit", "isolation", "ausgrenzung", "ausschluss", "missverständnis",
            "depression", "verzweiflung", "entmutigung", "niedergeschlagenheit", "müdigkeit", "erschöpfung",
            "erschöpfung", "burnout", "überarbeitung", "verschleiß", "altern", "lebensende",
            "krise", "katastrophe", "desaster", "unfall", "krieg", "gewalt", "aggression",
            "beleidigung", "beleidigung", "verleumdung", "klatsch", "falsches zeugnis", "anklage",
            "gefängnis", "gefangenschaft", "sklaverei", "knechtschaft", "unterdrückung", "tyrannei",
            "tränen", "weinen", "schluchzen", "schreie", "stöhnen", "klagen",
            "qual", "folter", "qual", "golgatha", "kreuz", "feuerprobe"
        ],
        IT: [
            "sofferenza", "dolore", "pena", "lutto", "afflizione", "angoscia", "angoscia", "ansia",
            "paura", "timore", "terrore", "spavento", "panico", "stress", "tensione", "pressione",
            "prova", "test", "tentazione", "tribolazione", "persecuzione", "oppressione", "ingiustizia",
            "malattia", "infermità", "disabilità", "debolezza", "fragilità", "vulnerabilità",
            "lutto", "perdita", "morte", "separazione", "abbandono", "rifiuto", "tradimento", "delusione",
            "fallimento", "sconfitta", "umiliazione", "vergogna", "colpa", "rimpianto", "rimorso",
            "solitudine", "isolamento", "emarginazione", "esclusione", "incomprensione",
            "depressione", "disperazione", "scoraggiamento", "abbattimento", "stanchezza", "fatica",
            "esaurimento", "burnout", "sovraccarico", "usura", "invecchiamento", "fine della vita",
            "crisi", "catastrofe", "disastro", "incidente", "guerra", "violenza", "aggressione",
            "insulto", "insulto", "calunnia", "pettegolezzo", "falsa testimonianza", "accusa",
            "prigione", "cattività", "schiavitù", "servitù", "oppressione", "tirannia",
            "lacrime", "pianto", "singhiozzi", "grida", "gemiti", "lamentazioni",
            "tormento", "tortura", "agonia", "calvario", "croce", "prova del fuoco"
        ],        TL: [
            "pagdurusa", "sakit", "kalungkutan", "kalungkutan", "kapighatian", "kahirapan", "pagkabalisa", "pagkabalisa",
            "takot", "takot", "sindak", "sindak", "panic", "stress", "tensyon", "presyon",
            "pagsubok", "pagsubok", "tukso", "kapighatian", "pag-uusig", "pang-aapi", "kawalang-katarungan",
            "sakit", "kahinaan", "kapansanan", "kahinaan", "kahinaan", "kahinaan",
            "pagluluksa", "pagkawala", "kamatayan", "paghihiwalay", "pagpapabaya", "pagtanggi", "pagtataksil", "pagkabigo",
            "kabiguan", "pagkatalo", "pagpapahiya", "kahihiyan", "sala", "pagsisisi", "pagsisisi",
            "kalungkutan", "pagiging nag-iisa", "pagiging marginalized", "pagbubukod", "hindi pagkakaintindihan",
            "depresyon", "pagkawalang-pag-asa", "pagkawalang-pag-asa", "pagkawalang-pag-asa", "pagod", "pagod",
            "pagod", "burnout", "sobrang pagtatrabaho", "pagkasira", "pagtanda", "katapusan ng buhay",
            "krisis", "kalamidad", "sakuna", "aksidente", "digmaan", "karahasan", "pag-atake",
            "insulto", "insulto", "paninirang-puri", "tsismis", "maling saksi", "paratang",
            "bilangguan", "pagkabilanggo", "pagkaalipin", "pagkaalipin", "pang-aapi", "paghahari"
        ],        chapters: [
            "01_GEN_037", "01_GEN_039", "01_GEN_040", "01_GEN_050",
            "02_EXO_001", "02_EXO_002", "02_EXO_003",
            "18_JOB_001", "18_JOB_002", "18_JOB_003", "18_JOB_006", "18_JOB_007", "18_JOB_010",
            "18_JOB_013", "18_JOB_014", "18_JOB_016", "18_JOB_019", "18_JOB_023", "18_JOB_029",
            "18_JOB_030", "18_JOB_038", "18_JOB_042",
            "19_PSA_003", "19_PSA_006", "19_PSA_010", "19_PSA_013", "19_PSA_022", "19_PSA_025",
            "19_PSA_031", "19_PSA_034", "19_PSA_038", "19_PSA_042", "19_PSA_043", "19_PSA_044",
            "19_PSA_054", "19_PSA_055", "19_PSA_056", "19_PSA_057", "19_PSA_059", "19_PSA_069",
            "19_PSA_071", "19_PSA_077", "19_PSA_079", "19_PSA_080", "19_PSA_086", "19_PSA_088",
            "19_PSA_094", "19_PSA_102", "19_PSA_109", "19_PSA_116", "19_PSA_120", "19_PSA_130",
            "19_PSA_140", "19_PSA_141", "19_PSA_142", "19_PSA_143",
            "25_LAM_001", "25_LAM_002", "25_LAM_003", "25_LAM_004", "25_LAM_005",
            "27_DAN_003", "27_DAN_006",
            "32_JON_002",
            "40_MAT_026", "40_MAT_027",
            "41_MAR_014", "41_MAR_015",
            "42_LUK_022", "42_LUK_023",
            "43_JOH_011", "43_JOH_018", "43_JOH_019",
            "44_ACT_007", "44_ACT_012", "44_ACT_016",
            "45_ROM_005", "45_ROM_008",
            "47_2CO_001", "47_2CO_004", "47_2CO_006", "47_2CO_011", "47_2CO_012",
            "58_HEB_011", "58_HEB_012",
            "59_JAS_001", "59_JAS_005",
            "60_1PE_001", "60_1PE_002", "60_1PE_004", "60_1PE_005",
            "66_REV_002", "66_REV_003", "66_REV_006", "66_REV_007"
        ]
    },

    // FAMILLE 5: ESPÉRANCE & AVENIR (esperance_avenir)
    esperance_avenir: {
        FR: [
            "espérance", "espoir", "avenir", "futur", "demain", "promesse", "attente", "projet", "rêve", "vision",
            "anticipation", "confiance en l'avenir", "optimisme", "lendemain", "jours à venir", "temps futurs",
            "destinée", "vocation", "appel", "mission", "but", "objectif", "finalité", "aboutissement",
            "accomplissement", "réalisation", "concrétisation", "devenir", "évolution", "progression",
            "avancement", "développement", "croissance", "maturité", "épanouissement", "plénitude",
            "consommation", "achèvement", "perfection", "nouvelle création", "renouveau", "renaissance",
            "régénération", "restauration", "rénovation", "transformation", "métamorphose", "changement",
            "nouveauté", "innovation", "révolution", "bouleversement", "retournement", "renversement",
            "inversion", "conversion", "repentance", "retour", "restauration", "réhabilitation",
            "rédemption", "rachat", "salut", "délivrance", "libération", "affranchissement",
            "émancipation", "indépendance", "autonomie", "liberté", "franchise"
        ],
        EN: [
            "hope", "expectation", "future", "tomorrow", "promise", "waiting", "anticipation", "dream", "vision",
            "optimism", "destiny", "calling", "mission", "purpose", "goal", "accomplishment", "fulfillment",
            "becoming", "evolution", "growth", "maturity", "new creation", "renewal", "rebirth", "transformation",
            "change", "conversion", "restoration", "redemption", "salvation", "deliverance", "liberation", "freedom",
            "independence", "autonomy", "prospect", "outlook", "aspiration", "ambition", "desire", "wish",
            "longing", "yearning", "expectancy", "confidence", "trust", "belief", "faith", "assurance"
        ],
        PT: [
            "esperança", "expectativa", "futuro", "amanhã", "promessa", "espera", "antecipação", "sonho", "visão",
            "otimismo", "destino", "chamado", "missão", "propósito", "objetivo", "realização", "cumprimento",
            "evolução", "crescimento", "maturidade", "nova criação", "renovação", "renascimento", "transformação",
            "mudança", "conversão", "restauração", "redenção", "salvação", "libertação", "liberdade",
            "independência", "autonomia", "perspectiva", "aspiração", "ambição", "desejo", "anseio"
        ],
        ES: [
            "esperanza", "expectativa", "futuro", "mañana", "promesa", "espera", "anticipación", "sueño", "visión",
            "optimismo", "destino", "llamado", "misión", "propósito", "objetivo", "realización", "cumplimiento",
            "evolución", "crecimiento", "madurez", "nueva creación", "renovación", "renacimiento", "transformación",
            "cambio", "conversión", "restauración", "redención", "salvación", "liberación", "libertad",
            "independencia", "autonomía", "perspectiva", "aspiración", "ambición", "deseo", "anhelo"
        ],
        DE: [
            "hoffnung", "erwartung", "zukunft", "morgen", "versprechen", "warten", "vorfreude", "traum", "vision",
            "optimismus", "schicksal", "berufung", "mission", "zweck", "ziel", "erfüllung", "verwirklichung",
            "entwicklung", "wachstum", "reife", "neue schöpfung", "erneuerung", "wiedergeburt", "verwandlung",
            "veränderung", "bekehrung", "wiederherstellung", "erlösung", "rettung", "befreiung", "freiheit",
            "unabhängigkeit", "autonomie", "aussicht", "sehnsucht", "verlangen", "wunsch"
        ],
        IT: [
            "speranza", "aspettativa", "futuro", "domani", "promessa", "attesa", "anticipazione", "sogno", "visione",
            "ottimismo", "destino", "chiamata", "missione", "scopo", "obiettivo", "realizzazione", "compimento",
            "evoluzione", "crescita", "maturità", "nuova creazione", "rinnovamento", "rinascita", "trasformazione",
            "cambiamento", "conversione", "restaurazione", "redenzione", "salvezza", "liberazione", "libertà",
            "indipendenza", "autonomia", "prospettiva", "aspirazione", "ambizione", "desiderio", "anelito"
        ],        TL: [
            "pag-asa", "inaasahan", "hinaharap", "bukas", "pangako", "paghihintay", "pangarap", "pangitain",
            "optimismo", "kapalaran", "tawag", "misyon", "layunin", "tagumpay", "katuparan",
            "ebolusyon", "paglaki", "pagkahinog", "bagong paglikha", "pagbabago", "muling pagsilang",
            "pagbabago", "pagsisisi", "pagbabalik", "pagtubos", "kaligtasan", "kalayaan"
        ],        chapters: [
            "19_PSA_042", "19_PSA_043", "19_PSA_071", "19_PSA_130",
            "23_ISA_025", "23_ISA_040", "23_ISA_043",
            "24_JER_029", "24_JER_031",
            "25_LAM_003",
            "45_ROM_008", "45_ROM_015",
            "47_2CO_004",
            "49_EPH_001",
            "50_PHP_001",
            "51_COL_001",
            "52_1TH_004", "52_1TH_005",
            "66_REV_021", "66_REV_022"
        ]
    },

    // FAMILLE 6: SAGESSE & DIRECTION (sagesse_direction)
    sagesse_direction: {
        FR: [
            "sagesse", "discernement", "intelligence", "prudence", "conseil", "avis", "guidance", "direction",
            "chemin", "voie", "route", "sentier", "conduite", "orientation", "gouverne", "pilotage",
            "leadership", "autorité", "commandement", "instruction", "enseignement", "éducation", "formation",
            "apprentissage", "connaissance", "savoir", "science", "compréhension", "entendement", "perception",
            "clairvoyance", "lucidité", "perspicacité", "pénétration", "finesse", "subtilité", "acuité",
            "vivacité", "promptitude", "rapidité", "agilité", "souplesse", "flexibilité", "adaptation",
            "ajustement", "correction", "rectification", "redressement", "amélioration", "perfectionnement", "progrès",
            "raison", "jugement", "bon sens", "réflexion", "méditation", "contemplation", "révélation"
        ],
        EN: [
            "wisdom", "discernment", "understanding", "prudence", "counsel", "guidance", "direction", "way",
            "path", "leadership", "instruction", "teaching", "knowledge", "insight", "perception", "clarity",
            "correction", "improvement", "progress", "reason", "judgment", "common sense", "reflection",
            "meditation", "contemplation", "revelation", "enlightenment", "learning", "education", "training",
            "comprehension", "awareness", "consciousness", "intelligence", "smartness", "shrewdness"
        ],
        PT: [
            "sabedoria", "discernimento", "entendimento", "prudência", "conselho", "orientação", "direção", "caminho",
            "via", "liderança", "instrução", "ensino", "conhecimento", "percepção", "clareza",
            "correção", "melhoria", "progresso", "razão", "julgamento", "bom senso", "reflexão",
            "meditação", "contemplação", "revelação", "iluminação", "aprendizagem", "educação", "formação"
        ],
        ES: [
            "sabiduría", "discernimiento", "entendimiento", "prudencia", "consejo", "orientación", "dirección", "camino",
            "vía", "liderazgo", "instrucción", "enseñanza", "conocimiento", "percepción", "claridad",
            "corrección", "mejora", "progreso", "razón", "juicio", "sentido común", "reflexión",
            "meditación", "contemplación", "revelación", "iluminación", "aprendizaje", "educación", "formación"
        ],
        DE: [
            "weisheit", "unterscheidung", "verständnis", "klugheit", "rat", "führung", "richtung", "weg",
            "pfad", "leitung", "anweisung", "lehre", "wissen", "einsicht", "wahrnehmung", "klarheit",
            "korrektur", "verbesserung", "fortschritt", "vernunft", "urteil", "gesunder menschenverstand", "reflexion",
            "meditation", "betrachtung", "offenbarung", "erleuchtung", "lernen", "bildung", "ausbildung"
        ],
        IT: [
            "saggezza", "discernimento", "comprensione", "prudenza", "consiglio", "guida", "direzione", "via",
            "sentiero", "leadership", "istruzione", "insegnamento", "conoscenza", "percezione", "chiarezza",
            "correzione", "miglioramento", "progresso", "ragione", "giudizio", "buon senso", "riflessione",
            "meditazione", "contemplazione", "rivelazione", "illuminazione", "apprendimento", "educazione", "formazione"
        ],        TL: [
            "karunungan", "pagkilala", "pag-unawa", "kaingatan", "payo", "paggabay", "direksyon", "daan",
            "landas", "pamumuno", "turo", "pagtuturo", "kaalaman", "pang-unawa", "kalinawan",
            "pagwawasto", "pagpapabuti", "pag-unlad", "katwiran", "paghatol", "common sense", "pag-iisip",
            "pagmumuni-muni", "pagbubulay", "pahayag", "liwanag", "pag-aaral", "edukasyon"
        ],        chapters: [
            "20_PRO_001", "20_PRO_002", "20_PRO_003", "20_PRO_004", "20_PRO_008", "20_PRO_009",
            "19_PSA_001", "19_PSA_019", "19_PSA_025", "19_PSA_032", "19_PSA_119",
            "21_ECC_002", "21_ECC_012",
            "59_JAS_001", "59_JAS_003",
            "51_COL_001", "51_COL_003"
        ]
    },

    // FAMILLE 7: LOUANGE & ADORATION (louange_adoration)
    louange_adoration: {
        FR: [
            "louange", "adoration", "célébration", "gloire", "honneur", "magnificence", "exaltation", "élévation",
            "hommage", "culte", "vénération", "révérence", "respect", "déférence", "soumission", "prosternation",
            "génuflexion", "agenouillage", "inclination", "salutation", "bénédiction", "action de grâces",
            "gratitude", "reconnaissance", "remerciement", "merci", "alléluia", "hosanna", "amen",
            "chant", "cantique", "hymne", "psaume", "poème", "ode", "mélodie", "harmonie", "symphonie",
            "concert", "orchestre", "choeur", "assemblée", "congrégation", "église", "temple", "sanctuaire",
            "lieu saint", "présence divine", "gloire de dieu", "joie", "jubilation", "acclamation", "ovation"
        ],
        EN: [
            "praise", "worship", "adoration", "glory", "honor", "celebration", "exaltation", "reverence",
            "thanksgiving", "gratitude", "hallelujah", "hosanna", "amen", "song", "hymn", "psalm", "melody",
            "harmony", "assembly", "church", "sanctuary", "divine presence", "glory of god", "joy", "jubilation",
            "acclamation", "tribute", "homage", "veneration", "submission", "prostration", "blessing",
            "thanksgiving", "choir", "congregation", "temple", "holy place"
        ],
        PT: [
            "louvor", "adoração", "celebração", "glória", "honra", "exaltação", "reverência",
            "ação de graças", "gratidão", "aleluia", "hosana", "amém", "cântico", "hino", "salmo", "melodia",
            "harmonia", "assembleia", "igreja", "santuário", "presença divina", "glória de deus", "alegria", "júbilo",
            "aclamação", "tributo", "homenagem", "veneração", "submissão", "prostração", "bênção",
            "coro", "congregação", "templo", "lugar santo"
        ],
        ES: [
            "alabanza", "adoración", "celebración", "gloria", "honor", "exaltación", "reverencia",
            "acción de gracias", "gratitud", "aleluya", "hosanna", "amén", "cántico", "himno", "salmo", "melodía",
            "armonía", "asamblea", "iglesia", "santuario", "presencia divina", "gloria de dios", "alegría", "júbilo",
            "aclamación", "tributo", "homenaje", "veneración", "sumisión", "postración", "bendición",
            "coro", "congregación", "templo", "lugar santo"
        ],
        DE: [
            "lob", "anbetung", "verehrung", "herrlichkeit", "ehre", "feier", "erhöhung", "ehrfurcht",
            "danksagung", "dankbarkeit", "halleluja", "hosianna", "amen", "lied", "hymne", "psalm", "melodie",
            "harmonie", "versammlung", "kirche", "heiligtum", "göttliche gegenwart", "herrlichkeit gottes", "freude", "jubel",
            "akklamation", "tribut", "huldigung", "verehrung", "unterwerfung", "niederwerfung", "segen",
            "chor", "gemeinde", "tempel", "heiliger ort"
        ],
        IT: [
            "lode", "adorazione", "celebrazione", "gloria", "onore", "esaltazione", "riverenza",
            "ringraziamento", "gratitudine", "alleluia", "osanna", "amen", "cantico", "inno", "salmo", "melodia",
            "armonia", "assemblea", "chiesa", "santuario", "presenza divina", "gloria di dio", "gioia", "giubilo",
            "acclamazione", "tributo", "omaggio", "venerazione", "sottomissione", "prostrazione", "benedizione",
            "coro", "congregazione", "tempio", "luogo santo"
        ],        TL: [
            "papuri", "pagsamba", "pagdiriwang", "kaluwalhatian", "karangalan", "pagtataas", "paggalang",
            "pasasalamat", "pagpapasalamat", "aleluya", "hosana", "amen", "awit", "himno", "salmo", "himig",
            "harmonia", "kapulungan", "simbahan", "santuwaryo", "presensya ng diyos", "kaluwalhatian ng diyos", "kagalakan", "sigawan",
            "sigaw", "parangal", "paggalang", "pagsamba", "pagsunod", "pagluhod", "pagpapala",
            "koro", "kongregasyon", "templo", "banal na lugar"
        ],        chapters: [
            "19_PSA_008", "19_PSA_019", "19_PSA_024", "19_PSA_029", "19_PSA_033", "19_PSA_034",
            "19_PSA_047", "19_PSA_050", "19_PSA_063", "19_PSA_084", "19_PSA_095", "19_PSA_096",
            "19_PSA_098", "19_PSA_100", "19_PSA_103", "19_PSA_145", "19_PSA_148", "19_PSA_150",
            "23_ISA_006", "23_ISA_012",
            "66_REV_004", "66_REV_005", "66_REV_015", "66_REV_019"
        ]
    },

    // FAMILLE 8: REPENTANCE & PARDON (repentance_pardon)
    repentance_pardon: {
        FR: [
            "repentance", "repentir", "contrition", "regret", "remords", "componction", "pénitence", "confession",
            "aveu", "reconnaissance de faute", "culpabilité", "honte", "confusion", "humiliation", "abaissement",
            "prostration", "pardon", "grâce", "miséricorde", "compassion", "clémence", "indulgence", "absolution",
            "rémission", "réconciliation", "paix", "harmonie", "unité", "communion", "restauration", "guérison",
            "purification", "nettoyage", "blanchiment", "sanctification", "justification", "rédemption", "salut",
            "conversion", "transformation", "renouveau", "renaissance", "regret sincère", "coeur brisé", "esprit contrit"
        ],
        EN: [
            "repentance", "contrition", "regret", "remorse", "penitence", "confession", "guilt", "forgiveness",
            "grace", "mercy", "compassion", "absolution", "reconciliation", "purification", "sanctification",
            "justification", "redemption", "conversion", "transformation", "renewal", "rebirth", "sincere regret",
            "broken heart", "contrite spirit", "acknowledgment", "admission", "shame", "humiliation", "restoration",
            "healing", "cleansing", "whitening", "salvation", "peace", "harmony", "unity", "communion"
        ],
        PT: [
            "arrependimento", "contrição", "arrependimento", "remorso", "penitência", "confissão", "culpa", "perdão",
            "graça", "misericórdia", "compaixão", "absolvição", "reconciliação", "purificação", "santificação",
            "justificação", "redenção", "conversão", "transformação", "renovação", "renascimento", "arrependimento sincero",
            "coração quebrantado", "espírito contrito", "reconhecimento", "admissão", "vergonha", "humilhação", "restauração",
            "cura", "limpeza", "alvura", "salvação", "paz", "harmonia", "unidade", "comunhão"
        ],
        ES: [
            "arrepentimiento", "contrición", "arrepentimiento", "remordimiento", "penitencia", "confesión", "culpa", "perdón",
            "gracia", "misericordia", "compasión", "absolución", "reconciliación", "purificación", "santificación",
            "justificación", "redención", "conversión", "transformación", "renovación", "renacimiento", "arrepentimiento sincero",
            "corazón quebrantado", "espíritu contrito", "reconocimiento", "admisión", "vergüenza", "humillación", "restauración",
            "sanación", "limpieza", "blancura", "salvación", "paz", "armonía", "unidad", "comunión"
        ],
        DE: [
            "buße", "reue", "bedauern", "gewissensbisse", "buße", "bekenntnis", "schuld", "vergebung",
            "gnade", "barmherzigkeit", "mitgefühl", "absolution", "versöhnung", "reinigung", "heiligung",
            "rechtfertigung", "erlösung", "bekehrung", "verwandlung", "erneuerung", "wiedergeburt", "aufrichtige reue",
            "zerbrochenes herz", "zerknirschter geist", "anerkennung", "eingeständnis", "scham", "demütigung", "wiederherstellung",
            "heilung", "reinigung", "weißwerden", "rettung", "frieden", "harmonie", "einheit", "gemeinschaft"
        ],
        IT: [
            "pentimento", "contrizione", "rimpianto", "rimorso", "penitenza", "confessione", "colpa", "perdono",
            "grazia", "misericordia", "compassione", "assoluzione", "riconciliazione", "purificazione", "santificazione",
            "giustificazione", "redenzione", "conversione", "trasformazione", "rinnovamento", "rinascita", "pentimento sincero",
            "cuore spezzato", "spirito contrito", "riconoscimento", "ammissione", "vergogna", "umiliazione", "restaurazione",
            "guarigione", "pulizia", "imbiancatura", "salvezza", "pace", "armonia", "unità", "comunione"
        ],        TL: [
            "pagsisisi", "pagsisisi", "pagsisisi", "pagsisisi", "penitensya", "kumpisal", "sala", "kapatawaran",
            "biyaya", "awa", "habag", "kapatawaran", "pagkakasundo", "paglilinis", "pagbabanal",
            "pagpapawalang-sala", "pagtubos", "pagbabalik-loob", "pagbabago", "pagpapanibago", "muling kapanganakan", "tunay na pagsisisi",
            "pusong wasak", "espiritung nagsisisi", "pagkilala", "pag-amin", "kahihiyan", "pagpapahiya", "pagbabalik",
            "paggaling", "paglilinis", "pagpapaputi", "kaligtasan", "kapayapaan", "pagkakaisa", "pakikipag-ugnayan"
        ],        chapters: [
            "19_PSA_032", "19_PSA_051", "19_PSA_103",
            "23_ISA_001", "23_ISA_055",
            "26_EZE_018", "26_EZE_033",
            "28_HOS_014",
            "32_JON_003",
            "42_LUK_015", "42_LUK_018",
            "44_ACT_002", "44_ACT_003",
            "45_ROM_002",
            "47_2CO_007",
            "62_1JO_001", "62_1JO_002"
        ]
    },

    // FAMILLE 9: COMBAT & VICTOIRE (combat_victoire)
    combat_victoire: {
        FR: [
            "combat", "bataille", "guerre", "lutte", "conflit", "affrontement", "confrontation", "opposition",
            "résistance", "défense", "protection", "garde", "vigilance", "veille", "surveillance", "attention",
            "prudence", "précaution", "prévention", "armure", "équipement", "armes", "bouclier", "épée",
            "casque", "cuirasse", "courage", "bravoure", "vaillance", "hardiesse", "audace", "intrépidité",
            "héroïsme", "force", "puissance", "pouvoir", "autorité", "domination", "victoire", "triomphe",
            "succès", "conquête", "gain", "trophée", "couronne", "palme", "laurier", "récompense", "prix",
            "gloire", "honneur", "ennemi", "adversaire", "satan", "diable", "démon", "mal", "ténèbres"
        ],
        EN: [
            "combat", "battle", "warfare", "struggle", "conflict", "resistance", "defense", "protection",
            "vigilance", "armor", "weapons", "shield", "sword", "helmet", "breastplate", "courage", "bravery",
            "strength", "power", "authority", "victory", "triumph", "conquest", "crown", "reward", "prize",
            "glory", "honor", "enemy", "adversary", "satan", "devil", "demon", "evil", "darkness",
            "fight", "war", "opposition", "guard", "watch", "attention", "caution", "prevention",
            "boldness", "fearlessness", "heroism", "dominion", "success", "trophy", "palm", "laurel"
        ],
        PT: [
            "combate", "batalha", "guerra", "luta", "conflito", "resistência", "defesa", "proteção",
            "vigilância", "armadura", "armas", "escudo", "espada", "capacete", "couraça", "coragem", "bravura",
            "força", "poder", "autoridade", "vitória", "triunfo", "conquista", "coroa", "recompensa", "prêmio",
            "glória", "honra", "inimigo", "adversário", "satanás", "diabo", "demônio", "mal", "trevas",
            "luta", "guerra", "oposição", "guarda", "vigia", "atenção", "cautela", "prevenção",
            "ousadia", "destemor", "heroísmo", "domínio", "sucesso", "troféu", "palma", "louros"
        ],
        ES: [
            "combate", "batalla", "guerra", "lucha", "conflicto", "resistencia", "defensa", "protección",
            "vigilancia", "armadura", "armas", "escudo", "espada", "casco", "coraza", "coraje", "valentía",
            "fuerza", "poder", "autoridad", "victoria", "triunfo", "conquista", "corona", "recompensa", "premio",
            "gloria", "honor", "enemigo", "adversario", "satanás", "diablo", "demonio", "mal", "tinieblas",
            "lucha", "guerra", "oposición", "guardia", "vigilia", "atención", "precaución", "prevención",
            "audacia", "intrepidez", "heroísmo", "dominio", "éxito", "trofeo", "palma", "laurel"
        ],
        DE: [
            "kampf", "schlacht", "krieg", "kampf", "konflikt", "widerstand", "verteidigung", "schutz",
            "wachsamkeit", "rüstung", "waffen", "schild", "schwert", "helm", "brustpanzer", "mut", "tapferkeit",
            "kraft", "macht", "autorität", "sieg", "triumph", "eroberung", "krone", "belohnung", "preis",
            "herrlichkeit", "ehre", "feind", "gegner", "satan", "teufel", "dämon", "böse", "finsternis",
            "kampf", "krieg", "opposition", "wache", "wacht", "aufmerksamkeit", "vorsicht", "vorbeugung",
            "kühnheit", "furchtlosigkeit", "heldentum", "herrschaft", "erfolg", "trophäe", "palme", "lorbeer"
        ],
        IT: [
            "combattimento", "battaglia", "guerra", "lotta", "conflitto", "resistenza", "difesa", "protezione",
            "vigilanza", "armatura", "armi", "scudo", "spada", "elmo", "corazza", "coraggio", "bravura",
            "forza", "potere", "autorità", "vittoria", "trionfo", "conquista", "corona", "ricompensa", "premio",
            "gloria", "onore", "nemico", "avversario", "satana", "diavolo", "demone", "male", "tenebre",
            "lotta", "guerra", "opposizione", "guardia", "veglia", "attenzione", "cautela", "prevenzione",
            "audacia", "intrepidezza", "eroismo", "dominio", "successo", "trofeo", "palma", "alloro"
        ],        TL: [
            "labanan", "labanan", "digmaan", "pakikibaka", "tunggalian", "paglaban", "depensa", "proteksyon",
            "pagbabantay", "baluti", "sandata", "kalasag", "espada", "helmet", "baluti sa dibdib", "tapang", "katapangan",
            "lakas", "kapangyarihan", "awtoridad", "tagumpay", "tagumpay", "pagsakop", "korona", "gantimpala", "premyo",
            "kaluwalhatian", "karangalan", "kaaway", "kalaban", "satanas", "diyablo", "demonyo", "kasamaan", "kadiliman",
            "labanan", "digmaan", "pagsalungat", "bantay", "bantay", "pansin", "pag-iingat", "pag-iwas",
            "katapangan", "walang takot", "kabayanihan", "paghahari", "tagumpay", "tropeyo", "palma", "laurel"
        ],        chapters: [
            "02_EXO_014", "02_EXO_015",
            "06_JOS_001", "06_JOS_006",
            "07_JDG_007",
            "09_1SAM_017",
            "19_PSA_018", "19_PSA_020", "19_PSA_144",
            "23_ISA_059",
            "45_ROM_008",
            "46_1CO_015",
            "47_2CO_002",
            "49_EPH_006",
            "52_1TH_005",
            "55_2TI_002",
            "66_REV_012", "66_REV_019"
        ]
    },

    // FAMILLE 10: PAIX & REPOS (paix_repos)
    paix_repos: {
        FR: [
            "paix", "repos", "détente", "relaxation", "décontraction", "délassement", "soulagement", "apaisement",
            "calme", "tranquillité", "sérénité", "quiétude", "silence", "immobilité", "arrêt", "pause",
            "halte", "interruption", "suspension", "cessation", "fin", "terme", "conclusion", "achèvement",
            "sabbat", "jour de repos", "vacances", "congé", "retraite", "refuge", "abri", "asile",
            "sanctuaire", "havre", "oasis", "port", "ancrage", "stabilité", "sécurité", "sûreté",
            "protection", "confiance", "assurance", "certitude", "conviction", "satisfaction", "contentement",
            "bien-être", "harmonie", "équilibre", "stabilité", "sérénité", "quiétude", "stillness"
        ],
        EN: [
            "peace", "rest", "relaxation", "calm", "tranquility", "serenity", "quiet", "silence", "stillness",
            "pause", "sabbath", "vacation", "retreat", "refuge", "shelter", "haven", "stability", "security",
            "safety", "confidence", "assurance", "certainty", "satisfaction", "contentment", "well-being",
            "harmony", "balance", "equilibrium", "composure", "calmness", "quietness", "repose", "respite",
            "relief", "ease", "comfort", "solace", "consolation", "cessation", "stop", "halt", "break"
        ],
        PT: [
            "paz", "descanso", "relaxamento", "calma", "tranquilidade", "serenidade", "silêncio", "quietude",
            "pausa", "sábado", "férias", "retiro", "refúgio", "abrigo", "asilo", "santuário", "estabilidade",
            "segurança", "proteção", "confiança", "certeza", "satisfação", "contentamento", "bem-estar",
            "harmonia", "equilíbrio", "compostura", "calmaria", "sossego", "repouso", "alívio",
            "conforto", "consolo", "cessação", "parada", "intervalo", "descanso", "trégua"
        ],
        ES: [
            "paz", "descanso", "relajación", "calma", "tranquilidad", "serenidad", "silencio", "quietud",
            "pausa", "sábado", "vacaciones", "retiro", "refugio", "abrigo", "asilo", "santuario", "estabilidad",
            "seguridad", "protección", "confianza", "certeza", "satisfacción", "contentamiento", "bienestar",
            "armonía", "equilibrio", "compostura", "calma", "sosiego", "reposo", "alivio",
            "consuelo", "consuelo", "cese", "parada", "pausa", "descanso", "tregua"
        ],
        DE: [
            "frieden", "ruhe", "entspannung", "ruhe", "gelassenheit", "stille", "schweigen", "stillness",
            "pause", "sabbat", "urlaub", "rückzug", "zuflucht", "schutz", "asyl", "heiligtum", "stabilität",
            "sicherheit", "schutz", "vertrauen", "gewissheit", "zufriedenheit", "zufriedenheit", "wohlbefinden",
            "harmonie", "gleichgewicht", "ausgeglichenheit", "ruhe", "stille", "ruhe", "erleichterung",
            "komfort", "trost", "einstellung", "halt", "pause", "ruhe", "waffenstillstand"
        ],
        IT: [
            "pace", "riposo", "rilassamento", "calma", "tranquillità", "serenità", "silenzio", "quiete",
            "pausa", "sabato", "vacanze", "ritiro", "rifugio", "riparo", "asilo", "santuario", "stabilità",
            "sicurezza", "protezione", "fiducia", "certezza", "soddisfazione", "contentezza", "benessere",
            "armonia", "equilibrio", "compostezza", "calma", "quiete", "riposo", "sollievo",
            "conforto", "consolazione", "cessazione", "fermata", "pausa", "riposo", "tregua"
        ],        TL: [
            "kapayapaan", "pahinga", "pagpapahinga", "kalma", "katahimikan", "katiwasayan", "katahimikan", "katahimikan",
            "pahinga", "sabbath", "bakasyon", "pag-urong", "kanlungan", "kublihan", "ampunan", "santuwaryo", "katatagan",
            "seguridad", "proteksyon", "tiwala", "katiyakan", "kasiyahan", "kasiyahan", "kaginhawahan",
            "pagkakaisa", "balanse", "kalmado", "katahimikan", "katahimikan", "pahinga", "ginhawa",
            "aliw", "aliw", "paghinto", "tigil", "pahinga", "pahinga", "tigil-putukan"
        ],        chapters: [
            "19_PSA_004", "19_PSA_023", "19_PSA_037", "19_PSA_046", "19_PSA_062", "19_PSA_091",
            "19_PSA_121", "19_PSA_131",
            "23_ISA_026", "23_ISA_030", "23_ISA_040", "23_ISA_057",
            "40_MAT_011",
            "43_JOH_014",
            "50_PHP_004",
            "52_1TH_005",
            "58_HEB_004"
        ]
    },

    // FAMILLE 11: JUSTICE & JUGEMENT (justice_jugement)
    justice_jugement: {
        FR: [
            "justice", "équité", "droiture", "intégrité", "honnêteté", "probité", "rectitude", "impartialité",
            "neutralité", "objectivité", "jugement", "tribunal", "juge", "sentence", "verdict", "décision",
            "arrêt", "condamnation", "acquittement", "innocence", "culpabilité", "faute", "crime", "délit",
            "infraction", "transgression", "violation", "loi", "commandement", "ordonnance", "décret", "statut",
            "règle", "norme", "standard", "critère", "mesure", "balance", "poids", "justesse", "exactitude",
            "précision", "rigueur", "sévérité", "dureté", "clémence", "miséricorde", "pardon", "grâce",
            "oppression", "injustice", "iniquité", "tort", "mal", "méchanceté", "corruption", "perversion"
        ],
        EN: [
            "justice", "equity", "righteousness", "integrity", "honesty", "impartiality", "judgment", "tribunal",
            "judge", "sentence", "verdict", "condemnation", "acquittal", "innocence", "guilt", "law", "commandment",
            "decree", "standard", "measure", "balance", "weight", "accuracy", "precision", "rigor", "severity",
            "clemency", "mercy", "forgiveness", "grace", "oppression", "injustice", "iniquity", "wrong", "evil",
            "wickedness", "corruption", "perversion", "fairness", "uprightness", "probity", "rectitude",
            "neutrality", "objectivity", "decision", "ruling", "fault", "crime", "offense", "transgression"
        ],
        PT: [
            "justiça", "equidade", "retidão", "integridade", "honestidade", "imparcialidade", "julgamento", "tribunal",
            "juiz", "sentença", "veredicto", "condenação", "absolvição", "inocência", "culpa", "lei", "mandamento",
            "decreto", "padrão", "medida", "balança", "peso", "exatidão", "precisão", "rigor", "severidade",
            "clemência", "misericórdia", "perdão", "graça", "opressão", "injustiça", "iniquidade", "erro", "mal",
            "maldade", "corrupção", "perversão", "equidade", "retidão", "probidade", "retidão",
            "neutralidade", "objetividade", "decisão", "decisão", "falta", "crime", "ofensa", "transgressão"
        ],
        ES: [
            "justicia", "equidad", "rectitud", "integridad", "honestidad", "imparcialidad", "juicio", "tribunal",
            "juez", "sentencia", "veredicto", "condena", "absolución", "inocencia", "culpa", "ley", "mandamiento",
            "decreto", "estándar", "medida", "balanza", "peso", "exactitud", "precisión", "rigor", "severidad",
            "clemencia", "misericordia", "perdón", "gracia", "opresión", "injusticia", "iniquidad", "error", "mal",
            "maldad", "corrupción", "perversión", "equidad", "rectitud", "probidad", "rectitud",
            "neutralidad", "objetividad", "decisión", "fallo", "falta", "crimen", "ofensa", "transgresión"
        ],
        DE: [
            "gerechtigkeit", "billigkeit", "rechtschaffenheit", "integrität", "ehrlichkeit", "unparteilichkeit", "urteil", "gericht",
            "richter", "urteil", "urteil", "verurteilung", "freispruch", "unschuld", "schuld", "gesetz", "gebot",
            "erlass", "standard", "maß", "waage", "gewicht", "genauigkeit", "präzision", "strenge", "härte",
            "milde", "barmherzigkeit", "vergebung", "gnade", "unterdrückung", "ungerechtigkeit", "ungerechtigkeit", "unrecht", "böse",
            "bosheit", "korruption", "perversion", "fairness", "aufrichtigkeit", "redlichkeit", "rechtschaffenheit",
            "neutralität", "objektivität", "entscheidung", "urteil", "fehler", "verbrechen", "vergehen", "übertretung"
        ],
        IT: [
            "giustizia", "equità", "rettitudine", "integrità", "onestà", "imparzialità", "giudizio", "tribunale",
            "giudice", "sentenza", "verdetto", "condanna", "assoluzione", "innocenza", "colpa", "legge", "comandamento",
            "decreto", "standard", "misura", "bilancia", "peso", "esattezza", "precisione", "rigore", "severità",
            "clemenza", "misericordia", "perdono", "grazia", "oppressione", "ingiustizia", "iniquità", "torto", "male",
            "malvagità", "corruzione", "perversione", "equità", "rettitudine", "probità", "rettitudine",
            "neutralità", "obiettività", "decisione", "sentenza", "colpa", "crimine", "offesa", "trasgressione"
        ],        TL: [
            "katarungan", "patas", "katuwiran", "integridad", "katapatan", "walang kinikilingan", "paghatol", "hukuman",
            "hukom", "hatol", "hatol", "paghatol", "pagpapawalang-sala", "kawalang-sala", "sala", "batas", "utos",
            "kautusan", "pamantayan", "sukat", "timbangan", "timbang", "katumpakan", "katumpakan", "higpit", "kabagsikan",
            "habag", "awa", "kapatawaran", "biyaya", "pang-aapi", "kawalang-katarungan", "kasamaan", "mali", "masama",
            "kasamaan", "katiwalian", "kasamaan", "patas", "katuwiran", "katapatan", "katuwiran",
            "neutralidad", "pagiging layunin", "desisyon", "hatol", "sala", "krimen", "paglabag", "paglabag"
        ],        chapters: [
            "19_PSA_007", "19_PSA_009", "19_PSA_010", "19_PSA_037", "19_PSA_072", "19_PSA_082",
            "19_PSA_089",
            "20_PRO_021", "20_PRO_029",
            "21_ECC_003",
            "23_ISA_001", "23_ISA_011", "23_ISA_058",
            "24_JER_022",
            "30_AMO_005",
            "33_MIC_006",
            "38_ZEC_007",
            "40_MAT_023", "40_MAT_025",
            "45_ROM_002",
            "59_JAS_002",
            "66_REV_020"
        ]
    },

    // FAMILLE 12: CRÉATION & NATURE (creation_nature)
    creation_nature: {
        FR: [
            "création", "nature", "univers", "cosmos", "monde", "terre", "planète", "ciel", "cieux", "firmament",
            "étoiles", "soleil", "lune", "jour", "nuit", "lumière", "ténèbres", "eaux", "mer", "océan",
            "rivière", "fleuve", "source", "fontaine", "montagne", "colline", "vallée", "plaine", "désert", "forêt",
            "arbre", "plante", "fleur", "fruit", "graine", "semence", "végétation", "verdure", "herbe", "champ",
            "jardin", "paradis", "eden", "animaux", "créatures", "êtres vivants", "oiseaux", "poissons", "bétail",
            "bêtes sauvages", "insectes", "reptiles", "saisons", "printemps", "été", "automne", "hiver", "pluie",
            "vent", "tempête", "orage", "éclair", "tonnerre", "arc-en-ciel", "nuages", "brouillard", "rosée"
        ],
        EN: [
            "creation", "nature", "universe", "cosmos", "world", "earth", "sky", "heaven", "stars", "sun",
            "moon", "light", "darkness", "waters", "sea", "river", "mountain", "valley", "desert", "forest",
            "tree", "plant", "flower", "fruit", "vegetation", "garden", "paradise", "animals", "creatures",
            "birds", "fish", "cattle", "seasons", "spring", "summer", "autumn", "winter", "rain", "wind",
            "storm", "rainbow", "clouds", "lightning", "thunder", "planet", "firmament", "ocean", "stream",
            "fountain", "hill", "plain", "seed", "grass", "field", "eden", "living beings", "wild beasts",
            "insects", "reptiles", "fog", "dew", "tempest", "weather"
        ],
        PT: [
            "criação", "natureza", "universo", "cosmos", "mundo", "terra", "céu", "céus", "estrelas", "sol",
            "lua", "luz", "trevas", "águas", "mar", "rio", "montanha", "vale", "deserto", "floresta",
            "árvore", "planta", "flor", "fruto", "vegetação", "jardim", "paraíso", "animais", "criaturas",
            "pássaros", "peixes", "gado", "estações", "primavera", "verão", "outono", "inverno", "chuva", "vento",
            "tempestade", "arco-íris", "nuvens", "relâmpago", "trovão", "planeta", "firmamento", "oceano", "riacho",
            "fonte", "colina", "planície", "semente", "grama", "campo", "éden", "seres vivos", "bestas selvagens",
            "insetos", "répteis", "neblina", "orvalho", "tempestade", "clima"
        ],
        ES: [
            "creación", "naturaleza", "universo", "cosmos", "mundo", "tierra", "cielo", "cielos", "estrellas", "sol",
            "luna", "luz", "tinieblas", "aguas", "mar", "río", "montaña", "valle", "desierto", "bosque",
            "árbol", "planta", "flor", "fruto", "vegetación", "jardín", "paraíso", "animales", "criaturas",
            "pájaros", "peces", "ganado", "estaciones", "primavera", "verano", "otoño", "invierno", "lluvia", "viento",
            "tormenta", "arco iris", "nubes", "relámpago", "trueno", "planeta", "firmamento", "océano", "arroyo",
            "fuente", "colina", "llanura", "semilla", "hierba", "campo", "edén", "seres vivientes", "bestias salvajes",
            "insectos", "reptiles", "niebla", "rocío", "tempestad", "clima"
        ],
        DE: [
            "schöpfung", "natur", "universum", "kosmos", "welt", "erde", "himmel", "himmel", "sterne", "sonne",
            "mond", "licht", "finsternis", "wasser", "meer", "fluss", "berg", "tal", "wüste", "wald",
            "baum", "pflanze", "blume", "frucht", "vegetation", "garten", "paradies", "tiere", "kreaturen",
            "vögel", "fische", "vieh", "jahreszeiten", "frühling", "sommer", "herbst", "winter", "regen", "wind",
            "sturm", "regenbogen", "wolken", "blitz", "donner", "planet", "firmament", "ozean", "bach",
            "quelle", "hügel", "ebene", "samen", "gras", "feld", "eden", "lebewesen", "wilde tiere",
            "insekten", "reptilien", "nebel", "tau", "unwetter", "wetter"
        ],
        IT: [
            "creazione", "natura", "universo", "cosmo", "mondo", "terra", "cielo", "cieli", "stelle", "sole",
            "luna", "luce", "tenebre", "acque", "mare", "fiume", "montagna", "valle", "deserto", "foresta",
            "albero", "pianta", "fiore", "frutto", "vegetazione", "giardino", "paradiso", "animali", "creature",
            "uccelli", "pesci", "bestiame", "stagioni", "primavera", "estate", "autunno", "inverno", "pioggia", "vento",
            "tempesta", "arcobaleno", "nuvole", "fulmine", "tuono", "pianeta", "firmamento", "oceano", "ruscello",
            "fontana", "collina", "pianura", "seme", "erba", "campo", "eden", "esseri viventi", "bestie selvatiche",
            "insetti", "rettili", "nebbia", "rugiada", "tempesta", "tempo"
        ],        TL: [
            "paglikha", "kalikasan", "sansinukob", "kosmos", "mundo", "lupa", "langit", "kalangitan", "bituin", "araw",
            "buwan", "liwanag", "kadiliman", "tubig", "dagat", "ilog", "bundok", "lambak", "disyerto", "gubat",
            "puno", "halaman", "bulaklak", "prutas", "mga halaman", "hardin", "paraiso", "mga hayop", "mga nilikha",
            "mga ibon", "isda", "hayop", "panahon", "tagsibol", "tag-araw", "taglagas", "taglamig", "ulan", "hangin",
            "bagyo", "bahaghari", "ulap", "kidlat", "kulog", "planeta", "kalangitan", "karagatan", "batis",
            "bukal", "burol", "kapatagan", "binhi", "damo", "bukid", "eden", "mga buhay na nilalang", "ligaw na hayop",
            "insekto", "reptilya", "ulap", "hamog", "bagyo", "panahon"
        ],        chapters: [
            "01_GEN_001", "01_GEN_002", "01_GEN_008", "01_GEN_009",
            "18_JOB_038", "18_JOB_039", "18_JOB_040", "18_JOB_041",
            "19_PSA_008", "19_PSA_019", "19_PSA_029", "19_PSA_065", "19_PSA_104", "19_PSA_147", "19_PSA_148",
            "20_PRO_008",
            "23_ISA_040", "23_ISA_055",
            "45_ROM_001", "45_ROM_008",
            "51_COL_001",
            "66_REV_004", "66_REV_021"
        ]
    },

    // THÈMES MODERNES
    themes_modernes: {
        burnout: {
            FR: ["burnout", "épuisement", "surmenage", "fatigue chronique", "stress professionnel", "épuisement professionnel", "usure", "fatigue extrême"],
            EN: ["burnout", "exhaustion", "overwork", "chronic fatigue", "work stress", "professional exhaustion", "wear out", "extreme fatigue"],
            PT: ["burnout", "esgotamento", "sobrecarga", "fadiga crônica", "estresse profissional", "esgotamento profissional", "desgaste", "fadiga extrema"],
            ES: ["burnout", "agotamiento", "sobrecarga", "fatiga crónica", "estrés laboral", "agotamiento profesional", "desgaste", "fatiga extrema"],
            DE: ["burnout", "erschöpfung", "überarbeitung", "chronische müdigkeit", "arbeitsstress", "berufliche erschöpfung", "verschleiß", "extreme müdigkeit"],
            IT: ["burnout", "esaurimento", "sovraccarico", "fatica cronica", "stress lavorativo", "esaurimento professionale", "usura", "fatica estrema"],            TL: ["burnout", "pagod", "sobrang trabaho", "talamak na pagod", "stress sa trabaho"],            families: ["souffrance_epreuves", "guerison_restauration"],
            chapters: ["11_1KI_019", "19_PSA_023", "19_PSA_046", "23_ISA_040", "40_MAT_011"]
        },
        depression: {
            FR: ["dépression", "découragement", "désespoir", "tristesse profonde", "mélancolie", "abattement"],
            EN: ["depression", "discouragement", "despair", "deep sadness", "melancholy", "dejection"],
            PT: ["depressão", "desânimo", "desespero", "tristeza profunda", "melancolia", "abatimento"],
            ES: ["depresión", "desánimo", "desesperación", "tristeza profunda", "melancolía", "abatimiento"],
            DE: ["depression", "entmutigung", "verzweiflung", "tiefe traurigkeit", "melancholie", "niedergeschlagenheit"],
            IT: ["depressione", "scoraggiamento", "disperazione", "tristezza profonda", "malinconia", "abbattimento"],            TL: ["depresyon", "pagkawalang-pag-asa", "matinding kalungkutan"],            families: ["souffrance_epreuves", "guerison_restauration"],
            chapters: ["19_PSA_042", "19_PSA_043", "19_PSA_088", "25_LAM_003", "32_JON_002"]
        },
        anxiete: {
            FR: ["anxiété", "inquiétude", "souci", "préoccupation", "nervosité", "stress", "angoisse"],
            EN: ["anxiety", "worry", "concern", "nervousness", "stress", "anguish"],
            PT: ["ansiedade", "preocupação", "inquietação", "nervosismo", "estresse", "angústia"],
            ES: ["ansiedad", "preocupación", "inquietud", "nerviosismo", "estrés", "angustia"],
            DE: ["angst", "sorge", "besorgnis", "nervosität", "stress", "angst"],
            IT: ["ansia", "preoccupazione", "inquietudine", "nervosismo", "stress", "angoscia"],            TL: ["pagkabalisa", "pag-aalala", "stress"],            families: ["souffrance_epreuves", "foi_confiance"],
            chapters: ["19_PSA_055", "19_PSA_094", "40_MAT_006", "50_PHP_004", "60_1PE_005"]
        },
        solitude: {
            FR: ["solitude", "isolement", "abandon", "rejet", "exclusion", "marginalisation"],
            EN: ["loneliness", "isolation", "abandonment", "rejection", "exclusion"],
            PT: ["solidão", "isolamento", "abandono", "rejeição", "exclusão"],
            ES: ["soledad", "aislamiento", "abandono", "rechazo", "exclusión"],
            DE: ["einsamkeit", "isolation", "verlassenheit", "ablehnung", "ausgrenzung"],
            IT: ["solitudine", "isolamento", "abbandono", "rifiuto", "esclusione"],            TL: ["kalungkutan", "pag-iisa", "pagpapabaya"],            families: ["souffrance_epreuves", "foi_confiance"],
            chapters: ["19_PSA_025", "19_PSA_027", "19_PSA_068", "19_PSA_142", "58_HEB_013"]
        },
        divorce: {
            FR: ["divorce", "séparation", "rupture", "fin de relation", "coeur brisé"],
            EN: ["divorce", "separation", "breakup", "heartbreak", "broken relationship"],
            PT: ["divórcio", "separação", "rompimento", "coração partido"],
            ES: ["divorcio", "separación", "ruptura", "corazón roto"],
            DE: ["scheidung", "trennung", "bruch", "gebrochenes herz"],
            IT: ["divorzio", "separazione", "rottura", "cuore spezzato"],            TL: ["diborsyo", "paghihiwalay", "pagkakawatak-watak"],            families: ["amour_relations", "souffrance_epreuves"],
            chapters: ["28_HOS_003", "39_MAL_002", "40_MAT_019", "46_1CO_007"]
        },
        chomage: {
            FR: ["chômage", "perte d'emploi", "difficultés financières", "dette", "pauvreté"],
            EN: ["unemployment", "job loss", "financial difficulties", "debt", "poverty"],
            PT: ["desemprego", "perda de emprego", "dificuldades financeiras", "dívida", "pobreza"],
            ES: ["desempleo", "pérdida de empleo", "dificultades financieras", "deuda", "pobreza"],
            DE: ["arbeitslosigkeit", "jobverlust", "finanzielle schwierigkeiten", "schulden", "armut"],
            IT: ["disoccupazione", "perdita di lavoro", "difficoltà finanziarie", "debito", "povertà"],            TL: ["kawalang-trabaho", "pagkawala ng trabaho", "kahirapan sa pananalapi"],            families: ["souffrance_epreuves", "foi_confiance"],
            chapters: ["19_PSA_037", "20_PRO_006", "40_MAT_006", "50_PHP_004", "59_JAS_002"]
        },
        maladie_grave: {
            FR: ["cancer", "maladie grave", "hospitalisation", "traitement", "guérison"],
            EN: ["cancer", "serious illness", "hospitalization", "treatment", "healing"],
            PT: ["câncer", "doença grave", "hospitalização", "tratamento", "cura"],
            ES: ["cáncer", "enfermedad grave", "hospitalización", "tratamiento", "sanación"],
            DE: ["krebs", "schwere krankheit", "krankenhausaufenthalt", "behandlung", "heilung"],
            IT: ["cancro", "malattia grave", "ospedalizzazione", "trattamento", "guarigione"],            TL: ["kanser", "malubhang sakit", "pagpapagamot", "paggaling"],            families: ["souffrance_epreuves", "guerison_restauration"],
            chapters: ["19_PSA_041", "19_PSA_103", "23_ISA_053", "40_MAT_008", "59_JAS_005"]
        },
        deuil: {
            FR: ["deuil", "mort", "décès", "perte", "funérailles", "chagrin"],
            EN: ["grief", "death", "loss", "funeral", "mourning", "sorrow"],
            PT: ["luto", "morte", "perda", "funeral", "tristeza"],
            ES: ["duelo", "muerte", "pérdida", "funeral", "tristeza"],
            DE: ["trauer", "tod", "verlust", "beerdigung", "kummer"],
            IT: ["lutto", "morte", "perdita", "funerale", "dolore"],            TL: ["pagluluksa", "kamatayan", "pagkawala", "libing"],            families: ["souffrance_epreuves", "guerison_restauration"],
            chapters: ["19_PSA_023", "19_PSA_116", "23_ISA_025", "43_JOH_011", "52_1TH_004", "66_REV_021"]
        },
        conflit: {
            FR: ["conflit", "dispute", "querelle", "réconciliation", "pardon", "paix"],
            EN: ["conflict", "dispute", "quarrel", "reconciliation", "forgiveness", "peace"],
            PT: ["conflito", "disputa", "briga", "reconciliação", "perdão", "paz"],
            ES: ["conflicto", "disputa", "pelea", "reconciliación", "perdón", "paz"],
            DE: ["konflikt", "streit", "auseinandersetzung", "versöhnung", "vergebung", "frieden"],
            IT: ["conflitto", "disputa", "lite", "riconciliazione", "perdono", "pace"],            TL: ["tunggalian", "pagtatalo", "pagkakasundo", "kapatawaran"],            families: ["amour_relations", "repentance_grace"],
            chapters: ["01_GEN_033", "40_MAT_005", "40_MAT_018", "45_ROM_012", "49_EPH_004"]
        },
        decision: {
            FR: ["décision", "choix", "direction", "discernement", "sagesse", "guidance"],
            EN: ["decision", "choice", "direction", "discernment", "wisdom", "guidance"],
            PT: ["decisão", "escolha", "direção", "discernimento", "sabedoria", "orientação"],
            ES: ["decisión", "elección", "dirección", "discernimiento", "sabiduría", "guía"],
            DE: ["entscheidung", "wahl", "richtung", "unterscheidung", "weisheit", "führung"],
            IT: ["decisione", "scelta", "direzione", "discernimento", "saggezza", "guida"],            TL: ["desisyon", "pagpili", "direksyon", "karunungan", "paggabay"],            families: ["sagesse_verite", "foi_confiance"],
            chapters: ["19_PSA_025", "19_PSA_032", "20_PRO_003", "59_JAS_001"]
        },
        nouveau_depart: {
            FR: ["nouveau départ", "renaissance", "changement", "transition", "espoir"],
            EN: ["new beginning", "rebirth", "change", "transition", "hope"],
            PT: ["novo começo", "renascimento", "mudança", "transição", "esperança"],
            ES: ["nuevo comienzo", "renacimiento", "cambio", "transición", "esperanza"],
            DE: ["neuanfang", "wiedergeburt", "veränderung", "übergang", "hoffnung"],
            IT: ["nuovo inizio", "rinascita", "cambiamento", "transizione", "speranza"],            TL: ["bagong simula", "muling pagsilang", "pagbabago", "pag-asa"],            families: ["guerison_restauration", "foi_confiance"],
            chapters: ["23_ISA_043", "25_LAM_003", "47_2CO_005", "66_REV_021"]
        },
        reussite: {
            FR: ["réussite", "succès", "promotion", "accomplissement", "victoire"],
            EN: ["success", "achievement", "promotion", "accomplishment", "victory"],
            PT: ["sucesso", "realização", "promoção", "conquista", "vitória"],
            ES: ["éxito", "logro", "promoción", "realización", "victoria"],
            DE: ["erfolg", "leistung", "beförderung", "errungenschaft", "sieg"],
            IT: ["successo", "realizzazione", "promozione", "compimento", "vittoria"],            TL: ["tagumpay", "pagkakamit", "promosyon", "tagumpay"],            families: ["foi_confiance", "sagesse_verite"],
            chapters: ["06_JOS_001", "19_PSA_001", "19_PSA_112", "20_PRO_003"]
        },
        mariage: {
            FR: ["mariage", "fiançailles", "engagement", "union", "couple", "amour"],
            EN: ["marriage", "engagement", "wedding", "union", "couple", "love"],
            PT: ["casamento", "noivado", "compromisso", "união", "casal", "amor"],
            ES: ["matrimonio", "compromiso", "boda", "unión", "pareja", "amor"],
            DE: ["ehe", "verlobung", "hochzeit", "verbindung", "paar", "liebe"],
            IT: ["matrimonio", "fidanzamento", "nozze", "unione", "coppia", "amore"],            TL: ["kasal", "pangako", "pagsasama", "mag-asawa", "pag-ibig"],            families: ["amour_relations", "vie_responsabilite"],
            chapters: ["01_GEN_002", "01_GEN_024", "22_SON_008", "49_EPH_005", "66_REV_019"]
        },
        naissance: {
            FR: ["naissance", "bébé", "grossesse", "parentalité", "éducation", "famille"],
            EN: ["birth", "baby", "pregnancy", "parenthood", "parenting", "family"],
            PT: ["nascimento", "bebê", "gravidez", "paternidade", "educação", "família"],
            ES: ["nacimiento", "bebé", "embarazo", "paternidad", "educación", "familia"],
            DE: ["geburt", "baby", "schwangerschaft", "elternschaft", "erziehung", "familie"],
            IT: ["nascita", "bambino", "gravidanza", "genitorialità", "educazione", "famiglia"],            TL: ["kapanganakan", "sanggol", "pagbubuntis", "pagiging magulang", "pamilya"],            families: ["amour_relations", "vie_responsabilite"],
            chapters: ["01_GEN_021", "19_PSA_127", "19_PSA_128", "19_PSA_139", "42_LUK_001", "42_LUK_002"]
        }
    }
};
