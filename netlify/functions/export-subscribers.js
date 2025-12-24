/**
 * Netlify Function temporaire pour exporter tous les inscrits
 * Cette fonction a accès aux variables d'environnement Netlify
 */

exports.handler = async (event) => {
    try {
        // Récupérer les credentials depuis les variables d'environnement Netlify
        const netlifyToken = process.env.NETLIFY_ACCESS_TOKEN;
        const siteId = process.env.NETLIFY_SITE_ID;

        if (!netlifyToken || !siteId) {
            return {
                statusCode: 500,
                body: JSON.stringify({
                    error: 'Variables d\'environnement manquantes',
                    netlifyToken: netlifyToken ? 'OK' : 'MISSING',
                    siteId: siteId ? 'OK' : 'MISSING'
                })
            };
        }

        // 1. Récupérer les formulaires
        const formsResponse = await fetch(
            `https://api.netlify.com/api/v1/sites/${siteId}/forms`,
            {
                headers: {
                    'Authorization': `Bearer ${netlifyToken}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        if (!formsResponse.ok) {
            throw new Error(`Forms API error: ${formsResponse.status}`);
        }

        const forms = await formsResponse.json();
        const subscribeForm = forms.find(f => f.name === 'subscribe');

        if (!subscribeForm) {
            return {
                statusCode: 404,
                body: JSON.stringify({
                    error: 'Formulaire "subscribe" non trouvé',
                    availableForms: forms.map(f => f.name)
                })
            };
        }

        // 2. Récupérer TOUTES les submissions avec pagination
        const formId = subscribeForm.id;
        let allSubmissions = [];
        let page = 1;
        let hasMore = true;

        while (hasMore) {
            const submissionsResponse = await fetch(
                `https://api.netlify.com/api/v1/forms/${formId}/submissions?per_page=100&page=${page}`,
                {
                    headers: {
                        'Authorization': `Bearer ${netlifyToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (!submissionsResponse.ok) {
                throw new Error(`Submissions API error: ${submissionsResponse.status}`);
            }

            const submissions = await submissionsResponse.json();
            allSubmissions = allSubmissions.concat(submissions);

            // Si moins de 100 résultats, c'est la dernière page
            hasMore = submissions.length === 100;
            page++;
        }

        // 3. Extraire et dédupliquer les emails
        const subscribers = allSubmissions.map(sub => ({
            email: sub.data.email,
            language: sub.data.language || 'fr',
            created_at: sub.created_at,
            id: sub.id
        }));

        // Dédupliquer par email (garder le plus récent)
        const uniqueSubscribers = Object.values(
            subscribers.reduce((acc, sub) => {
                if (!acc[sub.email] || new Date(sub.created_at) > new Date(acc[sub.email].created_at)) {
                    acc[sub.email] = sub;
                }
                return acc;
            }, {})
        );

        // 4. Retourner les résultats
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                success: true,
                total: uniqueSubscribers.length,
                totalSubmissions: allSubmissions.length,
                formName: subscribeForm.name,
                formId: formId,
                subscribers: uniqueSubscribers,
                summary: {
                    total: uniqueSubscribers.length,
                    byLanguage: uniqueSubscribers.reduce((acc, sub) => {
                        acc[sub.language] = (acc[sub.language] || 0) + 1;
                        return acc;
                    }, {})
                }
            }, null, 2)
        };

    } catch (error) {
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                error: error.message,
                stack: error.stack
            })
        };
    }
};
