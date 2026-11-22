# RentSmart — Sistema de Orçamento de Locação

Aplicação desenvolvida em Python utilizando Programação Orientada a Objetos (POO) para automatizar o cálculo de orçamentos de locação e a projeção financeira anual da imobiliária **R.M Imóveis**.

## Funcionalidades
- Cálculo automatizado para **Apartamentos**, **Casas** e **Estúdios**.
- Aplicação de regras de adicionais (quartos e vagas de garagem) e desconto comercial (5% para apartamentos sem crianças).
- Separação clara entre o valor do aluguel mensal e o parcelamento (1x a 5x) da taxa contratual de R$ 2.000,00.
- Validação interativa das entradas do usuário no terminal.
- Exportação automática de planilha `.csv` com a projeção de pagamentos dos primeiros 12 meses.

## Estrutura de Classes (POO)
- `Imovel` (Classe Abstrata): Define a interface base (`calcular_aluguel_mensal` e `obter_detalhamento`).
- `Apartamento`: Implementa as regras de 1 ou 2 quartos (+R$ 200), garagem (+R$ 300) e desconto de 5% para clientes sem crianças.
- `Casa`: Implementa as regras de 1 ou 2 quartos (+R$ 250) e garagem (+R$ 300).
- `Estudio`: Implementa o pacote de estacionamento (R$ 250 para 2 vagas + R$ 60 por vaga adicional).
- `Orcamento`: Gerencia o parcelamento da taxa contratual (R$ 2.000 em até 5x), exibe o resumo formatado e exporta o arquivo CSV.

## Pré-requisitos
- Python 3.10 ou superior instalado (utiliza apenas bibliotecas padrão: `csv` e `abc`).

## Como Executar
1. Clone este repositório ou extraia a pasta do projeto.
2. Abra o terminal na pasta do projeto (ou abra a pasta no VS Code).
3. Execute o comando:
   ```bash
   python rentsmart.py
   ```
4. Siga as instruções no terminal. Ao final, o arquivo `projecao_orcamento_12_meses.csv` será gerado na mesma pasta.
