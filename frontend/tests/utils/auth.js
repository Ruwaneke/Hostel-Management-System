export async function loginFromUI(page, { email, password, expectedPath }) {
  await page.goto('/login');
  await page.getByLabel('Email Address').fill(email);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: /sign in/i }).click();
  await page.waitForURL(new RegExp(expectedPath.replace('/', '\\/')));
}

export async function loginByApi(request, { email, password, backendURL }) {
  const response = await request.post(`${backendURL}/api/auth/login`, {
    data: { email, password }
  });

  if (!response.ok()) {
    throw new Error(`Login failed for ${email}: ${response.status()} ${await response.text()}`);
  }

  return response.json();
}
