# Supabase Setup for MDH

## 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project (free tier is fine)
3. Wait for it to initialize

## 2. Create Tables

Go to **SQL Editor** and run:

```sql
-- Pixels table
CREATE TABLE pixels (
    id INTEGER PRIMARY KEY,
    x INTEGER NOT NULL,
    y INTEGER NOT NULL,
    color TEXT NOT NULL,
    wallet TEXT,
    tx_signature TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Stats table  
CREATE TABLE stats (
    id INTEGER PRIMARY KEY DEFAULT 1,
    pixels_painted INTEGER DEFAULT 0,
    tokens_burned BIGINT DEFAULT 0
);

-- Insert initial stats row
INSERT INTO stats (id, pixels_painted, tokens_burned) VALUES (1, 0, 0);

-- Enable realtime for pixels table
ALTER PUBLICATION supabase_realtime ADD TABLE pixels;

-- Create index for faster queries
CREATE INDEX idx_pixels_coords ON pixels(x, y);
```

## 3. Set Row Level Security (RLS)

```sql
-- Allow anyone to read
ALTER TABLE pixels ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read" ON pixels FOR SELECT USING (true);
CREATE POLICY "Allow insert" ON pixels FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update" ON pixels FOR UPDATE USING (true);

ALTER TABLE stats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read" ON stats FOR SELECT USING (true);
CREATE POLICY "Allow update" ON stats FOR UPDATE USING (true);
CREATE POLICY "Allow insert" ON stats FOR INSERT WITH CHECK (true);
```

## 4. Get Your Keys

1. Go to **Settings** → **API**
2. Copy:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public** key

## 5. Update index.html

In `public/index.html`, replace:

```javascript
SUPABASE_URL: 'YOUR_SUPABASE_URL',
SUPABASE_ANON_KEY: 'YOUR_SUPABASE_ANON_KEY'
```

With your actual values:

```javascript
SUPABASE_URL: 'https://xxxxx.supabase.co',
SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
```

## 6. Deploy to Vercel

Push changes to GitHub, Vercel will auto-deploy.

Done! Your canvas is now global and real-time 🎨
