# Levy Têxtil - Sistema de Gestão de Estoque - TODO

## Autenticação e Usuários
- [x] Implementar sistema de autenticação com Manus OAuth
- [x] Criar tabela de usuários com perfis (admin/funcionário)
- [x] Implementar controle de acesso por perfil
- [x] Criar página de login e logout
- [x] Implementar persistência de sessão

## Gestão de Artigos
- [x] Criar tabela de artigos (código, nome, preços, categoria, largura, rendimento)
- [x] Implementar CRUD de artigos (create e list)
- [x] Criar tabela de subgrupos (cor, lote, metragem, localização)
- [x] Implementar CRUD de subgrupos (create e getByArtigoId)
- [x] Criar página de gestão de artigos
- [x] Implementar busca e filtros por categoria

## Controle de Estoque
- [x] Criar tabela de entradas de estoque
- [ ] Implementar registro de entradas (fornecedor, NF, data, valores)
- [x] Criar tabela de saídas de estoque
- [ ] Implementar registro de saídas (cliente, romaneio, frete, transportadora)
- [x] Criar tabela de histórico de movimentações
- [x] Implementar consulta de estoque em tempo real
- [ ] Implementar cálculo de saldo de estoque

## Interface e Funcionalidades
- [x] Criar página de consulta de estoque com filtros
- [x] Implementar busca por código/nome
- [ ] Criar página de histórico de movimentações
- [ ] Implementar filtros por data e categoria
- [ ] Criar geração de relatórios em PDF
- [ ] Implementar tabela de preços em PDF
- [x] Criar dashboard com resumo de estoque
- [ ] Implementar sistema de backup automático

## Design e Responsividade
- [x] Definir paleta de cores roxo Levy Têxtil
- [x] Implementar layout responsivo (desktop, tablet, celular)
- [x] Criar componentes reutilizáveis
- [x] Implementar navegação principal
- [x] Implementar sidebar de navegação
- [ ] Testar responsividade em múltiplos dispositivos

## Testes e Qualidade
- [x] Escrever testes unitários para procedures
- [ ] Testar fluxos de autenticação
- [ ] Testar CRUD de artigos
- [ ] Testar movimentações de estoque
- [ ] Testar geração de relatórios
- [ ] Validar performance em produção

## Controle de Acesso por Perfil
- [x] Implementar middleware de autorização para procedures tRPC
- [x] Criar adminProcedure para funcionalidades exclusivas de admin
- [x] Criar funcionarioProcedure para funcionalidades exclusivas de funcionário
- [x] Proteger rotas de admin no frontend
- [x] Proteger rotas de romaneio no frontend
- [x] Criar navegação dinâmica baseada no perfil do usuário

## Módulo de Romaneio (Funcionário)
- [x] Criar página de Romaneio com consulta de estoque
- [x] Implementar registro de saídas (cliente, romaneio, frete, transportadora)
- [ ] Implementar histórico de saídas do funcionário
- [ ] Gerar relatório de saídas em PDF

## Deployment
- [ ] Configurar variáveis de ambiente
- [ ] Realizar checkpoint final
- [ ] Publicar aplicação
