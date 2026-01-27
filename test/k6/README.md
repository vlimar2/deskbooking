# Testes de Performance com K6

Este diretório contém testes de performance para a API Deskbooking usando K6.

## Estrutura

- **auth/** - Testes de performance para endpoints de autenticação (register, login)
- **desks/** - Testes de performance para endpoints de gestão de mesas (list, book)

## Configuração

### Pré-requisitos

1. K6 instalado na máquina local. Instale em: https://k6.io/docs/getting-started/installation/

### Executando os testes

Certifique-se de que a API está rodando (em outro terminal):

```bash
npm start
```

Depois, em outro terminal, execute os testes de performance:

```bash
# Testar autenticação
npm run perf:auth

# Testar desks
npm run perf:desks

# Testar tudo
npm run perf:all
```

## Configuração dos Testes

### Perfil de Carga

Todos os testes seguem o mesmo padrão de carga:

- **10s (Ramp up):** Aumenta de 0 para 10 usuários simultâneos
- **60s (Steady):** Mantém 30 usuários simultâneos
- **10s (Ramp down):** Reduz de 30 para 0 usuários

### Thresholds (Limites)

Cada teste deve atender aos seguintes critérios para passar:

- **P95 (95º percentil):** < 400ms
- **Taxa de erro:** < 10%

## Detalhes dos Testes

### Auth Performance (`auth-performance.js`)

Testa endpoints de autenticação:
- `POST /api/register` - Registra novos usuários
- `POST /api/login` - Realiza login

**Geração de dados únicos:**
- Usa timestamp + random string para criar emails únicos
- Evita conflitos quando múltiplos usuários executam testes simultaneamente

### Desks Performance (`desks-performance.js`)

Testa endpoints de gestão de mesas:
- `GET /api/desks` - Lista mesas disponíveis
- `POST /api/desks/book` - Reserva uma mesa

**Setup:**
- Cria um usuário de teste no setup
- Reutiliza o token durante toda a execução

## Métricas Coletadas

- `auth_duration` / `desk_duration` - Tempo de resposta das requisições
- `auth_failure_rate` / `desk_failure_rate` - Taxa de erros
- `user_counter` / `desk_request_counter` - Contadores de requisições

## Customizações

### Alterar URL base

```bash
k6 run test/k6/auth/auth-performance.js -e BASE_URL=http://seu-servidor.com
```

### Alterar número de usuários

Edite a seção `stages` nos scripts `.js` para customizar o padrão de carga.

### Alterar threshold

Modifique a seção `thresholds` nos scripts para mudar os limites de desempenho.

## Interpretando os Resultados

Após a execução, K6 mostra um relatório com:

- **http_requests** - Total de requisições e taxa
- **http_req_duration** - Estatísticas de tempo de resposta (min, max, avg, p95, p99)
- **http_req_failed** - Taxa de requisições falhadas

Uma execução bem-sucedida terá status **PASSED** se todos os thresholds forem atendidos.
