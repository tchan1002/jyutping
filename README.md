This is a [Next.js](https://nextjs.org) project.

## Getting Started

First, run the development server:

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

## Data sources and attribution

- Cantonese frequency and lexicon data derived from the Cifu project. See `data-cifu/LICENSE` for license, and original source: `https://github.com/gwinterstein/cifu` by Geoffrey Winterstein (gwinterstein). We import the TSV (`Cifu-v1.txt`) and generate the top 1000 entries for gameplay.
- Wordlist processing logic is in `scripts/importCifuTxt.ts`.

If you use this data, please attribute Cifu and Geoffrey Winterstein (gwinterstein) accordingly.
