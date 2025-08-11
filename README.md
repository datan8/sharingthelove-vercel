# React + Vite + Tailwind Skeleton Project

This is a skeleton project template for building modern web applications with React, Vite, and Tailwind CSS. It includes essential pages (Home, Blog, Contact) and is ready for customization.

## Features

- ⚡️ **Vite** - Lightning fast build tool
- ⚛️ **React 18** - Latest React with TypeScript
- 🎨 **Tailwind CSS** - Utility-first CSS framework
- 🚀 **React Router** - Client-side routing
- 📝 **Blog Integration** - WordPress API ready
- 📧 **Contact Form** - Email functionality included
- 🎯 **TypeScript** - Type safety out of the box
- 📱 **Responsive Design** - Mobile-first approach
- 🛠️ **Component Library** - Radix UI components
- 🎬 **Hero Section** - Video background support
- 🔧 **Deployment** - Netlify deployment ready
- 🔐 **Environment Variables** - All configuration in .env file

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- npm, yarn, or bun package manager

### Installation

1. Clone this repository:
```bash
git clone <your-repo-url>
cd <project-name>
```

2. Install dependencies:
```bash
npm install
# or
bun install
```

3. Create a `.env` file by copying `.env.example`:
```bash
cp .env.example .env
```

4. Configure your environment variables in `.env`:
   - Update API endpoints
   - Set email configuration
   - Configure WordPress settings
   - Add contact information
   - See `.env.example` for all available options

### Development

Run the development server:

```bash
npm run dev
# or
bun dev
```

The site will be available at `http://localhost:5173`

### Building for Production

```bash
npm run build
# or
bun run build
```

The build output will be in the `build` directory.

## Environment Variables

All configuration is managed through environment variables in the `.env` file. Copy `.env.example` to `.env` and update the values:

### Email Configuration
- `SENDGRID_API_KEY` - Your SendGrid API key for sending emails
- `VITE_SENDGRID_FROM_EMAIL` - Email address to send from
- `VITE_SENDGRID_TO_EMAIL` - Email address to receive contact form submissions

### API Configuration
- `VITE_API_BASE_URL` - Base URL for your API endpoints
- `STRIPE_SECRET_KEY` - Stripe secret key for payment processing (Netlify environment variable)

### WordPress Configuration
- `VITE_WORDPRESS_SITE` - Your WordPress site identifier
- `VITE_WORDPRESS_API_BASE` - WordPress REST API base URL
- `VITE_WORDPRESS_POSTS_PER_PAGE` - Number of posts per page

### Feature Flags
- `VITE_ENABLE_NEWSLETTER` - Enable/disable newsletter signup
- `VITE_ENABLE_FAQ` - Enable/disable FAQ section

### Contact Information
- `VITE_CONTACT_EMAIL` - Contact email address
- `VITE_CONTACT_PHONE` - Contact phone number
- `VITE_CONTACT_ADDRESS_LINE1` - Address line 1
- `VITE_CONTACT_ADDRESS_SUBURB` - Suburb/Suite
- `VITE_CONTACT_ADDRESS_CITY` - City
- `VITE_CONTACT_ADDRESS_POSTCODE` - Postal code

## Project Structure

```
├── public/
│   └── images/            # Static images
├── src/
│   ├── components/
│   │   ├── layout/        # Layout components (Header, Footer, Hero)
│   │   └── ui/           # Reusable UI components
│   ├── data/             # Navigation and static data
│   ├── lib/              # Utility functions
│   ├── pages/            # Page components
│   ├── services/         # API services
│   ├── types/            # TypeScript types
│   ├── App.tsx           # Main app component
│   └── main.tsx          # Entry point
├── netlify/              # Netlify Functions
├── .env.example          # Example environment variables
└── package.json          # Dependencies and scripts
```

## Customization Guide

### 1. Update Site Content

- **Home Page** (`src/pages/Home.tsx`): Replace placeholder content with your own
- **Navigation** (`src/data/navigationData.ts`): Add/remove menu items
- **Footer** (`src/components/layout/Footer.tsx`): Update company information

### 2. Styling

- The project uses Tailwind CSS for styling
- Global styles are in `src/index.css`
- Component-specific styles use Tailwind classes
- Customize colors in `tailwind.config.js`

### 3. Blog Integration

The blog is set up to work with WordPress REST API:
- Configure your WordPress URL in `.env`
- Blog posts are fetched from `/wp-json/wp/v2/posts`
- Customize the blog layout in `src/pages/Blog.tsx` and `src/pages/BlogPost.tsx`

### 4. Contact Form

The contact form is ready to send emails:
- Configure SendGrid API key in `.env`
- Update email addresses in `.env`
- Customize form fields in `src/pages/Contact.tsx`

## Deployment

### Netlify

The site is configured for easy deployment to Netlify:

1. **Connect your repository** to Netlify
2. **Build settings**:
   - Build command: `bun run build`
   - Publish directory: `build`
3. **Environment variables**: Add your Stripe and other API keys in Netlify dashboard
4. **Functions**: Netlify Functions are automatically deployed from the `netlify/functions` directory

The project includes:
- `netlify.toml` - Netlify configuration file
- `netlify/functions/` - Serverless functions for Stripe integration
- `public/_redirects` - Client-side routing redirects

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run linter
- `npm run format` - Format code

## Libraries Included

### Core Dependencies
- React & React DOM
- React Router DOM
- TypeScript
- Vite

### UI Components
- Radix UI (Complete component library)
- Lucide React (Icons)
- Tailwind CSS
- Class Variance Authority
- Tailwind Merge

### Utilities
- React Hook Form (Forms)
- Zod (Validation)
- Date-fns (Date formatting)
- SendGrid (Email)

### Development Tools
- Biome (Linting & Formatting)
- PostCSS & Autoprefixer
- TypeScript ESLint

## License

This project is open source and available under the MIT License.

## Support

For questions or issues, please open an issue in the repository.
