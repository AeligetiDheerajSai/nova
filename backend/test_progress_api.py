import urllib.request
import urllib.parse
import json

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
            print(f"Login successful.")
    except Exception as e:
        print(f"Login failed: {e}")
        return

    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}

    # 2. Update Progress (Simulate completing a quiz)
    print("\n2. Updating Progress (Lesson ID: 1, Score: 100)...")
    progress_data = json.dumps({
        "lesson_id": 1,
        "completed": True,
        "score": 100
    }).encode()
    
    req = urllib.request.Request(f"{base_url}/api/users/progress", data=progress_data, headers=headers, method="POST")
    try:
        with urllib.request.urlopen(req) as response:
            res_data = json.loads(response.read().decode())
            print(f"Progress Updated: Completed={res_data.get('completed')}, Score={res_data.get('score')}")
    except Exception as e:
        print(f"Update Progress failed: {e}")
        return

    # 3. Get Course Progress (Course ID: 1)
    print("\n3. Fetching Course Progress...")
    req = urllib.request.Request(f"{base_url}/api/users/progress/1", headers=headers, method="GET")
    try:
        with urllib.request.urlopen(req) as response:
            progress_list = json.loads(response.read().decode())
            print(f"Progress entries found: {len(progress_list)}")
            found = any(p['lesson_id'] == 1 and p['score'] == 100 for p in progress_list)
            if found:
                print("SUCCESS: Progress verified.")
            else:
                print("FAILURE: Progress not found.")
    except Exception as e:
        print(f"Get Progress failed: {e}")

if __name__ == "__main__":
    run_test()
