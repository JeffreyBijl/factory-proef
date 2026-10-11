# Preview van het voorbeeldproject: Render bouwt dit bestand per PR.
# Render zet PORT; de server luistert daarop.
FROM node:22-slim
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY src ./src
COPY public ./public
USER node
CMD ["node", "src/server.js"]
