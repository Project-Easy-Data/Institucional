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

function calcularScore(dados) {
    var total = dados.populacao_total;
    var circunferencia = 188.5;

    var percAgua = total > 0 ? ((dados.agua_urbana + dados.agua_rural) / total) * 100 : 0;
    var percEsgoto = total > 0 ? ((dados.esgoto_urbano + dados.esgoto_rural) / total) * 100 : 0;
    var percResiduos = total > 0 ? ((dados.residuos_urbano + dados.residuos_rural) / total) * 100 : 0;
    var percDrenagem = Number(dados.indice_drenagem) || 0;

    var notaAgua = (percAgua / 100) * 10;
    var notaEsgoto = (percEsgoto / 100) * 10;
    var notaResiduos = (percResiduos / 100) * 10;
    var notaDrenagem = (percDrenagem / 100) * 10;

    var infra = (notaAgua + notaEsgoto + notaResiduos + notaDrenagem) / 4;

    var parcelaRisco = Number(dados.parcela_domicilios_risco) || 0;
    var risco = Math.max(0, 10 - parcelaRisco);

    var scoreTotal = (infra * 0.7) + (risco * 0.3);

    var dashOffset = circunferencia * (1 - scoreTotal / 10);

    var circle = document.getElementById("scoreCircle");
    if (circle) circle.setAttribute("stroke-dashoffset", dashOffset);

    var texto = document.getElementById("scoreTexto");
    if (texto) texto.textContent = scoreTotal.toFixed(1);

    var label = document.getElementById("scoreLabel");
    if (label) label.textContent = scoreTotal.toFixed(1) + "/10.0";

    var infraEl = document.getElementById("scoreInfra");
    if (infraEl) infraEl.textContent = infra.toFixed(1) + "/10.0";

    var riscoEl = document.getElementById("scoreRisco");
    if (riscoEl) riscoEl.textContent = risco.toFixed(1) + "/10.0";
}

