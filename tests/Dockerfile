FROM cypress/included:8.4.1
RUN npm install
RUN npm install --save-dev typescript
COPY . .
CMD ["cypress", "run"]