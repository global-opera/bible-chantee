// lang-config.js - Language configuration for Sung Bible Dashboard
// Provides LANG_CONFIG object with .load() method used by renderLanguageProgress()
// FR, EN, PT, ES are complete (1189 chapters). DE, IT, TL are in progress (placeholders).

const LANG_CONFIG = {
    load: async function() {
          return {
                  totalChapters: 1189,
                  languages: {
                            FR: {
                                        name: 'Francais',
                                        flag: 'FR',
                                        chapters: 1189,
                                        status: 'complete'
                            },
                            EN: {
                                        name: 'English',
                                        flag: 'EN',
                                        chapters: 1189,
                                        status: 'complete'
                            },
                            PT: {
                                        name: 'Portugues',
                                        flag: 'PT',
                                        chapters: 1189,
                                        status: 'complete'
                            },
                            ES: {
                                        name: 'Espanol',
                                        flag: 'ES',
                                        chapters: 1189,
                                        status: 'complete'
                            },
                            DE: {
                                        name: 'Deutsch',
                                        flag: 'DE',
                                        chapters: 0,
                                        status: 'progress'
                            },
                            IT: {
                                        name: 'Italiano',
                                        flag: 'IT',
                                        chapters: 0,
                                        status: 'progress'
                            },
                            TL: {
                                        name: 'Filipino',
                                        flag: 'TL',
                                        chapters: 0,
                                        status: 'progress'
                            }
                  }
          };
    }
};
