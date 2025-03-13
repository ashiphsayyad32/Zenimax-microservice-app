FROM node:16-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Update the exposed port to 4000 to match the application configuration
EXPOSE 4000

CMD ["npm", "start"]
