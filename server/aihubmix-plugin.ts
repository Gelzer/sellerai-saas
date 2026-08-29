import type { Plugin } from 'vite';

const AIHUBMIX_URL = 'https://aihubmix.com/v1/images/generations';

export function aiHubMixServerPlugin(): Plugin {
  return {
    name: 'aihubmix-server',
    configureServer(server) {
      server.middlewares.use('/api/generate', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end(JSON.stringify({ error: 'Method not allowed' }));
          return;
        }

        const apiKey = process.env.AIHUBMIX_API_KEY ?? process.env.VITE_AIHUBMIX_API_KEY;
        if (!apiKey) {
          res.statusCode = 500;
          res.end(JSON.stringify({ error: 'API key not configured on server' }));
          return;
        }

        try {
          const chunks: Buffer[] = [];
          for await (const chunk of req) {
            chunks.push(chunk as Buffer);
          }
          const raw = Buffer.concat(chunks).toString('utf-8');

          let prompt = '';
          let marketplace = 'wildberries';

          const contentType = req.headers['content-type'] ?? '';

          if (contentType.includes('application/json')) {
            const json = JSON.parse(raw);
            prompt = json.prompt ?? '';
            marketplace = json.marketplace ?? 'wildberries';
          } else {
            const boundary = contentType.match(/boundary=(.+)/)?.[1];
            if (boundary) {
              const parts = raw.split(`--${boundary}`);
              for (const part of parts) {
                const nameMatch = part.match(/name="([^"]+)"/);
                if (!nameMatch) continue;
                const fieldName = nameMatch[1];
                const value = part.split('\r\n').slice(2).join('\r\n').trim();
                if (fieldName === 'prompt') prompt = value;
                if (fieldName === 'marketplace') marketplace = value;
              }
            }
          }

          if (!prompt.trim()) {
            res.statusCode = 400;
            res.end(JSON.stringify({ error: 'Prompt is required' }));
            return;
          }

          const marketplaceLabel =
            marketplace === 'ozon' ? 'Ozon' : 'Wildberries';
          const fullPrompt = `Commercial product photography for ${marketplaceLabel}. The product is placed ${prompt.trim()}, highly detailed, studio lighting, 4k`;

          const apiResponse = await fetch(AIHUBMIX_URL, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${apiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: 'flux-1-dev',
              prompt: fullPrompt,
              size: '1024x1024',
            }),
          });

          if (!apiResponse.ok) {
            const errText = await apiResponse.text().catch(() => '');
            res.statusCode = apiResponse.status;
            res.end(JSON.stringify({ error: `AiHubMix error: ${errText}` }));
            return;
          }

          const data = await apiResponse.json();
          const imageUrl =
            data?.data?.[0]?.url ??
            data?.data?.[0]?.b64_json ??
            data?.url ??
            null;

          if (!imageUrl) {
            res.statusCode = 502;
            res.end(JSON.stringify({ error: 'No image URL in response' }));
            return;
          }

          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ url: imageUrl }));
        } catch (err) {
          res.statusCode = 500;
          res.end(
            JSON.stringify({
              error: err instanceof Error ? err.message : 'Server error',
            })
          );
        }
      });
    },
  };
}
