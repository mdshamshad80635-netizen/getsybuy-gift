# 🚀 ZetsyBuy Gift — Complete Deployment Guide
## VS Code → GitHub → Vercel + Supabase Database

---

## STEP 1: VS CODE SETUP

1. **VS Code Download:** https://code.visualstudio.com
2. **Folder open karo:**
   - File → Open Folder → `zetsybuy-clean` folder select karo
3. **Useful Extensions install karo (optional):**
   - "Live Server" — local preview ke liye
   - "Prettier" — code formatting

---

## STEP 2: SUPABASE DATABASE SETUP (Free)

### A. Account Banao
1. https://supabase.com → Sign Up (GitHub se)
2. "New Project" click karo
3. **Name:** `zetsybuy-gift`
4. **Password:** Strong password daalo (save kar lo!)
5. **Region:** Southeast Asia (Singapore) — India ke liye fastest
6. Create Project → ~2 min wait

### B. Database Tables Banao
1. Left sidebar → **SQL Editor**
2. "New Query" click karo
3. `supabase-setup.sql` file ka poora content paste karo
4. **Run** button click karo (Ctrl+Enter)
5. "Success" message aayega ✅

### C. API Keys Copy Karo
1. Left sidebar → **Settings → API**
2. Copy karo:
   - **Project URL** → `https://xyzxyz.supabase.co`
   - **anon public key** → `eyJhbGc...` (long key)

### D. Keys Daalo Files Mein

**index.html** mein dhundo:
```javascript
var SUPABASE_URL = 'YOUR_SUPABASE_URL';
var SUPABASE_KEY = 'YOUR_SUPABASE_ANON_KEY';
```
Replace karo:
```javascript
var SUPABASE_URL = 'https://xyzxyz.supabase.co';
var SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

**admin.html** mein bhi same do jagah update karo (same keys).

---

## STEP 3: AMAZON AFFILIATE LINK DAALO

### A. Associates Account
1. https://affiliate-program.amazon.in → Sign Up
2. Apna Associates ID milega (e.g. `yourname-21`)

### B. index.html mein Replace Karo
VS Code mein: **Ctrl+H** (Find & Replace)
- Find: `YOURID-21`
- Replace: `yourname-21` (apna ID)
- Replace All

### C. Specific Product Links (Zyada Commission)
Amazon pe product open karo → SiteStripe bar → "Text" → Link copy karo
Admin panel → Products → Link update karo → Save

---

## STEP 4: GITHUB SETUP

### A. GitHub Account
1. https://github.com → Sign Up (free)

### B. Repository Banao
1. GitHub → "+" → **New Repository**
2. **Name:** `zetsybuy-gift`
3. **Visibility:** Private (recommended)
4. Create Repository

### C. VS Code se GitHub pe Upload

**Option 1: VS Code Terminal**
```bash
# Terminal kholo: Ctrl+` (backtick)
cd path/to/zetsybuy-clean

git init
git add .
git commit -m "Initial ZetsyBuy Gift deploy"
git branch -M main
git remote add origin https://github.com/YOURUSERNAME/zetsybuy-gift.git
git push -u origin main
```

**Option 2: GitHub Desktop (Aasaan)**
1. https://desktop.github.com → Download
2. Sign in → File → Add Local Repository → `zetsybuy-clean` folder
3. "Publish Repository" → Done!

---

## STEP 5: VERCEL DEPLOY

### A. Vercel Account
1. https://vercel.com → Sign Up with **GitHub**

### B. Deploy Karo
1. Vercel Dashboard → **"New Project"**
2. GitHub repo `zetsybuy-gift` select karo → **Import**
3. Settings:
   - **Framework Preset:** Other
   - **Root Directory:** `./` (default)
   - **Build Command:** (empty rakho)
   - **Output Directory:** `./` (ya empty)
4. **Deploy!** → 2-3 min

### C. Live URL Milega
```
https://zetsybuy-gift.vercel.app  ✅ LIVE!
```

### D. Custom Domain (Optional)
1. Vercel → Project → **Domains**
2. Apna domain daalo (e.g. `zetsybuygift.in`)
3. DNS settings mein Vercel ka CNAME add karo

---

## STEP 6: FUTURE UPDATES (Git Workflow)

Jab bhi change karo:
```bash
# VS Code Terminal mein:
git add .
git commit -m "Products update kiya"
git push
```
**Vercel automatically redeploy karega!** ✅

---

## ARCHITECTURE — Kaise Kaam Karta Hai

```
Admin Panel (admin.html)
    ↓ Products/Frames save karta hai
Supabase Database (Cloud)
    ↓ Real-time sync
Main Website (index.html) ← Sab users
    ↓ Latest data dikhta hai
```

**Flow:**
1. Tum Admin panel pe product add/edit karo
2. Supabase mein save hota hai
3. **Sab users ko turant update dikhta hai** (Realtime!)
4. Eid users ka data bhi Supabase mein jaata hai

---

## IMPORTANT FILES

| File | Purpose |
|------|---------|
| `index.html` | Main website |
| `admin.html` | Admin panel |
| `eid-poster.html` | Eid poster creator |
| `supabase-setup.sql` | Database tables banane ke liye |
| `vercel.json` | Vercel config |
| `supabase-config.js` | Reference only |

---

## CHECKLIST ✅

- [ ] Supabase account banaya
- [ ] SQL run kiya (tables bane)
- [ ] Supabase URL + Key daala index.html mein
- [ ] Supabase URL + Key daala admin.html mein
- [ ] `YOURID-21` → apna Amazon ID replace kiya
- [ ] WhatsApp number update kiya (`919999999999`)
- [ ] GitHub repo banaya
- [ ] Code push kiya
- [ ] Vercel pe deploy kiya
- [ ] Live URL test kiya
- [ ] Admin panel test kiya

---

## SUPPORT

Koi problem ho toh:
- Supabase Docs: https://supabase.com/docs
- Vercel Docs: https://vercel.com/docs
- GitHub Docs: https://docs.github.com
