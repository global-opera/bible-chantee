const { BetaAnalyticsDataClient } = require('@google-analytics/data');

exports.handler = async (event) => {
    try {
        // === 1) INSCRIPTIONS via Netlify Forms API ===
        let signups_total = 0;

        const netlifyToken = process.env.NETLIFY_ACCESS_TOKEN;
        const siteId = process.env.NETLIFY_SITE_ID;

        if (netlifyToken && siteId) {
            try {
                const formsResponse = await fetch(
                    `https://api.netlify.com/api/v1/sites/${siteId}/forms`,
                    {
                        headers: {
                            'Authorization': `Bearer ${netlifyToken}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );

                if (formsResponse.ok) {
                    const forms = await formsResponse.json();
                    // Trouver le formulaire "subscribe"
                    const subscribeForm = forms.find(f => f.name === 'subscribe');

                    if (subscribeForm && subscribeForm.id) {
                        // Récupérer les submissions
                        const submissionsResponse = await fetch(
                            `https://api.netlify.com/api/v1/forms/${subscribeForm.id}/submissions`,
                            {
                                headers: {
                                    'Authorization': `Bearer ${netlifyToken}`,
                                    'Content-Type': 'application/json'
                                }
                            }
                        );

                        if (submissionsResponse.ok) {
                            const submissions = await submissionsResponse.json();
                            signups_total = submissions.length;
                        }
                    }
                }
            } catch (netlifyError) {
                console.error('Netlify Forms API error:', netlifyError.message);
            }
        }

        // === 2) PARTAGES + ÉCOUTES via GA4 ===
        let shares_total = 0;
        let listens_total = 0;

        const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
        const propertyId = process.env.GA4_PROPERTY_ID;

        if (credentials && propertyId) {
            const client = new BetaAnalyticsDataClient({ credentials });

            // Événements 7 derniers jours
            const [eventsResponse] = await client.runReport({
                property: `properties/${propertyId}`,
                dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
                dimensions: [{ name: 'eventName' }],
                metrics: [{ name: 'eventCount' }]
            });

            if (eventsResponse.rows) {
                eventsResponse.rows.forEach(row => {
                    const eventName = row.dimensionValues[0].value;
                    const count = parseInt(row.metricValues[0].value);

                    if (eventName === 'share') {
                        shares_total += count;
                    } else if (eventName === 'audio_play') {
                        listens_total += count;
                    }
                });
            }
        }

        // === 3) RÉPONSE ===
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                signups_total,
                shares_total,
                listens_total
            })
        };

    } catch (error) {
        console.error('Stats error:', error);
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                error: error.message,
                signups_total: 0,
                shares_total: 0,
                listens_total: 0
            })
        };
    }
};
