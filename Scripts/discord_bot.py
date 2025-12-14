"""
Bot Discord - Bible Chantée
Notifications automatiques et commandes communautaires
"""
import discord
from discord.ext import commands, tasks
import json
import asyncio
from pathlib import Path
from datetime import datetime
import os

# Configuration
DISCORD_TOKEN = os.getenv("DISCORD_BOT_TOKEN", "YOUR_BOT_TOKEN_HERE")
SUNO_OUTPUT_DIR = Path("G:/Mon Drive/01 BibleChantee/Suno_Output/FR")

# Configuration bot
intents = discord.Intents.default()
intents.message_content = True
intents.members = True

bot = commands.Bot(command_prefix='!bible ', intents=intents)

# État global
bot_state = {
    'last_chapter_count': 0,
    'notification_channel': None,
    'stats_channel': None
}

BOOK_NAMES = {
    "01_GEN": "Genèse", "02_EXO": "Exode", "03_LEV": "Lévitique", "04_NUM": "Nombres",
    "05_DEU": "Deutéronome", "06_JOS": "Josué", "07_JDG": "Juges", "08_RUT": "Ruth",
    "09_1SAM": "1 Samuel", "10_2SAM": "2 Samuel", "11_1KI": "1 Rois", "12_2KI": "2 Rois",
    "13_1CH": "1 Chroniques", "14_2CH": "2 Chroniques", "15_EZR": "Esdras",
    "16_NEH": "Néhémie", "17_EST": "Esther", "18_JOB": "Job", "19_PSA": "Psaumes",
    "20_PRO": "Proverbes", "21_ECC": "Ecclésiaste", "22_SON": "Cantique",
    "23_ISA": "Ésaïe", "24_JER": "Jérémie", "25_LAM": "Lamentations",
    "26_EZE": "Ézéchiel", "27_DAN": "Daniel", "28_HOS": "Osée", "29_JOE": "Joël",
    "30_AMO": "Amos", "31_OBA": "Abdias", "32_JON": "Jonas", "33_MIC": "Michée",
    "34_NAH": "Nahum", "35_HAB": "Habacuc", "36_ZEP": "Sophonie", "37_HAG": "Aggée",
    "38_ZEC": "Zacharie", "39_MAL": "Malachie", "40_MAT": "Matthieu", "41_MAR": "Marc",
    "42_LUK": "Luc", "43_JOH": "Jean", "44_ACT": "Actes", "45_ROM": "Romains",
    "46_1CO": "1 Corinthiens", "47_2CO": "2 Corinthiens", "48_GAL": "Galates",
    "49_EPH": "Éphésiens", "50_PHP": "Philippiens", "51_COL": "Colossiens",
    "52_1TH": "1 Thessaloniciens", "53_2TH": "2 Thessaloniciens",
    "54_1TI": "1 Timothée", "55_2TI": "2 Timothée", "56_TIT": "Tite",
    "57_PHM": "Philémon", "58_HEB": "Hébreux", "59_JAS": "Jacques",
    "60_1PE": "1 Pierre", "61_2PE": "2 Pierre", "62_1JO": "1 Jean",
    "63_2JO": "2 Jean", "64_3JO": "3 Jean", "65_JUD": "Jude", "66_REV": "Apocalypse"
}


def count_chapters():
    """Compte le nombre total de chapitres générés"""
    total = 0
    for book_code in BOOK_NAMES.keys():
        book_dir = SUNO_OUTPUT_DIR / book_code
        if book_dir.exists():
            mp3_files = list(book_dir.glob(f"{book_code}_*.mp3"))
            total += len(mp3_files)
    return total


def get_book_progress(book_code):
    """Obtient la progression d'un livre"""
    chapter_counts = {
        "01_GEN": 50, "19_PSA": 150, "40_MAT": 28, "43_JOH": 21,
        # ... (liste complète)
    }

    book_dir = SUNO_OUTPUT_DIR / book_code
    if not book_dir.exists():
        return 0, chapter_counts.get(book_code, 1)

    mp3_files = list(book_dir.glob(f"{book_code}_*.mp3"))
    return len(mp3_files), chapter_counts.get(book_code, 1)


