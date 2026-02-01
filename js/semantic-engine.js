/**
 * Moteur de recherche sémantique pour Bible Chantée
 * Principe: MOT → FAMILLE THÉMATIQUE → CHAPITRE CHANTÉ
 */

const SemanticEngine = {
    // 12 Familles thématiques bibliques
    FAMILIES: {
        dieu_nature: {
            name: { FR: "Qui est Dieu", EN: "Who is God", PT: "Quem é Deus", ES: "Quién es Dios", DE: "Wer ist Gott", IT: "Chi è Dio" },
            chapters: ["19_PSA_103", "23_ISA_040", "43_JOH_001", "19_PSA_139", "01_GEN_001", "19_PSA_104"]
        },
        foi_confiance: {
            name: { FR: "Foi et confiance", EN: "Faith and trust", PT: "Fé e confiança", ES: "Fe y confianza", DE: "Glaube und Vertrauen", IT: "Fede e fiducia" },
            chapters: ["19_PSA_023", "19_PSA_027", "19_PSA_091", "58_HEB_011", "19_PSA_121", "19_PSA_046", "50_PHP_004"]
        },
        amour_relations: {
            name: { FR: "Amour et relations", EN: "Love and relationships", PT: "Amor e relacionamentos", ES: "Amor y relaciones", DE: "Liebe und Beziehungen", IT: "Amore e relazioni" },
            chapters: ["46_1CO_013", "62_1JO_004", "22_SNG_008", "43_JOH_015", "45_ROM_008", "43_JOH_003"]
        },
        peche_chute: {
            name: { FR: "Péché et tentation", EN: "Sin and temptation", PT: "Pecado e tentação", ES: "Pecado y tentación", DE: "Sünde und Versuchung", IT: "Peccato e tentazione" },
            chapters: ["01_GEN_003", "45_ROM_007", "19_PSA_051", "59_JAM_001", "40_MAT_004"]
        },
        repentance_grace: {
            name: { FR: "Pardon et salut", EN: "Forgiveness and salvation", PT: "Perdão e salvação", ES: "Perdón y salvación", DE: "Vergebung und Erlösung", IT: "Perdono e salvezza" },
            chapters: ["19_PSA_051", "19_PSA_103", "42_LUK_015", "49_EPH_002", "19_PSA_032", "62_1JO_001"]
        },
        souffrance_epreuve: {
            name: { FR: "Souffrance et épreuve", EN: "Suffering and trial", PT: "Sofrimento e provação", ES: "Sufrimiento y prueba", DE: "Leiden und Prüfung", IT: "Sofferenza e prova" },
            chapters: ["18_JOB_001", "19_PSA_022", "19_PSA_042", "25_LAM_003", "19_PSA_088", "19_PSA_034"]
        },
        guerison_restauration: {
            name: { FR: "Guérison et espérance", EN: "Healing and hope", PT: "Cura e esperança", ES: "Sanación y esperanza", DE: "Heilung und Hoffnung", IT: "Guarigione e speranza" },
            chapters: ["23_ISA_040", "23_ISA_061", "66_REV_021", "19_PSA_030", "19_PSA_126", "19_PSA_147"]
        },
        sagesse_verite: {
            name: { FR: "Sagesse et vérité", EN: "Wisdom and truth", PT: "Sabedoria e verdade", ES: "Sabiduría y verdad", DE: "Weisheit und Wahrheit", IT: "Saggezza e verità" },
            chapters: ["20_PRO_001", "20_PRO_002", "20_PRO_003", "20_PRO_008", "59_JAM_001", "59_JAM_003", "21_ECC_003"]
        },
        vie_responsabilite: {
            name: { FR: "Vie et responsabilité", EN: "Life and responsibility", PT: "Vida e responsabilidade", ES: "Vida y responsabilidad", DE: "Leben und Verantwortung", IT: "Vita e responsabilità" },
            chapters: ["01_GEN_002", "20_PRO_031", "21_ECC_003", "51_COL_003", "20_PRO_006"]
        },
        justice_societe: {
            name: { FR: "Justice sociale", EN: "Social justice", PT: "Justiça social", ES: "Justicia social", DE: "Soziale Gerechtigkeit", IT: "Giustizia sociale" },
            chapters: ["30_AMO_005", "33_MIC_006", "40_MAT_025", "23_ISA_058", "59_JAM_002"]
        },
        combat_spirituel: {
            name: { FR: "Combat spirituel", EN: "Spiritual warfare", PT: "Combate espiritual", ES: "Guerra espiritual", DE: "Geistlicher Kampf", IT: "Combattimento spirituale" },
            chapters: ["49_EPH_006", "45_ROM_008", "66_REV_012", "19_PSA_018", "19_PSA_144"]
        },
        fin_temps: {
            name: { FR: "Éternité", EN: "Eternity", PT: "Eternidade", ES: "Eternidad", DE: "Ewigkeit", IT: "Eternità" },
            chapters: ["27_DAN_007", "52_1TH_004", "66_REV_021", "66_REV_022", "46_1CO_015"]
        }
    },

    // Map sémantique: mots-clés → chapitres prioritaires
    SEMANTIC_MAP: {
        // PEUR (FR/EN/PT/ES/DE/IT)
        peur: { families: ["foi_confiance", "souffrance_epreuve"], chapters: ["19_PSA_023", "19_PSA_027", "19_PSA_034", "19_PSA_046", "19_PSA_091", "23_ISA_041", "41_MRK_004", "50_PHP_004"] },
        fear: { families: ["foi_confiance", "souffrance_epreuve"], chapters: ["19_PSA_023", "19_PSA_027", "19_PSA_034", "19_PSA_046", "19_PSA_091", "23_ISA_041", "41_MRK_004", "50_PHP_004"] },
        medo: { families: ["foi_confiance", "souffrance_epreuve"], chapters: ["19_PSA_023", "19_PSA_027", "19_PSA_034", "19_PSA_046", "19_PSA_091", "23_ISA_041", "41_MRK_004", "50_PHP_004"] },
        miedo: { families: ["foi_confiance", "souffrance_epreuve"], chapters: ["19_PSA_023", "19_PSA_027", "19_PSA_034", "19_PSA_046", "19_PSA_091", "23_ISA_041", "41_MRK_004", "50_PHP_004"] },
        angst: { families: ["foi_confiance", "souffrance_epreuve"], chapters: ["19_PSA_023", "19_PSA_027", "19_PSA_034", "19_PSA_046", "19_PSA_091", "23_ISA_041", "41_MRK_004", "50_PHP_004"] },
        paura: { families: ["foi_confiance", "souffrance_epreuve"], chapters: ["19_PSA_023", "19_PSA_027", "19_PSA_034", "19_PSA_046", "19_PSA_091", "23_ISA_041", "41_MRK_004", "50_PHP_004"] },

        // AMOUR
        amour: { families: ["amour_relations", "dieu_nature"], chapters: ["22_SNG_008", "43_JOH_003", "43_JOH_015", "45_ROM_008", "46_1CO_013", "62_1JO_004"] },
        love: { families: ["amour_relations", "dieu_nature"], chapters: ["22_SNG_008", "43_JOH_003", "43_JOH_015", "45_ROM_008", "46_1CO_013", "62_1JO_004"] },
        amor: { families: ["amour_relations", "dieu_nature"], chapters: ["22_SNG_008", "43_JOH_003", "43_JOH_015", "45_ROM_008", "46_1CO_013", "62_1JO_004"] },
        liebe: { families: ["amour_relations", "dieu_nature"], chapters: ["22_SNG_008", "43_JOH_003", "43_JOH_015", "45_ROM_008", "46_1CO_013", "62_1JO_004"] },
        amore: { families: ["amour_relations", "dieu_nature"], chapters: ["22_SNG_008", "43_JOH_003", "43_JOH_015", "45_ROM_008", "46_1CO_013", "62_1JO_004"] },

        // PAIX
        paix: { families: ["guerison_restauration", "foi_confiance"], chapters: ["19_PSA_023", "19_PSA_046", "23_ISA_026", "43_JOH_014", "50_PHP_004"] },
        peace: { families: ["guerison_restauration", "foi_confiance"], chapters: ["19_PSA_023", "19_PSA_046", "23_ISA_026", "43_JOH_014", "50_PHP_004"] },
        paz: { families: ["guerison_restauration", "foi_confiance"], chapters: ["19_PSA_023", "19_PSA_046", "23_ISA_026", "43_JOH_014", "50_PHP_004"] },
        frieden: { families: ["guerison_restauration", "foi_confiance"], chapters: ["19_PSA_023", "19_PSA_046", "23_ISA_026", "43_JOH_014", "50_PHP_004"] },
        pace: { families: ["guerison_restauration", "foi_confiance"], chapters: ["19_PSA_023", "19_PSA_046", "23_ISA_026", "43_JOH_014", "50_PHP_004"] },

        // TRISTESSE / DEUIL
        tristesse: { families: ["souffrance_epreuve", "guerison_restauration"], chapters: ["19_PSA_023", "19_PSA_030", "19_PSA_042", "19_PSA_126", "25_LAM_003", "52_1TH_004", "66_REV_021"] },
        sadness: { families: ["souffrance_epreuve", "guerison_restauration"], chapters: ["19_PSA_023", "19_PSA_030", "19_PSA_042", "19_PSA_126", "25_LAM_003", "52_1TH_004", "66_REV_021"] },
        tristeza: { families: ["souffrance_epreuve", "guerison_restauration"], chapters: ["19_PSA_023", "19_PSA_030", "19_PSA_042", "19_PSA_126", "25_LAM_003", "52_1TH_004", "66_REV_021"] },
        traurigkeit: { families: ["souffrance_epreuve", "guerison_restauration"], chapters: ["19_PSA_023", "19_PSA_030", "19_PSA_042", "19_PSA_126", "25_LAM_003", "52_1TH_004", "66_REV_021"] },
        tristezza: { families: ["souffrance_epreuve", "guerison_restauration"], chapters: ["19_PSA_023", "19_PSA_030", "19_PSA_042", "19_PSA_126", "25_LAM_003", "52_1TH_004", "66_REV_021"] },
        deuil: { families: ["souffrance_epreuve", "guerison_restauration"], chapters: ["19_PSA_023", "19_PSA_030", "19_PSA_042", "19_PSA_126", "25_LAM_003", "52_1TH_004", "66_REV_021"] },
        grief: { families: ["souffrance_epreuve", "guerison_restauration"], chapters: ["19_PSA_023", "19_PSA_030", "19_PSA_042", "19_PSA_126", "25_LAM_003", "52_1TH_004", "66_REV_021"] },
        luto: { families: ["souffrance_epreuve", "guerison_restauration"], chapters: ["19_PSA_023", "19_PSA_030", "19_PSA_042", "19_PSA_126", "25_LAM_003", "52_1TH_004", "66_REV_021"] },

        // SOLITUDE
        solitude: { families: ["souffrance_epreuve", "foi_confiance"], chapters: ["19_PSA_023", "19_PSA_042", "19_PSA_068", "19_PSA_142", "11_1KI_019", "40_MAT_011"] },
        loneliness: { families: ["souffrance_epreuve", "foi_confiance"], chapters: ["19_PSA_023", "19_PSA_042", "19_PSA_068", "19_PSA_142", "11_1KI_019", "40_MAT_011"] },
        solidao: { families: ["souffrance_epreuve", "foi_confiance"], chapters: ["19_PSA_023", "19_PSA_042", "19_PSA_068", "19_PSA_142", "11_1KI_019", "40_MAT_011"] },
        soledad: { families: ["souffrance_epreuve", "foi_confiance"], chapters: ["19_PSA_023", "19_PSA_042", "19_PSA_068", "19_PSA_142", "11_1KI_019", "40_MAT_011"] },
        einsamkeit: { families: ["souffrance_epreuve", "foi_confiance"], chapters: ["19_PSA_023", "19_PSA_042", "19_PSA_068", "19_PSA_142", "11_1KI_019", "40_MAT_011"] },
        solitudine: { families: ["souffrance_epreuve", "foi_confiance"], chapters: ["19_PSA_023", "19_PSA_042", "19_PSA_068", "19_PSA_142", "11_1KI_019", "40_MAT_011"] },

        // PARDON
        pardon: { families: ["repentance_grace", "amour_relations"], chapters: ["19_PSA_032", "19_PSA_051", "19_PSA_103", "42_LUK_015", "49_EPH_001", "51_COL_001"] },
        forgiveness: { families: ["repentance_grace", "amour_relations"], chapters: ["19_PSA_032", "19_PSA_051", "19_PSA_103", "42_LUK_015", "49_EPH_001", "51_COL_001"] },
        perdao: { families: ["repentance_grace", "amour_relations"], chapters: ["19_PSA_032", "19_PSA_051", "19_PSA_103", "42_LUK_015", "49_EPH_001", "51_COL_001"] },
        perdon: { families: ["repentance_grace", "amour_relations"], chapters: ["19_PSA_032", "19_PSA_051", "19_PSA_103", "42_LUK_015", "49_EPH_001", "51_COL_001"] },
        vergebung: { families: ["repentance_grace", "amour_relations"], chapters: ["19_PSA_032", "19_PSA_051", "19_PSA_103", "42_LUK_015", "49_EPH_001", "51_COL_001"] },
        perdono: { families: ["repentance_grace", "amour_relations"], chapters: ["19_PSA_032", "19_PSA_051", "19_PSA_103", "42_LUK_015", "49_EPH_001", "51_COL_001"] },

        // FOI
        foi: { families: ["foi_confiance", "dieu_nature"], chapters: ["01_GEN_015", "19_PSA_027", "35_HAB_002", "41_MRK_011", "45_ROM_004", "58_HEB_011"] },
        faith: { families: ["foi_confiance", "dieu_nature"], chapters: ["01_GEN_015", "19_PSA_027", "35_HAB_002", "41_MRK_011", "45_ROM_004", "58_HEB_011"] },
        fe: { families: ["foi_confiance", "dieu_nature"], chapters: ["01_GEN_015", "19_PSA_027", "35_HAB_002", "41_MRK_011", "45_ROM_004", "58_HEB_011"] },
        glaube: { families: ["foi_confiance", "dieu_nature"], chapters: ["01_GEN_015", "19_PSA_027", "35_HAB_002", "41_MRK_011", "45_ROM_004", "58_HEB_011"] },
        fede: { families: ["foi_confiance", "dieu_nature"], chapters: ["01_GEN_015", "19_PSA_027", "35_HAB_002", "41_MRK_011", "45_ROM_004", "58_HEB_011"] },

        // ESPÉRANCE
        esperance: { families: ["guerison_restauration", "fin_temps"], chapters: ["19_PSA_042", "19_PSA_130", "25_LAM_003", "45_ROM_008", "45_ROM_015", "56_TIT_002"] },
        hope: { families: ["guerison_restauration", "fin_temps"], chapters: ["19_PSA_042", "19_PSA_130", "25_LAM_003", "45_ROM_008", "45_ROM_015", "56_TIT_002"] },
        esperanca: { families: ["guerison_restauration", "fin_temps"], chapters: ["19_PSA_042", "19_PSA_130", "25_LAM_003", "45_ROM_008", "45_ROM_015", "56_TIT_002"] },
        esperanza: { families: ["guerison_restauration", "fin_temps"], chapters: ["19_PSA_042", "19_PSA_130", "25_LAM_003", "45_ROM_008", "45_ROM_015", "56_TIT_002"] },
        hoffnung: { families: ["guerison_restauration", "fin_temps"], chapters: ["19_PSA_042", "19_PSA_130", "25_LAM_003", "45_ROM_008", "45_ROM_015", "56_TIT_002"] },
        speranza: { families: ["guerison_restauration", "fin_temps"], chapters: ["19_PSA_042", "19_PSA_130", "25_LAM_003", "45_ROM_008", "45_ROM_015", "56_TIT_002"] },

        // FATIGUE / BURNOUT
        fatigue: { families: ["souffrance_epreuve", "guerison_restauration"], chapters: ["11_1KI_019", "19_PSA_023", "23_ISA_040", "40_MAT_011"] },
        tired: { families: ["souffrance_epreuve", "guerison_restauration"], chapters: ["11_1KI_019", "19_PSA_023", "23_ISA_040", "40_MAT_011"] },
        cansaco: { families: ["souffrance_epreuve", "guerison_restauration"], chapters: ["11_1KI_019", "19_PSA_023", "23_ISA_040", "40_MAT_011"] },
        cansancio: { families: ["souffrance_epreuve", "guerison_restauration"], chapters: ["11_1KI_019", "19_PSA_023", "23_ISA_040", "40_MAT_011"] },
        mudigkeit: { families: ["souffrance_epreuve", "guerison_restauration"], chapters: ["11_1KI_019", "19_PSA_023", "23_ISA_040", "40_MAT_011"] },
        stanchezza: { families: ["souffrance_epreuve", "guerison_restauration"], chapters: ["11_1KI_019", "19_PSA_023", "23_ISA_040", "40_MAT_011"] },
        burnout: { families: ["souffrance_epreuve", "guerison_restauration"], chapters: ["11_1KI_019", "19_PSA_023", "23_ISA_040", "40_MAT_011"] },

        // CULPABILITÉ
        culpabilite: { families: ["peche_chute", "repentance_grace"], chapters: ["19_PSA_032", "19_PSA_051", "19_PSA_103", "45_ROM_008", "62_1JO_001"] },
        guilt: { families: ["peche_chute", "repentance_grace"], chapters: ["19_PSA_032", "19_PSA_051", "19_PSA_103", "45_ROM_008", "62_1JO_001"] },
        culpa: { families: ["peche_chute", "repentance_grace"], chapters: ["19_PSA_032", "19_PSA_051", "19_PSA_103", "45_ROM_008", "62_1JO_001"] },
        schuld: { families: ["peche_chute", "repentance_grace"], chapters: ["19_PSA_032", "19_PSA_051", "19_PSA_103", "45_ROM_008", "62_1JO_001"] },
        colpa: { families: ["peche_chute", "repentance_grace"], chapters: ["19_PSA_032", "19_PSA_051", "19_PSA_103", "45_ROM_008", "62_1JO_001"] },

        // COLÈRE
        colere: { families: ["peche_chute", "sagesse_verite"], chapters: ["19_PSA_037", "20_PRO_015", "49_EPH_004", "51_COL_003", "59_JAM_001"] },
        anger: { families: ["peche_chute", "sagesse_verite"], chapters: ["19_PSA_037", "20_PRO_015", "49_EPH_004", "51_COL_003", "59_JAM_001"] },
        raiva: { families: ["peche_chute", "sagesse_verite"], chapters: ["19_PSA_037", "20_PRO_015", "49_EPH_004", "51_COL_003", "59_JAM_001"] },
        ira: { families: ["peche_chute", "sagesse_verite"], chapters: ["19_PSA_037", "20_PRO_015", "49_EPH_004", "51_COL_003", "59_JAM_001"] },
        zorn: { families: ["peche_chute", "sagesse_verite"], chapters: ["19_PSA_037", "20_PRO_015", "49_EPH_004", "51_COL_003", "59_JAM_001"] },
        rabbia: { families: ["peche_chute", "sagesse_verite"], chapters: ["19_PSA_037", "20_PRO_015", "49_EPH_004", "51_COL_003", "59_JAM_001"] },

        // DÉPRESSION
        depression: { families: ["souffrance_epreuve", "guerison_restauration"], chapters: ["19_PSA_042", "19_PSA_088", "11_1KI_019", "25_LAM_003", "40_MAT_011"] },
        depressao: { families: ["souffrance_epreuve", "guerison_restauration"], chapters: ["19_PSA_042", "19_PSA_088", "11_1KI_019", "25_LAM_003", "40_MAT_011"] },
        depresion: { families: ["souffrance_epreuve", "guerison_restauration"], chapters: ["19_PSA_042", "19_PSA_088", "11_1KI_019", "25_LAM_003", "40_MAT_011"] },
        depressione: { families: ["souffrance_epreuve", "guerison_restauration"], chapters: ["19_PSA_042", "19_PSA_088", "11_1KI_019", "25_LAM_003", "40_MAT_011"] },

        // GUÉRISON
        guerison: { families: ["guerison_restauration", "foi_confiance"], chapters: ["19_PSA_023", "19_PSA_103", "19_PSA_147", "23_ISA_053", "41_MRK_005", "59_JAM_005"] },
        healing: { families: ["guerison_restauration", "foi_confiance"], chapters: ["19_PSA_023", "19_PSA_103", "19_PSA_147", "23_ISA_053", "41_MRK_005", "59_JAM_005"] },
        cura: { families: ["guerison_restauration", "foi_confiance"], chapters: ["19_PSA_023", "19_PSA_103", "19_PSA_147", "23_ISA_053", "41_MRK_005", "59_JAM_005"] },
        heilung: { families: ["guerison_restauration", "foi_confiance"], chapters: ["19_PSA_023", "19_PSA_103", "19_PSA_147", "23_ISA_053", "41_MRK_005", "59_JAM_005"] },
        guarigione: { families: ["guerison_restauration", "foi_confiance"], chapters: ["19_PSA_023", "19_PSA_103", "19_PSA_147", "23_ISA_053", "41_MRK_005", "59_JAM_005"] },

        // JOIE
        joie: { families: ["guerison_restauration", "foi_confiance"], chapters: ["19_PSA_016", "19_PSA_030", "19_PSA_100", "19_PSA_126", "43_JOH_015", "50_PHP_004"] },
        joy: { families: ["guerison_restauration", "foi_confiance"], chapters: ["19_PSA_016", "19_PSA_030", "19_PSA_100", "19_PSA_126", "43_JOH_015", "50_PHP_004"] },
        alegria: { families: ["guerison_restauration", "foi_confiance"], chapters: ["19_PSA_016", "19_PSA_030", "19_PSA_100", "19_PSA_126", "43_JOH_015", "50_PHP_004"] },
        freude: { families: ["guerison_restauration", "foi_confiance"], chapters: ["19_PSA_016", "19_PSA_030", "19_PSA_100", "19_PSA_126", "43_JOH_015", "50_PHP_004"] },
        gioia: { families: ["guerison_restauration", "foi_confiance"], chapters: ["19_PSA_016", "19_PSA_030", "19_PSA_100", "19_PSA_126", "43_JOH_015", "50_PHP_004"] },

        // FORCE
        force: { families: ["foi_confiance", "combat_spirituel"], chapters: ["19_PSA_018", "19_PSA_027", "23_ISA_040", "49_EPH_006", "50_PHP_004"] },
        strength: { families: ["foi_confiance", "combat_spirituel"], chapters: ["19_PSA_018", "19_PSA_027", "23_ISA_040", "49_EPH_006", "50_PHP_004"] },
        forca: { families: ["foi_confiance", "combat_spirituel"], chapters: ["19_PSA_018", "19_PSA_027", "23_ISA_040", "49_EPH_006", "50_PHP_004"] },
        fuerza: { families: ["foi_confiance", "combat_spirituel"], chapters: ["19_PSA_018", "19_PSA_027", "23_ISA_040", "49_EPH_006", "50_PHP_004"] },
        kraft: { families: ["foi_confiance", "combat_spirituel"], chapters: ["19_PSA_018", "19_PSA_027", "23_ISA_040", "49_EPH_006", "50_PHP_004"] },
        forza: { families: ["foi_confiance", "combat_spirituel"], chapters: ["19_PSA_018", "19_PSA_027", "23_ISA_040", "49_EPH_006", "50_PHP_004"] },

        // VICTOIRE
        victoire: { families: ["combat_spirituel", "guerison_restauration"], chapters: ["02_EXO_015", "19_PSA_018", "19_PSA_118", "45_ROM_008", "46_1CO_015", "66_REV_012"] },
        victory: { families: ["combat_spirituel", "guerison_restauration"], chapters: ["02_EXO_015", "19_PSA_018", "19_PSA_118", "45_ROM_008", "46_1CO_015", "66_REV_012"] },
        vitoria: { families: ["combat_spirituel", "guerison_restauration"], chapters: ["02_EXO_015", "19_PSA_018", "19_PSA_118", "45_ROM_008", "46_1CO_015", "66_REV_012"] },
        victoria: { families: ["combat_spirituel", "guerison_restauration"], chapters: ["02_EXO_015", "19_PSA_018", "19_PSA_118", "45_ROM_008", "46_1CO_015", "66_REV_012"] },
        sieg: { families: ["combat_spirituel", "guerison_restauration"], chapters: ["02_EXO_015", "19_PSA_018", "19_PSA_118", "45_ROM_008", "46_1CO_015", "66_REV_012"] },
        vittoria: { families: ["combat_spirituel", "guerison_restauration"], chapters: ["02_EXO_015", "19_PSA_018", "19_PSA_118", "45_ROM_008", "46_1CO_015", "66_REV_012"] },

        // MORT
        mort: { families: ["fin_temps", "souffrance_epreuve"], chapters: ["19_PSA_023", "43_JOH_011", "45_ROM_008", "46_1CO_015", "52_1TH_004", "66_REV_021"] },
        death: { families: ["fin_temps", "souffrance_epreuve"], chapters: ["19_PSA_023", "43_JOH_011", "45_ROM_008", "46_1CO_015", "52_1TH_004", "66_REV_021"] },
        morte: { families: ["fin_temps", "souffrance_epreuve"], chapters: ["19_PSA_023", "43_JOH_011", "45_ROM_008", "46_1CO_015", "52_1TH_004", "66_REV_021"] },
        muerte: { families: ["fin_temps", "souffrance_epreuve"], chapters: ["19_PSA_023", "43_JOH_011", "45_ROM_008", "46_1CO_015", "52_1TH_004", "66_REV_021"] },
        tod: { families: ["fin_temps", "souffrance_epreuve"], chapters: ["19_PSA_023", "43_JOH_011", "45_ROM_008", "46_1CO_015", "52_1TH_004", "66_REV_021"] },

        // SAGESSE
        sagesse: { families: ["sagesse_verite", "vie_responsabilite"], chapters: ["20_PRO_001", "20_PRO_002", "20_PRO_003", "20_PRO_008", "59_JAM_001", "59_JAM_003"] },
        wisdom: { families: ["sagesse_verite", "vie_responsabilite"], chapters: ["20_PRO_001", "20_PRO_002", "20_PRO_003", "20_PRO_008", "59_JAM_001", "59_JAM_003"] },
        sabedoria: { families: ["sagesse_verite", "vie_responsabilite"], chapters: ["20_PRO_001", "20_PRO_002", "20_PRO_003", "20_PRO_008", "59_JAM_001", "59_JAM_003"] },
        sabiduria: { families: ["sagesse_verite", "vie_responsabilite"], chapters: ["20_PRO_001", "20_PRO_002", "20_PRO_003", "20_PRO_008", "59_JAM_001", "59_JAM_003"] },
        weisheit: { families: ["sagesse_verite", "vie_responsabilite"], chapters: ["20_PRO_001", "20_PRO_002", "20_PRO_003", "20_PRO_008", "59_JAM_001", "59_JAM_003"] },
        saggezza: { families: ["sagesse_verite", "vie_responsabilite"], chapters: ["20_PRO_001", "20_PRO_002", "20_PRO_003", "20_PRO_008", "59_JAM_001", "59_JAM_003"] },

        // ARGENT
        argent: { families: ["vie_responsabilite", "peche_chute"], chapters: ["40_MAT_006", "42_LUK_012", "42_LUK_016", "54_1TI_006", "59_JAM_005"] },
        money: { families: ["vie_responsabilite", "peche_chute"], chapters: ["40_MAT_006", "42_LUK_012", "42_LUK_016", "54_1TI_006", "59_JAM_005"] },
        dinheiro: { families: ["vie_responsabilite", "peche_chute"], chapters: ["40_MAT_006", "42_LUK_012", "42_LUK_016", "54_1TI_006", "59_JAM_005"] },
        dinero: { families: ["vie_responsabilite", "peche_chute"], chapters: ["40_MAT_006", "42_LUK_012", "42_LUK_016", "54_1TI_006", "59_JAM_005"] },
        geld: { families: ["vie_responsabilite", "peche_chute"], chapters: ["40_MAT_006", "42_LUK_012", "42_LUK_016", "54_1TI_006", "59_JAM_005"] },
        denaro: { families: ["vie_responsabilite", "peche_chute"], chapters: ["40_MAT_006", "42_LUK_012", "42_LUK_016", "54_1TI_006", "59_JAM_005"] },

        // TRAVAIL
        travail: { families: ["vie_responsabilite", "sagesse_verite"], chapters: ["01_GEN_002", "20_PRO_006", "20_PRO_031", "21_ECC_003", "51_COL_003"] },
        work: { families: ["vie_responsabilite", "sagesse_verite"], chapters: ["01_GEN_002", "20_PRO_006", "20_PRO_031", "21_ECC_003", "51_COL_003"] },
        trabalho: { families: ["vie_responsabilite", "sagesse_verite"], chapters: ["01_GEN_002", "20_PRO_006", "20_PRO_031", "21_ECC_003", "51_COL_003"] },
        trabajo: { families: ["vie_responsabilite", "sagesse_verite"], chapters: ["01_GEN_002", "20_PRO_006", "20_PRO_031", "21_ECC_003", "51_COL_003"] },
        arbeit: { families: ["vie_responsabilite", "sagesse_verite"], chapters: ["01_GEN_002", "20_PRO_006", "20_PRO_031", "21_ECC_003", "51_COL_003"] },
        lavoro: { families: ["vie_responsabilite", "sagesse_verite"], chapters: ["01_GEN_002", "20_PRO_006", "20_PRO_031", "21_ECC_003", "51_COL_003"] },

        // FAMILLE
        famille: { families: ["amour_relations", "vie_responsabilite"], chapters: ["19_PSA_127", "19_PSA_128", "20_PRO_022", "20_PRO_031", "49_EPH_005", "49_EPH_006"] },
        family: { families: ["amour_relations", "vie_responsabilite"], chapters: ["19_PSA_127", "19_PSA_128", "20_PRO_022", "20_PRO_031", "49_EPH_005", "49_EPH_006"] },
        familia: { families: ["amour_relations", "vie_responsabilite"], chapters: ["19_PSA_127", "19_PSA_128", "20_PRO_022", "20_PRO_031", "49_EPH_005", "49_EPH_006"] },
        familie: { families: ["amour_relations", "vie_responsabilite"], chapters: ["19_PSA_127", "19_PSA_128", "20_PRO_022", "20_PRO_031", "49_EPH_005", "49_EPH_006"] },
        famiglia: { families: ["amour_relations", "vie_responsabilite"], chapters: ["19_PSA_127", "19_PSA_128", "20_PRO_022", "20_PRO_031", "49_EPH_005", "49_EPH_006"] },

        // DIEU
        dieu: { families: ["dieu_nature", "foi_confiance"], chapters: ["01_GEN_001", "02_EXO_003", "19_PSA_103", "19_PSA_139", "23_ISA_040", "43_JOH_001"] },
        god: { families: ["dieu_nature", "foi_confiance"], chapters: ["01_GEN_001", "02_EXO_003", "19_PSA_103", "19_PSA_139", "23_ISA_040", "43_JOH_001"] },
        deus: { families: ["dieu_nature", "foi_confiance"], chapters: ["01_GEN_001", "02_EXO_003", "19_PSA_103", "19_PSA_139", "23_ISA_040", "43_JOH_001"] },
        dios: { families: ["dieu_nature", "foi_confiance"], chapters: ["01_GEN_001", "02_EXO_003", "19_PSA_103", "19_PSA_139", "23_ISA_040", "43_JOH_001"] },
        gott: { families: ["dieu_nature", "foi_confiance"], chapters: ["01_GEN_001", "02_EXO_003", "19_PSA_103", "19_PSA_139", "23_ISA_040", "43_JOH_001"] },
        dio: { families: ["dieu_nature", "foi_confiance"], chapters: ["01_GEN_001", "02_EXO_003", "19_PSA_103", "19_PSA_139", "23_ISA_040", "43_JOH_001"] },

        // PRIÈRE
        priere: { families: ["foi_confiance", "dieu_nature"], chapters: ["19_PSA_005", "40_MAT_006", "42_LUK_011", "42_LUK_018", "50_PHP_004"] },
        prayer: { families: ["foi_confiance", "dieu_nature"], chapters: ["19_PSA_005", "40_MAT_006", "42_LUK_011", "42_LUK_018", "50_PHP_004"] },
        oracao: { families: ["foi_confiance", "dieu_nature"], chapters: ["19_PSA_005", "40_MAT_006", "42_LUK_011", "42_LUK_018", "50_PHP_004"] },
        oracion: { families: ["foi_confiance", "dieu_nature"], chapters: ["19_PSA_005", "40_MAT_006", "42_LUK_011", "42_LUK_018", "50_PHP_004"] },
        gebet: { families: ["foi_confiance", "dieu_nature"], chapters: ["19_PSA_005", "40_MAT_006", "42_LUK_011", "42_LUK_018", "50_PHP_004"] },
        preghiera: { families: ["foi_confiance", "dieu_nature"], chapters: ["19_PSA_005", "40_MAT_006", "42_LUK_011", "42_LUK_018", "50_PHP_004"] },

        // PROTECTION
        protection: { families: ["foi_confiance", "combat_spirituel"], chapters: ["19_PSA_023", "19_PSA_027", "19_PSA_046", "19_PSA_091", "19_PSA_121"] },
        protecao: { families: ["foi_confiance", "combat_spirituel"], chapters: ["19_PSA_023", "19_PSA_027", "19_PSA_046", "19_PSA_091", "19_PSA_121"] },
        proteccion: { families: ["foi_confiance", "combat_spirituel"], chapters: ["19_PSA_023", "19_PSA_027", "19_PSA_046", "19_PSA_091", "19_PSA_121"] },
        schutz: { families: ["foi_confiance", "combat_spirituel"], chapters: ["19_PSA_023", "19_PSA_027", "19_PSA_046", "19_PSA_091", "19_PSA_121"] },
        protezione: { families: ["foi_confiance", "combat_spirituel"], chapters: ["19_PSA_023", "19_PSA_027", "19_PSA_046", "19_PSA_091", "19_PSA_121"] }
    },

    /**
     * Normalise une requête (minuscules, sans accents)
     */
    normalizeQuery: function(query) {
        return query.toLowerCase()
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            .trim();
    },

    /**
     * Recherche sémantique principale
     * @param {string} query - Mot-clé recherché
     * @param {string} lang - Langue (FR, EN, PT, ES, DE, IT)
     * @param {number} maxResults - Nombre max de résultats
     * @returns {Array} Liste de {chapter, score}
     */
    search: function(query, lang = 'FR', maxResults = 8) {
        const normalized = this.normalizeQuery(query);

        // Chercher dans la map sémantique
        const match = this.SEMANTIC_MAP[normalized];

        if (!match) {
            return [];
        }

        const results = [];
        const seen = new Set();

        // Ajouter les chapitres prioritaires (score 100)
        if (match.chapters) {
            for (const chapter of match.chapters) {
                if (!seen.has(chapter)) {
                    results.push({ chapter: chapter, score: 100 });
                    seen.add(chapter);
                }
            }
        }

        // Ajouter les chapitres des familles (score 70)
        if (match.families && results.length < maxResults) {
            for (const familyKey of match.families) {
                const family = this.FAMILIES[familyKey];
                if (family && family.chapters) {
                    for (const chapter of family.chapters) {
                        if (!seen.has(chapter) && results.length < maxResults) {
                            results.push({ chapter: chapter, score: 70 });
                            seen.add(chapter);
                        }
                    }
                }
            }
        }

        return results.slice(0, maxResults);
    },

    /**
     * Retourne le nom d'un livre biblique dans une langue
     * @param {string} bookCode - Code du livre (GEN, EXO, PSA, etc.)
     * @param {string} lang - Langue (FR, EN, PT, ES, DE, IT)
     * @returns {string} Nom du livre
     */
    getBookName: function(bookCode, lang = 'FR') {
        const BOOK_NAMES = {
            'GEN': { FR: 'Genèse', EN: 'Genesis', PT: 'Gênesis', ES: 'Génesis', DE: 'Genesis', IT: 'Genesi' },
            'EXO': { FR: 'Exode', EN: 'Exodus', PT: 'Êxodo', ES: 'Éxodo', DE: 'Exodus', IT: 'Esodo' },
            'LEV': { FR: 'Lévitique', EN: 'Leviticus', PT: 'Levítico', ES: 'Levítico', DE: 'Levitikus', IT: 'Levitico' },
            'NUM': { FR: 'Nombres', EN: 'Numbers', PT: 'Números', ES: 'Números', DE: 'Numeri', IT: 'Numeri' },
            'DEU': { FR: 'Deutéronome', EN: 'Deuteronomy', PT: 'Deuteronômio', ES: 'Deuteronomio', DE: 'Deuteronomium', IT: 'Deuteronomio' },
            'JOS': { FR: 'Josué', EN: 'Joshua', PT: 'Josué', ES: 'Josué', DE: 'Josua', IT: 'Giosuè' },
            'JDG': { FR: 'Juges', EN: 'Judges', PT: 'Juízes', ES: 'Jueces', DE: 'Richter', IT: 'Giudici' },
            'RUT': { FR: 'Ruth', EN: 'Ruth', PT: 'Rute', ES: 'Rut', DE: 'Ruth', IT: 'Rut' },
            '1SA': { FR: '1 Samuel', EN: '1 Samuel', PT: '1 Samuel', ES: '1 Samuel', DE: '1 Samuel', IT: '1 Samuele' },
            '2SA': { FR: '2 Samuel', EN: '2 Samuel', PT: '2 Samuel', ES: '2 Samuel', DE: '2 Samuel', IT: '2 Samuele' },
            '1KI': { FR: '1 Rois', EN: '1 Kings', PT: '1 Reis', ES: '1 Reyes', DE: '1 Könige', IT: '1 Re' },
            '2KI': { FR: '2 Rois', EN: '2 Kings', PT: '2 Reis', ES: '2 Reyes', DE: '2 Könige', IT: '2 Re' },
            '1CH': { FR: '1 Chroniques', EN: '1 Chronicles', PT: '1 Crônicas', ES: '1 Crónicas', DE: '1 Chronik', IT: '1 Cronache' },
            '2CH': { FR: '2 Chroniques', EN: '2 Chronicles', PT: '2 Crônicas', ES: '2 Crónicas', DE: '2 Chronik', IT: '2 Cronache' },
            'EZR': { FR: 'Esdras', EN: 'Ezra', PT: 'Esdras', ES: 'Esdras', DE: 'Esra', IT: 'Esdra' },
            'NEH': { FR: 'Néhémie', EN: 'Nehemiah', PT: 'Neemias', ES: 'Nehemías', DE: 'Nehemia', IT: 'Neemia' },
            'EST': { FR: 'Esther', EN: 'Esther', PT: 'Ester', ES: 'Ester', DE: 'Esther', IT: 'Ester' },
            'JOB': { FR: 'Job', EN: 'Job', PT: 'Jó', ES: 'Job', DE: 'Hiob', IT: 'Giobbe' },
            'PSA': { FR: 'Psaume', EN: 'Psalm', PT: 'Salmo', ES: 'Salmo', DE: 'Psalm', IT: 'Salmo' },
            'PRO': { FR: 'Proverbes', EN: 'Proverbs', PT: 'Provérbios', ES: 'Proverbios', DE: 'Sprüche', IT: 'Proverbi' },
            'ECC': { FR: 'Ecclésiaste', EN: 'Ecclesiastes', PT: 'Eclesiastes', ES: 'Eclesiastés', DE: 'Prediger', IT: 'Ecclesiaste' },
            'SNG': { FR: 'Cantique', EN: 'Song of Songs', PT: 'Cânticos', ES: 'Cantares', DE: 'Hohelied', IT: 'Cantico' },
            'ISA': { FR: 'Ésaïe', EN: 'Isaiah', PT: 'Isaías', ES: 'Isaías', DE: 'Jesaja', IT: 'Isaia' },
            'JER': { FR: 'Jérémie', EN: 'Jeremiah', PT: 'Jeremias', ES: 'Jeremías', DE: 'Jeremia', IT: 'Geremia' },
            'LAM': { FR: 'Lamentations', EN: 'Lamentations', PT: 'Lamentações', ES: 'Lamentaciones', DE: 'Klagelieder', IT: 'Lamentazioni' },
            'EZK': { FR: 'Ézéchiel', EN: 'Ezekiel', PT: 'Ezequiel', ES: 'Ezequiel', DE: 'Hesekiel', IT: 'Ezechiele' },
            'DAN': { FR: 'Daniel', EN: 'Daniel', PT: 'Daniel', ES: 'Daniel', DE: 'Daniel', IT: 'Daniele' },
            'HOS': { FR: 'Osée', EN: 'Hosea', PT: 'Oséias', ES: 'Oseas', DE: 'Hosea', IT: 'Osea' },
            'JOL': { FR: 'Joël', EN: 'Joel', PT: 'Joel', ES: 'Joel', DE: 'Joel', IT: 'Gioele' },
            'AMO': { FR: 'Amos', EN: 'Amos', PT: 'Amós', ES: 'Amós', DE: 'Amos', IT: 'Amos' },
            'OBA': { FR: 'Abdias', EN: 'Obadiah', PT: 'Obadias', ES: 'Abdías', DE: 'Obadja', IT: 'Abdia' },
            'JON': { FR: 'Jonas', EN: 'Jonah', PT: 'Jonas', ES: 'Jonás', DE: 'Jona', IT: 'Giona' },
            'MIC': { FR: 'Michée', EN: 'Micah', PT: 'Miquéias', ES: 'Miqueas', DE: 'Micha', IT: 'Michea' },
            'NAH': { FR: 'Nahum', EN: 'Nahum', PT: 'Naum', ES: 'Nahúm', DE: 'Nahum', IT: 'Naum' },
            'HAB': { FR: 'Habacuc', EN: 'Habakkuk', PT: 'Habacuque', ES: 'Habacuc', DE: 'Habakuk', IT: 'Abacuc' },
            'ZEP': { FR: 'Sophonie', EN: 'Zephaniah', PT: 'Sofonias', ES: 'Sofonías', DE: 'Zefanja', IT: 'Sofonia' },
            'HAG': { FR: 'Aggée', EN: 'Haggai', PT: 'Ageu', ES: 'Hageo', DE: 'Haggai', IT: 'Aggeo' },
            'ZEC': { FR: 'Zacharie', EN: 'Zechariah', PT: 'Zacarias', ES: 'Zacarías', DE: 'Sacharja', IT: 'Zaccaria' },
            'MAL': { FR: 'Malachie', EN: 'Malachi', PT: 'Malaquias', ES: 'Malaquías', DE: 'Maleachi', IT: 'Malachia' },
            'MAT': { FR: 'Matthieu', EN: 'Matthew', PT: 'Mateus', ES: 'Mateo', DE: 'Matthäus', IT: 'Matteo' },
            'MRK': { FR: 'Marc', EN: 'Mark', PT: 'Marcos', ES: 'Marcos', DE: 'Markus', IT: 'Marco' },
            'LUK': { FR: 'Luc', EN: 'Luke', PT: 'Lucas', ES: 'Lucas', DE: 'Lukas', IT: 'Luca' },
            'JOH': { FR: 'Jean', EN: 'John', PT: 'João', ES: 'Juan', DE: 'Johannes', IT: 'Giovanni' },
            'ACT': { FR: 'Actes', EN: 'Acts', PT: 'Atos', ES: 'Hechos', DE: 'Apostelgeschichte', IT: 'Atti' },
            'ROM': { FR: 'Romains', EN: 'Romans', PT: 'Romanos', ES: 'Romanos', DE: 'Römer', IT: 'Romani' },
            '1CO': { FR: '1 Corinthiens', EN: '1 Corinthians', PT: '1 Coríntios', ES: '1 Corintios', DE: '1 Korinther', IT: '1 Corinzi' },
            '2CO': { FR: '2 Corinthiens', EN: '2 Corinthians', PT: '2 Coríntios', ES: '2 Corintios', DE: '2 Korinther', IT: '2 Corinzi' },
            'GAL': { FR: 'Galates', EN: 'Galatians', PT: 'Gálatas', ES: 'Gálatas', DE: 'Galater', IT: 'Galati' },
            'EPH': { FR: 'Éphésiens', EN: 'Ephesians', PT: 'Efésios', ES: 'Efesios', DE: 'Epheser', IT: 'Efesini' },
            'PHP': { FR: 'Philippiens', EN: 'Philippians', PT: 'Filipenses', ES: 'Filipenses', DE: 'Philipper', IT: 'Filippesi' },
            'COL': { FR: 'Colossiens', EN: 'Colossians', PT: 'Colossenses', ES: 'Colosenses', DE: 'Kolosser', IT: 'Colossesi' },
            '1TH': { FR: '1 Thessaloniciens', EN: '1 Thessalonians', PT: '1 Tessalonicenses', ES: '1 Tesalonicenses', DE: '1 Thessalonicher', IT: '1 Tessalonicesi' },
            '2TH': { FR: '2 Thessaloniciens', EN: '2 Thessalonians', PT: '2 Tessalonicenses', ES: '2 Tesalonicenses', DE: '2 Thessalonicher', IT: '2 Tessalonicesi' },
            '1TI': { FR: '1 Timothée', EN: '1 Timothy', PT: '1 Timóteo', ES: '1 Timoteo', DE: '1 Timotheus', IT: '1 Timoteo' },
            '2TI': { FR: '2 Timothée', EN: '2 Timothy', PT: '2 Timóteo', ES: '2 Timoteo', DE: '2 Timotheus', IT: '2 Timoteo' },
            'TIT': { FR: 'Tite', EN: 'Titus', PT: 'Tito', ES: 'Tito', DE: 'Titus', IT: 'Tito' },
            'PHM': { FR: 'Philémon', EN: 'Philemon', PT: 'Filemom', ES: 'Filemón', DE: 'Philemon', IT: 'Filemone' },
            'HEB': { FR: 'Hébreux', EN: 'Hebrews', PT: 'Hebreus', ES: 'Hebreos', DE: 'Hebräer', IT: 'Ebrei' },
            'JAM': { FR: 'Jacques', EN: 'James', PT: 'Tiago', ES: 'Santiago', DE: 'Jakobus', IT: 'Giacomo' },
            '1PE': { FR: '1 Pierre', EN: '1 Peter', PT: '1 Pedro', ES: '1 Pedro', DE: '1 Petrus', IT: '1 Pietro' },
            '2PE': { FR: '2 Pierre', EN: '2 Peter', PT: '2 Pedro', ES: '2 Pedro', DE: '2 Petrus', IT: '2 Pietro' },
            '1JO': { FR: '1 Jean', EN: '1 John', PT: '1 João', ES: '1 Juan', DE: '1 Johannes', IT: '1 Giovanni' },
            '2JO': { FR: '2 Jean', EN: '2 John', PT: '2 João', ES: '2 Juan', DE: '2 Johannes', IT: '2 Giovanni' },
            '3JO': { FR: '3 Jean', EN: '3 John', PT: '3 João', ES: '3 Juan', DE: '3 Johannes', IT: '3 Giovanni' },
            'JUD': { FR: 'Jude', EN: 'Jude', PT: 'Judas', ES: 'Judas', DE: 'Judas', IT: 'Giuda' },
            'REV': { FR: 'Apocalypse', EN: 'Revelation', PT: 'Apocalipse', ES: 'Apocalipsis', DE: 'Offenbarung', IT: 'Apocalisse' }
        };

        const names = BOOK_NAMES[bookCode];
        return names ? (names[lang] || names['FR']) : bookCode;
    },

    /**
     * Enrichir SEMANTIC_MAP avec le dictionnaire complet
     */
    enrichSemanticMap: function() {
        if (!window.SemanticDictionary) {
            console.warn('[Semantic] Dictionary not loaded yet');
            return;
        }

        // Enrichir avec les 12 familles
        Object.keys(SemanticDictionary).forEach(familyKey => {
            if (familyKey === 'themes_modernes') return; // Traité séparément

            const family = SemanticDictionary[familyKey];
            const chapters = family.chapters || [];

            // Pour chaque langue
            ['FR', 'EN', 'PT', 'ES', 'DE', 'IT', 'TL'].forEach(lang => {
                const keywords = family[lang] || [];

                keywords.forEach(keyword => {
                    const key = keyword.toLowerCase().trim();
                    if (!this.SEMANTIC_MAP[key]) {
                        this.SEMANTIC_MAP[key] = {
                            families: [familyKey],
                            chapters: chapters
                        };
                    }
                });
            });
        });

        // Enrichir avec les thèmes modernes
        if (SemanticDictionary.themes_modernes) {
            Object.keys(SemanticDictionary.themes_modernes).forEach(themeKey => {
                const theme = SemanticDictionary.themes_modernes[themeKey];

                ['FR', 'EN', 'PT', 'ES', 'DE', 'IT', 'TL'].forEach(lang => {
                    const keywords = theme[lang] || [];

                    keywords.forEach(keyword => {
                        const key = keyword.toLowerCase().trim();
                        if (!this.SEMANTIC_MAP[key]) {
                            this.SEMANTIC_MAP[key] = {
                                families: theme.families || [],
                                chapters: theme.chapters || []
                            };
                        }
                    });
                });
            });
        }

        console.log('[Semantic] Dictionary loaded:', Object.keys(this.SEMANTIC_MAP).length, 'keywords');
    }
};

// Auto-enrichissement au chargement
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => SemanticEngine.enrichSemanticMap(), 100);
    });
} else {
    setTimeout(() => SemanticEngine.enrichSemanticMap(), 100);
}
