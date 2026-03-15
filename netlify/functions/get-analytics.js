const { BetaAnalyticsDataClient } = require('@google-analytics/data');

exports.handler = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
    };

    try {
        const rawJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
        const propertyId = process.env.GA4_PROPERTY_ID;

        if (!rawJson || !propertyId) {
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ error: 'Missing env vars: GOOGLE_SERVICE_ACCOUNT_JSON or GA4_PROPERTY_ID' })
            };
        }

        let credentials;
        try {
            credentials = JSON.parse(rawJson);
        } catch (e) {
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ error: 'GOOGLE_SERVICE_ACCOUNT_JSON is not valid JSON: ' + e.message })
            };
        }

        const client = new BetaAnalyticsDataClient({ credentials });

        // Periode depuis le dashboard
        const period = event.queryStringParameters?.period || 'all';
        let startDate;
        if (period === '24h')     startDate = '1daysAgo';
        else if (period === '7days')  startDate = '7daysAgo';
        else if (period === '30days') startDate = '30daysAgo';
        else                          startDate = '365daysAgo';

        // Visiteurs par pays + ville (période sélectionnée)
        const [visitorsResponse] = await client.runReport({
            property: `properties/${propertyId}`,
            dateRanges: [{ startDate, endDate: 'today' }],
            dimensions: [{ name: 'country' }, { name: 'city' }],
            metrics: [{ name: 'activeUsers' }, { name: 'sessions' }],
            limit: 200
        });

        // Visiteurs 28 derniers jours (pour comparaison)
        const [weekResponse] = await client.runReport({
            property: `properties/${propertyId}`,
            dateRanges: [{ startDate: '28daysAgo', endDate: 'today' }],
            dimensions: [{ name: 'country' }],
            metrics: [{ name: 'activeUsers' }],
            limit: 100
        });

        // Événements (écoutes, partages, etc.)
        const [eventsResponse] = await client.runReport({
            property: `properties/${propertyId}`,
            dateRanges: [{ startDate: '28daysAgo', endDate: 'today' }],
            dimensions: [{ name: 'eventName' }],
            metrics: [{ name: 'eventCount' }],
            limit: 50
        });

        // Pages les plus vues
        const [pagesResponse] = await client.runReport({
            property: `properties/${propertyId}`,
            dateRanges: [{ startDate: '28daysAgo', endDate: 'today' }],
            dimensions: [{ name: 'pagePath' }],
            metrics: [{ name: 'screenPageViews' }],
            orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
            limit: 10
        });

        // Source d'acquisition (pour plateforme dominante)
        const [sourceResponse] = await client.runReport({
            property: `properties/${propertyId}`,
            dateRanges: [{ startDate: '28daysAgo', endDate: 'today' }],
            dimensions: [{ name: 'sessionSource' }, { name: 'country' }],
            metrics: [{ name: 'activeUsers' }],
            limit: 200
        });

        // === Formater visiteurs par pays ===
        const countryMap = {};
        let totalVisitors = 0;

        if (visitorsResponse.rows) {
            visitorsResponse.rows.forEach(row => {
                const country = row.dimensionValues[0].value;
                const city    = row.dimensionValues[1].value;
                const users   = parseInt(row.metricValues[0].value) || 0;

                totalVisitors += users;

                if (!countryMap[country]) {
                    countryMap[country] = { name: country, visitors: 0, cities: [] };
                }
                countryMap[country].visitors += users;
                if (city && city !== '(not set)' && !countryMap[country].cities.includes(city)) {
                    countryMap[country].cities.push(city);
                }
            });
        }

        const countries = Object.values(countryMap)
            .sort((a, b) => b.visitors - a.visitors);

        // === Visiteurs 28j ===
        let weekVisitors = 0;
        const weekCountries = [];
        if (weekResponse.rows) {
            weekResponse.rows.forEach(row => {
                const users = parseInt(row.metricValues[0].value) || 0;
                weekVisitors += users;
                weekCountries.push({ name: row.dimensionValues[0].value, visitors: users });
            });
        }

        // === Événements ===
        const events = {};
        if (eventsResponse.rows) {
            eventsResponse.rows.forEach(row => {
                events[row.dimensionValues[0].value] = parseInt(row.metricValues[0].value) || 0;
            });
        }

        // === Pages ===
        const topPages = [];
        if (pagesResponse.rows) {
            pagesResponse.rows.forEach(row => {
                topPages.push({
                    path: row.dimensionValues[0].value,
                    views: parseInt(row.metricValues[0].value) || 0
                });
            });
        }

        // === Sources par pays (pour enrichir platform-streams.json à terme) ===
        const sourceByCountry = {};
        if (sourceResponse.rows) {
            sourceResponse.rows.forEach(row => {
                const source  = row.dimensionValues[0].value;
                const country = row.dimensionValues[1].value;
                const users   = parseInt(row.metricValues[0].value) || 0;
                if (!sourceByCountry[country] || sourceByCountry[country].users < users) {
                    sourceByCountry[country] = { source, users };
                }
            });
        }

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                today: {
                    visitors: totalVisitors,
                    countries
                },
                week: {
                    visitors: weekVisitors,
                    countries: weekCountries
                },
                events,
                topPages,
                sourceByCountry,
                period,
                generatedAt: new Date().toISOString()
            })
        };

    } catch (error) {
        console.error('GA4 function error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: error.message,
                code: error.code || null,
                hint: error.code === 7
                    ? 'Permission denied — check Service Account has access to GA4 property'
                    : error.code === 16
                    ? 'Auth error — check GOOGLE_SERVICE_ACCOUNT_JSON is valid'
                    : 'See Netlify function logs for details'
            })
        };
    }
};
