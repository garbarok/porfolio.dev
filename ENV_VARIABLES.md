# Environment Variables Configuration

This document explains the environment variables used in the portfolio application.

## Setup

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Update the values in `.env` with your actual credentials.

## Available Environment Variables

### Formspree Configuration

#### `FORMSPREE_FORM_ID`
- **Required**: Yes (for contact form functionality)
- **Type**: Server-side only (not prefixed with `PUBLIC_`)
- **Description**: Your Formspree form ID from https://formspree.io/forms
- **Example**: `manvadlr`
- **Used in**:
  - `src/pages/api/contact.ts` - Server-side API endpoint
  - `src/components/Contact.astro` - Fallback for direct submission

### Contact Information

#### `PUBLIC_CONTACT_EMAIL`
- **Required**: No (defaults to `work@oscargallegoruiz.com`)
- **Type**: Public (accessible client-side)
- **Description**: Your contact email address displayed throughout the site
- **Used in**:
  - `src/components/Contact.astro` - Contact form page
  - `src/pages/contact.astro` - Contact page

#### `PUBLIC_LINKEDIN_URL`
- **Required**: No (defaults to `https://linkedin.com/in/oscargallegoruiz`)
- **Type**: Public (accessible client-side)
- **Description**: Your LinkedIn profile URL
- **Used in**:
  - `src/components/Contact.astro` - Contact links
  - `src/pages/contact.astro` - Contact page

#### `PUBLIC_GITHUB_URL`
- **Required**: No (defaults to `https://github.com/garbarok`)
- **Type**: Public (accessible client-side)
- **Description**: Your GitHub profile URL
- **Used in**:
  - `src/components/Contact.astro` - Contact links

### Site Configuration

#### `PUBLIC_SITE_URL`
- **Required**: No (defaults to `https://oscargallegoruiz.com`)
- **Type**: Public (accessible client-side)
- **Description**: Your site's production URL
- **Note**: Currently defined as a placeholder for future use

## Environment Variable Types

### Server-side Variables
Variables **without** the `PUBLIC_` prefix are only accessible server-side (in API routes and SSR pages):
- `FORMSPREE_FORM_ID`

### Public Variables
Variables **with** the `PUBLIC_` prefix are accessible both server-side and client-side:
- `PUBLIC_CONTACT_EMAIL`
- `PUBLIC_LINKEDIN_URL`
- `PUBLIC_GITHUB_URL`
- `PUBLIC_SITE_URL`

## Development vs Production

### Development (.env)
Create a `.env` file in the root directory with your local/test values.

### Production (Vercel)
Add environment variables in your Vercel project settings:
1. Go to your project in Vercel Dashboard
2. Navigate to Settings → Environment Variables
3. Add each variable with its value
4. Make sure to add them for all environments (Production, Preview, Development)

## Security Notes

- ⚠️ **Never commit `.env` files** - They are already in `.gitignore`
- ✅ The `.env.example` file should be committed as a template
- ⚠️ Server-side variables (without `PUBLIC_`) are never exposed to the client
- ✅ Public variables (with `PUBLIC_`) are bundled in the client code

## Testing

To test if environment variables are working:

1. Check the contact form loads without errors
2. Verify email/social links use the correct URLs
3. Submit a test contact form (will only work if `FORMSPREE_FORM_ID` is set)

## Troubleshooting

### "FORMSPREE_FORM_ID is not configured" error
- Make sure you've created a `.env` file
- Verify `FORMSPREE_FORM_ID` is set in the `.env` file
- Restart the dev server after adding environment variables

### Contact form submits but doesn't reach Formspree
- Check that your `FORMSPREE_FORM_ID` is correct
- Verify the form is active in your Formspree dashboard
- Check browser console for any errors
