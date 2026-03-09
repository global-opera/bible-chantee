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
                    countryMap[country] = { name: country, visitors: 0, cities: [] };
                }
                countryMap[country].visitors += users;
                if (city && city !== '(not set)' && !countryMap[country].cities.includes(city)) {
                    countryMap[country].cities.push(city);
                }
            });
            stats.today.countries = Object.values(countryMap).sort((a, b) => b.visitors - a.visitors);
        }


        // Traiter visiteurs 28 jours
        if (weekResponse.rows) {
            weekResponse.rows.forEach(row => {
                const users = parseInt(row.metricValues[0].value);
                stats.week.visitors += users;
            });
            stats.week.countries = weekResponse.rows.map(row => ({
                name: row.dimensionValues[0].value,
                visitors: parseInt(row.metricValues[0].value)
            })).sort((a, b) => b.visitors - a.visitors);
        }


        // Traiter evenements
        if (eventsResponse.rows) {
            eventsResponse.rows.forEach(row => {
                const eventName = row.dimensionValues[0].value;
                const count = parseInt(row.metricValues[0].value);
                stats.events[eventName] = count;
            });
        }


        // Traiter pages
        if (pagesResponse.rows) {
            stats.topPages = pagesResponse.rows.map(row => ({
                path: row.dimensionValues[0].value,
                views: parseInt(row.metricValues[0].value)
            }));
        }


        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(stats)
        };

    } catch (error) {
        console.error('Analytics error:', error);
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: error.message })
        };
    }
};
