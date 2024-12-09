import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./Login.css";

interface LoginFormData {
  email: string;
  password: string;
}

export default function Login() {
  const { register, handleSubmit } = useForm<LoginFormData>();
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    try {
      const response = await api.post("/login", data);
      const { token } = response.data;

      // Salvar o token no localStorage
      localStorage.setItem("token", token);

      navigate("/imc-calculator"); // Redirecionar para a calculadora de IMC
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      alert("Credenciais inválidas. Tente novamente.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Bem-vindo ao <span>BalançoSaúde</span></h1>
        <form onSubmit={handleSubmit(onSubmit)} className="login-form">
          <div className="form-group-login">
            <label htmlFor="email">E-mail</label>
            <input
              className="input-form-login"
              type="email"
              id="email"
              {...register("email", { required: true })}
              placeholder="Digite seu e-mail"
            />
          </div>
          <div className="form-group-login">
            <label htmlFor="password">Senha</label>
            <input
              className="input-form-login"
              type="password"
              id="password"
              {...register("password", { required: true })}
              placeholder="Digite sua senha"
            />
          </div>
          <button type="submit" className="login-button">Entrar</button>
        </form>
        <p className="register-link">
          Não tem uma conta?{" "}
          <span onClick={() => navigate("/register")}>Crie uma</span>
        </p>
      </div>
    </div>
  );
}