function atualizarFatoresCriticos(dados) {
    var total = dados.populacao_total;

    var atendAgua = total > 0 ? ((dados.agua_urbana + dados.agua_rural) / total) * 100 : 0;
    var atendEsgoto = total > 0 ? ((dados.esgoto_urbano + dados.esgoto_rural) / total) * 100 : 0;
    var atendResiduos = total > 0 ? ((dados.residuos_urbano + dados.residuos_rural) / total) * 100 : 0;

    var deficitAgua = 100 - atendAgua;
    var deficitEsgoto = 100 - atendEsgoto;
    var deficitResiduos = 100 - atendResiduos;

    var deficitGeral = (deficitAgua + deficitEsgoto + deficitResiduos) / 3;

    document.getElementById("valDeficitSaneamento").textContent = deficitGeral.toFixed(0) + "%";

    var parcelaRisco = Number(dados.parcela_domicilios_risco) || 0;
    document.getElementById("valRiscoInundacao").textContent = parcelaRisco.toFixed(0) + "%";

    var classificacao = "Baixo";
    if (parcelaRisco >= 10) {
        classificacao = "Alto";
    } else if (parcelaRisco >= 3) {
        classificacao = "Médio";
    }
    document.getElementById("valClassificacaoRisco").textContent = classificacao;
}

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
                    calcularScore(dados);
                    atualizarFatoresCriticos(dados);
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
    var semAcesso = 0;
    var comAcesso = 0;
    var tituloGrafico = "";
    var descricaoSemAcesso = "";
    var descricaoComAcesso = "";
    var percUrbano = 0;
    var percRural = 0;

    if (tab === "agua") {
        var urbAtendido = dados.agua_urbana;
        var ruralAtendido = dados.agua_rural;
        comAcesso = urbAtendido + ruralAtendido;
        semAcesso = total - comAcesso;
        tituloGrafico = "População atendida (%)";
        descricaoSemAcesso = "Sem acesso à água potável";
        descricaoComAcesso = "População atendida";
        var totalAtendido = urbAtendido + ruralAtendido;
        percUrbano = totalAtendido > 0 ? ((urbAtendido / totalAtendido) * 100).toFixed(1) : 0;
        percRural = totalAtendido > 0 ? ((ruralAtendido / totalAtendido) * 100).toFixed(1) : 0;
    } else if (tab === "esgoto") {
        var urbAtendido = dados.esgoto_urbano;
        var ruralAtendido = dados.esgoto_rural;
        comAcesso = urbAtendido + ruralAtendido;
        semAcesso = total - comAcesso;
        tituloGrafico = "População atendida (%)";
        descricaoSemAcesso = "Sem acesso ao tratamento de Esgoto";
        descricaoComAcesso = "População atendida";
        var totalAtendido = urbAtendido + ruralAtendido;
        percUrbano = totalAtendido > 0 ? ((urbAtendido / totalAtendido) * 100).toFixed(1) : 0;
        percRural = totalAtendido > 0 ? ((ruralAtendido / totalAtendido) * 100).toFixed(1) : 0;
    } else if (tab === "residuos") {
        var urbAtendido = dados.residuos_urbano;
        var ruralAtendido = dados.residuos_rural;
        comAcesso = urbAtendido + ruralAtendido;
        semAcesso = total - comAcesso;
        tituloGrafico = "População atendida (%)";
        descricaoSemAcesso = "Sem coleta de Resíduos";
        descricaoComAcesso = "População atendida";
        var totalAtendido = urbAtendido + ruralAtendido;
        percUrbano = totalAtendido > 0 ? ((urbAtendido / totalAtendido) * 100).toFixed(1) : 0;
        percRural = totalAtendido > 0 ? ((ruralAtendido / totalAtendido) * 100).toFixed(1) : 0;
    } else if (tab === "drenagem") {
        comAcesso = Math.round(total * dados.indice_drenagem / 100);
        semAcesso = total - comAcesso;
        tituloGrafico = "Cobertura de drenagem (%)";
        descricaoSemAcesso = "Sem cobertura de drenagem";
        descricaoComAcesso = "Cobertura de drenagem";
        percUrbano = dados.indice_drenagem;
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

    if (tab === "drenagem") {
        chartInstance.data.labels = ["Drenagem"];
        chartInstance.data.datasets = [{
            data: [Number(percUrbano)],
            backgroundColor: ["#002645"],
            minBarLength: 4,
        }];
    } else {
        chartInstance.data.labels = ["Urbano", "Rural"];
        chartInstance.data.datasets = [{
            data: [Number(percUrbano), Number(percRural)],
            backgroundColor: ["#002645", "#58A8D6"],
            minBarLength: 4,
        }];
    }
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
        dados: [91.7, 87.3]
    },
    esgoto: {
        porcentagem: "23%",
        habitantes: "44.876",
        descricao: "Sem acesso ao tratamento de Esgoto",
        atendidoPorcentagem: "77%",
        atendidoHabitantes: "1.918.850",
        atendidoDescricao: "População atendida",
        tituloGrafico: "População atendida (%)",
        dados: [50, 60]
    },
    residuos: {
        porcentagem: "8,3%",
        habitantes: "162.789",
        descricao: "Sem coleta de Resíduos",
        atendidoPorcentagem: "91,7%",
        atendidoHabitantes: "1.800.937",
        atendidoDescricao: "População atendida",
        tituloGrafico: "População atendida (%)",
        dados: [91.7, 87.3]
    },
    drenagem: {
        porcentagem: "52,1%",
        habitantes: "744.521",
        descricao: "Sem cobertura de drenagem",
        atendidoPorcentagem: "47,9%",
        atendidoHabitantes: "680.432",
        atendidoDescricao: "Cobertura de drenagem",
        tituloGrafico: "Cobertura de drenagem (%)",
        dados: [62.3]
    },
};

