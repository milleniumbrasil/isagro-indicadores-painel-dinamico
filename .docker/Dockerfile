# Etapa 1: Build da aplicação React usando Node.js
FROM node:18-alpine AS build

# Cria um diretório de trabalho
WORKDIR /app

# Copia os arquivos de dependências
COPY package.json package-lock.json ./

# Instala as dependências
RUN npm install

# Copia o restante do código da aplicação
COPY . .

# Executa o build da aplicação
RUN npm run build

# Etapa 2: Servindo os arquivos com Nginx
FROM nginx:alpine

# Copia os arquivos de build da etapa anterior
COPY --from=build /app/build /usr/share/nginx/html

# Expõe a porta 80 para o Nginx
EXPOSE 80

# Inicia o servidor Nginx
CMD ["nginx", "-g", "daemon off;"]