@bot.event
async def on_ready():
    """Événement au démarrage du bot"""
    print(f'✅ Bot connecté en tant que {bot.user}')
    print(f'📊 ID: {bot.user.id}')
    print('-' * 50)

    # Démarrer les tâches en arrière-plan
    check_new_chapters.start()
    daily_stats.start()


@bot.command(name='stats')
async def stats(ctx):
    """Affiche les statistiques de génération"""
    total = count_chapters()
    progress = (total / 1189) * 100

    embed = discord.Embed(
        title="📊 Statistiques Bible Chantée",
        description=f"Progression actuelle de la génération",
        color=discord.Color.blue(),
        timestamp=datetime.now()
    )

    embed.add_field(
        name="Chapitres générés",
        value=f"**{total}** / 1,189",
        inline=True
    )

    embed.add_field(
        name="Progression",
        value=f"**{progress:.1f}%**",
        inline=True
    )

    embed.add_field(
        name="Restants",
        value=f"**{1189 - total}**",
        inline=True
    )

    # Barre de progression
    bar_length = 20
    filled = int(bar_length * (total / 1189))
    bar = '█' * filled + '░' * (bar_length - filled)

    embed.add_field(
        name="Progression visuelle",
        value=f"`{bar}` {progress:.1f}%",
        inline=False
    )

    embed.set_footer(text="Bible Chantée • biblechantee.netlify.app")

    await ctx.send(embed=embed)


@bot.command(name='livre')
async def livre(ctx, code: str = None):
    """Affiche les stats d'un livre spécifique"""
    if not code:
        await ctx.send("❌ Usage: `!bible livre <CODE>`\nExemple: `!bible livre 19_PSA`")
        return

    code = code.upper()

    if code not in BOOK_NAMES:
        await ctx.send(f"❌ Livre introuvable: `{code}`\nUtilisez `!bible livres` pour voir la liste")
        return

    current, expected = get_book_progress(code)
    progress = (current / expected) * 100 if expected > 0 else 0

    embed = discord.Embed(
        title=f"📖 {BOOK_NAMES[code]}",
        description=f"Code: `{code}`",
        color=discord.Color.green() if current == expected else discord.Color.orange(),
        timestamp=datetime.now()
    )

    embed.add_field(
        name="Chapitres générés",
        value=f"**{current}** / {expected}",
        inline=True
    )

    embed.add_field(
        name="Progression",
        value=f"**{progress:.1f}%**",
        inline=True
    )

    status = "✅ Complet" if current == expected else "⏳ En cours" if current > 0 else "❌ Pas commencé"

    embed.add_field(
        name="Statut",
        value=status,
        inline=True
    )

    # Barre de progression
    bar_length = 20
    filled = int(bar_length * (current / expected)) if expected > 0 else 0
    bar = '█' * filled + '░' * (bar_length - filled)

    embed.add_field(
        name="Progression visuelle",
        value=f"`{bar}` {progress:.1f}%",
        inline=False
    )

    embed.set_footer(text="Bible Chantée")

    await ctx.send(embed=embed)


@bot.command(name='livres')
async def livres(ctx):
    """Liste tous les livres"""
    embed = discord.Embed(
        title="📚 Liste des 66 livres",
        description="Utilisez `!bible livre <CODE>` pour voir les détails",
        color=discord.Color.gold()
    )

    # Ancien Testament
    at_list = []
    for i, (code, name) in enumerate(list(BOOK_NAMES.items())[:39], 1):
        at_list.append(f"`{code}` {name}")

    embed.add_field(
        name="Ancien Testament (39 livres)",
        value="\n".join(at_list[:20]),  # Premier batch
        inline=False
    )

    if len(at_list) > 20:
        embed.add_field(
            name="\u200b",  # Invisible field name
            value="\n".join(at_list[20:]),
            inline=False
        )

    # Nouveau Testament
    nt_list = []
    for code, name in list(BOOK_NAMES.items())[39:]:
        nt_list.append(f"`{code}` {name}")

    embed.add_field(
        name="Nouveau Testament (27 livres)",
        value="\n".join(nt_list),
        inline=False
    )

    await ctx.send(embed=embed)


