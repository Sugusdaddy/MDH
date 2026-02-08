# 🛡️ GUARDIAN Pixel Canvas

A collaborative pixel canvas where every pixel costs 10,000 $GUARDIAN tokens (burned forever).

## Features

- 100×100 pixel canvas (10,000 total pixels)
- Each pixel costs 10,000 $GUARDIAN tokens
- Tokens are **burned** (sent to burn address)
- Real-time updates across all users
- Phantom wallet integration
- Zoom in/out for precision painting
- Color picker with preset colors

## Quick Start

```bash
# Navigate to the project
cd pixel-canvas

# Start the server
npm start

# Open in browser
# http://localhost:3000
```

## How It Works

1. Connect your Phantom wallet
2. Click on a pixel to select it
3. Choose your color
4. Click "Paint Pixel"
5. Approve the burn transaction in Phantom
6. Your pixel is painted forever!

## Token Details

- **Token:** GUARDIAN
- **Mint:** `AtuZNNV27hs3AjTf5dLMyxftsnqdv8DpmJWCmEimBAGS`
- **Cost:** 10,000 tokens per pixel
- **Decimals:** 6
- **Total pixels:** 10,000 (100×100)
- **Max burn:** 100,000,000 tokens (10% of 1B supply)

## Tech Stack

- Vanilla JS (no framework)
- Solana Web3.js
- SPL Token
- Node.js (simple file server)

## Configuration

Edit `CONFIG` in `public/index.html`:

```javascript
const CONFIG = {
    CANVAS_SIZE: 100,        // Canvas dimensions
    TOKEN_MINT: '...',       // Token mint address
    COST_PER_PIXEL: 10000,   // Tokens per pixel
    TOKEN_DECIMALS: 6,       // Token decimals
    RPC_URL: '...'           // Helius RPC
};
```

## Deployment

For production, consider:
- Using a database (MongoDB, PostgreSQL) instead of JSON file
- Adding WebSocket for real-time updates
- Deploying to Vercel, Railway, or similar
- Adding rate limiting
- Verifying transactions on-chain before updating canvas

## License

MIT
