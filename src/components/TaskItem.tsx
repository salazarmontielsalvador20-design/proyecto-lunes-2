import { motion } from 'framer-motion';
import { Check, Trash2, Clock } from 'lucide-react';
import { cn } from '../lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface Task {
    id: string;
    title: string;
    description: string | null;
    completed: boolean;
    created_at: string;
    category_id?: string | null;
}

interface TaskItemProps {
    task: Task;
    onToggle: (id: string, completed: boolean) => void;
    onDelete: (id: string) => void;
}

export function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            whileHover={{ scale: 1.01 }}
            className={cn(
                "group relative flex items-start gap-4 rounded-xl border p-4 transition-all duration-200",
                task.completed
                    ? "bg-zinc-50 border-zinc-200 dark:bg-zinc-900/40 dark:border-zinc-800"
                    : "bg-white border-zinc-200 shadow-sm dark:bg-zinc-900 dark:border-zinc-800"
            )}
        >
            <button
                onClick={() => onToggle(task.id, !task.completed)}
                className={cn(
                    "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                    task.completed
                        ? "border-primary bg-primary text-white"
                        : "border-zinc-300 dark:border-zinc-600 hover:border-primary dark:hover:border-primary"
                )}
            >
                <motion.div
                    initial={false}
                    animate={{ scale: task.completed ? 1 : 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                    <Check className="h-3.5 w-3.5" strokeWidth={3} />
                </motion.div>
            </button>

            <div className="flex w-full flex-col gap-1">
                <h3
                    className={cn(
                        "text-base font-semibold transition-colors duration-200",
                        task.completed
                            ? "text-zinc-400 line-through dark:text-zinc-500"
                            : "text-zinc-900 dark:text-zinc-100"
                    )}
                >
                    {task.title}
                </h3>

                {task.description && (
                    <p className={cn(
                        "text-sm",
                        task.completed ? "text-zinc-400 dark:text-zinc-600" : "text-zinc-600 dark:text-zinc-400"
                    )}>
                        {task.description}
                    </p>
                )}

                <div className="mt-2 flex items-center gap-4 text-xs text-zinc-500 dark:text-zinc-500">
                    <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {formatDistanceToNow(new Date(task.created_at), { addSuffix: true, locale: es })}
                    </span>
                </div>
            </div>

            <button
                onClick={() => onDelete(task.id)}
                className="absolute right-4 top-4 hidden rounded-lg p-2 text-zinc-400 opacity-0 transition-all hover:bg-red-50 hover:text-red-500 group-hover:block group-hover:opacity-100 dark:hover:bg-red-500/10 dark:hover:text-red-400 sm:block sm:opacity-0 sm:group-hover:opacity-100"
                aria-label="Delete task"
            >
                <Trash2 className="h-4 w-4" />
            </button>
        </motion.div>
    );
}
