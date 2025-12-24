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
                        // Récupérer TOUTES les submissions avec pagination
                        let allSubmissions = [];
                        let page = 1;
                        let hasMore = true;

                        while (hasMore) {
                            const submissionsResponse = await fetch(
                                `https://api.netlify.com/api/v1/forms/${subscribeForm.id}/submissions?per_page=100&page=${page}`,
                                {
                                    headers: {
                                        'Authorization': `Bearer ${netlifyToken}`,
                                        'Content-Type': 'application/json'
                                    }
                                }
                            );

                            if (submissionsResponse.ok) {
                                const submissions = await submissionsResponse.json();
                                allSubmissions = allSubmissions.concat(submissions);

                                // Si moins de 100 résultats, c'est la dernière page
                                hasMore = submissions.length === 100;
                                page++;
                            } else {
                                hasMore = false;
                            }
                        }

                        signups_total = allSubmissions.length;
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

            // Événements TOTAL historique (depuis le lancement)
            const [eventsResponse] = await client.runReport({
                property: `properties/${propertyId}`,
                dateRanges: [{ startDate: '2024-01-01', endDate: 'today' }],
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
