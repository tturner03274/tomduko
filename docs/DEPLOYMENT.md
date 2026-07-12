# Vercel deployment

1. Create an empty GitHub repository and push this Tomduko folder.
2. In Vercel choose **Add New → Project**, import that repository and select the Vite preset.
3. Use build command `npm run build` and output directory `dist`; no environment variables are required.
4. Deploy, visit once online, then in iPhone Safari choose Share → Add to Home Screen.
5. Launch once, enable Airplane Mode, close and relaunch to verify offline operation.

`vercel.json` keeps hashed assets immutable, keeps the service worker/manifest revalidating, rewrites navigation to `index.html`, and applies restrictive security headers. Future pushes create new deployments; Tomduko asks before activating a cached update mid-puzzle. Add a custom domain in Vercel Project Settings if wanted.
