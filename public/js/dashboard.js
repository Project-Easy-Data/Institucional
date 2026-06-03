const nome = sessionStorage.getItem('nome');
const cargo = sessionStorage.getItem('cargo');

document.getElementById("nome").innerHTML = nome;
document.getElementById("cargo").innerHTML = cargo;

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
        labels: ["Município", "Estado", "Brasil"],
        datasets: [{
            label: "",
            data: [0, 0, 0],
            borderWidth: 1,
            backgroundColor: ["#002645", "#0A5E9A", "#58A8D6"],
        }],
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: { padding: { top: 20, bottom: 0 } },
        scales: {
            y: { min: 0, max: 100, display: false },
            x: {
                ticks: { font: { size: 11 }, color: '#002645' },
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

let tabAtiva = 'esgoto';
let dadosEstado = null;
let dadosResumo = [];

fetch('/kpis/estados')
    .then(res => res.json())
    .then(estados => {
        const select = document.getElementById('filtroEstado');
        select.innerHTML = '';
        estados.forEach(e => {
            const opt = document.createElement('option');
            opt.value = e.id_estados;
            opt.textContent = e.nome_estado;
            select.appendChild(opt);
        });
        if (estados.length > 0) {
            carregarDados(estados[0].id_estados);
        }
    })
    .catch(err => console.error('Erro ao buscar estados:', err));

document.getElementById('filtroEstado').addEventListener('change', function () {
    carregarDados(this.value);
});


function carregarDados(idEstado) {
    Promise.all([
        fetch(`/kpis/${idEstado}`).then(r => r.json()),
        fetch('/kpis/resumo').then(r => r.json())
    ])
    .then(([estado, resumo]) => {
        dadosEstado = estado[0];
        dadosResumo = resumo;
        trocarTab(tabAtiva);
    })
    .catch(err => console.error('Erro ao carregar dados:', err));
}

function calcularKpis(dados, resumo) {
    if (!dados) return null;

    const popTotal        = dados.populacao_urbana_residente_esgoto_ibge;
    const popAtendida     = dados.populacao_urbana_atendida_esgoto;
    const popSemAtendimento = popTotal - popAtendida;

    const pctAtendido     = popTotal > 0 ? ((popAtendida / popTotal) * 100).toFixed(1) : 0;
    const pctSemAcesso    = popTotal > 0 ? (((popSemAtendimento) / popTotal) * 100).toFixed(1) : 0;

    const totalNacionalPop     = resumo.reduce((s, r) => s + r.total_urbana_residente, 0);
    const totalNacionalAtendida = resumo.reduce((s, r) => s + r.total_urbana_atendida, 0);
    const pctBrasil = totalNacionalPop > 0
        ? ((totalNacionalAtendida / totalNacionalPop) * 100).toFixed(1)
        : 0;

    return {
        pctSemAcesso: parseFloat(pctSemAcesso),
        popSemAtendimento: popSemAtendimento.toLocaleString('pt-BR'),
        pctAtendido: parseFloat(pctAtendido),
        popAtendida: popAtendida.toLocaleString('pt-BR'),
        dadosGrafico: [parseFloat(pctAtendido), parseFloat(pctAtendido), parseFloat(pctBrasil)]
    };
}

const configTabs = {
    esgoto: {
        descricaoSemAcesso: 'Sem acesso ao tratamento de Esgoto',
        descricaoAtendido:  'População atendida com Esgoto',
        tituloGrafico:      'Cobertura de Esgoto (%)'
    },
    agua: {
        descricaoSemAcesso: 'Sem acesso à água potável',
        descricaoAtendido:  'População atendida com Água',
        tituloGrafico:      'Cobertura de Água Potável (%)'
    },
    residuos: {
        descricaoSemAcesso: 'Sem coleta de Resíduos',
        descricaoAtendido:  'População atendida com Coleta',
        tituloGrafico:      'Cobertura de Resíduos (%)'
    },
    drenagem: {
        descricaoSemAcesso: 'Sem acesso à Drenagem adequada',
        descricaoAtendido:  'População com Drenagem',
        tituloGrafico:      'Cobertura de Drenagem (%)'
    }
};

function trocarTab(tab) {
    tabAtiva = tab;

    const kpis = calcularKpis(dadosEstado, dadosResumo);
    if (!kpis) return;

    const cfg = configTabs[tab];

    document.getElementById("tabDescricao").textContent         = cfg.descricaoSemAcesso;
    document.getElementById("tabPorcentagem").textContent       = kpis.pctSemAcesso + '%';
    document.getElementById("tabHabitantes").textContent        = kpis.popSemAtendimento;
    document.getElementById("tabAtendidoDescricao").textContent = cfg.descricaoAtendido;
    document.getElementById("tabAtendidoPorcentagem").textContent = kpis.pctAtendido + '%';
    document.getElementById("tabAtendidoHabitantes").textContent  = kpis.popAtendida;
    document.getElementById("tabTituloGrafico").textContent       = cfg.tituloGrafico;

    chartInstance.data.labels = ["Município", "Estado", "Brasil"];
    chartInstance.data.datasets[0].data = kpis.dadosGrafico;
    chartInstance.update();

    document.querySelectorAll(".tabBtn").forEach(btn => btn.classList.remove("ativo"));
    const btnAtivo = document.querySelector(`.tabBtn[data-tab="${tab}"]`);
    if (btnAtivo) btnAtivo.classList.add("ativo");
}

document.querySelectorAll(".tabBtn").forEach(btn => {
    btn.addEventListener("click", () => trocarTab(btn.dataset.tab));
});

document.querySelectorAll('aside .btns a').forEach(link => {
    if (link.href === window.location.href) {
        link.classList.add('ativo');
    }
});