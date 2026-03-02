import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Loader2, LogIn } from 'lucide-react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            navigate('/tasks');
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4">
            <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white dark:bg-zinc-900 shadow-xl border border-zinc-200 dark:border-zinc-800">
                <div className="p-8">
                    <div className="mb-8 flex flex-col items-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4 text-primary">
                            <LogIn className="h-6 w-6" />
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Bienvenido de nuevo</h1>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">Inicia sesión en tu cuenta para ver tus tareas</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        {error && (
                            <div className="rounded-md bg-red-50 dark:bg-red-500/10 p-4 border border-red-200 dark:border-red-500/20">
                                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1" htmlFor="email">
                                Correo Electrónico
                            </label>
                            <input
                                id="email"
                                type="email"
                                required
                                className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary dark:text-white transition-colors"
                                placeholder="tu@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1" htmlFor="password">
                                Contraseña
                            </label>
                            <input
                                id="password"
                                type="password"
                                required
                                className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary dark:text-white transition-colors"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-6 flex w-full items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Iniciar Sesión'}
                        </button>
                    </form>
                </div>

                <div className="border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 p-6 text-center">
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        ¿No tienes una cuenta?{' '}
                        <Link to="/register" className="font-semibold text-primary hover:underline">
                            Regístrate
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
