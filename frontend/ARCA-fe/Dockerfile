FROM node:lts-slim AS build
RUN npm install -g @angular/cli

COPY package.json ./
COPY yarn.lock ./
RUN yarn

COPY . ./
RUN ng build --configuration=production

FROM nginx:stable AS final
EXPOSE 80
COPY --from=build dist/ARCA-fe/browser  /usr/share/nginx/html
