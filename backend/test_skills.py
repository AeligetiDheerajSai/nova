import urllib.request
import json

def test_skills():
    try:
        with urllib.request.urlopen("http://localhost:8000/api/skills/") as response:
            if response.status == 200:
                data = json.loads(response.read().decode())
                print("Skills Endpoint: OK")
                print(data)
            else:
                print(f"Skills Endpoint Failed: {response.status}")
    except Exception as e:
        print(f"Connection Failed: {e}")

if __name__ == "__main__":
    test_skills()
