const nome = sessionStorage.getItem('nome');
const cargo = sessionStorage.getItem('cargo');

document.getElementById("nome").innerHTML = nome;
document.getElementById("cargo").innerHTML = cargo;

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

      function trocarTab(tab) {
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

        document.getElementById("tabPorcentagem").textContent = d.porcentagem;
        document.getElementById("tabHabitantes").textContent = d.habitantes;
        document.getElementById("tabDescricao").textContent = d.descricao;
        document.getElementById("tabAtendidoPorcentagem").textContent = d.atendidoPorcentagem;
        document.getElementById("tabAtendidoHabitantes").textContent = d.atendidoHabitantes;
        document.getElementById("tabAtendidoDescricao").textContent = d.atendidoDescricao;
        document.getElementById("tabTituloGrafico").textContent = d.tituloGrafico;


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

      