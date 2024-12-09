require('dotenv').config();
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const userRoutes = require("./routes/userRoutes");
app.use("/api", userRoutes);

// Use a porta da variável de ambiente ou padrão 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
