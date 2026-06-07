const nome = sessionStorage.getItem('nome');
const cargo = sessionStorage.getItem('cargo');

document.getElementById("nome").innerHTML = nome;
document.getElementById("cargo").innerHTML = cargo;

function carregarEstados() {
    fetch("/dados/estados", { cache: 'no-store' })
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (estados) {
                    var selectEstado = document.getElementById("filtroEstado");
                    selectEstado.innerHTML = '<option value="">Selecione um Estado</option>';
                    estados.forEach(function (estado) {
                        selectEstado.innerHTML += `<option value="${estado.sigla}">${estado.nome}</option>`;
                    });
                });
            } else {
                console.error("Erro ao buscar estados");
            }
        })
        .catch(function (error) {
            console.error(`Erro ao buscar estados: ${error.message}`);
        });
}

function carregarMunicipios() {
    var uf = document.getElementById("filtroEstado").value;
    var selectMunicipio = document.getElementById("filtroCidade");

    selectMunicipio.innerHTML = '<option value="">Carregando...</option>';

    if (uf === "") {
        selectMunicipio.innerHTML = '<option value="">Selecione uma Cidade</option>';
        return;
    }

    fetch(`/dados/municipios?uf=${uf}`, { cache: 'no-store' })
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (municipios) {
                    selectMunicipio.innerHTML = '<option value="">Selecione uma Cidade</option>';
                    municipios.forEach(function (municipio) {
                        selectMunicipio.innerHTML += `<option value="${municipio.id}">${municipio.nome}</option>`;
                    });
                });
            } else {
                console.error("Erro ao buscar municípios");
            }
        })
        .catch(function (error) {
            console.error(`Erro ao buscar municípios: ${error.message}`);
        });
}

document.getElementById("filtroEstado").addEventListener("change", carregarMunicipios);

carregarEstados();

var tabAtiva = "agua";

function aplicarFiltro() {
    var idMunicipio = document.getElementById("filtroCidade").value;

    if (idMunicipio === "") {
        alert("Selecione um Estado e uma Cidade!");
        return;
    }

    fetch(`/dados/municipio/${idMunicipio}`, { cache: 'no-store' })
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (municipio) {
                    var total = municipio.populacao_total;
                    var urbana = municipio.populacao_urbana;
                    var rural = municipio.populacao_rural;

                    var percUrbana = ((urbana / total) * 100).toFixed(1).replace(".", ",");
                    var percRural = ((rural / total) * 100).toFixed(1).replace(".", ",");

                    document.getElementById("populacaoTotal").textContent = total.toLocaleString("pt-BR");
                    document.getElementById("populacaoUrbana").textContent = percUrbana + "%";
                    document.getElementById("populacaoRural").textContent = percRural + "%";
                });
            } else {
                console.error("Erro ao buscar município");
            }
        })
        .catch(function (error) {
            console.error(`Erro ao buscar município: ${error.message}`);
        });

    fetch(`/dados/saneamento/${idMunicipio}`, { cache: 'no-store' })
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (dados) {
                    dadosSaneamentoAtuais = dados;
                    atualizarKPIs(dados, tabAtiva);
                });
            } else {
                console.error("Erro ao buscar dados de saneamento");
            }
        })
        .catch(function (error) {
            console.error(`Erro ao buscar dados de saneamento: ${error.message}`);
        });
}

