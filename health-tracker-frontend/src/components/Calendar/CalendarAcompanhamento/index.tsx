import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./CustomCalendarAcompanhamento.css";
import api from "../../../services/api";

export default function CustomCalendarAcompanhamento() {
  const [checkInDates, setCheckInDates] = useState<Set<string>>(new Set());
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Você precisa estar logado para acessar esta página.");
      return;
    }
  
    api
      .get("/progress", { headers: { Authorization: `Bearer ${token}` } })
      .then((response) => {
        const dates = response.data.dates
          .map((date: string) => {
            try {
              if (!date) {
                console.warn("Data nula ou indefinida ignorada.");
                return null;
              }
              const normalizedDate = new Date(date);
              if (isNaN(normalizedDate.getTime())) {
                console.warn("Data inválida ignorada:", date);
                return null;
              }
              return normalizedDate.toISOString().split("T")[0];
            } catch (error) {
              console.error("Erro ao normalizar a data:", date, error);
              return null;
            }
          })
          .filter(Boolean); // Remove entradas nulas
        setCheckInDates(new Set(dates)); // Armazena como um conjunto
      })
      .catch((err) => console.error("Erro ao carregar progresso:", err));
  }, []);
  

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [year, month] = e.target.value.split("-").map(Number);
    setSelectedYear(year);
    setSelectedMonth(month - 1); // Ajuste para base 0
  };

  const getWeekDates = (date: Date): string[] => {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());
    return Array.from({ length: 7 }, (_, i) => {
      const currentDate = new Date(startOfWeek);
      currentDate.setDate(startOfWeek.getDate() + i);
      return currentDate.toISOString().split("T")[0];
    });
  };

  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view === "month") {
      const weekDates = getWeekDates(date);
      const isWeekWithCheckIn = weekDates.some((weekDate) => checkInDates.has(weekDate));
  
      if (isWeekWithCheckIn) {
        if (date.getDay() === 1) return "week-checkin-start";
        if (date.getDay() === 0) return "week-checkin-end";
        return "week-checkin";
      } else {
        if (date.getDay() === 1) return "week-missing-start";
        if (date.getDay() === 0) return "week-missing-end";
        return "week-missing";
      }
    }
    return null;
  };
  

  return (
    <div className="calendar-checkin-container">
      <div className="calendar-with-info">
        <div className="container-calendar">
          <Calendar tileClassName={tileClassName} />
        </div>
        <div className="info-card">
          <h2>Legenda</h2>
          <div className="circles-div">
            <div className="legend-item">
              <span className="circle blue"></span> Check-in Realizado
            </div>
            <div className="legend-item">
              <span className="circle red"></span> Check-in Faltante
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