@bot.command(name='top')
async def top(ctx, count: int = 10):
    """Affiche les top livres par progression"""
    book_stats = []

    for code, name in BOOK_NAMES.items():
        current, expected = get_book_progress(code)
        if expected > 0:
            progress = (current / expected) * 100
            book_stats.append((code, name, current, expected, progress))

    # Trier par progression
    book_stats.sort(key=lambda x: x[4], reverse=True)

    embed = discord.Embed(
        title=f"🏆 Top {count} livres les plus avancés",
        color=discord.Color.gold(),
        timestamp=datetime.now()
    )

    for i, (code, name, current, expected, progress) in enumerate(book_stats[:count], 1):
        status = "✅" if current == expected else "⏳"
        embed.add_field(
            name=f"{i}. {status} {name}",
            value=f"`{code}` • {current}/{expected} ({progress:.1f}%)",
            inline=False
        )

    await ctx.send(embed=embed)


@bot.command(name='verset')
async def verset(ctx):
    """Affiche le verset du jour"""
    # Versets inspirants
    versets = [
        ("Psaume 23:1", "L'Éternel est mon berger: je ne manquerai de rien."),
        ("Jean 3:16", "Car Dieu a tant aimé le monde qu'il a donné son Fils unique."),
        ("Romains 8:28", "Toutes choses concourent au bien de ceux qui aiment Dieu."),
        ("Philippiens 4:13", "Je puis tout par celui qui me fortifie."),
        ("Matthieu 5:14", "Vous êtes la lumière du monde."),
    ]

    import random
    ref, text = random.choice(versets)

    embed = discord.Embed(
        title="📖 Verset du jour",
        description=f"*\"{text}\"*",
        color=discord.Color.purple(),
        timestamp=datetime.now()
    )

    embed.set_footer(text=ref)

    await ctx.send(embed=embed)


@bot.command(name='aide')
async def aide(ctx):
    """Affiche l'aide"""
    embed = discord.Embed(
        title="🤖 Commandes du Bot Bible Chantée",
        description="Préfixe: `!bible`",
        color=discord.Color.blue()
    )

    commands_list = [
        ("stats", "Affiche les statistiques globales"),
        ("livre <CODE>", "Stats d'un livre spécifique (ex: !bible livre 19_PSA)"),
        ("livres", "Liste tous les 66 livres"),
        ("top [N]", "Top N livres les plus avancés (défaut: 10)"),
        ("verset", "Affiche un verset inspirant aléatoire"),
        ("ping", "Test de latence du bot"),
        ("aide", "Affiche cette aide")
    ]

    for cmd, desc in commands_list:
        embed.add_field(
            name=f"`!bible {cmd}`",
            value=desc,
            inline=False
        )

    embed.set_footer(text="Bible Chantée • https://biblechantee.netlify.app")

    await ctx.send(embed=embed)


@bot.command(name='ping')
async def ping(ctx):
    """Test la latence du bot"""
    latency = round(bot.latency * 1000)
    await ctx.send(f"🏓 Pong! Latence: **{latency}ms**")


@tasks.loop(minutes=15)
async def check_new_chapters():
    """Vérifie les nouveaux chapitres toutes les 15 minutes"""
    if not bot_state['notification_channel']:
        return

    current_count = count_chapters()

    if current_count > bot_state['last_chapter_count']:
        new_chapters = current_count - bot_state['last_chapter_count']

        embed = discord.Embed(
            title="🎵 Nouveaux chapitres disponibles!",
            description=f"**{new_chapters}** nouveau(x) chapitre(s) généré(s)!",
            color=discord.Color.green(),
            timestamp=datetime.now()
        )

        embed.add_field(
            name="Total actuel",
            value=f"{current_count} / 1,189",
            inline=True
        )

        progress = (current_count / 1189) * 100
        embed.add_field(
            name="Progression",
            value=f"{progress:.1f}%",
            inline=True
        )

        embed.set_footer(text="Bible Chantée")

        channel = bot.get_channel(bot_state['notification_channel'])
        if channel:
            await channel.send(embed=embed)

        bot_state['last_chapter_count'] = current_count


