FROM node:lts-slim AS build

WORKDIR /app

COPY package.json yarn.lock ./
RUN corepack enable && yarn install --frozen-lockfile

COPY . ./
RUN yarn build

FROM nginx:stable-alpine AS final
EXPOSE 80
COPY --from=build /app/dist/ARCA-fe/browser /usr/share/nginx/html
