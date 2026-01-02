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
    course_id = 1

    # 2. Check Enrollment Status (Expect False initially, or True if earlier test pass)
    print("\n2. Checking Enrollment Status...")
    req = urllib.request.Request(f"{base_url}/api/courses/{course_id}/status", headers=headers, method="GET")
    try:
        with urllib.request.urlopen(req) as response:
            res_data = json.loads(response.read().decode())
            print(f"Initially Enrolled: {res_data.get('enrolled')}")
    except Exception as e:
        print(f"Check Status failed: {e}")
        return

    # 3. Enroll in Course
    print("\n3. Enrolling in Course...")
    req = urllib.request.Request(f"{base_url}/api/courses/{course_id}/enroll", headers=headers, method="POST")
    try:
        with urllib.request.urlopen(req) as response:
            res_data = json.loads(response.read().decode())
            print(f"Enroll Response: {res_data}")
    except Exception as e:
        print(f"Enrollment failed: {e}")
        return

    # 4. Verify Enrollment
    print("\n4. Verifying Enrollment Status...")
    req = urllib.request.Request(f"{base_url}/api/courses/{course_id}/status", headers=headers, method="GET")
    try:
        with urllib.request.urlopen(req) as response:
            res_data = json.loads(response.read().decode())
            print(f"Final Enrolled Status: {res_data.get('enrolled')}")
            if res_data.get('enrolled'):
                print("SUCCESS: Enrollment verified.")
            else:
                print("FAILURE: Enrollment not confirmed.")
    except Exception as e:
        print(f"Check Status failed: {e}")

if __name__ == "__main__":
    run_test()
