FROM node:latest
WORKDIR /app
COPY package.json .
RUN npm
COPY . .
RUN npm build
CMD ["npm", "start"]