function atualizarKPIs(dados, tab) {
    var total = dados.populacao_total;
    var urbTotal = dados.populacao_urbana;
    var ruralTotal = dados.populacao_rural;
    var semAcesso = 0;
    var comAcesso = 0;
    var tituloGrafico = "";
    var descricaoSemAcesso = "";
    var descricaoComAcesso = "";
    var percUrbano = 0;
    var percRural = 0;

    if (tab === "agua") {
        comAcesso = dados.agua_urbana + dados.agua_rural;
        semAcesso = total - comAcesso;
        tituloGrafico = "População atendida (%)";
        descricaoSemAcesso = "Sem acesso à água potável";
        descricaoComAcesso = "População atendida";
        percUrbano = urbTotal > 0 ? ((dados.agua_urbana / urbTotal) * 100).toFixed(1) : 0;
        percRural = ruralTotal > 0 ? ((dados.agua_rural / ruralTotal) * 100).toFixed(1) : 0;
    } else if (tab === "esgoto") {
        comAcesso = dados.esgoto_urbano + dados.esgoto_rural;
        semAcesso = total - comAcesso;
        tituloGrafico = "População atendida (%)";
        descricaoSemAcesso = "Sem acesso ao tratamento de Esgoto";
        descricaoComAcesso = "População atendida";
        percUrbano = urbTotal > 0 ? ((dados.residuos_urbano / urbTotal) * 100).toFixed(1) : 0;
        percRural = ruralTotal > 0 ? ((dados.residuos_rural / ruralTotal) * 100).toFixed(1) : 0;
    } else if (tab === "residuos") {
        comAcesso = dados.residuos_urbano + dados.residuos_rural;
        semAcesso = total - comAcesso;
        tituloGrafico = "População atendida (%)";
        descricaoSemAcesso = "Sem coleta de Resíduos";
        descricaoComAcesso = "População atendida";
    } else if (tab === "drenagem") {
        comAcesso = Math.round(total * dados.indice_drenagem / 100);
        semAcesso = total - comAcesso;
        tituloGrafico = "Cobertura de drenagem (%)";
        descricaoSemAcesso = "Sem cobertura de drenagem";
        descricaoComAcesso = "Cobertura de drenagem";
        percUrbano = dados.indice_drenagem;
        percRural = dados.indice_drenagem;
    }

    var percSemAcesso = ((semAcesso / total) * 100).toFixed(1).replace(".", ",");
    var percComAcesso = ((comAcesso / total) * 100).toFixed(1).replace(".", ",");

    document.getElementById("tabDescricao").textContent = descricaoSemAcesso;
    document.getElementById("tabPorcentagem").textContent = percSemAcesso + "%";
    document.getElementById("tabHabitantes").textContent = semAcesso.toLocaleString("pt-BR");

    document.getElementById("tabAtendidoDescricao").textContent = descricaoComAcesso;
    document.getElementById("tabAtendidoPorcentagem").textContent = percComAcesso + "%";
    document.getElementById("tabAtendidoHabitantes").textContent = comAcesso.toLocaleString("pt-BR");

    document.getElementById("tabTituloGrafico").textContent = tituloGrafico;

    chartInstance.data.datasets[0].data = [Number(percUrbano), Number(percUrbano)];
    chartInstance.data.datasets[1].data = [Number(percRural), Number(percRural)];
    chartInstance.update();
}

document.getElementById("btnFiltrar").addEventListener("click", aplicarFiltro);

