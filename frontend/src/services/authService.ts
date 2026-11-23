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

    if (!API_URL) {
      throw new Error('NEXT_PUBLIC_API_URL não está configurada.');
    }

    let response: Response;
    try {
      response = await fetch(`${API_URL}/auth/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: form,
      });
    } catch {
      throw new Error('Não foi possível conectar à API. Tente novamente em instantes.');
    }

    // Um proxy fora do ar pode responder HTML; nesse caso não há "detail".
    const data = await response.json().catch(() => null);

    if (!response.ok || !data) {
      throw new Error(data?.detail ?? 'Não foi possível realizar o login.');
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