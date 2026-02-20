# Stage 1: Build environment
FROM node:22-alpine AS build
WORKDIR /app
COPY . .
RUN npm i
RUN npm run gen
RUN npm run build

# Stage 2: Production environment
FROM node:22-alpine
WORKDIR /app
COPY --from=build /app/backend/dist ./dist
COPY --from=build /app/backend/package.json .
RUN npm install --only=prod

EXPOSE 4000
CMD ["npm", "start"]
