# Rodrigo Eric - Tattoo Studio Website

A modern, professional portfolio website for tattoo artist Rodrigo Eric, featuring a sleek design inspired by high-end tattoo studios like Bang Bang NYC. The site showcases artwork, provides information about the artist, and includes a contact form that automatically creates GitHub Issues for inquiries.

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
3. **Portfolio Gallery**: Showcase of tattoo work in different styles
4. **Contact Form**: Secure form that creates GitHub Issues automatically

### Contact Form Integration
- **GitHub Issues Integration**: Form submissions automatically create GitHub Issues
- **Secure Serverless Function**: Token stored securely in Vercel environment variables
- **Input Validation**: Client-side and server-side validation
- **Security**: XSS prevention, input sanitization, security headers

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
- **GitHub API Integration**: Creates issues automatically
- **Security**: Input validation, sanitization, error handling
- **CORS**: Properly configured for cross-origin requests

### Key Technologies
- **Hosting**: GitHub Pages (frontend) + Vercel (serverless function)
- **Form Processing**: Vercel Serverless Function → GitHub Issues API
- **Security**: Environment variables, input validation, CSP headers
- **Animations**: CSS animations + ScrollOut.js
- **Video**: HTML5 video with parallax scrolling

## 📁 Project Structure

```
rodrigoeric-tattoostudio/
├── index.html                    # Main HTML file
├── style.css                     # Custom styles and animations
├── img/                          # Image assets
│   ├── logo.PNG                  # Fixed header logo
│   ├── background-1.JPG          # Hero section background
│   ├── profile.jpeg              # About section image
│   └── IMG_*.JPG                 # Portfolio images
├── video/                        # Video assets for dividers
│   └── divider-1.mp4             # Looping video backgrounds
├── vercel-function/              # Serverless function (deployed separately)
│   └── api/
│       └── create-issue.js       # GitHub Issues API integration
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
3. **Form submission** → POST request to Vercel serverless function
4. **Serverless function** → Validates input, sanitizes data, creates GitHub Issue
5. **GitHub Issue created** → You receive notification in your repository
6. **User sees success message** → Confirmation displayed

### Technical Flow
```
Browser (GitHub Pages)
    ↓
POST /api/create-issue
    ↓
Vercel Serverless Function
    ├── Input Validation
    ├── Input Sanitization
    ├── Security Headers
    └── GitHub API Call
        ↓
GitHub Issues API
    ↓
New Issue Created
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

1. **Create Vercel account:**
   - Go to [vercel.com](https://vercel.com)
   - Sign up (free tier works)

2. **Deploy function:**
   - Create new project
   - Upload `vercel-function/` folder
   - Or connect GitHub repository and deploy

3. **Configure environment variables:**
   - Go to Project → Settings → Environment Variables
   - Add:
     - `GITHUB_TOKEN`: Your fine-grained GitHub token
     - `GITHUB_OWNER`: Your GitHub username (e.g., `dilsilva`)
     - `GITHUB_REPO`: Repository name (e.g., `rodrigoeric-tattoostudio`)

4. **Get production URL:**
   - After deployment, note your production URL
   - Format: `https://YOUR-PROJECT-NAME.vercel.app`

5. **Update HTML:**
   - Edit `index.html`, line 288
   - Update `API_ENDPOINT` with your Vercel production URL:
   ```javascript
   const API_ENDPOINT = 'https://YOUR-PROJECT-NAME.vercel.app/api/create-issue';
   ```

6. **Push update:**
   ```bash
   git add index.html
   git commit -m "Update API endpoint"
   git push
   ```

### Step 3: Create GitHub Token

1. **Generate fine-grained token:**
   - GitHub → Settings → Developer settings → Fine-grained tokens
   - Generate new token
   - Repository access: Only `rodrigoeric-tattoostudio`
   - Permissions:
     - **Actions**: Read and write
     - **Contents**: Read-only
     - **Issues**: Write
   - Copy token

2. **Add to Vercel:**
   - Paste token in Vercel environment variables as `GITHUB_TOKEN`

### Step 4: Create GitHub Labels (Optional)

1. Go to repository → Issues → Labels
2. Create labels:
   - `inquiry`
   - `contact-form`

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
- **Hero text**: Edit `index.html` lines 49-50
- **About section**: Edit `index.html` lines 83-86
- **Portfolio items**: Edit `index.html` lines 106-117
- **Form labels**: Edit `index.html` lines 138-167

### Update Images
- Replace images in `img/` folder
- Update paths in `index.html`
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
- **GitHub API**: Issue creation
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
- Monitor form submissions in GitHub Issues
- Review function logs in Vercel dashboard
- Rotate GitHub token every 90 days
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

### Issues Not Creating
1. Verify GitHub token has correct permissions
2. Check token hasn't expired
3. Review Vercel function logs
4. Ensure labels exist in repository

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
