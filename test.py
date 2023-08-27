import requests


token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJpZCI6IjQ1NjkyMjY0IiwibmFtZSI6IlwibWNfZmRjXCIiLCJlbWFpbCI6IlwibWVAdHVuYTIxMzQuZGV2XCIiLCJleHAiOjE2OTMxOTcyMDZ9.jyD4TzuRBtS6H4XaZdY9RMJDnlZB_3MCYTU75q8bn0fQ1XjzQYzdQ4HvugdhzLnxpNooo5QIBrftx9wNkQ7kAg"

"""
r = requests.post("http://localhost:8080/organizations", json={
    "name": "Test Organization",
    "id": "test2",
    "users": ["45692264"]
}, headers={
    "Authorization": f"Bearer {token}"
})
"""
r = requests.post("http://localhost:8080/organizations/test/articles", headers={
    "Authorization": f"Bearer {token}"
}, json={
    "title": "Test Article",
    "slug": "test-article2",
    "body": "This is a test article",
    "description": "This is a test article"
})

print(r.status_code)