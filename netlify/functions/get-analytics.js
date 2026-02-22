const { BetaAnalyticsDataClient } = require('@google-analytics/data');


exports.handler = async (event) => {
    try {
        const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
        const propertyId = process.env.GA4_PROPERTY_ID;


        if (!credentials || !propertyId) {
            return {
                statusCode: 500,
                body: JSON.stringify({ error: 'Missing credentials or property ID' })
            };
        }


        const client = new BetaAnalyticsDataClient({ credentials });


        // Visiteurs aujourd'hui par pays
        const [visitorsResponse] = await client.runReport({
            property: `properties/${propertyId}`,
            dateRanges: [{ startDate: 'today', endDate: 'today' }],
            dimensions: [{ name: 'country' }, { name: 'city' }],
            metrics: [{ name: 'activeUsers' }, { name: 'sessions' }]
        });


        // Visiteurs 28 derniers jours
        const [weekResponse] = await client.runReport({
            property: `properties/${propertyId}`,
            dateRanges: [{ startDate: '28daysAgo', endDate: 'today' }],
            dimensions: [{ name: 'country' }],
            metrics: [{ name: 'activeUsers' }, { name: 'sessions' }]
        });


        // Evenements (ecoutes, partages, etc)
        const [eventsResponse] = await client.runReport({
            property: `properties/${propertyId}`,
            dateRanges: [{ startDate: '28daysAgo', endDate: 'today' }],
            dimensions: [{ name: 'eventName' }],
            metrics: [{ name: 'eventCount' }]
        });


        // Pages les plus vues
        const [pagesResponse] = await client.runReport({
            property: `properties/${propertyId}`,
            dateRanges: [{ startDate: '28daysAgo', endDate: 'today' }],
            dimensions: [{ name: 'pagePath' }],
            metrics: [{ name: 'screenPageViews' }],
            limit: 10
        });


        // Formater les donnees
        const stats = {
            today: {
                visitors: 0,
                countries: [],
                cities: []
            },
            week: {
                visitors: 0,
                countries: []
            },
            events: {},
            topPages: []
        };


        // Traiter visiteurs aujourd'hui
        if (visitorsResponse.rows) {
            const countryMap = {};
            visitorsResponse.rows.forEach(row => {
                const country = row.dimensionValues[0].value;
                const city = row.dimensionValues[1].value;
                const users = parseInt(row.metricValues[0].value);
                
                stats.today.visitors += users;
                
                if (!countryMap[country]) {