const labelAcimaBarras = {
    id: 'labelAcimaBarras',
    afterDatasetsDraw(chart) {
        const { ctx } = chart;
        ctx.save();

        chart.data.datasets.forEach(function (dataset, dsIndex) {
            var meta = chart.getDatasetMeta(dsIndex);
            meta.data.forEach(function (bar, index) {
                var value = dataset.data[index];
                if (value == null) return;

                var xPos = bar.x;
                var yPos = bar.y;
                var texto = Number(value).toFixed(1).replace(".", ",") + "%";

                ctx.font = 'bold 12px DM Sans, sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'bottom';

                var padding = { x: 6, y: 4 };
                var largura = ctx.measureText(texto).width + padding.x * 2;
                var altura = 18;
                var rectX = xPos - largura / 2;
                var rectY = yPos - altura - 4;

                ctx.fillStyle = 'rgba(255,255,255,0.85)';
                ctx.beginPath();
                ctx.roundRect(rectX, rectY, largura, altura, 4);
                ctx.fill();

                ctx.fillStyle = '#002645';
                ctx.fillText(texto, xPos, yPos - 4);
            });
        });

        ctx.restore();
    }
};

const chartInstance = new Chart(document.getElementById("myChart"), {
    type: "bar",
    data: {
        labels: ["Urbano", "Rural"],
        datasets: [{
            data: [91.7, 87.3],
            backgroundColor: ["#002645", "#58A8D6"],
            minBarLength: 4,
        }],
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
            padding: { top: 20, bottom: 0 }
        },
        scales: {
            y: {
                min: 0,
                max: 100,
                display: false
            },
            x: {
                ticks: {
                    font: { size: 11 },
                    color: '#002645'
                },
                grid: { display: false },
                border: { display: false }
            }
        },
        plugins: {
            legend: { display: false },
            datalabels: { display: false }
        }
    },
    plugins: [labelAcimaBarras]
});

var dadosSaneamentoAtuais = null;

function trocarTab(tab) {
    tabAtiva = tab;
    var d = tabData[tab];
    if (!d) return;

    if (dadosSaneamentoAtuais) {
        atualizarKPIs(dadosSaneamentoAtuais, tab);
    } else {
        if (tab === "drenagem") {
            chartInstance.data.labels = ["Drenagem"];
            chartInstance.data.datasets = [{
                data: [d.dados[0]],
                backgroundColor: ["#002645"],
                minBarLength: 4,
            }];
        } else {
            chartInstance.data.labels = ["Urbano", "Rural"];
            chartInstance.data.datasets = [{
                data: [d.dados[0], d.dados[1]],
                backgroundColor: ["#002645", "#58A8D6"],
                minBarLength: 4,
            }];
        }
        chartInstance.update();

        document.getElementById("tabPorcentagem").textContent = d.porcentagem;
        document.getElementById("tabHabitantes").textContent = d.habitantes;
        document.getElementById("tabDescricao").textContent = d.descricao;
        document.getElementById("tabAtendidoPorcentagem").textContent = d.atendidoPorcentagem;
        document.getElementById("tabAtendidoHabitantes").textContent = d.atendidoHabitantes;
        document.getElementById("tabAtendidoDescricao").textContent = d.atendidoDescricao;
        document.getElementById("tabTituloGrafico").textContent = d.tituloGrafico;
    }

    document.querySelectorAll(".tabBtn").forEach(function (btn) { btn.classList.remove("ativo"); });
    document.querySelector('.tabBtn[data-tab="' + tab + '"]').classList.add("ativo");
}

document.querySelectorAll(".tabBtn").forEach(function (btn) {
    btn.addEventListener("click", function () { trocarTab(btn.dataset.tab); });
});

trocarTab("agua");

var links = document.querySelectorAll('aside .btns a');

links.forEach(function (link) {
    if (link.href === window.location.href) {
        link.classList.add('ativo');
    }
});