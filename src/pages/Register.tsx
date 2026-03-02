import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Loader2, UserPlus } from 'lucide-react';

export default function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleGoogleLogin = async () => {
        setLoading(true);
        setError(null);
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin
            }
        });
        if (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            // In Supabase with email confirmations on, this might not log them in directly
            // but if disabled (as in local or simple dev setups) it does.
            navigate('/tasks');
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4">
            <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white dark:bg-zinc-900 shadow-xl border border-zinc-200 dark:border-zinc-800">
                <div className="p-8">
                    <div className="mb-8 flex flex-col items-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4 text-primary">
                            <UserPlus className="h-6 w-6" />
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Crea una cuenta</h1>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">Comienza a organizar tus tareas hoy</p>
                    </div>

                    <form onSubmit={handleRegister} className="space-y-4">
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
                            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Registrarse'}
                        </button>

                        <div className="relative my-4">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-zinc-200 dark:border-zinc-700"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="bg-white px-2 text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">O continuar con</span>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={handleGoogleLogin}
                            disabled={loading}
                            className="flex w-full items-center justify-center rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 py-2.5 text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-zinc-900 disabled:opacity-50 transition-all"
                        >
                            <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                <path fill="none" d="M1 1h22v22H1z" />
                            </svg>
                            Google
                        </button>
                    </form>
                </div>

                <div className="border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 p-6 text-center">
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        ¿Ya tienes una cuenta?{' '}
                        <Link to="/login" className="font-semibold text-primary hover:underline">
                            Inicia sesión
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
