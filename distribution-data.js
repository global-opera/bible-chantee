// BibleChantée – Distribution mondiale – Données plateformes
window.distributionData = {
  platforms: [
    // SPOTIFY ECOSYSTEM (green #1DB954)
    { name: "Spotify", category: "Streaming Principal", ecosystem: "Spotify", color: "#1DB954", lat: 59.3293, lng: 18.0686, city: "Stockholm", regions: ["Mondial"], icon: "🎵" },

    // APPLE ECOSYSTEM (gray #A2AAAD)
    { name: "Apple Music", category: "Streaming Principal", ecosystem: "Apple", color: "#A2AAAD", lat: 37.3346, lng: -122.0090, city: "Cupertino", regions: ["Mondial"], icon: "🍎" },
    { name: "iTunes", category: "Streaming Principal", ecosystem: "Apple", color: "#A2AAAD", lat: 37.3346, lng: -122.0090, city: "Cupertino", regions: ["Mondial"], icon: "🍎" },

    // YOUTUBE / GOOGLE ECOSYSTEM (red #FF0000)
    { name: "YouTube Music", category: "Streaming Principal", ecosystem: "YouTube/Google", color: "#FF0000", lat: 37.4220, lng: -122.0841, city: "Mountain View", regions: ["Mondial"], icon: "▶️" },

    // AMAZON ECOSYSTEM (blue #00A8E0)
    { name: "Amazon Music", category: "Streaming Principal", ecosystem: "Amazon", color: "#00A8E0", lat: 47.6062, lng: -122.3321, city: "Seattle", regions: ["Mondial"], icon: "📦" },

    // AUDIO STREAMING ALTERNATIF (purple #9B59B6)
    { name: "Deezer", category: "Streaming Principal", ecosystem: "Alternatif", color: "#9B59B6", lat: 48.8566, lng: 2.3522, city: "Paris", regions: ["Europe", "Monde"], icon: "🎧" },
    { name: "Tidal", category: "Streaming Principal", ecosystem: "Alternatif", color: "#9B59B6", lat: 59.9139, lng: 10.7522, city: "Oslo", regions: ["Monde"], icon: "🎧" },
    { name: "iHeartRadio", category: "Streaming Principal", ecosystem: "Alternatif", color: "#9B59B6", lat: 40.7128, lng: -74.0060, city: "New York", regions: ["USA"], icon: "📻" },
    { name: "Pandora", category: "Streaming Principal", ecosystem: "Alternatif", color: "#9B59B6", lat: 37.8044, lng: -122.2712, city: "Oakland", regions: ["USA"], icon: "📻" },
    { name: "Qobuz", category: "Streaming Principal", ecosystem: "Alternatif", color: "#9B59B6", lat: 48.8566, lng: 2.3522, city: "Paris", regions: ["Europe"], icon: "🎧" },

    // SOCIAL MEDIA (pink #E91E8C)
    { name: "Instagram", category: "Social", ecosystem: "Meta", color: "#E91E8C", lat: 37.4845, lng: -122.1477, city: "Menlo Park", regions: ["Mondial"], icon: "📸" },
    { name: "Facebook", category: "Social", ecosystem: "Meta", color: "#E91E8C", lat: 37.4845, lng: -122.1477, city: "Menlo Park", regions: ["Mondial"], icon: "👥" },
    { name: "TikTok", category: "Social", ecosystem: "ByteDance", color: "#E91E8C", lat: 39.9042, lng: 116.4074, city: "Beijing", regions: ["Mondial"], icon: "🎵" },

    // PLATEFORMES RÉGIONALES (orange #FF8C00)
    { name: "Anghami", category: "Régional", ecosystem: "Moyen-Orient", color: "#FF8C00", lat: 33.8938, lng: 35.5018, city: "Beyrouth", regions: ["Moyen-Orient", "Afrique du Nord"], icon: "🌍" },
    { name: "Boomplay", category: "Régional", ecosystem: "Afrique", color: "#FF8C00", lat: 6.5244, lng: 3.3792, city: "Lagos", regions: ["Afrique"], icon: "🌍" },
    { name: "Joox", category: "Régional", ecosystem: "Asie", color: "#FF8C00", lat: 22.3193, lng: 114.1694, city: "Hong Kong", regions: ["Asie du Sud-Est"], icon: "🌏" },
    { name: "Saavn", category: "Régional", ecosystem: "Asie du Sud", color: "#FF8C00", lat: 19.0760, lng: 72.8777, city: "Mumbai", regions: ["Inde", "Asie du Sud"], icon: "🌏" },
    { name: "NetEase Music", category: "Régional", ecosystem: "Chine", color: "#FF8C00", lat: 30.2741, lng: 120.1551, city: "Hangzhou", regions: ["Chine"], icon: "🌏" },
    { name: "Tencent Music", category: "Régional", ecosystem: "Chine", color: "#FF8C00", lat: 22.5431, lng: 114.0579, city: "Shenzhen", regions: ["Chine"], icon: "🌏" },
    { name: "Kuack Media", category: "Régional", ecosystem: "Amérique Latine", color: "#FF8C00", lat: 4.7110, lng: -74.0721, city: "Bogotá", regions: ["Amérique Latine"], icon: "🌎" },
    { name: "Claro Música", category: "Régional", ecosystem: "Amérique Latine", color: "#FF8C00", lat: -12.0464, lng: -77.0428, city: "Lima", regions: ["Amérique Latine"], icon: "🌎" },
    { name: "Flo", category: "Régional", ecosystem: "Corée", color: "#FF8C00", lat: 37.5665, lng: 126.9780, city: "Séoul", regions: ["Corée du Sud"], icon: "🌏" },
    { name: "Adaptr", category: "Régional", ecosystem: "USA", color: "#FF8C00", lat: 40.7128, lng: -74.0060, city: "New York", regions: ["USA"], icon: "🎵" },
    { name: "MediaNet", category: "Régional", ecosystem: "USA", color: "#FF8C00", lat: 32.7767, lng: -96.7970, city: "Dallas", regions: ["USA"], icon: "🎵" }
  ],

  ecosystemColors: {
    "Spotify": "#1DB954",
    "Apple": "#A2AAAD",
    "YouTube/Google": "#FF0000",
    "Amazon": "#00A8E0",
    "Alternatif": "#9B59B6",
    "Meta": "#E91E8C",
    "ByteDance": "#E91E8C",
    "Moyen-Orient": "#FF8C00",
    "Afrique": "#FF8C00",
    "Asie": "#FF8C00",
    "Asie du Sud": "#FF8C00",
    "Chine": "#FF8C00",
    "Amérique Latine": "#FF8C00",
    "Corée": "#FF8C00",
    "USA": "#FF8C00"
  },

  categoryLabels: {
    "Streaming Principal": { color: "#9B59B6", label: "Streaming", icon: "🎵" },
    "Social": { color: "#E91E8C", label: "Social Media", icon: "📱" },
    "Régional": { color: "#FF8C00", label: "Régional", icon: "🌍" }
  },

  stats: {
    total: 23,
    streaming: 10,
    social: 3,
    regional: 10
  }
};
