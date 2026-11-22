import csv
from abc import ABC, abstractmethod


class Imovel(ABC):
    """Classe abstrata que representa um imóvel genérico da R.M Imóveis."""

    def __init__(self, tipo: str, valor_base: float):
        self.tipo = tipo
        self.valor_base = valor_base

    @abstractmethod
    def calcular_aluguel_mensal(self) -> float:
        """Calcula o valor final do aluguel mensal com adicionais e descontos."""
        pass

    @abstractmethod
    def obter_detalhamento(self) -> list[str]:
        """Retorna uma lista de strings descrevendo a composição do valor."""
        pass


class Apartamento(Imovel):
    """Representa um apartamento para locação."""

    def __init__(self, quartos: int, tem_garagem: bool, tem_criancas: bool):
        super().__init__(tipo="Apartamento", valor_base=700.00)
        self.quartos = quartos
        self.tem_garagem = tem_garagem
        self.tem_criancas = tem_criancas

    def calcular_aluguel_mensal(self) -> float:
        total = self.valor_base
        if self.quartos == 2:
            total += 200.00
        if self.tem_garagem:
            total += 300.00
        if not self.tem_criancas:
            total *= 0.95  # 5% de desconto
        return round(total, 2)

    def obter_detalhamento(self) -> list[str]:
        detalhes = [
            f"Categoria: {self.tipo} ({self.quartos} quarto(s))",
            f"Aluguel-base: R$ {self.valor_base:,.2f}",
        ]
        subtotal = self.valor_base

        if self.quartos == 2:
            detalhes.append("Adicional 2º quarto: + R$ 200,00")
            subtotal += 200.00

        if self.tem_garagem:
            detalhes.append("Adicional vaga de garagem (1 vaga): + R$ 300,00")
            subtotal += 300.00
        else:
            detalhes.append("Vaga de garagem: Não incluída (R$ 0,00)")

        if not self.tem_criancas:
            desconto = subtotal * 0.05
            detalhes.append(f"Desconto comercial (5% - sem crianças): - R$ {desconto:,.2f}")
        else:
            detalhes.append("Desconto comercial: Não aplicável")

        return detalhes


class Casa(Imovel):
    """Representa uma casa para locação."""

    def __init__(self, quartos: int, tem_garagem: bool):
        super().__init__(tipo="Casa", valor_base=900.00)
        self.quartos = quartos
        self.tem_garagem = tem_garagem

    def calcular_aluguel_mensal(self) -> float:
        total = self.valor_base
        if self.quartos == 2:
            total += 250.00
        if self.tem_garagem:
            total += 300.00
        return round(total, 2)

    def obter_detalhamento(self) -> list[str]:
        detalhes = [
            f"Categoria: {self.tipo} ({self.quartos} quarto(s))",
            f"Aluguel-base: R$ {self.valor_base:,.2f}",
        ]
        if self.quartos == 2:
            detalhes.append("Adicional 2º quarto: + R$ 250,00")

        if self.tem_garagem:
            detalhes.append("Adicional vaga de garagem (1 vaga): + R$ 300,00")
        else:
            detalhes.append("Vaga de garagem: Não incluída (R$ 0,00)")

        return detalhes


class Estudio(Imovel):
    """Representa um estúdio para locação."""

    def __init__(self, qtd_vagas: int):
        super().__init__(tipo="Estúdio", valor_base=1200.00)
        self.qtd_vagas = qtd_vagas

    def _calcular_custo_vagas(self) -> float:
        if self.qtd_vagas == 0:
            return 0.00
        vagas_extras = max(0, self.qtd_vagas - 2)
        return 250.00 + (vagas_extras * 60.00)

    def calcular_aluguel_mensal(self) -> float:
        total = self.valor_base + self._calcular_custo_vagas()
        return round(total, 2)

    def obter_detalhamento(self) -> list[str]:
        detalhes = [
            f"Categoria: {self.tipo}",
            f"Aluguel-base: R$ {self.valor_base:,.2f}",
        ]
        if self.qtd_vagas == 0:
            detalhes.append("Estacionamento: Não incluído (R$ 0,00)")
        else:
            vagas_extras = max(0, self.qtd_vagas - 2)
            detalhes.append(
                f"Pacote estacionamento ({self.qtd_vagas} vaga(s) - base 2 vagas + {vagas_extras} extra(s)): "
                f"+ R$ {self._calcular_custo_vagas():,.2f}"
            )
        return detalhes


