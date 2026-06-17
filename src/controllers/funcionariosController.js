function cadastrar(req, res) {
    var nome = req.body.nomeServer;
    var email = req.body.emailServer;
    var senha = req.body.senhaServer;
    var permissao = req.body.permissaoServer;
    var cargo = req.body.cargoServer;
    var empresaId = req.body.empresaIdServer;

    if (email == undefined) {
        res.status(400).send("Seu email está undefined!");
    } else if (senha == undefined) {
        res.status(400).send("Sua senha está indefinida!");
    } else if (nome == undefined) {
        res.status(400).send("Seu nome está indefinido!");
    } else if (permissao == undefined) {
        res.status(400).send("Sua permissao está indefinida!");
    } else if (cargo == undefined) {
        res.status(400).send("Seu cargo está indefinido!");
    } else if (empresaId == undefined) {
        res.status(400).send("Empresa não informada!");
    } else {
        funcionariosModel.cadastrar(nome, email, senha, cargo, permissao, empresaId)
            .then(function(resultado) {
                res.status(201).json({
                    mensagem: "Funcionário cadastrado com sucesso.",
                    insertId: resultado.insertId
                });
            })
            .catch(function(erro) {
                console.log(erro);
                res.status(500).send(erro.sqlMessage || "Erro ao cadastrar funcionário.");
            });
    }
}