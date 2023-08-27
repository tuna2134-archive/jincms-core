import requests


token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJpZCI6IjQ1NjkyMjY0IiwibmFtZSI6IlwibWNfZmRjXCIiLCJlbWFpbCI6IlwibWVAdHVuYTIxMzQuZGV2XCIiLCJleHAiOjE2OTMxOTcyMDZ9.jyD4TzuRBtS6H4XaZdY9RMJDnlZB_3MCYTU75q8bn0fQ1XjzQYzdQ4HvugdhzLnxpNooo5QIBrftx9wNkQ7kAg"

requests.post("http://localhost:8080/organizations", json={
    "name": "Test Organization",
    "id": "test"
})