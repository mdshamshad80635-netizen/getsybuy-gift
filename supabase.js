// ============================================
// SUPABASE CONFIGURATION - GetsyBuy Gift
// ============================================
// Replace these values with your actual Supabase project credentials
// Get them from: https://app.supabase.com → Your Project → Settings → API

const SUPABASE_URL = 'https://hohkmownflleevxeodwb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhvaGttb3duZmxsZWV2eGVvZHdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyNTUyMzEsImV4cCI6MjA4ODgzMTIzMX0.V5dfPc_eGkEm_G3Q3hPzNeVSgzGQ9G8cNAe1Is9vWTI';

// Initialize Supabase client
const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ============================================
// SUPABASE SETUP INSTRUCTIONS
// ============================================
// 1. Go to https://app.supabase.com and create a free account
// 2. Create a new project
// 3. Go to SQL Editor and run this query to create the products table:
//
// CREATE TABLE products (
//   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
//   name TEXT NOT NULL,
//   image TEXT NOT NULL,
//   affiliate TEXT NOT NULL,
//   category TEXT NOT NULL DEFAULT 'All Gifts',
//   rating NUMERIC(2,1) DEFAULT 4.5,
//   description TEXT,
//   price TEXT,
//   created_at TIMESTAMPTZ DEFAULT NOW()
// );
//
// ALTER TABLE products ENABLE ROW LEVEL SECURITY;
//
// CREATE POLICY "Public can read products" ON products
//   FOR SELECT USING (true);
//
// CREATE POLICY "Authenticated can insert" ON products
//   FOR INSERT WITH CHECK (true);
//
// CREATE POLICY "Authenticated can update" ON products
//   FOR UPDATE USING (true);
//
// CREATE POLICY "Authenticated can delete" ON products
//   FOR DELETE USING (true);
//
// 4. Copy your Project URL and anon public key from Settings → API
// 5. Replace SUPABASE_URL and SUPABASE_ANON_KEY above
// ============================================