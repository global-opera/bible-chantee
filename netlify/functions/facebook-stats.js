// netlify/functions/facebook-stats.js
// Récupère automatiquement les statistiques Facebook via Meta Graph API
// Variables d'environnement requises: FACEBOOK_PAGE_ACCESS_TOKEN, FACEBOOK_PAGE_ID

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
          const accessToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
          const pageId = process.env.FACEBOOK_PAGE_ID;

      if (!accessToken || !pageId) {
              return {
                        statusCode: 500,
                        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
                        body: JSON.stringify({ error: 'Missing FACEBOOK_PAGE_ACCESS_TOKEN or FACEBOOK_PAGE_ID env vars' })
              };
      }

      const baseUrl = 'https://graph.facebook.com/v21.0';

      // 1. Informations de base de la page (followers, fan count)
      const pageUrl = `${baseUrl}/${pageId}?fields=name,followers_count,fan_count&access_token=${accessToken}`;
          const pageRes = await fetch(pageUrl);
          if (!pageRes.ok) throw new Error(`Facebook Page API error: ${pageRes.status}`);
          const pageData = await pageRes.json();
          if (pageData.error) throw new Error(`Facebook API: ${pageData.error.message}`);

      const followers = pageData.followers_count || pageData.fan_count || 0;
          const pageName = pageData.name || 'Bible Chantée';

      // 2. Insights de la page (28 derniers jours) - portée et engagement
      const since = Math.floor((Date.now() - 28 * 24 * 60 * 60 * 1000) / 1000);
          const until = Math.floor(Date.now() / 1000);

      const insightsMetrics = [
              'page_impressions',
              'page_engaged_users',
              'page_post_engagements',
              'page_fan_adds'
            ].join(',');

      const insightsUrl = `${baseUrl}/${pageId}/insights?metric=${insightsMetrics}&period=day&since=${since}&until=${until}&access_token=${accessToken}`;
          const insightsRes = await fetch(insightsUrl);

      let totalImpressions = 0;
          let totalEngagements = 0;
          let newFollowers = 0;

      if (insightsRes.ok) {
              const insightsData = await insightsRes.json();
              if (insightsData.data) {
                        insightsData.data.forEach(metric => {
                                    const total = (metric.values || []).reduce((sum, v) => sum + (v.value || 0), 0);
                                    if (metric.name === 'page_impressions') totalImpressions = total;
                                    if (metric.name === 'page_post_engagements') totalEngagements = total;
                                    if (metric.name === 'page_fan_adds') newFollowers = total;
                        });
              }
      }

      // 3. Posts récents pour récupérer les Reels et leurs stats
      const postsUrl = `${baseUrl}/${pageId}/posts?fields=id,message,created_time,attachments{media_type},likes.summary(true),comments.summary(true),shares&limit=20&since=${since}&until=${until}&access_token=${accessToken}`;
          const postsRes = await fetch(postsUrl);

      let totalLikes = 0;
          let totalComments = 0;
          let totalShares = 0;
          let reelsCount = 0;
          let otherCount = 0;
          const topPosts = [];

      if (postsRes.ok) {
              const postsData = await postsRes.json();
              if (postsData.data) {
                        postsData.data.forEach(post => {
                                    const likes = post.likes?.summary?.total_count || 0;
                                    const comments = post.comments?.summary?.total_count || 0;
                                    const shares = post.shares?.count || 0;
                                    const isReel = post.attachments?.data?.some(a => a.media_type === 'video') || false;

                                                         totalLikes += likes;
                                    totalComments += comments;
                                    totalShares += shares;
                                    if (isReel) reelsCount++;
                                    else otherCount++;

                                                         topPosts.push({
                                                                       id: post.id,
                                                                       message: (post.message || '').substring(0, 100),
                                                                       likes,
                                                                       comments,
                                                                       shares,
                                                                       isReel,
                                                                       createdTime: post.created_time
                                                         });
                        });
              }
      }

      const totalInteractions = totalLikes + totalComments + totalShares;
          const totalPosts = reelsCount + otherCount;
          const reelsPct = totalPosts > 0 ? Math.round((reelsCount / totalPosts) * 100) : 0;

      // Calculer période
      const now = new Date();
          const cutoff28 = new Date();
          cutoff28.setDate(cutoff28.getDate() - 28);
          const dateStr = `${cutoff28.getDate()} ${cutoff28.toLocaleDateString('fr-FR', { month: 'short' })}. → ${now.getDate()} ${now.toLocaleDateString('fr-FR', { month: 'short' })}. ${now.getFullYear()}`;

      const result = {
              page: {
                        name: pageName,
                        followers,
                        newFollowers28d: newFollowers
              },
              interactions28d: {
                        total: totalInteractions,
                        likes: totalLikes,
                        comments: totalComments,
                        shares: totalShares,
                        label: dateStr
              },
              content: {
                        reelsPct,
                        reelsCount,
                        otherCount,
                        totalPosts
              },
              audience: {
                        impressions: totalImpressions,
                        engagedUsers: totalEngagements
              },
              topPosts: topPosts.sort((a, b) => (b.likes + b.comments + b.shares) - (a.likes + a.comments + a.shares)).slice(0, 5),
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
          console.error('Facebook Stats error:', error);
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
