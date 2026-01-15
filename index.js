/* Se cambió a commonJS por un error de prisma con ESM debido a versiones */

// import express from 'express';
const app = require("./src/app");

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
