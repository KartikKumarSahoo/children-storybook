# Children's Storybook Creator

This is a [Next.js](https://nextjs.org) project that creates personalized children's storybooks using AI. The application generates custom stories and illustrations based on child-specific details like name, age, interests, and physical traits.

## Features

- **Personalized Story Generation**: Creates custom stories featuring the child as the main character
- **AI-Powered Illustrations**: Generates images using either Google's Imagen model or Gemini's image generation capabilities
- **Character Consistency**: Maintains consistent character appearance throughout the story
- **Flexible Configuration**: Switch between different AI models for image generation

## Environment Setup

Create a `.env.local` file with the following variables:

```bash
# Google Gemini API Configuration
GEMINI_API_KEY=your_gemini_api_key_here

# Image Generation Settings
ENABLE_IMAGE_GENERATION_WITH_IMAGEN=true  # Set to 'true' to use Imagen, 'false' for Gemini
```

### Image Generation Models

The application supports two image generation approaches:

1. **Imagen Model** (Recommended): High-quality, specialized image generation model
   - Set `ENABLE_IMAGE_GENERATION_WITH_IMAGEN=true`
   - Uses `imagen-4.0-generate-001` model
   - Optimized for children's book illustrations

2. **Gemini 2.5 Flash Image Preview** (Default): Built-in Gemini multimodal capabilities
   - Set `ENABLE_IMAGE_GENERATION_WITH_IMAGEN=false`
   - Uses `gemini-2.5-flash-image-preview` model
   - Fallback option when Imagen is not available

## Getting Started

First, install dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
