# Docker Instructions

## Build da Imagem

Para usar a URL padrão (http://localhost:8000):
```bash
docker build -t sia-flow-guide .
```

Para customizar a URL da API durante o build:
```bash
docker build --build-arg VITE_API_BASE_URL=http://localhost:3333 -t sia-flow-guide .
```

## Executar o Container

```bash
docker run -d -p 80:80 --name sia-flow-guide-app sia-flow-guide
```

**Importante:** A variável `VITE_API_BASE_URL` deve ser definida durante o **build** (usando `--build-arg`), não durante a execução do container.

## Acessar a Aplicação

Abra o navegador em: http://localhost

