import os
import requests
import json

MAILERLITE_TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI0IiwianRpIjoiZjkyOTU2NGRjMzIxNTY4YzJhMzYyMjBkZmJhNjdmNDE5MjkxZWI2MmU3NjU0Y2Y2YjYwOTUyOGRhY2Q0ZjI4ZTM4NzYwYzc5ZDkxYzEyZTgiLCJpYXQiOjE3NzMzMzI5NDIuMjA4OTQzLCJuYmYiOjE3NzMzMzI5NDIuMjA4OTQ2LCJleHAiOjQ5MjkwMDY1NDIuMjAzOTYzLCJzdWIiOiIyMTU5NzYyIiwic2NvcGVzIjpbXX0.XyJxuEDJTIUI6zLiRPOVrSlguYFm4S4Bnwl2xqmMuxp9sjO6EezayOM4WTiM2F0cxoLrULdL5Jf1xfUvpAxaPcswnWd_Dze3LAuKe4sjPs0iTpa22BSsz6ZM4HRFroM6_8ShehjVROMIqoASYSqBDDDVnY57ATTDGYkwekJQRm8Vedc1GDEvHrbzkvU_SHPaGWoEGCniwlRB73LSH2Zkr-3Eg0lZ0-pOCnrpkATRxP0519PvxE-Mil-SCLY8Wz4rtdUhJCa44ALDmTDoThNP8mlyKwjnlYyixjmZqIKTNeVXudkjoKOaDoBhzfcjyVSUfDZ69hotzFJxTKcNBJpr8CvnDvUqlhZgYkWiCkjIyD5jHA2arKyURYcGrWLDVWheGhtPtIptmKSAqOfe3x63cPgQ8wLiyYQ37iAOAGO4_gUAyem1NS2SVXM-hOLap5AGpuhOCFadyc9UN4zNiqHvajqtqTvKWEiKZJmUhcqeiyg69hyWqD9BS6QeO5M4RCi5OG9EnxHiQklF0fkrGL1lxOLDoi8y-gGPry7I6MJcqTyGKfuOJT75sKtizJYyUApuQmNmQT5fTVVzmxg555KJec2eUTPzVcrqVLDgMcb97pL4BxHuWlkKoO6tj7rtgnp2eCfxy6CXZCcqMDe1NnODowWeKo9ow5emt6LGcgNJN4M"

def get_groups():
    url = "https://connect.mailerlite.com/api/groups"
    headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": f"Bearer {MAILERLITE_TOKEN}"
    }

    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        data = response.json()
        print(f"Buscando 'Clientes Web' en grupos MailerLite:")
        for group in data.get("data", []):
            print(f"- {group['name']} (ID: {group['id']})")
            if "clientes web" in group["name"].lower():
                print(f"!!! ENCONTRADO: Grupo 'Clientes Web' tiene el ID {group['id']}")
                return group['id']
                
        print("No se encontró un grupo llamado EXACTAMENTE 'Clientes Web'.")
        
    except Exception as e:
        print(f"Error fetching groups: {e}")

if __name__ == "__main__":
    get_groups()
