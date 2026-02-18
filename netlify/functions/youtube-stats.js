// netlify/functions/youtube-stats.js
// Récupère automatiquement les statistiques YouTube via YouTube Data API v3
// Variables d'environnement requises: YOUTUBE_API_KEY, YOUTUBE_CHANNEL_ID

exports.handler = async (event) => {
    // CORS preflight
    if (event.httpMethod === 'OPTIONS') {
          return {
                  statusCode: 200,
                  headers: {
                            'Access-Control-Allow-Origin': '*',
                            'Access-Control-Allow-Headers': 'Content-Type',
                            'Access-Control-Allow-Methods': 'GET, OPTIONS'
                  },
                  body: ''
          };
    }

    try {
          const apiKey = process.env.YOUTUBE_API_KEY;
          const channelId = process.env.YOUTUBE_CHANNEL_ID;

      if (!apiKey || !channelId) {
              return {
                        statusCode: 500,
                        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
                        body: JSON.stringify({ error: 'Missing YOUTUBE_API_KEY or YOUTUBE_CHANNEL_ID env vars' })
              };
      }

      // 1. Statistiques globales de la chaîne
      const channelUrl = `https://www.googleapis.com/youtube/v3/channels?part=statistics,snippet&id=${channelId}&key=${apiKey}`;
          const channelRes = await fetch(channelUrl);
          if (!channelRes.ok) throw new Error(`YouTube Channels API error: ${channelRes.status}`);
          const channelData = await channelRes.json();

      if (!channelData.items || channelData.items.length === 0) {
              throw new Error('Channel not found');
      }

      const channelStats = channelData.items[0].statistics;
          const channelSnippet = channelData.items[0].snippet;

      const subscribers = parseInt(channelStats.subscriberCount) || 0;
          const totalViews = parseInt(channelStats.viewCount) || 0;
          const videoCount = parseInt(channelStats.videoCount) || 0;

      // 2. Vidéos les plus populaires (28 derniers jours)
      const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&type=video&order=date&maxResults=10&key=${apiKey}`;
          const searchRes = await fetch(searchUrl);
          if (!searchRes.ok) throw new Error(`YouTube Search API error: ${searchRes.status}`);
          const searchData = await searchRes.json();

      let topVideos = [];
          if (searchData.items && searchData.items.length > 0) {
                  // Récupérer les stats de chaque vidéo
            const videoIds = searchData.items.map(item => item.id.videoId).filter(Boolean).join(',');
                  if (videoIds) {
                            const videosUrl = `https://www.googleapis.com/youtube/v3/videos?part=statistics,contentDetails,snippet&id=${videoIds}&key=${apiKey}`;
                            const videosRes = await fetch(videosUrl);
                            if (videosRes.ok) {
                                        const videosData = await videosRes.json();
                                        topVideos = (videosData.items || []).map(v => ({
                                                      id: v.id,
                                                      title: v.snippet.title,
                                                      views: parseInt(v.statistics.viewCount) || 0,
                                                      likes: parseInt(v.statistics.likeCount) || 0,
                                                      comments: parseInt(v.statistics.commentCount) || 0,
                                                      duration: v.contentDetails.duration,
                                                      publishedAt: v.snippet.publishedAt
                                        })).sort((a, b) => b.views - a.views);
                            }
                  }
          }

      // 3. Analytics 28 derniers jours - approximation via les vidéos récentes
      const views28d = topVideos.reduce((sum, v) => {
              // Ne compter que les vidéos publiées dans les 28 derniers jours
                                              const pubDate = new Date(v.publishedAt);
              const cutoff = new Date();
              cutoff.setDate(cutoff.getDate() - 28);
              return pubDate > cutoff ? sum + v.views : sum;
      }, 0);

      // Calculer période pour les labels
      const now = new Date();
          const cutoff28 = new Date();
          cutoff28.setDate(cutoff28.getDate() - 28);
          const dateStr = `${cutoff28.getDate()} ${cutoff28.toLocaleDateString('fr-FR', { month: 'short' })}. → ${now.getDate()} ${now.toLocaleDateString('fr-FR', { month: 'short' })}. ${now.getFullYear()}`;

      // Construire la réponse
      const result = {
              channel: {
                        name: channelSnippet.title,
                        subscribers,
                        totalViews,
                        videoCount
              },
              period28d: {
                        views: views28d,
                        label: dateStr
              },
              topVideos: topVideos.slice(0, 5),
              updatedAt: now.toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
              }),
              updatedAtISO: now.toISOString()
      };

      return {
              statusCode: 200,
              headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                        'Cache-Control': 'public, max-age=3600' // Cache 1 heure
              },
              body: JSON.stringify(result)
      };

    } catch (error) {
          console.error('YouTube Stats error:', error);
          return {
                  statusCode: 500,
                  headers: {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                  },
                  body: JSON.stringify({ error: error.message })
          };
    }
};
