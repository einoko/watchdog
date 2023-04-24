FROM node:lts-alpine
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
ENV NODE_ENV production
CMD ["npx", "serve", "-l", "3000", "-s", "build"]