// frontend/src/services/authService.ts

interface TokenResponse {
  access_token: string;
  token_type: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, '');

export const authService = {
  async login(
    username: string,
    password: string
  ): Promise<TokenResponse> {
    const form = new URLSearchParams();

    form.set('username', username);
    form.set('password', password);

    const response = await fetch(`${API_URL}/auth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: form,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail ?? 'Não foi possível realizar o login.');
    }

    return data;
  },

  async getCurrentUser(token: string) {
    const response = await fetch(`${API_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Sessão inválida ou expirada.');
    }

    return response.json();
  },
};