class Orcamento:
    """Gerencia o cálculo consolidado, exibição e exportação CSV do orçamento."""

    TAXA_CONTRATUAL = 2000.00

    def __init__(self, imovel: Imovel, parcelas_taxa: int):
        self.imovel = imovel
        self.parcelas_taxa = parcelas_taxa

    def calcular_parcela_taxa(self) -> float:
        return round(self.TAXA_CONTRATUAL / self.parcelas_taxa, 2)

    def exibir_resumo(self) -> None:
        aluguel_mensal = self.imovel.calcular_aluguel_mensal()
        valor_parcela_taxa = self.calcular_parcela_taxa()

        print("\n" + "=" * 60)
        print("           RESUMO DO ORÇAMENTO - R.M IMÓVEIS")
        print("=" * 60)
        for linha in self.imovel.obter_detalhamento():
            print(f"• {linha}")
        print("-" * 60)
        print(f"VALOR TOTAL DO ALUGUEL MENSAL: R$ {aluguel_mensal:,.2f}")
        print("-" * 60)
        print("CONDIÇÕES DA TAXA CONTRATUAL (Custo separado do aluguel):")
        print(f"• Taxa Contratual Total: R$ {self.TAXA_CONTRATUAL:,.2f}")
        print(f"• Parcelamento escolhido: {self.parcelas_taxa}x de R$ {valor_parcela_taxa:,.2f}")
        print("=" * 60)

    def gerar_csv(self, nome_arquivo: str = "projecao_orcamento_12_meses.csv") -> None:
        aluguel_mensal = self.imovel.calcular_aluguel_mensal()
        valor_parcela_taxa = self.calcular_parcela_taxa()

        with open(nome_arquivo, mode="w", newline="", encoding="utf-8-sig") as arquivo:
            escritor = csv.writer(arquivo, delimiter=";")
            escritor.writerow([
                "Mes",
                "Tipo_Imovel",
                "Aluguel_Mensal_BRL",
                "Parcela_Taxa_Contratual_BRL",
                "Total_Desembolso_Mensal_BRL",
            ])

            for mes in range(1, 13):
                taxa_no_mes = valor_parcela_taxa if mes <= self.parcelas_taxa else 0.00
                total_mes = round(aluguel_mensal + taxa_no_mes, 2)

                escritor.writerow([
                    f"Mês {mes:02d}",
                    self.imovel.tipo,
                    f"{aluguel_mensal:.2f}".replace(".", ","),
                    f"{taxa_no_mes:.2f}".replace(".", ","),
                    f"{total_mes:.2f}".replace(".", ","),
                ])

        print(f"\n[OK] Arquivo '{nome_arquivo}' gerado com sucesso!")


# --- Funções Auxiliares de Validação de Entrada ---

def ler_opcao_menu(mensagem: str, opcoes_validas: list[str]) -> str:
    while True:
        valor = input(mensagem).strip().upper()
        if valor in opcoes_validas:
            return valor
        print(f"Entrada inválida. Escolha uma das opções: {', '.join(opcoes_validas)}.")


def ler_inteiro_intervalo(mensagem: str, minimo: int, maximo: int) -> int:
    while True:
        try:
            valor = int(input(mensagem).strip())
            if minimo <= valor <= maximo:
                return valor
            print(f"Por favor, digite um número entre {minimo} e {maximo}.")
        except ValueError:
            print("Entrada inválida. Digite apenas números inteiros.")


def executar_sistema() -> None:
    print("=== BEM-VINDO AO RENTSMART (R.M IMÓVEIS) ===")
    print("Selecione a categoria do imóvel:")
    print("[1] Apartamento (Base: R$ 700,00)")
    print("[2] Casa        (Base: R$ 900,00)")
    print("[3] Estúdio     (Base: R$ 1.200,00)")

    tipo_escolhido = ler_opcao_menu("Opção desejada (1/2/3): ", ["1", "2", "3"])

    if tipo_escolhido == "1":
        quartos = ler_inteiro_intervalo("Quantidade de quartos (1 ou 2): ", 1, 2)
        garagem = ler_opcao_menu("Deseja vaga de garagem? (S/N): ", ["S", "N"]) == "S"
        criancas = ler_opcao_menu("Possui crianças na residência? (S/N): ", ["S", "N"]) == "S"
        imovel = Apartamento(quartos=quartos, tem_garagem=garagem, tem_criancas=criancas)

    elif tipo_escolhido == "2":
        quartos = ler_inteiro_intervalo("Quantidade de quartos (1 ou 2): ", 1, 2)
        garagem = ler_opcao_menu("Deseja vaga de garagem? (S/N): ", ["S", "N"]) == "S"
        imovel = Casa(quartos=quartos, tem_garagem=garagem)

    else:
        quer_vagas = ler_opcao_menu("Deseja incluir pacote de estacionamento? (S/N): ", ["S", "N"])
        if quer_vagas == "S":
            qtd_vagas = ler_inteiro_intervalo(
                "Quantidade de vagas desejada (mínimo 2 no pacote inicial, máximo 20): ", 2, 20
            )
        else:
            qtd_vagas = 0
        imovel = Estudio(qtd_vagas=qtd_vagas)

    parcelas = ler_inteiro_intervalo(
        "Em quantas parcelas deseja pagar a Taxa Contratual de R$ 2.000,00 (1 a 5)? ", 1, 5
    )

    orcamento = Orcamento(imovel=imovel, parcelas_taxa=parcelas)
    orcamento.exibir_resumo()
    orcamento.gerar_csv()


if __name__ == "__main__":
    executar_sistema()
