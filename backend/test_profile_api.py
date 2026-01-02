import urllib.request
import urllib.parse
import json
import ssl

def run_test():
    base_url = "http://localhost:8000"
    
    # 1. Login
    print("1. Logging in...")
    login_data = urllib.parse.urlencode({
        "username": "student",
        "password": "password"
    }).encode()
    
    req = urllib.request.Request(f"{base_url}/api/auth/login", data=login_data, method="POST")
    req.add_header("Content-Type", "application/x-www-form-urlencoded")
    
    try:
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode())
            token = data["access_token"]
            print(f"Login successful. Token: {token[:10]}...")
    except Exception as e:
        print(f"Login failed: {e}")
        return

    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}

    # 2. Get Profile (Check structure)
    print("\n2. Fetching Profile...")
    req = urllib.request.Request(f"{base_url}/api/users/me", headers=headers, method="GET")
    try:
        with urllib.request.urlopen(req) as response:
            profile = json.loads(response.read().decode())
            print(f"Current Profile: Bio='{profile.get('bio')}', Avatar='{profile.get('avatar_style')}'")
    except Exception as e:
        print(f"Get Profile failed: {e}")
        return

    # 3. Update Profile
    print("\n3. Updating Profile...")
    new_data = json.dumps({
        "bio": "Verified via Python Script",
        "avatar_style": "bottts"
    }).encode()
    
    req = urllib.request.Request(f"{base_url}/api/users/me", data=new_data, headers=headers, method="PUT")
    try:
        with urllib.request.urlopen(req) as response:
            updated = json.loads(response.read().decode())
            print(f"Update response: Bio='{updated.get('bio')}', Avatar='{updated.get('avatar_style')}'")
            if updated.get('bio') == "Verified via Python Script" and updated.get('avatar_style') == "bottts":
                print("SUCCESS: Profile updated correctly.")
            else:
                print("FAILURE: Profile update did not match expected values.")
    except Exception as e:
        print(f"Update Profile failed: {e}")

if __name__ == "__main__":
    run_test()