@tasks.loop(hours=24)
async def daily_stats():
    """Envoie les stats quotidiennes"""
    if not bot_state['stats_channel']:
        return

    total = count_chapters()
    progress = (total / 1189) * 100

    embed = discord.Embed(
        title="📊 Rapport quotidien",
        description="Statistiques de génération Bible Chantée",
        color=discord.Color.blue(),
        timestamp=datetime.now()
    )

    embed.add_field(
        name="Chapitres générés",
        value=f"**{total}** / 1,189 ({progress:.1f}%)",
        inline=False
    )

    # Compter livres complets
    complete_books = 0
    for code in BOOK_NAMES.keys():
        current, expected = get_book_progress(code)
        if current == expected:
            complete_books += 1

    embed.add_field(
        name="Livres complets",
        value=f"**{complete_books}** / 66",
        inline=True
    )

    embed.add_field(
        name="Restants",
        value=f"**{1189 - total}** chapitres",
        inline=True
    )

    embed.set_footer(text="Bible Chantée • Rapport automatique quotidien")

    channel = bot.get_channel(bot_state['stats_channel'])
    if channel:
        await channel.send(embed=embed)


@bot.command(name='setchannel')
@commands.has_permissions(administrator=True)
async def setchannel(ctx, channel_type: str):
    """Configure les canaux de notification (admin only)"""
    if channel_type == "notif":
        bot_state['notification_channel'] = ctx.channel.id
        await ctx.send(f"✅ Canal de notifications configuré: {ctx.channel.mention}")
    elif channel_type == "stats":
        bot_state['stats_channel'] = ctx.channel.id
        await ctx.send(f"✅ Canal de stats configuré: {ctx.channel.mention}")
    else:
        await ctx.send("❌ Type invalide. Utilisez: `notif` ou `stats`")


# Gestion d'erreurs
@bot.event
async def on_command_error(ctx, error):
    if isinstance(error, commands.MissingRequiredArgument):
        await ctx.send(f"❌ Argument manquant. Utilisez `!bible aide` pour voir l'aide.")
    elif isinstance(error, commands.MissingPermissions):
        await ctx.send("❌ Vous n'avez pas la permission d'utiliser cette commande.")
    else:
        print(f"Erreur: {error}")


def main():
    """Lance le bot"""
    print("="*80)
    print("  🤖 BOT DISCORD - BIBLE CHANTÉE")
    print("="*80)
    print()

    if DISCORD_TOKEN == "YOUR_BOT_TOKEN_HERE":
        print("❌ ERREUR: Token Discord non configuré!")
        print()
        print("CONFIGURATION:")
        print("1. Créer une application sur: https://discord.com/developers/applications")
        print("2. Créer un bot dans l'onglet 'Bot'")
        print("3. Copier le token")
        print("4. Configurer la variable d'environnement:")
        print("   set DISCORD_BOT_TOKEN=votre_token")
        print()
        print("OU modifier directement le script:")
        print("   DISCORD_TOKEN = 'votre_token'")
        print()
        return

    # Initialiser le compteur
    bot_state['last_chapter_count'] = count_chapters()

    print(f"Chapitres actuels: {bot_state['last_chapter_count']}")
    print()
    print("Démarrage du bot...")
    print()

    try:
        bot.run(DISCORD_TOKEN)
    except discord.LoginFailure:
        print("❌ ERREUR: Token invalide!")
    except Exception as e:
        print(f"❌ ERREUR: {e}")


if __name__ == "__main__":
    main()
