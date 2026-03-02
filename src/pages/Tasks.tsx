import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { TaskItem } from '../components/TaskItem';
import { AnimatePresence } from 'framer-motion';
import { Plus, Search, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';

interface Task {
    id: string;
    title: string;
    description: string | null;
    completed: boolean;
    created_at: string;
    category_id?: string | null;
}

export default function Tasks() {
    const { user } = useAuth();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
    const [isAdding, setIsAdding] = useState(false);

    useEffect(() => {
        if (!user) return;

        fetchTasks();

        // Setup realtime subscription
        const subscription = supabase
            .channel('tasks_channel')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'tasks',
                filter: `user_id=eq.${user.id}`
            }, (payload) => {
                if (payload.eventType === 'INSERT') {
                    setTasks(prev => [payload.new as Task, ...prev]);
                } else if (payload.eventType === 'UPDATE') {
                    setTasks(prev => prev.map(t => t.id === payload.new.id ? payload.new as Task : t));
                } else if (payload.eventType === 'DELETE') {
                    setTasks(prev => prev.filter(t => t.id !== payload.old.id));
                }
            })
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
        };
    }, [user]);

    const fetchTasks = async () => {
        try {
            const { data, error } = await supabase
                .from('tasks')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setTasks(data || []);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        } finally {
            setLoading(false);
        }
    };

    const addTask = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTaskTitle.trim() || !user) return;

        setIsAdding(true);
        try {
            const { error } = await supabase.from('tasks').insert([
                {
                    title: newTaskTitle.trim(),
                    user_id: user.id,
                    completed: false,
                }
            ]);

            if (error) throw error;
            setNewTaskTitle('');
        } catch (error) {
            console.error('Error adding task:', error);
        } finally {
            setIsAdding(false);
        }
    };

    const toggleTask = async (id: string, completed: boolean) => {
        try {
            // Optimistic update
            setTasks(prev => prev.map(t => t.id === id ? { ...t, completed } : t));

            const { error } = await supabase
                .from('tasks')
                .update({ completed })
                .eq('id', id);

            if (error) throw error;
        } catch (error) {
            console.error('Error toggling task:', error);
            // Revert on error
            fetchTasks();
        }
    };

    const deleteTask = async (id: string) => {
        try {
            // Optimistic update
            setTasks(prev => prev.filter(t => t.id !== id));

            const { error } = await supabase
                .from('tasks')
                .delete()
                .eq('id', id);

            if (error) throw error;
        } catch (error) {
            console.error('Error deleting task:', error);
            fetchTasks();
        }
    };

    const filteredTasks = tasks.filter(task => {
        const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter =
            filter === 'all' ? true :
                filter === 'completed' ? task.completed :
                    !task.completed;

        return matchesSearch && matchesFilter;
    });

    if (loading) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Mis Tareas</h1>
                <p className="text-zinc-500 dark:text-zinc-400 mt-2">Gestiona tu día de forma eficiente y sincronizada.</p>
            </div>

            <form onSubmit={addTask} className="relative flex items-center">
                <input
                    type="text"
                    placeholder="¿Qué necesitas hacer hoy?"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    className="w-full rounded-2xl border border-zinc-200 bg-white px-6 py-4 pr-16 text-base shadow-sm outline-none transition-all placeholder:text-zinc-400 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:focus:border-primary"
                />
                <button
                    type="submit"
                    disabled={!newTaskTitle.trim() || isAdding}
                    className="absolute right-2 flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
                >
                    {isAdding ? <Loader2 className="h-5 w-5 animate-spin" /> : <Plus className="h-5 w-5" />}
                </button>
            </form>

            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="relative w-full sm:max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                    <input
                        type="text"
                        placeholder="Buscar tareas..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full rounded-lg border border-zinc-200 bg-zinc-50 py-2 pl-9 pr-4 text-sm outline-none transition-colors focus:border-primary dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
                    />
                </div>

                <div className="flex w-full sm:w-auto p-1 bg-zinc-100 dark:bg-zinc-900 rounded-lg">
                    {(['all', 'pending', 'completed'] as const).map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={cn(
                                "flex-1 sm:flex-none px-4 py-1.5 text-sm font-medium rounded-md transition-all capitalize",
                                filter === f
                                    ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-zinc-100"
                                    : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                            )}
                        >
                            {f === 'all' ? 'Todas' : f === 'pending' ? 'Pendientes' : 'Completadas'}
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-3">
                {filteredTasks.length === 0 ? (
                    <div className="text-center py-12 rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-800">
                        <p className="text-zinc-500 dark:text-zinc-400">No hay tareas que mostrar.</p>
                    </div>
                ) : (
                    <AnimatePresence mode="popLayout">
                        {filteredTasks.map((task) => (
                            <TaskItem
                                key={task.id}
                                task={task}
                                onToggle={toggleTask}
                                onDelete={deleteTask}
                            />
                        ))}
                    </AnimatePresence>
                )}
            </div>
        </div>
    );
}
