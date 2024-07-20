import React from "react";
import ValorFormatado from "@/components/ValorFormatado";
import Botao from "@/components/Botao";
import { useNavigate } from "react-router-dom";
import { useCarrinhoContext } from "../../../hooks/useCarrinhoContext";

const TotalCarrinho = () => {
  const navigate = useNavigate();
  const { valorTotal } = useCarrinhoContext();

  return (
    <div className="d-flex flex-column gap-3">
      <div className="d-flex flex-row justify-content-between">
        <p className="verde-limao m-0">Total</p>
        <ValorFormatado valor={valorTotal} />
      </div>
      <div className="d-flex flex-column flex-md-row gap-2 mx-1 mx-lg-0 justify-content-between justify-content-md-evelyn">
        <Botao
          onClick={() => navigate("/carrinho")}
          variant="primary"
          className="border-0 w-100"
        >
          Finalizar compra
        </Botao>
      </div>
    </div>
  );
};

export default TotalCarrinho;
