// Netlify Function pour récupérer les statistiques Google Analytics 4
const { BetaAnalyticsDataClient } = require('@google-analytics/data');

exports.handler = async (event, context) => {
  // Headers CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  try {
    // Vérifier les variables d'environnement
    if (!process.env.GOOGLE_SERVICE_ACCOUNT_JSON || !process.env.GA4_PROPERTY_ID) {
      throw new Error('Variables d\'environnement manquantes: GOOGLE_SERVICE_ACCOUNT_JSON ou GA4_PROPERTY_ID');
    }

    // Parser les credentials
    const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
    const propertyId = process.env.GA4_PROPERTY_ID;

    // Initialiser le client GA4
    const analyticsDataClient = new BetaAnalyticsDataClient({
      credentials: {
        client_email: credentials.client_email,
        private_key: credentials.private_key
      }
    });

    // === 1. VISITEURS EN TEMPS RÉEL (dernières 30 minutes) ===
    const [realtimeResponse] = await analyticsDataClient.runRealtimeReport({
      property: `properties/${propertyId}`,
      dimensions: [
        { name: 'country' },
        { name: 'city' }
      ],
      metrics: [
        { name: 'activeUsers' }
      ]
    });

    // === 2. VISITEURS AUJOURD'HUI PAR PAYS/VILLE ===
    const [todayResponse] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: 'today', endDate: 'today' }],
      dimensions: [
        { name: 'country' },
        { name: 'city' },
        { name: 'latitude' },
        { name: 'longitude' }
      ],
      metrics: [
        { name: 'activeUsers' },
        { name: 'sessions' },
        { name: 'screenPageViews' }
      ]
    });

    // === 3. ÉVÉNEMENTS PERSONNALISÉS (7 derniers jours) ===
    const [eventsResponse] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
      dimensions: [
        { name: 'eventName' },
        { name: 'customEvent:book' },
        { name: 'customEvent:language' }
      ],
      metrics: [
        { name: 'eventCount' }
      ],
      dimensionFilter: {
        filter: {
          fieldName: 'eventName',
          inListFilter: {
            values: ['audio_play', 'share', 'sign_up', 'lyrics_view', 'language_change']
          }
        }
      }
    });

    // === 4. STATISTIQUES GLOBALES (30 derniers jours) ===
    const [globalResponse] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
      metrics: [
        { name: 'totalUsers' },
        { name: 'sessions' },
        { name: 'averageSessionDuration' },
        { name: 'bounceRate' }
      ]
    });

    // === 5. TOP CHAPITRES ÉCOUTÉS (7 derniers jours) ===
    const [topChaptersResponse] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
      dimensions: [
        { name: 'customEvent:book' },
        { name: 'customEvent:chapter' },
        { name: 'customEvent:language' }
      ],
      metrics: [
        { name: 'eventCount' }
      ],
      dimensionFilter: {
        filter: {
          fieldName: 'eventName',
          stringFilter: {
            value: 'audio_play'
          }
        }
      },
      orderBys: [
        {
          metric: {
            metricName: 'eventCount'
          },
          desc: true
        }
      ],
      limit: 10
    });

    // Formatter les données pour le dashboard
    const formattedData = {
      realtime: {
        activeUsers: realtimeResponse.rows?.reduce((sum, row) => sum + parseInt(row.metricValues[0].value), 0) || 0,
        locations: realtimeResponse.rows?.map(row => ({
          country: row.dimensionValues[0].value,
          city: row.dimensionValues[1].value,
          users: parseInt(row.metricValues[0].value)
        })) || []
      },
      today: {
        visitors: todayResponse.rows?.map(row => ({
          country: row.dimensionValues[0].value,
          city: row.dimensionValues[1].value,
          lat: parseFloat(row.dimensionValues[2].value) || 0,
          lng: parseFloat(row.dimensionValues[3].value) || 0,
          users: parseInt(row.metricValues[0].value),
          sessions: parseInt(row.metricValues[1].value),
          pageViews: parseInt(row.metricValues[2].value)
        })) || [],
        summary: {
          users: todayResponse.rows?.reduce((sum, row) => sum + parseInt(row.metricValues[0].value), 0) || 0,
          sessions: todayResponse.rows?.reduce((sum, row) => sum + parseInt(row.metricValues[1].value), 0) || 0,
          pageViews: todayResponse.rows?.reduce((sum, row) => sum + parseInt(row.metricValues[2].value), 0) || 0
        }
      },
      events: {
        audioPlays: eventsResponse.rows?.filter(row => row.dimensionValues[0].value === 'audio_play')
          .reduce((sum, row) => sum + parseInt(row.metricValues[0].value), 0) || 0,
        shares: eventsResponse.rows?.filter(row => row.dimensionValues[0].value === 'share')
          .reduce((sum, row) => sum + parseInt(row.metricValues[0].value), 0) || 0,
        signups: eventsResponse.rows?.filter(row => row.dimensionValues[0].value === 'sign_up')
          .reduce((sum, row) => sum + parseInt(row.metricValues[0].value), 0) || 0,
        lyricsViews: eventsResponse.rows?.filter(row => row.dimensionValues[0].value === 'lyrics_view')
          .reduce((sum, row) => sum + parseInt(row.metricValues[0].value), 0) || 0,
        languageChanges: eventsResponse.rows?.filter(row => row.dimensionValues[0].value === 'language_change')
          .reduce((sum, row) => sum + parseInt(row.metricValues[0].value), 0) || 0
      },
      global: {
        totalUsers: parseInt(globalResponse.rows?.[0]?.metricValues[0]?.value || 0),
        sessions: parseInt(globalResponse.rows?.[0]?.metricValues[1]?.value || 0),
        avgSessionDuration: parseFloat(globalResponse.rows?.[0]?.metricValues[2]?.value || 0),
        bounceRate: parseFloat(globalResponse.rows?.[0]?.metricValues[3]?.value || 0)
      },
      topChapters: topChaptersResponse.rows?.map(row => ({
        book: row.dimensionValues[0].value,
        chapter: row.dimensionValues[1].value,
        language: row.dimensionValues[2].value,
        plays: parseInt(row.metricValues[0].value)
      })) || []
    };

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        timestamp: new Date().toISOString(),
        data: formattedData
      })
    };

  } catch (error) {
    console.error('Erreur GA4 Analytics:', error);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: error.message,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      })
    };
  }
};
