# Modern Aura - Full Project Export for Codex

## File: .env
```text
VITE_API_URL=https://api.voxeflow.com
VITE_API_KEY=Beatriz@CB650
VITE_INSTANCE_NAME=VoxeFlow


```

---

## File: .env.local
```local
# Senha de Acesso
VITE_AUTH_PASSWORD=VoxeFlow2024!

# API Evolution
VITE_API_URL=https://api.voxeflow.com

```

---

## File: .gitignore
```text
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?
.env

```

---

## File: README.md
```md
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

```

---

## File: deploy_hetzner.sh
```sh
#!/bin/bash

echo "🚀 Iniciando Deploy do Backend na Hetzner"
echo "=========================================="

# 1. Obter o IP
if [ -z "$1" ]; then
  echo "🤔 Qual é o IP do seu servidor na Hetzner?"
  echo "Dica: Acesse console.hetzner.cloud > Seu Projeto > Copie o IP do servidor"
  read -p "IP do Servidor: " SERVER_IP
else
  SERVER_IP=$1
fi

if [ -z "$SERVER_IP" ]; then
  echo "❌ IP não informado. Cancelando."
  exit 1
fi

# 2. Caminhos
LOCAL_FILE="/Users/jeffersonreis/.gemini/antigravity/brain/d188a536-b906-4ab8-b41a-3fe84a20ba0c/docker-compose.yml"
REMOTE_USER="root"
REMOTE_PATH="/root/docker-compose.yml"

echo ""
echo "📦 Enviando arquivo docker-compose.yml para $SERVER_IP..."

# 3. Enviar arquivo via SCP
scp "$LOCAL_FILE" "$REMOTE_USER@$SERVER_IP:$REMOTE_PATH"

if [ $? -eq 0 ]; then
  echo "✅ Arquivo enviado com sucesso!"
  echo ""
  echo "🔧 Próximos passos:"
  echo "1. Acesse o servidor: ssh $REMOTE_USER@$SERVER_IP"
  echo "2. Inicie o servico: docker-compose up -d"
  echo ""
  
  read -p "Deseja acessar o servidor via SSH agora? (s/n) " CONNECT_SSH
  if [[ "$CONNECT_SSH" =~ ^[Ss]$ ]]; then
    ssh "$REMOTE_USER@$SERVER_IP"
  fi
else
  echo "❌ Erro ao enviar arquivo. Verifique se o IP está correto e se você tem acesso SSH (chave pública configurada)."
fi

```

---

## File: eslint.config.js
```js
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
    },
  },
])

```

---

## File: functions/api/ai.js
```js
export async function onRequest(context) {
    const { request, env } = context;

    // 1. Only allow POST requests
    if (request.method !== "POST") {
        return new Response(JSON.stringify({ error: "Method not allowed" }), {
            status: 405,
            headers: { "Content-Type": "application/json" }
        });
    }

    try {
        const body = await request.json();
        const apiKey = env.VITE_OPENAI_API_KEY;

        if (!apiKey) {
            return new Response(JSON.stringify({ error: "OpenAI API Key not configured in Cloudflare environment" }), {
                status: 500,
                headers: { "Content-Type": "application/json" }
            });
        }

        // 2. Proxy to OpenAI
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify(body)
        });

        const data = await response.json();

        return new Response(JSON.stringify(data), {
            status: response.status,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            }
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}

```

---

## File: index.html
```html
<!doctype html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport"
    content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap"
    rel="stylesheet">
  <title>AURA | Dentista Copiloto v2</title>
</head>

<body>
  <div id="root"></div>
  <script type="module" src="/src/main.jsx"></script>
</body>

</html>
```

---

## File: package-lock.json
```json
{
  "name": "modern-aura",
  "version": "0.0.0",
  "lockfileVersion": 3,
  "requires": true,
  "packages": {
    "": {
      "name": "modern-aura",
      "version": "0.0.0",
      "dependencies": {
        "@supabase/supabase-js": "^2.95.3",
        "lucide-react": "^0.563.0",
        "react": "^19.2.0",
        "react-dom": "^19.2.0",
        "socket.io-client": "^4.8.3",
        "zustand": "^5.0.10"
      },
      "devDependencies": {
        "@eslint/js": "^9.39.1",
        "@types/react": "^19.2.5",
        "@types/react-dom": "^19.2.3",
        "@vitejs/plugin-react": "^5.1.1",
        "eslint": "^9.39.1",
        "eslint-plugin-react-hooks": "^7.0.1",
        "eslint-plugin-react-refresh": "^0.4.24",
        "globals": "^16.5.0",
        "vite": "^7.2.4"
      }
    },
    "node_modules/@babel/code-frame": {
      "version": "7.28.6",
      "resolved": "https://registry.npmjs.org/@babel/code-frame/-/code-frame-7.28.6.tgz",
      "integrity": "sha512-JYgintcMjRiCvS8mMECzaEn+m3PfoQiyqukOMCCVQtoJGYJw8j/8LBJEiqkHLkfwCcs74E3pbAUFNg7d9VNJ+Q==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@babel/helper-validator-identifier": "^7.28.5",
        "js-tokens": "^4.0.0",
        "picocolors": "^1.1.1"
      },
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/compat-data": {
      "version": "7.28.6",
      "resolved": "https://registry.npmjs.org/@babel/compat-data/-/compat-data-7.28.6.tgz",
      "integrity": "sha512-2lfu57JtzctfIrcGMz992hyLlByuzgIk58+hhGCxjKZ3rWI82NnVLjXcaTqkI2NvlcvOskZaiZ5kjUALo3Lpxg==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/core": {
      "version": "7.28.6",
      "resolved": "https://registry.npmjs.org/@babel/core/-/core-7.28.6.tgz",
      "integrity": "sha512-H3mcG6ZDLTlYfaSNi0iOKkigqMFvkTKlGUYlD8GW7nNOYRrevuA46iTypPyv+06V3fEmvvazfntkBU34L0azAw==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "@babel/code-frame": "^7.28.6",
        "@babel/generator": "^7.28.6",
        "@babel/helper-compilation-targets": "^7.28.6",
        "@babel/helper-module-transforms": "^7.28.6",
        "@babel/helpers": "^7.28.6",
        "@babel/parser": "^7.28.6",
        "@babel/template": "^7.28.6",
        "@babel/traverse": "^7.28.6",
        "@babel/types": "^7.28.6",
        "@jridgewell/remapping": "^2.3.5",
        "convert-source-map": "^2.0.0",
        "debug": "^4.1.0",
        "gensync": "^1.0.0-beta.2",
        "json5": "^2.2.3",
        "semver": "^6.3.1"
      },
      "engines": {
        "node": ">=6.9.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/babel"
      }
    },
    "node_modules/@babel/generator": {
      "version": "7.28.6",
      "resolved": "https://registry.npmjs.org/@babel/generator/-/generator-7.28.6.tgz",
      "integrity": "sha512-lOoVRwADj8hjf7al89tvQ2a1lf53Z+7tiXMgpZJL3maQPDxh0DgLMN62B2MKUOFcoodBHLMbDM6WAbKgNy5Suw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@babel/parser": "^7.28.6",
        "@babel/types": "^7.28.6",
        "@jridgewell/gen-mapping": "^0.3.12",
        "@jridgewell/trace-mapping": "^0.3.28",
        "jsesc": "^3.0.2"
      },
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/helper-compilation-targets": {
      "version": "7.28.6",
      "resolved": "https://registry.npmjs.org/@babel/helper-compilation-targets/-/helper-compilation-targets-7.28.6.tgz",
      "integrity": "sha512-JYtls3hqi15fcx5GaSNL7SCTJ2MNmjrkHXg4FSpOA/grxK8KwyZ5bubHsCq8FXCkua6xhuaaBit+3b7+VZRfcA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@babel/compat-data": "^7.28.6",
        "@babel/helper-validator-option": "^7.27.1",
        "browserslist": "^4.24.0",
        "lru-cache": "^5.1.1",
        "semver": "^6.3.1"
      },
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/helper-globals": {
      "version": "7.28.0",
      "resolved": "https://registry.npmjs.org/@babel/helper-globals/-/helper-globals-7.28.0.tgz",
      "integrity": "sha512-+W6cISkXFa1jXsDEdYA8HeevQT/FULhxzR99pxphltZcVaugps53THCeiWA8SguxxpSp3gKPiuYfSWopkLQ4hw==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/helper-module-imports": {
      "version": "7.28.6",
      "resolved": "https://registry.npmjs.org/@babel/helper-module-imports/-/helper-module-imports-7.28.6.tgz",
      "integrity": "sha512-l5XkZK7r7wa9LucGw9LwZyyCUscb4x37JWTPz7swwFE/0FMQAGpiWUZn8u9DzkSBWEcK25jmvubfpw2dnAMdbw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@babel/traverse": "^7.28.6",
        "@babel/types": "^7.28.6"
      },
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/helper-module-transforms": {
      "version": "7.28.6",
      "resolved": "https://registry.npmjs.org/@babel/helper-module-transforms/-/helper-module-transforms-7.28.6.tgz",
      "integrity": "sha512-67oXFAYr2cDLDVGLXTEABjdBJZ6drElUSI7WKp70NrpyISso3plG9SAGEF6y7zbha/wOzUByWWTJvEDVNIUGcA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@babel/helper-module-imports": "^7.28.6",
        "@babel/helper-validator-identifier": "^7.28.5",
        "@babel/traverse": "^7.28.6"
      },
      "engines": {
        "node": ">=6.9.0"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0"
      }
    },
    "node_modules/@babel/helper-plugin-utils": {
      "version": "7.28.6",
      "resolved": "https://registry.npmjs.org/@babel/helper-plugin-utils/-/helper-plugin-utils-7.28.6.tgz",
      "integrity": "sha512-S9gzZ/bz83GRysI7gAD4wPT/AI3uCnY+9xn+Mx/KPs2JwHJIz1W8PZkg2cqyt3RNOBM8ejcXhV6y8Og7ly/Dug==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/helper-string-parser": {
      "version": "7.27.1",
      "resolved": "https://registry.npmjs.org/@babel/helper-string-parser/-/helper-string-parser-7.27.1.tgz",
      "integrity": "sha512-qMlSxKbpRlAridDExk92nSobyDdpPijUq2DW6oDnUqd0iOGxmQjyqhMIihI9+zv4LPyZdRje2cavWPbCbWm3eA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/helper-validator-identifier": {
      "version": "7.28.5",
      "resolved": "https://registry.npmjs.org/@babel/helper-validator-identifier/-/helper-validator-identifier-7.28.5.tgz",
      "integrity": "sha512-qSs4ifwzKJSV39ucNjsvc6WVHs6b7S03sOh2OcHF9UHfVPqWWALUsNUVzhSBiItjRZoLHx7nIarVjqKVusUZ1Q==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/helper-validator-option": {
      "version": "7.27.1",
      "resolved": "https://registry.npmjs.org/@babel/helper-validator-option/-/helper-validator-option-7.27.1.tgz",
      "integrity": "sha512-YvjJow9FxbhFFKDSuFnVCe2WxXk1zWc22fFePVNEaWJEu8IrZVlda6N0uHwzZrUM1il7NC9Mlp4MaJYbYd9JSg==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/helpers": {
      "version": "7.28.6",
      "resolved": "https://registry.npmjs.org/@babel/helpers/-/helpers-7.28.6.tgz",
      "integrity": "sha512-xOBvwq86HHdB7WUDTfKfT/Vuxh7gElQ+Sfti2Cy6yIWNW05P8iUslOVcZ4/sKbE+/jQaukQAdz/gf3724kYdqw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@babel/template": "^7.28.6",
        "@babel/types": "^7.28.6"
      },
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/parser": {
      "version": "7.28.6",
      "resolved": "https://registry.npmjs.org/@babel/parser/-/parser-7.28.6.tgz",
      "integrity": "sha512-TeR9zWR18BvbfPmGbLampPMW+uW1NZnJlRuuHso8i87QZNq2JRF9i6RgxRqtEq+wQGsS19NNTWr2duhnE49mfQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@babel/types": "^7.28.6"
      },
      "bin": {
        "parser": "bin/babel-parser.js"
      },
      "engines": {
        "node": ">=6.0.0"
      }
    },
    "node_modules/@babel/plugin-transform-react-jsx-self": {
      "version": "7.27.1",
      "resolved": "https://registry.npmjs.org/@babel/plugin-transform-react-jsx-self/-/plugin-transform-react-jsx-self-7.27.1.tgz",
      "integrity": "sha512-6UzkCs+ejGdZ5mFFC/OCUrv028ab2fp1znZmCZjAOBKiBK2jXD1O+BPSfX8X2qjJ75fZBMSnQn3Rq2mrBJK2mw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@babel/helper-plugin-utils": "^7.27.1"
      },
      "engines": {
        "node": ">=6.9.0"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0-0"
      }
    },
    "node_modules/@babel/plugin-transform-react-jsx-source": {
      "version": "7.27.1",
      "resolved": "https://registry.npmjs.org/@babel/plugin-transform-react-jsx-source/-/plugin-transform-react-jsx-source-7.27.1.tgz",
      "integrity": "sha512-zbwoTsBruTeKB9hSq73ha66iFeJHuaFkUbwvqElnygoNbj/jHRsSeokowZFN3CZ64IvEqcmmkVe89OPXc7ldAw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@babel/helper-plugin-utils": "^7.27.1"
      },
      "engines": {
        "node": ">=6.9.0"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0-0"
      }
    },
    "node_modules/@babel/template": {
      "version": "7.28.6",
      "resolved": "https://registry.npmjs.org/@babel/template/-/template-7.28.6.tgz",
      "integrity": "sha512-YA6Ma2KsCdGb+WC6UpBVFJGXL58MDA6oyONbjyF/+5sBgxY/dwkhLogbMT2GXXyU84/IhRw/2D1Os1B/giz+BQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@babel/code-frame": "^7.28.6",
        "@babel/parser": "^7.28.6",
        "@babel/types": "^7.28.6"
      },
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/traverse": {
      "version": "7.28.6",
      "resolved": "https://registry.npmjs.org/@babel/traverse/-/traverse-7.28.6.tgz",
      "integrity": "sha512-fgWX62k02qtjqdSNTAGxmKYY/7FSL9WAS1o2Hu5+I5m9T0yxZzr4cnrfXQ/MX0rIifthCSs6FKTlzYbJcPtMNg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@babel/code-frame": "^7.28.6",
        "@babel/generator": "^7.28.6",
        "@babel/helper-globals": "^7.28.0",
        "@babel/parser": "^7.28.6",
        "@babel/template": "^7.28.6",
        "@babel/types": "^7.28.6",
        "debug": "^4.3.1"
      },
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/types": {
      "version": "7.28.6",
      "resolved": "https://registry.npmjs.org/@babel/types/-/types-7.28.6.tgz",
      "integrity": "sha512-0ZrskXVEHSWIqZM/sQZ4EV3jZJXRkio/WCxaqKZP1g//CEWEPSfeZFcms4XeKBCHU0ZKnIkdJeU/kF+eRp5lBg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@babel/helper-string-parser": "^7.27.1",
        "@babel/helper-validator-identifier": "^7.28.5"
      },
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@esbuild/aix-ppc64": {
      "version": "0.27.2",
      "resolved": "https://registry.npmjs.org/@esbuild/aix-ppc64/-/aix-ppc64-0.27.2.tgz",
      "integrity": "sha512-GZMB+a0mOMZs4MpDbj8RJp4cw+w1WV5NYD6xzgvzUJ5Ek2jerwfO2eADyI6ExDSUED+1X8aMbegahsJi+8mgpw==",
      "cpu": [
        "ppc64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "aix"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/android-arm": {
      "version": "0.27.2",
      "resolved": "https://registry.npmjs.org/@esbuild/android-arm/-/android-arm-0.27.2.tgz",
      "integrity": "sha512-DVNI8jlPa7Ujbr1yjU2PfUSRtAUZPG9I1RwW4F4xFB1Imiu2on0ADiI/c3td+KmDtVKNbi+nffGDQMfcIMkwIA==",
      "cpu": [
        "arm"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "android"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/android-arm64": {
      "version": "0.27.2",
      "resolved": "https://registry.npmjs.org/@esbuild/android-arm64/-/android-arm64-0.27.2.tgz",
      "integrity": "sha512-pvz8ZZ7ot/RBphf8fv60ljmaoydPU12VuXHImtAs0XhLLw+EXBi2BLe3OYSBslR4rryHvweW5gmkKFwTiFy6KA==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "android"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/android-x64": {
      "version": "0.27.2",
      "resolved": "https://registry.npmjs.org/@esbuild/android-x64/-/android-x64-0.27.2.tgz",
      "integrity": "sha512-z8Ank4Byh4TJJOh4wpz8g2vDy75zFL0TlZlkUkEwYXuPSgX8yzep596n6mT7905kA9uHZsf/o2OJZubl2l3M7A==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "android"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/darwin-arm64": {
      "version": "0.27.2",
      "resolved": "https://registry.npmjs.org/@esbuild/darwin-arm64/-/darwin-arm64-0.27.2.tgz",
      "integrity": "sha512-davCD2Zc80nzDVRwXTcQP/28fiJbcOwvdolL0sOiOsbwBa72kegmVU0Wrh1MYrbuCL98Omp5dVhQFWRKR2ZAlg==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/darwin-x64": {
      "version": "0.27.2",
      "resolved": "https://registry.npmjs.org/@esbuild/darwin-x64/-/darwin-x64-0.27.2.tgz",
      "integrity": "sha512-ZxtijOmlQCBWGwbVmwOF/UCzuGIbUkqB1faQRf5akQmxRJ1ujusWsb3CVfk/9iZKr2L5SMU5wPBi1UWbvL+VQA==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/freebsd-arm64": {
      "version": "0.27.2",
      "resolved": "https://registry.npmjs.org/@esbuild/freebsd-arm64/-/freebsd-arm64-0.27.2.tgz",
      "integrity": "sha512-lS/9CN+rgqQ9czogxlMcBMGd+l8Q3Nj1MFQwBZJyoEKI50XGxwuzznYdwcav6lpOGv5BqaZXqvBSiB/kJ5op+g==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "freebsd"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/freebsd-x64": {
      "version": "0.27.2",
      "resolved": "https://registry.npmjs.org/@esbuild/freebsd-x64/-/freebsd-x64-0.27.2.tgz",
      "integrity": "sha512-tAfqtNYb4YgPnJlEFu4c212HYjQWSO/w/h/lQaBK7RbwGIkBOuNKQI9tqWzx7Wtp7bTPaGC6MJvWI608P3wXYA==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "freebsd"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-arm": {
      "version": "0.27.2",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-arm/-/linux-arm-0.27.2.tgz",
      "integrity": "sha512-vWfq4GaIMP9AIe4yj1ZUW18RDhx6EPQKjwe7n8BbIecFtCQG4CfHGaHuh7fdfq+y3LIA2vGS/o9ZBGVxIDi9hw==",
      "cpu": [
        "arm"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-arm64": {
      "version": "0.27.2",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-arm64/-/linux-arm64-0.27.2.tgz",
      "integrity": "sha512-hYxN8pr66NsCCiRFkHUAsxylNOcAQaxSSkHMMjcpx0si13t1LHFphxJZUiGwojB1a/Hd5OiPIqDdXONia6bhTw==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-ia32": {
      "version": "0.27.2",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-ia32/-/linux-ia32-0.27.2.tgz",
      "integrity": "sha512-MJt5BRRSScPDwG2hLelYhAAKh9imjHK5+NE/tvnRLbIqUWa+0E9N4WNMjmp/kXXPHZGqPLxggwVhz7QP8CTR8w==",
      "cpu": [
        "ia32"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-loong64": {
      "version": "0.27.2",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-loong64/-/linux-loong64-0.27.2.tgz",
      "integrity": "sha512-lugyF1atnAT463aO6KPshVCJK5NgRnU4yb3FUumyVz+cGvZbontBgzeGFO1nF+dPueHD367a2ZXe1NtUkAjOtg==",
      "cpu": [
        "loong64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-mips64el": {
      "version": "0.27.2",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-mips64el/-/linux-mips64el-0.27.2.tgz",
      "integrity": "sha512-nlP2I6ArEBewvJ2gjrrkESEZkB5mIoaTswuqNFRv/WYd+ATtUpe9Y09RnJvgvdag7he0OWgEZWhviS1OTOKixw==",
      "cpu": [
        "mips64el"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-ppc64": {
      "version": "0.27.2",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-ppc64/-/linux-ppc64-0.27.2.tgz",
      "integrity": "sha512-C92gnpey7tUQONqg1n6dKVbx3vphKtTHJaNG2Ok9lGwbZil6DrfyecMsp9CrmXGQJmZ7iiVXvvZH6Ml5hL6XdQ==",
      "cpu": [
        "ppc64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-riscv64": {
      "version": "0.27.2",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-riscv64/-/linux-riscv64-0.27.2.tgz",
      "integrity": "sha512-B5BOmojNtUyN8AXlK0QJyvjEZkWwy/FKvakkTDCziX95AowLZKR6aCDhG7LeF7uMCXEJqwa8Bejz5LTPYm8AvA==",
      "cpu": [
        "riscv64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-s390x": {
      "version": "0.27.2",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-s390x/-/linux-s390x-0.27.2.tgz",
      "integrity": "sha512-p4bm9+wsPwup5Z8f4EpfN63qNagQ47Ua2znaqGH6bqLlmJ4bx97Y9JdqxgGZ6Y8xVTixUnEkoKSHcpRlDnNr5w==",
      "cpu": [
        "s390x"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-x64": {
      "version": "0.27.2",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-x64/-/linux-x64-0.27.2.tgz",
      "integrity": "sha512-uwp2Tip5aPmH+NRUwTcfLb+W32WXjpFejTIOWZFw/v7/KnpCDKG66u4DLcurQpiYTiYwQ9B7KOeMJvLCu/OvbA==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/netbsd-arm64": {
      "version": "0.27.2",
      "resolved": "https://registry.npmjs.org/@esbuild/netbsd-arm64/-/netbsd-arm64-0.27.2.tgz",
      "integrity": "sha512-Kj6DiBlwXrPsCRDeRvGAUb/LNrBASrfqAIok+xB0LxK8CHqxZ037viF13ugfsIpePH93mX7xfJp97cyDuTZ3cw==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "netbsd"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/netbsd-x64": {
      "version": "0.27.2",
      "resolved": "https://registry.npmjs.org/@esbuild/netbsd-x64/-/netbsd-x64-0.27.2.tgz",
      "integrity": "sha512-HwGDZ0VLVBY3Y+Nw0JexZy9o/nUAWq9MlV7cahpaXKW6TOzfVno3y3/M8Ga8u8Yr7GldLOov27xiCnqRZf0tCA==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "netbsd"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/openbsd-arm64": {
      "version": "0.27.2",
      "resolved": "https://registry.npmjs.org/@esbuild/openbsd-arm64/-/openbsd-arm64-0.27.2.tgz",
      "integrity": "sha512-DNIHH2BPQ5551A7oSHD0CKbwIA/Ox7+78/AWkbS5QoRzaqlev2uFayfSxq68EkonB+IKjiuxBFoV8ESJy8bOHA==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "openbsd"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/openbsd-x64": {
      "version": "0.27.2",
      "resolved": "https://registry.npmjs.org/@esbuild/openbsd-x64/-/openbsd-x64-0.27.2.tgz",
      "integrity": "sha512-/it7w9Nb7+0KFIzjalNJVR5bOzA9Vay+yIPLVHfIQYG/j+j9VTH84aNB8ExGKPU4AzfaEvN9/V4HV+F+vo8OEg==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "openbsd"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/openharmony-arm64": {
      "version": "0.27.2",
      "resolved": "https://registry.npmjs.org/@esbuild/openharmony-arm64/-/openharmony-arm64-0.27.2.tgz",
      "integrity": "sha512-LRBbCmiU51IXfeXk59csuX/aSaToeG7w48nMwA6049Y4J4+VbWALAuXcs+qcD04rHDuSCSRKdmY63sruDS5qag==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "openharmony"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/sunos-x64": {
      "version": "0.27.2",
      "resolved": "https://registry.npmjs.org/@esbuild/sunos-x64/-/sunos-x64-0.27.2.tgz",
      "integrity": "sha512-kMtx1yqJHTmqaqHPAzKCAkDaKsffmXkPHThSfRwZGyuqyIeBvf08KSsYXl+abf5HDAPMJIPnbBfXvP2ZC2TfHg==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "sunos"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/win32-arm64": {
      "version": "0.27.2",
      "resolved": "https://registry.npmjs.org/@esbuild/win32-arm64/-/win32-arm64-0.27.2.tgz",
      "integrity": "sha512-Yaf78O/B3Kkh+nKABUF++bvJv5Ijoy9AN1ww904rOXZFLWVc5OLOfL56W+C8F9xn5JQZa3UX6m+IktJnIb1Jjg==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/win32-ia32": {
      "version": "0.27.2",
      "resolved": "https://registry.npmjs.org/@esbuild/win32-ia32/-/win32-ia32-0.27.2.tgz",
      "integrity": "sha512-Iuws0kxo4yusk7sw70Xa2E2imZU5HoixzxfGCdxwBdhiDgt9vX9VUCBhqcwY7/uh//78A1hMkkROMJq9l27oLQ==",
      "cpu": [
        "ia32"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/win32-x64": {
      "version": "0.27.2",
      "resolved": "https://registry.npmjs.org/@esbuild/win32-x64/-/win32-x64-0.27.2.tgz",
      "integrity": "sha512-sRdU18mcKf7F+YgheI/zGf5alZatMUTKj/jNS6l744f9u3WFu4v7twcUI9vu4mknF4Y9aDlblIie0IM+5xxaqQ==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@eslint-community/eslint-utils": {
      "version": "4.9.1",
      "resolved": "https://registry.npmjs.org/@eslint-community/eslint-utils/-/eslint-utils-4.9.1.tgz",
      "integrity": "sha512-phrYmNiYppR7znFEdqgfWHXR6NCkZEK7hwWDHZUjit/2/U0r6XvkDl0SYnoM51Hq7FhCGdLDT6zxCCOY1hexsQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "eslint-visitor-keys": "^3.4.3"
      },
      "engines": {
        "node": "^12.22.0 || ^14.17.0 || >=16.0.0"
      },
      "funding": {
        "url": "https://opencollective.com/eslint"
      },
      "peerDependencies": {
        "eslint": "^6.0.0 || ^7.0.0 || >=8.0.0"
      }
    },
    "node_modules/@eslint-community/eslint-utils/node_modules/eslint-visitor-keys": {
      "version": "3.4.3",
      "resolved": "https://registry.npmjs.org/eslint-visitor-keys/-/eslint-visitor-keys-3.4.3.tgz",
      "integrity": "sha512-wpc+LXeiyiisxPlEkUzU6svyS1frIO3Mgxj1fdy7Pm8Ygzguax2N3Fa/D/ag1WqbOprdI+uY6wMUl8/a2G+iag==",
      "dev": true,
      "license": "Apache-2.0",
      "engines": {
        "node": "^12.22.0 || ^14.17.0 || >=16.0.0"
      },
      "funding": {
        "url": "https://opencollective.com/eslint"
      }
    },
    "node_modules/@eslint-community/regexpp": {
      "version": "4.12.2",
      "resolved": "https://registry.npmjs.org/@eslint-community/regexpp/-/regexpp-4.12.2.tgz",
      "integrity": "sha512-EriSTlt5OC9/7SXkRSCAhfSxxoSUgBm33OH+IkwbdpgoqsSsUg7y3uh+IICI/Qg4BBWr3U2i39RpmycbxMq4ew==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": "^12.0.0 || ^14.0.0 || >=16.0.0"
      }
    },
    "node_modules/@eslint/config-array": {
      "version": "0.21.1",
      "resolved": "https://registry.npmjs.org/@eslint/config-array/-/config-array-0.21.1.tgz",
      "integrity": "sha512-aw1gNayWpdI/jSYVgzN5pL0cfzU02GT3NBpeT/DXbx1/1x7ZKxFPd9bwrzygx/qiwIQiJ1sw/zD8qY/kRvlGHA==",
      "dev": true,
      "license": "Apache-2.0",
      "dependencies": {
        "@eslint/object-schema": "^2.1.7",
        "debug": "^4.3.1",
        "minimatch": "^3.1.2"
      },
      "engines": {
        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
      }
    },
    "node_modules/@eslint/config-helpers": {
      "version": "0.4.2",
      "resolved": "https://registry.npmjs.org/@eslint/config-helpers/-/config-helpers-0.4.2.tgz",
      "integrity": "sha512-gBrxN88gOIf3R7ja5K9slwNayVcZgK6SOUORm2uBzTeIEfeVaIhOpCtTox3P6R7o2jLFwLFTLnC7kU/RGcYEgw==",
      "dev": true,
      "license": "Apache-2.0",
      "dependencies": {
        "@eslint/core": "^0.17.0"
      },
      "engines": {
        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
      }
    },
    "node_modules/@eslint/core": {
      "version": "0.17.0",
      "resolved": "https://registry.npmjs.org/@eslint/core/-/core-0.17.0.tgz",
      "integrity": "sha512-yL/sLrpmtDaFEiUj1osRP4TI2MDz1AddJL+jZ7KSqvBuliN4xqYY54IfdN8qD8Toa6g1iloph1fxQNkjOxrrpQ==",
      "dev": true,
      "license": "Apache-2.0",
      "dependencies": {
        "@types/json-schema": "^7.0.15"
      },
      "engines": {
        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
      }
    },
    "node_modules/@eslint/eslintrc": {
      "version": "3.3.3",
      "resolved": "https://registry.npmjs.org/@eslint/eslintrc/-/eslintrc-3.3.3.tgz",
      "integrity": "sha512-Kr+LPIUVKz2qkx1HAMH8q1q6azbqBAsXJUxBl/ODDuVPX45Z9DfwB8tPjTi6nNZ8BuM3nbJxC5zCAg5elnBUTQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "ajv": "^6.12.4",
        "debug": "^4.3.2",
        "espree": "^10.0.1",
        "globals": "^14.0.0",
        "ignore": "^5.2.0",
        "import-fresh": "^3.2.1",
        "js-yaml": "^4.1.1",
        "minimatch": "^3.1.2",
        "strip-json-comments": "^3.1.1"
      },
      "engines": {
        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
      },
      "funding": {
        "url": "https://opencollective.com/eslint"
      }
    },
    "node_modules/@eslint/eslintrc/node_modules/globals": {
      "version": "14.0.0",
      "resolved": "https://registry.npmjs.org/globals/-/globals-14.0.0.tgz",
      "integrity": "sha512-oahGvuMGQlPw/ivIYBjVSrWAfWLBeku5tpPE2fOPLi+WHffIWbuh2tCjhyQhTBPMf5E9jDEH4FOmTYgYwbKwtQ==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/@eslint/js": {
      "version": "9.39.2",
      "resolved": "https://registry.npmjs.org/@eslint/js/-/js-9.39.2.tgz",
      "integrity": "sha512-q1mjIoW1VX4IvSocvM/vbTiveKC4k9eLrajNEuSsmjymSDEbpGddtpfOoN7YGAqBK3NG+uqo8ia4PDTt8buCYA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
      },
      "funding": {
        "url": "https://eslint.org/donate"
      }
    },
    "node_modules/@eslint/object-schema": {
      "version": "2.1.7",
      "resolved": "https://registry.npmjs.org/@eslint/object-schema/-/object-schema-2.1.7.tgz",
      "integrity": "sha512-VtAOaymWVfZcmZbp6E2mympDIHvyjXs/12LqWYjVw6qjrfF+VK+fyG33kChz3nnK+SU5/NeHOqrTEHS8sXO3OA==",
      "dev": true,
      "license": "Apache-2.0",
      "engines": {
        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
      }
    },
    "node_modules/@eslint/plugin-kit": {
      "version": "0.4.1",
      "resolved": "https://registry.npmjs.org/@eslint/plugin-kit/-/plugin-kit-0.4.1.tgz",
      "integrity": "sha512-43/qtrDUokr7LJqoF2c3+RInu/t4zfrpYdoSDfYyhg52rwLV6TnOvdG4fXm7IkSB3wErkcmJS9iEhjVtOSEjjA==",
      "dev": true,
      "license": "Apache-2.0",
      "dependencies": {
        "@eslint/core": "^0.17.0",
        "levn": "^0.4.1"
      },
      "engines": {
        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
      }
    },
    "node_modules/@humanfs/core": {
      "version": "0.19.1",
      "resolved": "https://registry.npmjs.org/@humanfs/core/-/core-0.19.1.tgz",
      "integrity": "sha512-5DyQ4+1JEUzejeK1JGICcideyfUbGixgS9jNgex5nqkW+cY7WZhxBigmieN5Qnw9ZosSNVC9KQKyb+GUaGyKUA==",
      "dev": true,
      "license": "Apache-2.0",
      "engines": {
        "node": ">=18.18.0"
      }
    },
    "node_modules/@humanfs/node": {
      "version": "0.16.7",
      "resolved": "https://registry.npmjs.org/@humanfs/node/-/node-0.16.7.tgz",
      "integrity": "sha512-/zUx+yOsIrG4Y43Eh2peDeKCxlRt/gET6aHfaKpuq267qXdYDFViVHfMaLyygZOnl0kGWxFIgsBy8QFuTLUXEQ==",
      "dev": true,
      "license": "Apache-2.0",
      "dependencies": {
        "@humanfs/core": "^0.19.1",
        "@humanwhocodes/retry": "^0.4.0"
      },
      "engines": {
        "node": ">=18.18.0"
      }
    },
    "node_modules/@humanwhocodes/module-importer": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/@humanwhocodes/module-importer/-/module-importer-1.0.1.tgz",
      "integrity": "sha512-bxveV4V8v5Yb4ncFTT3rPSgZBOpCkjfK0y4oVVVJwIuDVBRMDXrPyXRL988i5ap9m9bnyEEjWfm5WkBmtffLfA==",
      "dev": true,
      "license": "Apache-2.0",
      "engines": {
        "node": ">=12.22"
      },
      "funding": {
        "type": "github",
        "url": "https://github.com/sponsors/nzakas"
      }
    },
    "node_modules/@humanwhocodes/retry": {
      "version": "0.4.3",
      "resolved": "https://registry.npmjs.org/@humanwhocodes/retry/-/retry-0.4.3.tgz",
      "integrity": "sha512-bV0Tgo9K4hfPCek+aMAn81RppFKv2ySDQeMoSZuvTASywNTnVJCArCZE2FWqpvIatKu7VMRLWlR1EazvVhDyhQ==",
      "dev": true,
      "license": "Apache-2.0",
      "engines": {
        "node": ">=18.18"
      },
      "funding": {
        "type": "github",
        "url": "https://github.com/sponsors/nzakas"
      }
    },
    "node_modules/@jridgewell/gen-mapping": {
      "version": "0.3.13",
      "resolved": "https://registry.npmjs.org/@jridgewell/gen-mapping/-/gen-mapping-0.3.13.tgz",
      "integrity": "sha512-2kkt/7niJ6MgEPxF0bYdQ6etZaA+fQvDcLKckhy1yIQOzaoKjBBjSj63/aLVjYE3qhRt5dvM+uUyfCg6UKCBbA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@jridgewell/sourcemap-codec": "^1.5.0",
        "@jridgewell/trace-mapping": "^0.3.24"
      }
    },
    "node_modules/@jridgewell/remapping": {
      "version": "2.3.5",
      "resolved": "https://registry.npmjs.org/@jridgewell/remapping/-/remapping-2.3.5.tgz",
      "integrity": "sha512-LI9u/+laYG4Ds1TDKSJW2YPrIlcVYOwi2fUC6xB43lueCjgxV4lffOCZCtYFiH6TNOX+tQKXx97T4IKHbhyHEQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@jridgewell/gen-mapping": "^0.3.5",
        "@jridgewell/trace-mapping": "^0.3.24"
      }
    },
    "node_modules/@jridgewell/resolve-uri": {
      "version": "3.1.2",
      "resolved": "https://registry.npmjs.org/@jridgewell/resolve-uri/-/resolve-uri-3.1.2.tgz",
      "integrity": "sha512-bRISgCIjP20/tbWSPWMEi54QVPRZExkuD9lJL+UIxUKtwVJA8wW1Trb1jMs1RFXo1CBTNZ/5hpC9QvmKWdopKw==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=6.0.0"
      }
    },
    "node_modules/@jridgewell/sourcemap-codec": {
      "version": "1.5.5",
      "resolved": "https://registry.npmjs.org/@jridgewell/sourcemap-codec/-/sourcemap-codec-1.5.5.tgz",
      "integrity": "sha512-cYQ9310grqxueWbl+WuIUIaiUaDcj7WOq5fVhEljNVgRfOUhY9fy2zTvfoqWsnebh8Sl70VScFbICvJnLKB0Og==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/@jridgewell/trace-mapping": {
      "version": "0.3.31",
      "resolved": "https://registry.npmjs.org/@jridgewell/trace-mapping/-/trace-mapping-0.3.31.tgz",
      "integrity": "sha512-zzNR+SdQSDJzc8joaeP8QQoCQr8NuYx2dIIytl1QeBEZHJ9uW6hebsrYgbz8hJwUQao3TWCMtmfV8Nu1twOLAw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@jridgewell/resolve-uri": "^3.1.0",
        "@jridgewell/sourcemap-codec": "^1.4.14"
      }
    },
    "node_modules/@rolldown/pluginutils": {
      "version": "1.0.0-beta.53",
      "resolved": "https://registry.npmjs.org/@rolldown/pluginutils/-/pluginutils-1.0.0-beta.53.tgz",
      "integrity": "sha512-vENRlFU4YbrwVqNDZ7fLvy+JR1CRkyr01jhSiDpE1u6py3OMzQfztQU2jxykW3ALNxO4kSlqIDeYyD0Y9RcQeQ==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/@rollup/rollup-android-arm-eabi": {
      "version": "4.57.1",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-android-arm-eabi/-/rollup-android-arm-eabi-4.57.1.tgz",
      "integrity": "sha512-A6ehUVSiSaaliTxai040ZpZ2zTevHYbvu/lDoeAteHI8QnaosIzm4qwtezfRg1jOYaUmnzLX1AOD6Z+UJjtifg==",
      "cpu": [
        "arm"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "android"
      ]
    },
    "node_modules/@rollup/rollup-android-arm64": {
      "version": "4.57.1",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-android-arm64/-/rollup-android-arm64-4.57.1.tgz",
      "integrity": "sha512-dQaAddCY9YgkFHZcFNS/606Exo8vcLHwArFZ7vxXq4rigo2bb494/xKMMwRRQW6ug7Js6yXmBZhSBRuBvCCQ3w==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "android"
      ]
    },
    "node_modules/@rollup/rollup-darwin-arm64": {
      "version": "4.57.1",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-darwin-arm64/-/rollup-darwin-arm64-4.57.1.tgz",
      "integrity": "sha512-crNPrwJOrRxagUYeMn/DZwqN88SDmwaJ8Cvi/TN1HnWBU7GwknckyosC2gd0IqYRsHDEnXf328o9/HC6OkPgOg==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ]
    },
    "node_modules/@rollup/rollup-darwin-x64": {
      "version": "4.57.1",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-darwin-x64/-/rollup-darwin-x64-4.57.1.tgz",
      "integrity": "sha512-Ji8g8ChVbKrhFtig5QBV7iMaJrGtpHelkB3lsaKzadFBe58gmjfGXAOfI5FV0lYMH8wiqsxKQ1C9B0YTRXVy4w==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ]
    },
    "node_modules/@rollup/rollup-freebsd-arm64": {
      "version": "4.57.1",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-freebsd-arm64/-/rollup-freebsd-arm64-4.57.1.tgz",
      "integrity": "sha512-R+/WwhsjmwodAcz65guCGFRkMb4gKWTcIeLy60JJQbXrJ97BOXHxnkPFrP+YwFlaS0m+uWJTstrUA9o+UchFug==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "freebsd"
      ]
    },
    "node_modules/@rollup/rollup-freebsd-x64": {
      "version": "4.57.1",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-freebsd-x64/-/rollup-freebsd-x64-4.57.1.tgz",
      "integrity": "sha512-IEQTCHeiTOnAUC3IDQdzRAGj3jOAYNr9kBguI7MQAAZK3caezRrg0GxAb6Hchg4lxdZEI5Oq3iov/w/hnFWY9Q==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "freebsd"
      ]
    },
    "node_modules/@rollup/rollup-linux-arm-gnueabihf": {
      "version": "4.57.1",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-arm-gnueabihf/-/rollup-linux-arm-gnueabihf-4.57.1.tgz",
      "integrity": "sha512-F8sWbhZ7tyuEfsmOxwc2giKDQzN3+kuBLPwwZGyVkLlKGdV1nvnNwYD0fKQ8+XS6hp9nY7B+ZeK01EBUE7aHaw==",
      "cpu": [
        "arm"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@rollup/rollup-linux-arm-musleabihf": {
      "version": "4.57.1",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-arm-musleabihf/-/rollup-linux-arm-musleabihf-4.57.1.tgz",
      "integrity": "sha512-rGfNUfn0GIeXtBP1wL5MnzSj98+PZe/AXaGBCRmT0ts80lU5CATYGxXukeTX39XBKsxzFpEeK+Mrp9faXOlmrw==",
      "cpu": [
        "arm"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@rollup/rollup-linux-arm64-gnu": {
      "version": "4.57.1",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-arm64-gnu/-/rollup-linux-arm64-gnu-4.57.1.tgz",
      "integrity": "sha512-MMtej3YHWeg/0klK2Qodf3yrNzz6CGjo2UntLvk2RSPlhzgLvYEB3frRvbEF2wRKh1Z2fDIg9KRPe1fawv7C+g==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@rollup/rollup-linux-arm64-musl": {
      "version": "4.57.1",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-arm64-musl/-/rollup-linux-arm64-musl-4.57.1.tgz",
      "integrity": "sha512-1a/qhaaOXhqXGpMFMET9VqwZakkljWHLmZOX48R0I/YLbhdxr1m4gtG1Hq7++VhVUmf+L3sTAf9op4JlhQ5u1Q==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@rollup/rollup-linux-loong64-gnu": {
      "version": "4.57.1",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-loong64-gnu/-/rollup-linux-loong64-gnu-4.57.1.tgz",
      "integrity": "sha512-QWO6RQTZ/cqYtJMtxhkRkidoNGXc7ERPbZN7dVW5SdURuLeVU7lwKMpo18XdcmpWYd0qsP1bwKPf7DNSUinhvA==",
      "cpu": [
        "loong64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@rollup/rollup-linux-loong64-musl": {
      "version": "4.57.1",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-loong64-musl/-/rollup-linux-loong64-musl-4.57.1.tgz",
      "integrity": "sha512-xpObYIf+8gprgWaPP32xiN5RVTi/s5FCR+XMXSKmhfoJjrpRAjCuuqQXyxUa/eJTdAE6eJ+KDKaoEqjZQxh3Gw==",
      "cpu": [
        "loong64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@rollup/rollup-linux-ppc64-gnu": {
      "version": "4.57.1",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-ppc64-gnu/-/rollup-linux-ppc64-gnu-4.57.1.tgz",
      "integrity": "sha512-4BrCgrpZo4hvzMDKRqEaW1zeecScDCR+2nZ86ATLhAoJ5FQ+lbHVD3ttKe74/c7tNT9c6F2viwB3ufwp01Oh2w==",
      "cpu": [
        "ppc64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@rollup/rollup-linux-ppc64-musl": {
      "version": "4.57.1",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-ppc64-musl/-/rollup-linux-ppc64-musl-4.57.1.tgz",
      "integrity": "sha512-NOlUuzesGauESAyEYFSe3QTUguL+lvrN1HtwEEsU2rOwdUDeTMJdO5dUYl/2hKf9jWydJrO9OL/XSSf65R5+Xw==",
      "cpu": [
        "ppc64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@rollup/rollup-linux-riscv64-gnu": {
      "version": "4.57.1",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-riscv64-gnu/-/rollup-linux-riscv64-gnu-4.57.1.tgz",
      "integrity": "sha512-ptA88htVp0AwUUqhVghwDIKlvJMD/fmL/wrQj99PRHFRAG6Z5nbWoWG4o81Nt9FT+IuqUQi+L31ZKAFeJ5Is+A==",
      "cpu": [
        "riscv64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@rollup/rollup-linux-riscv64-musl": {
      "version": "4.57.1",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-riscv64-musl/-/rollup-linux-riscv64-musl-4.57.1.tgz",
      "integrity": "sha512-S51t7aMMTNdmAMPpBg7OOsTdn4tySRQvklmL3RpDRyknk87+Sp3xaumlatU+ppQ+5raY7sSTcC2beGgvhENfuw==",
      "cpu": [
        "riscv64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@rollup/rollup-linux-s390x-gnu": {
      "version": "4.57.1",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-s390x-gnu/-/rollup-linux-s390x-gnu-4.57.1.tgz",
      "integrity": "sha512-Bl00OFnVFkL82FHbEqy3k5CUCKH6OEJL54KCyx2oqsmZnFTR8IoNqBF+mjQVcRCT5sB6yOvK8A37LNm/kPJiZg==",
      "cpu": [
        "s390x"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@rollup/rollup-linux-x64-gnu": {
      "version": "4.57.1",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-x64-gnu/-/rollup-linux-x64-gnu-4.57.1.tgz",
      "integrity": "sha512-ABca4ceT4N+Tv/GtotnWAeXZUZuM/9AQyCyKYyKnpk4yoA7QIAuBt6Hkgpw8kActYlew2mvckXkvx0FfoInnLg==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@rollup/rollup-linux-x64-musl": {
      "version": "4.57.1",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-x64-musl/-/rollup-linux-x64-musl-4.57.1.tgz",
      "integrity": "sha512-HFps0JeGtuOR2convgRRkHCekD7j+gdAuXM+/i6kGzQtFhlCtQkpwtNzkNj6QhCDp7DRJ7+qC/1Vg2jt5iSOFw==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@rollup/rollup-openbsd-x64": {
      "version": "4.57.1",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-openbsd-x64/-/rollup-openbsd-x64-4.57.1.tgz",
      "integrity": "sha512-H+hXEv9gdVQuDTgnqD+SQffoWoc0Of59AStSzTEj/feWTBAnSfSD3+Dql1ZruJQxmykT/JVY0dE8Ka7z0DH1hw==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "openbsd"
      ]
    },
    "node_modules/@rollup/rollup-openharmony-arm64": {
      "version": "4.57.1",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-openharmony-arm64/-/rollup-openharmony-arm64-4.57.1.tgz",
      "integrity": "sha512-4wYoDpNg6o/oPximyc/NG+mYUejZrCU2q+2w6YZqrAs2UcNUChIZXjtafAiiZSUc7On8v5NyNj34Kzj/Ltk6dQ==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "openharmony"
      ]
    },
    "node_modules/@rollup/rollup-win32-arm64-msvc": {
      "version": "4.57.1",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-win32-arm64-msvc/-/rollup-win32-arm64-msvc-4.57.1.tgz",
      "integrity": "sha512-O54mtsV/6LW3P8qdTcamQmuC990HDfR71lo44oZMZlXU4tzLrbvTii87Ni9opq60ds0YzuAlEr/GNwuNluZyMQ==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ]
    },
    "node_modules/@rollup/rollup-win32-ia32-msvc": {
      "version": "4.57.1",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-win32-ia32-msvc/-/rollup-win32-ia32-msvc-4.57.1.tgz",
      "integrity": "sha512-P3dLS+IerxCT/7D2q2FYcRdWRl22dNbrbBEtxdWhXrfIMPP9lQhb5h4Du04mdl5Woq05jVCDPCMF7Ub0NAjIew==",
      "cpu": [
        "ia32"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ]
    },
    "node_modules/@rollup/rollup-win32-x64-gnu": {
      "version": "4.57.1",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-win32-x64-gnu/-/rollup-win32-x64-gnu-4.57.1.tgz",
      "integrity": "sha512-VMBH2eOOaKGtIJYleXsi2B8CPVADrh+TyNxJ4mWPnKfLB/DBUmzW+5m1xUrcwWoMfSLagIRpjUFeW5CO5hyciQ==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ]
    },
    "node_modules/@rollup/rollup-win32-x64-msvc": {
      "version": "4.57.1",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-win32-x64-msvc/-/rollup-win32-x64-msvc-4.57.1.tgz",
      "integrity": "sha512-mxRFDdHIWRxg3UfIIAwCm6NzvxG0jDX/wBN6KsQFTvKFqqg9vTrWUE68qEjHt19A5wwx5X5aUi2zuZT7YR0jrA==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ]
    },
    "node_modules/@socket.io/component-emitter": {
      "version": "3.1.2",
      "resolved": "https://registry.npmjs.org/@socket.io/component-emitter/-/component-emitter-3.1.2.tgz",
      "integrity": "sha512-9BCxFwvbGg/RsZK9tjXd8s4UcwR0MWeFQ1XEKIQVVvAGJyINdrqKMcTRyLoK8Rse1GjzLV9cwjWV1olXRWEXVA==",
      "license": "MIT"
    },
    "node_modules/@supabase/auth-js": {
      "version": "2.95.3",
      "resolved": "https://registry.npmjs.org/@supabase/auth-js/-/auth-js-2.95.3.tgz",
      "integrity": "sha512-vD2YoS8E2iKIX0F7EwXTmqhUpaNsmbU6X2R0/NdFcs02oEfnHyNP/3M716f3wVJ2E5XHGiTFXki6lRckhJ0Thg==",
      "license": "MIT",
      "dependencies": {
        "tslib": "2.8.1"
      },
      "engines": {
        "node": ">=20.0.0"
      }
    },
    "node_modules/@supabase/functions-js": {
      "version": "2.95.3",
      "resolved": "https://registry.npmjs.org/@supabase/functions-js/-/functions-js-2.95.3.tgz",
      "integrity": "sha512-uTuOAKzs9R/IovW1krO0ZbUHSJnsnyJElTXIRhjJTqymIVGcHzkAYnBCJqd7468Fs/Foz1BQ7Dv6DCl05lr7ig==",
      "license": "MIT",
      "dependencies": {
        "tslib": "2.8.1"
      },
      "engines": {
        "node": ">=20.0.0"
      }
    },
    "node_modules/@supabase/postgrest-js": {
      "version": "2.95.3",
      "resolved": "https://registry.npmjs.org/@supabase/postgrest-js/-/postgrest-js-2.95.3.tgz",
      "integrity": "sha512-LTrRBqU1gOovxRm1vRXPItSMPBmEFqrfTqdPTRtzOILV4jPSueFz6pES5hpb4LRlkFwCPRmv3nQJ5N625V2Xrg==",
      "license": "MIT",
      "dependencies": {
        "tslib": "2.8.1"
      },
      "engines": {
        "node": ">=20.0.0"
      }
    },
    "node_modules/@supabase/realtime-js": {
      "version": "2.95.3",
      "resolved": "https://registry.npmjs.org/@supabase/realtime-js/-/realtime-js-2.95.3.tgz",
      "integrity": "sha512-D7EAtfU3w6BEUxDACjowWNJo/ZRo7sDIuhuOGKHIm9FHieGeoJV5R6GKTLtga/5l/6fDr2u+WcW/m8I9SYmaIw==",
      "license": "MIT",
      "dependencies": {
        "@types/phoenix": "^1.6.6",
        "@types/ws": "^8.18.1",
        "tslib": "2.8.1",
        "ws": "^8.18.2"
      },
      "engines": {
        "node": ">=20.0.0"
      }
    },
    "node_modules/@supabase/storage-js": {
      "version": "2.95.3",
      "resolved": "https://registry.npmjs.org/@supabase/storage-js/-/storage-js-2.95.3.tgz",
      "integrity": "sha512-4GxkJiXI3HHWjxpC3sDx1BVrV87O0hfX+wvJdqGv67KeCu+g44SPnII8y0LL/Wr677jB7tpjAxKdtVWf+xhc9A==",
      "license": "MIT",
      "dependencies": {
        "iceberg-js": "^0.8.1",
        "tslib": "2.8.1"
      },
      "engines": {
        "node": ">=20.0.0"
      }
    },
    "node_modules/@supabase/supabase-js": {
      "version": "2.95.3",
      "resolved": "https://registry.npmjs.org/@supabase/supabase-js/-/supabase-js-2.95.3.tgz",
      "integrity": "sha512-Fukw1cUTQ6xdLiHDJhKKPu6svEPaCEDvThqCne3OaQyZvuq2qjhJAd91kJu3PXLG18aooCgYBaB6qQz35hhABg==",
      "license": "MIT",
      "dependencies": {
        "@supabase/auth-js": "2.95.3",
        "@supabase/functions-js": "2.95.3",
        "@supabase/postgrest-js": "2.95.3",
        "@supabase/realtime-js": "2.95.3",
        "@supabase/storage-js": "2.95.3"
      },
      "engines": {
        "node": ">=20.0.0"
      }
    },
    "node_modules/@types/babel__core": {
      "version": "7.20.5",
      "resolved": "https://registry.npmjs.org/@types/babel__core/-/babel__core-7.20.5.tgz",
      "integrity": "sha512-qoQprZvz5wQFJwMDqeseRXWv3rqMvhgpbXFfVyWhbx9X47POIA6i/+dXefEmZKoAgOaTdaIgNSMqMIU61yRyzA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@babel/parser": "^7.20.7",
        "@babel/types": "^7.20.7",
        "@types/babel__generator": "*",
        "@types/babel__template": "*",
        "@types/babel__traverse": "*"
      }
    },
    "node_modules/@types/babel__generator": {
      "version": "7.27.0",
      "resolved": "https://registry.npmjs.org/@types/babel__generator/-/babel__generator-7.27.0.tgz",
      "integrity": "sha512-ufFd2Xi92OAVPYsy+P4n7/U7e68fex0+Ee8gSG9KX7eo084CWiQ4sdxktvdl0bOPupXtVJPY19zk6EwWqUQ8lg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@babel/types": "^7.0.0"
      }
    },
    "node_modules/@types/babel__template": {
      "version": "7.4.4",
      "resolved": "https://registry.npmjs.org/@types/babel__template/-/babel__template-7.4.4.tgz",
      "integrity": "sha512-h/NUaSyG5EyxBIp8YRxo4RMe2/qQgvyowRwVMzhYhBCONbW8PUsg4lkFMrhgZhUe5z3L3MiLDuvyJ/CaPa2A8A==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@babel/parser": "^7.1.0",
        "@babel/types": "^7.0.0"
      }
    },
    "node_modules/@types/babel__traverse": {
      "version": "7.28.0",
      "resolved": "https://registry.npmjs.org/@types/babel__traverse/-/babel__traverse-7.28.0.tgz",
      "integrity": "sha512-8PvcXf70gTDZBgt9ptxJ8elBeBjcLOAcOtoO/mPJjtji1+CdGbHgm77om1GrsPxsiE+uXIpNSK64UYaIwQXd4Q==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@babel/types": "^7.28.2"
      }
    },
    "node_modules/@types/estree": {
      "version": "1.0.8",
      "resolved": "https://registry.npmjs.org/@types/estree/-/estree-1.0.8.tgz",
      "integrity": "sha512-dWHzHa2WqEXI/O1E9OjrocMTKJl2mSrEolh1Iomrv6U+JuNwaHXsXx9bLu5gG7BUWFIN0skIQJQ/L1rIex4X6w==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/@types/json-schema": {
      "version": "7.0.15",
      "resolved": "https://registry.npmjs.org/@types/json-schema/-/json-schema-7.0.15.tgz",
      "integrity": "sha512-5+fP8P8MFNC+AyZCDxrB2pkZFPGzqQWUzpSeuuVLvm8VMcorNYavBqoFcxK8bQz4Qsbn4oUEEem4wDLfcysGHA==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/@types/node": {
      "version": "25.2.2",
      "resolved": "https://registry.npmjs.org/@types/node/-/node-25.2.2.tgz",
      "integrity": "sha512-BkmoP5/FhRYek5izySdkOneRyXYN35I860MFAGupTdebyE66uZaR+bXLHq8k4DirE5DwQi3NuhvRU1jqTVwUrQ==",
      "license": "MIT",
      "dependencies": {
        "undici-types": "~7.16.0"
      }
    },
    "node_modules/@types/phoenix": {
      "version": "1.6.7",
      "resolved": "https://registry.npmjs.org/@types/phoenix/-/phoenix-1.6.7.tgz",
      "integrity": "sha512-oN9ive//QSBkf19rfDv45M7eZPi0eEXylht2OLEXicu5b4KoQ1OzXIw+xDSGWxSxe1JmepRR/ZH283vsu518/Q==",
      "license": "MIT"
    },
    "node_modules/@types/react": {
      "version": "19.2.10",
      "resolved": "https://registry.npmjs.org/@types/react/-/react-19.2.10.tgz",
      "integrity": "sha512-WPigyYuGhgZ/cTPRXB2EwUw+XvsRA3GqHlsP4qteqrnnjDrApbS7MxcGr/hke5iUoeB7E/gQtrs9I37zAJ0Vjw==",
      "devOptional": true,
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "csstype": "^3.2.2"
      }
    },
    "node_modules/@types/react-dom": {
      "version": "19.2.3",
      "resolved": "https://registry.npmjs.org/@types/react-dom/-/react-dom-19.2.3.tgz",
      "integrity": "sha512-jp2L/eY6fn+KgVVQAOqYItbF0VY/YApe5Mz2F0aykSO8gx31bYCZyvSeYxCHKvzHG5eZjc+zyaS5BrBWya2+kQ==",
      "dev": true,
      "license": "MIT",
      "peerDependencies": {
        "@types/react": "^19.2.0"
      }
    },
    "node_modules/@types/ws": {
      "version": "8.18.1",
      "resolved": "https://registry.npmjs.org/@types/ws/-/ws-8.18.1.tgz",
      "integrity": "sha512-ThVF6DCVhA8kUGy+aazFQ4kXQ7E1Ty7A3ypFOe0IcJV8O/M511G99AW24irKrW56Wt44yG9+ij8FaqoBGkuBXg==",
      "license": "MIT",
      "dependencies": {
        "@types/node": "*"
      }
    },
    "node_modules/@vitejs/plugin-react": {
      "version": "5.1.2",
      "resolved": "https://registry.npmjs.org/@vitejs/plugin-react/-/plugin-react-5.1.2.tgz",
      "integrity": "sha512-EcA07pHJouywpzsoTUqNh5NwGayl2PPVEJKUSinGGSxFGYn+shYbqMGBg6FXDqgXum9Ou/ecb+411ssw8HImJQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@babel/core": "^7.28.5",
        "@babel/plugin-transform-react-jsx-self": "^7.27.1",
        "@babel/plugin-transform-react-jsx-source": "^7.27.1",
        "@rolldown/pluginutils": "1.0.0-beta.53",
        "@types/babel__core": "^7.20.5",
        "react-refresh": "^0.18.0"
      },
      "engines": {
        "node": "^20.19.0 || >=22.12.0"
      },
      "peerDependencies": {
        "vite": "^4.2.0 || ^5.0.0 || ^6.0.0 || ^7.0.0"
      }
    },
    "node_modules/acorn": {
      "version": "8.15.0",
      "resolved": "https://registry.npmjs.org/acorn/-/acorn-8.15.0.tgz",
      "integrity": "sha512-NZyJarBfL7nWwIq+FDL6Zp/yHEhePMNnnJ0y3qfieCrmNvYct8uvtiV41UvlSe6apAfk0fY1FbWx+NwfmpvtTg==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "bin": {
        "acorn": "bin/acorn"
      },
      "engines": {
        "node": ">=0.4.0"
      }
    },
    "node_modules/acorn-jsx": {
      "version": "5.3.2",
      "resolved": "https://registry.npmjs.org/acorn-jsx/-/acorn-jsx-5.3.2.tgz",
      "integrity": "sha512-rq9s+JNhf0IChjtDXxllJ7g41oZk5SlXtp0LHwyA5cejwn7vKmKp4pPri6YEePv2PU65sAsegbXtIinmDFDXgQ==",
      "dev": true,
      "license": "MIT",
      "peerDependencies": {
        "acorn": "^6.0.0 || ^7.0.0 || ^8.0.0"
      }
    },
    "node_modules/ajv": {
      "version": "6.12.6",
      "resolved": "https://registry.npmjs.org/ajv/-/ajv-6.12.6.tgz",
      "integrity": "sha512-j3fVLgvTo527anyYyJOGTYJbG+vnnQYvE0m5mmkc1TK+nxAppkCLMIL0aZ4dblVCNoGShhm+kzE4ZUykBoMg4g==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "fast-deep-equal": "^3.1.1",
        "fast-json-stable-stringify": "^2.0.0",
        "json-schema-traverse": "^0.4.1",
        "uri-js": "^4.2.2"
      },
      "funding": {
        "type": "github",
        "url": "https://github.com/sponsors/epoberezkin"
      }
    },
    "node_modules/ansi-styles": {
      "version": "4.3.0",
      "resolved": "https://registry.npmjs.org/ansi-styles/-/ansi-styles-4.3.0.tgz",
      "integrity": "sha512-zbB9rCJAT1rbjiVDb2hqKFHNYLxgtk8NURxZ3IZwD3F6NtxbXZQCnnSi1Lkx+IDohdPlFp222wVALIheZJQSEg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "color-convert": "^2.0.1"
      },
      "engines": {
        "node": ">=8"
      },
      "funding": {
        "url": "https://github.com/chalk/ansi-styles?sponsor=1"
      }
    },
    "node_modules/argparse": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/argparse/-/argparse-2.0.1.tgz",
      "integrity": "sha512-8+9WqebbFzpX9OR+Wa6O29asIogeRMzcGtAINdpMHHyAg10f05aSFVBbcEqGf/PXw1EjAZ+q2/bEBg3DvurK3Q==",
      "dev": true,
      "license": "Python-2.0"
    },
    "node_modules/balanced-match": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/balanced-match/-/balanced-match-1.0.2.tgz",
      "integrity": "sha512-3oSeUO0TMV67hN1AmbXsK4yaqU7tjiHlbxRDZOpH0KW9+CeX4bRAaX0Anxt0tx2MrpRpWwQaPwIlISEJhYU5Pw==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/baseline-browser-mapping": {
      "version": "2.9.19",
      "resolved": "https://registry.npmjs.org/baseline-browser-mapping/-/baseline-browser-mapping-2.9.19.tgz",
      "integrity": "sha512-ipDqC8FrAl/76p2SSWKSI+H9tFwm7vYqXQrItCuiVPt26Km0jS+NzSsBWAaBusvSbQcfJG+JitdMm+wZAgTYqg==",
      "dev": true,
      "license": "Apache-2.0",
      "bin": {
        "baseline-browser-mapping": "dist/cli.js"
      }
    },
    "node_modules/brace-expansion": {
      "version": "1.1.12",
      "resolved": "https://registry.npmjs.org/brace-expansion/-/brace-expansion-1.1.12.tgz",
      "integrity": "sha512-9T9UjW3r0UW5c1Q7GTwllptXwhvYmEzFhzMfZ9H7FQWt+uZePjZPjBP/W1ZEyZ1twGWom5/56TF4lPcqjnDHcg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "balanced-match": "^1.0.0",
        "concat-map": "0.0.1"
      }
    },
    "node_modules/browserslist": {
      "version": "4.28.1",
      "resolved": "https://registry.npmjs.org/browserslist/-/browserslist-4.28.1.tgz",
      "integrity": "sha512-ZC5Bd0LgJXgwGqUknZY/vkUQ04r8NXnJZ3yYi4vDmSiZmC/pdSN0NbNRPxZpbtO4uAfDUAFffO8IZoM3Gj8IkA==",
      "dev": true,
      "funding": [
        {
          "type": "opencollective",
          "url": "https://opencollective.com/browserslist"
        },
        {
          "type": "tidelift",
          "url": "https://tidelift.com/funding/github/npm/browserslist"
        },
        {
          "type": "github",
          "url": "https://github.com/sponsors/ai"
        }
      ],
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "baseline-browser-mapping": "^2.9.0",
        "caniuse-lite": "^1.0.30001759",
        "electron-to-chromium": "^1.5.263",
        "node-releases": "^2.0.27",
        "update-browserslist-db": "^1.2.0"
      },
      "bin": {
        "browserslist": "cli.js"
      },
      "engines": {
        "node": "^6 || ^7 || ^8 || ^9 || ^10 || ^11 || ^12 || >=13.7"
      }
    },
    "node_modules/callsites": {
      "version": "3.1.0",
      "resolved": "https://registry.npmjs.org/callsites/-/callsites-3.1.0.tgz",
      "integrity": "sha512-P8BjAsXvZS+VIDUI11hHCQEv74YT67YUi5JJFNWIqL235sBmjX4+qx9Muvls5ivyNENctx46xQLQ3aTuE7ssaQ==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/caniuse-lite": {
      "version": "1.0.30001766",
      "resolved": "https://registry.npmjs.org/caniuse-lite/-/caniuse-lite-1.0.30001766.tgz",
      "integrity": "sha512-4C0lfJ0/YPjJQHagaE9x2Elb69CIqEPZeG0anQt9SIvIoOH4a4uaRl73IavyO+0qZh6MDLH//DrXThEYKHkmYA==",
      "dev": true,
      "funding": [
        {
          "type": "opencollective",
          "url": "https://opencollective.com/browserslist"
        },
        {
          "type": "tidelift",
          "url": "https://tidelift.com/funding/github/npm/caniuse-lite"
        },
        {
          "type": "github",
          "url": "https://github.com/sponsors/ai"
        }
      ],
      "license": "CC-BY-4.0"
    },
    "node_modules/chalk": {
      "version": "4.1.2",
      "resolved": "https://registry.npmjs.org/chalk/-/chalk-4.1.2.tgz",
      "integrity": "sha512-oKnbhFyRIXpUuez8iBMmyEa4nbj4IOQyuhc/wy9kY7/WVPcwIO9VA668Pu8RkO7+0G76SLROeyw9CpQ061i4mA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "ansi-styles": "^4.1.0",
        "supports-color": "^7.1.0"
      },
      "engines": {
        "node": ">=10"
      },
      "funding": {
        "url": "https://github.com/chalk/chalk?sponsor=1"
      }
    },
    "node_modules/color-convert": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/color-convert/-/color-convert-2.0.1.tgz",
      "integrity": "sha512-RRECPsj7iu/xb5oKYcsFHSppFNnsj/52OVTRKb4zP5onXwVF3zVmmToNcOfGC+CRDpfK/U584fMg38ZHCaElKQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "color-name": "~1.1.4"
      },
      "engines": {
        "node": ">=7.0.0"
      }
    },
    "node_modules/color-name": {
      "version": "1.1.4",
      "resolved": "https://registry.npmjs.org/color-name/-/color-name-1.1.4.tgz",
      "integrity": "sha512-dOy+3AuW3a2wNbZHIuMZpTcgjGuLU/uBL/ubcZF9OXbDo8ff4O8yVp5Bf0efS8uEoYo5q4Fx7dY9OgQGXgAsQA==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/concat-map": {
      "version": "0.0.1",
      "resolved": "https://registry.npmjs.org/concat-map/-/concat-map-0.0.1.tgz",
      "integrity": "sha512-/Srv4dswyQNBfohGpz9o6Yb3Gz3SrUDqBH5rTuhGR7ahtlbYKnVxw2bCFMRljaA7EXHaXZ8wsHdodFvbkhKmqg==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/convert-source-map": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/convert-source-map/-/convert-source-map-2.0.0.tgz",
      "integrity": "sha512-Kvp459HrV2FEJ1CAsi1Ku+MY3kasH19TFykTz2xWmMeq6bk2NU3XXvfJ+Q61m0xktWwt+1HSYf3JZsTms3aRJg==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/cross-spawn": {
      "version": "7.0.6",
      "resolved": "https://registry.npmjs.org/cross-spawn/-/cross-spawn-7.0.6.tgz",
      "integrity": "sha512-uV2QOWP2nWzsy2aMp8aRibhi9dlzF5Hgh5SHaB9OiTGEyDTiJJyx0uy51QXdyWbtAHNua4XJzUKca3OzKUd3vA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "path-key": "^3.1.0",
        "shebang-command": "^2.0.0",
        "which": "^2.0.1"
      },
      "engines": {
        "node": ">= 8"
      }
    },
    "node_modules/csstype": {
      "version": "3.2.3",
      "resolved": "https://registry.npmjs.org/csstype/-/csstype-3.2.3.tgz",
      "integrity": "sha512-z1HGKcYy2xA8AGQfwrn0PAy+PB7X/GSj3UVJW9qKyn43xWa+gl5nXmU4qqLMRzWVLFC8KusUX8T/0kCiOYpAIQ==",
      "devOptional": true,
      "license": "MIT"
    },
    "node_modules/debug": {
      "version": "4.4.3",
      "resolved": "https://registry.npmjs.org/debug/-/debug-4.4.3.tgz",
      "integrity": "sha512-RGwwWnwQvkVfavKVt22FGLw+xYSdzARwm0ru6DhTVA3umU5hZc28V3kO4stgYryrTlLpuvgI9GiijltAjNbcqA==",
      "license": "MIT",
      "dependencies": {
        "ms": "^2.1.3"
      },
      "engines": {
        "node": ">=6.0"
      },
      "peerDependenciesMeta": {
        "supports-color": {
          "optional": true
        }
      }
    },
    "node_modules/deep-is": {
      "version": "0.1.4",
      "resolved": "https://registry.npmjs.org/deep-is/-/deep-is-0.1.4.tgz",
      "integrity": "sha512-oIPzksmTg4/MriiaYGO+okXDT7ztn/w3Eptv/+gSIdMdKsJo0u4CfYNFJPy+4SKMuCqGw2wxnA+URMg3t8a/bQ==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/electron-to-chromium": {
      "version": "1.5.283",
      "resolved": "https://registry.npmjs.org/electron-to-chromium/-/electron-to-chromium-1.5.283.tgz",
      "integrity": "sha512-3vifjt1HgrGW/h76UEeny+adYApveS9dH2h3p57JYzBSXJIKUJAvtmIytDKjcSCt9xHfrNCFJ7gts6vkhuq++w==",
      "dev": true,
      "license": "ISC"
    },
    "node_modules/engine.io-client": {
      "version": "6.6.4",
      "resolved": "https://registry.npmjs.org/engine.io-client/-/engine.io-client-6.6.4.tgz",
      "integrity": "sha512-+kjUJnZGwzewFDw951CDWcwj35vMNf2fcj7xQWOctq1F2i1jkDdVvdFG9kM/BEChymCH36KgjnW0NsL58JYRxw==",
      "license": "MIT",
      "dependencies": {
        "@socket.io/component-emitter": "~3.1.0",
        "debug": "~4.4.1",
        "engine.io-parser": "~5.2.1",
        "ws": "~8.18.3",
        "xmlhttprequest-ssl": "~2.1.1"
      }
    },
    "node_modules/engine.io-client/node_modules/ws": {
      "version": "8.18.3",
      "resolved": "https://registry.npmjs.org/ws/-/ws-8.18.3.tgz",
      "integrity": "sha512-PEIGCY5tSlUt50cqyMXfCzX+oOPqN0vuGqWzbcJ2xvnkzkq46oOpz7dQaTDBdfICb4N14+GARUDw2XV2N4tvzg==",
      "license": "MIT",
      "engines": {
        "node": ">=10.0.0"
      },
      "peerDependencies": {
        "bufferutil": "^4.0.1",
        "utf-8-validate": ">=5.0.2"
      },
      "peerDependenciesMeta": {
        "bufferutil": {
          "optional": true
        },
        "utf-8-validate": {
          "optional": true
        }
      }
    },
    "node_modules/engine.io-parser": {
      "version": "5.2.3",
      "resolved": "https://registry.npmjs.org/engine.io-parser/-/engine.io-parser-5.2.3.tgz",
      "integrity": "sha512-HqD3yTBfnBxIrbnM1DoD6Pcq8NECnh8d4As1Qgh0z5Gg3jRRIqijury0CL3ghu/edArpUYiYqQiDUQBIs4np3Q==",
      "license": "MIT",
      "engines": {
        "node": ">=10.0.0"
      }
    },
    "node_modules/esbuild": {
      "version": "0.27.2",
      "resolved": "https://registry.npmjs.org/esbuild/-/esbuild-0.27.2.tgz",
      "integrity": "sha512-HyNQImnsOC7X9PMNaCIeAm4ISCQXs5a5YasTXVliKv4uuBo1dKrG0A+uQS8M5eXjVMnLg3WgXaKvprHlFJQffw==",
      "dev": true,
      "hasInstallScript": true,
      "license": "MIT",
      "bin": {
        "esbuild": "bin/esbuild"
      },
      "engines": {
        "node": ">=18"
      },
      "optionalDependencies": {
        "@esbuild/aix-ppc64": "0.27.2",
        "@esbuild/android-arm": "0.27.2",
        "@esbuild/android-arm64": "0.27.2",
        "@esbuild/android-x64": "0.27.2",
        "@esbuild/darwin-arm64": "0.27.2",
        "@esbuild/darwin-x64": "0.27.2",
        "@esbuild/freebsd-arm64": "0.27.2",
        "@esbuild/freebsd-x64": "0.27.2",
        "@esbuild/linux-arm": "0.27.2",
        "@esbuild/linux-arm64": "0.27.2",
        "@esbuild/linux-ia32": "0.27.2",
        "@esbuild/linux-loong64": "0.27.2",
        "@esbuild/linux-mips64el": "0.27.2",
        "@esbuild/linux-ppc64": "0.27.2",
        "@esbuild/linux-riscv64": "0.27.2",
        "@esbuild/linux-s390x": "0.27.2",
        "@esbuild/linux-x64": "0.27.2",
        "@esbuild/netbsd-arm64": "0.27.2",
        "@esbuild/netbsd-x64": "0.27.2",
        "@esbuild/openbsd-arm64": "0.27.2",
        "@esbuild/openbsd-x64": "0.27.2",
        "@esbuild/openharmony-arm64": "0.27.2",
        "@esbuild/sunos-x64": "0.27.2",
        "@esbuild/win32-arm64": "0.27.2",
        "@esbuild/win32-ia32": "0.27.2",
        "@esbuild/win32-x64": "0.27.2"
      }
    },
    "node_modules/escalade": {
      "version": "3.2.0",
      "resolved": "https://registry.npmjs.org/escalade/-/escalade-3.2.0.tgz",
      "integrity": "sha512-WUj2qlxaQtO4g6Pq5c29GTcWGDyd8itL8zTlipgECz3JesAiiOKotd8JU6otB3PACgG6xkJUyVhboMS+bje/jA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/escape-string-regexp": {
      "version": "4.0.0",
      "resolved": "https://registry.npmjs.org/escape-string-regexp/-/escape-string-regexp-4.0.0.tgz",
      "integrity": "sha512-TtpcNJ3XAzx3Gq8sWRzJaVajRs0uVxA2YAkdb1jm2YkPz4G6egUFAyA3n5vtEIZefPk5Wa4UXbKuS5fKkJWdgA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=10"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/eslint": {
      "version": "9.39.2",
      "resolved": "https://registry.npmjs.org/eslint/-/eslint-9.39.2.tgz",
      "integrity": "sha512-LEyamqS7W5HB3ujJyvi0HQK/dtVINZvd5mAAp9eT5S/ujByGjiZLCzPcHVzuXbpJDJF/cxwHlfceVUDZ2lnSTw==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "@eslint-community/eslint-utils": "^4.8.0",
        "@eslint-community/regexpp": "^4.12.1",
        "@eslint/config-array": "^0.21.1",
        "@eslint/config-helpers": "^0.4.2",
        "@eslint/core": "^0.17.0",
        "@eslint/eslintrc": "^3.3.1",
        "@eslint/js": "9.39.2",
        "@eslint/plugin-kit": "^0.4.1",
        "@humanfs/node": "^0.16.6",
        "@humanwhocodes/module-importer": "^1.0.1",
        "@humanwhocodes/retry": "^0.4.2",
        "@types/estree": "^1.0.6",
        "ajv": "^6.12.4",
        "chalk": "^4.0.0",
        "cross-spawn": "^7.0.6",
        "debug": "^4.3.2",
        "escape-string-regexp": "^4.0.0",
        "eslint-scope": "^8.4.0",
        "eslint-visitor-keys": "^4.2.1",
        "espree": "^10.4.0",
        "esquery": "^1.5.0",
        "esutils": "^2.0.2",
        "fast-deep-equal": "^3.1.3",
        "file-entry-cache": "^8.0.0",
        "find-up": "^5.0.0",
        "glob-parent": "^6.0.2",
        "ignore": "^5.2.0",
        "imurmurhash": "^0.1.4",
        "is-glob": "^4.0.0",
        "json-stable-stringify-without-jsonify": "^1.0.1",
        "lodash.merge": "^4.6.2",
        "minimatch": "^3.1.2",
        "natural-compare": "^1.4.0",
        "optionator": "^0.9.3"
      },
      "bin": {
        "eslint": "bin/eslint.js"
      },
      "engines": {
        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
      },
      "funding": {
        "url": "https://eslint.org/donate"
      },
      "peerDependencies": {
        "jiti": "*"
      },
      "peerDependenciesMeta": {
        "jiti": {
          "optional": true
        }
      }
    },
    "node_modules/eslint-plugin-react-hooks": {
      "version": "7.0.1",
      "resolved": "https://registry.npmjs.org/eslint-plugin-react-hooks/-/eslint-plugin-react-hooks-7.0.1.tgz",
      "integrity": "sha512-O0d0m04evaNzEPoSW+59Mezf8Qt0InfgGIBJnpC0h3NH/WjUAR7BIKUfysC6todmtiZ/A0oUVS8Gce0WhBrHsA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@babel/core": "^7.24.4",
        "@babel/parser": "^7.24.4",
        "hermes-parser": "^0.25.1",
        "zod": "^3.25.0 || ^4.0.0",
        "zod-validation-error": "^3.5.0 || ^4.0.0"
      },
      "engines": {
        "node": ">=18"
      },
      "peerDependencies": {
        "eslint": "^3.0.0 || ^4.0.0 || ^5.0.0 || ^6.0.0 || ^7.0.0 || ^8.0.0-0 || ^9.0.0"
      }
    },
    "node_modules/eslint-plugin-react-refresh": {
      "version": "0.4.26",
      "resolved": "https://registry.npmjs.org/eslint-plugin-react-refresh/-/eslint-plugin-react-refresh-0.4.26.tgz",
      "integrity": "sha512-1RETEylht2O6FM/MvgnyvT+8K21wLqDNg4qD51Zj3guhjt433XbnnkVttHMyaVyAFD03QSV4LPS5iE3VQmO7XQ==",
      "dev": true,
      "license": "MIT",
      "peerDependencies": {
        "eslint": ">=8.40"
      }
    },
    "node_modules/eslint-scope": {
      "version": "8.4.0",
      "resolved": "https://registry.npmjs.org/eslint-scope/-/eslint-scope-8.4.0.tgz",
      "integrity": "sha512-sNXOfKCn74rt8RICKMvJS7XKV/Xk9kA7DyJr8mJik3S7Cwgy3qlkkmyS2uQB3jiJg6VNdZd/pDBJu0nvG2NlTg==",
      "dev": true,
      "license": "BSD-2-Clause",
      "dependencies": {
        "esrecurse": "^4.3.0",
        "estraverse": "^5.2.0"
      },
      "engines": {
        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
      },
      "funding": {
        "url": "https://opencollective.com/eslint"
      }
    },
    "node_modules/eslint-visitor-keys": {
      "version": "4.2.1",
      "resolved": "https://registry.npmjs.org/eslint-visitor-keys/-/eslint-visitor-keys-4.2.1.tgz",
      "integrity": "sha512-Uhdk5sfqcee/9H/rCOJikYz67o0a2Tw2hGRPOG2Y1R2dg7brRe1uG0yaNQDHu+TO/uQPF/5eCapvYSmHUjt7JQ==",
      "dev": true,
      "license": "Apache-2.0",
      "engines": {
        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
      },
      "funding": {
        "url": "https://opencollective.com/eslint"
      }
    },
    "node_modules/espree": {
      "version": "10.4.0",
      "resolved": "https://registry.npmjs.org/espree/-/espree-10.4.0.tgz",
      "integrity": "sha512-j6PAQ2uUr79PZhBjP5C5fhl8e39FmRnOjsD5lGnWrFU8i2G776tBK7+nP8KuQUTTyAZUwfQqXAgrVH5MbH9CYQ==",
      "dev": true,
      "license": "BSD-2-Clause",
      "dependencies": {
        "acorn": "^8.15.0",
        "acorn-jsx": "^5.3.2",
        "eslint-visitor-keys": "^4.2.1"
      },
      "engines": {
        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
      },
      "funding": {
        "url": "https://opencollective.com/eslint"
      }
    },
    "node_modules/esquery": {
      "version": "1.7.0",
      "resolved": "https://registry.npmjs.org/esquery/-/esquery-1.7.0.tgz",
      "integrity": "sha512-Ap6G0WQwcU/LHsvLwON1fAQX9Zp0A2Y6Y/cJBl9r/JbW90Zyg4/zbG6zzKa2OTALELarYHmKu0GhpM5EO+7T0g==",
      "dev": true,
      "license": "BSD-3-Clause",
      "dependencies": {
        "estraverse": "^5.1.0"
      },
      "engines": {
        "node": ">=0.10"
      }
    },
    "node_modules/esrecurse": {
      "version": "4.3.0",
      "resolved": "https://registry.npmjs.org/esrecurse/-/esrecurse-4.3.0.tgz",
      "integrity": "sha512-KmfKL3b6G+RXvP8N1vr3Tq1kL/oCFgn2NYXEtqP8/L3pKapUA4G8cFVaoF3SU323CD4XypR/ffioHmkti6/Tag==",
      "dev": true,
      "license": "BSD-2-Clause",
      "dependencies": {
        "estraverse": "^5.2.0"
      },
      "engines": {
        "node": ">=4.0"
      }
    },
    "node_modules/estraverse": {
      "version": "5.3.0",
      "resolved": "https://registry.npmjs.org/estraverse/-/estraverse-5.3.0.tgz",
      "integrity": "sha512-MMdARuVEQziNTeJD8DgMqmhwR11BRQ/cBP+pLtYdSTnf3MIO8fFeiINEbX36ZdNlfU/7A9f3gUw49B3oQsvwBA==",
      "dev": true,
      "license": "BSD-2-Clause",
      "engines": {
        "node": ">=4.0"
      }
    },
    "node_modules/esutils": {
      "version": "2.0.3",
      "resolved": "https://registry.npmjs.org/esutils/-/esutils-2.0.3.tgz",
      "integrity": "sha512-kVscqXk4OCp68SZ0dkgEKVi6/8ij300KBWTJq32P/dYeWTSwK41WyTxalN1eRmA5Z9UU/LX9D7FWSmV9SAYx6g==",
      "dev": true,
      "license": "BSD-2-Clause",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/fast-deep-equal": {
      "version": "3.1.3",
      "resolved": "https://registry.npmjs.org/fast-deep-equal/-/fast-deep-equal-3.1.3.tgz",
      "integrity": "sha512-f3qQ9oQy9j2AhBe/H9VC91wLmKBCCU/gDOnKNAYG5hswO7BLKj09Hc5HYNz9cGI++xlpDCIgDaitVs03ATR84Q==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/fast-json-stable-stringify": {
      "version": "2.1.0",
      "resolved": "https://registry.npmjs.org/fast-json-stable-stringify/-/fast-json-stable-stringify-2.1.0.tgz",
      "integrity": "sha512-lhd/wF+Lk98HZoTCtlVraHtfh5XYijIjalXck7saUtuanSDyLMxnHhSXEDJqHxD7msR8D0uCmqlkwjCV8xvwHw==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/fast-levenshtein": {
      "version": "2.0.6",
      "resolved": "https://registry.npmjs.org/fast-levenshtein/-/fast-levenshtein-2.0.6.tgz",
      "integrity": "sha512-DCXu6Ifhqcks7TZKY3Hxp3y6qphY5SJZmrWMDrKcERSOXWQdMhU9Ig/PYrzyw/ul9jOIyh0N4M0tbC5hodg8dw==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/fdir": {
      "version": "6.5.0",
      "resolved": "https://registry.npmjs.org/fdir/-/fdir-6.5.0.tgz",
      "integrity": "sha512-tIbYtZbucOs0BRGqPJkshJUYdL+SDH7dVM8gjy+ERp3WAUjLEFJE+02kanyHtwjWOnwrKYBiwAmM0p4kLJAnXg==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=12.0.0"
      },
      "peerDependencies": {
        "picomatch": "^3 || ^4"
      },
      "peerDependenciesMeta": {
        "picomatch": {
          "optional": true
        }
      }
    },
    "node_modules/file-entry-cache": {
      "version": "8.0.0",
      "resolved": "https://registry.npmjs.org/file-entry-cache/-/file-entry-cache-8.0.0.tgz",
      "integrity": "sha512-XXTUwCvisa5oacNGRP9SfNtYBNAMi+RPwBFmblZEF7N7swHYQS6/Zfk7SRwx4D5j3CH211YNRco1DEMNVfZCnQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "flat-cache": "^4.0.0"
      },
      "engines": {
        "node": ">=16.0.0"
      }
    },
    "node_modules/find-up": {
      "version": "5.0.0",
      "resolved": "https://registry.npmjs.org/find-up/-/find-up-5.0.0.tgz",
      "integrity": "sha512-78/PXT1wlLLDgTzDs7sjq9hzz0vXD+zn+7wypEe4fXQxCmdmqfGsEPQxmiCSQI3ajFV91bVSsvNtrJRiW6nGng==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "locate-path": "^6.0.0",
        "path-exists": "^4.0.0"
      },
      "engines": {
        "node": ">=10"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/flat-cache": {
      "version": "4.0.1",
      "resolved": "https://registry.npmjs.org/flat-cache/-/flat-cache-4.0.1.tgz",
      "integrity": "sha512-f7ccFPK3SXFHpx15UIGyRJ/FJQctuKZ0zVuN3frBo4HnK3cay9VEW0R6yPYFHC0AgqhukPzKjq22t5DmAyqGyw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "flatted": "^3.2.9",
        "keyv": "^4.5.4"
      },
      "engines": {
        "node": ">=16"
      }
    },
    "node_modules/flatted": {
      "version": "3.3.3",
      "resolved": "https://registry.npmjs.org/flatted/-/flatted-3.3.3.tgz",
      "integrity": "sha512-GX+ysw4PBCz0PzosHDepZGANEuFCMLrnRTiEy9McGjmkCQYwRq4A/X786G/fjM/+OjsWSU1ZrY5qyARZmO/uwg==",
      "dev": true,
      "license": "ISC"
    },
    "node_modules/fsevents": {
      "version": "2.3.3",
      "resolved": "https://registry.npmjs.org/fsevents/-/fsevents-2.3.3.tgz",
      "integrity": "sha512-5xoDfX+fL7faATnagmWPpbFtwh/R77WmMMqqHGS65C3vvB0YHrgF+B1YmZ3441tMj5n63k0212XNoJwzlhffQw==",
      "dev": true,
      "hasInstallScript": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": "^8.16.0 || ^10.6.0 || >=11.0.0"
      }
    },
    "node_modules/gensync": {
      "version": "1.0.0-beta.2",
      "resolved": "https://registry.npmjs.org/gensync/-/gensync-1.0.0-beta.2.tgz",
      "integrity": "sha512-3hN7NaskYvMDLQY55gnW3NQ+mesEAepTqlg+VEbj7zzqEMBVNhzcGYYeqFo/TlYz6eQiFcp1HcsCZO+nGgS8zg==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/glob-parent": {
      "version": "6.0.2",
      "resolved": "https://registry.npmjs.org/glob-parent/-/glob-parent-6.0.2.tgz",
      "integrity": "sha512-XxwI8EOhVQgWp6iDL+3b0r86f4d6AX6zSU55HfB4ydCEuXLXc5FcYeOu+nnGftS4TEju/11rt4KJPTMgbfmv4A==",
      "dev": true,
      "license": "ISC",
      "dependencies": {
        "is-glob": "^4.0.3"
      },
      "engines": {
        "node": ">=10.13.0"
      }
    },
    "node_modules/globals": {
      "version": "16.5.0",
      "resolved": "https://registry.npmjs.org/globals/-/globals-16.5.0.tgz",
      "integrity": "sha512-c/c15i26VrJ4IRt5Z89DnIzCGDn9EcebibhAOjw5ibqEHsE1wLUgkPn9RDmNcUKyU87GeaL633nyJ+pplFR2ZQ==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/has-flag": {
      "version": "4.0.0",
      "resolved": "https://registry.npmjs.org/has-flag/-/has-flag-4.0.0.tgz",
      "integrity": "sha512-EykJT/Q1KjTWctppgIAgfSO0tKVuZUjhgMr17kqTumMl6Afv3EISleU7qZUzoXDFTAHTDC4NOoG/ZxU3EvlMPQ==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/hermes-estree": {
      "version": "0.25.1",
      "resolved": "https://registry.npmjs.org/hermes-estree/-/hermes-estree-0.25.1.tgz",
      "integrity": "sha512-0wUoCcLp+5Ev5pDW2OriHC2MJCbwLwuRx+gAqMTOkGKJJiBCLjtrvy4PWUGn6MIVefecRpzoOZ/UV6iGdOr+Cw==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/hermes-parser": {
      "version": "0.25.1",
      "resolved": "https://registry.npmjs.org/hermes-parser/-/hermes-parser-0.25.1.tgz",
      "integrity": "sha512-6pEjquH3rqaI6cYAXYPcz9MS4rY6R4ngRgrgfDshRptUZIc3lw0MCIJIGDj9++mfySOuPTHB4nrSW99BCvOPIA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "hermes-estree": "0.25.1"
      }
    },
    "node_modules/iceberg-js": {
      "version": "0.8.1",
      "resolved": "https://registry.npmjs.org/iceberg-js/-/iceberg-js-0.8.1.tgz",
      "integrity": "sha512-1dhVQZXhcHje7798IVM+xoo/1ZdVfzOMIc8/rgVSijRK38EDqOJoGula9N/8ZI5RD8QTxNQtK/Gozpr+qUqRRA==",
      "license": "MIT",
      "engines": {
        "node": ">=20.0.0"
      }
    },
    "node_modules/ignore": {
      "version": "5.3.2",
      "resolved": "https://registry.npmjs.org/ignore/-/ignore-5.3.2.tgz",
      "integrity": "sha512-hsBTNUqQTDwkWtcdYI2i06Y/nUBEsNEDJKjWdigLvegy8kDuJAS8uRlpkkcQpyEXL0Z/pjDy5HBmMjRCJ2gq+g==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 4"
      }
    },
    "node_modules/import-fresh": {
      "version": "3.3.1",
      "resolved": "https://registry.npmjs.org/import-fresh/-/import-fresh-3.3.1.tgz",
      "integrity": "sha512-TR3KfrTZTYLPB6jUjfx6MF9WcWrHL9su5TObK4ZkYgBdWKPOFoSoQIdEuTuR82pmtxH2spWG9h6etwfr1pLBqQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "parent-module": "^1.0.0",
        "resolve-from": "^4.0.0"
      },
      "engines": {
        "node": ">=6"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/imurmurhash": {
      "version": "0.1.4",
      "resolved": "https://registry.npmjs.org/imurmurhash/-/imurmurhash-0.1.4.tgz",
      "integrity": "sha512-JmXMZ6wuvDmLiHEml9ykzqO6lwFbof0GG4IkcGaENdCRDDmMVnny7s5HsIgHCbaq0w2MyPhDqkhTUgS2LU2PHA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=0.8.19"
      }
    },
    "node_modules/is-extglob": {
      "version": "2.1.1",
      "resolved": "https://registry.npmjs.org/is-extglob/-/is-extglob-2.1.1.tgz",
      "integrity": "sha512-SbKbANkN603Vi4jEZv49LeVJMn4yGwsbzZworEoyEiutsN3nJYdbO36zfhGJ6QEDpOZIFkDtnq5JRxmvl3jsoQ==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/is-glob": {
      "version": "4.0.3",
      "resolved": "https://registry.npmjs.org/is-glob/-/is-glob-4.0.3.tgz",
      "integrity": "sha512-xelSayHH36ZgE7ZWhli7pW34hNbNl8Ojv5KVmkJD4hBdD3th8Tfk9vYasLM+mXWOZhFkgZfxhLSnrwRr4elSSg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "is-extglob": "^2.1.1"
      },
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/isexe": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/isexe/-/isexe-2.0.0.tgz",
      "integrity": "sha512-RHxMLp9lnKHGHRng9QFhRCMbYAcVpn69smSGcq3f36xjgVVWThj4qqLbTLlq7Ssj8B+fIQ1EuCEGI2lKsyQeIw==",
      "dev": true,
      "license": "ISC"
    },
    "node_modules/js-tokens": {
      "version": "4.0.0",
      "resolved": "https://registry.npmjs.org/js-tokens/-/js-tokens-4.0.0.tgz",
      "integrity": "sha512-RdJUflcE3cUzKiMqQgsCu06FPu9UdIJO0beYbPhHN4k6apgJtifcoCtT9bcxOpYBtpD2kCM6Sbzg4CausW/PKQ==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/js-yaml": {
      "version": "4.1.1",
      "resolved": "https://registry.npmjs.org/js-yaml/-/js-yaml-4.1.1.tgz",
      "integrity": "sha512-qQKT4zQxXl8lLwBtHMWwaTcGfFOZviOJet3Oy/xmGk2gZH677CJM9EvtfdSkgWcATZhj/55JZ0rmy3myCT5lsA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "argparse": "^2.0.1"
      },
      "bin": {
        "js-yaml": "bin/js-yaml.js"
      }
    },
    "node_modules/jsesc": {
      "version": "3.1.0",
      "resolved": "https://registry.npmjs.org/jsesc/-/jsesc-3.1.0.tgz",
      "integrity": "sha512-/sM3dO2FOzXjKQhJuo0Q173wf2KOo8t4I8vHy6lF9poUp7bKT0/NHE8fPX23PwfhnykfqnC2xRxOnVw5XuGIaA==",
      "dev": true,
      "license": "MIT",
      "bin": {
        "jsesc": "bin/jsesc"
      },
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/json-buffer": {
      "version": "3.0.1",
      "resolved": "https://registry.npmjs.org/json-buffer/-/json-buffer-3.0.1.tgz",
      "integrity": "sha512-4bV5BfR2mqfQTJm+V5tPPdf+ZpuhiIvTuAB5g8kcrXOZpTT/QwwVRWBywX1ozr6lEuPdbHxwaJlm9G6mI2sfSQ==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/json-schema-traverse": {
      "version": "0.4.1",
      "resolved": "https://registry.npmjs.org/json-schema-traverse/-/json-schema-traverse-0.4.1.tgz",
      "integrity": "sha512-xbbCH5dCYU5T8LcEhhuh7HJ88HXuW3qsI3Y0zOZFKfZEHcpWiHU/Jxzk629Brsab/mMiHQti9wMP+845RPe3Vg==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/json-stable-stringify-without-jsonify": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/json-stable-stringify-without-jsonify/-/json-stable-stringify-without-jsonify-1.0.1.tgz",
      "integrity": "sha512-Bdboy+l7tA3OGW6FjyFHWkP5LuByj1Tk33Ljyq0axyzdk9//JSi2u3fP1QSmd1KNwq6VOKYGlAu87CisVir6Pw==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/json5": {
      "version": "2.2.3",
      "resolved": "https://registry.npmjs.org/json5/-/json5-2.2.3.tgz",
      "integrity": "sha512-XmOWe7eyHYH14cLdVPoyg+GOH3rYX++KpzrylJwSW98t3Nk+U8XOl8FWKOgwtzdb8lXGf6zYwDUzeHMWfxasyg==",
      "dev": true,
      "license": "MIT",
      "bin": {
        "json5": "lib/cli.js"
      },
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/keyv": {
      "version": "4.5.4",
      "resolved": "https://registry.npmjs.org/keyv/-/keyv-4.5.4.tgz",
      "integrity": "sha512-oxVHkHR/EJf2CNXnWxRLW6mg7JyCCUcG0DtEGmL2ctUo1PNTin1PUil+r/+4r5MpVgC/fn1kjsx7mjSujKqIpw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "json-buffer": "3.0.1"
      }
    },
    "node_modules/levn": {
      "version": "0.4.1",
      "resolved": "https://registry.npmjs.org/levn/-/levn-0.4.1.tgz",
      "integrity": "sha512-+bT2uH4E5LGE7h/n3evcS/sQlJXCpIp6ym8OWJ5eV6+67Dsql/LaaT7qJBAt2rzfoa/5QBGBhxDix1dMt2kQKQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "prelude-ls": "^1.2.1",
        "type-check": "~0.4.0"
      },
      "engines": {
        "node": ">= 0.8.0"
      }
    },
    "node_modules/locate-path": {
      "version": "6.0.0",
      "resolved": "https://registry.npmjs.org/locate-path/-/locate-path-6.0.0.tgz",
      "integrity": "sha512-iPZK6eYjbxRu3uB4/WZ3EsEIMJFMqAoopl3R+zuq0UjcAm/MO6KCweDgPfP3elTztoKP3KtnVHxTn2NHBSDVUw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "p-locate": "^5.0.0"
      },
      "engines": {
        "node": ">=10"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/lodash.merge": {
      "version": "4.6.2",
      "resolved": "https://registry.npmjs.org/lodash.merge/-/lodash.merge-4.6.2.tgz",
      "integrity": "sha512-0KpjqXRVvrYyCsX1swR/XTK0va6VQkQM6MNo7PqW77ByjAhoARA8EfrP1N4+KlKj8YS0ZUCtRT/YUuhyYDujIQ==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/lru-cache": {
      "version": "5.1.1",
      "resolved": "https://registry.npmjs.org/lru-cache/-/lru-cache-5.1.1.tgz",
      "integrity": "sha512-KpNARQA3Iwv+jTA0utUVVbrh+Jlrr1Fv0e56GGzAFOXN7dk/FviaDW8LHmK52DlcH4WP2n6gI8vN1aesBFgo9w==",
      "dev": true,
      "license": "ISC",
      "dependencies": {
        "yallist": "^3.0.2"
      }
    },
    "node_modules/lucide-react": {
      "version": "0.563.0",
      "resolved": "https://registry.npmjs.org/lucide-react/-/lucide-react-0.563.0.tgz",
      "integrity": "sha512-8dXPB2GI4dI8jV4MgUDGBeLdGk8ekfqVZ0BdLcrRzocGgG75ltNEmWS+gE7uokKF/0oSUuczNDT+g9hFJ23FkA==",
      "license": "ISC",
      "peerDependencies": {
        "react": "^16.5.1 || ^17.0.0 || ^18.0.0 || ^19.0.0"
      }
    },
    "node_modules/minimatch": {
      "version": "3.1.2",
      "resolved": "https://registry.npmjs.org/minimatch/-/minimatch-3.1.2.tgz",
      "integrity": "sha512-J7p63hRiAjw1NDEww1W7i37+ByIrOWO5XQQAzZ3VOcL0PNybwpfmV/N05zFAzwQ9USyEcX6t3UO+K5aqBQOIHw==",
      "dev": true,
      "license": "ISC",
      "dependencies": {
        "brace-expansion": "^1.1.7"
      },
      "engines": {
        "node": "*"
      }
    },
    "node_modules/ms": {
      "version": "2.1.3",
      "resolved": "https://registry.npmjs.org/ms/-/ms-2.1.3.tgz",
      "integrity": "sha512-6FlzubTLZG3J2a/NVCAleEhjzq5oxgHyaCU9yYXvcLsvoVaHJq/s5xXI6/XXP6tz7R9xAOtHnSO/tXtF3WRTlA==",
      "license": "MIT"
    },
    "node_modules/nanoid": {
      "version": "3.3.11",
      "resolved": "https://registry.npmjs.org/nanoid/-/nanoid-3.3.11.tgz",
      "integrity": "sha512-N8SpfPUnUp1bK+PMYW8qSWdl9U+wwNWI4QKxOYDy9JAro3WMX7p2OeVRF9v+347pnakNevPmiHhNmZ2HbFA76w==",
      "dev": true,
      "funding": [
        {
          "type": "github",
          "url": "https://github.com/sponsors/ai"
        }
      ],
      "license": "MIT",
      "bin": {
        "nanoid": "bin/nanoid.cjs"
      },
      "engines": {
        "node": "^10 || ^12 || ^13.7 || ^14 || >=15.0.1"
      }
    },
    "node_modules/natural-compare": {
      "version": "1.4.0",
      "resolved": "https://registry.npmjs.org/natural-compare/-/natural-compare-1.4.0.tgz",
      "integrity": "sha512-OWND8ei3VtNC9h7V60qff3SVobHr996CTwgxubgyQYEpg290h9J0buyECNNJexkFm5sOajh5G116RYA1c8ZMSw==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/node-releases": {
      "version": "2.0.27",
      "resolved": "https://registry.npmjs.org/node-releases/-/node-releases-2.0.27.tgz",
      "integrity": "sha512-nmh3lCkYZ3grZvqcCH+fjmQ7X+H0OeZgP40OierEaAptX4XofMh5kwNbWh7lBduUzCcV/8kZ+NDLCwm2iorIlA==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/optionator": {
      "version": "0.9.4",
      "resolved": "https://registry.npmjs.org/optionator/-/optionator-0.9.4.tgz",
      "integrity": "sha512-6IpQ7mKUxRcZNLIObR0hz7lxsapSSIYNZJwXPGeF0mTVqGKFIXj1DQcMoT22S3ROcLyY/rz0PWaWZ9ayWmad9g==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "deep-is": "^0.1.3",
        "fast-levenshtein": "^2.0.6",
        "levn": "^0.4.1",
        "prelude-ls": "^1.2.1",
        "type-check": "^0.4.0",
        "word-wrap": "^1.2.5"
      },
      "engines": {
        "node": ">= 0.8.0"
      }
    },
    "node_modules/p-limit": {
      "version": "3.1.0",
      "resolved": "https://registry.npmjs.org/p-limit/-/p-limit-3.1.0.tgz",
      "integrity": "sha512-TYOanM3wGwNGsZN2cVTYPArw454xnXj5qmWF1bEoAc4+cU/ol7GVh7odevjp1FNHduHc3KZMcFduxU5Xc6uJRQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "yocto-queue": "^0.1.0"
      },
      "engines": {
        "node": ">=10"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/p-locate": {
      "version": "5.0.0",
      "resolved": "https://registry.npmjs.org/p-locate/-/p-locate-5.0.0.tgz",
      "integrity": "sha512-LaNjtRWUBY++zB5nE/NwcaoMylSPk+S+ZHNB1TzdbMJMny6dynpAGt7X/tl/QYq3TIeE6nxHppbo2LGymrG5Pw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "p-limit": "^3.0.2"
      },
      "engines": {
        "node": ">=10"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/parent-module": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/parent-module/-/parent-module-1.0.1.tgz",
      "integrity": "sha512-GQ2EWRpQV8/o+Aw8YqtfZZPfNRWZYkbidE9k5rpl/hC3vtHHBfGm2Ifi6qWV+coDGkrUKZAxE3Lot5kcsRlh+g==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "callsites": "^3.0.0"
      },
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/path-exists": {
      "version": "4.0.0",
      "resolved": "https://registry.npmjs.org/path-exists/-/path-exists-4.0.0.tgz",
      "integrity": "sha512-ak9Qy5Q7jYb2Wwcey5Fpvg2KoAc/ZIhLSLOSBmRmygPsGwkVVt0fZa0qrtMz+m6tJTAHfZQ8FnmB4MG4LWy7/w==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/path-key": {
      "version": "3.1.1",
      "resolved": "https://registry.npmjs.org/path-key/-/path-key-3.1.1.tgz",
      "integrity": "sha512-ojmeN0qd+y0jszEtoY48r0Peq5dwMEkIlCOu6Q5f41lfkswXuKtYrhgoTpLnyIcHm24Uhqx+5Tqm2InSwLhE6Q==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/picocolors": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/picocolors/-/picocolors-1.1.1.tgz",
      "integrity": "sha512-xceH2snhtb5M9liqDsmEw56le376mTZkEX/jEb/RxNFyegNul7eNslCXP9FDj/Lcu0X8KEyMceP2ntpaHrDEVA==",
      "dev": true,
      "license": "ISC"
    },
    "node_modules/picomatch": {
      "version": "4.0.3",
      "resolved": "https://registry.npmjs.org/picomatch/-/picomatch-4.0.3.tgz",
      "integrity": "sha512-5gTmgEY/sqK6gFXLIsQNH19lWb4ebPDLA4SdLP7dsWkIXHWlG66oPuVvXSGFPppYZz8ZDZq0dYYrbHfBCVUb1Q==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "engines": {
        "node": ">=12"
      },
      "funding": {
        "url": "https://github.com/sponsors/jonschlinkert"
      }
    },
    "node_modules/postcss": {
      "version": "8.5.6",
      "resolved": "https://registry.npmjs.org/postcss/-/postcss-8.5.6.tgz",
      "integrity": "sha512-3Ybi1tAuwAP9s0r1UQ2J4n5Y0G05bJkpUIO0/bI9MhwmD70S5aTWbXGBwxHrelT+XM1k6dM0pk+SwNkpTRN7Pg==",
      "dev": true,
      "funding": [
        {
          "type": "opencollective",
          "url": "https://opencollective.com/postcss/"
        },
        {
          "type": "tidelift",
          "url": "https://tidelift.com/funding/github/npm/postcss"
        },
        {
          "type": "github",
          "url": "https://github.com/sponsors/ai"
        }
      ],
      "license": "MIT",
      "dependencies": {
        "nanoid": "^3.3.11",
        "picocolors": "^1.1.1",
        "source-map-js": "^1.2.1"
      },
      "engines": {
        "node": "^10 || ^12 || >=14"
      }
    },
    "node_modules/prelude-ls": {
      "version": "1.2.1",
      "resolved": "https://registry.npmjs.org/prelude-ls/-/prelude-ls-1.2.1.tgz",
      "integrity": "sha512-vkcDPrRZo1QZLbn5RLGPpg/WmIQ65qoWWhcGKf/b5eplkkarX0m9z8ppCat4mlOqUsWpyNuYgO3VRyrYHSzX5g==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 0.8.0"
      }
    },
    "node_modules/punycode": {
      "version": "2.3.1",
      "resolved": "https://registry.npmjs.org/punycode/-/punycode-2.3.1.tgz",
      "integrity": "sha512-vYt7UD1U9Wg6138shLtLOvdAu+8DsC/ilFtEVHcH+wydcSpNE20AfSOduf6MkRFahL5FY7X1oU7nKVZFtfq8Fg==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/react": {
      "version": "19.2.4",
      "resolved": "https://registry.npmjs.org/react/-/react-19.2.4.tgz",
      "integrity": "sha512-9nfp2hYpCwOjAN+8TZFGhtWEwgvWHXqESH8qT89AT/lWklpLON22Lc8pEtnpsZz7VmawabSU0gCjnj8aC0euHQ==",
      "license": "MIT",
      "peer": true,
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/react-dom": {
      "version": "19.2.4",
      "resolved": "https://registry.npmjs.org/react-dom/-/react-dom-19.2.4.tgz",
      "integrity": "sha512-AXJdLo8kgMbimY95O2aKQqsz2iWi9jMgKJhRBAxECE4IFxfcazB2LmzloIoibJI3C12IlY20+KFaLv+71bUJeQ==",
      "license": "MIT",
      "dependencies": {
        "scheduler": "^0.27.0"
      },
      "peerDependencies": {
        "react": "^19.2.4"
      }
    },
    "node_modules/react-refresh": {
      "version": "0.18.0",
      "resolved": "https://registry.npmjs.org/react-refresh/-/react-refresh-0.18.0.tgz",
      "integrity": "sha512-QgT5//D3jfjJb6Gsjxv0Slpj23ip+HtOpnNgnb2S5zU3CB26G/IDPGoy4RJB42wzFE46DRsstbW6tKHoKbhAxw==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/resolve-from": {
      "version": "4.0.0",
      "resolved": "https://registry.npmjs.org/resolve-from/-/resolve-from-4.0.0.tgz",
      "integrity": "sha512-pb/MYmXstAkysRFx8piNI1tGFNQIFA3vkE3Gq4EuA1dF6gHp/+vgZqsCGJapvy8N3Q+4o7FwvquPJcnZ7RYy4g==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=4"
      }
    },
    "node_modules/rollup": {
      "version": "4.57.1",
      "resolved": "https://registry.npmjs.org/rollup/-/rollup-4.57.1.tgz",
      "integrity": "sha512-oQL6lgK3e2QZeQ7gcgIkS2YZPg5slw37hYufJ3edKlfQSGGm8ICoxswK15ntSzF/a8+h7ekRy7k7oWc3BQ7y8A==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@types/estree": "1.0.8"
      },
      "bin": {
        "rollup": "dist/bin/rollup"
      },
      "engines": {
        "node": ">=18.0.0",
        "npm": ">=8.0.0"
      },
      "optionalDependencies": {
        "@rollup/rollup-android-arm-eabi": "4.57.1",
        "@rollup/rollup-android-arm64": "4.57.1",
        "@rollup/rollup-darwin-arm64": "4.57.1",
        "@rollup/rollup-darwin-x64": "4.57.1",
        "@rollup/rollup-freebsd-arm64": "4.57.1",
        "@rollup/rollup-freebsd-x64": "4.57.1",
        "@rollup/rollup-linux-arm-gnueabihf": "4.57.1",
        "@rollup/rollup-linux-arm-musleabihf": "4.57.1",
        "@rollup/rollup-linux-arm64-gnu": "4.57.1",
        "@rollup/rollup-linux-arm64-musl": "4.57.1",
        "@rollup/rollup-linux-loong64-gnu": "4.57.1",
        "@rollup/rollup-linux-loong64-musl": "4.57.1",
        "@rollup/rollup-linux-ppc64-gnu": "4.57.1",
        "@rollup/rollup-linux-ppc64-musl": "4.57.1",
        "@rollup/rollup-linux-riscv64-gnu": "4.57.1",
        "@rollup/rollup-linux-riscv64-musl": "4.57.1",
        "@rollup/rollup-linux-s390x-gnu": "4.57.1",
        "@rollup/rollup-linux-x64-gnu": "4.57.1",
        "@rollup/rollup-linux-x64-musl": "4.57.1",
        "@rollup/rollup-openbsd-x64": "4.57.1",
        "@rollup/rollup-openharmony-arm64": "4.57.1",
        "@rollup/rollup-win32-arm64-msvc": "4.57.1",
        "@rollup/rollup-win32-ia32-msvc": "4.57.1",
        "@rollup/rollup-win32-x64-gnu": "4.57.1",
        "@rollup/rollup-win32-x64-msvc": "4.57.1",
        "fsevents": "~2.3.2"
      }
    },
    "node_modules/scheduler": {
      "version": "0.27.0",
      "resolved": "https://registry.npmjs.org/scheduler/-/scheduler-0.27.0.tgz",
      "integrity": "sha512-eNv+WrVbKu1f3vbYJT/xtiF5syA5HPIMtf9IgY/nKg0sWqzAUEvqY/xm7OcZc/qafLx/iO9FgOmeSAp4v5ti/Q==",
      "license": "MIT"
    },
    "node_modules/semver": {
      "version": "6.3.1",
      "resolved": "https://registry.npmjs.org/semver/-/semver-6.3.1.tgz",
      "integrity": "sha512-BR7VvDCVHO+q2xBEWskxS6DJE1qRnb7DxzUrogb71CWoSficBxYsiAGd+Kl0mmq/MprG9yArRkyrQxTO6XjMzA==",
      "dev": true,
      "license": "ISC",
      "bin": {
        "semver": "bin/semver.js"
      }
    },
    "node_modules/shebang-command": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/shebang-command/-/shebang-command-2.0.0.tgz",
      "integrity": "sha512-kHxr2zZpYtdmrN1qDjrrX/Z1rR1kG8Dx+gkpK1G4eXmvXswmcE1hTWBWYUzlraYw1/yZp6YuDY77YtvbN0dmDA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "shebang-regex": "^3.0.0"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/shebang-regex": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/shebang-regex/-/shebang-regex-3.0.0.tgz",
      "integrity": "sha512-7++dFhtcx3353uBaq8DDR4NuxBetBzC7ZQOhmTQInHEd6bSrXdiEyzCvG07Z44UYdLShWUyXt5M/yhz8ekcb1A==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/socket.io-client": {
      "version": "4.8.3",
      "resolved": "https://registry.npmjs.org/socket.io-client/-/socket.io-client-4.8.3.tgz",
      "integrity": "sha512-uP0bpjWrjQmUt5DTHq9RuoCBdFJF10cdX9X+a368j/Ft0wmaVgxlrjvK3kjvgCODOMMOz9lcaRzxmso0bTWZ/g==",
      "license": "MIT",
      "dependencies": {
        "@socket.io/component-emitter": "~3.1.0",
        "debug": "~4.4.1",
        "engine.io-client": "~6.6.1",
        "socket.io-parser": "~4.2.4"
      },
      "engines": {
        "node": ">=10.0.0"
      }
    },
    "node_modules/socket.io-parser": {
      "version": "4.2.5",
      "resolved": "https://registry.npmjs.org/socket.io-parser/-/socket.io-parser-4.2.5.tgz",
      "integrity": "sha512-bPMmpy/5WWKHea5Y/jYAP6k74A+hvmRCQaJuJB6I/ML5JZq/KfNieUVo/3Mh7SAqn7TyFdIo6wqYHInG1MU1bQ==",
      "license": "MIT",
      "dependencies": {
        "@socket.io/component-emitter": "~3.1.0",
        "debug": "~4.4.1"
      },
      "engines": {
        "node": ">=10.0.0"
      }
    },
    "node_modules/source-map-js": {
      "version": "1.2.1",
      "resolved": "https://registry.npmjs.org/source-map-js/-/source-map-js-1.2.1.tgz",
      "integrity": "sha512-UXWMKhLOwVKb728IUtQPXxfYU+usdybtUrK/8uGE8CQMvrhOpwvzDBwj0QhSL7MQc7vIsISBG8VQ8+IDQxpfQA==",
      "dev": true,
      "license": "BSD-3-Clause",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/strip-json-comments": {
      "version": "3.1.1",
      "resolved": "https://registry.npmjs.org/strip-json-comments/-/strip-json-comments-3.1.1.tgz",
      "integrity": "sha512-6fPc+R4ihwqP6N/aIv2f1gMH8lOVtWQHoqC4yK6oSDVVocumAsfCqjkXnqiYMhmMwS/mEHLp7Vehlt3ql6lEig==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=8"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/supports-color": {
      "version": "7.2.0",
      "resolved": "https://registry.npmjs.org/supports-color/-/supports-color-7.2.0.tgz",
      "integrity": "sha512-qpCAvRl9stuOHveKsn7HncJRvv501qIacKzQlO/+Lwxc9+0q2wLyv4Dfvt80/DPn2pqOBsJdDiogXGR9+OvwRw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "has-flag": "^4.0.0"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/tinyglobby": {
      "version": "0.2.15",
      "resolved": "https://registry.npmjs.org/tinyglobby/-/tinyglobby-0.2.15.tgz",
      "integrity": "sha512-j2Zq4NyQYG5XMST4cbs02Ak8iJUdxRM0XI5QyxXuZOzKOINmWurp3smXu3y5wDcJrptwpSjgXHzIQxR0omXljQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "fdir": "^6.5.0",
        "picomatch": "^4.0.3"
      },
      "engines": {
        "node": ">=12.0.0"
      },
      "funding": {
        "url": "https://github.com/sponsors/SuperchupuDev"
      }
    },
    "node_modules/tslib": {
      "version": "2.8.1",
      "resolved": "https://registry.npmjs.org/tslib/-/tslib-2.8.1.tgz",
      "integrity": "sha512-oJFu94HQb+KVduSUQL7wnpmqnfmLsOA/nAh6b6EH0wCEoK0/mPeXU6c3wKDV83MkOuHPRHtSXKKU99IBazS/2w==",
      "license": "0BSD"
    },
    "node_modules/type-check": {
      "version": "0.4.0",
      "resolved": "https://registry.npmjs.org/type-check/-/type-check-0.4.0.tgz",
      "integrity": "sha512-XleUoc9uwGXqjWwXaUTZAmzMcFZ5858QA2vvx1Ur5xIcixXIP+8LnFDgRplU30us6teqdlskFfu+ae4K79Ooew==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "prelude-ls": "^1.2.1"
      },
      "engines": {
        "node": ">= 0.8.0"
      }
    },
    "node_modules/undici-types": {
      "version": "7.16.0",
      "resolved": "https://registry.npmjs.org/undici-types/-/undici-types-7.16.0.tgz",
      "integrity": "sha512-Zz+aZWSj8LE6zoxD+xrjh4VfkIG8Ya6LvYkZqtUQGJPZjYl53ypCaUwWqo7eI0x66KBGeRo+mlBEkMSeSZ38Nw==",
      "license": "MIT"
    },
    "node_modules/update-browserslist-db": {
      "version": "1.2.3",
      "resolved": "https://registry.npmjs.org/update-browserslist-db/-/update-browserslist-db-1.2.3.tgz",
      "integrity": "sha512-Js0m9cx+qOgDxo0eMiFGEueWztz+d4+M3rGlmKPT+T4IS/jP4ylw3Nwpu6cpTTP8R1MAC1kF4VbdLt3ARf209w==",
      "dev": true,
      "funding": [
        {
          "type": "opencollective",
          "url": "https://opencollective.com/browserslist"
        },
        {
          "type": "tidelift",
          "url": "https://tidelift.com/funding/github/npm/browserslist"
        },
        {
          "type": "github",
          "url": "https://github.com/sponsors/ai"
        }
      ],
      "license": "MIT",
      "dependencies": {
        "escalade": "^3.2.0",
        "picocolors": "^1.1.1"
      },
      "bin": {
        "update-browserslist-db": "cli.js"
      },
      "peerDependencies": {
        "browserslist": ">= 4.21.0"
      }
    },
    "node_modules/uri-js": {
      "version": "4.4.1",
      "resolved": "https://registry.npmjs.org/uri-js/-/uri-js-4.4.1.tgz",
      "integrity": "sha512-7rKUyy33Q1yc98pQ1DAmLtwX109F7TIfWlW1Ydo8Wl1ii1SeHieeh0HHfPeL2fMXK6z0s8ecKs9frCuLJvndBg==",
      "dev": true,
      "license": "BSD-2-Clause",
      "dependencies": {
        "punycode": "^2.1.0"
      }
    },
    "node_modules/vite": {
      "version": "7.3.1",
      "resolved": "https://registry.npmjs.org/vite/-/vite-7.3.1.tgz",
      "integrity": "sha512-w+N7Hifpc3gRjZ63vYBXA56dvvRlNWRczTdmCBBa+CotUzAPf5b7YMdMR/8CQoeYE5LX3W4wj6RYTgonm1b9DA==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "esbuild": "^0.27.0",
        "fdir": "^6.5.0",
        "picomatch": "^4.0.3",
        "postcss": "^8.5.6",
        "rollup": "^4.43.0",
        "tinyglobby": "^0.2.15"
      },
      "bin": {
        "vite": "bin/vite.js"
      },
      "engines": {
        "node": "^20.19.0 || >=22.12.0"
      },
      "funding": {
        "url": "https://github.com/vitejs/vite?sponsor=1"
      },
      "optionalDependencies": {
        "fsevents": "~2.3.3"
      },
      "peerDependencies": {
        "@types/node": "^20.19.0 || >=22.12.0",
        "jiti": ">=1.21.0",
        "less": "^4.0.0",
        "lightningcss": "^1.21.0",
        "sass": "^1.70.0",
        "sass-embedded": "^1.70.0",
        "stylus": ">=0.54.8",
        "sugarss": "^5.0.0",
        "terser": "^5.16.0",
        "tsx": "^4.8.1",
        "yaml": "^2.4.2"
      },
      "peerDependenciesMeta": {
        "@types/node": {
          "optional": true
        },
        "jiti": {
          "optional": true
        },
        "less": {
          "optional": true
        },
        "lightningcss": {
          "optional": true
        },
        "sass": {
          "optional": true
        },
        "sass-embedded": {
          "optional": true
        },
        "stylus": {
          "optional": true
        },
        "sugarss": {
          "optional": true
        },
        "terser": {
          "optional": true
        },
        "tsx": {
          "optional": true
        },
        "yaml": {
          "optional": true
        }
      }
    },
    "node_modules/which": {
      "version": "2.0.2",
      "resolved": "https://registry.npmjs.org/which/-/which-2.0.2.tgz",
      "integrity": "sha512-BLI3Tl1TW3Pvl70l3yq3Y64i+awpwXqsGBYWkkqMtnbXgrMD+yj7rhW0kuEDxzJaYXGjEW5ogapKNMEKNMjibA==",
      "dev": true,
      "license": "ISC",
      "dependencies": {
        "isexe": "^2.0.0"
      },
      "bin": {
        "node-which": "bin/node-which"
      },
      "engines": {
        "node": ">= 8"
      }
    },
    "node_modules/word-wrap": {
      "version": "1.2.5",
      "resolved": "https://registry.npmjs.org/word-wrap/-/word-wrap-1.2.5.tgz",
      "integrity": "sha512-BN22B5eaMMI9UMtjrGd5g5eCYPpCPDUy0FJXbYsaT5zYxjFOckS53SQDE3pWkVoWpHXVb3BrYcEN4Twa55B5cA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/ws": {
      "version": "8.19.0",
      "resolved": "https://registry.npmjs.org/ws/-/ws-8.19.0.tgz",
      "integrity": "sha512-blAT2mjOEIi0ZzruJfIhb3nps74PRWTCz1IjglWEEpQl5XS/UNama6u2/rjFkDDouqr4L67ry+1aGIALViWjDg==",
      "license": "MIT",
      "engines": {
        "node": ">=10.0.0"
      },
      "peerDependencies": {
        "bufferutil": "^4.0.1",
        "utf-8-validate": ">=5.0.2"
      },
      "peerDependenciesMeta": {
        "bufferutil": {
          "optional": true
        },
        "utf-8-validate": {
          "optional": true
        }
      }
    },
    "node_modules/xmlhttprequest-ssl": {
      "version": "2.1.2",
      "resolved": "https://registry.npmjs.org/xmlhttprequest-ssl/-/xmlhttprequest-ssl-2.1.2.tgz",
      "integrity": "sha512-TEU+nJVUUnA4CYJFLvK5X9AOeH4KvDvhIfm0vV1GaQRtchnG0hgK5p8hw/xjv8cunWYCsiPCSDzObPyhEwq3KQ==",
      "engines": {
        "node": ">=0.4.0"
      }
    },
    "node_modules/yallist": {
      "version": "3.1.1",
      "resolved": "https://registry.npmjs.org/yallist/-/yallist-3.1.1.tgz",
      "integrity": "sha512-a4UGQaWPH59mOXUYnAG2ewncQS4i4F43Tv3JoAM+s2VDAmS9NsK8GpDMLrCHPksFT7h3K6TOoUNn2pb7RoXx4g==",
      "dev": true,
      "license": "ISC"
    },
    "node_modules/yocto-queue": {
      "version": "0.1.0",
      "resolved": "https://registry.npmjs.org/yocto-queue/-/yocto-queue-0.1.0.tgz",
      "integrity": "sha512-rVksvsnNCdJ/ohGc6xgPwyN8eheCxsiLM8mxuE/t/mOVqJewPuO1miLpTHQiRgTKCLexL4MeAFVagts7HmNZ2Q==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=10"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/zod": {
      "version": "4.3.6",
      "resolved": "https://registry.npmjs.org/zod/-/zod-4.3.6.tgz",
      "integrity": "sha512-rftlrkhHZOcjDwkGlnUtZZkvaPHCsDATp4pGpuOOMDaTdDDXF91wuVDJoWoPsKX/3YPQ5fHuF3STjcYyKr+Qhg==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "funding": {
        "url": "https://github.com/sponsors/colinhacks"
      }
    },
    "node_modules/zod-validation-error": {
      "version": "4.0.2",
      "resolved": "https://registry.npmjs.org/zod-validation-error/-/zod-validation-error-4.0.2.tgz",
      "integrity": "sha512-Q6/nZLe6jxuU80qb/4uJ4t5v2VEZ44lzQjPDhYJNztRQ4wyWc6VF3D3Kb/fAuPetZQnhS3hnajCf9CsWesghLQ==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=18.0.0"
      },
      "peerDependencies": {
        "zod": "^3.25.0 || ^4.0.0"
      }
    },
    "node_modules/zustand": {
      "version": "5.0.10",
      "resolved": "https://registry.npmjs.org/zustand/-/zustand-5.0.10.tgz",
      "integrity": "sha512-U1AiltS1O9hSy3rul+Ub82ut2fqIAefiSuwECWt6jlMVUGejvf+5omLcRBSzqbRagSM3hQZbtzdeRc6QVScXTg==",
      "license": "MIT",
      "engines": {
        "node": ">=12.20.0"
      },
      "peerDependencies": {
        "@types/react": ">=18.0.0",
        "immer": ">=9.0.6",
        "react": ">=18.0.0",
        "use-sync-external-store": ">=1.2.0"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        },
        "immer": {
          "optional": true
        },
        "react": {
          "optional": true
        },
        "use-sync-external-store": {
          "optional": true
        }
      }
    }
  }
}

```

---

## File: package.json
```json
{
  "name": "modern-aura",
  "private": true,
  "version": "1.3.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "@supabase/supabase-js": "^2.95.3",
    "lucide-react": "^0.563.0",
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "socket.io-client": "^4.8.3",
    "zustand": "^5.0.10"
  },
  "devDependencies": {
    "@eslint/js": "^9.39.1",
    "@types/react": "^19.2.5",
    "@types/react-dom": "^19.2.3",
    "@vitejs/plugin-react": "^5.1.1",
    "eslint": "^9.39.1",
    "eslint-plugin-react-hooks": "^7.0.1",
    "eslint-plugin-react-refresh": "^0.4.24",
    "globals": "^16.5.0",
    "vite": "^7.2.4"
  }
}
```

---

## File: public/_redirects
```text
/assets/* /assets/:splat 200
/* /index.html 200

```

---

## File: scripts/debug_contacts.js
```js

import fs from 'fs';
import path from 'path';

const envPath = path.resolve('.env');
let env = {};
if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    content.split('\n').forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) env[key.trim()] = value.trim();
    });
}

const API_URL = env.VITE_API_URL || 'https://api.voxeflow.com';
const API_KEY = env.VITE_API_KEY || 'Beatriz@CB650';
const INSTANCE = env.VITE_INSTANCE_NAME || 'VoxeFlow';
const SEARCH_FRAGMENT = '97401268338833';

console.log(`🔍 Debugging CONTACTS for Instance: ${INSTANCE}`);
console.log(`🌐 URL: ${API_URL}`);

async function request(endpoint, method = 'GET', body = null) {
    const headers = {
        'Content-Type': 'application/json',
        'apikey': API_KEY
    };
    const baseUrl = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL;
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    const url = `${baseUrl}/${cleanEndpoint}`;

    try {
        const fetch = (await import('node-fetch')).default;
        const res = await fetch(url, {
            method,
            headers,
            body: body ? JSON.stringify(body) : null
        });

        const json = await res.json();
        return json;
    } catch (e) {
        console.error(`❌ Request Error ${endpoint}:`, e.message);
        return null;
    }
}

async function run() {
    console.log('📦 Fetching contacts...');
    const data = await request(`chat/findContacts/${INSTANCE}`, 'GET');

    const contacts = Array.isArray(data) ? data : (data?.records || []);
    console.log(`✅ Found ${contacts.length} contacts.`);

    let found = false;
    contacts.forEach(c => {
        const json = JSON.stringify(c);
        if (json.includes('974') || json.includes('rosangela')) {
            console.log('🎯 MATCH FOUND in Contact:', json);
            found = true;
        }
    });

    if (!found) {
        console.log('❌ No contact found matching fragment or name "rosangela".');
    }
}

run();

```

---

## File: scripts/debug_lid.js
```js

import fs from 'fs';
import path from 'path';

const envPath = path.resolve('.env');
let env = {};
if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    content.split('\n').forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) env[key.trim()] = value.trim();
    });
}

const API_URL = env.VITE_API_URL || 'https://api.voxeflow.com';
const API_KEY = env.VITE_API_KEY || 'Beatriz@CB650';
const INSTANCE = env.VITE_INSTANCE_NAME || 'VoxeFlow';

console.log(`🔍 Debugging ALL CHATS for Instance: ${INSTANCE}`);
console.log(`🌐 URL: ${API_URL}`);

async function request(endpoint, method = 'GET', body = null) {
    const headers = {
        'Content-Type': 'application/json',
        'apikey': API_KEY
    };
    const baseUrl = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL;
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    const url = `${baseUrl}/${cleanEndpoint}`;

    try {
        const fetch = (await import('node-fetch')).default;
        const res = await fetch(url, {
            method,
            headers,
            body: body ? JSON.stringify(body) : null
        });

        if (!res.ok) {
            console.error(`❌ HTTP Error ${res.status}: ${res.statusText}`);
            return null;
        }

        return await res.json();
    } catch (e) {
        console.error(`❌ Request Error ${endpoint}:`, e.message);
        return null;
    }
}

async function run() {
    console.log('📦 Fetching chats...');
    const data = await request(`chat/findChats/${INSTANCE}`, 'POST', {});

    const chats = Array.isArray(data) ? data : (data?.records || data?.chats || []);
    console.log(`✅ Found ${chats.length} chats.`);

    chats.forEach(c => {
        const id = c.id || c.jid || c.remoteJid;
        const name = c.name || c.pushName || c.verifiedName || "Unknown";
        console.log(`- [${name}] ID: ${id}`);

        // Also dump metadata
        if (name.toLowerCase().includes('rosangela')) {
            console.log('🎯 TARGET METADATA DUMP:');
            console.log(JSON.stringify(c, null, 2));
        }
    });
}

run();

```

---

## File: scripts/debug_lid_msgs.js
```js

import fs from 'fs';
import path from 'path';

const envPath = path.resolve('.env');
let env = {};
if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    content.split('\n').forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) env[key.trim()] = value.trim();
    });
}

const API_URL = env.VITE_API_URL || 'https://api.voxeflow.com';
const API_KEY = env.VITE_API_KEY || 'Beatriz@CB650';
const INSTANCE = env.VITE_INSTANCE_NAME || 'VoxeFlow';
// The LID found in previous step
const TARGET_LID = '97401268338833@lid';

console.log(`🔍 Debugging MESSAGES for LID: ${TARGET_LID}`);
console.log(`🌐 URL: ${API_URL}`);

async function request(endpoint, method = 'GET', body = null) {
    const headers = {
        'Content-Type': 'application/json',
        'apikey': API_KEY
    };
    const baseUrl = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL;
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    const url = `${baseUrl}/${cleanEndpoint}`;

    try {
        const fetch = (await import('node-fetch')).default;
        const res = await fetch(url, {
            method,
            headers,
            body: body ? JSON.stringify(body) : null
        });

        if (!res.ok) {
            console.error(`❌ HTTP Error ${res.status}: ${res.statusText}`);
            return null;
        }

        return await res.json();
    } catch (e) {
        console.error(`❌ Request Error ${endpoint}:`, e.message);
        return null;
    }
}

async function run() {
    console.log('📦 Fetching messages...');
    const data = await request(`chat/findMessages/${INSTANCE}`, 'POST', {
        where: {
            key: {
                remoteJid: TARGET_LID
            }
        },
        limit: 10
    });

    const messages = Array.isArray(data) ? data : (data?.messages?.records || data?.records || data?.messages || []);
    console.log(`✅ Found ${messages.length} messages.`);

    messages.forEach((m, i) => {
        const participant = m.key?.participant || m.participant;
        console.log(`[${i}] ID: ${m.key?.id} | FromMe: ${m.key?.fromMe}`);
        console.log(`    RemoteJid: ${m.key?.remoteJid}`);
        if (participant) console.log(`   -> Found Participant: ${participant}`);
    });

    if (messages.length === 0) {
        console.log('⚠️ No messages found. Trying fallback scan...');
        // Try searching for messages where 'remoteJid' is the JID but maybe without @lid? (unlikely)
    }
}

run();

```

---

## File: scripts/debug_lid_pp.js
```js

import fs from 'fs';
import path from 'path';

// Load env
const envPath = path.resolve('.env');
let env = {};
if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    content.split('\n').forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) env[key.trim()] = value.trim();
    });
}

const API_URL = env.VITE_API_URL || 'https://api.voxeflow.com';
const API_KEY = env.VITE_API_KEY || 'Beatriz@CB650';
const INSTANCE = env.VITE_INSTANCE_NAME || 'VoxeFlow';
const TEST_LID = '166996968784053@lid'; // Known problematic LID

console.log(`🔍 Debugging LID Resolution via Profile Picture`);
console.log(`🌐 URL: ${API_URL}`);
console.log(`🎯 Target: ${TEST_LID}`);

async function request(endpoint, method = 'GET', body = null) {
    const headers = {
        'Content-Type': 'application/json',
        'apikey': API_KEY
    };
    const baseUrl = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL;
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    const url = `${baseUrl}/${cleanEndpoint}`;

    try {
        const fetch = (await import('node-fetch')).default;
        const res = await fetch(url, {
            method,
            headers,
            body: body ? JSON.stringify(body) : null
        });

        if (!res.ok) {
            console.error(`❌ HTTP Error ${res.status}: ${res.statusText}`);
            return null;
        }

        return await res.json();
    } catch (e) {
        console.error(`❌ Request Error ${endpoint}:`, e.message);
        return null;
    }
}

async function run() {
    console.log('🧪 Fetching Profile Picture...');
    const data = await request(`chat/fetchProfilePictureUrl/${INSTANCE}`, 'POST', {
        number: TEST_LID
    });

    console.log('📸 Response:', JSON.stringify(data, null, 2));

    if (data && (data.profilePictureUrl || data.url)) {
        const url = data.profilePictureUrl || data.url;
        console.log(`🔗 URL: ${url}`);

        // Regex to extract phone number from URL
        // Typically: https://pps.whatsapp.net/v/.../5531992957555_...jpg
        const match = url.match(/\/(\d{10,15})_/);
        if (match) {
            console.log(`✅ FOUND PHONE NUMBER IN URL: ${match[1]}`);
        } else {
            console.log('⚠️ Could not extract number from URL.');
        }
    } else {
        console.log('❌ No profile picture URL returned.');
    }
}

run();

```

---

## File: scripts/export_for_codex.js
```js

import fs from 'fs';
import path from 'path';

const rootDir = '/Users/jeffersonreis/.gemini/antigravity/scratch/dentist-copilot/modern-aura';
const outputFile = path.join(rootDir, 'modern-aura-codex-export.md');

const ignoreDirs = ['node_modules', '.git', 'dist', '.gemini', 'assets'];
const ignoreExtensions = ['.svg', '.png', '.jpg', '.jpeg', '.pdf', '.zip'];

function getFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      if (!ignoreDirs.includes(file)) {
        getFiles(filePath, fileList);
      }
    } else {
      if (!ignoreExtensions.includes(path.extname(file))) {
        fileList.push(filePath);
      }
    }
  });
  return fileList;
}

const allFiles = getFiles(rootDir);
let exportContent = '# Modern Aura - Full Project Export for Codex\n\n';

allFiles.forEach(file => {
  const relativePath = path.relative(rootDir, file);
  const content = fs.readFileSync(file, 'utf8');
  const ext = path.extname(file).slice(1) || 'text';
  
  exportContent += `## File: ${relativePath}\n`;
  exportContent += `\`\`\`${ext}\n`;
  exportContent += content;
  exportContent += `\n\`\`\`\n\n---\n\n`;
});

fs.writeFileSync(outputFile, exportContent);
console.log(`✅ Project exported to: ${outputFile}`);

```

---

## File: scripts/generate_google_token.js
```js

import { google } from 'googleapis';
import readline from 'readline';

// Instructions:
// 1. Run: npm install googleapis
// 2. Run: node scripts/generate_google_token.js
// 3. Paste Client ID and Client Secret when prompted.
// 4. Follow the URL, authorize, and paste the code.
// 5. Save the Refresh Token to your .env or Cloudflare Dashboard.

const SCOPES = ['https://www.googleapis.com/auth/contacts'];

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

function ask(question) {
    return new Promise((resolve) => rl.question(question, resolve));
}

async function main() {
    console.log('🔐 Google OAuth 2.0 Token Generator');
    console.log('------------------------------------');

    const clientId = await ask('Enter Client ID: ');
    const clientSecret = await ask('Enter Client Secret: ');

    if (!clientId || !clientSecret) {
        console.error('❌ Missing credentials.');
        process.exit(1);
    }

    const oAuth2Client = new google.auth.OAuth2(
        clientId,
        clientSecret,
        'https://developers.google.com/oauthplayground' // Redirect URI used in instructions
    );

    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline', // Crucial for Refresh Token
        scope: SCOPES,
        prompt: 'consent' // Force new Refresh Token
    });

    console.log('\n🔗 Authorization URL:', authUrl);
    console.log('\n👉 Open this URL in your browser, authorize the app, and you will be redirected to https://developers.google.com/oauthplayground');
    console.log('👉 Copy the "Authorization code" from the page (or URL parameter) and paste it below.');

    const code = await ask('\nEnter Authorization Code: ');

    try {
        const { tokens } = await oAuth2Client.getToken(code);

        console.log('\n✅ SUCCESS! Here are your tokens:');
        console.log('------------------------------------');
        console.log('ACCESS_TOKEN (Expire em 1h):');
        console.log(tokens.access_token);
        console.log('\n🔄 REFRESH_TOKEN (SAVE THIS! IT NEVER EXPIRES):');
        console.log(tokens.refresh_token);
        console.log('------------------------------------');

        if (!tokens.refresh_token) {
            console.warn('⚠️ No Refresh Token returned. Did you use an existing authorization? Try revoking access or using prompt=consent.');
        }

    } catch (error) {
        console.error('❌ Error retrieving tokens:', error.message);
    } finally {
        rl.close();
    }
}

main();

```

---

## File: scripts/test_contacts_resolution.js
```js
import fetch from 'node-fetch';

const API_URL = 'https://api.voxeflow.com';
const API_KEY = 'Beatriz@CB650';
const INSTANCE = 'VoxeFlow';

async function diagnose() {
    console.log(`🔍 DIAGNOSING INSTANCE: ${INSTANCE}`);
    console.log(`🔑 API Key: ${API_KEY.substring(0, 3)}...`);

    try {
        // 1. Check Instance State
        console.log(`\n1️⃣ Checking Connection State...`);
        const stateResp = await fetch(`${API_URL}/instance/connectionState/${INSTANCE}`, {
            headers: { 'apikey': API_KEY }
        });

        if (stateResp.ok) {
            const stateData = await stateResp.json();
            console.log(`   State: ${JSON.stringify(stateData)}`);
        } else {
            console.error(`   ❌ Failed to get state: ${stateResp.status}`);
        }

        // 2. Fetch Contacts with verbose logging
        console.log(`\n2️⃣ Fetching Contacts...`);
        const contactsResp = await fetch(`${API_URL}/chat/findContacts/${INSTANCE}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': API_KEY
            },
            body: JSON.stringify({})
        });

        if (contactsResp.ok) {
            const data = await contactsResp.json();
            const contacts = Array.isArray(data) ? data : (data.records || []);
            console.log(`   ✅ Contacts Found: ${contacts.length}`);
            if (contacts.length > 0) {
                console.log(`   Sample: ${JSON.stringify(contacts[0])}`);
            } else {
                console.warn(`   ⚠️ ZERO contacts found. This means the instance hasn't synced contacts or they are empty.`);
            }
        } else {
            console.error(`   ❌ Failed to fetch contacts: ${contactsResp.status}`);
            console.error(await contactsResp.text());
        }

        // 3. Compare with Chats
        console.log(`\n3️⃣ Fetching Chats...`);
        const chatsResp = await fetch(`${API_URL}/chat/findChats/${INSTANCE}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': API_KEY
            },
            body: JSON.stringify({})
        });

        if (chatsResp.ok) {
            const chatsData = await chatsResp.json();
            const chats = Array.isArray(chatsData) ? chatsData : (chatsData.records || []);
            console.log(`   ✅ Chats Found: ${chats.length}`);

            // Check if any chat has a LID
            const lidChats = chats.filter(c => (c.id || c.jid || "").includes('@lid'));
            console.log(`   🆔 LID Chats count: ${lidChats.length}`);
            if (lidChats.length > 0) {
                console.log(`   Sample LID Chat: ${lidChats[0].id} - Name: ${lidChats[0].name || lidChats[0].pushName}`);
            }
        }

    } catch (e) {
        console.error('❌ CRITICAL EXECUTION ERROR:', e);
    }
}

diagnose();

```

---

## File: scripts/test_send_lid.js
```js

import fs from 'fs';
import path from 'path';

const envPath = path.resolve('.env');
let env = {};
if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    content.split('\n').forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) env[key.trim()] = value.trim();
    });
}

const API_URL = env.VITE_API_URL || 'https://api.voxeflow.com';
const API_KEY = env.VITE_API_KEY || 'Beatriz@CB650';
const INSTANCE = env.VITE_INSTANCE_NAME || 'VoxeFlow';
const TARGET_LID = '97401268338833@lid';

console.log(`🧪 Testing SEND to LID: ${TARGET_LID}`);
console.log(`🌐 URL: ${API_URL}`);

async function request(endpoint, method = 'POST', body = null) {
    const headers = {
        'Content-Type': 'application/json',
        'apikey': API_KEY
    };
    const baseUrl = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL;
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    const url = `${baseUrl}/${cleanEndpoint}`;

    try {
        const fetch = (await import('node-fetch')).default;
        const res = await fetch(url, {
            method,
            headers,
            body: body ? JSON.stringify(body) : null
        });

        const json = await res.json();
        return { status: res.status, data: json };
    } catch (e) {
        console.error(`❌ Request Error ${endpoint}:`, e.message);
        return { error: e.message };
    }
}

async function run() {
    // Test 1: Full LID
    console.log('\n--- Test 1: Full LID ---');
    const res1 = await request(`message/sendText/${INSTANCE}`, 'POST', {
        number: TARGET_LID,
        text: "Teste 1 (Full LID)",
        options: { delay: 0, linkPreview: false }
    });
    console.log('Result 1:', JSON.stringify(res1, null, 2));

    // Test 2: Stripped Suffix using number field
    const stripped = TARGET_LID.split('@')[0];
    console.log(`\n--- Test 2: Stripped Suffix (${stripped}) ---`);
    const res2 = await request(`message/sendText/${INSTANCE}`, 'POST', {
        number: stripped,
        text: "Teste 2 (Stripped)",
        options: { delay: 0, linkPreview: false }
    });
    console.log('Result 2:', JSON.stringify(res2, null, 2));

    // Test 3: Using 'remoteJid' in options
    console.log('\n--- Test 3: RemoteJid Option ---');
    const res3 = await request(`message/sendText/${INSTANCE}`, 'POST', {
        number: stripped, // Try stripped + remoteJid
        text: "Teste 3 (RemoteJid)",
        options: { delay: 0, linkPreview: false, remoteJid: TARGET_LID }
    });
    console.log('Result 3:', JSON.stringify(res3, null, 2));

    // Test 4: Full LID + RemoteJid
    console.log('\n--- Test 4: Full LID + RemoteJid ---');
    const res4 = await request(`message/sendText/${INSTANCE}`, 'POST', {
        number: TARGET_LID,
        text: "Teste 4 (Full + RemoteJid)",
        options: { delay: 0, linkPreview: false, remoteJid: TARGET_LID }
    });
    console.log('Result 4:', JSON.stringify(res4, null, 2));

    // Test 5: Number as NULL + RemoteJid (Maybe?)
    console.log('\n--- Test 5: Null Number + RemoteJid ---');
    const res5 = await request(`message/sendText/${INSTANCE}`, 'POST', {
        number: null,
        text: "Teste 5 (Null + RemoteJid)",
        options: { delay: 0, linkPreview: false, remoteJid: TARGET_LID }
    });
    console.log('Result 5:', JSON.stringify(res5, null, 2));
    // Test 6: Quoted Reply (The Golden Ticket?)
    console.log('\n--- Test 6: Quoted Reply ---');
    const QUOTED_KEY = {
        remoteJid: TARGET_LID,
        id: 'AC7A78F72E8B5671745CEF28E71E8A18', // From debug_lid_msgs.js
        fromMe: false
    };
    // Construct minimal message object for quote
    const minimalQuote = {
        key: QUOTED_KEY,
        message: { conversation: "Original message text unknown" }
    };

    const res6 = await request(`message/sendText/${INSTANCE}`, 'POST', {
        number: TARGET_LID,
        text: "Teste 6 (Reply/Quote)",
        options: {
            delay: 0,
            linkPreview: false,
            quoted: minimalQuote
        }
    });
    // Test 7: Send to UUID (Internal ID)
    const UUID = 'cmlfh92660kemoz4rzu9kx5d9'; // From debug_lid.js
    console.log('\n--- Test 7: Send to UUID ---');
    const res7 = await request(`message/sendText/${INSTANCE}`, 'POST', {
        number: UUID,
        text: "Teste 7 (UUID)",
        options: { delay: 0 }
    });
    // Test 8: Group ID (Is it a group?)
    console.log('\n--- Test 8: Group ID ---');
    const GROUP_ID = '97401268338833@g.us';
    const res8 = await request(`message/sendText/${INSTANCE}`, 'POST', {
        number: GROUP_ID,
        text: "Teste 8 (Group)",
        options: { delay: 0 }
    });
    console.log('Result 8:', JSON.stringify(res8, null, 2));
}

run();

```

---

## File: scripts/test_socket.js
```js

import fs from 'fs';
import path from 'path';
import { io } from 'socket.io-client';

const envPath = path.resolve('.env');
let env = {};
if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    content.split('\n').forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) env[key.trim()] = value.trim();
    });
}

const API_URL = env.VITE_API_URL || 'https://api.voxeflow.com';
const API_KEY = env.VITE_API_KEY || 'Beatriz@CB650';
const INSTANCE = env.VITE_INSTANCE_NAME || 'VoxeFlow';

console.log(`🔌 Connecting to Socket: ${API_URL}`);

const socket = io(API_URL, {
    transports: ['websocket', 'polling'],
    query: {
        apikey: API_KEY
    }
});

socket.on('connect', () => {
    console.log('✅ Connected to Evolution API Socket!');
    console.log(`👂 Listening for events on instance: ${INSTANCE}`);
});

socket.on('connect_error', (err) => {
    console.error('❌ Connection Error:', err.message);
});

socket.on('messages.upsert', (data) => {
    // data structure: { instance: '...', data: { ...message... } }
    if (data.instance !== INSTANCE) return;

    const msg = data.data;
    const remoteJid = msg.key.remoteJid;

    // Check if it's the LID
    if (remoteJid.includes('97401268338833') || JSON.stringify(msg).includes('rosangela')) {
        console.log('\n🚨 RECEIVED MESSAGE FROM ROSANGELA!');
        console.log(JSON.stringify(msg, null, 2));
    } else {
        console.log(`📩 Message from ${remoteJid}`);
    }
});

socket.on('messages.update', (data) => {
    if (data.instance !== INSTANCE) return;
    if (JSON.stringify(data).includes('97401268338833')) {
        console.log('\n🔄 UPDATE FROM ROSANGELA:');
        console.log(JSON.stringify(data, null, 2));
    }
});

```

---

## File: src/App.jsx
```jsx
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ChatList from './components/ChatList';
import ChatArea from './components/ChatArea';
import ConfigModal from './components/ConfigModal';
import ConnectModal from './components/ConnectModal';
import BriefingModal from './components/BriefingModal';
import HistoryView from './components/HistoryView';
import CRMView from './components/CRMView';
import LoginScreen from './components/LoginScreen';
import LandingPage from './pages/LandingPage'; // SALES LANDING PAGE
import { useStore } from './store/useStore';
import WhatsAppService from './services/whatsapp';

const App = () => {
  const { isConnected, setIsConnected, currentView, briefing, setChats, activeChat, setActiveChat } = useStore();
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isConnectOpen, setIsConnectOpen] = useState(false);
  const [isBriefingOpen, setIsBriefingOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // AUTH: Check if user is authenticated
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // LANDING: Track if user clicked "Já sou Cliente" to show login
  const [showLogin, setShowLogin] = useState(false);

  // AUTH: Check localStorage for authentication token
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      try {
        // Simple validation: Decode token and check prefix
        const decoded = atob(token);
        if (decoded.startsWith('authenticated:')) {
          setIsAuthenticated(true);
        } else {
          console.warn('AURA: Invalid token format, logging out');
          localStorage.removeItem('auth_token');
          setIsAuthenticated(false);
        }
      } catch (e) {
        console.error('AURA: Token validation error', e);
        localStorage.removeItem('auth_token');
        setIsAuthenticated(false);
      }
    };

    checkAuth();
    // Also listen for storage changes (multi-tab logout support)
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  // Handle external modal triggers (from Hub/Settings)
  useEffect(() => {
    const handleOpenBriefing = () => setIsBriefingOpen(true);
    const handleOpenConnect = () => setIsConnectOpen(true);

    window.addEventListener('open-briefing', handleOpenBriefing);
    window.addEventListener('open-connect', handleOpenConnect);

    return () => {
      window.removeEventListener('open-briefing', handleOpenBriefing);
      window.removeEventListener('open-connect', handleOpenConnect);
    };
  }, []);


  // Check WhatsApp connection status (only when authenticated)
  useEffect(() => {
    if (!isAuthenticated) return;

    const checkConn = async () => {
      const status = await WhatsAppService.checkConnection();
      const open = status === 'open';
      setIsConnected(open);
      if (open) {
        const data = await WhatsAppService.fetchChats();
        if (data && data.length > 0) setChats(data);
      }
    };
    checkConn();
    const itv = setInterval(checkConn, 30000);
    return () => clearInterval(itv);
  }, [setIsConnected, setChats, isAuthenticated]);

  // AUTH: Handle logout
  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    setIsAuthenticated(false);
    setShowLogin(false); // Return to landing page
  };

  // LANDING: If not authenticated and user hasn't clicked "Já sou Cliente", show landing page
  if (!isAuthenticated && !showLogin) {
    console.log('AURA: Rendering Landing Page');
    return <LandingPage onGetStarted={() => setShowLogin(true)} />;
  }

  // AUTH: If not authenticated but user wants to login, show login screen
  if (!isAuthenticated && showLogin) {
    console.log('AURA: Rendering Login Screen');
    return <LoginScreen onLogin={() => setIsAuthenticated(true)} />;
  }

  // MAIN APP: User is authenticated
  return (
    <div className={`app-container ${currentView === 'crm' ? 'crm-mode' : ''}`}>
      <Sidebar
        onOpenConfig={() => setIsConfigOpen(true)}
        onOpenConnect={() => setIsConnectOpen(true)}
        onOpenBriefing={() => setIsBriefingOpen(true)}
        onLogout={handleLogout}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* CENTRAL COLUMN: Selective rendering based on view */}
      {currentView === 'history' && <HistoryView />}
      {currentView === 'dashboard' && <ChatList onOpenMenu={() => setIsMobileMenuOpen(true)} />}
      {/* CRM view is full-width, middle column is purposely excluded */}

      <main className={`main-content ${activeChat ? 'mobile-chat-open' : 'mobile-chat-closed'}`}>
        {currentView === 'crm' ? (
          <CRMView />
        ) : activeChat ? (
          <ChatArea isArchived={currentView === 'history'} onBack={() => setActiveChat(null)} />
        ) : (
          <div className="history-placeholder glass-panel" style={{ flex: 1, margin: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <h2 style={{ color: '#86868b', opacity: 0.5 }}>
              {currentView === 'history' ? 'Selecione uma conversa arquivada' : 'Selecione uma conversa para iniciar'}
            </h2>
          </div>
        )}
      </main>

      <ConfigModal isOpen={isConfigOpen} onClose={() => setIsConfigOpen(false)} />
      <ConnectModal isOpen={isConnectOpen} onClose={() => setIsConnectOpen(false)} />
      <BriefingModal isOpen={isBriefingOpen} onClose={() => setIsBriefingOpen(false)} />
    </div>
  );
};

export default App;

```

---

## File: src/components/AudioPlayer.jsx
```jsx
import React, { useState, useEffect } from 'react';
import { Play, Pause, Volume2 } from 'lucide-react';
import WhatsAppService from '../services/whatsapp';

const AudioPlayer = ({ messageKey }) => {
    const [audioUrl, setAudioUrl] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const audioRef = React.useRef(null);

    useEffect(() => {
        const loadAudio = async () => {
            try {
                const base64Data = await WhatsAppService.fetchMediaUrl(messageKey);
                if (base64Data) {
                    setAudioUrl(base64Data);
                } else {
                    setError(true);
                }
            } catch (e) {
                console.error("Audio load error:", e);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        if (messageKey) {
            loadAudio();
        }
    }, [messageKey]);

    const togglePlay = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleEnded = () => {
        setIsPlaying(false);
    };

    if (loading) {
        return (
            <div className="audio-player loading">
                <Volume2 size={16} color="#00e5ff" />
                <span style={{ fontSize: '12px', marginLeft: '8px' }}>Carregando áudio...</span>
            </div>
        );
    }

    if (error || !audioUrl) {
        return (
            <div className="audio-player error">
                <Volume2 size={16} color="#ff5555" />
                <span style={{ fontSize: '12px', marginLeft: '8px' }}>Erro ao carregar áudio</span>
            </div>
        );
    }

    return (
        <div className="audio-player">
            <button
                onClick={togglePlay}
                className="play-btn"
                style={{
                    background: 'rgba(0, 229, 255, 0.2)',
                    border: '1px solid #00e5ff',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                }}
            >
                {isPlaying ? <Pause size={16} color="#00e5ff" /> : <Play size={16} color="#00e5ff" />}
            </button>
            <audio
                ref={audioRef}
                src={audioUrl}
                onEnded={handleEnded}
                style={{ display: 'none' }}
            />
            <span style={{ fontSize: '12px', marginLeft: '8px', color: 'rgba(255,255,255,0.7)' }}>
                {isPlaying ? 'Reproduzindo...' : 'Áudio do cliente'}
            </span>
        </div>
    );
};

export default AudioPlayer;

```

---

## File: src/components/BriefingModal.jsx
```jsx
import React, { useState, useEffect } from 'react';
import { X, ArrowRight, Save, Sparkles, Brain, Edit2, Check, RefreshCw, Plus } from 'lucide-react';
import { useStore } from '../store/useStore';

const BriefingModal = ({ isOpen, onClose }) => {
    const { briefing, knowledgeBase, setConfig, setKnowledgeBase } = useStore();
    const [view, setView] = useState('dashboard'); // interview, dashboard
    const [status, setStatus] = useState('idle'); // idle, thinking, showing_analysis
    const [currentQuestion, setCurrentQuestion] = useState("Para começarmos: Qual o nome da sua empresa e o que exatamente vocês fazem?");
    const [currentAnswer, setCurrentAnswer] = useState("");
    const [lastAnalysis, setLastAnalysis] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [tempAnswer, setTempAnswer] = useState("");

    // Start in dashboard view by default
    useEffect(() => {
        if (isOpen) {
            setView('dashboard');
            setStatus('idle');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleNextInterview = async () => {
        if (!currentAnswer.trim()) return;

        setStatus('thinking');
        try {
            const { default: OpenAIService } = await import('../services/openai');

            // 1. Generate strategic analysis for this point
            const analysis = await OpenAIService.analyzeKnowledgePoint(currentQuestion, currentAnswer);
            setLastAnalysis(analysis);

            const newItem = {
                id: Date.now(),
                q: currentQuestion,
                a: currentAnswer,
                analysis
            };

            const currentKB = knowledgeBase || [];
            const newKB = [...currentKB, newItem];
            setKnowledgeBase(newKB);

            // Show analysis before moving on
            setStatus('showing_analysis');
        } catch (e) {
            console.error("AURA: Error in interview step", e);
            setStatus('idle');
        }
    };

    const proceedToNext = async () => {
        setStatus('thinking');
        try {
            const { default: OpenAIService } = await import('../services/openai');
            const nextQ = await OpenAIService.generateNextBriefingQuestion(knowledgeBase);

            if (nextQ.includes("COMPLETE") || knowledgeBase.length >= 10) {
                setStatus('idle');
                setView('dashboard');
                syncBriefingText(knowledgeBase);
            } else {
                setCurrentQuestion(nextQ);
                setCurrentAnswer("");
                setLastAnalysis("");
                setStatus('idle');
            }
        } catch (e) {
            setStatus('idle');
        }
    };

    const syncBriefingText = (kb) => {
        const currentKB = kb || [];
        const text = currentKB.map(h => `[P]: ${h.q}\n[R]: ${h.a}`).join('\n\n');
        setConfig({ briefing: text });
    };

    const handleUpdatePoint = async (id) => {
        const currentKB = knowledgeBase || [];
        const point = currentKB.find(k => k.id === id);
        if (!point) return;

        setStatus('thinking');
        try {
            const { default: OpenAIService } = await import('../services/openai');
            const analysis = await OpenAIService.analyzeKnowledgePoint(point.q, tempAnswer);

            const newKB = currentKB.map(item =>
                item.id === id ? { ...item, a: tempAnswer, analysis } : item
            );

            setKnowledgeBase(newKB);
            syncBriefingText(newKB);
            setEditingId(null);
            setStatus('idle');
        } catch (e) {
            setStatus('idle');
        }
    };

    const safeKB = knowledgeBase || [];
    const hasRawBriefing = briefing && briefing.length > 0 && safeKB.length === 0;

    return (
        <div className="modal-overlay" onClick={onClose} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(10px)', zIndex: 1000, backgroundColor: 'rgba(255,255,255,0.1)' }}>
            <div className="modal-content glass-panel" style={{ width: '95%', maxWidth: '800px', padding: '0', maxHeight: '85vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 30px 60px rgba(0,0,0,0.15)' }} onClick={e => e.stopPropagation()}>

                <div className="briefing-header" style={{
                    padding: '25px 40px',
                    background: '#FFFFFF',
                    borderBottom: '1px solid rgba(0,0,0,0.05)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
                        <div style={{ padding: '12px', background: 'rgba(197, 160, 89, 0.1)', borderRadius: '14px' }}>
                            <Brain size={26} color="var(--accent-primary)" />
                        </div>
                        <div>
                            <h2 style={{ color: '#1d1d1f', margin: 0, fontSize: '20px', fontWeight: 'bold' }}>Cérebro Estratégico AURA</h2>
                            <p style={{ color: '#86868b', margin: 0, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>Treinamento Avançado de Inteligência</p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                        <button
                            onClick={() => { if (confirm("Deseja apagar o conhecimento atual e começar uma nova entrevista?")) { setKnowledgeBase([]); setConfig({ briefing: '' }); setView('interview'); setStatus('idle'); } }}
                            style={{ background: '#FFF5F5', color: '#ff4d4d', border: '1px solid #FFEBEB', padding: '8px 16px', borderRadius: '10px', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold' }}
                        >
                            Resetar Cérebro
                        </button>
                        <X size={24} color="#1d1d1f" onClick={onClose} style={{ cursor: 'pointer', opacity: 0.3 }} />
                    </div>
                </div>

                <div className="briefing-body" style={{ padding: '40px', overflowY: 'auto', flex: 1, background: '#FDFDFD' }}>

                    {view === 'interview' ? (
                        <div className="interview-flow" style={{ maxWidth: '650px', margin: '20px auto' }}>
                            <div className="question-area" style={{
                                background: '#FFFFFF',
                                padding: '30px', /* REDUCED: Was 45px */
                                borderRadius: '24px',
                                border: '1px solid rgba(197, 160, 89, 0.2)',
                                boxShadow: '0 10px 30px rgba(197, 160, 89, 0.05)'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                                    <Sparkles size={14} color="var(--accent-primary)" />
                                    <span style={{ color: 'var(--accent-primary)', fontWeight: 'bold', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Aura Mentor</span>
                                </div>

                                <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', color: '#1d1d1f', lineHeight: '1.4', fontWeight: 'bold' }}>
                                    {status === 'thinking' ? "Gerando Insight..." : currentQuestion}
                                </h3>

                                {status === 'showing_analysis' ? (
                                    <div style={{ animation: 'fadeIn 0.5s ease' }}>
                                        {/* Show Answer (Read Only) */}
                                        <div style={{ marginBottom: '20px', padding: '20px', background: '#F9F9FA', borderRadius: '16px', border: '1px solid #E5E5E7', fontSize: '15px', color: '#1d1d1f' }}>
                                            {currentAnswer}
                                        </div>

                                        {/* Analysis Box - Clean White/Gray (No Beige) */}
                                        <div style={{
                                            background: '#FFFFFF',
                                            border: '1px solid #E5E5E7',
                                            borderRadius: '20px',
                                            padding: '25px',
                                            marginBottom: '30px',
                                            position: 'relative',
                                            boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                                                <Sparkles size={16} color="var(--accent-primary)" />
                                                <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--accent-primary)', textTransform: 'uppercase' }}>Insight Aura</span>
                                            </div>
                                            <p style={{ margin: 0, fontSize: '14px', color: '#4a4a4c', fontStyle: 'italic', lineHeight: '1.6' }}>
                                                "{lastAnalysis}"
                                            </p>
                                        </div>

                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <button
                                                onClick={() => setStatus('idle')} // Go back to editing
                                                style={{ background: 'transparent', border: 'none', color: '#86868b', textDecoration: 'underline', cursor: 'pointer', fontSize: '13px' }}
                                            >
                                                Editar minha resposta
                                            </button>

                                            <button
                                                className="btn-primary"
                                                onClick={proceedToNext}
                                                style={{ padding: '15px 45px', borderRadius: '50px', fontWeight: 'bold' }}
                                            >
                                                Próxima Pergunta <ArrowRight size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div style={{ position: 'relative' }}>
                                            <textarea
                                                autoFocus
                                                value={currentAnswer}
                                                onChange={(e) => setCurrentAnswer(e.target.value)}
                                                placeholder="Sua resposta moldará como a IA atende seus clientes..."
                                                style={{
                                                    width: '100%',
                                                    background: '#F9F9FA',
                                                    border: '1px solid #E5E5E7',
                                                    borderRadius: '16px',
                                                    padding: '25px',
                                                    color: '#1d1d1f',
                                                    fontSize: '16px',
                                                    minHeight: '180px',
                                                    lineHeight: '1.6',
                                                    outline: 'none',
                                                    resize: 'none',
                                                    transition: 'border-color 0.2s'
                                                }}
                                                onFocus={e => e.target.style.borderColor = 'var(--accent-primary)'}
                                                onBlur={e => e.target.style.borderColor = '#E5E5E7'}
                                            />
                                            {status === 'thinking' && (
                                                <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.7)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <RefreshCw className="spin" size={32} color="var(--accent-primary)" />
                                                </div>
                                            )}
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '30px' }}>
                                            <button
                                                className="btn-primary"
                                                onClick={handleNextInterview}
                                                disabled={!currentAnswer.trim() || status === 'thinking'}
                                                style={{ padding: '15px 45px', borderRadius: '50px', fontWeight: 'bold' }}
                                            >
                                                {status === 'thinking' ? "Analisando..." : "Confirmar Visão"} <ArrowRight size={18} />
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="knowledge-dashboard" style={{ maxWidth: '750px', margin: '0 auto' }}>
                            {/* IF NO STRUCTURED DATA, BUT RAW BRIEFING EXISTS */}
                            {safeKB.length === 0 && hasRawBriefing && (
                                <div style={{ marginBottom: '30px', padding: '20px', background: '#FFF9E6', border: '1px solid #FFE4A3', borderRadius: '16px' }}>
                                    <h4 style={{ margin: '0 0 10px 0', color: '#977A23' }}>Conhecimento Bruto Detectado</h4>
                                    <p style={{ margin: 0, fontSize: '13px', color: '#977A23', opacity: 0.8 }}>
                                        Você possui dados de briefing inseridos manualmente. Eles estão ativos, mas não visualizáveis em cards estruturados.
                                        Para criar uma estrutura organizada, inicie a entrevista abaixo.
                                    </p>
                                </div>
                            )}

                            {safeKB.length === 0 && !hasRawBriefing ? (
                                <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                                    <div style={{ background: '#F9F9FA', display: 'inline-flex', padding: '20px', borderRadius: '50%', marginBottom: '20px' }}>
                                        <Brain size={40} color="#E5E5E7" />
                                    </div>
                                    <h3 style={{ color: '#1d1d1f', marginBottom: '10px' }}>Cérebro Não Estruturado</h3>
                                    <p style={{ color: '#86868b', maxWidth: '400px', margin: '0 auto 30px auto', lineHeight: '1.5' }}>
                                        A Aura ainda não possui um mapa mental estruturado do seu negócio.
                                        Inicie a entrevista para criar regras claras de atendimento.
                                    </p>
                                    <button onClick={() => setView('interview')} className="btn-primary" style={{ padding: '15px 40px', borderRadius: '50px', fontWeight: 'bold' }}>
                                        Iniciar Entrevista Guiada <ArrowRight size={16} />
                                    </button>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                                    {safeKB.map((point) => (
                                        <div key={point.id} className="knowledge-card" style={{
                                            padding: '30px',
                                            background: '#FFFFFF',
                                            border: '1px solid #E5E5E7',
                                            borderRadius: '24px',
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
                                        }}>
                                            {/* QUESTION - BOLD AS REQUESTED */}
                                            <div style={{ color: '#1d1d1f', fontSize: '16px', fontWeight: '800', marginBottom: '12px', lineHeight: '1.4' }}>
                                                {point.q}
                                            </div>

                                            {/* ANSWER */}
                                            <div style={{ position: 'relative', marginBottom: '20px' }}>
                                                {editingId === point.id ? (
                                                    <textarea
                                                        autoFocus
                                                        value={tempAnswer}
                                                        onChange={e => setTempAnswer(e.target.value)}
                                                        style={{ width: '100%', background: '#F9F9FA', border: '1px solid var(--accent-primary)', borderRadius: '12px', padding: '15px', color: '#1d1d1f', outline: 'none' }}
                                                    />
                                                ) : (
                                                    <div style={{ color: '#4a4a4c', fontSize: '14px', lineHeight: '1.6' }}>{point.a}</div>
                                                )}

                                                <div style={{ position: 'absolute', top: 0, right: 0 }}>
                                                    {editingId === point.id ? (
                                                        <div style={{ display: 'flex', gap: '10px' }}>
                                                            <button onClick={() => handleUpdatePoint(point.id)} style={{ color: '#C5A059', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px' }}>SALVAR</button>
                                                            <button onClick={() => setEditingId(null)} style={{ color: '#86868b', border: 'none', background: 'none', cursor: 'pointer', fontSize: '11px' }}>CANCELAR</button>
                                                        </div>
                                                    ) : (
                                                        <Edit2 size={14} color="#86868b" style={{ cursor: 'pointer' }} onClick={() => { setEditingId(point.id); setTempAnswer(point.a); }} />
                                                    )}
                                                </div>
                                            </div>

                                            {/* AI ANALYSIS - INTEGRATED AFTER RESPONSE AS REQUESTED */}
                                            {point.analysis && (
                                                <div style={{
                                                    marginTop: '15px',
                                                    padding: '18px',
                                                    background: '#F9F9FA', /* CHANGED: Clean Gray */
                                                    border: '1px solid #E5E5E7', /* CHANGED: Clean Border */
                                                    borderRadius: '16px',
                                                    display: 'flex',
                                                    gap: '12px'
                                                }}>
                                                    <Sparkles size={16} color="var(--accent-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                                                    <div>
                                                        <span style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: 'var(--accent-primary)', textTransform: 'uppercase', marginBottom: '5px' }}>Insight Estratégico Aura</span>
                                                        <p style={{ margin: 0, fontSize: '13px', color: '#6d6d6f', lineHeight: '1.5', fontStyle: 'italic' }}>
                                                            {point.analysis}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}

                                    {/* Action to add more or restart */}
                                    <div style={{
                                        marginTop: '30px',
                                        padding: '20px',
                                        borderRadius: '20px',
                                        background: '#F9F9FA',
                                        border: '1px solid #E5E5E7',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        gap: '15px'
                                    }}>
                                        <p style={{ margin: 0, fontSize: '13px', color: '#86868b' }}>Deseja expandir o conhecimento da Aura?</p>
                                        <button onClick={() => setView('interview')} className="btn-secondary" style={{ borderRadius: '50px', padding: '10px 30px', fontSize: '12px' }}>
                                            <Plus size={14} style={{ marginRight: '5px' }} /> Continuar Entrevista
                                        </button>
                                    </div>

                                    <div style={{ textAlign: 'center', marginTop: '10px' }}>
                                        <button onClick={onClose} className="btn-primary" style={{ padding: '15px 60px', borderRadius: '50px' }}>
                                            Finalizar e Salvar
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BriefingModal;

```

---

## File: src/components/CRMCard.jsx
```jsx
import React, { useState } from 'react';
import { MessageCircle, Brain } from 'lucide-react';
import { useStore } from '../store/useStore';
import { formatJid } from '../utils/formatter';
import OpenAIService from '../services/openai';

const CRMCard = ({ chat, tag }) => {
    const { setActiveChat, chatNextSteps, setNextSteps, messages } = useStore();
    const [analyzing, setAnalyzing] = useState(false);

    const jid = chat.remoteJid || chat.jid || chat.id;
    const msg = chat.lastMessage?.message || chat.message || {};

    let name = [
        chat.name,
        chat.pushName,
        chat.verifiedName,
        chat.lastMessage?.pushName,
    ].find(n => n && n !== 'Você' && !n.includes('@lid'));

    const patientName = name || formatJid(jid);

    // Get last message preview
    const lastMessage = (() => {
        const content = msg.conversation ||
            msg.extendedTextMessage?.text ||
            msg.imageMessage?.caption || "";

        if (content) return content.length > 60 ? content.substring(0, 60) + "..." : content;
        if (msg.audioMessage) return "🎵 Áudio";
        if (msg.imageMessage) return "📸 Imagem";
        return "Sem mensagens recentes";
    })();

    // Time ago calculation
    const getTimeAgo = () => {
        const ts = chat.lastMessage?.messageTimestamp || chat.messageTimestamp || 0;
        const now = Date.now();
        const diff = now - (ts * 1000);

        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 60) return `${minutes}m atrás`;
        if (hours < 24) return `${hours}h atrás`;
        return `${days}d atrás`;
    };

    const nextSteps = chatNextSteps[jid];

    const handleAnalyze = async (e) => {
        e.stopPropagation();
        setAnalyzing(true);

        try {
            // Format chat history for AI
            const chatHistory = messages
                .map(m => {
                    const isFromMe = m.key?.fromMe;
                    const text = m.message?.conversation ||
                        m.message?.extendedTextMessage?.text ||
                        '[Mídia]';
                    return `${isFromMe ? 'Clínica' : patientName}: ${text}`;
                })
                .join('\n');

            const result = await OpenAIService.analyzeNextSteps(
                chatHistory || 'Conversa ainda não carregada',
                patientName,
                tag.name
            );

            setNextSteps(jid, result);
        } catch (error) {
            console.error('Error analyzing next steps:', error);
        } finally {
            setAnalyzing(false);
        }
    };

    const handleOpenChat = () => {
        setActiveChat({ id: jid, name: patientName });
        useStore.getState().setCurrentView('dashboard');
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return '#ef4444';
            case 'medium': return '#f59e0b';
            case 'low': return '#10b981';
            default: return '#6b7280';
        }
    };

    const getPriorityLabel = (priority) => {
        switch (priority) {
            case 'high': return '🔴 Alta';
            case 'medium': return '🟡 Média';
            case 'low': return '🟢 Baixa';
            default: return 'Normal';
        }
    };

    return (
        <div className="crm-card" onClick={handleOpenChat}>
            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: 'var(--text-main)' }}>
                    {patientName}
                </h4>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    {getTimeAgo()}
                </span>
            </div>

            <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '0 0 10px 0', lineHeight: '1.4' }}>
                {lastMessage}
            </p>

            {nextSteps && (
                <div className="next-steps" style={{
                    background: '#f8fafc',
                    borderRadius: '6px',
                    padding: '10px',
                    marginBottom: '10px',
                    fontSize: '12px'
                }}>
                    <h5 style={{ margin: '0 0 8px 0', fontSize: '11px', fontWeight: '600', color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Próximos Passos:
                    </h5>
                    <ul style={{ margin: '0', paddingLeft: '18px', color: 'var(--text-main)' }}>
                        {nextSteps.steps.map((step, i) => (
                            <li key={i} style={{ marginBottom: '4px', lineHeight: '1.4' }}>{step}</li>
                        ))}
                    </ul>
                    <div style={{
                        marginTop: '8px',
                        fontSize: '11px',
                        fontWeight: '600',
                        color: getPriorityColor(nextSteps.priority)
                    }}>
                        {getPriorityLabel(nextSteps.priority)}
                    </div>
                </div>
            )}

            <div className="card-actions" style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                <button
                    onClick={handleOpenChat}
                    style={{
                        flex: 1,
                        padding: '8px',
                        background: 'var(--accent-primary)',
                        color: '#000',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px'
                    }}
                >
                    <MessageCircle size={14} />
                    Abrir
                </button>
                <button
                    onClick={handleAnalyze}
                    disabled={analyzing}
                    style={{
                        flex: 1,
                        padding: '8px',
                        background: analyzing ? '#e5e7eb' : '#3b82f6',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: analyzing ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px',
                        opacity: analyzing ? 0.6 : 1
                    }}
                >
                    <Brain size={14} />
                    {analyzing ? 'Analisando...' : 'Analisar'}
                </button>
            </div>
        </div>
    );
};

export default CRMCard;

```

---

## File: src/components/CRMColumn.jsx
```jsx
import React from 'react';
import CRMCard from './CRMCard';

const CRMColumn = ({ tag, chats }) => {
    return (
        <div className="crm-column" style={{
            background: 'white',
            borderRadius: '20px',
            padding: '20px',
            minWidth: '300px',
            border: '1px solid rgba(0,0,0,0.05)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
            display: 'flex',
            flexDirection: 'column',
            gap: '15px'
        }}>
            <div className="column-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px' }}>
                <span style={{ fontSize: '14px', fontWeight: '800', color: '#1d1d1f', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: tag.color }}></div>
                    {tag.name}
                </span>
                <span className="count" style={{
                    background: 'rgba(0,0,0,0.03)',
                    color: '#86868b',
                    padding: '4px 12px',
                    borderRadius: '100px',
                    fontSize: '11px',
                    fontWeight: 'bold'
                }}>
                    {chats.length}
                </span>
            </div>

            <div className="column-body scrollable">
                {chats.length === 0 ? (
                    <div style={{
                        padding: '40px 20px',
                        textAlign: 'center',
                        color: 'var(--text-muted)',
                        fontSize: '13px'
                    }}>
                        Nenhum lead neste estágio
                    </div>
                ) : (
                    chats.map(chat => {
                        const jid = chat.remoteJid || chat.jid || chat.id;
                        return (
                            <CRMCard
                                key={jid}
                                chat={chat}
                                tag={tag}
                            />
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default CRMColumn;

```

---

## File: src/components/CRMView.jsx
```jsx
import React from 'react';
import { useStore } from '../store/useStore';
import CRMColumn from './CRMColumn';

const CRMView = () => {
    const { tags, chats, chatTags } = useStore();

    // Calculate stats
    const totalLeads = Object.keys(chatTags).length;
    const fechadosCount = Object.values(chatTags).filter(t => t === 'fechado').length;
    const conversionRate = totalLeads > 0 ? Math.round((fechadosCount / totalLeads) * 100) : 0;

    return (
        <div className="crm-container" style={{ background: '#FDFDFD', height: '100%', padding: '30px', display: 'flex', flexDirection: 'column' }}>
            <div className="crm-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '35px' }}>
                <div>
                    <h2 style={{ margin: 0, color: '#1d1d1f', fontSize: '24px', fontWeight: 'bold' }}>Pipeline de Vendas</h2>
                    <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#86868b' }}>
                        Acompanhe o funil de conversão e gerencie seus leads
                    </p>
                </div>
                <div className="crm-stats" style={{ display: 'flex', gap: '20px' }}>
                    <div className="stat-card" style={{ background: 'white', padding: '15px 25px', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 4px 10px rgba(0,0,0,0.03)', textAlign: 'right' }}>
                        <div style={{ fontSize: '11px', color: '#86868b', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '5px' }}>Total de Leads</div>
                        <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#1d1d1f' }}>{totalLeads}</div>
                    </div>
                    <div className="stat-card" style={{ background: 'white', padding: '15px 25px', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 4px 10px rgba(0,0,0,0.03)', textAlign: 'right' }}>
                        <div style={{ fontSize: '11px', color: '#86868b', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '5px' }}>Conversão</div>
                        <div style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--accent-primary)' }}>{conversionRate}%</div>
                    </div>
                </div>
            </div>

            <div className="crm-board">
                {tags.map(tag => {
                    const tagChats = chats.filter(c => {
                        const jid = c.remoteJid || c.jid || c.id;
                        return chatTags[jid] === tag.id;
                    });

                    return (
                        <CRMColumn
                            key={tag.id}
                            tag={tag}
                            chats={tagChats}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default CRMView;

```

---

## File: src/components/ChatArea.jsx
```jsx
import React, { useEffect, useState, useRef } from 'react';
import { Zap, Bot, Send, Check, BarChart3, Target, Wand2, Paperclip, Mic, Image, FileText, Camera, Tag, Archive, ChevronLeft, X, Pencil } from 'lucide-react';
// Note: Removed Box since I'll use standard div to avoid extra dependencies if not installed
import { useStore } from '../store/useStore';
import WhatsAppService from '../services/whatsapp';
import { formatJid } from '../utils/formatter';
import AudioPlayer from './AudioPlayer';
import ImageViewer from './ImageViewer';

const ChatArea = ({ isArchived = false, onBack }) => {
    const { activeChat, messages, setMessages, clearMessages, briefing, setActiveChat, chatTags, tags } = useStore();

    // GUARD CLAUSE: If no chat is active, don't render anything
    if (!activeChat) return null;

    const [loading, setLoading] = useState(false);
    const [suggestion, setSuggestion] = useState('');
    const [analysisData, setAnalysisData] = useState({ level: '', intent: '', strategy: '' });
    const [input, setInput] = useState('');
    const [sending, setSending] = useState(false);
    const [isEnhancing, setIsEnhancing] = useState(false);
    const [showAttachMenu, setShowAttachMenu] = useState(false);
    const [isAnalysisOpen, setIsAnalysisOpen] = useState(false); // Mobile Analysis Overlay state

    // DIALOG SYSTEM STATE
    const [dialog, setDialog] = useState({ isOpen: false, type: '', title: '', message: '', onConfirm: null, inputPlaceholder: '' });
    const [dialogInput, setDialogInput] = useState('');

    const activeJidRef = useRef(null);

    const loadMessages = async () => {
        const jid = activeChat?.id;
        if (!jid) return;

        try {
            // v7.9 UNIFIED FETCH: Pass linkedLid to recover "missing" audios
            const linkedLid = activeChat.linkedLid || null;
            const data = await WhatsAppService.fetchMessages(jid, linkedLid);

            if (activeJidRef.current === jid) {
                setMessages(jid, data || []);
            }
        } catch (e) {
            console.error("AURA ChatArea v6 Error:", e);
        }
    };

    const messagesEndRef = useRef(null);
    const isFirstLoadRef = useRef(true); // Track if it's the first render for this chat

    const scrollToBottom = (behavior = "smooth") => {
        messagesEndRef.current?.scrollIntoView({ behavior });
    };

    useEffect(() => {
        // Strictly only scroll to bottom on initial chat load
        if (isFirstLoadRef.current && messages.length > 0) {
            console.log("AURA: Performing initial scroll to bottom");
            scrollToBottom("auto");
            isFirstLoadRef.current = false;
        }
    }, [messages]);

    useEffect(() => {
        const jid = activeChat?.id;
        activeJidRef.current = jid;
        isFirstLoadRef.current = true; // Reset for new chat selection

        clearMessages();
        setSuggestion('');
        setInput('');
        setAnalysisData({ level: '', intent: '', strategy: '' });
        setShowAttachMenu(false);

        if (jid) {
            setLoading(true);
            loadMessages().then(() => setLoading(false));
            const interval = setInterval(loadMessages, 5000); // Reduced from 10s to 5s
            return () => clearInterval(interval);
        }
    }, [activeChat?.id]);

    const handleAnalyze = async () => {
        if (!activeChat) return;

        // Visual Feedback
        const WandIcon = document.querySelector('.btn-primary.v3-btn svg');
        if (WandIcon) WandIcon.style.animation = 'spin 1s linear infinite';

        try {
            // 1. EXTRACT STRUCTURED CONTEXT (ChatML Format)
            const rawName = activeChat.name || "";
            const isNumeric = /^\d+$/.test(rawName.replace(/\D/g, ''));
            const clientName = (isNumeric || rawName.includes('@') || !rawName) ? "Cliente" : rawName;

            const structuredHistory = messages.slice(-15).map(m => {
                const isMe = m.key?.fromMe || m.fromMe;
                const msg = m.message || {};
                const text = msg.conversation ||
                    msg.extendedTextMessage?.text ||
                    m.content ||
                    m.text ||
                    "";
                return {
                    role: isMe ? 'assistant' : 'user',
                    content: text
                };
            }).filter(m => m.content.trim() !== "");

            const lastClientMsg = [...messages].reverse().find(m => !(m.key?.fromMe || m.fromMe));
            const lastClientText = lastClientMsg?.message?.conversation ||
                lastClientMsg?.message?.extendedTextMessage?.text ||
                lastClientMsg?.content ||
                lastClientMsg?.text ||
                "";

            setSuggestion(`Aura Orquestrador v8.7: Sincronizando contexto completo v1.1.7...`);

            // 2. RAG ORCHESTRATION
            const RAGService = (await import('../services/rag')).default;
            const extraContext = await RAGService.getRelevantContext(lastClientText);

            // 3. GENERATE AI SUGGESTION
            const { default: OpenAIService } = await import('../services/openai');
            const aiRes = await OpenAIService.generateSuggestion({
                clientName,
                history: structuredHistory,
                extraContext,
                briefing: briefing || "Negócio de Alto Padrão"
            });

            if (aiRes) {
                // Metadata markers for visual context
                const lowerAi = aiRes.toLowerCase();
                let finalLevel = "Consciente da Solução";
                let finalIntent = "Interação Dinâmica";
                let finalStrategy = "Persuasão Adaptativa";

                if (lowerAi.includes('agenda') || lowerAi.includes('horário')) finalIntent = "Agendamento";
                if (lowerAi.includes('preço') || lowerAi.includes('valor')) finalIntent = "Financeiro";

                setAnalysisData({ level: finalLevel, intent: finalIntent, strategy: finalStrategy });
                setSuggestion(aiRes.trim());
            } else {
                setSuggestion("Não foi possível gerar uma sugestão no momento. Tente novamente.");
            }
        } catch (e) {
            console.error("AURA Analysis Error:", e);
            setSuggestion("Ops! Ocorreu um erro na análise inteligente.");
        } finally {
            if (WandIcon) WandIcon.style.animation = 'none';
        }
    };

    const handleEnhance = async () => {
        if (!input.trim() || isEnhancing) return;

        setIsEnhancing(true);
        const originalInput = input;
        setInput("✨ Aura refinando sua mensagem...");

        try {
            // Use AI to enhance the message
            const { default: OpenAIService } = await import('../services/openai');
            const enhanced = await OpenAIService.enhanceMessage(originalInput, { briefing });

            if (enhanced && enhanced !== originalInput) {
                setInput(enhanced);
            } else {
                // Fallback to original if AI fails
                setInput(originalInput);
            }
        } catch (e) {
            console.error("AURA Enhance Error:", e);
            setInput(originalInput); // Restore original on error
        } finally {
            setIsEnhancing(false);
        }
    };

    // AUDIO RECORDER LOGIC
    const [recording, setRecording] = useState(false);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

    const handleMicClick = async () => {
        if (recording) {
            if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
                mediaRecorderRef.current.stop();
            }
            setRecording(false);
        } else {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                const mediaRecorder = new MediaRecorder(stream);
                mediaRecorderRef.current = mediaRecorder;
                audioChunksRef.current = [];

                mediaRecorder.ondataavailable = (event) => {
                    if (event.data.size > 0) {
                        audioChunksRef.current.push(event.data);
                    }
                };

                mediaRecorder.onstop = async () => {
                    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/mp4' });
                    const audioFile = new File([audioBlob], "voice_message.mp3", { type: 'audio/mp4' });

                    setSending(true);
                    try {
                        console.log("AURA: Sending Voice Message...");
                        await WhatsAppService.sendMedia(activeChat.id, audioFile, "", true);
                        loadMessages();
                    } catch (e) {
                        console.error("Audio Send Error:", e);
                        alert("❌ Erro ao enviar áudio.");
                    } finally {
                        setSending(false);
                    }

                    stream.getTracks().forEach(track => track.stop());
                };

                mediaRecorder.start();
                setRecording(true);
            } catch (err) {
                console.error("Mic Access Error:", err);
                alert("❌ Erro ao acessar microfone. Verifique as permissões.");
            }
        }
    };

    const handleSend = async (e) => {
        if (e) e.preventDefault();
        const jid = activeChat?.id;
        if (!input.trim() || sending || !jid) return;

        setSending(true);
        try {
            // Pass activeChat to enable phone number extraction from metadata
            const res = await WhatsAppService.sendMessage(jid, input, activeChat);

            // Check if message was sent successfully
            if (res && !res.error) {
                console.log("✅ Mensagem enviada com sucesso");
                setInput('');
                loadMessages();
            } else {
                // Show error to user
                const errorMsg = res?.message || 'Erro ao enviar mensagem';
                console.error("❌ Erro ao enviar:", errorMsg);
                openConfirm("Falha no Envio", `${errorMsg}\n\n💡 Dica: Use o botão de lápis (✏️) no topo para corrigir o número.`);
            }
        } catch (e) {
            console.error("AURA Send Error:", e);
            openConfirm("Erro", `Erro inesperado: ${e.message}`);
        }
        setSending(false);
    };

    const useSuggestion = () => {
        if (suggestion && !suggestion.includes('...')) {
            setInput(suggestion);
        }
    };

    // DIALOG HELPERS
    const openConfirm = (title, message, onConfirm) => {
        setDialog({ isOpen: true, type: 'confirm', title, message, onConfirm, inputPlaceholder: '' });
    };

    const openPrompt = (title, initialValue, onConfirm) => {
        setDialogInput(initialValue || '');
        setDialog({ isOpen: true, type: 'prompt', title, message: '', onConfirm, inputPlaceholder: 'Digite aqui...' });
    };

    const handleDialogClose = () => {
        setDialog({ ...dialog, isOpen: false });
        setDialogInput('');
    };

    const handleDialogConfirm = () => {
        if (dialog.onConfirm) {
            dialog.onConfirm(dialog.type === 'prompt' ? dialogInput : true);
        }
        handleDialogClose();
    };

    // v7.11 REAL IMPLEMENTATIONS (Using Custom Dialogs)
    const handleTag = () => {
        const { setTag, tags } = useStore.getState();

        openConfirm(
            'Etiquetar Conversa',
            <div style={{ marginTop: '15px' }}>
                <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    color: '#ffffff',
                    fontSize: '14px',
                    fontWeight: '500'
                }}>
                    Selecione o estágio do lead:
                </label>
                <select
                    id="tagSelect"
                    style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid #475569',
                        background: '#1e293b',
                        color: '#ffffff',
                        fontSize: '14px',
                        cursor: 'pointer',
                        outline: 'none'
                    }}
                >
                    <option value="" style={{ color: '#94a3b8' }}>Selecione uma tag...</option>
                    {tags.map(tag => (
                        <option key={tag.id} value={tag.id} style={{ color: '#ffffff' }}>
                            {tag.icon} {tag.name}
                        </option>
                    ))}
                </select>
            </div>,
            () => {
                const select = document.getElementById('tagSelect');
                const tagId = select?.value;

                if (!tagId) {
                    alert('⚠️ Selecione uma tag válida!');
                    return;
                }

                setTag(activeChat.id, tagId);
                alert('✅ Tag aplicada com sucesso!');
            }
        );
    };

    const handleArchive = () => {
        const { setActiveChat } = useStore.getState();
        const archived = JSON.parse(localStorage.getItem('archived_chats') || '[]');
        const isArchived = archived.includes(activeChat.id);

        openConfirm(
            isArchived ? 'Desarquivar Conversa?' : 'Arquivar Conversa?',
            `Deseja realmente ${isArchived ? 'desarquivar' : 'arquivar'} a conversa com ${activeChat.name}?`,
            () => {
                if (isArchived) {
                    const updated = archived.filter(id => id !== activeChat.id);
                    localStorage.setItem('archived_chats', JSON.stringify(updated));
                    alert('✅ Conversa desarquivada!');
                } else {
                    archived.push(activeChat.id);
                    localStorage.setItem('archived_chats', JSON.stringify(archived));

                    // Clear active chat and show success message
                    setActiveChat(null);
                    alert('✅ Conversa arquivada! Acesse no Histórico.');
                }

                // Trigger chat list refresh
                window.dispatchEvent(new Event('storage'));
            }
        );
    };

    const handleAttachmentClick = async (type) => {
        setShowAttachMenu(false);
        console.log(`AURA: Attachment Clicked - ${type}`);

        const input = document.createElement('input');
        input.type = 'file';
        input.style.display = 'none';
        document.body.appendChild(input);

        if (type === 'Fotos/Vídeos') {
            input.accept = 'image/*,video/*';
        } else if (type === 'Documento') {
            input.accept = '.pdf,.doc,.docx,.txt,.xlsx,.xls';
        } else if (type === 'Câmera') {
            input.accept = 'image/*';
            input.capture = 'environment';
        }

        input.onchange = async (e) => {
            const file = e.target.files[0];
            document.body.removeChild(input);
            if (!file) return;

            openPrompt(`Enviar: ${file.name}`, '', async (caption) => {
                try {
                    setSending(true);
                    const res = await WhatsAppService.sendMedia(activeChat.id, file, caption || '');
                    if (res) {
                        loadMessages();
                    } else {
                        console.error("Upload failed result:", res);
                    }
                } catch (err) {
                    console.error('Upload error:', err);
                } finally {
                    setSending(false);
                }
            });
        };

        setTimeout(() => input.click(), 50);
    };

    if (!activeChat) {
        return (
            <div className="empty-dashboard">
                <Bot size={64} color="var(--accent-primary)" style={{ opacity: 0.5 }} />
                <h2>AURA v3 Dashboard</h2>
                <p>Selecione um cliente para iniciar a consultoria de vendas</p>
            </div>
        );
    }

    return (
        <main className="chat-area" style={{ position: 'relative' }}>
            {/* CUSTOM DIALOG MODAL */}
            {dialog.isOpen && (
                <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.7)', zIndex: 1000,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <div className="glass-panel" style={{ padding: '20px', width: '300px', borderRadius: '12px', border: '1px solid var(--glass-border)', background: '#0f172a' }}>
                        <h4 style={{ margin: '0 0 10px 0', color: '#fff' }}>{dialog.title}</h4>
                        {dialog.message && <p style={{ color: '#ccc', marginBottom: '15px' }}>{dialog.message}</p>}

                        {dialog.type === 'prompt' && (
                            <input
                                type="text"
                                value={dialogInput}
                                onChange={(e) => setDialogInput(e.target.value)}
                                placeholder={dialog.inputPlaceholder}
                                style={{
                                    width: '100%', padding: '8px', borderRadius: '6px',
                                    border: '1px solid #334155', background: '#1e293b', color: '#fff',
                                    marginBottom: '15px'
                                }}
                                autoFocus
                            />
                        )}

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                            <button onClick={handleDialogClose} style={{ padding: '8px 16px', background: 'transparent', border: '1px solid #475569', color: '#cbd5e1', borderRadius: '6px', cursor: 'pointer' }}>
                                Cancelar
                            </button>
                            <button onClick={handleDialogConfirm} style={{ padding: '8px 16px', background: 'var(--accent-primary)', border: 'none', color: '#000', fontWeight: 'bold', borderRadius: '6px', cursor: 'pointer' }}>
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MOBILE ANALYSIS OVERLAY */}
            {isAnalysisOpen && (
                <div className="sidebar-overlay open" onClick={() => setIsAnalysisOpen(false)} style={{ zIndex: 2000 }}>
                    <div
                        className="glass-panel"
                        style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            width: '100%',
                            maxHeight: '80vh',
                            borderTopLeftRadius: '25px',
                            borderTopRightRadius: '25px',
                            padding: '30px 20px',
                            overflowY: 'auto'
                        }}
                        onClick={e => e.stopPropagation()}
                    >
                        <div style={{ width: '40px', height: '5px', background: '#ccc', borderRadius: '5px', margin: '0 auto 20px auto' }} onClick={() => setIsAnalysisOpen(false)} />
                        <h2 style={{ marginBottom: '20px', fontSize: '20px', textAlign: 'center' }}>Análise Estratégica</h2>

                        {analysisData.level ? (
                            <div className="analysis-content">
                                <div style={{ marginBottom: '15px', background: 'rgba(0,0,0,0.03)', padding: '15px', borderRadius: '12px' }}>
                                    <h4 style={{ color: 'var(--accent-primary)', fontSize: '11px', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.5px' }}>Nível de Consciência</h4>
                                    <p style={{ fontSize: '15px', lineHeight: '1.4' }}>{analysisData.level}</p>
                                </div>
                                <div style={{ marginBottom: '15px', background: 'rgba(0,0,0,0.03)', padding: '15px', borderRadius: '12px' }}>
                                    <h4 style={{ color: 'var(--accent-primary)', fontSize: '11px', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.5px' }}>Intenção do Lead</h4>
                                    <p style={{ fontSize: '15px', lineHeight: '1.4' }}>{analysisData.intent}</p>
                                </div>
                                <div style={{ background: 'rgba(0,0,0,0.03)', padding: '15px', borderRadius: '12px' }}>
                                    <h4 style={{ color: 'var(--accent-primary)', fontSize: '11px', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.5px' }}>Estratégia Recomendada</h4>
                                    <p style={{ fontSize: '15px', lineHeight: '1.4' }}>{analysisData.strategy}</p>
                                </div>
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '40px 0', opacity: 0.5 }}>
                                <Bot size={40} style={{ marginBottom: '10px' }} />
                                <p>Nenhuma análise disponível.<br />Clique em "Analisar Conversa" abaixo.</p>
                            </div>
                        )}

                        <button
                            className="btn-primary v3-btn"
                            onClick={() => { handleAnalyze(); setIsAnalysisOpen(false); }}
                            style={{ width: '100%', marginTop: '30px', height: '54px', borderRadius: '16px', fontWeight: 'bold' }}
                        >
                            <Wand2 size={20} /> Analisar agora
                        </button>
                    </div>
                </div>
            )}

            <header className="chat-header glass-panel">
                <div className="active-info" style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <button
                            className="mobile-back-btn"
                            onClick={onBack}
                            style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'none', marginRight: '5px' }}
                        >
                            <ChevronLeft size={24} color="var(--accent-primary)" />
                        </button>
                        <h3 style={{ margin: 0 }}>{activeChat.name && activeChat.name !== formatJid(activeChat.id) ? activeChat.name : formatJid(activeChat.id)}</h3>
                        {chatTags[activeChat.id] && (() => {
                            const tag = tags.find(t => t.id === chatTags[activeChat.id]);
                            if (tag) {
                                return (
                                    <span style={{
                                        fontSize: '11px',
                                        background: tag.color + '33', // 20% opacity
                                        color: tag.color,
                                        padding: '2px 8px',
                                        borderRadius: '12px',
                                        border: `1px solid ${tag.color}`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                        fontWeight: '600'
                                    }}>
                                        {tag.icon} {tag.name}
                                    </span>
                                );
                            }
                            return null;
                        })()}

                        <button
                            onClick={() => {
                                const current = WhatsAppService.extractPhoneNumber(activeChat.id, activeChat);
                                const newPhone = window.prompt("✏️ CORREÇÃO MANUAL\n\nEste contato está sem número (apenas ID). Para conseguir responder, digite o número correto do WhatsApp (com DDD, apenas números):\n\nEx: 5531999998888", current || "");
                                if (newPhone && /^\d{10,15}$/.test(newPhone)) {
                                    WhatsAppService.setManualPhoneMapping(activeChat.id, newPhone);
                                    alert(`✅ Número ${newPhone} salvo para este contato!\nTente enviar a mensagem novamente.`);
                                } else if (newPhone) {
                                    alert("❌ Número inválido. Digite entre 10 e 15 números (ex: 55319...)");
                                }
                            }}
                            className="icon-btn"
                            title="Corrigir Número"
                            style={{
                                marginLeft: '8px',
                                padding: '4px',
                                background: 'rgba(255,100,100,0.1)',
                                color: 'var(--accent-primary)',
                                borderRadius: '50%',
                                border: '1px solid rgba(255,100,100,0.3)'
                            }}
                        >
                            <Pencil size={14} />
                        </button>
                    </div>
                </div>
                <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <button
                        className="mobile-analysis-btn"
                        onClick={() => setIsAnalysisOpen(true)}
                        style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', display: 'none', cursor: 'pointer', padding: '5px' }}
                    >
                        <Wand2 size={22} />
                    </button>
                    {isArchived ? (
                        <button
                            className="icon-btn"
                            title="Desarquivar"
                            onClick={() => {
                                const archived = JSON.parse(localStorage.getItem('archived_chats') || '[]');
                                const updated = archived.filter(id => id !== activeChat.id);
                                localStorage.setItem('archived_chats', JSON.stringify(updated));
                                window.dispatchEvent(new Event('storage'));
                                alert('✅ Conversa desarquivada!');
                            }}
                            style={{ background: 'none', border: 'none', color: 'var(--success)', cursor: 'pointer' }}
                        >
                            <Archive size={20} />
                        </button>
                    ) : (
                        <>
                            <button
                                className="icon-btn"
                                title="Etiquetar"
                                onClick={handleTag}
                                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                            >
                                <Tag size={20} />
                            </button>
                            <button
                                className="icon-btn"
                                title="Arquivar"
                                onClick={() => {
                                    const archived = JSON.parse(localStorage.getItem('archived_chats') || '[]');
                                    if (!archived.includes(activeChat.id)) {
                                        archived.push(activeChat.id);
                                        localStorage.setItem('archived_chats', JSON.stringify(archived));
                                        window.dispatchEvent(new Event('storage'));
                                        setActiveChat(null);
                                        alert('✅ Conversa arquivada!');
                                    }
                                }}
                                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                            >
                                <Archive size={20} />
                            </button>
                        </>
                    )}
                </div>
            </header>

            <div className="main-grid">
                <div className="messages-column glass-panel">
                    <div className="thread scrollable">
                        {Array.isArray(messages) && [...messages].reverse().map((m, i) => {
                            const msg = m.message || {};
                            const content = msg.conversation ||
                                msg.extendedTextMessage?.text ||
                                msg.imageMessage?.caption ||
                                msg.videoMessage?.caption ||
                                m.content || m.text || "";

                            // Media detection logic
                            let displayContent = content;
                            let mediaElement = null;

                            if (!content) {
                                if (msg.audioMessage) {
                                    const transcription = msg.audioMessage?.contextInfo?.transcription ||
                                        msg.audioMessage?.transcription ||
                                        m.transcription;

                                    // Create audio player
                                    mediaElement = (
                                        <div className="audio-message">
                                            <AudioPlayer messageKey={m.key} />
                                            {transcription && <p className="transcription" style={{ marginTop: '8px', fontSize: '12px', opacity: 0.8 }}>🎵 {transcription}</p>}
                                        </div>
                                    );
                                }
                                else if (msg.imageMessage) {
                                    mediaElement = <ImageViewer messageKey={m.key} caption={msg.imageMessage.caption} />;
                                }
                                else if (msg.videoMessage) displayContent = "(Vídeo 🎥)";
                                else if (msg.documentMessage) displayContent = "(Documento 📄)";
                                else if (msg.stickerMessage) displayContent = "(Figurinha ✨)";
                                else if (msg.locationMessage) displayContent = "(Localização 📍)";
                                else if (msg.contactMessage) displayContent = "(Contato 👤)";
                                else displayContent = "(Mídia)";
                            }

                            if (!displayContent && !mediaElement && !m.key) return null;

                            return (
                                <div key={i} className={`message ${m.key?.fromMe ? 'out' : 'in'}`}>
                                    {mediaElement || displayContent}
                                </div>
                            );
                        })}
                        {loading && messages.length === 0 && <p className="loading-txt">Carregando histórico...</p>}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* MOBILE SUGGESTION CARD - REMOVED PER USER REQUEST */}
                    {/* {suggestion && !suggestion.includes('...') && (
                        <div className="mobile-suggestion-card glass-panel">
                            <div className="suggestion-header">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Bot size={16} color="var(--accent-primary)" />
                                    <span>Sugestão Aura</span>
                                </div>
                                <button className="close-suggestion" onClick={() => setSuggestion('')}>
                                    <X size={14} />
                                </button>
                            </div>
                            <p className="suggestion-text">{suggestion}</p>
                            <button className="use-suggestion-btn" onClick={useSuggestion}>
                                Usar Sugestão
                            </button>
                        </div>
                    )} */}

                    <form className="message-input-area" onSubmit={handleSend} style={{ position: 'relative' }}>

                        {/* Attachment Menu Popup */}
                        {showAttachMenu && (
                            <div className="attach-menu" style={{
                                position: 'absolute',
                                bottom: '60px',
                                left: '10px',
                                background: '#1e293b', // Solid dark background
                                border: '1px solid #334155',
                                borderRadius: '12px',
                                padding: '8px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '8px', // Increased gap for better separation
                                zIndex: 100,
                                minWidth: '200px', // Slightly wider
                                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)'
                            }}>
                                <button
                                    type="button"
                                    className="menu-item"
                                    onClick={() => handleAttachmentClick('Fotos/Vídeos')}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        background: 'transparent',
                                        border: 'none',
                                        color: '#f8fafc', // High contrast text
                                        cursor: 'pointer',
                                        padding: '10px 12px',
                                        fontSize: '14px',
                                        textAlign: 'left',
                                        width: '100%',
                                        borderRadius: '8px',
                                        transition: 'background 0.2s'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = '#334155'}
                                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                >
                                    <div style={{ background: '#ec4899', padding: '6px', borderRadius: '50%', display: 'flex' }}>
                                        <Image size={18} color="#fff" />
                                    </div>
                                    <span style={{ fontWeight: 500 }}>Fotos e Vídeos</span>
                                </button>
                                <button
                                    type="button"
                                    className="menu-item"
                                    onClick={() => handleAttachmentClick('Câmera')}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        background: 'transparent',
                                        border: 'none',
                                        color: '#f8fafc',
                                        cursor: 'pointer',
                                        padding: '10px 12px',
                                        fontSize: '14px',
                                        textAlign: 'left',
                                        width: '100%',
                                        borderRadius: '8px',
                                        transition: 'background 0.2s'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = '#334155'}
                                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                >
                                    <div style={{ background: '#ef4444', padding: '6px', borderRadius: '50%', display: 'flex' }}>
                                        <Camera size={18} color="#fff" />
                                    </div>
                                    <span style={{ fontWeight: 500 }}>Câmera</span>
                                </button>
                                <button
                                    type="button"
                                    className="menu-item"
                                    onClick={() => handleAttachmentClick('Documento')}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        background: 'transparent',
                                        border: 'none',
                                        color: '#f8fafc',
                                        cursor: 'pointer',
                                        padding: '10px 12px',
                                        fontSize: '14px',
                                        textAlign: 'left',
                                        width: '100%',
                                        borderRadius: '8px',
                                        transition: 'background 0.2s'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = '#334155'}
                                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                >
                                    <div style={{ background: '#8b5cf6', padding: '6px', borderRadius: '50%', display: 'flex' }}>
                                        <FileText size={18} color="#fff" />
                                    </div>
                                    <span style={{ fontWeight: 500 }}>Documento</span>
                                </button>
                            </div>
                        )}

                        <button
                            type="button"
                            className="btn-icon"
                            onClick={() => setShowAttachMenu(!showAttachMenu)}
                            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0 5px' }}
                        >
                            <Paperclip size={22} />
                        </button>

                        <div className="input-container-main">
                            <button
                                type="button"
                                className={`btn-enhance ${input.trim() ? 'active' : ''}`}
                                onClick={handleEnhance}
                                disabled={!input.trim() || isEnhancing || sending}
                                title="Aprimorar Resposta"
                            >
                                <Wand2 size={18} className={isEnhancing ? 'spin' : ''} />
                            </button>

                            <input
                                type="text"
                                placeholder="Resposta persuasiva..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                disabled={sending || isEnhancing}
                            />
                        </div>

                        {input.trim() ? (
                            <button
                                type="submit"
                                disabled={sending || isEnhancing}
                                style={{
                                    background: 'var(--accent-primary)',
                                    color: '#000',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: '48px',
                                    height: '48px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                                    flexShrink: 0
                                }}
                            >
                                <Send size={20} />
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={handleMicClick}
                                style={{
                                    background: recording ? '#ef4444' : 'var(--accent-primary)',
                                    border: 'none',
                                    color: recording ? '#fff' : '#000',
                                    cursor: 'pointer',
                                    borderRadius: '50%',
                                    width: '48px',
                                    height: '48px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                                    transition: 'all 0.2s',
                                    flexShrink: 0
                                }}
                            >
                                <Mic size={20} className={recording ? 'pulse' : ''} />
                            </button>
                        )}
                    </form>
                </div>

                <div className="analysis-column">
                    <div className="card glass-panel v3-analysis">
                        <div className="card-header-v3">
                            <BarChart3 size={18} />
                            <h4>Análise de Vendas</h4>
                        </div>

                        <div className="v3-data-grid">
                            <div className="data-item">
                                <label>Consciência</label>
                                <span>{analysisData.level || "—"}</span>
                            </div>
                            <div className="data-item">
                                <label>Intenção Principal</label>
                                <span>{analysisData.intent || "—"}</span>
                            </div>
                            <div className="data-item">
                                <label>Estratégia</label>
                                <span>{analysisData.strategy || "—"}</span>
                            </div>
                        </div>

                        <button className="btn-primary v3-btn" onClick={handleAnalyze}>
                            Analisar Histórico
                        </button>
                    </div>

                    <div className="card glass-panel suggestion v3-suggestion">
                        <div className="card-header-v3">
                            <Target size={18} />
                            <h4>Resposta Sugerida</h4>
                        </div>
                        <div className="result-box v3-box">
                            {suggestion || "Aguardando análise estratégica..."}
                        </div>
                        {suggestion && !suggestion.includes('...') && (
                            <button className="btn-secondary v3-btn-sub" onClick={useSuggestion}>
                                <Check size={16} /> Usar esta sugestão
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </main >
    );
};

export default ChatArea;

```

---

## File: src/components/ChatList.jsx
```jsx
import React, { useState } from 'react';
import { Search, RefreshCw, Menu } from 'lucide-react';
import { useStore } from '../store/useStore';
import WhatsAppService from '../services/whatsapp';
import { formatJid } from '../utils/formatter';

const ChatList = ({ onOpenMenu }) => {
    const { chats, setChats, activeChat, setActiveChat, isConnected } = useStore();
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const loadData = async () => {
        if (loading) return;
        setLoading(true);
        try {
            const data = await WhatsAppService.fetchChats();
            if (data) setChats(data);
        } catch (e) {
            console.error("AURA ChatList Error:", e);
        }
        setLoading(false);
    };

    const getTimestamp = (c) => {
        const ts = c.lastMessage?.messageTimestamp || c.messageTimestamp || c.conversationTimestamp || 0;
        return ts * 1000;
    };

    // Filter out archived chats
    const archivedChats = JSON.parse(localStorage.getItem('archived_chats') || '[]');

    const filtered = (Array.isArray(chats) ? chats : [])
        .filter(c => {
            const jid = c.remoteJid || c.jid || c.id;
            // Exclude archived chats from main list
            if (archivedChats.includes(jid)) return false;

            const jidStr = String(jid || "").toLowerCase();
            const name = String(c.name || c.pushName || c.verifiedName || "").toLowerCase();
            const term = String(searchTerm || "").toLowerCase().trim();
            return name.includes(term) || jidStr.includes(term);
        })
        .sort((a, b) => getTimestamp(b) - getTimestamp(a));

    return (
        <div className="chat-list-container glass-panel">
            <div className="list-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <button className="mobile-menu-btn" onClick={onOpenMenu} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'none' }}>
                        <Menu size={24} color="#1d1d1f" />
                    </button>
                    <h2>Mensagens</h2>
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    {!isConnected && <span style={{ fontSize: '10px', color: '#ff4444' }}>Offline</span>}
                    <RefreshCw
                        size={18}
                        className={loading ? 'spin' : 'btn-refresh'}
                        onClick={loadData}
                        style={{ cursor: 'pointer' }}
                    />
                </div>
            </div>

            <div className="search-bar">
                <Search size={16} />
                <input
                    type="text"
                    placeholder="Buscar..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="chats scrollable">
                {filtered.map(chat => {
                    const jid = chat.remoteJid || chat.jid || chat.id;
                    const msg = chat.lastMessage?.message || chat.message || {};

                    // Improved Name Source Priority (Filter out "Você" which means self)
                    let name = [
                        chat.name,
                        chat.pushName,
                        chat.verifiedName,
                        chat.lastMessage?.pushName,
                        chat.lastMessage?.key?.participant
                    ].find(n => n && n !== 'Você' && !n.includes('@lid'));

                    let photo = chat.profilePicUrl || chat.profilePictureUrl || chat.profile || chat.avatar;
                    const hasName = name && name !== String(jid).split('@')[0];

                    return (
                        <div
                            key={String(jid)}
                            className={`chat-item ${activeChat?.id === jid ? 'active' : ''}`}
                            onClick={() => setActiveChat({ id: jid, name: name || formatJid(jid) })}
                        >
                            <div className="avatar">
                                {photo ? (
                                    <img src={photo} alt={name || 'Avatar'} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                                ) : (
                                    (name || '#')[0]?.toUpperCase()
                                )}
                            </div>
                            <div className="info">
                                <div className="chat-main-header" style={{ display: 'flex', flexDirection: 'column', gap: '2px', alignItems: 'flex-start' }}>
                                    <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 'bold', textAlign: 'left' }}>
                                        {hasName ? name : formatJid(jid)}
                                    </h4>
                                    {hasName && !jid.includes('@lid') && (
                                        <span style={{ fontSize: '11px', opacity: 0.6, fontWeight: '400', textAlign: 'left' }}>
                                            {formatJid(jid)}
                                        </span>
                                    )}
                                </div>
                                <p className="chat-preview">
                                    {(() => {
                                        const content = msg.conversation ||
                                            msg.extendedTextMessage?.text ||
                                            msg.imageMessage?.caption ||
                                            chat.lastMessage?.content || "";

                                        if (content) return content.length > 35 ? content.substring(0, 35) + "..." : content;

                                        if (msg.audioMessage) {
                                            const trans = msg.audioMessage?.contextInfo?.transcription || msg.audioMessage?.transcription;
                                            return trans ? `🎵 ${trans}` : "🎵 Áudio";
                                        }
                                        if (msg.imageMessage) return "📸 Imagem";
                                        if (msg.videoMessage) return "🎥 Vídeo";
                                        if (msg.documentMessage) return "📄 Documento";
                                        if (msg.stickerMessage) return "✨ Figurinha";

                                        return formatJid(jid);
                                    })()}
                                </p>
                            </div>
                        </div>
                    );
                })}

                {filtered.length === 0 && !loading && (
                    <div className="empty-state" style={{ padding: '20px', textAlign: 'center', opacity: 0.5 }}>
                        <p>{searchTerm ? 'Nenhum contato encontrado.' : 'Nenhuma conversa carregada.'}</p>
                        {searchTerm.length > 5 && !searchTerm.includes('@') && (
                            <button
                                className="btn-force"
                                style={{ marginTop: '10px' }}
                                onClick={() => setActiveChat({ id: `${searchTerm.replace(/\D/g, '')}@s.whatsapp.net`, name: 'Busca Direta' })}
                            >
                                Buscar número: {searchTerm.replace(/\D/g, '')}
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatList;

```

---

## File: src/components/ConfigModal.jsx
```jsx
import React, { useState, useEffect } from 'react';
import { X, Save, Brain, AlertTriangle, Settings, Link2, ChevronDown, ChevronUp, Lock } from 'lucide-react';
import { useStore } from '../store/useStore';

const ConfigModal = ({ isOpen, onClose }) => {
    const store = useStore();
    const { setConfig } = store;
    const [showAdvanced, setShowAdvanced] = useState(false);

    const [formData, setFormData] = useState({
        apiUrl: '',
        apiKey: '',
        instanceName: '',
        briefing: ''
    });

    useEffect(() => {
        if (isOpen) {
            setFormData({
                apiUrl: store.apiUrl || '',
                apiKey: store.apiKey || '',
                instanceName: store.instanceName || '',
                briefing: store.briefing || ''
            });
        }
    }, [isOpen, store.apiUrl, store.apiKey, store.instanceName, store.briefing]);

    if (!isOpen) return null;

    const handleSave = (e) => {
        e.preventDefault();
        if (store.apiKey && !formData.apiKey) {
            alert("Atenção: A chave da API não pode ficar vazia.");
            return;
        }
        setConfig(formData);
        onClose();
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="modal-overlay" onClick={onClose} style={{ backdropFilter: 'blur(10px)', backgroundColor: 'rgba(0,0,0,0.1)' }}>
            <div className="modal-content glass-panel" style={{ width: '500px', background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.05)', padding: '0', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)' }} onClick={e => e.stopPropagation()}>

                <div className="modal-header" style={{ padding: '25px 30px', borderBottom: '1px solid rgba(0,0,0,0.05)', background: 'linear-gradient(to right, rgba(197, 160, 89, 0.05), transparent)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{ background: 'var(--accent-primary)', padding: '8px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Settings size={20} color="white" />
                        </div>
                        <div>
                            <h3 style={{ margin: 0, color: '#1d1d1f', fontSize: '18px', fontWeight: 'bold' }}>Painel de Controle AURA</h3>
                            <p style={{ margin: 0, fontSize: '11px', color: 'rgba(0,0,0,0.4)' }}>Configurações de Sistema e Inteligência</p>
                        </div>
                    </div>
                    <X size={24} onClick={onClose} style={{ cursor: 'pointer', opacity: 0.3, transition: 'opacity 0.2s' }} onMouseEnter={e => e.target.style.opacity = 1} onMouseLeave={e => e.target.style.opacity = 0.3} />
                </div>

                <form onSubmit={handleSave} style={{ padding: '30px' }}>

                    {/* HUB ACTIONS - CLEAN LIGHT DESIGN */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '15px' }}>
                        <button
                            type="button"
                            onClick={() => { onClose(); window.dispatchEvent(new CustomEvent('open-connect')); }}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '15px',
                                padding: '20px',
                                background: '#F9F9FA',
                                border: '1px solid rgba(0,0,0,0.03)',
                                borderRadius: '18px',
                                cursor: 'pointer',
                                transition: 'all 0.3s'
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(197, 160, 89, 0.05)'; e.currentTarget.style.borderColor = 'var(--accent-primary)'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = '#F9F9FA'; e.currentTarget.style.borderColor = 'rgba(0,0,0,0.03)'; }}
                        >
                            <div style={{ background: 'white', padding: '10px', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                                <Link2 color="var(--accent-primary)" size={22} />
                            </div>
                            <div style={{ textAlign: 'left' }}>
                                <span style={{ color: '#1d1d1f', fontSize: '13px', fontWeight: 'bold', display: 'block' }}>WhatsApp</span>
                                <span style={{ color: '#86868b', fontSize: '10px' }}>Conexão</span>
                            </div>
                        </button>

                        <button
                            type="button"
                            onClick={() => { onClose(); window.dispatchEvent(new CustomEvent('open-briefing')); }}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '15px',
                                padding: '20px',
                                background: '#F9F9FA',
                                border: '1px solid rgba(0,0,0,0.03)',
                                borderRadius: '18px',
                                cursor: 'pointer',
                                transition: 'all 0.3s'
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(197, 160, 89, 0.05)'; e.currentTarget.style.borderColor = 'var(--accent-primary)'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = '#F9F9FA'; e.currentTarget.style.borderColor = 'rgba(0,0,0,0.03)'; }}
                        >
                            <div style={{ background: 'white', padding: '10px', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                                <Brain color="var(--accent-primary)" size={22} />
                            </div>
                            <div style={{ textAlign: 'left' }}>
                                <span style={{ color: '#1d1d1f', fontSize: '13px', fontWeight: 'bold', display: 'block' }}>Cérebro IA</span>
                                <span style={{ color: '#86868b', fontSize: '10px' }}>Conhecimento</span>
                            </div>
                        </button>
                    </div>

                    {/* ADVANCED SECTION TOGGLE */}
                    <div
                        onClick={() => setShowAdvanced(!showAdvanced)}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px 0', borderTop: '1px solid rgba(0,0,0,0.05)', cursor: 'pointer' }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Lock size={14} color="#86868b" />
                            <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#86868b' }}>Configurações Avançadas</span>
                        </div>
                        {showAdvanced ? <ChevronUp size={16} color="#86868b" /> : <ChevronDown size={16} color="#86868b" />}
                    </div>

                    {showAdvanced && (
                        <div style={{ paddingTop: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div className="input-group">
                                <label style={{ fontSize: '10px', color: '#86868b', marginBottom: '8px', display: 'block', fontWeight: 'bold' }}>API URL</label>
                                <input name="apiUrl" value={formData.apiUrl} onChange={handleChange} required style={{ height: '40px', background: '#FFFFFF', border: '1px solid #D1D1D1', borderRadius: '10px', color: '#1d1d1f', padding: '0 12px', fontSize: '12px', width: '100%' }} />
                            </div>
                            <div className="input-group">
                                <label style={{ fontSize: '10px', color: '#86868b', marginBottom: '8px', display: 'block', fontWeight: 'bold' }}>INSTÂNCIA</label>
                                <input name="instanceName" value={formData.instanceName} onChange={handleChange} required style={{ height: '40px', background: '#FFFFFF', border: '1px solid #D1D1D1', borderRadius: '10px', color: '#1d1d1f', padding: '0 12px', fontSize: '12px', width: '100%' }} />
                            </div>
                            <div className="input-group" style={{ gridColumn: 'span 2' }}>
                                <label style={{ fontSize: '10px', color: '#86868b', marginBottom: '8px', display: 'block', fontWeight: 'bold' }}>API KEY</label>
                                <input type="password" name="apiKey" value={formData.apiKey} onChange={handleChange} required style={{ height: '40px', background: '#FFFFFF', border: '1px solid #D1D1D1', borderRadius: '10px', color: '#1d1d1f', padding: '0 12px', fontSize: '12px', width: '100%' }} />
                            </div>

                        </div>
                    )}

                    <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'center' }}>
                        <button type="submit" className="btn-primary" style={{ padding: '16px 80px', borderRadius: '50px', fontSize: '14px', fontWeight: 'bold' }}>
                            <Save size={18} /> Salvar Configurações
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
export default ConfigModal;

```

---

## File: src/components/ConnectModal.jsx
```jsx
import React, { useState, useEffect } from 'react';
import { X, RefreshCw, LogOut, QrCode } from 'lucide-react';
import { useStore } from '../store/useStore';
import WhatsAppService from '../services/whatsapp';
import { io } from 'socket.io-client';

const ConnectModal = ({ isOpen, onClose }) => {
    const { instanceName, isConnected, setIsConnected, apiUrl, apiKey } = useStore();
    const [qrCode, setQrCode] = useState(null);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('checking');
    const [socket, setSocket] = useState(null);
    // FIX: Counter to force WebSocket recreation when clicking "Conectar" after logout
    const [connecting, setConnecting] = useState(0);

    const checkStatus = async () => {
        const s = await WhatsAppService.checkConnection();
        setStatus(s);
        setIsConnected(s === 'open');
        if (s === 'open') setQrCode(null);
    };

    useEffect(() => {
        if (isOpen) checkStatus();
    }, [isOpen]);

    // WebSocket connection for real-time QR code updates
    useEffect(() => {
        if (!isOpen || !instanceName || isConnected) {
            // Cleanup socket if modal closes or instance is connected
            if (socket) {
                socket.disconnect();
                setSocket(null);
            }
            return;
        }


        // Convert HTTPS/HTTP URL to WSS/WS
        const wsUrl = apiUrl.replace('https://', 'wss://').replace('http://', 'ws://');
        // Use global WebSocket endpoint (Evolution API v2.1.1 doesn't support instance namespaces)
        console.log('Connecting to WebSocket (global mode):', wsUrl);

        const newSocket = io(wsUrl, {
            transports: ['websocket'],
            path: '/socket.io',
            reconnection: true,
            reconnectionAttempts: 5
        });

        newSocket.on('connect', () => {
            console.log('✅ WebSocket connected');
        });

        newSocket.on('qrcode.updated', (payload) => {
            // Filter events by instance name
            if (payload.instance !== instanceName) {
                console.log('⏭️  QR Code for different instance, skipping:', payload.instance);
                return;
            }
            console.log('📱 QR Code received for', instanceName, ':', payload);

            // Evolution API sends: { event, instance, data: { qrcode: { base64: "..." } } }
            // Extract the nested data object
            const data = payload.data || payload; // payload.data has the actual QR info
            let qrCodeData = null;

            if (data.qrcode) {
                if (typeof data.qrcode === 'string') {
                    // Format 1: data.qrcode is the base64 string directly
                    qrCodeData = data.qrcode;
                } else if (data.qrcode.base64) {
                    // Format 2: data.qrcode.base64 (MOST COMMON)
                    qrCodeData = data.qrcode.base64;
                } else if (data.qrcode.pairingCode) {
                    // Format 3: Alternative pairing code format
                    console.log('Pairing code available:', data.qrcode.pairingCode);
                }
            } else if (data.base64) {
                // Format 4: data.base64 directly
                qrCodeData = data.base64;
            }

            if (qrCodeData) {
                // Remove data URI prefix if present, then add it back to ensure consistency
                const base64Clean = qrCodeData.replace(/^data:image\/[a-z]+;base64,/, '');
                setQrCode(`data:image/png;base64,${base64Clean}`);
                console.log('✅ QR Code set! Length:', base64Clean.length);
            } else {
                console.warn('⚠️ QR Code data received but format not recognized. Payload:', payload, 'Data:', data);
            }
        });

        newSocket.on('connection.update', (data) => {
            // Filter events by instance name
            if (data.instance !== instanceName) {
                return;
            }
            console.log('🔄 Connection update:', data);
            if (data.state === 'open') {
                setQrCode(null);
                setIsConnected(true);
                checkStatus();
            }
        });

        newSocket.on('connect_error', (error) => {
            console.error('❌ WebSocket connection error:', error);
        });

        newSocket.on('disconnect', (reason) => {
            console.log('🔌 WebSocket disconnected:', reason);
        });

        setSocket(newSocket);

        return () => {
            if (newSocket) {
                newSocket.disconnect();
            }
        };
    }, [isOpen, instanceName, isConnected, apiUrl, loading, connecting]); // FIX: Added loading and connecting to dependencies

    // Debug state
    const [debugInfo, setDebugInfo] = useState({ error: null, lastResponse: null });

    // START POLLING for QR Code if WebSocket fails
    useEffect(() => {
        if (!isOpen || isConnected || !instanceName) return;

        let pollInterval;
        const pollQrCode = async () => {
            if (qrCode) return; // Don't poll if we already have one
            try {
                console.log('🔄 Polling: Checking for QR Code...');
                // Fetch the connection status/QR code directly
                const data = await WhatsAppService.connectInstance();
                setDebugInfo(prev => ({ ...prev, lastResponse: JSON.stringify(data).slice(0, 100) + '...' }));

                if (data && (data.qrcode || data.base64)) {
                    console.log('✅ Polling: QR Code received via HTTP');
                    const raw = data.qrcode?.base64 || data.base64 || data.qrcode;
                    if (raw && typeof raw === 'string') {
                        const base64Clean = raw.replace(/^data:image\/[a-z]+;base64,/, '');
                        setQrCode(`data:image/png;base64,${base64Clean}`);
                        setStatus('open'); // Assume open if we got data (or at least responding)
                    }
                }
            } catch (e) {
                console.warn('Polling error:', e);
                setDebugInfo(prev => ({ ...prev, error: e.message }));
            }
        };

        // Start polling after 2 seconds to give WebSocket a chance first
        const timer = setTimeout(() => {
            console.log('⚠️ WebSocket slow/failed, starting HTTP polling for QR Code...');
            pollQrCode(); // Initial poll
            pollInterval = setInterval(pollQrCode, 3000);
        }, 2000);

        return () => {
            clearTimeout(timer);
            if (pollInterval) clearInterval(pollInterval);
        };
    }, [isOpen, isConnected, instanceName, qrCode]);

    const handleConnect = async () => {
        setLoading(true);
        setQrCode(null);
        setDebugInfo({ error: null, lastResponse: 'Restarting...' });

        // FIX: Force WebSocket useEffect to re-run by incrementing counter
        setConnecting(prev => prev + 1);
        try {
            // Restart instance to trigger new QR code generation
            // The QR code will be received via WebSocket qrcode.updated event OR Polling
            const response = await fetch(`${apiUrl}/instance/restart/${instanceName}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': apiKey
                }
            });
            console.log('Instance restart triggered, waiting for QR code...');
        } catch (e) {
            console.error("Connect Error:", e);
            setDebugInfo(prev => ({ ...prev, error: e.message || 'Connect Failed' }));
        }
        setLoading(false);
    };

    const handleLogout = async () => {
        if (!window.confirm("Deseja realmente desconectar o WhatsApp? Isso apagará todos os dados locais.")) return;
        setLoading(true);
        try {
            // 1. Try to delete the instance on backend
            await WhatsAppService.logoutInstance();
        } catch (e) {
            console.error("Logout backend failed:", e);
        }

        // 2. Kill local session data immediately
        useStore.getState().logout();

        // 3. NUCLEAR OPTION: Clear all storage and FORCE RELOAD
        // This guarantees no React state or Zustand persistence survives
        localStorage.clear();
        sessionStorage.clear();

        setTimeout(() => {
            window.location.reload();
        }, 500);
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose} style={{ backdropFilter: 'blur(10px)', backgroundColor: 'rgba(255,255,255,0.1)' }}>
            <div className="modal-content glass-panel" style={{ width: '450px', background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.05)', padding: '0', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)' }} onClick={e => e.stopPropagation()}>
                <div className="modal-header" style={{ padding: '25px 30px', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{ background: 'var(--accent-primary)', padding: '8px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <QrCode size={20} color="white" />
                        </div>
                        <h3 style={{ margin: 0, color: '#1d1d1f', fontSize: '18px', fontWeight: 'bold' }}>Conexão WhatsApp</h3>
                    </div>
                    <X size={24} onClick={onClose} style={{ cursor: 'pointer', opacity: 0.3 }} />
                </div>

                <div className="connection-body" style={{ padding: '40px', textAlign: 'center' }}>

                    {isConnected ? (
                        <div style={{ textAlign: 'center' }}>
                            <div style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '10px',
                                padding: '10px 25px',
                                background: '#F0FFF4',
                                color: '#276749',
                                borderRadius: '100px',
                                fontSize: '13px',
                                fontWeight: 'bold',
                                border: '1px solid #C6F6D5',
                                marginBottom: '35px'
                            }}>
                                <div style={{ width: '8px', height: '8px', background: '#38A169', borderRadius: '50%', boxShadow: '0 0 10px rgba(56, 161, 105, 0.4)' }}></div>
                                CONECTADO
                                <RefreshCw size={14} style={{ cursor: 'pointer', opacity: 0.5 }} className={status === 'connecting' ? 'spin' : ''} onClick={checkStatus} />
                            </div>

                            <div style={{ marginBottom: '40px' }}>
                                <p style={{ color: '#86868b', margin: '0 0 10px 0', fontSize: '14px' }}>Instância Ativa</p>
                                <p style={{ color: '#1d1d1f', margin: 0, fontSize: '24px', fontWeight: 'bold' }}>{instanceName}</p>
                            </div>

                            <button
                                onClick={handleLogout}
                                style={{
                                    background: '#FFF5F5',
                                    color: '#E53E3E',
                                    border: '1px solid #FED7D7',
                                    padding: '15px 40px',
                                    borderRadius: '50px',
                                    fontSize: '14px',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    margin: '0 auto',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = '#FED7D7'}
                                onMouseLeave={e => e.currentTarget.style.background = '#FFF5F5'}
                            >
                                <LogOut size={18} /> Desconectar WhatsApp
                            </button>
                        </div>
                    ) : (
                        <div>
                            {qrCode ? (
                                <div style={{ padding: '20px', background: 'white', borderRadius: '24px', border: '1px solid #E5E5E7' }}>
                                    <img src={qrCode} alt="QR Code" style={{ width: '100%', borderRadius: '12px' }} />
                                    <p style={{ marginTop: '20px', color: '#1d1d1f', fontWeight: 'bold', fontSize: '14px' }}>Escaneie para conectar</p>
                                </div>
                            ) : (
                                <div style={{ padding: '20px' }}>
                                    <p style={{ color: '#86868b', fontSize: '14px', marginBottom: '30px' }}>Gere um novo QR Code para autenticar sua sessão do WhatsApp.</p>
                                    <button className="btn-primary" style={{ width: '100%', padding: '16px', borderRadius: '16px' }} onClick={handleConnect} disabled={loading}>
                                        {loading ? 'Preparando...' : 'Gerar QR Code Agora'}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* LOGS SECTION - CLEAN */}
                    <div style={{ marginTop: '40px', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '20px', textAlign: 'left' }}>
                        <details style={{ cursor: 'pointer' }}>
                            <summary style={{ color: '#86868b', fontSize: '11px', fontWeight: 'bold' }}>DETALHES TÉCNICOS</summary>
                            <div style={{ marginTop: '15px', padding: '15px', background: '#F9F9FA', borderRadius: '12px', fontSize: '11px', color: '#4a4a4c', fontFamily: 'monospace' }}>
                                STATUS: {status.toUpperCase()}<br />
                                SOCKET: {socket?.connected ? 'ONLINE' : 'OFFLINE'}<br />
                                INSTANCE: {instanceName}<br />
                                LOG: {debugInfo.lastResponse || 'None'}
                            </div>
                        </details>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConnectModal;

```

---

## File: src/components/HistoryView.jsx
```jsx
import React, { useState } from 'react';
import { Search, Archive } from 'lucide-react';
import { useStore } from '../store/useStore';
import { formatJid } from '../utils/formatter';

const HistoryView = () => {
    const { chats, setActiveChat, activeChat } = useStore();
    const [searchTerm, setSearchTerm] = useState('');

    // Get archived chat IDs from localStorage
    const archivedChatIds = JSON.parse(localStorage.getItem('archived_chats') || '[]');

    // Filter chats to show only archived ones
    const archivedChats = (Array.isArray(chats) ? chats : [])
        .filter(c => {
            const jid = c.remoteJid || c.jid || c.id;
            return archivedChatIds.includes(jid);
        })
        .filter(c => {
            if (!searchTerm) return true;
            const jidStr = String(c.remoteJid || c.jid || c.id || "").toLowerCase();
            const name = String(c.name || c.pushName || c.verifiedName || "").toLowerCase();
            const term = searchTerm.toLowerCase().trim();
            return name.includes(term) || jidStr.includes(term);
        })
        .sort((a, b) => {
            const tsA = a.lastMessage?.messageTimestamp || a.messageTimestamp || 0;
            const tsB = b.lastMessage?.messageTimestamp || b.messageTimestamp || 0;
            return (tsB * 1000) - (tsA * 1000);
        });

    return (
        <div className="chat-list-container glass-panel">
            <div className="list-header">
                <h2>Histórico</h2>
                <Archive size={20} style={{ color: 'var(--accent-primary)' }} />
            </div>

            <div className="search-bar">
                <Search size={16} />
                <input
                    type="text"
                    placeholder="Buscar no histórico..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="chats scrollable">
                {archivedChats.length === 0 ? (
                    <div className="empty-state" style={{ padding: '40px 20px', textAlign: 'center', opacity: 0.5 }}>
                        <Archive size={48} style={{ margin: '0 auto 15px', opacity: 0.3 }} />
                        <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                            {searchTerm ? 'Nenhum chat arquivado encontrado.' : 'Nenhum chat arquivado ainda.'}
                        </p>
                        <p style={{ fontSize: '12px', marginTop: '10px', color: 'var(--text-muted)' }}>
                            Use o botão de arquivar nas conversas para movê-las para cá.
                        </p>
                    </div>
                ) : (
                    archivedChats.map(chat => {
                        const jid = chat.remoteJid || chat.jid || chat.id;
                        const msg = chat.lastMessage?.message || chat.message || {};

                        let name = [
                            chat.name,
                            chat.pushName,
                            chat.verifiedName,
                            chat.lastMessage?.pushName,
                        ].find(n => n && n !== 'Você' && !n.includes('@lid'));

                        let photo = chat.profilePicUrl || chat.profilePictureUrl || chat.profile || chat.avatar;
                        const hasName = name && name !== String(jid).split('@')[0];

                        return (
                            <div
                                key={String(jid)}
                                className={`chat-item ${activeChat?.id === jid ? 'active' : ''}`}
                                onClick={() => setActiveChat({ id: jid, name: name || formatJid(jid) })}
                            >
                                <div className="avatar">
                                    {photo ? (
                                        <img src={photo} alt={name || 'Avatar'} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                                    ) : (
                                        (name || '#')[0]?.toUpperCase()
                                    )}
                                </div>
                                <div className="info">
                                    <div className="chat-main-header" style={{ display: 'flex', flexDirection: 'column', gap: '2px', alignItems: 'flex-start' }}>
                                        <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 'bold', textAlign: 'left' }}>
                                            {hasName ? name : formatJid(jid)}
                                        </h4>
                                        {hasName && !jid.includes('@lid') && (
                                            <span style={{ fontSize: '11px', opacity: 0.6, fontWeight: '400', textAlign: 'left' }}>
                                                {formatJid(jid)}
                                            </span>
                                        )}
                                    </div>
                                    <p className="chat-preview">
                                        {(() => {
                                            const content = msg.conversation ||
                                                msg.extendedTextMessage?.text ||
                                                msg.imageMessage?.caption ||
                                                chat.lastMessage?.content || "";

                                            if (content) return content.length > 35 ? content.substring(0, 35) + "..." : content;

                                            if (msg.audioMessage) return "🎵 Áudio";
                                            if (msg.imageMessage) return "📸 Imagem";
                                            if (msg.videoMessage) return "🎥 Vídeo";
                                            if (msg.documentMessage) return "📄 Documento";

                                            return formatJid(jid);
                                        })()}
                                    </p>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default HistoryView;

```

---

## File: src/components/ImageViewer.jsx
```jsx
import React, { useState, useEffect } from 'react';
import { Image as ImageIcon } from 'lucide-react';
import WhatsAppService from '../services/whatsapp';

const ImageViewer = ({ messageKey, caption }) => {
    const [imageUrl, setImageUrl] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadImage = async () => {
            try {
                const base64Data = await WhatsAppService.fetchMediaUrl(messageKey);
                if (base64Data) {
                    setImageUrl(base64Data);
                }
            } catch (e) {
                console.error("Image load error:", e);
            } finally {
                setLoading(false);
            }
        };

        if (messageKey) {
            loadImage();
        }
    }, [messageKey]);

    if (loading) {
        return (
            <div className="image-message loading">
                <ImageIcon size={16} color="#00ff88" />
                <span style={{ fontSize: '12px', marginLeft: '8px' }}>Carregando imagem...</span>
            </div>
        );
    }

    if (!imageUrl) {
        return <span>(Imagem 📸)</span>;
    }

    return (
        <div className="image-message">
            <img
                src={imageUrl}
                alt="Imagem do cliente"
                style={{
                    maxWidth: '300px',
                    maxHeight: '300px',
                    borderRadius: '8px',
                    display: 'block'
                }}
            />
            {caption && <p style={{ marginTop: '8px', fontSize: '14px' }}>{caption}</p>}
        </div>
    );
};

export default ImageViewer;

```

---

## File: src/components/LoginScreen.css
```css
/* ========================================
   Login Screen - Gray Scale + Gold Theme
   ======================================== */

.login-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    /* CHANGED: Gray gradient instead of purple */
    background: linear-gradient(135deg, #F5F5F5 0%, #E0E0E0 100%);
    padding: 20px;
}

.login-card {
    background: white;
    border-radius: 20px;
    padding: 48px 40px;
    /* CHANGED: Subtle shadow with gray */
    box-shadow: 0 20px 60px rgba(44, 44, 44, 0.15);
    max-width: 420px;
    width: 100%;
    animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateY(-20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.login-header {
    text-align: center;
    margin-bottom: 40px;
}

.logo {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 80px;
    height: 80px;
    /* CHANGED: Gold gradient for logo */
    background: linear-gradient(135deg, #D4AF37 0%, #C19B2E 100%);
    border-radius: 20px;
    margin-bottom: 20px;
    color: white;
}

.login-header h1 {
    font-size: 32px;
    font-weight: 700;
    margin: 0 0 8px 0;
    /* CHANGED: Dark gray text instead of gradient */
    color: #2C2C2C;
}

.subtitle {
    color: #9E9E9E;
    font-size: 14px;
    margin: 0;
}

.login-form {
    margin-bottom: 24px;
}

.form-group {
    margin-bottom: 24px;
}

.form-group label {
    display: block;
    font-size: 14px;
    font-weight: 600;
    color: #2C2C2C;
    margin-bottom: 8px;
}

.form-group input {
    width: 100%;
    padding: 12px 16px;
    border: 2px solid #E0E0E0;
    border-radius: 12px;
    font-size: 16px;
    transition: all 0.2s;
    background: #F9F9F9;
}

.form-group input:focus {
    outline: none;
    /* CHANGED: Gold border on focus */
    border-color: #D4AF37;
    background: white;
    /* CHANGED: Gold shadow */
    box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1);
}

.form-group input:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.error-message {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 16px;
    background: #fee2e2;
    border: 1px solid #fecaca;
    border-radius: 12px;
    color: #991b1b;
    font-size: 14px;
    margin-bottom: 20px;
    animation: shake 0.3s;
}

@keyframes shake {

    0%,
    100% {
        transform: translateX(0);
    }

    25% {
        transform: translateX(-5px);
    }

    75% {
        transform: translateX(5px);
    }
}

.login-button {
    width: 100%;
    padding: 14px 24px;
    /* CHANGED: Gold gradient button */
    background: linear-gradient(135deg, #D4AF37 0%, #C19B2E 100%);
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
}

.login-button:hover:not(:disabled) {
    transform: translateY(-2px);
    /* CHANGED: Gold shadow on hover */
    box-shadow: 0 10px 20px rgba(212, 175, 55, 0.3);
}

.login-button:active:not(:disabled) {
    transform: translateY(0);
}

.login-button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
}

.spinner {
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.login-footer {
    text-align: center;
    padding-top: 24px;
    border-top: 1px solid #E0E0E0;
}

.login-footer p {
    color: #9E9E9E;
    font-size: 14px;
    margin: 0;
}

/* REMOVED DARK MODE - Always use light gray palette */
```

---

## File: src/components/LoginScreen.jsx
```jsx
import { useState } from 'react';
import './LoginScreen.css';

export default function LoginScreen({ onLogin }) {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // Get password from environment variable
        const correctPassword = import.meta.env.VITE_AUTH_PASSWORD || 'VoxeFlow2024!';
        console.log('AURA Login Debug:', {
            envSet: !!import.meta.env.VITE_AUTH_PASSWORD,
            expectedLength: correctPassword.length,
            match: password === correctPassword
        });

        setTimeout(() => {
            if (password === correctPassword) {
                // Store authentication token
                const token = btoa(`authenticated:${Date.now()}`);
                localStorage.setItem('auth_token', token);
                onLogin();
            } else {
                setError('Senha incorreta. Tente novamente.');
                setPassword('');
            }
            setIsLoading(false);
        }, 500);
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <div className="logo">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <h1>AURA</h1>
                    <p className="subtitle">Business Copilot</p>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label htmlFor="password">Senha de Acesso</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Digite sua senha"
                            disabled={isLoading}
                            autoFocus
                            required
                        />
                    </div>

                    {error && (
                        <div className="error-message">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                                <path d="M12 8V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                <circle cx="12" cy="16" r="1" fill="currentColor" />
                            </svg>
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="login-button"
                        disabled={isLoading || !password}
                    >
                        {isLoading ? (
                            <>
                                <span className="spinner"></span>
                                Validando...
                            </>
                        ) : (
                            'Entrar'
                        )}
                    </button>
                </form>

                <div className="login-footer">
                    <p>Protected by VoxeFlow Security</p>
                    <p style={{ fontSize: '10px', opacity: 0.5, marginTop: '5px' }}>v1.3.0 (Stable)</p>
                </div>
            </div>
        </div>
    );
}

```

---

## File: src/components/Sidebar.jsx
```jsx
import { LayoutDashboard, History, Settings, LogOut, Link2, Brain, Kanban, X } from 'lucide-react';
import { useStore } from '../store/useStore';

const Sidebar = ({ onOpenConfig, onOpenConnect, onOpenBriefing, onLogout, isOpen, onClose }) => {
    const { activeChat, currentView, setCurrentView, setActiveChat, switchView } = useStore();
    return (
        <>
            {/* Mobile Overlay */}
            <div className={`sidebar-overlay ${isOpen ? 'open' : ''}`} onClick={onClose} />

            <aside className={`sidebar glass-panel ${isOpen ? 'mobile-open' : ''}`}>
                <button className="mobile-close-btn" onClick={onClose}>
                    <X size={24} />
                </button>
                <div className="logo-container">
                    <h1>Aura</h1>
                </div>

                <nav id="mainNav">
                    <ul>
                        <li className={currentView === 'dashboard' ? 'active' : ''} onClick={() => switchView('dashboard')} title="Dashboard">
                            <LayoutDashboard size={24} />
                        </li>
                        <li className={currentView === 'crm' ? 'active' : ''} onClick={() => switchView('crm')} title="CRM Pipeline">
                            <Kanban size={24} />
                        </li>
                        <li className={currentView === 'history' ? 'active' : ''} onClick={() => switchView('history')} title="Histórico">
                            <History size={24} />
                        </li>
                    </ul>
                </nav>

                <div className="sidebar-footer">
                    <div style={{ padding: '10px 0', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
                        <div
                            title="Configurações Aura"
                            onClick={onOpenConfig}
                            style={{
                                cursor: 'pointer',
                                padding: '10px',
                                borderRadius: '12px',
                                color: 'var(--text-muted)',
                                transition: 'all 0.3s',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                            onMouseEnter={e => { e.currentTarget.style.color = 'var(--accent-primary)'; e.currentTarget.style.background = 'rgba(197, 160, 89, 0.1)'; }}
                            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent'; }}
                        >
                            <Settings size={22} />
                        </div>

                        <button
                            onClick={onLogout}
                            className="logout-button"
                            title="Sair"
                            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px', width: '100%', color: 'var(--text-muted)', transition: 'color 0.2s' }}
                            onMouseEnter={(e) => e.target.style.color = '#ff4d4d'}
                            onMouseLeave={(e) => e.target.style.color = 'var(--text-muted)'}
                        >
                            <LogOut size={20} />
                        </button>

                        <div className="conn-status" style={{ fontSize: '8px', opacity: 0.3, marginTop: '5px', textAlign: 'center', wordBreak: 'break-all', padding: '0 5px' }}>
                            {activeChat?.id ? activeChat.id : ''}
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
};
export default Sidebar;

```

---

## File: src/index.css
```css
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap');

:root {
  --bg-main: #FDFDFD;
  --bg-sidebar: #FFFFFF;
  --bg-chat-list: #FFFFFF;
  --accent-primary: #C5A059;
  --accent-secondary: #af8a43;
  --text-main: #1d1d1f;
  --text-muted: #86868b;
  --glass: rgba(255, 255, 255, 0.85);
  --glass-border: rgba(0, 0, 0, 0.05);
  --danger: #ff4d4d;
  --success: #C5A059;
  --aura-gold: #C5A059;
  --card-bg: #ffffff;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: 'Montserrat', sans-serif;
}

body {
  background: var(--bg-main);
  color: var(--text-main);
  height: 100vh;
  overflow: hidden;
}

#root {
  height: 100%;
}

.app-container {
  display: flex;
  height: 100vh;
  width: 100vw;
  background: var(--bg-main);
  overflow: hidden;
}

/* CRM Mode: Ensure the main content takes over when sidebar is minimal */
.app-container.crm-mode .main-content {
  flex: 1;
  width: 100%;
}

.main-content {
  flex: 1;
  display: flex;
  height: 100vh;
  min-width: 0;
}

/* Light Glassmorphism utility */
.glass-panel {
  background: var(--glass);
  backdrop-filter: blur(20px);
  border: 1px solid var(--glass-border);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.03);
}

.scrollable {
  overflow-y: auto;
  min-height: 0;
  scrollbar-width: thin;
  scrollbar-color: var(--accent-primary) transparent;
}

.scrollable::-webkit-scrollbar {
  width: 4px;
}

.scrollable::-webkit-scrollbar-thumb {
  background: var(--accent-primary);
  border-radius: 10px;
}

button {
  cursor: pointer;
  border: none;
  border-radius: 99px;
  outline: none !important;
  box-shadow: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  -webkit-tap-highlight-color: transparent;
}

button:focus,
button:active,
button:focus-visible {
  outline: none !important;
  box-shadow: none !important;
}

input {
  background: #ffffff;
  border: 1px solid var(--glass-border);
  color: var(--text-main);
  padding: 10px 20px;
  border-radius: 99px;
  outline: none;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.02);
}

input:focus {
  border-color: var(--accent-primary);
  box-shadow: 0 0 10px rgba(197, 160, 89, 0.1);
}

/* Sidebar Styles (Restored Dark Premium) */
.sidebar {
  width: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px 0;
  height: 100%;
  border-right: 1px solid var(--glass-border);
  background: #121212;
  /* RESTORED: Dark Background */
  transition: width 0.3s ease;
  z-index: 20;
}

.sidebar:hover {
  width: 120px;
}

.logo-container h1 {
  font-size: 22px;
  font-weight: 800;
  color: #FFFFFF;
  /* CHANGED: White Text */
  text-shadow: 0 0 15px rgba(197, 160, 89, 0.6);
  /* ADDED: Gold Shadow */
  margin-bottom: 50px;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.sidebar ul {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.sidebar li {
  color: #FFFFFF;
  /* RESTORED: White text for dark mode */
  opacity: 0.5;
  padding: 12px;
  border-radius: 16px;
  cursor: pointer;
  transition: 0.3s;
}

.sidebar li:hover,
.sidebar li.active {
  color: var(--accent-primary);
  opacity: 1;
  background: rgba(197, 160, 89, 0.15);
}

.sidebar-footer {
  margin-top: auto;
  color: #86868b;
}

/* ChatList Styles (Light) */
.chat-list-container {
  width: 320px;
  flex-shrink: 0;
  border-right: 1px solid var(--glass-border);
  display: flex;
  flex-direction: column;
  background: #ffffff;
  color: var(--text-main);
}

.list-header h2 {
  font-size: 20px;
  font-weight: 700;
  color: var(--text-main);
}

.list-header {
  padding: 30px 25px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.list-header h2 {
  font-size: 20px;
  font-weight: 700;
}

.search-bar {
  margin: 0 25px 20px;
  position: relative;
}

.search-bar svg {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
}

.search-bar input {
  width: 100%;
  padding-left: 38px;
  font-size: 13px;
}

.chats {
  flex: 1;
  padding: 0 15px;
}

.chat-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 12px 15px;
  cursor: pointer;
  transition: all 0.2s;
  border-radius: 12px;
  margin-bottom: 5px;
  min-width: 0;
}

.chat-item:hover {
  background: rgba(0, 0, 0, 0.03);
}

.chat-item.active {
  background: rgba(197, 160, 89, 0.1);
  border-left: 4px solid var(--accent-primary);
}

.avatar {
  width: 50px;
  height: 50px;
  min-width: 50px;
  min-height: 50px;
  border-radius: 50%;
  background: #f0f0f2;
  border: 1px solid rgba(197, 160, 89, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 18px;
  flex-shrink: 0;
  overflow: hidden;
  color: var(--accent-primary);
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.info {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  min-width: 0;
}

.info h4 {
  margin-bottom: 3px;
  font-size: 14px;
  width: 100%;
}

.info p {
  font-size: 12px;
  color: var(--text-muted);
  width: 100%;
}

.spin {
  animation: rotate 1s linear infinite;
}

@keyframes rotate {
  from {
    transform: rotate(0deg)
  }

  to {
    transform: rotate(360deg)
  }
}

.empty-msg {
  text-align: center;
  padding: 20px;
  color: var(--text-muted);
  font-size: 13px;
}

/* ChatArea Styles */
.chat-area {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  flex: 1;
  overflow: hidden;
  height: 100%;
}

.chat-header {
  padding: 20px 30px;
  border-radius: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.active-info h3 {
  font-size: 22px;
}

.active-info p {
  color: var(--accent-primary);
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.actions {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--accent-primary);
  font-weight: 700;
}

.main-grid {
  display: flex;
  gap: 15px;
  flex: 1;
  min-height: 0;
  width: 100%;
  padding-bottom: 5px;
}

.messages-column {
  flex: 1;
  min-width: 0;
  border-radius: 20px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.thread {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.message {
  padding: 12px 16px;
  border-radius: 18px;
  max-width: 80%;
  font-size: 14.5px;
  line-height: 1.45;
  position: relative;
  transition: all 0.2s ease;
}

.message.in {
  align-self: flex-start;
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
  color: #1c1c1e;
  border-bottom-left-radius: 4px;
}

.message.out {
  align-self: flex-end;
  background: #f2f2f5;
  /* Light gray for premium feel */
  color: #1d1d1f;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.03);
  border-bottom-right-radius: 4px;
  font-weight: 400;
}

.analysis-column {
  width: 300px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  flex-shrink: 0;
  overflow-y: auto;
  min-height: 0;
  padding-right: 5px;
}

/* Notebook screens */
@media (max-width: 1366px) {
  .analysis-column {
    width: 260px;
  }
}

.card {
  padding: 24px;
  border-radius: 28px;
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
}

.card h4 {
  font-size: 14px;
  color: var(--accent-primary);
  text-transform: uppercase;
  letter-spacing: 1.5px;
  font-weight: 700;
}

.context-box,
.result-box {
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: 20px;
  padding: 18px;
  min-height: 120px;
  font-size: 14px;
  color: var(--text-main);
  line-height: 1.6;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.01);
}

.btn-primary {
  background: var(--accent-primary);
  color: #000;
  font-weight: 800;
  padding: 15px;
  font-size: 15px;
  box-shadow: 0 4px 20px rgba(197, 160, 89, 0.2);
  border: none !important;
  outline: none !important;
}

.btn-primary:active,
.btn-primary:focus {
  transform: scale(0.98);
  box-shadow: 0 2px 10px rgba(197, 160, 89, 0.1) !important;
  outline: none !important;
}

.btn-secondary {
  background: transparent;
  border: 1px solid var(--accent-primary);
  color: var(--accent-primary);
  padding: 12px;
  font-weight: 600;
}

.glow-icon {
  filter: drop-shadow(0 0 10px rgba(197, 160, 89, 0.5));
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  width: 500px;
  padding: 40px;
  border-radius: 36px;
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 30px;
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-content form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.input-group label {
  font-size: 13px;
  color: var(--text-muted);
  font-weight: 600;
}

.btn-save {
  background: var(--accent-primary);
  color: #ffffff;
  font-weight: 700;
  padding: 16px;
  border-radius: 99px;
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  box-shadow: 0 8px 20px rgba(197, 160, 89, 0.2);
}

.message-input-area {
  padding: 10px 15px;
  background: transparent;
  display: flex;
  align-items: flex-end;
  gap: 8px;
  width: 100%;
}

.input-container-main {
  flex: 1;
  background: #ffffff;
  border-radius: 24px;
  display: flex;
  align-items: center;
  padding: 5px 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  min-height: 48px;
}

.message-input-area input {
  flex: 1;
  background: transparent !important;
  border: none !important;
  padding: 10px 12px !important;
  font-size: 16px !important;
  outline: none !important;
  box-shadow: none !important;
}

/* Suggested Response Card - Mobile */
.mobile-suggestion-card {
  margin: 0 15px 8px;
  padding: 15px;
  border-radius: 20px;
  background: #ffffff;
  border: 1px solid rgba(197, 160, 89, 0.15);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  animation: slideInUp 0.3s ease;
}

.suggestion-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  font-size: 12px;
  font-weight: 600;
  color: var(--accent-primary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.suggestion-text {
  font-size: 14px;
  line-height: 1.4;
  color: #48484a;
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.use-suggestion-btn {
  width: 100%;
  padding: 10px;
  background: rgba(197, 160, 89, 0.1);
  color: var(--accent-primary);
  border: none;
  border-radius: 12px;
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.use-suggestion-btn:active {
  background: rgba(197, 160, 89, 0.2);
  transform: scale(0.98);
}

.close-suggestion {
  background: none;
  border: none;
  color: #8e8e93;
  cursor: pointer;
  padding: 4px;
}

@keyframes slideInUp {
  from {
    transform: translateY(10px);
    opacity: 0;
  }

  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* Utility for empty states */
.empty-dashboard {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  flex: 1;
  opacity: 0.8;
}

.empty-dashboard h2 {
  margin-top: 20px;
}

.force-search {
  padding: 20px;
  text-align: center;
}

.force-search p {
  font-size: 13px;
  color: var(--text-muted);
  margin-bottom: 10px;
}

.message-input-area {
  margin-top: 15px;
  display: flex;
  gap: 10px;
  background: #f0f0f2;
  padding: 8px 12px;
  border-radius: 99px;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.message-input-area input {
  flex: 1;
  background: transparent;
  border: none;
  color: var(--text-main);
  padding: 5px 10px;
  font-size: 14px;
}

.message-input-area input:focus {
  outline: none;
}

.message-input-area button {
  background: var(--accent-primary);
  border: none;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #000;
  cursor: pointer;
  transition: 0.23s cubic-bezier(0.4, 0, 0.2, 1);
}

.message-input-area button:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.message-input-area button:hover:not(:disabled) {
  transform: scale(1.05);
  box-shadow: 0 0 15px var(--accent-primary);
}

.loading-txt {
  text-align: center;
  font-size: 12px;
  opacity: 0.5;
  margin-top: 10px;
}

.btn-force {
  background: var(--accent-primary);
  color: var(--bg-main);
  border: none;
  padding: 10px;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
  font-size: 12px;
  width: 100%;
}

.badge-v3 {
  background: linear-gradient(135deg, #C5A059, #8c6a2d);
  color: #fff;
  font-size: 10px;
  font-weight: 900;
  padding: 4px 14px;
  border-radius: 99px;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  box-shadow: 0 4px 10px rgba(197, 160, 89, 0.3);
}

.card-header-v3 {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--accent-primary);
  margin-bottom: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  padding-bottom: 10px;
}

.card-header-v3 h4 {
  margin: 0;
  font-size: 13px !important;
}

.v3-data-grid {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 15px;
}

.data-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  padding: 4px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.03);
}

.data-item label {
  font-size: 9px;
  color: var(--text-muted);
  text-transform: uppercase;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.data-item span {
  font-size: 12px;
  color: var(--text-main);
  /* Changed from white to dark */
  font-weight: 600;
  text-align: right;
}

.v3-btn {
  width: 100%;
  padding: 12px !important;
  font-size: 13px !important;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.v3-btn-sub {
  width: 100%;
  margin-top: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.v3-box {
  min-height: 100px !important;
  line-height: 1.5 !important;
}

.v3-analysis {
  background: rgba(197, 160, 89, 0.03) !important;
  border: 1px solid rgba(197, 160, 89, 0.1) !important;
}

.v3-suggestion {
  background: #f9f9fb !important;
  border: 1px solid rgba(0, 0, 0, 0.03) !important;
}

.btn-enhance {
  background: rgba(197, 160, 89, 0.08);
  border: none;
  color: var(--accent-primary);
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: 0.2s;
  border-radius: 50%;
}

.btn-enhance:hover {
  background: rgba(197, 160, 89, 0.15);
}

.btn-enhance.active {
  background: var(--accent-primary);
  color: #000;
}

.chat-main-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.chat-preview {
  font-size: 12px !important;
  opacity: 0.7;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 2px;
  color: var(--text-muted);
}

.chat-time {
  font-size: 10px;
  opacity: 0.5;
}

.qr-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 20px;
  background: white;
  border-radius: 20px;
  margin: 10px 0;
}

.qr-code {
  width: 250px;
  height: 250px;
}

.status-badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
}

.status-badge.connected {
  background: rgba(0, 210, 193, 0.2);
  color: var(--accent-primary);
  border: 1px solid var(--accent-primary);
}

.status-badge.disconnected {
  background: rgba(255, 77, 77, 0.2);
  color: var(--danger);
  border: 1px solid var(--danger);
}

.btn-danger {
  background: rgba(255, 77, 77, 0.1);
  color: var(--danger);
  border: 1px solid var(--danger);
  padding: 10px;
  font-weight: 700;
  width: 100%;
}

.btn-danger:hover {
  background: var(--danger);
  color: white;
}

.btn-danger:hover {
  background: var(--danger);
  color: white;
}

/* CRM Kanban Styles - BRIGHT PREMIUM */
.crm-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 30px;
  background: var(--bg-main);
  overflow: hidden;
}

.crm-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding: 0;
  background: transparent;
}

.stat-value {
  font-size: 24px;
  font-weight: 800;
  color: #1d1d1f;
}

.crm-board {
  display: flex;
  gap: 24px;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 10px 0 20px;
  flex: 1;
  align-items: flex-start;
}

.crm-column {
  min-width: 300px;
  flex: 0 0 300px;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 24px;
  display: flex;
  flex-direction: column;
  height: 100%;
  border: 1px solid rgba(0, 0, 0, 0.03);
}

.column-header {
  padding: 20px 25px;
  font-weight: 800;
  font-size: 14px;
  color: #1d1d1f;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.crm-card {
  background: #ffffff;
  border-radius: 18px;
  padding: 20px;
  margin-bottom: 15px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.crm-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 25px rgba(197, 160, 89, 0.1);
  border-color: var(--accent-primary);
}

.crm-card h4 {
  color: #1d1d1f;
  font-size: 15px;
  font-weight: 700;
  margin: 0 0 10px 0;
}

.crm-card p {
  color: #86868b;
  font-size: 13px;
  margin: 0;
  line-height: 1.5;
}

.crm-card .next-steps {
  background: #FDFCF8;
  border-left: 3px solid var(--accent-primary);
  padding: 15px;
  border-radius: 12px;
  margin: 15px 0;
}

.crm-card .next-steps h5 {
  color: var(--accent-primary);
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  margin-bottom: 8px;
}

.crm-card .next-steps ul {
  padding-left: 20px;
  color: #4a4a4c;
  font-size: 13px;
}

/* =========================================
   MOBILE RESPONSIVENESS (BREAKPOINT: 768px)
   ========================================= */
@media (max-width: 768px) {

  /* ROOT OVERRIDES FOR MOBILE */
  body {
    height: 100%;
    min-height: -webkit-fill-available;
    /* Fixed height on iOS/Chrome */
    position: fixed;
    /* Prevent rubber-banding on whole page */
    width: 100%;
  }

  .app-container {
    position: relative;
    width: 100%;
    height: 100dvh;
    padding-top: env(safe-area-inset-top);
    /* Safe Area for Notch */
    padding-bottom: 0;
    /* REMOVED TO PREVENT DOUBLE PADDING */
    overflow: hidden;
    display: block;
    /* Overwrite flex */
  }

  /* 1. Sidebar (Default: Hidden/Overlay) */
  .sidebar {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 85%;
    max-width: 300px;
    z-index: 1000;
    transform: translateX(-100%);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 10px 0 30px rgba(0, 0, 0, 0.4);
    background: #090909;
    /* Deep Premium Black */
    border-right: 1px solid rgba(255, 255, 255, 0.05);
  }

  .sidebar.mobile-open {
    transform: translateX(0);
  }

  .sidebar-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(8px);
    /* Premium Blur */
    z-index: 999;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s ease;
  }

  .sidebar-overlay.open {
    opacity: 1;
    pointer-events: auto;
  }

  .mobile-close-btn {
    display: flex !important;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: calc(15px + env(safe-area-inset-top));
    right: 15px;
    background: rgba(255, 255, 255, 0.1);
    border: none;
    color: #fff;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    z-index: 1010;
  }

  /* 2. Main Content & ChatList Transition Logic */
  /* We use a 'sliding context' where the list stays left and chat comes over it */

  .chat-list-container {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 10;
    background: var(--bg-main);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .main-content {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 20;
    transform: translateX(100%);
    /* Start hidden to the right */
    transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
    /* Faster, snappy out, slow in */
    background: var(--bg-main);
    display: flex;
    flex-direction: column;
    box-shadow: -5px 0 25px rgba(0, 0, 0, 0.05);
  }

  /* VIEW STATE: Chat Open */
  .main-content.mobile-chat-open {
    transform: translateX(0);
  }

  /* When Chat is open, slightly move back the list to give depth (iOS style) */
  .app-container:has(.mobile-chat-open) .chat-list-container {
    transform: translateX(-15%);
    opacity: 0.8;
  }

  /* 3. Specialized Mobile Headers */
  .list-header,
  .chat-header {
    height: 65px;
    padding-top: env(safe-area-inset-top);
    display: flex;
    align-items: center;
    background: rgba(255, 255, 255, 0.92) !important;
    backdrop-filter: blur(25px) !important;
    z-index: 50;
    border-bottom: 1px solid rgba(0, 0, 0, 0.04) !important;
  }

  .chat-header {
    padding-left: 10px !important;
  }

  /* 4. Chat Item Enhancements */
  .chat-item {
    padding: 16px 20px !important;
    border-bottom: 1px solid rgba(0, 0, 0, 0.02) !important;
  }

  .chat-item .avatar {
    width: 50px !important;
    height: 50px !important;
    font-size: 18px !important;
  }

  /* 5. Message Aesthetics */
  .messages-column {
    padding: 15px !important;
  }

  .message-wrapper {
    margin-bottom: 10px !important;
  }

  .message-content {
    max-width: 88% !important;
    font-size: 14.5px !important;
    padding: 10px 14px !important;
    border-radius: 18px !important;
    line-height: 1.4 !important;
  }

  .message-wrapper.sent .message-content {
    border-bottom-right-radius: 4px !important;
  }

  .message-wrapper.received .message-content {
    border-bottom-left-radius: 4px !important;
  }

  /* 6. Input Area (Native Floating Style) */
  .message-input-area {
    padding: 10px 15px calc(10px + env(safe-area-inset-bottom)) 15px !important;
    background: var(--bg-main);
    border-top: none !important;
  }

  .message-input-area form {
    background: #f2f2f7;
    padding: 4px 6px 4px 15px !important;
    border-radius: 25px !important;
    border: 1px solid rgba(0, 0, 0, 0.05) !important;
    box-shadow: none !important;
  }

  .message-input-area input {
    font-size: 16px !important;
    /* iOS no-zoom */
    background: transparent !important;
    border: none !important;
    padding: 10px 0 !important;
  }

  .message-input-area .icon-btn {
    background: var(--accent-primary) !important;
    color: #000 !important;
    width: 34px !important;
    height: 34px !important;
    border-radius: 50% !important;
    padding: 0 !important;
    display: flex !important;
    align-items: center;
    justify-content: center;
  }

  /* 7. Hide Analysis/Desktop Panes */
  .main-grid {
    grid-template-columns: 1fr;
    height: 100%;
  }

  .analysis-column {
    display: none;
    /* Default hidden, but we'll add a way to see it */
  }

  .mobile-menu-btn,
  .mobile-back-btn,
  .mobile-analysis-btn {
    display: flex !important;
    width: 40px;
    height: 40px;
    align-items: center;
    justify-content: center;
    color: var(--accent-primary) !important;
  }

  /* Placeholder logic */
  .history-placeholder {
    display: none !important;
    /* Never show placeholders on mobile, show list instead */
  }
}

/* Ensure Desktop still hides mobile stuff */
.mobile-close-btn,
.mobile-menu-btn,
.mobile-back-btn,
.sidebar-overlay {
  display: none;
}
```

---

## File: src/main.jsx
```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import { useStore } from './store/useStore';

window.useStore = useStore;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

```

---

## File: src/pages/LandingPage.css
```css
/* ========================================
   AURA Landing Page - Professional Design
   Color Palette: Gray Scale + Gold
   ======================================== */

:root {
    /* CORRECT COLOR PALETTE */
    --white: #FFFFFF;
    --gray-light: #F5F5F5;
    --gray-medium: #9E9E9E;
    --gray-dark: #2C2C2C;
    --gold: #D4AF37;

    /* Semantic Colors */
    --text-primary: var(--gray-dark);
    --text-secondary: var(--gray-medium);
    --bg-primary: var(--white);
    --bg-secondary: var(--gray-light);
    --accent: var(--gold);

    /* Shadows */
    --shadow-sm: 0 2px 8px rgba(44, 44, 44, 0.08);
    --shadow-md: 0 4px 16px rgba(44, 44, 44, 0.12);
    --shadow-lg: 0 8px 32px rgba(44, 44, 44, 0.16);
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

.landing-page {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    background: var(--bg-primary);
    color: var(--text-primary);
    overflow-x: hidden;
}

/* ========================================
   TOP BAR
   ======================================== */

.landing-top-bar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid var(--gray-light);
    padding: 16px 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 2px 8px rgba(44, 44, 44, 0.05);
}

.top-bar-logo {
    font-size: 24px;
    font-weight: 800;
    color: var(--gray-dark);
    letter-spacing: 1px;
}

.btn-already-client {
    border: 2px solid var(--gold);
    background: transparent;
    color: var(--gold);
    padding: 10px 24px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 600;
    transition: all 0.3s ease;
}

.btn-already-client:hover {
    background: var(--gold);
    color: var(--white);
    transform: translateY(-2px);
}

/* ========================================
   HERO SECTION
   ======================================== */

.hero {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, var(--white) 0%, var(--gray-light) 100%);
    padding: 80px 20px;
    text-align: center;
    position: relative;
}

.hero::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background:
        radial-gradient(circle at 20% 30%, rgba(212, 175, 55, 0.05) 0%, transparent 50%),
        radial-gradient(circle at 80% 70%, rgba(212, 175, 55, 0.05) 0%, transparent 50%);
    pointer-events: none;
}

.hero-content {
    position: relative;
    z-index: 1;
    max-width: 900px;
}

.logo-hero {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 15px;
    margin-bottom: 40px;
}

.logo-icon {
    width: 70px;
    height: 70px;
    background: linear-gradient(135deg, var(--gold) 0%, #C19B2E 100%);
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: var(--shadow-md);
    color: var(--white);
}

.logo-hero h1 {
    font-size: 48px;
    font-weight: 800;
    color: var(--gray-dark);
    letter-spacing: 2px;
}

.hero-title {
    font-size: 56px;
    font-weight: 800;
    line-height: 1.2;
    margin-bottom: 24px;
    color: var(--gray-dark);
}

.hero-title .highlight {
    background: linear-gradient(135deg, var(--gold) 0%, #C19B2E 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.hero-subtitle {
    font-size: 20px;
    color: var(--text-secondary);
    line-height: 1.6;
    margin-bottom: 40px;
    max-width: 700px;
    margin-left: auto;
    margin-right: auto;
}

.cta-primary {
    background: linear-gradient(135deg, var(--gold) 0%, #C19B2E 100%);
    color: var(--white);
    border: none;
    padding: 18px 48px;
    font-size: 18px;
    font-weight: 600;
    border-radius: 12px;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 12px;
    box-shadow: 0 8px 24px rgba(212, 175, 55, 0.3);
    transition: all 0.3s ease;
}

.cta-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 32px rgba(212, 175, 55, 0.4);
}

.hero-trust {
    margin-top: 24px;
    color: var(--text-secondary);
    font-size: 14px;
}

/* ========================================
   FEATURES SECTION
   ======================================== */

.features {
    padding: 120px 20px;
    background: var(--white);
}

.section-title {
    text-align: center;
    font-size: 42px;
    font-weight: 800;
    color: var(--gray-dark);
    margin-bottom: 60px;
}

.features-grid {
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 32px;
}

.feature-card {
    background: var(--bg-secondary);
    padding: 40px 32px;
    border-radius: 16px;
    text-align: center;
    transition: all 0.3s ease;
    border: 2px solid transparent;
}

.feature-card:hover {
    transform: translateY(-8px);
    box-shadow: var(--shadow-lg);
    border-color: var(--gold);
}

.feature-icon {
    width: 80px;
    height: 80px;
    margin: 0 auto 24px;
    background: linear-gradient(135deg, var(--gold) 0%, #C19B2E 100%);
    color: var(--white);
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 8px 24px rgba(212, 175, 55, 0.25);
}

.feature-card h4 {
    font-size: 22px;
    margin-bottom: 12px;
    color: var(--gray-dark);
}

.feature-card p {
    color: var(--text-secondary);
    line-height: 1.6;
}

/* ========================================
   PRICING SECTION
   ======================================== */

.pricing {
    padding: 120px 20px;
    background: var(--gray-light);
}

.pricing-grid {
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 32px;
}

.pricing-card {
    background: var(--white);
    padding: 48px 32px;
    border-radius: 20px;
    box-shadow: var(--shadow-sm);
    transition: all 0.3s ease;
    border: 3px solid transparent;
    position: relative;
}

.pricing-card.recommended {
    border-color: var(--gold);
    box-shadow: 0 12px 48px rgba(212, 175, 55, 0.2);
    transform: scale(1.05);
}

.badge {
    position: absolute;
    top: -16px;
    left: 50%;
    transform: translateX(-50%);
    background: linear-gradient(135deg, var(--gold) 0%, #C19B2E 100%);
    color: var(--white);
    padding: 8px 24px;
    border-radius: 24px;
    font-size: 14px;
    font-weight: 700;
    box-shadow: 0 4px 16px rgba(212, 175, 55, 0.3);
}

.pricing-card h4 {
    font-size: 28px;
    margin-bottom: 16px;
    color: var(--gray-dark);
}

.price {
    margin-bottom: 32px;
}

.price-value {
    font-size: 48px;
    font-weight: 800;
    color: var(--gold);
}

.price-period {
    font-size: 18px;
    color: var(--text-secondary);
}

.features-list {
    list-style: none;
    margin-bottom: 32px;
}

.features-list li {
    padding: 12px 0;
    display: flex;
    align-items: center;
    gap: 12px;
    color: var(--text-primary);
    border-bottom: 1px solid var(--gray-light);
}

.features-list li svg {
    color: var(--gold);
    flex-shrink: 0;
}

.btn-gold,
.btn-outline {
    width: 100%;
    padding: 16px;
    border-radius: 12px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    border: 2px solid var(--gold);
}

.btn-gold {
    background: linear-gradient(135deg, var(--gold) 0%, #C19B2E 100%);
    color: var(--white);
}

.btn-gold:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(212, 175, 55, 0.3);
}

.btn-outline {
    background: transparent;
    color: var(--gold);
}

.btn-outline:hover {
    background: var(--gold);
    color: var(--white);
}

/* ========================================
   REGISTRATION SECTION
   ======================================== */

.registration {
    padding: 120px 20px;
    background: var(--white);
}

.registration-container {
    max-width: 600px;
    margin: 0 auto;
}

.registration-subtitle {
    text-align: center;
    color: var(--text-secondary);
    margin-bottom: 48px;
    font-size: 18px;
}

.registration-form {
    background: var(--gray-light);
    padding: 48px;
    border-radius: 20px;
    box-shadow: var(--shadow-md);
}

.form-group {
    margin-bottom: 24px;
}

.form-group label {
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
    color: var(--gray-dark);
}

.form-group input,
.form-group select {
    width: 100%;
    padding: 16px;
    border: 2px solid transparent;
    border-radius: 10px;
    font-size: 16px;
    background: var(--white);
    color: var(--text-primary);
    transition: all 0.3s ease;
}

.form-group input:focus,
.form-group select:focus {
    outline: none;
    border-color: var(--gold);
    box-shadow: 0 0 0 4px rgba(212, 175, 55, 0.1);
}

.btn-submit {
    width: 100%;
    padding: 18px;
    background: linear-gradient(135deg, var(--gold) 0%, #C19B2E 100%);
    color: var(--white);
    border: none;
    border-radius: 12px;
    font-size: 18px;
    font-weight: 700;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    transition: all 0.3s ease;
    margin-top: 32px;
}

.btn-submit:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 32px rgba(212, 175, 55, 0.4);
}

.form-note {
    margin-top: 16px;
    text-align: center;
    font-size: 13px;
    color: var(--text-secondary);
}

/* ========================================
   FOOTER
   ======================================== */

.footer {
    background: var(--gray-dark);
    color: var(--white);
    padding: 60px 20px 24px;
}

.footer-content {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 40px;
    flex-wrap: wrap;
    gap: 32px;
}

.footer-logo h4 {
    font-size: 28px;
    margin-bottom: 8px;
    color: var(--gold);
}

.footer-logo p {
    color: var(--gray-medium);
}

.footer-links {
    display: flex;
    gap: 32px;
}

.footer-links a {
    color: var(--gray-medium);
    text-decoration: none;
    transition: color 0.3s ease;
}

.footer-links a:hover {
    color: var(--gold);
}

.footer-bottom {
    text-align: center;
    padding-top: 32px;
    border-top: 1px solid rgba(158, 158, 158, 0.2);
    color: var(--gray-medium);
    font-size: 14px;
}

/* ========================================
   RESPONSIVE
   ======================================== */

@media (max-width: 768px) {
    .hero-title {
        font-size: 38px;
    }

    .hero-subtitle {
        font-size: 16px;
    }

    .section-title {
        font-size: 32px;
    }

    .pricing-card.recommended {
        transform: scale(1);
    }

    .registration-form {
        padding: 32px 24px;
    }

    .footer-content {
        flex-direction: column;
        text-align: center;
    }

    .footer-links {
        flex-direction: column;
        gap: 16px;
    }
}
```

---

## File: src/pages/LandingPage.jsx
```jsx
import React, { useState } from 'react';
import { Check, Zap, Brain, TrendingUp, Users, Shield, ArrowRight } from 'lucide-react';
import './LandingPage.css';

const LandingPage = ({ onGetStarted }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        company: '',
        plan: 'pro'
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        // TODO: Integrate with backend/payment
        // For now, navigate to login screen
        alert(`Cadastro iniciado para ${formData.name}! Redirecionando para login...`);
        setTimeout(() => onGetStarted(), 1500);
    };

    const features = [
        {
            icon: <Brain size={32} />,
            title: 'IA Estratégica',
            description: 'Sugestões inteligentes de respostas que convertem leads em vendas'
        },
        {
            icon: <TrendingUp size={32} />,
            title: 'CRM Automático',
            description: 'Pipeline visual que organiza seus clientes automaticamente'
        },
        {
            icon: <Users size={32} />,
            title: 'Histórico Completo',
            description: 'Todas as conversas salvas e pesquisáveis em segundos'
        },
        {
            icon: <Zap size={32} />,
            title: 'Respostas Rápidas',
            description: 'Reduza tempo de resposta em 70% com IA'
        },
        {
            icon: <Shield size={32} />,
            title: 'Segurança Total',
            description: 'Autenticação protegida e dados criptografados'
        }
    ];

    const plans = [
        {
            name: 'Starter',
            price: 'R$ 197',
            period: '/mês',
            features: [
                '1 número WhatsApp',
                'IA com 500 sugestões/mês',
                'CRM básico',
                'Histórico 30 dias',
                'Suporte por email'
            ],
            recommended: false
        },
        {
            name: 'Pro',
            price: 'R$ 497',
            period: '/mês',
            features: [
                '3 números WhatsApp',
                'IA com 3.000 sugestões/mês',
                'CRM completo + automações',
                'Histórico ilimitado',
                'Suporte prioritário',
                'Relatórios avançados'
            ],
            recommended: true
        },
        {
            name: 'Enterprise',
            price: 'Personalizado',
            period: '',
            features: [
                'Números ilimitados',
                'IA ilimitada',
                'Integrações customizadas',
                'API dedicada',
                'Account Manager',
                'SLA garantido'
            ],
            recommended: false
        }
    ];

    return (
        <div className="landing-page">
            {/* Top Bar with Login Button */}
            <div className="landing-top-bar">
                <div className="top-bar-logo">AURA</div>
                <button className="btn-already-client" onClick={onGetStarted}>
                    Já sou Cliente →
                </button>
            </div>

            {/* Hero Section */}
            <section className="hero">
                <div className="hero-content">
                    <div className="logo-hero">
                        <div className="logo-icon">
                            <svg width="60" height="60" viewBox="0 0 24 24" fill="none">
                                <rect x="3" y="3" width="7" height="7" rx="1" fill="currentColor" opacity="0.9" />
                                <rect x="3" y="13" width="7" height="7" rx="1" fill="currentColor" opacity="0.7" />
                                <rect x="13" y="3" width="7" height="7" rx="1" fill="currentColor" opacity="0.7" />
                                <rect x="13" y="13" width="7" height="7" rx="1" fill="currentColor" opacity="0.5" />
                            </svg>
                        </div>
                        <h1>AURA</h1>
                    </div>

                    <h2 className="hero-title">
                        Transforme WhatsApp em<br />
                        <span className="highlight">Máquina de Vendas com IA</span>
                    </h2>

                    <p className="hero-subtitle">
                        Sistema completo de vendas com Inteligência Artificial.<br />
                        Sugestões estratégicas, CRM automático e histórico inteligente.
                    </p>

                    <button className="cta-primary" onClick={() => document.getElementById('register')?.scrollIntoView({ behavior: 'smooth' })}>
                        Começar Agora <ArrowRight size={20} />
                    </button>

                    <p className="hero-trust">✓ Sem cartão de crédito • ✓ Teste grátis 7 dias</p>
                </div>
            </section>

            {/* Features Section */}
            <section className="features">
                <h3 className="section-title">Por que AURA?</h3>
                <div className="features-grid">
                    {features.map((feature, idx) => (
                        <div key={idx} className="feature-card">
                            <div className="feature-icon">{feature.icon}</div>
                            <h4>{feature.title}</h4>
                            <p>{feature.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Pricing Section */}
            <section className="pricing">
                <h3 className="section-title">Escolha seu Plano</h3>
                <div className="pricing-grid">
                    {plans.map((plan, idx) => (
                        <div key={idx} className={`pricing-card ${plan.recommended ? 'recommended' : ''}`}>
                            {plan.recommended && <div className="badge">Mais Popular</div>}
                            <h4>{plan.name}</h4>
                            <div className="price">
                                <span className="price-value">{plan.price}</span>
                                <span className="price-period">{plan.period}</span>
                            </div>
                            <ul className="features-list">
                                {plan.features.map((f, i) => (
                                    <li key={i}><Check size={18} /> {f}</li>
                                ))}
                            </ul>
                            <button
                                className={plan.recommended ? 'btn-gold' : 'btn-outline'}
                                onClick={() => {
                                    setFormData({ ...formData, plan: plan.name.toLowerCase() });
                                    document.getElementById('register')?.scrollIntoView({ behavior: 'smooth' });
                                }}
                            >
                                Escolher {plan.name}
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            {/* Registration Form */}
            <section id="register" className="registration">
                <div className="registration-container">
                    <h3 className="section-title">Comece Agora Gratuitamente</h3>
                    <p className="registration-subtitle">7 dias de teste grátis. Cancele quando quiser.</p>

                    <form onSubmit={handleSubmit} className="registration-form">
                        <div className="form-group">
                            <label>Nome Completo</label>
                            <input
                                type="text"
                                placeholder="Seu nome"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                placeholder="seu@email.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Empresa</label>
                            <input
                                type="text"
                                placeholder="Nome da sua empresa"
                                value={formData.company}
                                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Plano Desejado</label>
                            <select
                                value={formData.plan}
                                onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
                            >
                                <option value="starter">Starter - R$ 197/mês</option>
                                <option value="pro">Pro - R$ 497/mês</option>
                                <option value="enterprise">Enterprise - Personalizado</option>
                            </select>
                        </div>

                        <button type="submit" className="btn-submit">
                            Iniciar Teste Gratuito <ArrowRight size={20} />
                        </button>

                        <p className="form-note">
                            Ao cadastrar, você concorda com nossos Termos de Uso
                        </p>
                    </form>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="footer-content">
                    <div className="footer-logo">
                        <h4>AURA</h4>
                        <p>Business Copilot</p>
                    </div>
                    <div className="footer-links">
                        <a href="#features">Recursos</a>
                        <a href="#pricing">Preços</a>
                        <a href="#contact">Contato</a>
                        <a href="#privacy">Privacidade</a>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>© 2026 AURA. Todos os direitos reservados.</p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;

```

---

## File: src/services/openai.js
```js
const MASTER_AI_KEY = import.meta.env.VITE_OPENAI_API_KEY;

class OpenAIService {
    async generateSuggestion({ clientName, history, briefing, extraContext = "" }) {
        const openaiKey = MASTER_AI_KEY;
        if (!openaiKey) {
            console.error("AURA: OpenAI API Key missing");
            return "⚠️ ERRO: Chave da OpenAI não configurada.";
        }

        const systemPrompt = `
Você é o Orquestrador da AURA v1.2.1, o cérebro comercial da VoxeFlow. Sua missão é transformar o conhecimento técnico da empresa em vendas exponenciais.

BASE DE CONHECIMENTO (ESTRUTURADA):
${briefing}

DIRETRIZES DE ALTA PERFORMANCE:
1. ADAPTAÇÃO TOTAL: Identifique o [SEGMENTO] acima. Use o vocabulário, as dores e o tom específico desse mercado.
2. LEI DO LOOP (OBRIGATÓRIO): TODA, absolutamente TODA resposta deve encerrar com uma PERGUNTA curta. Isso controla a conversa subliminarmente. Jamais termine com afirmação.
3. PODER DO VALOR (WOW): Use os [DIFERENCIAIS] para criar autoridade antes de tocar em [FINANCEIRO] ou [DIRETRIZES]. 
4. ARGUMENTO DINÂMICO: Se o cliente insistir numa dúvida já respondida, mude de lógica para emoção (e vice-versa), nunca repita o mesmo script.
5. ZERO RÓTULOS: Retorne APENAS o texto puro. Sem nomes ou explicações.
6. ⚠️ INTELIGÊNCIA CONTEXTUAL: Antes de responder, ANALISE se a pergunta está na BASE DE CONHECIMENTO. Se estiver (ex: convênio, preços, tratamentos), use APENAS essas informações. NUNCA sugira algo aleatório que não seja a resposta direta à pergunta.

ESTILO WHATSAPP:
- Respostas rápidas (máx 3 linhas).
- Linguagem humana, decidida e sem formalismos exagerados.
- POLÍTICA DE PREÇOS: Se o briefing contiver valores, VOCÊ PODE informar faixas de preço.
⚠️ REGRA DE OURO: JAMAIS INVENTE VALORES. Se o briefing não tiver o preço específico solicitado, diga que "varia conforme o caso" e venda a avaliação.

${extraContext ? `DADOS TÉCNICOS ADICIONAIS: ${extraContext}` : ''}
        `.trim();

        // 1. Prepare Messages
        const messages = [
            { role: 'system', content: systemPrompt }
        ];

        // 2. Add History
        if (Array.isArray(history)) {
            messages.push(...history);
        }

        // 3. Force final command
        messages.push({
            role: 'user',
            content: 'Gere a melhor resposta para a última mensagem acima. Seja direto, sem saudações e sem repetir o que já foi dito nas mensagens anteriores da Empresa.'
        });

        try {
            const response = await fetch('/api/ai', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: 'gpt-4o',
                    messages: messages,
                    temperature: 0.9,
                    max_tokens: 300
                })
            });

            const data = await response.json();
            if (data.error) {
                console.error("AURA AI Proxy Error:", data.error);
                return null;
            }

            let result = data.choices[0].message.content.trim();
            // Final sanitize: Remove any labels the AI might have hallucinated
            result = result.replace(/^(Empresa|Aura|Vendedor|Assistant):\s*/i, '');

            return result;
        } catch (e) {
            console.error("AURA AI Proxy Fetch Error:", e);
            return null;
        }
    }

    async enhanceMessage(text, context = {}) {
        const openaiKey = MASTER_AI_KEY;
        if (!openaiKey || !text.trim()) return text;

        const systemPrompt = `
Você é um redator de vendas EXPERT e assistente de comunicação profissional. Sua missão é transformar o rascunho ou instrução do usuário em uma mensagem de WhatsApp impecável, persuasiva e humana.

CONTEXTO DO NEGÓCIO:
${context.briefing || 'Empresa de Alto Padrão'}

OBJETIVO:
Você deve agir de duas formas, dependendo do que o usuário enviar:

1. SE FOR UM RASCUNHO (Texto incompleto, com erros ou mal escrito):
   - Corrija ortografia, gramática e pontuação.
   - Melhore a fluidez e o tom (mantenha profissional mas próximo).
   - Não adicione informações que não estão lá, apenas "limpe" e "brilhe" o texto.

2. SE FOR UMA INSTRUÇÃO (Ex: "diga que não aceitamos convenio mas damos desconto"):
   - Entenda a INTENÇÃO do usuário.
   - Crie uma frase COMPLETA, elegante e profissional baseada no contexto.
   - Use gatilhos de empatia e conduza para o próximo passo.

REGRAS DE OURO:
- MÁXIMO 3 linhas.
- Naturalidade total (nada de "Caro cliente" ou tons robóticos).
- Vá direto ao ponto.
- Preserve a essência da mensagem.

RETORNE APENAS O TEXTO FINAL DA MENSAGEM, sem explicações, sem aspas, sem comentários.
        `.trim();

        try {
            const response = await fetch('/api/ai', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: 'gpt-4o', // Using GPT-4o for better intent detection
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: text }
                    ],
                    temperature: 0.7,
                    max_tokens: 300
                })
            });

            const data = await response.json();
            if (data.error) {
                console.error("AURA AI Proxy Error:", data.error);
                return text;
            }

            return data.choices[0].message.content.trim();
        } catch (e) {
            console.error("AURA AI Proxy Fetch Error:", e);
            return text;
        }
    }

    async analyzeNextSteps(chatHistory, patientName, currentTag) {
        const openaiKey = MASTER_AI_KEY;
        if (!openaiKey) {
            return {
                steps: ['Configure OpenAI API key'],
                priority: 'medium',
                reasoning: 'API key não configurada'
            };
        }

        const systemPrompt = `
Você é um consultor de vendas EXPERT em orquestração de negócios.

CONTEXTO:
- Cliente: ${patientName}
- Estágio Atual: ${currentTag}

HISTÓRICO DA CONVERSA:
${chatHistory}

MISSÃO: Analise a conversa e sugira os próximos 2-3 passos ESPECÍFICOS e ACIONÁVEIS para converter este lead.

REGRAS:
1. Seja ESPECÍFICO (não genérico como "fazer follow-up")
2. Considere o estágio atual do funil
3. Priorize ações que movem o lead para o próximo estágio
4. Seja PRÁTICO (ações que podem ser feitas hoje)

EXEMPLOS DE BONS PASSOS:
- "Enviar vídeo explicativo sobre implante dentário via WhatsApp"
- "Ligar hoje às 15h para esclarecer dúvida sobre convênio"
- "Enviar proposta personalizada com 3 opções de pagamento"

RETORNE EM JSON:
{
  "steps": ["Passo 1", "Passo 2", "Passo 3"],
  "priority": "high|medium|low",
  "reasoning": "Breve explicação da prioridade"
}
        `.trim();

        try {
            const response = await fetch('/api/ai', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: 'gpt-4o',
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: 'Analise e sugira os próximos passos.' }
                    ],
                    temperature: 0.7,
                    max_tokens: 300,
                    response_format: { type: "json_object" }
                })
            });

            const data = await response.json();

            if (data.error) {
                console.error('OpenAI API Error:', data.error);
                return {
                    steps: ['Revisar conversa manualmente'],
                    priority: 'medium',
                    reasoning: 'Erro na análise automática'
                };
            }

            const result = JSON.parse(data.choices[0].message.content);
            return result;
        } catch (error) {
            console.error('Error analyzing next steps:', error);
            return {
                steps: ['Revisar conversa manualmente'],
                priority: 'medium',
                reasoning: 'Erro na análise automática'
            };
        }
    }

    async generateNextBriefingQuestion(currentAnswers) {
        const openaiKey = MASTER_AI_KEY;
        if (!openaiKey) return "Qual o próximo detalhe importante do seu negócio?";

        const systemPrompt = `
Você é o Arquiteto de Inteligência da AURA. Sua missão é entrevistar o dono de um negócio para criar uma base de conhecimento PERFEITA.

REGRAS DA ENTREVISTA:
1. Analise o que já sabemos: ${JSON.stringify(currentAnswers)}
2. IDENTIFIQUE LACUNAS: Falta o endereço? É produto ou serviço? Como é o checkout? Tem garantia?
3. PERGUNTA ÚNICA: Faça APENAS UMA pergunta por vez.
4. FOCO EM VENDAS: Pergunte coisas que ajudem a IA a vender melhor depois (ex: diferenciais, dores do cliente).
5. CURTO E DIRETO: A pergunta deve ser fácil de responder no celular.
6. FINALIZAÇÃO: Se você achar que já tem informações suficientes para uma operação de elite (mínimo 5-6 pontos chave), responda apenas com a palavra "COMPLETE".

ESTILO: Amigável, profissional e focado em eficiência.
        `.trim();

        try {
            const response = await fetch('/api/ai', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: 'gpt-4o',
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: 'Gere a próxima pergunta da entrevista ou diga COMPLETE.' }
                    ],
                    temperature: 0.7,
                    max_tokens: 150
                })
            });

            const data = await response.json();
            return data.choices?.[0]?.message?.content?.trim() || "Algum outro detalhe importante?";
        } catch (e) {
            return "Algum outro detalhe importante?";
        }
    }

    async analyzeKnowledgePoint(question, answer) {
        const openaiKey = MASTER_AI_KEY;
        if (!openaiKey) return "Analise não disponível.";

        const systemPrompt = `
Você é o Estrategista de Vendas da AURA. Sua missão é analisar um ponto específico do conhecimento de uma empresa e dizer POR QUE isso é importante para vender e como a IA deve usar isso.

REGRAS:
1. Resposta CURTA (máximo 2 linhas).
2. Use tom de consultoria.
3. Foque em CONVERSÃO.
        `.trim();

        try {
            const response = await fetch('/api/ai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: 'gpt-4o',
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: `Pergunta: ${question}\nResposta: ${answer}\n\nGere uma análise estratégica curta.` }
                    ],
                    temperature: 0.5,
                    max_tokens: 100
                })
            });

            const data = await response.json();
            return data.choices?.[0]?.message?.content?.trim() || "Ponto estratégico validado.";
        } catch (e) {
            return "Ponto estratégico salvo com sucesso.";
        }
    }
}

export default new OpenAIService();

```

---

## File: src/services/rag.js
```js
import { useStore } from '../store/useStore';

class RAGService {
    /**
     * Searches for relevant context based on the query (patient's last message).
     * In this initial version, it simply concatenates matching snippets from RAG sources.
     */
    async getRelevantContext(query) {
        console.log("AURA RAG: Buscando contexto para query:", query);
        const { ragSources, briefing } = useStore.getState();
        let context = "";

        if (!query) return "";

        const cleanQuery = query.toLowerCase();
        const queryWords = cleanQuery.split(/\s+/);

        // 1. Check Briefing (Core Knowledge)
        if (briefing && (cleanQuery.includes('quem') || cleanQuery.includes('clinica') || cleanQuery.includes('onde'))) {
            context += `\n[Info Clínica]: ${briefing.substring(0, 500)}`;
        }

        // 2. Check specialist RAG Sources (Future: Vector Search)
        let processedSources = [];
        if (Array.isArray(ragSources)) {
            processedSources = ragSources;
        } else if (ragSources && typeof ragSources === 'object') {
            processedSources = Object.values(ragSources);
        }

        processedSources.forEach(source => {
            if (!source.keywords || !source.content) return;
            const triggerWords = Array.isArray(source.keywords) ? source.keywords : [source.keywords];

            // Check if any keyword is contained in the query OR if any query word matches a keyword
            const matches = triggerWords.some(word => {
                const cleanWord = String(word).toLowerCase();
                return cleanQuery.includes(cleanWord) || queryWords.includes(cleanWord);
            });

            if (matches) {
                console.log(`AURA RAG: ✅ Match encontrado! Fonte: ${source.name}`);
                context += `\n[Especialista - ${source.name}]: ${source.content}`;
            }
        });

        if (!context) console.log("AURA RAG: ❌ Nenhum contexto relevante encontrado.");
        return context;
    }
}

export default new RAGService();

```

---

## File: src/services/supabase.js
```js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('AURA: Supabase credentials missing in environment variables.');
}

export const supabase = createClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseAnonKey || 'placeholder'
);

console.log('AURA: Supabase client initialized');

```

---

## File: src/services/whatsapp.js
```js
import { useStore } from '../store/useStore';
import { io } from 'socket.io-client';

class WhatsAppService {
    constructor() {
        this.socket = null;
    }

    async request(endpoint, method = 'GET', body = null) {
        const { apiUrl, apiKey } = useStore.getState();
        if (!apiUrl || !apiKey) return null;

        const headers = { 'Content-Type': 'application/json', 'apikey': apiKey };
        const baseUrl = String(apiUrl).trim().endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;
        const cleanEndpoint = endpoint.startsWith('/') ? endpoint : '/' + endpoint;
        const url = `${baseUrl}${cleanEndpoint}`;

        console.log(`AURA: Fetching ${url}`);
        try {
            const response = await fetch(url, {
                method,
                headers,
                body: body ? JSON.stringify(body) : null
            });

            if (!response.ok) {
                // Return error object instead of null so we can handle 404s
                const errorBody = await response.json().catch(() => ({}));
                return { error: true, status: response.status, ...errorBody };
            }

            return await response.json();
        } catch (e) {
            console.error("API Request Error:", e);
            return { error: true, message: e.message };
        }
    }

    connectSocket() {
        const { apiUrl, apiKey, instanceName } = useStore.getState();
        if (!apiUrl || !instanceName || this.socket) return;

        console.log(`🔌 Initializing Socket for ${instanceName}...`);

        // Evolution API usually exposes socket at root
        const baseUrl = String(apiUrl).trim().endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;

        this.socket = io(baseUrl, {
            transports: ['websocket', 'polling'],
            query: {
                apikey: apiKey
            }
        });

        this.socket.on('connect', () => {
            console.log('✅ Socket Connected!');
        });

        this.socket.on(`messages.upsert`, (payload) => {
            // Payload format: { instance, data: { ...message... }, ... }
            if (payload?.data) {
                const msg = payload.data;
                const remoteJid = msg.key?.remoteJid;

                // DEEP SCAN for Phone Number in Real-Time
                // This mimics N8N's ability to see the raw webhook
                if (remoteJid && remoteJid.includes('@lid')) {
                    // Check if message has participant with real number
                    const participant = msg.key?.participant || msg.participant;
                    if (participant && participant.includes('@s.whatsapp.net')) {
                        const extracted = participant.split('@')[0];
                        console.log(`🕵️ Socket Discovery: Found valid number ${extracted} for LID ${remoteJid}`);
                        this.setManualPhoneMapping(remoteJid, extracted);
                    }
                }

                // Append to store if active chat? 
                // For now, just logging and fixing contact mapping.
                // We can expand this to update useStore messages later.
            }
        });
    }

    async checkConnection() {
        const { instanceName } = useStore.getState();
        if (!instanceName) return 'disconnected';

        // Ensure socket is connected
        if (!this.socket) this.connectSocket();

        try {
            const data = await this.request(`/instance/connectionState/${instanceName}`);

            if (data?.instance?.state) return data.instance.state;

            // If 404 (instance not found), returns null from request()
            // We should try to create it if it doesn't exist
            return 'disconnected';
        } catch (e) {
            return 'disconnected';
        }
    }

    async createInstance(name) {
        if (!name) return null;
        console.log(`AURA: Creating instance ${name}...`);
        // FIX: Use proven payload for Evolution API v2
        return await this.request('/instance/create', 'POST', {
            instanceName: name,
            token: name,
            qrcode: false,
            integration: 'WHATSAPP-BAILEYS'
        });
    }

    async connectInstance() {
        const { instanceName } = useStore.getState();
        if (!instanceName) return null;

        // v2 standard: GET to connect instance
        // If 404, it means instance doesn't exist. We must CREATE it.
        try {
            const response = await this.request(`/instance/connect/${instanceName}`);

            // Check for specific 404 or error in response payload if request() swallowed it
            if (!response || (response.error && response.status === 404) || (response.response && response.response.message && response.response.message.includes('does not exist'))) {
                console.warn(`AURA: Instance ${instanceName} not found. Creating...`);
                await this.createInstance(instanceName);
                // Try connecting again after creation
                return await this.request(`/instance/connect/${instanceName}`);
            }

            return response;
        } catch (e) {
            console.error("Connect error:", e);
            return null;
        }
    }

    async logoutInstance() {
        const { instanceName } = useStore.getState();
        if (!instanceName) return null;
        // CRITICAL: Delete the instance to clear all data (chats, messages) from the backend
        // This ensures that if the user connects a different number, no old data remains.
        return await this.request(`/instance/delete/${instanceName}`, 'DELETE');
    }

    standardizeJid(jid) {
        if (!jid) return null;
        let clean = String(jid).trim();
        if (!clean.includes('@')) clean = `${clean}@s.whatsapp.net`;

        // Final sanity check: must have at least 5 digits before @
        const parts = clean.split('@');
        if (parts[0].replace(/\D/g, '').length < 5) return null;

        return clean;
    }


    async fetchMediaUrl(messageKey) {
        const { instanceName } = useStore.getState();
        if (!instanceName || !messageKey) return null;

        try {
            const data = await this.request(`/chat/getBase64FromMediaMessage/${instanceName}`, 'POST', {
                message: {
                    key: messageKey
                },
                convertToMp4: false
            });

            // Evolution API may return base64 with or without Data URI prefix
            let base64 = data?.base64 || null;

            if (!base64) return null;

            // If the base64 doesn't start with "data:", add the proper prefix
            // Evolution API typically returns audio/ogg for WhatsApp voice messages
            if (!base64.startsWith('data:')) {
                base64 = `data:audio/ogg;base64,${base64}`;
            }

            return base64;
        } catch (e) {
            console.error("Media fetch error:", e);
            return null;
        }
    }

    async fetchChats() {
        const { instanceName } = useStore.getState();
        if (!instanceName) return [];

        // v2 standard: POST to findChats
        const data = await this.request(`/chat/findChats/${instanceName}`, 'POST', {});

        // Fetch Address Book to help resolve LIDs
        const contactsList = await this.fetchContacts();
        const contactsMap = new Map(); // Name -> JID
        contactsList.forEach(c => {
            const jid = c.id || c.jid;
            const name = (c.name || c.pushName || "").trim();
            if (jid && jid.includes('@s.whatsapp.net') && name) {
                contactsMap.set(name, jid);
            }
        });

        const list = Array.isArray(data) ? data : (data?.records || data?.chats || []);

        const phoneChats = new Map();
        const lidChats = [];
        const finalMap = new Map();

        // Pass 1: Segregate and Normalize
        list.forEach(c => {
            const rawJid = c.remoteJid || c.jid || c.id || c.key?.remoteJid;
            if (!rawJid || typeof rawJid !== 'string') return;

            let jid = rawJid.includes('@') ? rawJid : `${rawJid}@s.whatsapp.net`;
            c.id = jid;
            c.remoteJid = jid;

            if (jid.includes('@lid')) {
                lidChats.push(c);
            } else {
                phoneChats.set(jid, c);
                finalMap.set(jid, c);
            }
        });

        // Pass 2: Merge LIDs into Phones (STRICTER)
        lidChats.forEach(lidChat => {
            let match = null;

            // Strategy A: Exact Name Match (Only if name exists and is not empty)
            const lidName = (lidChat.name || lidChat.pushName || "").trim();
            if (lidName && lidName.length > 1) {
                // 1. Try to find in active Phone Chats
                for (const [pJid, pChat] of phoneChats.entries()) {
                    const pName = (pChat.name || pChat.pushName || "").trim();
                    if (pName === lidName) {
                        match = pChat;
                        break;
                    }
                }

                // 2. If not found in chats, try to find in Address Book (Contacts)
                if (!match && contactsMap.size > 0) {
                    const contactJid = contactsMap.get(lidName);
                    if (contactJid) {
                        // We found the real phone number in contacts!
                        // We don't have a chat object for it, so we stick with the LID chat
                        // BUT we attach the real phone number to it for sending messages.
                        lidChat.phoneNumber = contactJid.split('@')[0];
                        console.log(`✅ Resolved LID ${lidChat.id} to Phone ${lidChat.phoneNumber} via Contacts`);
                    }
                }
            }

            // Strategy B: Profile Pic Match (Fallback)
            if (!match && lidChat.profilePicUrl) {
                for (const [pJid, pChat] of phoneChats.entries()) {
                    if (pChat.profilePicUrl === lidChat.profilePicUrl) {
                        match = pChat;
                        break;
                    }
                }
            }

            if (match) {
                // Identity Fusion: Use the newest timestamp
                const getTS = (c) => c.lastMessage?.messageTimestamp || c.messageTimestamp || c.conversationTimestamp || 0;
                const lidTime = getTS(lidChat);
                const matchTime = getTS(match);

                if (lidTime > matchTime) {
                    match.lastMessage = lidChat.lastMessage || match.lastMessage;
                    match.messageTimestamp = lidTime;
                }
                match.linkedLid = lidChat.id;
                match.unreadCount = (match.unreadCount || 0) + (lidChat.unreadCount || 0);
            } else {
                // Keep LID if not merged
                finalMap.set(lidChat.id, lidChat);
            }
        });

        // 3. Sort by Real Activity (Last Message Timestamp)
        return Array.from(finalMap.values()).sort((a, b) => {
            const getT = (c) => {
                // messageTimestamp is in seconds from API, convert to ms
                const ts = c.lastMessage?.messageTimestamp || c.messageTimestamp || c.conversationTimestamp || 0;
                return ts * 1000;
            };

            const timeA = getT(a);
            const timeB = getT(b);

            return timeB - timeA;
        });
    }

    async fetchContacts() {
        const { instanceName } = useStore.getState();
        if (!instanceName) return [];
        try {
            // v2 standard: POST to findContacts to get address book
            const data = await this.request(`/chat/findContacts/${instanceName}`, 'POST', {});
            const list = Array.isArray(data) ? data : (data?.records || data?.contacts || []);
            return Array.isArray(list) ? list : [];
        } catch (e) {
            console.error("Error fetching contacts:", e);
            return [];
        }
    }

    async fetchMessages(jid, linkedJid = null) {
        const { instanceName } = useStore.getState();
        const cleanJid = this.standardizeJid(jid);
        if (!instanceName || !cleanJid) return [];

        const tryFetch = async (targetJid) => {
            if (!targetJid) return [];
            try {
                const data = await this.request(`/chat/findMessages/${instanceName}`, 'POST', {
                    where: {
                        key: {
                            remoteJid: targetJid
                        }
                    },
                    limit: 500 // Maximum limit to capture full history
                });
                const list = data?.messages?.records || data?.records || data?.messages || [];
                return Array.isArray(list) ? list : [];
            } catch (e) {
                console.error(`Error fetching messages for ${targetJid}:`, e);
                return [];
            }
        };

        // 1. Fetch Main JID
        let messages = await tryFetch(cleanJid);

        // 2. Fetch Linked LID (if exists) - The "Missing Audio" Recovery
        if (linkedJid) {
            const lidMessages = await tryFetch(this.standardizeJid(linkedJid));
            if (lidMessages.length > 0) {
                // Merge and Deduplicate by Message Key ID
                const seen = new Set(messages.map(m => m.key?.id));
                lidMessages.forEach(m => {
                    if (!seen.has(m.key?.id)) {
                        messages.push(m);
                    }
                });
            }
        }

        // 3. Fallback: Brazilian 9-digit heuristic (only if NO linkedJid was known)
        if (messages.length === 0 && !linkedJid && cleanJid.startsWith('55')) {
            const number = cleanJid.split('@')[0];
            const alt = number.length === 13 ? number.slice(0, 4) + number.slice(5) :
                (number.length === 12 ? number.slice(0, 4) + '9' + number.slice(4) : null);
            if (alt) {
                const altMsgs = await tryFetch(`${alt}@s.whatsapp.net`);
                messages = [...messages, ...altMsgs];
            }
        }

        // 4. Sort by Timestamp Descending (Newest first)
        return messages.sort((a, b) => {
            const tA = a.messageTimestamp || 0;
            const tB = b.messageTimestamp || 0;
            return tB - tA;
        });
    }

    // PHONE NUMBER EXTRACTION & MANAGEMENT
    getManualPhoneMapping(jid) {
        try {
            const mappings = JSON.parse(localStorage.getItem('contactPhoneMap') || '{}');
            return mappings[jid] || null;
        } catch (e) {
            console.error('Error reading phone mappings:', e);
            return null;
        }
    }

    setManualPhoneMapping(jid, phoneNumber) {
        try {
            const mappings = JSON.parse(localStorage.getItem('contactPhoneMap') || '{}');
            mappings[jid] = phoneNumber;
            localStorage.setItem('contactPhoneMap', JSON.stringify(mappings));
            console.log(`✅ Saved phone mapping: ${jid} → ${phoneNumber}`);
            return true;
        } catch (e) {
            console.error('Error saving phone mapping:', e);
            return false;
        }
    }

    extractPhoneNumber(jid, chatData = null) {
        if (!jid) return null;

        // Priority 1: Regular phone number JID (e.g., "5531992957555@s.whatsapp.net")
        if (jid.includes('@s.whatsapp.net') && !jid.includes('@lid')) {
            const phone = jid.split('@')[0];
            // Validate it's actually a phone number (10-15 digits)
            if (/^\d{10,15}$/.test(phone)) {
                return phone;
            }
        }

        // Priority 2: Extract from chat metadata (for @lid contacts)
        if (chatData) {
            // Check participant field (often contains the real phone number)
            const participant = chatData.lastMessage?.key?.participant ||
                chatData.lastMessage?.participant ||
                chatData.participant;

            if (participant && participant.includes('@s.whatsapp.net')) {
                const phone = participant.split('@')[0];
                if (/^\d{10,15}$/.test(phone)) {
                    console.log(`✅ Extracted phone from participant: ${phone}`);
                    return phone;
                }
            }

            // Check remoteJid variations
            const remoteJid = chatData.lastMessage?.key?.remoteJid || chatData.remoteJid;
            if (remoteJid && remoteJid.includes('@s.whatsapp.net') && !remoteJid.includes('@lid')) {
                const phone = remoteJid.split('@')[0];
                if (/^\d{10,15}$/.test(phone)) {
                    console.log(`✅ Extracted phone from remoteJid: ${phone}`);
                    return phone;
                }
            }

            // Diagnostic logging for @lid contacts
            if (jid.includes('@lid')) {
                console.log('🔍 @lid contact metadata:', {
                    jid,
                    participant: chatData.lastMessage?.key?.participant,
                    remoteJid: chatData.lastMessage?.key?.remoteJid,
                    availableFields: Object.keys(chatData)
                });
            }
        }

        // Priority 3: Manual mapping from localStorage
        const manualPhone = this.getManualPhoneMapping(jid);
        if (manualPhone) {
            console.log(`✅ Using manual mapping: ${manualPhone}`);
            return manualPhone;
        }

        // Priority 4: No phone number found
        console.warn(`⚠️ Could not extract phone number for: ${jid}`);
        return null;
    }

    async ensurePhoneNumber(jid, chatData = null) {
        // 1. Try synchronous extraction first (Fastest)
        let phoneNumber = this.extractPhoneNumber(jid, chatData);
        if (phoneNumber) return phoneNumber;

        // 2. If valid chatData exists, try scanning its history via API
        if (chatData || jid) {
            console.log(`🕵️ Smart Scan: Searching phone number for ${jid}...`);

            // Fetch last 50 messages to find a participant
            const messages = await this.fetchMessages(jid);
            if (messages && messages.length > 0) {
                for (const msg of messages) {
                    const participant = msg.key?.participant || msg.participant;
                    const remoteJid = msg.key?.remoteJid || msg.remoteJid;

                    // Check if it's a valid phone JID
                    const potential = [participant, remoteJid].find(p => p && p.includes('@s.whatsapp.net') && !p.includes('@lid'));

                    if (potential) {
                        const extracted = potential.split('@')[0];
                        if (/^\d{10,15}$/.test(extracted)) {
                            console.log(`✅ Smart Scan FOUND: ${extracted} in message from ${new Date(msg.messageTimestamp * 1000).toLocaleString()}`);

                            // Auto-save the mapping!
                            this.setManualPhoneMapping(jid, extracted);
                            return extracted;
                        }
                    }
                }
            } else {
                console.log(`🕵️ Smart Scan: No messages found for ${jid}`);
            }

            // 3. DEEP HUNT: Search Address Book by Name (Last Resort)
            const targetName = (chatData?.name || chatData?.pushName || chatData?.verifiedName);
            if (targetName) {
                console.log(`🕵️ Deep Hunt: Searching Address Book for "${targetName}"...`);
                try {
                    const contacts = await this.fetchContacts();
                    if (Array.isArray(contacts)) {
                        const cleanName = (n) => String(n || "").toLowerCase().trim();
                        const searchName = cleanName(targetName);

                        const match = contacts.find(c => {
                            const cName = cleanName(c.name || c.pushName);
                            return cName === searchName && c.id && c.id.includes('@s.whatsapp.net') && !c.id.includes('@lid');
                        });

                        if (match) {
                            const extracted = match.id.split('@')[0];
                            console.log(`✅ Deep Hunt FOUND via Contact Name: ${extracted}`);
                            this.setManualPhoneMapping(jid, extracted);
                            return extracted;
                        }
                    }
                } catch (e) {
                    console.error("Deep Hunt Error:", e);
                }
            }
        }

        // 4. FINAL FALLBACK: Blind Send (Return the LID/JID itself)
        if (jid) {
            console.warn(`⚠️ All resolution strategies failed for ${jid}. Using Raw JID for Blind Send.`);
            return jid; // Return the LID so Evolution API tries to send anyway
        }

        return null;
    }

    async sendMessage(jid, text, chatData = null) {
        const { instanceName, chats } = useStore.getState();
        if (!instanceName || !jid || !text) return null;

        // Fetch complete chat data from store if not provided
        if (!chatData && chats) {
            chatData = chats.find(c => (c.id === jid || c.remoteJid === jid || c.jid === jid));
            console.log('📦 Fetched chat data from store:', chatData ? 'Found' : 'Not found', jid);
        }

        // CRITICAL: Extract phone number with Smart Scan Fallback
        const phoneNumber = await this.ensurePhoneNumber(jid, chatData);

        if (!phoneNumber) {
            return {
                error: true,
                message: `❌ Número de telefone não encontrado nem no histórico.\n\nClique no ícone de edição (✏️) ao lado do nome para adicionar o número manualmente.`,
                needsPhoneNumber: true,
                jid: jid
            };
        }

        const result = await this.request(`/message/sendText/${instanceName}`, 'POST', {
            number: phoneNumber,
            text: text
        });

        // Check for "number doesn't exist" error
        if (result?.response?.message?.[0]?.exists === false) {
            return {
                error: true,
                message: `Número ${phoneNumber} não existe no WhatsApp ou não está acessível.`
            };
        }

        return result;
    }

    async sendMedia(jid, file, caption = '', isAudio = false) {
        const { instanceName } = useStore.getState();
        if (!instanceName || !jid || !file) return null;

        try {
            const cleanJid = this.standardizeJid(jid);
            if (!cleanJid) return null;

            // Convert file to base64
            const base64 = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => {
                    const result = reader.result;
                    // Remove the data:*/*;base64, prefix
                    const base64String = result.split(',')[1];
                    resolve(base64String);
                };
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });

            // Determine media type
            let mediatype = 'document';
            if (isAudio || file.type.startsWith('audio/')) mediatype = 'audio'; // Evolution treats 'audio' -> PTT usually
            else if (file.type.startsWith('image/')) mediatype = 'image';
            else if (file.type.startsWith('video/')) mediatype = 'video';

            const payload = {
                number: cleanJid,
                mediatype,
                mimetype: file.type || 'audio/mp4',
                caption: caption || file.name,
                fileName: file.name,
                media: base64
            };

            // If it's a PTT audio, use appropriate endpoint/body if needed, but sendMedia usually handles it by type 'audio'
            // Evolution API v2: "audio" mediatype often implies PTT if mimetype is audio/ogg; codecs=opus

            return await this.request(`/message/sendMedia/${instanceName}`, 'POST', payload);
        } catch (e) {
            console.error("Send Media Error:", e);
            return null;
        }
    }
}

export default new WhatsAppService();

```

---

## File: src/store/useStore.js
```js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Helper to extract number from JID for safe comparison
const getNum = (jid) => String(jid || "").split('@')[0].replace(/\D/g, '');

export const useStore = create(
    persist(
        (set, get) => ({
            apiUrl: import.meta.env.VITE_API_URL || 'https://api.voxeflow.com',
            apiKey: import.meta.env.VITE_API_KEY || 'Beatriz@CB650',
            instanceName: import.meta.env.VITE_INSTANCE_NAME || 'VoxeFlow',
            briefing: '', // V7: Start empty to trigger interactive briefing
            knowledgeBase: [
                {
                    id: 1707410001,
                    q: "Para começarmos: Qual o nome da sua empresa e o que exatamente vocês fazem?",
                    a: "Impar Odonto, somos uma clínica odontológica",
                    analysis: "Posicionamento claro. O nome 'Impar' sugere exclusividade e excelência. A IA adotará um tom profissional e acolhedor, reforçando a autoridade da clínica como referência em odontologia."
                },
                {
                    id: 1707410002,
                    q: "Qual é o endereço da Impar Odonto?",
                    a: "Avenida Amazonas, 1021 no Centro de Betim, Minas Gerais",
                    analysis: "Localização central estratégica. A IA destacará a conveniência e facilidade de acesso ao mencionar o endereço, usando 'Centro de Betim' como âncora de valor e referência conhecida."
                },
                {
                    id: 1707410003,
                    q: "Quais são os principais serviços e tratamentos oferecidos pela Impar Odonto?",
                    a: "Fazemos todos os tipos de tratamentos, desde odontopediatria a Implantes dentários, incluindo, clareamento, extraçao, protese, Invisalign (alinhadores) canal, etc",
                    analysis: "Portfólio 'Full Service'. A IA fará cross-selling inteligente (ex: sugerir clareamento após limpeza). A menção a 'Invisalign' e 'Implantes' indica foco em ticket médio alto e tecnologia."
                },
                {
                    id: 1707410004,
                    q: "Quais são os principais diferenciais da Impar Odonto em relação a outras clínicas odontológicas?",
                    a: "Somos uma clinica nova em Betim, e o ambiente é bem clean, diferenciado, estamos no terreo e possuimos estacionamento proprio.",
                    analysis: "Acessibilidade e Modernidade são pilares. 'Térreo' e 'Estacionamento' são argumentos fortes para conversão. 'Clean' e 'Nova' sugerem higiene e tecnologia de ponta, gerando confiança imediata."
                },
                {
                    id: 1707410005,
                    q: "Quais são os horários de funcionamento da Impar Odonto?",
                    a: "Segunda a Sexta, de 09h até as 18h e sabado de 09h ate as 12h.",
                    analysis: "Horário comercial padrão. A IA gerenciará expectativas fora desse horário, sugerindo agendamento para o próximo dia útil ou capturando o lead para retorno prioritário da equipe."
                },
                {
                    id: 1707410006,
                    q: "Vocês oferecem algum tipo de garantia ou acompanhamento pós-tratamento para os pacientes?",
                    a: "Garantia de 1 ano, e sempre acompanhamos nossos pacientes, acreditamos que dessa forma, estreitamos os laços e criamos conexao com nossos pacientes.",
                    analysis: "A 'Garantia de 1 ano' é um diferencial poderoso de confiança (Risk Reversal). O foco em 'conexão' define a personalidade da IA: empática, cuidadosa e relacional, não apenas transacional."
                },
                {
                    id: 1707410007,
                    q: "Vocês oferecem algum tipo de plano de pagamento ou financiamento para facilitar o acesso aos tratamentos?",
                    a: "Trabalhamos com pagamento em dinheiro, pix, cartao de debito e dividimos em ate 24 vezes sem juros. Pretendemos expandir nossas formas de pagamento e aceitar boletos em um futuro breve.",
                    analysis: "Flexibilidade financeira agressiva (24x sem juros) é um grande facilitador. A IA usará isso para quebrar objeções de preço, focado no que existe hoje (Cartão/Pix) para fechar vendas."
                },
                {
                    id: 1707410008,
                    q: "Quais são as principais preocupações ou dúvidas que seus pacientes costumam ter antes de iniciar um tratamento na Impar Odonto?",
                    a: "A maioria quer saber sobre preço. (ESTRATÉGIA: Podemos passar médias. Ex: Protocolos a partir de R$ 300,00 a R$ 600,00 na manutenção, ou valores de referência se perguntarem. O importante é não perder o lead por falta de informação, mas sempre tentar agendar).",
                    analysis: "Flexibilidade Tática. A IA usará 'Preço de Referência' (ex: 'a partir de') para qualificar o lead sem assustar. Se o valor for ok para o cliente, o agendamento é quase certo."
                },
                {
                    id: 1707410009,
                    q: "Vocês oferecem consultas de avaliação gratuitas ou algum tipo de desconto para novos pacientes?",
                    a: "Sim, oferecemos a consulta de avaliaçao como cortesia para que eles possam conhecer nossa estrutura e nossos excelentes profissionais",
                    analysis: "Isca perfeita (Lead Magnet). A 'Avaliação Cortesia' será o Call-to-Action (CTA) principal. O objetivo da conversa será agendar essa visita para o cliente conhecer a estrutura 'clean'."
                },
                {
                    id: 1707410010,
                    q: "Vocês têm alguma parceria com planos de saúde ou convênios odontológicos?",
                    a: "Não trabalhamos com covenios, preferimos trabalhar com materiais de primeira linha, o que não seria possivel se atendêssemos convenios.",
                    analysis: "Posicionamento Premium. A IA justificará a ausência de convênios com a qualidade superior dos materiais. 'Não atendemos convênio, atendemos você com o melhor que existe.'"
                }
            ], // v1.2.3: Structured Q&A for the Knowledge Dashboard
            ragSources: [
                { id: 1, name: 'Tabela de Preços - Invisalign', keywords: ['preço', 'valor', 'quanto', 'invisalign'], content: 'O Invisalign Lite começa em R$ 8.000. O Full em R$ 12.000. Parcelamos em 12x sem juros.' },
                { id: 2, name: 'Protocolo Ortodontia', keywords: ['aparelho', 'ferrinho', 'orto', 'manutenção'], content: 'Manutenção mensal de R$ 150. Documentação ortodôntica inclusa no fechamento.' },
                { id: 3, name: 'Implantes Dentários', keywords: ['implante', 'dente', 'parafuso', 'dentadura'], content: 'Trabalhamos com Implantes Straumann (Suíços). Avaliação inicial inclui escaneamento 3D.' }
            ], // AURA v8: RAG Specialist Agents

            isConnected: false,
            currentView: 'dashboard',
            chats: [],
            activeChat: null,
            messages: [],
            lastFetchedJid: null,

            // CRM State - AURA Gold Palette
            tags: [
                { id: 'novo', name: 'Novo Lead', icon: '🆕', color: '#C5A059' },
                { id: 'qualificado', name: 'Qualificado', icon: '✅', color: '#d4af6a' },
                { id: 'proposta', name: 'Proposta Enviada', icon: '📋', color: '#af8a43' },
                { id: 'agendado', name: 'Agendado', icon: '📅', color: '#c09850' },
                { id: 'fechado', name: 'Fechado', icon: '💰', color: '#e0c080' },
                { id: 'perdido', name: 'Perdido', icon: '❌', color: '#8a6d3a' }
            ],
            chatTags: {}, // { chatId: tagId }
            chatNextSteps: {}, // { chatId: { steps: [], priority: '', reasoning: '' } }

            setConfig: (config) => set((state) => ({ ...state, ...config })),
            setChats: (chats) => {
                console.log(`AURA: Updating store with ${chats?.length || 0} chats`);
                set({ chats });
            },

            setActiveChat: (chat) => {
                console.log("AURA: Setting active chat:", chat?.id);
                set({ activeChat: chat, messages: [], lastFetchedJid: null });
            },

            clearMessages: () => set({ messages: [], lastFetchedJid: null }),

            setMessages: (jid, messages) => {
                const currentActive = get().activeChat;
                if (!currentActive) return;

                const activeJid = currentActive.id || currentActive.remoteJid;

                // Use numbers-only comparison for maximum safety
                if (getNum(activeJid) === getNum(jid)) {
                    console.log(`AURA: Updating messages for ${jid} (${messages?.length || 0} msgs)`);
                    set({ messages, lastFetchedJid: jid });
                } else {
                    console.warn(`AURA: Blocked message leak from ${jid} to ${activeJid}`);
                }
            },

            setIsConnected: (isConnected) => set({ isConnected }),
            setCurrentView: (view) => set({ currentView: view }),

            // FINAL GHOST FIX: Centralized view switching with guaranteed cleanup
            switchView: (viewName) => {
                console.log(`AURA: Switching view to ${viewName}, clearing active state`);
                set({
                    currentView: viewName,
                    activeChat: null,
                    messages: [],
                    lastFetchedJid: null
                });
            },

            // ACTION: Logout and Clear State
            logout: () => {
                console.log('AURA: Logging out and clearing data...');
                set({
                    isConnected: false,
                    chats: [],
                    messages: [],
                    activeChat: null,
                    lastFetchedJid: null,
                    chatTags: {}, // Optional: keep tags or clear? Better clear for privacy.
                    chatNextSteps: {}
                });
                localStorage.removeItem('auth_token');
                localStorage.removeItem('aura-storage'); // Nuke state persistence
            },

            // CRM Actions
            setTag: (chatId, tagId) => set(state => ({
                chatTags: { ...state.chatTags, [chatId]: tagId }
            })),

            setKnowledgeBase: (knowledgeBase) => set({ knowledgeBase }),

            setNextSteps: (chatId, data) => set(state => ({
                chatNextSteps: { ...state.chatNextSteps, [chatId]: data }
            })),

            getChatsWithTag: (tagId) => {
                const state = get();
                return state.chats.filter(c => {
                    const jid = c.remoteJid || c.jid || c.id;
                    return state.chatTags[jid] === tagId;
                });
            },
        }),
        {
            name: 'aura-storage',
            // PERSIST chats so they don't disappear on refresh
            partialize: (state) => ({
                apiUrl: state.apiUrl,
                apiKey: state.apiKey,
                instanceName: state.instanceName,
                briefing: state.briefing,
                knowledgeBase: state.knowledgeBase,
                ragSources: state.ragSources,
                currentView: state.currentView,
                chats: state.chats,
                chatTags: state.chatTags, // Persist tags
                chatNextSteps: state.chatNextSteps // Persist AI suggestions
            }),
        }
    )
);

```

---

## File: src/utils/formatter.js
```js
export const formatJid = (jid) => {
    if (!jid) return '';
    const raw = String(jid);

    // Handle @lid (Linked ID)
    if (raw.includes('@lid')) {
        const idPart = raw.split('@')[0];
        // Only attempt phone formatting if it's likely a real number mapped to a JID
        // Otherwise, return as a clean ID string to avoid "+42" misidentification
        return idPart;
    }

    const number = raw.split('@')[0].replace(/\D/g, '');

    // Brazilian Numbers (55...)
    if (number.startsWith('55')) {
        let ddd = number.slice(2, 4);
        let part = number.slice(4);

        // Add 9th digit if missing (common in old WA JIDs for Brazilian mobile)
        // Mobile numbers in Brazil have 11 digits (DDD + 9 + 8 digits)
        // If we only have 10 digits after '55' (DDD + 8 digits), it's likely missing the 9
        if (part.length === 8) {
            part = '9' + part;
        }

        if (part.length === 9) {
            return `(${ddd}) ${part.slice(0, 5)}-${part.slice(5)}`;
        }

        if (part.length === 8) {
            return `(${ddd}) ${part.slice(0, 4)}-${part.slice(4)}`;
        }
    }

    // Default formatting for other numbers
    if (number.length > 10) {
        return `+${number.slice(0, 2)} ${number.slice(2, 4)} ${number.slice(4, 9)}-${number.slice(9)}`;
    }

    return number;
};

```

---

## File: vite.config.js
```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})

```

---

