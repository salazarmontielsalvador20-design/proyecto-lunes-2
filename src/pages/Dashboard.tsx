import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { CheckCircle2, CircleDashed, ListTodo, Trophy } from 'lucide-react';

export default function Dashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        const fetchStats = async () => {
            try {
                const { data, error } = await supabase
                    .from('tasks')
                    .select('completed')
                    .eq('user_id', user.id);

                if (error) throw error;

                const total = data.length;
                const completed = data.filter(t => t.completed).length;
                const pending = total - completed;

                setStats({ total, completed, pending });
            } catch (error) {
                console.error('Error fetching stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [user]);

    const chartData = [
        { name: 'Completadas', value: stats.completed, color: '#10b981' }, // Emerald 500
        { name: 'Pendientes', value: stats.pending, color: '#f59e0b' },    // Amber 500
    ];

    const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

    if (loading) {
        return <div className="p-8 text-zinc-500 animate-pulse">Cargando estadísticas...</div>;
    }

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Resumen Semanal</h1>
                <p className="text-zinc-500 dark:text-zinc-400 mt-2">Observa tu progreso y mantén la productividad.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Stat Cards */}
                <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-500 dark:bg-blue-500/10">
                            <ListTodo className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Total Tareas</p>
                            <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{stats.total}</h3>
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-500 dark:bg-emerald-500/10">
                            <CheckCircle2 className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Completadas</p>
                            <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{stats.completed}</h3>
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-amber-500 dark:bg-amber-500/10">
                            <CircleDashed className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Pendientes</p>
                            <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{stats.pending}</h3>
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-indigo-500 dark:bg-indigo-500/10">
                            <Trophy className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Tasa de Éxito</p>
                            <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{completionRate}%</h3>
                        </div>
                    </div>
                </div>
            </div>

            {stats.total > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-6">Distribución de Tareas</h3>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={chartData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={80}
                                        outerRadius={110}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Legend verticalAlign="bottom" height={36} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
