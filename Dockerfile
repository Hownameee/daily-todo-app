# Stage 1: Build environment
FROM node:22-alpine AS build
WORKDIR /app
COPY . .
RUN npm i
RUN npm run build
RUN npm install --omit=dev --ignore-scripts

# Stage 2: Production environment
FROM node:22-alpine
WORKDIR /app
COPY --from=build /app/backend/node_modules ./backend/node_modules
COPY --from=build /app/backend/dist ./backend/dist
COPY --from=build /app/package.json .

EXPOSE 4000
CMD ["npm", "start"]