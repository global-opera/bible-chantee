"""Test minimal de l'API Suno - Basé sur l'exemple officiel"""
import requests
import json
import sys
import io
from api_key import SUNO_API_KEY

# Configurer l'encodage UTF-8
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

def test_api_minimal():
    """Test avec l'exemple exact de la documentation"""
    print("=" * 70)
    print("  TEST MINIMAL API SUNO")
    print("=" * 70)

    if not SUNO_API_KEY:
        print("\n[ERREUR] SUNO_API_KEY non configuree")
        return

    print(f"\n[INFO] Cle API: {SUNO_API_KEY[:15]}...")

    url = "https://api.sunoapi.org/api/v1/generate"

    # Exemple exact de la documentation
    payload = {
        "customMode": True,
        "instrumental": True,
        "model": "V4_5ALL",
        "callBackUrl": "https://webhook.site/unique-endpoint",  # Requis par sunoapi.org
        "prompt": "A calm and relaxing piano track with soft melodies",
        "style": "Classical",
        "title": "Peaceful Piano Meditation",
        "styleWeight": 0.65,
        "weirdnessConstraint": 0.65,
        "audioWeight": 0.65
    }

    headers = {
        "Authorization": f"Bearer {SUNO_API_KEY}",
        "Content-Type": "application/json"
    }

    print("\n[REQUEST] Envoi de la requete...")
    print(f"URL: {url}")
    print(f"Payload: {json.dumps(payload, indent=2)}")

    try:
        response = requests.post(url, json=payload, headers=headers)

        print(f"\n[RESPONSE] Status Code: {response.status_code}")
        print(f"Response Text:\n{response.text}")

        if response.status_code == 200:
            result = response.json()
            print(f"\n[SUCCESS] Reponse parsee:")
            print(json.dumps(result, indent=2, ensure_ascii=False))

            # Extraire le taskId
            if result.get("code") == 200 and "data" in result:
                task_id = result["data"].get("taskId")
                print(f"\n[OK] Task ID: {task_id}")
                print("\nPour verifier le statut:")
                print(f"  GET https://api.sunoapi.org/api/v1/generate/record-info?taskId={task_id}")
                return task_id
            else:
                print("[ERROR] Format de reponse inattendu")
        else:
            print(f"\n[ERROR] La requete a echoue")

    except Exception as e:
        print(f"\n[EXCEPTION] {type(e).__name__}: {e}")

    return None


def test_worship_example():
    """Test avec un exemple de worship en français"""
    print("\n" + "=" * 70)
    print("  TEST WORSHIP FRANCAIS")
    print("=" * 70)

    response = input("\nVoulez-vous tester avec un exemple worship FR? (o/N): ").strip().lower()
    if response != 'o':
        return

    url = "https://api.sunoapi.org/api/v1/generate"

    payload = {
        "customMode": True,
        "instrumental": False,
        "model": "V4_5ALL",
        "callBackUrl": "https://webhook.site/unique-endpoint",  # Requis par sunoapi.org
        "prompt": """[Verse]
Dans la lumiere du matin
Je chante ton nom divin
Tu es mon guide et mon soutien

[Chorus]
Alleluia, gloire a Toi
Mon coeur t'adore, mon Roi""",
        "style": "French worship, acoustic guitar, 72 BPM, contemplative",
        "title": "Lumiere du Matin",
        "styleWeight": 0.65,
        "weirdnessConstraint": 0.65,
        "audioWeight": 0.65
    }

    headers = {
        "Authorization": f"Bearer {SUNO_API_KEY}",
        "Content-Type": "application/json"
    }

    print("\n[REQUEST] Envoi worship FR...")

    try:
        response = requests.post(url, json=payload, headers=headers)
        print(f"\n[RESPONSE] Status: {response.status_code}")
        print(response.text)

        if response.status_code == 200:
            result = response.json()
            if result.get("code") == 200 and "data" in result:
                task_id = result["data"].get("taskId")
                print(f"\n[OK] Worship FR Task ID: {task_id}")
                return task_id

    except Exception as e:
        print(f"\n[ERROR] {e}")

    return None


def check_task_status(task_id):
    """Vérifie le statut d'une tâche"""
    if not task_id:
        return

    print("\n" + "=" * 70)
    print(f"  VERIFICATION STATUT: {task_id}")
    print("=" * 70)

    url = f"https://api.sunoapi.org/api/v1/generate/record-info"
    params = {"taskId": task_id}
    headers = {"Authorization": f"Bearer {SUNO_API_KEY}"}

    try:
        response = requests.get(url, params=params, headers=headers)
        print(f"\n[STATUS] Code: {response.status_code}")
        print(response.text)

        if response.status_code == 200:
            result = response.json()
            if result.get("code") == 200 and "data" in result:
                data = result["data"]
                status = data.get("status", "unknown")
                print(f"\n[INFO] Status de generation: {status}")

                if status == "completed":
                    audio_url = data.get("audioUrl")
                    if audio_url:
                        print(f"\n[OK] Audio URL: {audio_url}")
                        print("\nPour telecharger:")
                        print(f"  wget {audio_url}")

    except Exception as e:
        print(f"\n[ERROR] {e}")


def main():
    print("\n")

    # Test 1: Exemple minimal (instrumental)
    task_id_1 = test_api_minimal()

    # Test 2: Worship français (optionnel)
    task_id_2 = test_worship_example()

    # Vérification du statut
    if task_id_1 or task_id_2:
        print("\n" + "=" * 70)
        print("  VERIFICATION DU STATUT")
        print("=" * 70)

        check = input("\nVerifier le statut maintenant? (o/N): ").strip().lower()
        if check == 'o':
            if task_id_1:
                check_task_status(task_id_1)
            if task_id_2:
                check_task_status(task_id_2)
        else:
            print("\nPour verifier plus tard:")
            if task_id_1:
                print(f"  python -c \"from test_suno_minimal import check_task_status; check_task_status('{task_id_1}')\"")
            if task_id_2:
                print(f"  python -c \"from test_suno_minimal import check_task_status; check_task_status('{task_id_2}')\"")

    print("\n" + "=" * 70)
    print("  TESTS TERMINES")
    print("=" * 70)

    input("\nAppuyez sur ENTREE pour quitter...")


if __name__ == "__main__":
    main()
