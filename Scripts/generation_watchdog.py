"""Watchdog - Surveille et relance la génération automatiquement"""
import time
import os
import json
import subprocess
from pathlib import Path
from datetime import datetime
from api_key import SUNO_API_KEY

WATCHDOG_LOG = Path("G:/Mon Drive/01 BibleChantee/Scripts/suno_watchdog.log")
CHECK_INTERVAL = 600  # 10 minutes
STALL_THRESHOLD = 1800  # 30 minutes sans nouveau fichier = bloqué

def log(message):
    """Log avec timestamp"""
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    log_msg = f"[{timestamp}] {message}"
    print(log_msg)

    # Sauvegarder dans le log
    WATCHDOG_LOG.parent.mkdir(parents=True, exist_ok=True)
    with open(WATCHDOG_LOG, 'a', encoding='utf-8') as f:
        f.write(log_msg + "\n")

def get_newest_mp3_time():
    """Retourne le timestamp du MP3 le plus récent"""
    base_dir = Path("G:/Mon Drive/01 BibleChantee/Suno_Output/FR")
    if not base_dir.exists():
        return 0

    all_mp3s = list(base_dir.glob("*/*.mp3"))
    if not all_mp3s:
        return 0

    newest = max(all_mp3s, key=lambda p: os.path.getmtime(p))
    return os.path.getmtime(newest)

def count_mp3s():
    """Compte le nombre total de MP3"""
    base_dir = Path("G:/Mon Drive/01 BibleChantee/Suno_Output/FR")
    if not base_dir.exists():
        return 0
    return len(list(base_dir.glob("*/*.mp3")))

def check_credits():
    """Vérifie les crédits Suno restants via API directe"""
    try:
        import requests
        headers = {'Authorization': f'Bearer {SUNO_API_KEY}'}
        response = requests.get('https://api.sunoapi.org/api/v1/generate/credit',
                               headers=headers, timeout=5)

        if response.status_code == 200:
            data = response.json()
            return data.get('data', None)
    except Exception as e:
        log(f"[ERROR] Impossible de verifier credits: {e}")

    return None

def is_generation_running():
    """Vérifie si un processus de génération est actif"""
    try:
        result = subprocess.run(
            ['wmic', 'process', 'where',
             "CommandLine like '%python%generate_all_66_books%'",
             'get', 'ProcessId'],
            capture_output=True,
            text=True,
            timeout=10
        )
        # Si on trouve un ProcessId (autre que le header), un process tourne
        lines = [l.strip() for l in result.stdout.split('\n') if l.strip()]
        return len(lines) > 1  # Plus que juste "ProcessId"
    except:
        return False

def kill_stalled_generation():
    """Tue les processus Python de génération bloqués"""
    try:
        log("[ACTION] Arret des processus bloques...")
        result = subprocess.run(
            ['wmic', 'process', 'where',
             "CommandLine like '%python%generate%'",
             'delete'],
            capture_output=True,
            text=True,
            timeout=30
        )
        time.sleep(5)
        log("[OK] Processus arretes")
        return True
    except Exception as e:
        log(f"[ERROR] Impossible d'arreter processus: {e}")
        return False

def restart_generation():
    """Relance la génération"""
    try:
        log("[ACTION] Relancement de la generation...")

        script_dir = Path("C:/ScriptBible/bible-chantee/Scripts")

        # Lancer en background dans une nouvelle fenêtre CMD
        cmd = [
            'cmd', '/c', 'start',
            '"Bible Chantee - Generation V5"',
            'cmd', '/k',
            f'cd /d {script_dir} && python generate_all_66_books.py'
        ]

        subprocess.Popen(cmd, shell=True)

        log("[OK] Generation relancee!")
        return True
    except Exception as e:
        log(f"[ERROR] Impossible de relancer: {e}")
        return False

def main():
    log("="*80)
    log("  WATCHDOG DEMARRÉ - Surveillance génération Bible Chantée")
    log(f"  Intervalle de vérification: {CHECK_INTERVAL}s ({CHECK_INTERVAL/60:.0f} min)")
    log(f"  Seuil de blocage: {STALL_THRESHOLD}s ({STALL_THRESHOLD/60:.0f} min)")
    log("="*80)

    last_count = count_mp3s()
    last_check_time = time.time()

    while True:
        try:
            # Attendre l'intervalle
            time.sleep(CHECK_INTERVAL)

            current_time = time.time()
            current_count = count_mp3s()
            newest_mp3_time = get_newest_mp3_time()

            # Temps depuis le dernier MP3
            time_since_last_mp3 = current_time - newest_mp3_time if newest_mp3_time > 0 else 0

            log(f"[CHECK] MP3: {current_count}/1189 | Dernier fichier: {int(time_since_last_mp3/60)}min")

            # Vérifier si la génération est bloquée
            is_running = is_generation_running()
            log(f"[STATUS] Generation active: {is_running}")

            # ALERTE: Aucun nouveau fichier depuis STALL_THRESHOLD
            if time_since_last_mp3 > STALL_THRESHOLD:
                log("[ALERTE] BLOCAGE DETECTE!")
                log(f"[INFO] Aucun fichier depuis {int(time_since_last_mp3/60)} minutes")

                # Vérifier crédits
                credits = check_credits()
                if credits is not None:
                    log(f"[CREDITS] {credits:,.0f} credits restants")

                    # Calculer combien il en faut
                    remaining_chapters = 1189 - current_count
                    credits_needed = remaining_chapters * 12

                    if credits < 100:  # Seuil critique
                        log("[ALERTE CRITIQUE] CREDITS PRESQUE EPUISES!")
                        log(f"[INFO] Besoin de {credits_needed:,.0f} credits pour terminer")
                        log("[ACTION] Arrêt du watchdog - Recharge urgente nécessaire")
                        break
                    elif credits < credits_needed:  # Insuffisant pour terminer
                        log("[ALERTE] Credits insuffisants pour terminer la Bible")
                        log(f"[INFO] Il manque {credits_needed - credits:,.0f} credits")
                    elif credits < credits_needed * 1.2:  # Marge faible
                        log("[ATTENTION] Marge de credits faible (<20%)")
                        log(f"[INFO] {credits - credits_needed:,.0f} credits de marge")

                # Si processus actif mais bloqué, le tuer
                if is_running:
                    log("[ACTION] Processus actif mais bloque - Arret force")
                    kill_stalled_generation()
                    time.sleep(10)

                # Relancer
                if restart_generation():
                    log("[OK] Generation relancee avec succes")
                    last_check_time = current_time
                else:
                    log("[ERROR] Echec du relancement")

            # Nouveau fichier créé
            elif current_count > last_count:
                nouveaux = current_count - last_count
                log(f"[PROGRESS] +{nouveaux} nouveau(x) fichier(s) - Generation OK")
                last_count = current_count

            # Aucun nouveau fichier mais pas encore bloqué
            else:
                log("[INFO] Pas de nouveau fichier, mais délai OK - Attente...")

        except KeyboardInterrupt:
            log("[STOP] Watchdog arrêté manuellement")
            break
        except Exception as e:
            log(f"[ERROR] Erreur watchdog: {e}")
            time.sleep(60)  # Attendre 1 min avant de réessayer

if __name__ == "__main__":
    main()
