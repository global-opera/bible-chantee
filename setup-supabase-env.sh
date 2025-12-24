#!/bin/bash
# Script pour configurer les variables d'environnement Supabase dans Netlify

echo "🔧 Configuration des variables Supabase dans Netlify..."
echo ""

# Variables Supabase
SUPABASE_URL="https://ozkztvstozwdkpsyhgsr.supabase.co"
SUPABASE_ANON_KEY="sb_publishable_88qslGH8ClDBemGY3zyU3w_x2J4WkjN"

# Demander la Service Role Key
echo "📝 Récupérez votre Service Role Key depuis:"
echo "   https://supabase.com/dashboard/project/ozkztvstozwdkpsyhgsr/settings/api"
echo ""
read -p "Collez votre SUPABASE_SERVICE_ROLE_KEY: " SUPABASE_SERVICE_ROLE_KEY

if [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
    echo "❌ Service Role Key requis"
    exit 1
fi

echo ""
echo "⏳ Ajout des variables dans Netlify..."

# Ajouter les variables via Netlify CLI
netlify env:set SUPABASE_URL "$SUPABASE_URL"
netlify env:set SUPABASE_ANON_KEY "$SUPABASE_ANON_KEY"
netlify env:set SUPABASE_SERVICE_ROLE_KEY "$SUPABASE_SERVICE_ROLE_KEY"

echo ""
echo "✅ Variables Supabase configurées !"
echo ""
echo "Prochaines étapes:"
echo "1. Créer la table 'users' dans Supabase"
echo "2. Importer les 13 inscrits"
echo "3. Migrer le code"
