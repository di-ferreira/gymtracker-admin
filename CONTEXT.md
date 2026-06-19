# GymTracker Admin - Contexto do Projeto

## Descrição Geral

O `gymtracker-admin` é o painel de gerenciamento do ecossistema GymTracker. Ele é utilizado internamente para alimentar, organizar e gerenciar o catálogo completo de exercícios físicos que será consumido pelo aplicativo móvel.

## Escopo do Subprojeto

- **Gerenciamento do Catálogo:** Criação, edição e exclusão de exercícios.
- **Vínculo de Mídias:** Upload ou associação de URLs de GIFs e Vídeos demonstrativos.
- **Organização Estrutural:** Cadastro e categorização de Grupos Musculares e Grupos de Movimento.
- **Mapeamento de Substituições:** Configuração de quais exercícios podem substituir quais (relação n:n).
- **Controle de Versionamento:** Mecanismo para disparar ou incrementar a versão do catálogo, permitindo que a API notifique o cliente mobile sobre novas atualizações para sincronização offline.

## Filosofia de Desenvolvimento

- **Eficiência Operacional:** Interface limpa e otimizada para cadastro em massa.
- **Consistência de Dados:** Validações rigorosas antes de publicar novas versões (ex: garantir que um exercício substituto exista e tenha mídias).
- **Independência:** O admin lida estritamente com dados estruturais do catálogo. Não há gestão de usuários finais, treinos particulares ou assinaturas.

* **Eficiência Operacional:** Interface limpa e otimizada para cadastro em massa.
* **Consistência de Dados:** Validações rigorosas antes de publicar novas versões (ex: garantir que um exercício substituto exista e tenha mídias).
* **Independência:** O admin lida estritamente com dados estruturais do catálogo. Não há gestão de usuários finais, treinos particulares ou assinaturas.
