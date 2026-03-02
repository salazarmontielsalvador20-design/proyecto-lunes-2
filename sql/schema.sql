-- Enable custom scripts
create table if not exists categories (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  name text not null,
  color text default '#3b82f6',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists tasks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  title text not null,
  description text,
  completed boolean default false,
  category_id uuid references categories(id) on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Turn on Row Level Security
alter table categories enable row level security;
alter table tasks enable row level security;

-- Policies for Categories
create policy "Users can completely manage their own categories."
  on categories for all
  using ( auth.uid() = user_id );

-- Policies for Tasks
create policy "Users can completely manage their own tasks."
  on tasks for all
  using ( auth.uid() = user_id );

-- Enable realtime replication
alter publication supabase_realtime add table tasks;
alter publication supabase_realtime add table categories;
