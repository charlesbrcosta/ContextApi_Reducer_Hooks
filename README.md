# ContextAPI, Reducer e Hooks

## Carrinho de Compras

O objetivo deste projeto não foi desenvolver uma aplicação completa, mas sim focar na criação e implementação da Context API CarrinhoContext.jsx, do hook personalizado useCarrinhoContext, e dos reducers carrinhoReducer.js.

## :dizzy: Tecnologias utilizadas

<div>
  <img width="40" src="./public/icons/React-Dark.svg">
  <img width="40" src="./public/icons/vite.svg">
  <img width="40" src="./public/icons/JavaScript.svg">
</div>

## :bricks: Estrutura do Projeto

### 1. Context API: CarrinhoContext.jsx
O CarrinhoContext foi criado para fornecer um contexto global para o carrinho de compras, evitando a necessidade de passar props manualmente por diversos níveis da árvore de componentes. Este contexto mantém o estado do carrinho e calcula a quantidade total de itens e o valor total do carrinho.

```js
import { createContext, useEffect, useMemo, useReducer, useState } from "react";
import { carrinhoReducer } from "../reducers/carrinhoReducer";

export const CarrinhoContext = createContext();
CarrinhoContext.displayName = 'Carrinho';

const estadoInicial = [];

export const CarrinhoProvider = ({ children }) => {
    const [carrinho, dispatch] = useReducer(carrinhoReducer, estadoInicial);
    const [quantidade, setQuantidade] = useState(0);
    const [valorTotal, setValorTotal] = useState(0);

    const { totalTemp, quantidadeTemp } = useMemo(() => {
        return carrinho.reduce(
            (acumulador, produto) => ({ 
                quantidadeTemp: acumulador.quantidadeTemp + produto.quantidade,
                totalTemp: acumulador.totalTemp + produto.preco * produto.quantidade,            
        }),
            {
                quantidadeTemp: 0,  
                totalTemp: 0,
            }          
        );
        
    }, [carrinho]);
    
    useEffect(() => {
        setQuantidade(quantidadeTemp);
        setValorTotal(totalTemp);   
    }, [totalTemp, quantidadeTemp]);

    return(      
        <CarrinhoContext.Provider 
            value={{ 
                carrinho,
                dispatch, 
                quantidade,  
                valorTotal, 
            }}
        >
            {children}
        </CarrinhoContext.Provider>
    );
}
```

### 2. Hook Personalizado: useCarrinhoContext

O hook useCarrinhoContext encapsula a lógica de manipulação do carrinho, proporcionando uma interface simplificada para os componentes. Ele facilita a adição e remoção de produtos, bem como a alteração da quantidade de itens no carrinho.

```js
import { useContext } from "react";
import { CarrinhoContext } from "@/context/CarrinhoContext";
import { ADD_PRODUTO, REMOVE_PRODUTO, UPDATE_QUANTIDADE } from '../reducers/carrinhoReducer';

const addProdutoAction = (novoProduto) => ({
    type: ADD_PRODUTO,
    payload: novoProduto,
});

const removeProdutoAction = (produtoId) => ({
    type: REMOVE_PRODUTO,
    payload: produtoId,
});

const updateQuantidadeAction = (produtoId, quantidade) => ({
    type: UPDATE_QUANTIDADE,
    payload: { produtoId, quantidade },
});

export const useCarrinhoContext = () => {
    const { carrinho, dispatch, quantidade, valorTotal } = useContext(CarrinhoContext);

    function adicionarProduto(novoProduto) {
        dispatch(addProdutoAction(novoProduto));
    }

    function removerProduto(id) {
        const produto = carrinho.find((item) => item.id === id);
        if(produto && produto.quantidade > 1) {
            dispatch(updateQuantidadeAction(id, produto.quantidade - 1));
        } else {
            dispatch(removeProdutoAction(id));
        }
    }  

    function removerProdutoCarrinho(id) {
        dispatch(removeProdutoAction(id));
    }

    return {
        carrinho,
        adicionarProduto,
        removerProduto,
        removerProdutoCarrinho,
        valorTotal,
        quantidade,
    };
}
```

### 3. Reducer: carrinhoReducer.js

O carrinhoReducer é responsável por gerenciar o estado do carrinho de compras. Ele define as ações para adicionar produtos, remover produtos e atualizar a quantidade de itens.

```js
export const ADD_PRODUTO = "ADD_PRODUTO";
export const REMOVE_PRODUTO = "REMOVE_PRODUTO";
export const UPDATE_QUANTIDADE = "UPDATE_QUANTIDADE";

export const carrinhoReducer = (state, action) => {
    switch (action.type) {
        case ADD_PRODUTO:
            const novoProduto = action.payload;
            const produto = state.findIndex((item) => item.id === novoProduto.id);
            if (produto === -1) {
                novoProduto.quantidade = 1;
                return [...state, novoProduto];
            } else {
                return state.map((item, index) =>
                    index === produto
                        ? { ...item, quantidade: item.quantidade + 1 }
                        : item
                );
            }
        case REMOVE_PRODUTO:
            const produtoId = action.payload;
            return state.filter((item) => item.id !== produtoId);

        case UPDATE_QUANTIDADE:
            const { produtoId: id, quantidade } = action.payload;
            return state.map((item) =>
                item.id === id ? { ...item, quantidade } : item
            );

        default:
            return state;
    }
};
```
## :warning: Instalação

### :dvd: Passo a Passo

1. Clone o repositório:

   ```bash
   git clone https://github.com/charlesbrcosta/ContextApi_Reducer_Hooks.git
   cd ContextApi_Reducer_Hooks

2. Instale as dependências:
    ```bash
    npm install ou npm i

3. Inicie o servidor de desenvolvimento:
    ```bash
    npm run dev

## Conclusão

Este projeto demonstra a aplicação da Context API, hooks personalizados, e reducers em um cenário de carrinho de compras. A Context API CarrinhoContext evita o problema de prop drilling, o hook useCarrinhoContext encapsula a lógica do carrinho e facilita a interação com o estado, e o carrinhoReducer gerencia eficientemente as ações do carrinho.

## :handshake: Contribuição

Se você quiser contribuir com o projeto, siga os passos abaixo:

    Faça um fork deste repositório.
    Crie uma nova branch (git checkout -b feature/nova-feature).
    Faça commit das suas alterações (git commit -am 'Adiciona nova feature').
    Faça push para a branch (git push origin feature/nova-feature).
    Abra um Pull Request.

## :student: Autor

[<img loading="lazy" src="https://avatars.githubusercontent.com/u/48035699?v=4" width=115><br><sub>Charles Bruno</sub>](https://github.com/charlesbrcosta)


## :page_facing_up: Licença

Este projeto está licenciado sob a [Licença MIT](https://www.mit.edu/~amini/LICENSE.md).
