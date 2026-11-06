async function request(path, method = 'GET', body) {
  let response;
  try {
    response = await fetch(path, {
      method,
      credentials: 'same-origin',
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error('Could not reach the server. Check that it is running.');
  }
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || 'Something went wrong. Try again.');
  return result;
}

export const currentSession = () => request('/api/auth/session');
export const emailSignIn = (email, password) => request('/api/auth/email', 'POST', { email, password });
export const registerAccount = (details) => request('/api/auth/register', 'POST', details);
export const signOut = () => request('/api/auth/logout', 'POST');
export const saveAccountState = (state) => request('/api/account', 'PUT', { state });
export const saveAccountProfile = (profile) => request('/api/account', 'PUT', { profile });
