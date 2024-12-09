import React from "react";
import "./Content.css";

export default function Content({ children }: { children:React.ReactNode}) {
  return (
      <div className="contentContainer">{children}</div>
  )
}
