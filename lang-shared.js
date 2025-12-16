// lang-shared.js - Configuration langue partagée pour toutes les pages
// Charge la langue depuis URL > localStorage > défaut FR

(function() {
    'use strict';

    // === BOOK_NAMES : Noms des 66 livres en 12 langues ===
    window.BOOK_NAMES = {
        FR: ["Genèse","Exode","Lévitique","Nombres","Deutéronome","Josué","Juges","Ruth","1 Samuel","2 Samuel","1 Rois","2 Rois","1 Chroniques","2 Chroniques","Esdras","Néhémie","Esther","Job","Psaumes","Proverbes","Ecclésiaste","Cantique","Ésaïe","Jérémie","Lamentations","Ézéchiel","Daniel","Osée","Joël","Amos","Abdias","Jonas","Michée","Nahum","Habacuc","Sophonie","Aggée","Zacharie","Malachie","Matthieu","Marc","Luc","Jean","Actes","Romains","1 Corinthiens","2 Corinthiens","Galates","Éphésiens","Philippiens","Colossiens","1 Thessaloniciens","2 Thessaloniciens","1 Timothée","2 Timothée","Tite","Philémon","Hébreux","Jacques","1 Pierre","2 Pierre","1 Jean","2 Jean","3 Jean","Jude","Apocalypse"],
        PT: ["Gênesis","Êxodo","Levítico","Números","Deuteronômio","Josué","Juízes","Rute","1 Samuel","2 Samuel","1 Reis","2 Reis","1 Crônicas","2 Crônicas","Esdras","Neemias","Ester","Jó","Salmos","Provérbios","Eclesiastes","Cantares","Isaías","Jeremias","Lamentações","Ezequiel","Daniel","Oséias","Joel","Amós","Obadias","Jonas","Miquéias","Naum","Habacuque","Sofonias","Ageu","Zacarias","Malaquias","Mateus","Marcos","Lucas","João","Atos","Romanos","1 Coríntios","2 Coríntios","Gálatas","Efésios","Filipenses","Colossenses","1 Tessalonicenses","2 Tessalonicenses","1 Timóteo","2 Timóteo","Tito","Filemom","Hebreus","Tiago","1 Pedro","2 Pedro","1 João","2 João","3 João","Judas","Apocalipse"],
        EN: ["Genesis","Exodus","Leviticus","Numbers","Deuteronomy","Joshua","Judges","Ruth","1 Samuel","2 Samuel","1 Kings","2 Kings","1 Chronicles","2 Chronicles","Ezra","Nehemiah","Esther","Job","Psalms","Proverbs","Ecclesiastes","Song of Solomon","Isaiah","Jeremiah","Lamentations","Ezekiel","Daniel","Hosea","Joel","Amos","Obadiah","Jonah","Micah","Nahum","Habakkuk","Zephaniah","Haggai","Zechariah","Malachi","Matthew","Mark","Luke","John","Acts","Romans","1 Corinthians","2 Corinthians","Galatians","Ephesians","Philippians","Colossians","1 Thessalonians","2 Thessalonians","1 Timothy","2 Timothy","Titus","Philemon","Hebrews","James","1 Peter","2 Peter","1 John","2 John","3 John","Jude","Revelation"],
        ES: ["Génesis","Éxodo","Levítico","Números","Deuteronomio","Josué","Jueces","Rut","1 Samuel","2 Samuel","1 Reyes","2 Reyes","1 Crónicas","2 Crónicas","Esdras","Nehemías","Ester","Job","Salmos","Proverbios","Eclesiastés","Cantares","Isaías","Jeremías","Lamentaciones","Ezequiel","Daniel","Oseas","Joel","Amós","Abdías","Jonás","Miqueas","Nahúm","Habacuc","Sofonías","Hageo","Zacarías","Malaquías","Mateo","Marcos","Lucas","Juan","Hechos","Romanos","1 Corintios","2 Corintios","Gálatas","Efesios","Filipenses","Colosenses","1 Tesalonicenses","2 Tesalonicenses","1 Timoteo","2 Timoteo","Tito","Filemón","Hebreos","Santiago","1 Pedro","2 Pedro","1 Juan","2 Juan","3 Juan","Judas","Apocalipsis"],
        DE: ["Genesis","Exodus","Levitikus","Numeri","Deuteronomium","Josua","Richter","Rut","1 Samuel","2 Samuel","1 Könige","2 Könige","1 Chronik","2 Chronik","Esra","Nehemia","Ester","Hiob","Psalmen","Sprüche","Prediger","Hohelied","Jesaja","Jeremia","Klagelieder","Hesekiel","Daniel","Hosea","Joel","Amos","Obadja","Jona","Micha","Nahum","Habakuk","Zefanja","Haggai","Sacharja","Maleachi","Matthäus","Markus","Lukas","Johannes","Apostelgeschichte","Römer","1 Korinther","2 Korinther","Galater","Epheser","Philipper","Kolosser","1 Thessalonicher","2 Thessalonicher","1 Timotheus","2 Timotheus","Titus","Philemon","Hebräer","Jakobus","1 Petrus","2 Petrus","1 Johannes","2 Johannes","3 Johannes","Judas","Offenbarung"],
        IT: ["Genesi","Esodo","Levitico","Numeri","Deuteronomio","Giosuè","Giudici","Rut","1 Samuele","2 Samuele","1 Re","2 Re","1 Cronache","2 Cronache","Esdra","Neemia","Ester","Giobbe","Salmi","Proverbi","Ecclesiaste","Cantico","Isaia","Geremia","Lamentazioni","Ezechiele","Daniele","Osea","Gioele","Amos","Abdia","Giona","Michea","Naum","Abacuc","Sofonia","Aggeo","Zaccaria","Malachia","Matteo","Marco","Luca","Giovanni","Atti","Romani","1 Corinzi","2 Corinzi","Galati","Efesini","Filippesi","Colossesi","1 Tessalonicesi","2 Tessalonicesi","1 Timoteo","2 Timoteo","Tito","Filemone","Ebrei","Giacomo","1 Pietro","2 Pietro","1 Giovanni","2 Giovanni","3 Giovanni","Giuda","Apocalisse"],
        AR: ["التكوين","الخروج","اللاويين","العدد","التثنية","يشوع","القضاة","راعوث","صموئيل الأول","صموئيل الثاني","الملوك الأول","الملوك الثاني","أخبار الأيام الأول","أخبار الأيام الثاني","عزرا","نحميا","أستير","أيوب","المزامير","الأمثال","الجامعة","نشيد الأنشاد","إشعياء","إرميا","مراثي إرميا","حزقيال","دانيال","هوشع","يوئيل","عاموس","عوبديا","يونان","ميخا","ناحوم","حبقوق","صفنيا","حجي","زكريا","ملاخي","متى","مرقس","لوقا","يوحنا","أعمال الرسل","رومية","كورنثوس الأولى","كورنثوس الثانية","غلاطية","أفسس","فيلبي","كولوسي","تسالونيكي الأولى","تسالونيكي الثانية","تيموثاوس الأولى","تيموثاوس الثانية","تيطس","فليمون","العبرانيين","يعقوب","بطرس الأولى","بطرس الثانية","يوحنا الأولى","يوحنا الثانية","يوحنا الثالثة","يهوذا","الرؤيا"],
        RU: ["Бытие","Исход","Левит","Числа","Второзаконие","Иисус Навин","Судьи","Руфь","1 Царств","2 Царств","3 Царств","4 Царств","1 Паралипоменон","2 Паралипоменон","Ездра","Неемия","Есфирь","Иов","Псалтирь","Притчи","Екклесиаст","Песня Песней","Исаия","Иеремия","Плач Иеремии","Иезекииль","Даниил","Осия","Иоиль","Амос","Авдий","Иона","Михей","Наум","Аввакум","Софония","Аггей","Захария","Малахия","Матфей","Марк","Лука","Иоанн","Деяния","Римлянам","1 Коринфянам","2 Коринфянам","Галатам","Ефесянам","Филиппийцам","Колоссянам","1 Фессалоникийцам","2 Фессалоникийцам","1 Тимофею","2 Тимофею","Титу","Филимону","Евреям","Иакова","1 Петра","2 Петра","1 Иоанна","2 Иоанна","3 Иоанна","Иуды","Откровение"],
        ZH: ["创世记","出埃及记","利未记","民数记","申命记","约书亚记","士师记","路得记","撒母耳记上","撒母耳记下","列王纪上","列王纪下","历代志上","历代志下","以斯拉记","尼希米记","以斯帖记","约伯记","诗篇","箴言","传道书","雅歌","以赛亚书","耶利米书","耶利米哀歌","以西结书","但以理书","何西阿书","约珥书","阿摩司书","俄巴底亚书","约拿书","弥迦书","那鸿书","哈巴谷书","西番雅书","哈该书","撒迦利亚书","玛拉基书","马太福音","马可福音","路加福音","约翰福音","使徒行传","罗马书","哥林多前书","哥林多后书","加拉太书","以弗所书","腓立比书","歌罗西书","帖撒罗尼迦前书","帖撒罗尼迦后书","提摩太前书","提摩太后书","提多书","腓利门书","希伯来书","雅各书","彼得前书","彼得后书","约翰一书","约翰二书","约翰三书","犹大书","启示录"],
        HI: ["उत्पत्ति","निर्गमन","लैव्यव्यवस्था","गिनती","व्यवस्थाविवरण","यहोशू","न्यायियों","रूत","1 शमूएल","2 शमूएल","1 राजा","2 राजा","1 इतिहास","2 इतिहास","एज्रा","नहेम्याह","एस्तेर","अय्यूब","भजन संहिता","नीतिवचन","सभोपदेशक","श्रेष्ठगीत","यशायाह","यिर्मयाह","विलापगीत","यहेजकेल","दानिय्येल","होशे","योएल","आमोस","ओबद्याह","योना","मीका","नहूम","हबक्कूक","सपन्याह","हाग्गै","जकर्याह","मलाकी","मत्ती","मरकुस","लूका","यूहन्ना","प्रेरितों के काम","रोमियों","1 कुरिन्थियों","2 कुरिन्थियों","गलातियों","इफिसियों","फिलिप्पियों","कुलुस्सियों","1 थिस्सलुनीकियों","2 थिस्सलुनीकियों","1 तीमुथियुस","2 तीमुथियुस","तीतुस","फिलेमोन","इब्रानियों","याकूब","1 पतरस","2 पतरस","1 यूहन्ना","2 यूहन्ना","3 यूहन्ना","यहूदा","प्रकाशितवाक्य"],
        TL: ["Genesis","Exodo","Levitico","Mga Bilang","Deuteronomio","Josue","Mga Hukom","Ruth","1 Samuel","2 Samuel","1 Mga Hari","2 Mga Hari","1 Mga Cronica","2 Mga Cronica","Ezra","Nehemias","Ester","Job","Mga Awit","Mga Kawikaan","Mangangaral","Awit ni Solomon","Isaias","Jeremias","Mga Panaghoy","Ezekiel","Daniel","Hosea","Joel","Amos","Obadias","Jonas","Mikas","Nahum","Habakuk","Sofonias","Hagai","Zacarias","Malakias","Mateo","Marcos","Lucas","Juan","Mga Gawa","Roma","1 Corinto","2 Corinto","Galacia","Efeso","Filipos","Colosas","1 Tesalonica","2 Tesalonica","1 Timoteo","2 Timoteo","Tito","Filemon","Hebreo","Santiago","1 Pedro","2 Pedro","1 Juan","2 Juan","3 Juan","Judas","Apocalipsis"],
        KO: ["창세기","출애굽기","레위기","민수기","신명기","여호수아","사사기","룻기","사무엘상","사무엘하","열왕기상","열왕기하","역대상","역대하","에스라","느헤미야","에스더","욥기","시편","잠언","전도서","아가","이사야","예레미야","예레미야애가","에스겔","다니엘","호세아","요엘","아모스","오바댜","요나","미가","나훔","하박국","스바냐","학개","스가랴","말라기","마태복음","마가복음","누가복음","요한복음","사도행전","로마서","고린도전서","고린도후서","갈라디아서","에베소서","빌립보서","골로새서","데살로니가전서","데살로니가후서","디모데전서","디모데후서","디도서","빌레몬서","히브리서","야고보서","베드로전서","베드로후서","요한일서","요한이서","요한삼서","유다서","요한계시록"]
    };

    // === LANGUES DISPONIBLES ===
    window.AVAILABLE_LANGUAGES = ['FR', 'EN', 'PT', 'ES', 'DE', 'IT', 'AR', 'RU', 'ZH', 'HI', 'TL', 'KO'];

    // === INITIALISATION LANGUE ===
    // Priorité : URL param > localStorage > défaut FR
    function initLanguage() {
        const urlParams = new URLSearchParams(window.location.search);
        const urlLang = urlParams.get('lang');
        
        if (urlLang && window.AVAILABLE_LANGUAGES.includes(urlLang.toUpperCase())) {
            window.currentLanguage = urlLang.toUpperCase();
            localStorage.setItem('selectedLanguage', window.currentLanguage);
        } else {
            const saved = localStorage.getItem('selectedLanguage');
            if (saved && window.AVAILABLE_LANGUAGES.includes(saved)) {
                window.currentLanguage = saved;
            } else {
                window.currentLanguage = 'FR';
            }
        }
        
        // Mettre à jour l'URL si pas de param lang
        if (!urlLang) {
            try {
                const url = new URL(window.location.href);
                url.searchParams.set('lang', window.currentLanguage);
                history.replaceState({}, '', url);
            } catch (e) {
                // Ignorer dans les environnements restreints
            }
        }
        
        return window.currentLanguage;
    }

    // === CHANGER LANGUE ===
    window.setLanguage = function(lang) {
        if (!window.AVAILABLE_LANGUAGES.includes(lang)) return;
        
        window.currentLanguage = lang;
        localStorage.setItem('selectedLanguage', lang);
        
        // Mettre à jour URL
        try {
            const url = new URL(window.location.href);
            url.searchParams.set('lang', lang);
            history.pushState({}, '', url);
        } catch (e) {}
        
        // Déclencher événement pour les listeners
        window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang: lang } }));
    };

    // === OBTENIR NOM LIVRE TRADUIT ===
    window.getBookName = function(bookIndex, lang) {
        lang = lang || window.currentLanguage || 'FR';
        const names = window.BOOK_NAMES[lang] || window.BOOK_NAMES.FR;
        return names[bookIndex] || 'Livre ' + (bookIndex + 1);
    };

    // === CONSTRUIRE LIEN AVEC LANGUE ===
    window.buildLangUrl = function(baseUrl, params) {
        params = params || {};
        params.lang = window.currentLanguage || 'FR';
        
        const url = new URL(baseUrl, window.location.origin);
        Object.keys(params).forEach(key => {
            url.searchParams.set(key, params[key]);
        });
        return url.toString();
    };

    // Initialiser au chargement
    initLanguage();
    
    console.log('[lang-shared] Langue initialisée:', window.currentLanguage);

    // Alias pour compatibilité avec book-names.js
    window.BC_BOOK_NAMES = window.BOOK_NAMES;
})();
