/* Se cambió a commonJS por un error de prisma con ESM debido a versiones */

// import express from 'express';
// import { PrismaClient } from '@prisma/client';

const express = require('express');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();

// get de prueba
app.get('/users', async (req, res) => {
  const users = await prisma.users.findMany();
  res.json(users);
});

app.listen(process.env.PORT || 4000, () => {
  console.log('Servidor escuchando en el puerto 4000');
});