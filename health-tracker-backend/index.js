require('dotenv').config();
const express = require("express");
const cors = require("cors");

const app = express();

// Domínios permitidos
const allowedOrigins = [
  "https://acompanhamento-saude.vercel.app", // Front-end no Vercel
];

// Configuração do middleware CORS
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
}));

app.use(express.json());

const userRoutes = require("./routes/userRoutes");
app.use("/api", userRoutes);

// Use a porta da variável de ambiente ou padrão 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
