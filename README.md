# Rodrigo Eric - Tattoo Studio Website

A modern, professional portfolio website for tattoo artist Rodrigo Eric, featuring a sleek design inspired by high-end tattoo studios like Bang Bang NYC. The site showcases artwork, provides information about the artist, and includes a contact form that sends inquiries to your email (via Resend) and an optional WhatsApp link for direct messaging.

## 🌐 Live Website

The website is hosted on **GitHub Pages** and can be accessed at:
```
https://dilsilva.github.io/rodrigoeric-tattoostudio/
```

## ✨ Features

### Design & User Experience
- **Modern, Dark Theme**: Sleek black background with white typography
- **Fixed Header Logo**: Logo stays visible while scrolling (similar to Bang Bang NYC)
- **Full-Screen Hero Section**: Immersive landing with background image and call-to-action
- **Video Background Dividers**: Animated video sections between content (black & white filter, parallax effect)
- **Smooth Scroll Animations**: Elements fade in as you scroll using ScrollOut.js
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop
- **Parallax Effects**: Video backgrounds scroll at different speeds for depth

### Sections
1. **Hero Section**: Full-screen introduction with animated background
2. **About Section**: Artist information and profile image
3. **Portfolio**: Instagram feed – latest posts from [@rodrigoerictattoo](https://www.instagram.com/rodrigoerictattoo/) (or “View on Instagram” fallback if API not configured)
4. **Contact Form**: Sends inquiries to your email (Resend) and optional WhatsApp link

### Contact Form Integration
- **Email via Resend**: Form submissions are sent to your inbox via a Vercel serverless function and [Resend](https://resend.com) (free tier available).
- **WhatsApp Link**: Optional "Or message us on WhatsApp" link that opens [wa.me](https://wa.me) with a pre-filled message; no backend required. You can also "send this message via WhatsApp" to open WhatsApp with the form content.
- **Secure Serverless Function**: API key and recipient email stored in Vercel environment variables.
- **Input Validation**: Client-side and server-side validation; XSS prevention and sanitization.

### Portfolio (Instagram Feed)
- **Source**: Portfolio section pulls images from your public Instagram feed via [Instagram Graph API](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api).
- **Fallback**: If the API is not configured or the request fails, the section shows a “View on Instagram” button linking to [@rodrigoerictattoo](https://www.instagram.com/rodrigoerictattoo/).
- **Caveats** (see [Portfolio setup](#portfolio-instagram-feed-optional) below):
  - Your Instagram account must be **Business** or **Creator** and linked to a **Facebook Page**.
  - You need a **Meta Developer** app, an access token, and your **Instagram User ID** (from the Graph API).
  - **Token expiry**: Long‑lived tokens last ~60 days and must be refreshed (or re-issued) before they expire.
  - **Rate limits**: The API has rate limits; the site caches the feed response for 5 minutes to reduce calls.

## 🏗️ Architecture & Implementation

### Frontend (GitHub Pages)
- **HTML5**: Semantic markup with accessibility features
- **CSS3**: Custom styles with animations and responsive design
- **JavaScript**: Form handling, scroll animations, parallax effects
- **Tailwind CSS**: Utility-first CSS framework (via CDN)
- **Source Sans Pro**: Typography matching reference site aesthetic
- **ScrollOut.js**: Scroll-triggered animations

### Backend (Vercel Serverless Function)
- **Serverless Architecture**: Function deployed on Vercel
- **Resend API**: Sends email to your inbox (no GitHub required)
- **Security**: Input validation, sanitization, error handling, CORS

### Key Technologies
- **Hosting**: GitHub Pages (frontend) + Vercel (serverless function)
- **Form Processing**: Vercel Serverless Function → Resend API → your email
- **WhatsApp**: Client-side only (wa.me link); no API key needed
- **Security**: Environment variables, input validation, CSP headers
- **Animations**: CSS animations + ScrollOut.js
- **Video**: HTML5 video with parallax scrolling

## 📁 Project Structure

```
rodrigoeric-tattoostudio/
├── index.html                    # Main HTML file
├── style.css                     # Custom styles and animations
├── img/                          # Image assets
│   ├── hero/                     # Hero section background images
│   ├── logo.PNG                  # Fixed header logo
│   ├── profile.jpeg              # About section image
│   └── IMG_*.JPG                 # Portfolio images
├── video/                        # Video assets for dividers
│   └── divider-1.mp4             # Looping video backgrounds
├── vercel-function/              # Serverless function (deployed separately)
│   └── api/
│       ├── send-email.js         # Contact form → email via Resend (primary)
│       ├── instagram-feed.js     # Portfolio: fetch Instagram feed (optional)
│       └── create-issue.js       # Optional: GitHub Issues integration
├── .github/
│   └── dependabot.yml            # Automated security updates
├── .gitignore                    # Git ignore rules
├── SECURITY.md                   # Security documentation
├── SECURITY_AUDIT.md             # Security audit checklist
├── CODE_QUALITY.md               # Code quality standards
└── README.md                     # This file
```

## 🚀 How It Works

### User Flow
1. **User visits website** → GitHub Pages serves static HTML/CSS/JS
2. **User fills contact form** → Client-side validation
3. **Form submission** → POST to Vercel serverless function
4. **Serverless function** → Validates input, sanitizes data, sends email via Resend
5. **Email delivered** → You receive the inquiry in your inbox (reply-to set to sender)
6. **User sees success message** → Confirmation displayed

**WhatsApp:** User can click "Or message us on WhatsApp" (or "send this message via WhatsApp") to open WhatsApp with a pre-filled message; no server involved.

### Technical Flow
```
Browser (GitHub Pages)
    ↓
POST /api/send-email
    ↓
Vercel Serverless Function
    ├── Input Validation & Sanitization
    ├── Security Headers
    └── Resend API
        ↓
Email to CONTACT_EMAIL (reply_to = sender)
```

## 🔧 Setup & Deployment

### Prerequisites
- GitHub account
- Vercel account (free tier works)
- GitHub repository

### Step 1: Deploy Frontend (GitHub Pages)

1. **Push code to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/rodrigoeric-tattoostudio.git
   git branch -M main
   git push -u origin main
   ```

2. **Enable GitHub Pages:**
   - Go to repository → Settings → Pages
   - Source: `main` branch, `/ (root)` folder
   - Save

3. **Your site is live at:**
   ```
   https://YOUR_USERNAME.github.io/rodrigoeric-tattoostudio/
   ```

### Step 2: Deploy Serverless Function (Vercel)

1. **Create Vercel account:** [vercel.com](https://vercel.com) (free tier works).

2. **Deploy:** Create a new project from your repo (or upload the `vercel-function/` folder). Vercel will detect the `api/` folder and deploy serverless functions.

3. **Configure environment variables** (Project → Settings → Environment Variables):
   - **`RESEND_API_KEY`** (required): API key from [Resend](https://resend.com/api-keys). Create an account, verify your domain (or use `onboarding@resend.dev` for testing), then create an API key.
   - **`CONTACT_EMAIL`** (required): Email address where inquiries are sent (e.g. your studio inbox).
   - **`FROM_EMAIL`** (optional): Sender shown in the email. Default: `Rodrigo Eric Studio <onboarding@resend.dev>`. Use your own domain once verified in Resend (e.g. `Studio <contact@yourdomain.com>`).

4. **Get production URL:** After deployment, note the URL (e.g. `https://YOUR-PROJECT-NAME.vercel.app`).

5. **Update `index.html`:** Set `API_ENDPOINT` to your Vercel URL:
   ```javascript
   const API_ENDPOINT = 'https://YOUR-PROJECT-NAME.vercel.app/api/send-email';
   ```

### Step 3: WhatsApp Link (Optional)

To show "Or message us on WhatsApp" and "send this message via WhatsApp":

1. Edit `index.html` and find the contact section: `<section id="contact" ...>`.
2. Set **`data-whatsapp-number`** to your WhatsApp number in international format **without** `+` or spaces (e.g. `5511999999999` for Brazil).
3. Optionally set **`data-whatsapp-default-message`** to the default pre-filled message (e.g. `Hi, I'd like to ask about a tattoo session.`).

If `data-whatsapp-number` is empty, the WhatsApp line is hidden.

### Portfolio: Instagram feed (optional)

The portfolio section loads images from your Instagram feed. If you don’t set it up, the section shows a “View on Instagram” button instead.

**Requirements**

- Instagram **Business** or **Creator** account
- Account linked to a **Facebook Page**
- [Meta for Developers](https://developers.facebook.com/) app with Instagram product

**Setup**

1. **Create a Meta app**  
   [developers.facebook.com](https://developers.facebook.com/) → Create App → Use case “Other” → Create app.

2. **Add Instagram**  
   In the app dashboard: Add Product → Instagram → Set up (Instagram Graph API with Facebook Login).

3. **Get your Instagram User ID**  
   - Connect your Facebook Page to your Instagram Business/Creator account (in Instagram: Settings → Account → Linked accounts).  
   - In the Meta app: Instagram → Basic Display or Graph API → use the [Graph API Explorer](https://developers.facebook.com/tools/explorer/) with your Page token, call `GET /me/accounts` to get the Page ID, then `GET /{page-id}?fields=instagram_business_account` to get the **Instagram User ID** (numeric).

4. **Get a long-lived token**  
   - In Graph API Explorer, get a User access token with `instagram_basic` and `pages_read_engagement` (and `pages_show_list` if needed).  
   - Exchange it for a long-lived token (see [Meta’s access token docs](https://developers.facebook.com/docs/facebook-login/guides/access-tokens/get-long-lived)).

5. **Configure Vercel**  
   In the project’s Environment Variables add:
   - **`INSTAGRAM_ACCESS_TOKEN`**: your long-lived User access token  
   - **`INSTAGRAM_USER_ID`**: the Instagram User ID from step 3  

Redeploy the Vercel project so the portfolio API uses the new env vars.

**Caveats**

- **Token expiry**: Long-lived tokens expire in about 60 days. You must refresh (or re-issue) the token before it expires or the feed will stop loading.
- **Account type**: Personal accounts without Business/Creator + Facebook Page cannot use the Graph API for this; the section will show the “View on Instagram” fallback.
- **Rate limits**: Instagram/Graph API apply rate limits; the endpoint uses short caching (5 min) to reduce calls.

### Alternative: GitHub Issues

If you prefer form submissions to create GitHub Issues instead of (or in addition to) email, use the existing `create-issue.js` function: set `GITHUB_TOKEN`, `GITHUB_OWNER`, and `GITHUB_REPO` in Vercel, and point `API_ENDPOINT` in `index.html` to `/api/create-issue`.

## 🎨 Design Features

### Typography
- **Font**: Source Sans Pro (matching reference site)
- **Headings**: Uppercase, bold, increased letter spacing
- **Body**: Regular weight, optimized line-height

### Visual Effects
- **Fixed Logo**: Stays at top while scrolling
- **Video Dividers**: Full-screen video sections with:
  - Black & white filter
  - Parallax scrolling effect
  - Reduced height (60vh)
- **Smooth Animations**: Scroll-triggered fade-ins
- **Hover Effects**: Portfolio items and buttons

### Color Scheme
- **Background**: Black (#000000)
- **Text**: White
- **Accents**: Gradient buttons (pink to red)
- **Overlays**: Semi-transparent black overlays

## 🔒 Security Features

### Implemented
- ✅ Input validation (client + server)
- ✅ Input sanitization (XSS prevention)
- ✅ Security headers (CSP, X-Frame-Options, etc.)
- ✅ Secure token storage (environment variables)
- ✅ Error handling (generic messages)
- ✅ CORS configuration
- ✅ Length limits on all inputs

### Documentation
- See `SECURITY.md` for detailed security practices
- See `SECURITY_AUDIT.md` for security checklist

## 📝 Customization

### Update Content
- **Hero text**: Edit `index.html` (header hero-branding)
- **About section**: Edit `index.html` (about-content)
- **Portfolio**: Loaded from Instagram feed when configured; otherwise edit the “View on Instagram” fallback in the portfolio section
- **Form labels**: Edit `index.html` (contact form)

### Update Images
- Replace images in `img/` folder
- Update paths in `index.html` (including hero images in the HERO_IMAGES array)
- Recommended formats: JPG for photos, PNG for logos

### Update Videos
- Add MP4 files to `video/` folder
- Update `src` attributes in video sections
- Recommended: 5-15 second loops, H.264 codec, optimized for web

### Styling
- Edit `style.css` for custom styles
- Tailwind classes can be modified in HTML
- Color scheme defined in CSS variables

## 🛠️ Technologies Used

### Frontend
- **HTML5**: Structure and semantics
- **CSS3**: Custom styles, animations, responsive design
- **JavaScript (ES6+)**: Form handling, animations, API calls
- **Tailwind CSS**: Utility-first CSS framework
- **Source Sans Pro**: Typography
- **ScrollOut.js**: Scroll animations

### Backend
- **Vercel Serverless Functions**: API endpoint
- **Resend API**: Email sending (contact form)
- **Node.js**: Runtime environment

### Hosting
- **GitHub Pages**: Static site hosting
- **Vercel**: Serverless function hosting

## 📊 Performance

### Optimizations
- CDN resources (Tailwind, fonts, scripts)
- Optimized images (consider WebP conversion)
- Lazy loading ready
- Minimal JavaScript footprint

### Recommendations
- Compress images before uploading
- Consider WebP format for better compression
- Add lazy loading for below-fold images

## 🌍 Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 📚 Documentation

- **SECURITY.md**: Security best practices and implementation
- **SECURITY_AUDIT.md**: Security audit checklist
- **CODE_QUALITY.md**: Code quality standards and best practices
- **IMPROVEMENTS_SUMMARY.md**: Summary of improvements made

## 🔄 Maintenance

### Regular Tasks
- Monitor form submissions in your email (and Resend dashboard if needed)
- Review function logs in Vercel dashboard
- Rotate Resend API key if needed
- Update dependencies (Dependabot configured)

### Updates
- Push changes to GitHub → Auto-deploys to GitHub Pages
- Update Vercel function → Auto-deploys to Vercel
- Environment variables → Update in Vercel dashboard

## 🐛 Troubleshooting

### Form Not Working
1. Check Vercel function logs
2. Verify environment variables are set
3. Check browser console for errors
4. Verify API endpoint URL is correct

### CORS Errors
1. Ensure CORS headers are set in function
2. Check function is deployed correctly
3. Clear browser cache

### Emails Not Sending
1. Verify `RESEND_API_KEY` and `CONTACT_EMAIL` are set in Vercel
2. Check Resend dashboard for bounces or errors
3. Review Vercel function logs
4. Ensure `FROM_EMAIL` is a verified domain in Resend (or use `onboarding@resend.dev` for testing)

## 📄 License

This project is open source and available for personal use.

## 👤 Author

**Rodrigo Eric** - Professional Tattoo Artist

## 🙏 Acknowledgments

- Design inspired by [Bang Bang NYC](https://www.bangbangforever.com/)
- Typography: Source Sans Pro (Adobe)
- Icons and animations: Custom implementation

---

**Status**: ✅ Production Ready | 🔒 Secure | 📱 Responsive | ⚡ Fast
