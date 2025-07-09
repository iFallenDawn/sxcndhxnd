# sxcndhxnd

A fun little project for me and Nixon to learn web dev foundations (HTML/CSS) and mess around in Next.

Inspired by a talk I had with Nico at Leg Up On Life about adding a shopping cart to his [current website](https://www.sxcndhxnd.com/).

# Authors
- Jordan Wang
- Nikky Soriano

# Notion Board
For all of our progress and thoughts! [Link](https://www.notion.so/sxcndhxnd-139ea1cbcfb18016b24bed3bea471278?pvs=4)

# Technologies

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React](https://docs.astro.build/en/guides/integrations-guide/react/)
- [Lucide](https://lucide.dev/)
- [Supabase](https://supabase.com/)
- [Postman](https://www.postman.com/)
- [Chakra UI](https://chakra-ui.com/)

## Getting Started

First, install all dependencies:

```bash
cd tempo-starter/
pnpm i
```

Then run the app with
```
pnpm dev
```

## Updating Types
```
cd tempo-starter/src
pnpm install --save-dev supabase
pnpx supabase login
pnpx supabase@latest gen types typescript --project-id projectidhere --schema public > types/supabase.ts
```

## Notes
Using `snake_case` for backend and API related things. `camelCase` for everything else.

