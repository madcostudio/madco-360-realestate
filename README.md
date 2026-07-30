# Mad.co 360° Spatial Real Estate Platform (`madco.in`)

> *"Walk through your next home before you ever step inside it."*

Production-ready, immersive 360° virtual walkthrough platform engineered as an extension of **Mad.co Studio** ([madco.in](https://madco.in)) for Mangalore, Karnataka.

---

## 🌐 Hosting & Deployment Architecture

The application is built with **Next.js App Router** and designed for seamless deployment to **Vercel** under the existing `madco.in` domain.

### Option 1: Subdomain Deployment (PREFERRED — Clean SEO & Independent Builds)
Deploy the standalone Next.js app on Vercel and serve it at **`https://estates.madco.in`**.

#### DNS & Vercel Setup (Step-by-Step)
1. **Connect Domain in Vercel**:
   - Open your project settings in the Vercel Dashboard -> **Domains**.
   - Add `estates.madco.in` as a domain.
2. **Configure DNS Records** (at your DNS provider, e.g. Cloudflare / GoDaddy / Namecheap for `madco.in`):
   ```ini
   Type: CNAME
   Name: estates
   Target: cname.vercel-dns.com
   TTL: Auto / 3600
   ```
3. **Vercel Environment Variables**:
   ```ini
   NEXT_PUBLIC_SITE_URL=https://estates.madco.in
   NEXT_PUBLIC_BASE_PATH=
   ```

---

### Option 2: Reverse Proxy Subpath Fallback (`https://madco.in/estates`)
If the domain owner prefers serving the app under a subpath (`madco.in/estates`), configure Vercel rewrites in the main `madco.in` repository while deploying this repository to `estates.madco.in` (or a Vercel project).

#### A. Configure Main `madco.in` Site (`next.config.js` or `vercel.json`)
Add a rewrite rule to your main `madco.in` site so requests to `/estates` and `/estates/:path*` proxy to the estates Vercel deployment:

**Using `next.config.js` in Main `madco.in` Site:**
```javascript
// next.config.js in main madco.in repository
module.exports = {
  async rewrites() {
    return [
      {
        source: '/estates',
        destination: 'https://estates.madco.in/estates',
      },
      {
        source: '/estates/:path*',
        destination: 'https://estates.madco.in/estates/:path*',
      },
    ];
  },
};
```

**Using `vercel.json` in Main `madco.in` Site:**
```json
{
  "rewrites": [
    {
      "source": "/estates",
      "destination": "https://estates.madco.in/estates"
    },
    {
      "source": "/estates/:path*",
      "destination": "https://estates.madco.in/estates/:path*"
    }
  ]
}
```

#### B. Configure Environment Variables for Subpath Deployment
Set the following environment variables in Vercel for the Estates project:
```ini
NEXT_PUBLIC_SITE_URL=https://madco.in/estates
NEXT_PUBLIC_BASE_PATH=/estates
```

---

## 🛠️ Environment Variables Reference

| Variable Name | Subdomain Example (`estates.madco.in`) | Subpath Example (`madco.in/estates`) | Description |
| :--- | :--- | :--- | :--- |
| `NEXT_PUBLIC_SITE_URL` | `https://estates.madco.in` | `https://madco.in/estates` | Canonical base URL for SEO, Open Graph & sitemaps |
| `NEXT_PUBLIC_BASE_PATH` | *(leave empty)* | `/estates` | Next.js subpath prefix for asset routing |

---

## 📲 Official Contact & Links
- **Agency Main Website**: [https://madco.in](https://madco.in)
- **Mad.co Studio WhatsApp**: [https://wa.me/918762640420](https://wa.me/918762640420)
- **Agency Backlink**: Featured in footer as *"A Mad.co Studio product"*.

---

## 🚀 Local Development & Build Commands

```bash
# 1. Install dependencies
npm install

# 2. Run local Next.js dev server (http://localhost:3000)
npm run dev

# 3. Test production build
npm run build
npm run start
```