const tabData = {
        agua: {
          porcentagem: "8,3%",
          habitantes: "162.789",
          descricao: "Sem acesso à água potável",
          atendidoPorcentagem: "91,7%",
          atendidoHabitantes: "1.800.937",
          atendidoDescricao: "População atendida",
          tituloGrafico: "População atendida (%)",
          dados: [91.7, 87.3, 83.4]
        },
        esgoto: {
          porcentagem: "23%",
          habitantes: "44.876",
          descricao: "Sem acesso ao tratamento de Esgoto",
          atendidoPorcentagem: "77%",
          atendidoHabitantes: "1.918.850",
          atendidoDescricao: "População atendida",
          tituloGrafico: "População atendida (%)",
          dados: [50, 60, 70]
        },
        residuos: {
          porcentagem: "8,3%",
          habitantes: "162.789",
          descricao: "Sem coleta de Resíduos",
          atendidoPorcentagem: "91,7%",
          atendidoHabitantes: "1.800.937",
          atendidoDescricao: "População atendida",
          tituloGrafico: "População atendida (%)",
          dados: [91.7, 87.3, 83.4]
        },
        drenagem: {
          porcentagem: "52,1%",
          habitantes: "744.521",
          descricao: "Sem cobertura de drenagem",
          atendidoPorcentagem: "47,9%",
          atendidoHabitantes: "680.432",
          atendidoDescricao: "Cobertura de drenagem",
          tituloGrafico: "Cobertura de drenagem (%)",
          dados: [62.3, 47.9],
        },
      };

      const labelAcimaBarras = {
        id: 'labelAcimaBarras',
        afterDatasetsDraw(chart) {
            const { ctx, data, scales: { x, y } } = chart;
            ctx.save();

            data.datasets[0].data.forEach((value, index) => {
                const xPos = x.getPixelForValue(index);
                const yPos = y.getPixelForValue(value);
                const texto = value + "%";

                ctx.font = 'bold 12px DM Sans, sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'bottom';

                const padding = { x: 6, y: 4 };
                const largura = ctx.measureText(texto).width + padding.x * 2;
                const altura = 18;
                const rectX = xPos - largura / 2;
                const rectY = yPos - altura - 4;

                ctx.fillStyle = 'rgba(255,255,255,0.85)';
                ctx.beginPath();
                ctx.roundRect(rectX, rectY, largura, altura, 4);
                ctx.fill();

                ctx.fillStyle = '#002645';
                ctx.fillText(texto, xPos, yPos - 4);
            });

            ctx.restore();
        }
    };

    const chartInstance = new Chart(document.getElementById("myChart"), {
        type: "bar",
        data: {
            labels: ["Estado", "Município"],
            datasets: [{
                label: "Urbano",
                data: [91.7, 87.3],
                backgroundColor: "#002645",
            },
            {
                label: "Rural",
                data: [8.3, 12.7],
                backgroundColor: "#58A8D6",
            },
          ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            layout: {
                padding: { top: 20, bottom: 0}
            },
            scales: {
                y: {
                    min: 0,
                    max: 100,
                    display: false
                },
                x: {
                  ticks: {
                    font: { size: 11},
                    color: '#002645'
                  },
                  grid: { display: false},
                  border: {display: false}
                }
            },
            plugins: {
                legend: { display: true, position: 'bottom', labels: { color: '#002645', font: { size: 11}}},
                datalabels: { display: false }
            }
        },
        plugins: [labelAcimaBarras]
    });

      var dadosSaneamentoAtuais = null;

      function trocarTab(tab) {
        tabAtiva = tab;
        const d = tabData[tab];
        if (!d) return;
        
        chartInstance.data.labels = ["Estado", "Município"];

        if (tab === "drenagem") {
          chartInstance.data.datasets = [{
            label: "Índice de Drenagem",
            data: d.dados,
            backgroundColor: "#002645",
          }];
        } else {
          chartInstance.data.datasets = [
            { label: "Urbano", data: d.dados, backgroundColor: "#002645" },
            { label: "Rural",  data: [8.3, 12.7],  backgroundColor: "#58A8D6" },
          ];
        }

        chartInstance.update();

        if (dadosSaneamentoAtuais) {
          atualizarKPIs(dadosSaneamentoAtuais, tab);
        } else {
          chartInstance.update();
          document.getElementById("tabPorcentagem").textContent = d.porcentagem;
          document.getElementById("tabHabitantes").textContent = d.habitantes;
          document.getElementById("tabDescricao").textContent = d.descricao;
          document.getElementById("tabAtendidoPorcentagem").textContent = d.atendidoPorcentagem;
          document.getElementById("tabAtendidoHabitantes").textContent = d.atendidoHabitantes;
          document.getElementById("tabAtendidoDescricao").textContent = d.atendidoDescricao;
          document.getElementById("tabTituloGrafico").textContent = d.tituloGrafico;
        }

        document.querySelectorAll(".tabBtn").forEach(btn => btn.classList.remove("ativo"));
        document.querySelector(`.tabBtn[data-tab="${tab}"]`).classList.add("ativo");
      }

      document.querySelectorAll(".tabBtn").forEach(btn => {
        btn.addEventListener("click", () => trocarTab(btn.dataset.tab));
      });

      trocarTab("agua");

      const links = document.querySelectorAll('aside .btns a');

      links.forEach(link => {
          if (link.href === window.location.href) {
              link.classList.add('ativo');
          }
      });