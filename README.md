This folder is extended from the Dinal/debate repo

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Add .env file

Please add .env file in the root directoy as follow

```plain
# NEXT_PUBLIC_ is for client.
# Server-side can use either.
DIALOGUE_BACKEND_URL=http://sg-chat-alb-2067960470.us-east-1.elb.amazonaws.com
NEXT_PUBLIC_DIALOGUE_BACKEND_URL=http://sg-chat-alb-2067960470.us-east-1.elb.amazonaws.com
```

## Getting Started

### Deploy / run from scratch (after cloning from GitHub)

1) Add the `.env` file (as shown above)

2) Install dependencies

```bash
npm install
```

3) Run the dev server

```bash
npm run dev
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
