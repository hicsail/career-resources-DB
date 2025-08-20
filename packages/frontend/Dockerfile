# Build stage
FROM node:18 AS build
WORKDIR /app

# Accept build-time env variables
ARG VITE_API_BASE_URL
ARG VITE_SAIL_PROJECT_ID
ARG VITE_SAIL_AUTH_CLIENT
ARG VITE_ENV

ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
ENV VITE_SAIL_PROJECT_ID=${VITE_SAIL_PROJECT_ID}
ENV VITE_SAIL_AUTH_CLIENT=${VITE_SAIL_AUTH_CLIENT}
ENV VITE_ENV=${VITE_ENV}

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine AS prod
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]