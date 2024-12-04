"use client";

import { useState } from "react";

export default function Home() {
  const [svgInput, setSvgInput] = useState<string>("");
  const [jsxOutput, setJsxOutput] = useState<string | null>(null);
  const [error, setError] = useState<boolean>(false);

  const convertSvgToJsx = (svg: string) => {
    try {
      const parser = new DOMParser();
      const svgDocument = parser.parseFromString(svg, "image/svg+xml");
      const svgElement = svgDocument.querySelector("svg");

      if (!svgElement) {
        setError(true);
        return;
      }

      const width = svgElement.getAttribute("width") || "auto";
      const height = svgElement.getAttribute("height") || "auto";
      const viewBox = svgElement.getAttribute("viewBox") || "0 0 24 24";

      const paths = Array.from(svgElement.querySelectorAll("path")).map(
        (path) => {
          const d = path.getAttribute("d");
          const fillRule = path.getAttribute("fill-rule") || "nonzero";
          const clipRule = path.getAttribute("clip-rule") || undefined;
          return `<Path d="${d}" fillRule="${fillRule}" ${
            clipRule ? `clipRule="${clipRule}"` : ""
          } />`;
        }
      );

      const jsx = `
import Svg, { Path } from 'react-native-svg';

export const IconComponent: React.FC = () => {
  return (
    <Svg width="${width}" height="${height}" viewBox="${viewBox}">
      ${paths.join("\n      ")}
    </Svg>
  );
};
      `;

      setJsxOutput(jsx.trim());
    } catch (error) {
      console.error("Erro ao converter SVG:", error);
      setJsxOutput("Erro ao processar o SVG. Verifique o texto fornecido.");
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value;
    setSvgInput(value);
    if (value.trim()) {
      convertSvgToJsx(value);
    } else {
      setJsxOutput(null);
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ textAlign: "center", fontSize: 24 }}>
        Super Mega Conversor de SVG para Componente React
      </h1>
      <div
        style={{
          display: "flex",
          height: "80vh",
          padding: 24,
          justifyContent: "space-between",
        }}
      >
        <div style={{ width: "40vw" }}>
          <p>Cole abaixo o conteúdo do seu arquivo SVG:</p>
          {error && (
            <p style={{ color: "red" }}>
              O conteúdo fornecido não é um SVG válido. Verifique o texto
              fornecido e tente novamente.
            </p>
          )}
          <textarea
            value={svgInput}
            onChange={handleInputChange}
            placeholder="<svg>...</svg>"
            style={{
              width: "100%",
              height: "70vh",
              marginBottom: "1rem",
              fontFamily: "monospace",
              fontSize: "14px",
              padding: "0.5rem",
              backgroundColor: "#969191",
              color: "black",
              borderRadius: 8,
            }}
          />
        </div>
        <div style={{ width: "40vw" }}>
          {jsxOutput && (
            <>
              <h2>Componente React Gerado:</h2>
              <pre
                style={{
                  background: "#f4f4f4",
                  width: "100%",
                  padding: "1rem",
                  height: "70vh",
                  borderRadius: "8px",
                  overflowX: "auto",
                  backgroundColor: "grey",
                }}
              >
                {jsxOutput}
              </pre>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
