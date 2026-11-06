async function guestRequest(method, state) {
  const response = await fetch('/api/guest', {
    method,
    credentials: 'same-origin',
    headers: state ? { 'Content-Type': 'application/json' } : undefined,
    body: state ? JSON.stringify(state) : undefined,
  });
  if (!response.ok) throw new Error(`Guest request failed: ${response.status}`);
  return response.json();
}

export async function loadGuestState() {
  const result = await guestRequest('GET');
  return result.state;
}

export async function saveGuestState(state) {
  await guestRequest('PUT', state);
}
