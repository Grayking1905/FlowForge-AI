fetch('http://localhost:8080/api/auth/login', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({email: 'shrivastavamohit221@gmail.com', password: 'Mohit@1234'})
}).then(r=>r.json()).then(console.log);
