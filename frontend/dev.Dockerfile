FROM node:20

WORKDIR /app/frontend
COPY . .
RUN npm install
CMD ["npm", "run", "start"]
