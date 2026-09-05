# Design System Apps Simples

Biblioteca oficial de interface da família Apps Simples, em React + TypeScript e CSS.
Pacote: `@apps-simples/ui`, versão inicial `0.1.0`.
Os aplicativos devem reutilizar esta biblioteca em vez de copiar componentes.

Esta etapa contém somente a estrutura técnica. Os componentes ainda serão migrados
do App Base; a API pública em `src/index.ts` ainda não exporta componentes.
A instalação via Git/tag será configurada nas próximas etapas.

## Desenvolvimento e build

Requer Node.js `^20.19.0 || >=22.12.0`. As versões de React, React DOM,
TypeScript e Vite seguem as utilizadas pelo App Base atual.

```sh
npm install
npm run build
npm pack --dry-run
```

O build verifica os tipos, gera ESM em `dist/index.js` com Vite em Library Mode
e depois gera as declarações `.d.ts` em `dist/` com o próprio TypeScript
(`tsc -p tsconfig.build.json`). React, React DOM e seus subpaths são externos
ao bundle e declarados como `peerDependencies`.
O pacote inclui somente `dist/` e os metadados/documentação incluídos pelo npm.

## CSS

`src/styles/index.css` é a entrada de estilos, por enquanto sem regras visuais.
Ela é uma entrada independente no build, mantendo a API TypeScript mínima.
O Vite extrai o CSS para `dist/style.css`, exposto como `@apps-simples/ui/style.css`.
Quando a biblioteca for instalada, o aplicativo deverá importá-lo explicitamente:

```ts
import '@apps-simples/ui/style.css'
```

Não há injeção automática de CSS nem plugin adicional.
O campo `sideEffects` preserva os imports de CSS durante o tree shaking.
Referência: [Vite Library Mode](https://vite.dev/guide/build.html#library-mode).

## Versionamento semântico

- **PATCH:** correções compatíveis.
- **MINOR:** novos recursos/componentes compatíveis.
- **MAJOR:** mudanças incompatíveis.

Exemplo: `v1.0.0` → `v1.0.1` → `v1.1.0` → `v2.0.0`.
A série `0.x` identifica o desenvolvimento inicial da biblioteca.
Nenhuma publicação no npm Registry ou criação de tag faz parte desta etapa.
