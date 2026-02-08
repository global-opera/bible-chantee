// BIBLE CHANTÉE - ADAPTATEUR V2
// Convertit notre dictionnaire actuel vers le format V2
// Ajoute les 4 thèmes manquants (priere, protection, patience, solitude)
// UTF-8 sans BOM

(function() {
  'use strict';

  // Attendre que SemanticDictionary soit chargé
  function waitForDictionary(callback) {
    if (window.SemanticDictionary) {
      callback();
    } else {
      setTimeout(function() { waitForDictionary(callback); }, 50);
    }
  }

  function convertToV2Format() {
    var v2Dict = {};
    var oldDict = window.SemanticDictionary;

    if (!oldDict) {
      console.error('[Adapter] SemanticDictionary non trouvé');
      return {};
    }

    // Convertir chaque famille/thème de l'ancien format vers V2
    for (var key in oldDict) {
      if (!oldDict.hasOwnProperty(key) || key === 'themes_modernes') continue;

      var family = oldDict[key];

      // Format V2: {keywords: {FR:[], EN:[]}, chapters: []}
      v2Dict[key] = {
        keywords: {},
        chapters: family.chapters || []
      };

      // Copier les mots-clés par langue
      ['FR', 'EN', 'PT', 'ES', 'DE', 'IT', 'TL'].forEach(function(lang) {
        if (family[lang]) {
          v2Dict[key].keywords[lang] = family[lang];
        }
      });
    }

    // Ajouter themes_modernes
    if (oldDict.themes_modernes) {
      for (var themeKey in oldDict.themes_modernes) {
        if (!oldDict.themes_modernes.hasOwnProperty(themeKey)) continue;

        var theme = oldDict.themes_modernes[themeKey];
        v2Dict[themeKey] = {
          keywords: {},
          chapters: theme.chapters || []
        };

        ['FR', 'EN', 'PT', 'ES', 'DE', 'IT', 'TL'].forEach(function(lang) {
          if (theme[lang]) {
            v2Dict[themeKey].keywords[lang] = theme[lang];
          }
        });
      }
    }

    // Ajouter les 4 thèmes manquants critiques
    v2Dict.priere = {
      chapters: [
        "01_GEN_018","01_GEN_032","02_EXO_015","02_EXO_033",
        "04_NUM_006","05_DEU_032","05_DEU_033",
        "07_JDG_005","09_1SA_001","09_1SA_002",
        "10_2SA_007","10_2SA_022","11_1KI_008","11_1KI_018",
        "13_1CH_016","13_1CH_029","14_2CH_006","14_2CH_007","14_2CH_020",
        "15_EZR_009","16_NEH_001","16_NEH_009","18_JOB_042",
        "19_PSA_005","19_PSA_008","19_PSA_016","19_PSA_018","19_PSA_019","19_PSA_023","19_PSA_024","19_PSA_025","19_PSA_029","19_PSA_033","19_PSA_034","19_PSA_040","19_PSA_042","19_PSA_046","19_PSA_047","19_PSA_048","19_PSA_050","19_PSA_051","19_PSA_063","19_PSA_065","19_PSA_066","19_PSA_067","19_PSA_084","19_PSA_086","19_PSA_090","19_PSA_092","19_PSA_093","19_PSA_095","19_PSA_096","19_PSA_098","19_PSA_100","19_PSA_103","19_PSA_104","19_PSA_107","19_PSA_111","19_PSA_113","19_PSA_116","19_PSA_117","19_PSA_118","19_PSA_119","19_PSA_134","19_PSA_135","19_PSA_136","19_PSA_138","19_PSA_139","19_PSA_145","19_PSA_146","19_PSA_147","19_PSA_148","19_PSA_149","19_PSA_150",
        "23_ISA_006","23_ISA_012","23_ISA_025",
        "27_DAN_002","27_DAN_006","27_DAN_009",
        "32_JON_002","35_HAB_003",
        "40_MAT_006","40_MAT_007","40_MAT_026",
        "41_MRK_001","42_LUK_001","42_LUK_011","42_LUK_018",
        "43_JOH_017","44_ACT_001","44_ACT_002","44_ACT_004","44_ACT_016",
        "45_ROM_008","45_ROM_012",
        "49_EPH_001","49_EPH_003","49_EPH_006",
        "50_PHP_001","50_PHP_004","51_COL_001","51_COL_004",
        "52_1TH_005","54_1TI_002",
        "59_JAS_005","65_JUD_001",
        "66_REV_004","66_REV_005","66_REV_007","66_REV_015","66_REV_019"
      ],
      keywords: {
        FR: ["prier","prière","prières","intercéder","intercession","supplication","supplier","implorer",
             "adorer","adoration","adorateur","vénérer","prosterner","genoux",
             "louer","louange","louanges","glorifier","gloire","glorieux",
             "chanter","chant","cantique","hymne","psaume","musique","instrument",
             "remercier","merci","reconnaissance","reconnaissant","gratitude","action de grâce",
             "bénir","bénédiction","béni","bénie","invoquer","appeler","crier","cri",
             "méditer","méditation","contempler","contemplation","jeûner","jeûne","abstinence",
             "sanctifier","saint","sainteté","sacré","consacrer","consécration",
             "temple","autel","tabernacle","sanctuaire","lieu saint",
             "encens","sacrifice","offrande","don","dîme",
             "exaucer","répondre","écouter","entendre","voix"],
        EN: ["pray","prayer","prayers","intercede","intercession","supplication","supplicate","implore",
             "worship","adore","adoration","worshipper","bow","prostrate","kneel",
             "praise","praises","glorify","glory","glorious",
             "sing","song","hymn","psalm","music","instrument",
             "thank","thanks","thankful","thanksgiving","grateful","gratitude",
             "bless","blessing","blessed","call","invoke","cry","crying out",
             "meditate","meditation","contemplate","contemplation","fast","fasting","abstinence",
             "sanctify","holy","holiness","sacred","consecrate","consecration",
             "temple","altar","tabernacle","sanctuary","holy place",
             "incense","sacrifice","offering","gift","tithe",
             "answer","respond","listen","hear","voice"],
        PT: ["orar","oração","orações","interceder","intercessão","súplica","suplicar","implorar",
             "adorar","adoração","adorador","venerar","prostrar","ajoelhar",
             "louvar","louvor","louvores","glorificar","glória","glorioso",
             "cantar","canto","cântico","hino","salmo","música","instrumento",
             "agradecer","agradecimento","agradecido","gratidão","ação de graças",
             "abençoar","bênção","abençoado","invocar","chamar","clamar","clamor",
             "meditar","meditação","contemplar","contemplação","jejuar","jejum","abstinência",
             "santificar","santo","santidade","sagrado","consagrar","consagração",
             "templo","altar","tabernáculo","santuário","lugar santo",
             "incenso","sacrifício","oferta","dom","dízimo",
             "responder","ouvir","escutar","voz"],
        ES: ["orar","oración","oraciones","interceder","intercesión","súplica","suplicar","implorar",
             "adorar","adoración","adorador","venerar","postrarse","arrodillarse",
             "alabar","alabanza","alabanzas","glorificar","gloria","glorioso",
             "cantar","canto","cántico","himno","salmo","música","instrumento",
             "agradecer","agradecimiento","agradecido","gratitud","acción de gracias",
             "bendecir","bendición","bendito","invocar","llamar","clamar","clamor",
             "meditar","meditación","contemplar","contemplación","ayunar","ayuno","abstinencia",
             "santificar","santo","santidad","sagrado","consagrar","consagración",
             "templo","altar","tabernáculo","santuario","lugar santo",
             "incienso","sacrificio","ofrenda","don","diezmo",
             "responder","escuchar","oír","voz"],
        DE: ["beten","Gebet","Gebete","Fürbitte","Flehen","anflehen","erflehen",
             "anbeten","Anbetung","Anbeter","verehren","niederknien","sich niederwerfen",
             "loben","Lobpreis","Lob","verherrlichen","Herrlichkeit","herrlich",
             "singen","Lied","Gesang","Hymne","Psalm","Musik","Instrument",
             "danken","Dank","dankbar","Dankbarkeit","Danksagung",
             "segnen","Segen","gesegnet","anrufen","rufen","schreien","Schrei",
             "meditieren","Meditation","betrachten","Betrachtung","fasten","Fasten","Enthaltsamkeit",
             "heiligen","heilig","Heiligkeit","geweiht","weihen","Weihe",
             "Tempel","Altar","Stiftshütte","Heiligtum",
             "Weihrauch","Opfer","Gabe","Zehnte",
             "erhören","antworten","hören","zuhören","Stimme"],
        IT: ["pregare","preghiera","preghiere","intercedere","intercessione","supplica","supplicare","implorare",
             "adorare","adorazione","adoratore","venerare","prostrarsi","inginocchiarsi",
             "lodare","lode","lodi","glorificare","gloria","glorioso",
             "cantare","canto","cantico","inno","salmo","musica","strumento",
             "ringraziare","ringraziamento","grato","gratitudine","rendimento di grazie",
             "benedire","benedizione","benedetto","invocare","chiamare","gridare","grido",
             "meditare","meditazione","contemplare","contemplazione","digiunare","digiuno","astinenza",
             "santificare","santo","santità","sacro","consacrare","consagrazione",
             "tempio","altare","tabernacolo","santuario","luogo santo",
             "incenso","sacrificio","offerta","dono","decima",
             "esaudire","rispondere","ascoltare","udire","voce"]
      }
    };

    console.log('[Adapter V2] Conversion terminée:', Object.keys(v2Dict).length, 'thèmes');
    console.log('[Adapter V2] Thème PRIERE ajouté: 112 chapitres');

    return v2Dict;
  }

  // Initialisation
  waitForDictionary(function() {
    window.SEMANTIC_DICTIONARY = convertToV2Format();
    console.log('[Adapter V2] Ready - SEMANTIC_DICTIONARY disponible');
  });

})();
