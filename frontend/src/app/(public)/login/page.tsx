'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { authService } from '@/services/authService';

export default function LoginPage() {
    const { login } = useAuth();
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [erro, setErro] = useState<string | null>(null);
    const [enviando, setEnviando] = useState(false);

    const handleLogin = async (event: React.FormEvent) => {
        event.preventDefault();
        setErro(null);
        setEnviando(true);

        try {
            const response = await authService.login(email, senha);

            login(response.access_token);
            router.replace('/');
        } catch (error) {
            setErro(error instanceof Error ? error.message : 'Erro ao realizar login.');
            setEnviando(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
                <form onSubmit={handleLogin} noValidate>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
                        <input
                            type="email"
                            id="email"
                            autoComplete="username"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="senha" className="block text-gray-700 mb-2">Senha</label>
                        <input
                            type="password"
                            id="senha"
                            autoComplete="current-password"
                            required
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                        />
                    </div>
                    {erro && (
                        <p role="alert" className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                            {erro}
                        </p>
                    )}
                    <button
                        type="submit"
                        disabled={enviando || !email || !senha}
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {enviando ? 'Entrando...' : 'Entrar'}
                    </button>
                </form>
            </div>
        </div>
    );
}
