Proyecto: Integrar IA gratuita (Groq) y desplegar en Vercel

Resumen
- Este repositorio contiene `index.html` (tu UI) y una función serverless `api/ai.js` que actúa como proxy a la API de Groq (gratuita y confiable desde Vercel).

Pasos para desplegar en Vercel
1. Crea una cuenta en Vercel (https://vercel.com/) y conecta un repositorio GitHub con este proyecto.
2. Crea una cuenta en Groq (https://console.groq.com) y obtén tu API Key en Settings → API Keys.
3. Empuja este proyecto a GitHub:
   ```bash
   git init
   git add .
   git commit -m "Add site + Groq proxy"
   # crea repo en GitHub y push
   git remote add origin <URL_REPO>
   git push -u origin main
   ```
4. En Vercel, importa el proyecto desde GitHub.
5. En Vercel → Settings → Environment Variables añade:
   - `GROQ_API_KEY` = tu clave de Groq (https://console.groq.com/keys)
   - **No guardes el token en `README.md`, ni lo publiques en el repositorio.**
6. Despliega. Vercel detectará la función serverless en `api/ai.js` y la expondrá en `https://<tu-site>/api/ai`.

Uso desde `index.html`
- Llama a la función desde el cliente con `fetch('/api/ai', { method: 'POST', body: JSON.stringify({ prompt: 'Tu prompt' }) })`.
- He añadido un helper `callAI(payload)` en `index.html` para facilitarlo.

Notas
- Groq ofrece una capa gratuita generosa; los límites dependen de tu plan.
- Groq es muy rápido y confiable desde Vercel (mejor que Hugging Face Inference).
- No expongas claves en el HTML ni en repositorios públicos; usa las Environment Variables de Vercel.
