FROM node:18-alpine3.19 AS build

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:18-alpine3.19

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/package.json ./package.json
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/prisma ./prisma
COPY --from=build /usr/src/app/build ./build

RUN npx prisma generate

EXPOSE 3333

CMD ["npm", "run", "start"]



