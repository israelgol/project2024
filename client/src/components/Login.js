import { useState } from 'react';
const backendUrl = process.env.REACT_APP_BACKEND_URL;

function Login({ setCurrentPage, setIsHr, setEmployeeId, setFullName }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(`${backendUrl}/employee/login`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
          username: email,
          password: password
        })
      })

      if (response.status === 401) {
        setIsLoading(false);
        const { message } = await response.json();
        alert(message);
        return
      }

      const { employee } = await response.json();
      setEmployeeId(employee.employeeId);
      setFullName(employee.fullName);
      if (employee.role === 'HR') {
        setIsHr(true)
      };
      setIsLoading(false);
      setCurrentPage();

    } catch (e) {
      setIsLoading(false);
      console.error('Login error:', e);
      alert('An error occurred while logging in. Please try again later.');
    }
  };

  if (isLoading) {
    return <p>Logging in...</p>;
  }

  return (
    <div>
      <h2>Sign In</h2>
      <form onSubmit={handleSignIn}>
        <label>Email address:</label>
        <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} required />

        <label>Password:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

        <button type="submit">Sign In</button>
      </form>
    </div>
  );
}

export default Login;
