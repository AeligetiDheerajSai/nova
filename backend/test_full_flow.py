import requests
import json
import time

BASE_URL = "http://localhost:8000"

def log(msg, success=True):
    icon = "✅" if success else "❌"
    print(f"{icon} {msg}")

def test_full_flow():
    print("\n--- Starting Full Project Verification ---\n")
    
    # 1. Dashboard Data
    try:
        res = requests.get(f"{BASE_URL}/api/dashboard")
        if res.status_code == 200:
            data = res.json()
            if "courses" in data and "user" in data:
                log(f"Dashboard loaded. User: {data['user']['name']}, Courses: {len(data['courses'])}")
            else:
                log("Dashboard response missing keys", False)
        else:
            log(f"Dashboard failed: {res.status_code}", False)
    except Exception as e:
        log(f"Dashboard error: {e}", False)

    # 2. Academic Structure & Filtering
    try:
        res = requests.get(f"{BASE_URL}/api/courses/meta/branches")
        branches = res.json()
        log(f"Fetched {len(branches)} academic branches")
        
        # Filter courses by first branch
        if branches:
            branch_id = branches[0]['id']
            res = requests.get(f"{BASE_URL}/api/courses?branch_id={branch_id}")
            courses = res.json()
            log(f"Filtered courses for branch {branches[0]['code']}: {len(courses)} found")
    except Exception as e:
        log(f"Academic structure error: {e}", False)

    # 3. Chat / Floating AI
    try:
        payload = {"message": "I need help with my resume"}
        res = requests.post(f"{BASE_URL}/api/chat", json=payload)
        if res.status_code == 200:
            resp = res.json()
            log(f"Chat AI responded: '{resp['response'][:50]}...'")
        else:
            log(f"Chat failed: {res.status_code}", False)
    except Exception as e:
        log(f"Chat error: {e}", False)

    # 4. Resume Parser & Job Recommendations
    try:
        # Create a dummy file
        files = {'file': ('resume.txt', 'Experienced Python Developer with Security skills')}
        res = requests.post(f"{BASE_URL}/api/resume/analyze", files=files)
        if res.status_code == 200:
            data = res.json()
            log(f"Resume Analyzed. Role: {data['match_role']}, Score: {data['score']}")
            
            # Check for jobs
            if "recommended_jobs" in data and len(data['recommended_jobs']) > 0:
                job = data['recommended_jobs'][0]
                log(f"Job Recommendation found: {job['title']} at {job['company']}")
            else:
                log("No job recommendations returned", False)
        else:
            log(f"Resume analysis failed: {res.status_code}", False)
    except Exception as e:
        log(f"Resume error: {e}", False)

    # 5. Enrollment & My Learning
    try:
        # Get course to enroll
        courses = requests.get(f"{BASE_URL}/api/courses").json()
        if courses:
            course_id = courses[0]['id']
            
            # Enroll
            res = requests.post(f"{BASE_URL}/api/courses/{course_id}/enroll")
            log(f"Enrolled in course {course_id}: {res.json()['message']}")
            
            # Check My Learning
            res = requests.get(f"{BASE_URL}/api/users/me/courses")
            my_courses = res.json()
            enrolled_ids = [c['id'] for c in my_courses]
            
            if course_id in enrolled_ids:
                log(f"Verified course {course_id} is in 'My Learning'")
            else:
                log(f"Course {course_id} NOT found in 'My Learning'", False)
            
    except Exception as e:
        log(f"Enrollment error: {e}", False)

    print("\n--- Verification Complete ---")

if __name__ == "__main__":
    test_full_flow()
