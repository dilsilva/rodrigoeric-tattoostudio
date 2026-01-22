# INK MASTER - Tattoo Studio Website

A modern, responsive website for a tattoo artist portfolio, built with HTML, CSS, and JavaScript.

## Features

- 🎨 Modern, responsive design
- 📱 Mobile-friendly layout
- ✨ Smooth scroll animations
- 📧 Contact form with validation
- 🖼️ Portfolio showcase section
- ⚡ Fast loading with CDN resources

## Project Structure

```
rodrigoeric-tattoostudio/
├── index.html      # Main HTML file
├── style.css       # Custom styles
└── README.md       # This file
```

## Deployment to GitHub Pages

### Step 1: Push Your Code to GitHub

1. **Initialize Git** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Tattoo studio website"
   ```

2. **Create a GitHub Repository**:
   - Go to [GitHub](https://github.com) and create a new repository
   - Name it `rodrigoeric-tattoostudio` (or any name you prefer)
   - **Do NOT** initialize with README, .gitignore, or license

3. **Push Your Code**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/rodrigoeric-tattoostudio.git
   git branch -M main
   git push -u origin main
   ```
   Replace `YOUR_USERNAME` with your actual GitHub username.

### Step 2: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click on **Settings** (top menu)
3. Scroll down to **Pages** in the left sidebar
4. Under **Source**, select:
   - **Branch**: `main`
   - **Folder**: `/ (root)`
5. Click **Save**

### Step 3: Access Your Website

- Your site will be available at:
  ```
  https://YOUR_USERNAME.github.io/rodrigoeric-tattoostudio/
  ```
- It may take a few minutes for the site to be live after enabling Pages
- You can find the exact URL in the **Pages** settings section

### Step 4: Custom Domain (Optional)

If you have a custom domain:

1. In the **Pages** settings, enter your custom domain
2. Add a `CNAME` file to your repository root with your domain name
3. Configure DNS records with your domain provider

## Local Development

To view the website locally:

1. **Simple Method**: Open `index.html` directly in your browser
2. **Using a Local Server** (recommended):
   ```bash
   # Using Python 3
   python3 -m http.server 8000
   
   # Using Node.js (if you have http-server installed)
   npx http-server
   
   # Using PHP
   php -S localhost:8000
   ```
3. Open `http://localhost:8000` in your browser

## Customization

### Update Images

Replace the placeholder images (`http://static.photos/...`) with your actual images:

- **Hero background**: Line 19 in `index.html`
- **About section**: Line 34 in `index.html`
- **Portfolio images**: Lines 51, 55, 59 in `index.html`

### Update Content

- Edit text directly in `index.html`
- Modify styles in `style.css`
- Update colors by changing the CSS variables or Tailwind classes

### Form Submission

The contact form currently shows a success message but doesn't actually send emails. To enable form submission, you can:

1. **Use Formspree** (free tier available):
   - Sign up at [formspree.io](https://formspree.io)
   - Get your form endpoint
   - Update the form action in `index.html`

2. **Use Netlify Forms** (if deploying to Netlify):
   - Add `netlify` attribute to the form
   - Netlify will handle submissions automatically

3. **Use EmailJS** (client-side email service):
   - Sign up at [emailjs.com](https://www.emailjs.com)
   - Add their script and configure

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Technologies Used

- **HTML5**: Structure
- **CSS3**: Custom styles
- **Tailwind CSS**: Utility-first CSS framework (via CDN)
- **JavaScript**: Form validation and animations
- **ScrollOut.js**: Scroll animations library

## License

This project is open source and available for personal use.

## Support

For issues or questions, please open an issue on the GitHub repository.
