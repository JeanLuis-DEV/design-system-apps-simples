# DESIGN SYSTEM APPS SIMPLES

Este projeto é a biblioteca oficial de interface da família Apps Simples.

Os aplicativos não devem copiar ou recriar componentes que já existam nesta biblioteca.

## Objetivo

Centralizar:

- tokens visuais
- cores
- tipografia
- espaçamentos
- componentes reutilizáveis
- comportamentos comuns de interface
- regras de acessibilidade

## Regras

- Não implementar funcionalidades específicas de aplicativos.
- Não incluir regras de negócio.
- Não incluir lógica do App Barato, Diluição Simples ou qualquer outro aplicativo.
- Componentes devem ser reutilizáveis e genéricos.
- Reutilizar tokens existentes antes de criar novos valores.
- Não adicionar dependências sem necessidade real.
- Manter compatibilidade com React + TypeScript.
- Preservar acessibilidade.
- Evitar APIs de componentes excessivamente complexas.
- Alterações que possam quebrar aplicativos consumidores devem ser tratadas como mudança incompatível de versão.
- Correções e novas funcionalidades devem respeitar o versionamento da biblioteca.