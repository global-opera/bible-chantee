// BibleChantée – Distribution mondiale – Données plateformes V2
window.distributionData = {
  platforms: [
    // ── SPOTIFY ──────────────────────────────────────────────────────────────────
    {
      id: "spotify",
      name: "Spotify",
      category: "streaming",
      ecosystem: "Spotify ecosystem",
      color: "#1DB954",
      region: "Global",
      lat: 59.3293, lng: 18.0686, city: "Stockholm",
      regions: ["Mondial"],
      icon: "🎵",
      officialUrl: "https://open.spotify.com",
      bibleChanteeUrl: "https://open.spotify.com/artist/0NOJT960djfJ0YbQfjUeLi",
      availabilityStatus: "live",
      notes: "",
      lastCheckedAt: ""
    },
    // ── APPLE ─────────────────────────────────────────────────────────────────────
    {
      id: "apple-music",
      name: "Apple Music",
      category: "streaming",
      ecosystem: "Apple ecosystem",
      color: "#A2AAAD",
      region: "Global",
      lat: 37.3346, lng: -122.0090, city: "Cupertino",
      regions: ["Mondial"],
      icon: "🍎",
      officialUrl: "https://music.apple.com",
      bibleChanteeUrl: "https://music.apple.com/fr/artist/bible-chant%C3%A9e/1860864175",
      availabilityStatus: "live",
      notes: "",
      lastCheckedAt: ""
    },
    {
      id: "itunes",
      name: "iTunes",
      category: "streaming",
      ecosystem: "Apple ecosystem",
      color: "#A2AAAD",
      region: "Global",
      lat: 37.3346, lng: -122.0090, city: "Cupertino",
      regions: ["Mondial"],
      icon: "🍎",
      officialUrl: "https://www.apple.com/itunes/",
      bibleChanteeUrl: "",
      availabilityStatus: "live",
      notes: "",
      lastCheckedAt: ""
    },
    // ── YOUTUBE MUSIC ─────────────────────────────────────────────────────────────
    {
      id: "youtube-music",
      name: "YouTube Music",
      category: "streaming",
      ecosystem: "YouTube / Google ecosystem",
      color: "#FF0000",
      region: "Global",
      lat: 37.4220, lng: -122.0841, city: "Mountain View",
      regions: ["Mondial"],
      icon: "▶️",
      officialUrl: "https://music.youtube.com",
      bibleChanteeUrl: "https://music.youtube.com/channel/UCHw_lelDPxB4Zmgfqqebk-w",
      availabilityStatus: "live",
      notes: "",
      lastCheckedAt: ""
    },
    // ── DEEZER ───────────────────────────────────────────────────────────────────
    {
      id: "deezer",
      name: "Deezer",
      category: "streaming",
      ecosystem: "Alternatif",
      color: "#9B59B6",
      region: "Europe / Global",
      lat: 48.8566, lng: 2.3522, city: "Paris",
      regions: ["Europe", "Monde"],
      icon: "🎧",
      officialUrl: "https://www.deezer.com",
      bibleChanteeUrl: "https://www.deezer.com/fr/artist/361526292",
      availabilityStatus: "live",
      notes: "",
      lastCheckedAt: ""
    },
    // ── TIDAL ────────────────────────────────────────────────────────────────────
    {
      id: "tidal",
      name: "Tidal",
      category: "streaming",
      ecosystem: "Alternatif",
      color: "#9B59B6",
      region: "Global",
      lat: 59.9139, lng: 10.7522, city: "Oslo",
      regions: ["Monde"],
      icon: "🎧",
      officialUrl: "https://tidal.com",
      bibleChanteeUrl: "https://tidal.com/artist/71243616",
      availabilityStatus: "live",
      notes: "",
      lastCheckedAt: ""
    },
    // ── BOOMPLAY ─────────────────────────────────────────────────────────────────
    {
      id: "boomplay",
      name: "Boomplay",
      category: "streaming",
      ecosystem: "Afrique",
      color: "#1ED760",
      region: "Afrique",
      lat: 6.5244, lng: 3.3792, city: "Lagos",
      regions: ["Afrique"],
      icon: "🌍",
      officialUrl: "https://www.boomplay.com",
      bibleChanteeUrl: "https://www.boomplay.com/artists/121487572",
      availabilityStatus: "live",
      notes: "Plateforme leader en Afrique subsaharienne",
      lastCheckedAt: ""
    },
    // ── SOCIAL MEDIA ─────────────────────────────────────────────────────────────
    {
      id: "instagram",
      name: "Instagram",
      category: "social",
      ecosystem: "Meta",
      color: "#E91E8C",
      region: "Global",
      lat: 37.4845, lng: -122.1477, city: "Menlo Park",
      regions: ["Mondial"],
      icon: "📸",
      officialUrl: "https://www.instagram.com",
      bibleChanteeUrl: "https://www.instagram.com/biblechantee/",
      availabilityStatus: "live",
      notes: "",
      lastCheckedAt: ""
    },
    {
      id: "facebook",
      name: "Facebook",
      category: "social",
      ecosystem: "Meta",
      color: "#1877F2",
      region: "Global",
      lat: 37.4845, lng: -122.1477, city: "Menlo Park",
      regions: ["Mondial"],
      icon: "👥",
      officialUrl: "https://www.facebook.com",
      bibleChanteeUrl: "https://www.facebook.com/biblechantee/",
      availabilityStatus: "live",
      notes: "",
      lastCheckedAt: ""
    }
  ],
  categoryMeta: {
    "streaming": { label: "Streaming",    color: "#9B59B6", icon: "🎵" },
    "social":    { label: "Social Media", color: "#E91E8C", icon: "📱" }
  },
  statusMeta: {
    "live":    { label: "Live",       color: "#00C851", icon: "✅" },
    "pending": { label: "En attente", color: "#FFB300", icon: "⏳" },
    "unknown": { label: "Inconnu",    color: "#9E9E9E", icon: "❓" }
  },
  ecosystemColors: {
    "Spotify ecosystem":          "#1DB954",
    "Apple ecosystem":            "#A2AAAD",
    "YouTube / Google ecosystem": "#FF0000",
    "Alternatif":                 "#9B59B6",
    "Meta":                       "#1877F2",
    "Afrique":                    "#1ED760"
  }
};
