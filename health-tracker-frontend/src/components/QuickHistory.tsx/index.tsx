import React from "react";
import './QuickHistory.css';

export default function QuickHistory({
    data,
  }: {
    data: { treino: number; alimentacao: string; obstaculos: string };
  }) {
    return (
      <div className="quick-history-widget">
        <h4>Resumo da Última Semana</h4>
        <ul>
          <li>
            <span className="label">Dias de Treino:</span>
            <span className="value">{data.treino}</span>
          </li>
          <li>
            <span className="label">Alimentação:</span>
            <span className="value">{data.alimentacao}</span>
          </li>
          <li>
            <span className="label">Obstáculos:</span>
            <span className="value">{data.obstaculos}</span>
          </li>
        </ul>
      </div>
    );
  }