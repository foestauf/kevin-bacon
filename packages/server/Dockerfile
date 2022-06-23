FROM node:16.14.0 AS builder

# Create app directory
WORKDIR /app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./
COPY tsconfig*.json ./

# Install app dependencies
RUN npm install

# COPY . .

RUN npm run build

FROM node:16.14.0

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/tsconfig*.json ./
# COPY --from=builder /app/dist ./dist
RUN ls -al

EXPOSE 3000
CMD [ "npm", "run", "dev" ]