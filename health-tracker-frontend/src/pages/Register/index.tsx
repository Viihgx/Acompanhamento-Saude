import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./Register.css";

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  weight: number;
  height: number;
  receiveEmails: boolean;
  exercicios: string;
  alimentacao: string;
  obstaculos: string;
  objetivos: string;
  alcance: string;
}

export default function Register() {
  const { register, handleSubmit } = useForm<RegisterFormData>();
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<RegisterFormData> = async (data) => {
    try {
      await api.post("/register", data);
      navigate("/"); // Redireciona para a página de login
    } catch (error) {
      console.error("Erro ao registrar usuário:", error);
      alert("Erro ao registrar usuário.");
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h1 className="register-title">
          Bem-vindo ao <span>BalançoSaúde</span>
        </h1>
        <form className="register-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group-register">
            <label>Nome</label>
            <input
              type="text"
              className="input-form-register"
              placeholder="Digite seu nome"
              {...register("name", { required: true })}
            />
          </div>
          <div className="form-group-register">
            <label>E-mail</label>
            <input
              type="email"
              className="input-form-register"
              placeholder="Digite seu e-mail"
              {...register("email", { required: true })}
            />
          </div>
          <div className="form-group-register-fullwidth">
            <label>Senha</label>
            <input
              type="password"
              className="input-form-register"
              placeholder="Digite sua senha"
              {...register("password", { required: true })}
            />
          </div>
          <div className="form-group-register">
            <label>Peso (kg)</label>
            <input
              type="number"
              step="0.1"
              className="input-form-register"
              placeholder="Digite seu peso"
              {...register("weight", { required: true })}
            />
          </div>
          <div className="form-group-register">
            <label>Altura (m)</label>
            <input
              type="number"
              step="0.01"
              className="input-form-register"
              placeholder="Digite sua altura"
              {...register("height", { required: true })}
            />
          </div>
          <div className="form-group-register">
            <label>Dias de exercícios físicos nesta semana</label>
            <select {...register("exercicios", { required: true })}>
              <option value="0">Não pratiquei</option>
              <option value="1">1 a 2 dias</option>
              <option value="3">3 a 4 dias</option>
              <option value="5">5 ou mais dias</option>
            </select>
          </div>
          <div className="form-group-register">
            <label>Classificação da alimentação nesta semana</label>
            <select {...register("alimentacao", { required: true })}>
              <option value="muito-saudavel">Muito Saudável</option>
              <option value="saudavel">Saudável</option>
              <option value="moderada">Moderada</option>
              <option value="pouco-saudavel">Pouco Saudável</option>
              <option value="muito-ruim">Muito Ruim</option>
            </select>
          </div>
          <div className="form-group-register">
            <label>Obstáculos enfrentados nesta semana</label>
            <select {...register("obstaculos", { required: true })}>
              <option value="tempo">Falta de tempo</option>
              <option value="disposicao">Falta de disposição</option>
              <option value="renda">Falta de renda</option>
              <option value="disponibilidade">Falta de disponibilidade</option>
              <option value="nenhum">Não enfrentei obstáculos</option>
            </select>
          </div>
          <div className="form-group-register">
            <label>Objetivos para a próxima semana</label>
            <select {...register("objetivos", { required: true })}>
              <option value="frequencia">
                Aumentar a frequência de exercícios
              </option>
              <option value="alimentacao">
                Melhorar a qualidade da alimentação
              </option>
              <option value="reduzir-alimentos">
                Reduzir o consumo de alimentos não saudáveis
              </option>
            </select>
          </div>
          <div className="form-group-register">
            <label>Alcance do objetivo em relação à semana anterior</label>
            <select {...register("alcance", { required: true })}>
              <option value="completamente">Completamente</option>
              <option value="parcialmente">Parcialmente</option>
              <option value="pouco">Pouco</option>
              <option value="nada">Nada</option>
            </select>
          </div>
          <div className="form-group-register-checkbox">
            <div className="checkbox-group">
              <input
                type="checkbox"
                id="receiveEmails"
                className="input-checkbox"
                {...register("receiveEmails", { required: true })}
              />
              <label htmlFor="receiveEmails">
                Aceito receber e-mails semanais
              </label>
            </div>
          </div>
          <button className="register-button" type="submit">
            Registrar
          </button>
        </form>

        <p className="login-link">
          Já tem uma conta?{" "}
          <span onClick={() => navigate("/")}>Faça login</span>
        </p>
      </div>
    </div>
  );
}
