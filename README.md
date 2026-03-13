# 🎁 GetsyBuy Gift

> **Discover Perfect Gifts for Every Occasion**

A luxury animated gift e-commerce store with Supabase backend, admin dashboard, and Amazon affiliate integration.

---

## 🗂️ Project Structure

```
/
├── index.html       ← Main storefront
├── style.css        ← All styles (luxury dark theme)
├── script.js        ← Frontend logic (search, filters, particles)
├── admin.html       ← Hidden admin dashboard
├── admin.js         ← Admin panel logic
├── supabase.js      ← Supabase config + API + demo data
├── vercel.json      ← Vercel deployment config
└── README.md        ← This file
```

---

## ⚡ Quick Start

### 1. Setup Supabase

1. Go to [supabase.com](https://supabase.com) → Create free account
2. Create new project → Copy **Project URL** and **anon key**
3. Open **SQL Editor** and run:

```sql
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  image TEXT NOT NULL,
  affiliate TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'All Gifts',
  rating NUMERIC(2,1) DEFAULT 4.5,
  description TEXT,
  price TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read products" ON products
  FOR SELECT USING (true);

CREATE POLICY "All can write products" ON products
  FOR ALL USING (true);
```

4. Open `supabase.js` and replace:

```js
const SUPABASE_URL = 'https://YOUR_PROJECT_ID.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_ANON_PUBLIC_KEY_HERE';
```

### 2. Change Admin Password

Open `admin.js` and change:

```js
const ADMIN_PASSWORD_HASH = 'getsybuy2024admin';
```

### 3. Update Amazon Affiliate Tag

In `supabase.js`, replace `tag=getsybuy-21` with your actual Amazon Associates tag.

### 4. Deploy to Vercel

```bash
# Option A: Vercel CLI
npm i -g vercel
vercel --prod

# Option B: Drag & drop the folder at vercel.com/new
```

---

## 🎨 Features

| Feature | Status |
|---------|--------|
| Luxury dark theme + gold accents | ✅ |
| GSAP hero animations | ✅ |
| Particle background | ✅ |
| Custom cursor | ✅ |
| Product category filters | ✅ |
| Live search with dropdown | ✅ |
| Amazon affiliate links | ✅ |
| Supabase database | ✅ |
| Realtime product updates | ✅ |
| Admin dashboard | ✅ |
| Password-protected admin | ✅ |
| Add/Edit/Delete products | ✅ |
| Mobile responsive | ✅ |
| WhatsApp order cards | ✅ |
| SEO meta tags | ✅ |
| Vercel deployment config | ✅ |

---

## 🔐 Admin Panel

- URL: `yoursite.com/admin.html`
- Default password: `getsybuy2024admin`
- **Always change the password before deploying!**

---

## 💡 Adding Products via Admin

1. Go to `/admin.html`
2. Login with password
3. Click **+ Add Product**
4. Fill in:
   - Product name
   - Image URL (Unsplash, product image, etc.)
   - Amazon affiliate link (include your `tag=`)
   - Category
   - Rating (1–5)
   - Price (optional, e.g. ₹1,999)
5. Click **Add Product** — appears on store instantly!

---

## 📱 WhatsApp Integration

The WhatsApp order section is "Coming Soon". To activate:

```js
// In index.html, replace Coming Soon buttons with:
<a href="https://wa.me/91XXXXXXXXXX?text=Hi!%20I%20want%20to%20order%20a%20birthday%20gift"
   target="_blank" class="btn-primary">
  Order on WhatsApp
</a>
```

Replace `91XXXXXXXXXX` with your WhatsApp number.

---

## 🌐 Live Demo Note

Without Supabase configured, the site shows **8 demo products** automatically. No setup needed to preview!

---

## 📋 Affiliate Disclosure

GetsyBuy Gift participates in the Amazon Associates Program. As an Amazon Associate, we earn from qualifying purchases.

---

*Built with ♥ for gift lovers*
