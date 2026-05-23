Proyecto: Integrar IA gratuita y desplegar en Vercel

Resumen
- Este repositorio contiene `index.html` (tu UI) y una función serverless `api/ai.js` que actúa como proxy a la API de Hugging Face Inference.

Pasos para desplegar en Vercel
1. Crea una cuenta en Vercel (https://vercel.com/) y conecta un repositorio GitHub con este proyecto.
2. Empuja este proyecto a GitHub:
   ```bash
   git init
   git add .
   git commit -m "Add site + HF proxy"
   # crea repo en GitHub y push
   git remote add origin <URL_REPO>
   git push -u origin main
   ```
3. En Vercel, importa el proyecto desde GitHub.
4. En Vercel → Settings → Environment Variables añade:
   - `HF_API_KEY` = tu clave de Hugging Face (https://huggingface.co/settings/tokens)
   - `HF_MODEL` = nombre del modelo (opcional, por ejemplo `gpt2` o `meta-llama/Llama-2-7b-chat-hf` si tu cuenta lo soporta)
   - No guardes el token en `README.md`, ni lo publiques en el repositorio.
5. Despliega. Vercel detectará la función serverless en `api/ai.js` y la expondrá en `https://<tu-site>/api/ai`.

Uso desde `index.html`
- Llama a la función desde el cliente con `fetch('/api/ai', { method: 'POST', body: JSON.stringify({ prompt: 'Tu prompt' }) })`.
- He añadido un helper `callAI(payload)` en `index.html` para facilitarlo.

Notas
- Hugging Face ofrece una capa gratuita limitada; los límites dependen del modelo.
- No expongas claves en el HTML ni en repositorios públicos; usa las Environment Variables de Vercel.
- Si prefieres otro proveedor gratuito, puedo adaptar `api/ai.js` fácilmente.
