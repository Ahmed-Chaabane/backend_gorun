import sys
import traceback
import torch
import requests
from transformers import AutoModelForCausalLM, AutoTokenizer, pipeline

# Configuration
MODEL_NAME = "mistralai/Mistral-7B-Instruct-v0.3"
BACKEND_URL = "http://localhost:3000/api/recommandationentrainement"  # URL pour envoyer la recommandation
USER_API_URL = "http://localhost:3000/api/utilisateur/firebase_uid"  # URL pour récupérer les données utilisateur

try:
    # Charger le modèle et le tokenizer
    tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
    tokenizer.pad_token = tokenizer.eos_token  # Définir le pad_token pour éviter les avertissements
    model = AutoModelForCausalLM.from_pretrained(MODEL_NAME, torch_dtype=torch.float16, device_map="auto")

    # Pipeline de génération
    generator = pipeline("text-generation", model=model, tokenizer=tokenizer)

    def fetch_user_data(firebase_uid):
        """Récupère les données utilisateur depuis l'API backend."""
        try:
            # Construire l'URL complète avec l'UID Firebase
            url = f"{USER_API_URL}/{firebase_uid}"
            print(f"URL de l'API : {url}")  # Afficher l'URL pour le débogage

            # Faire la requête GET
            response = requests.get(url)
            print(f"Réponse de l'API : {response.status_code}, {response.text}")  # Afficher la réponse complète

            # Vérifier si la requête a réussi
            if response.status_code == 200:
                return response.json()  # Retourne les données utilisateur
            else:
                print(f"❌ Erreur lors de la récupération des données utilisateur : {response.status_code}")
                return None
        except Exception as e:
            print(f"❌ Erreur lors de l'appel à l'API : {str(e)}")
            traceback.print_exc()
            return None

    def generate_recommendation(user_data):
        """Génère une recommandation d'entraînement basée sur les données utilisateur."""
        try:
            # Remplacer les valeurs null par des valeurs par défaut
            user_data = {key: (value if value is not None else "Non spécifié") for key, value in user_data.items()}

            # Gérer les listes vides
            selected_sports = ', '.join(user_data['selectedSports']) if user_data['selectedSports'] else 'Non spécifié'
            preferences_sportives = ', '.join(user_data['preferences_sportives']) if user_data['preferences_sportives'] else 'Non spécifié'
            lieux_pratique = ', '.join(user_data['lieux_pratique']) if user_data['lieux_pratique'] else 'Non spécifié'
            health_conditions = ', '.join(user_data['health_conditions']) if user_data['health_conditions'] else 'Aucune'
            objectifs_amelioration = ', '.join(user_data['objectifs_amelioration']) if user_data['objectifs_amelioration'] else 'Général'

            # Construire le prompt
            prompt = f"""
            L'utilisateur ({user_data['firebase_uid']}) a {user_data['age']} ans, mesure {user_data['taille']} cm et pèse {user_data['poids']} kg.
            Date de naissance : {user_data['date_naissance']}.

            🔹 **Sports sélectionnés** : {selected_sports}.
            🔹 **Préférences sportives** : {preferences_sportives}.
            🔹 **Lieux de pratique** : {lieux_pratique}.
            🔹 **Fréquence d'entraînement** : {user_data['frequence_entrainement']} jours par semaine.
            🔹 **Conditions de santé** : {health_conditions}.
            🔹 **Régime alimentaire** : {user_data['regime_alimentaire']}.
            🔹 **Objectifs d'amélioration** : {objectifs_amelioration}.

            **Génère un programme d'entraînement détaillé avec niveau de difficulté, fréquence, durée, jours de pratique, instructions et exercices.**
            """

            print(f"Prompt envoyé : {prompt}")

            # Génération de la recommandation
            result = generator(prompt, max_length=500, num_return_sequences=1, truncation=True)
            generated_text = result[0]['generated_text']
            print("Réponse générée : ", generated_text)

            # Construire les valeurs pour la base de données
            recommendation_data = {
                "id_utilisateur": int(user_data['id_utilisateur']),
                "firebase_uid": user_data['firebase_uid'],
                "id_objectif_sportif": 51,  # Toujours 51 pour le moment
                "niveau_difficulte": "Medium",  # À améliorer avec une analyse IA plus poussée
                "duree_seance": 60,  # Exemple : 60 minutes par séance
                "frequence": user_data['frequence_entrainement'],
                "jours": ["Lundi", "Mercredi", "Vendredi"],  # Exemple de jours
                "instructions": "Échauffement, exercices ciblés et récupération.",
                "exercices": [
                    {"nom": "Pompes", "duree": "10 minutes", "repetitions": "3 séries de 12"},
                    {"nom": "Squats", "duree": "10 minutes", "repetitions": "3 séries de 15"},
                    {"nom": "Course à pied", "duree": "20 minutes", "repetitions": "Continu"}
                ],
                "description": f"Programme personnalisé pour {user_data['age']} ans, adapté aux objectifs de santé."
            }

            return recommendation_data
        except Exception as e:
            print(f"Erreur dans generate_recommendation : {str(e)}")
            traceback.print_exc()
            return {"error": str(e)}

    def send_recommendation_to_backend(recommendation_data):
        """Envoie la recommandation au backend."""
        try:
            print("Données envoyées au backend :", recommendation_data)
            response = requests.post(BACKEND_URL, json=recommendation_data)
            response_data = response.json()

            if response.status_code == 201:
                print("✅ Recommandation insérée avec succès :", response_data)
            else:
                print(f"❌ Erreur lors de l'insertion : {response.status_code}, {response_data}")
        except Exception as e:
            print(f"❌ Erreur lors de l'envoi de la recommandation : {str(e)}")
            traceback.print_exc()

    if __name__ == "__main__":
        try:
            if len(sys.argv) < 2:
                raise ValueError("L'UID Firebase doit être passé en argument.")

            firebase_uid = sys.argv[1]
            user_data = fetch_user_data(firebase_uid)

            if user_data:
                print(f"Données utilisateur : {user_data}")

                # Vérifier les champs obligatoires
                required_fields = [
                    'id_utilisateur', 'firebase_uid', 'age', 'taille', 'poids', 'selectedSports',
                    'preferences_sportives', 'lieux_pratique', 'frequence_entrainement', 'health_conditions',
                    'regime_alimentaire', 'objectifs_amelioration'
                ]

                missing_fields = [field for field in required_fields if field not in user_data]
                if missing_fields:
                    print(f"⚠️ Champs manquants dans les données utilisateur : {', '.join(missing_fields)}")

                # Générer la recommandation
                recommendation = generate_recommendation(user_data)

                if "error" not in recommendation:
                    send_recommendation_to_backend(recommendation)
                else:
                    print("❌ Erreur dans la recommandation :", recommendation["error"])
            else:
                print("❌ Aucune donnée utilisateur trouvée.")

        except ValueError as e:
            print(f"❌ Erreur de validation : {str(e)}")
            traceback.print_exc()
            sys.exit(1)

        except Exception as e:
            print(f"❌ Erreur principale : {str(e)}")
            traceback.print_exc()
            sys.exit(1)

except Exception as e:
    print(f"❌ Erreur lors du chargement du modèle : {str(e)}")
    traceback.print_exc()
    sys.exit(1)