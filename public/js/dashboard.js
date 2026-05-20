const nome = sessionStorage.getItem('nome');
const cargo = sessionStorage.getItem('cargo');

document.getElementById("nomeUsuario").textContent = nome;
document.getElementById("cargoUsuario").textContent = cargo;

const tabData = {
        agua: {
          porcentagem: "23%",
          habitantes: "44.876",
          descricao: "Sem acesso à água potável",
          evolucao: "+9.5%",
          tituloGrafico: "Evolução - Distribuição de Água Potável",
          dados: [50, 60, 70, 80, 87],
        },
        esgoto: {
          porcentagem: "23%",
          habitantes: "44.876",
          descricao: "Sem acesso ao tratamento de Esgoto",
          evolucao: "+29.5%",
          tituloGrafico: "Evolução - Acesso ao Esgoto",
          dados: [50, 60, 70, 80, 87],
        },
        residuos: {
          porcentagem: "23%",
          habitantes: "44.876",
          descricao: "Sem coleta de Resíduos",
          evolucao: "+9.5%",
          tituloGrafico: "Evolução - Redução de Resíduos",
          dados: [50, 60, 70, 80, 87],
        },
        drenagem: {
          porcentagem: "23%",
          habitantes: "44.876",
          descricao: "Sem acesso à Drenagem adequada",
          evolucao: "+9.5%",
          tituloGrafico: "Evolução - Acesso à Drenagem",
          dados: [50, 60, 70, 80, 87],
        },
      };

      const chartInstance = new Chart(document.getElementById("myChart"), {
        type: "line",
        data: {
          labels: ["2018", "2019", "2020", "2021", "2024"],
          datasets: [{
            label: "",
            data: tabData.agua.dados,
            borderWidth: 1,
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: { y: { min: 50, max: 90 } },
          plugins: { legend: { display: false } },
        },
      });

      function trocarTab(tab) {
        const d = tabData[tab];
        if (!d) return;

        document.getElementById("tabPorcentagem").textContent = d.porcentagem;
        document.getElementById("tabHabitantes").textContent = d.habitantes;
        document.getElementById("tabDescricao").textContent = d.descricao;
        document.getElementById("tabEvolucao").textContent = d.evolucao;
        document.getElementById("tabTituloGrafico").textContent = d.tituloGrafico;

        chartInstance.data.datasets[0].label = d.tituloGrafico;
        chartInstance.data.datasets[0].data  = d.dados;
        chartInstance.update();

        document.querySelectorAll(".tabBtn").forEach(btn => btn.classList.remove("ativo"));
        document.querySelector(`.tabBtn[data-tab="${tab}"]`).classList.add("ativo");
      }

      document.querySelectorAll(".tabBtn").forEach(btn => {
        btn.addEventListener("click", () => trocarTab(btn.dataset.tab));
      });

