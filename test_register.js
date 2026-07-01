fetch('http://localhost:8080/api/auth/register', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({name: 'Tester', email: 'test_hash@flowforge.ai', password: 'password'})
}).then(r=>r.json()).then(console.log);
