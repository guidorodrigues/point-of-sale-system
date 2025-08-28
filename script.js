// Banco de dados de produtos
let produtos = [];
let itensVenda = [];

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    atualizarListaProdutos();
});

const botaoDeApagarNotaFiscal = document.getElementById('apagar-btn')

// Função para adicionar produto
function adicionarProduto() {
    const nome = document.getElementById('produtoNome').value;
    const preco = parseFloat(document.getElementById('produtoPreco').value);
    
    if (nome && !isNaN(preco) && preco > 0) {
        produtos.push({
            id: Date.now(),
            nome: nome,
            preco: preco
        });
        
        document.getElementById('produtoNome').value = '';
        document.getElementById('produtoPreco').value = '';
        
        atualizarListaProdutos();
        atualizarSelectProdutos();
    } else {
        alert('Por favor, preencha todos os campos corretamente.');
    }
}

// Atualiza a lista de produtos cadastrados
function atualizarListaProdutos() {
    const lista = document.getElementById('listaProdutos');
    lista.innerHTML = '<h3>Produtos Cadastrados</h3>';
    
    if (produtos.length === 0) {
        lista.innerHTML += '<p>Nenhum produto cadastrado.</p>';
        return;
    }
    
    produtos.forEach(produto => {
        const div = document.createElement('div');
        div.className = 'produto-item';
        div.innerHTML = `
            <span>${produto.nome}</span>
            <span>R$ ${produto.preco.toFixed(2)}</span>
        `;
        lista.appendChild(div);
    });
}

// Atualiza o select de produtos para venda
function atualizarSelectProdutos() {
    const select = document.getElementById('produtoSelecionado');
    select.innerHTML = '';
    
    produtos.forEach(produto => {
        const option = document.createElement('option');
        option.value = produto.id;
        option.textContent = `${produto.nome} - R$ ${produto.preco.toFixed(2)}`;
        select.appendChild(option);
    });
}

// Adiciona item à venda
function adicionarItem() {
    const produtoId = parseInt(document.getElementById('produtoSelecionado').value);
    const quantidade = parseInt(document.getElementById('quantidade').value) || 1;
    
    if (!produtoId || produtos.length === 0) {
        alert('Nenhum produto disponível para venda.');
        return;
    }
    
    const produto = produtos.find(p => p.id === produtoId);
    
    itensVenda.push({
        produto: produto,
        quantidade: quantidade
    });
    
    atualizarItensVenda();
    calcularTotal();
}

// Atualiza a lista de itens da venda
function atualizarItensVenda() {
    const lista = document.getElementById('itensVenda');
    lista.innerHTML = '<h3>Itens da Venda</h3>';
    
    if (itensVenda.length === 0) {
        lista.innerHTML += '<p>Nenhum item adicionado.</p>';
        return;
    }
    
    itensVenda.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'venda-item';
        div.innerHTML = `
            <span>${item.quantidade}x ${item.produto.nome}</span>
            <span>R$ ${(item.produto.preco * item.quantidade).toFixed(2)}</span>
            <button onclick="removerItem(${index})">Remover</button>
        `;
        lista.appendChild(div);
    });
}

// Remove item da venda
function removerItem(index) {
    itensVenda.splice(index, 1);
    atualizarItensVenda();
    calcularTotal();
}

// Calcula o total da venda
function calcularTotal() {
    const total = itensVenda.reduce((sum, item) => sum + (item.produto.preco * item.quantidade), 0);
    document.getElementById('totalVenda').textContent = total.toFixed(2);
    return total;
}

// Calcula o troco
function calcularTroco() {
    const total = calcularTotal();
    const valorPago = parseFloat(document.getElementById('valorPago').value) || 0;
    
    if (valorPago < total) {
        alert('O valor pago é menor que o total da compra.');
        return;
    }
    
    const troco = valorPago - total;
    document.getElementById('troco').textContent = `Troco: R$ ${troco.toFixed(2)}`;
}

// Finaliza a venda e gera a nota fiscal
function finalizarVenda() {
    const total = calcularTotal();
    const valorPago = parseFloat(document.getElementById('valorPago').value) || 0;
    
    if (itensVenda.length === 0) {
        alert('Nenhum item adicionado à venda.');
        return;
    }
    
    if (valorPago < total) {
        alert('O valor pago é menor que o total da compra.');
        return;
    }
    
    const troco = valorPago - total;
    
    // Gerar nota fiscal
    botaoDeApagarNotaFiscal.style.display = "inline-block"
    const notaContent = document.getElementById('notaFiscalContent');
    notaContent.innerHTML = `
        <h3>Supermercado ABC</h3>
        <p>Data: ${new Date().toLocaleString()}</p>
        <hr>
        <h4>Itens:</h4>
    `;
    
    itensVenda.forEach(item => {
        const div = document.createElement('div');
        div.className = 'nota-item';
        div.innerHTML = `
            <span>${item.quantidade}x ${item.produto.nome}</span>
            <span>R$ ${(item.produto.preco * item.quantidade).toFixed(2)}</span>
        `;
        notaContent.appendChild(div);
    });
    
    const divTotal = document.createElement('div');
    divTotal.className = 'nota-total';
    divTotal.innerHTML = `
        <span>Total:</span>
        <span>R$ ${total.toFixed(2)}</span>
        <br>
        <span>Valor Pago:</span>
        <span>R$ ${valorPago.toFixed(2)}</span>
        <br>
        <span>Troco:</span>
        <span>R$ ${troco.toFixed(2)}</span>
    `;
    notaContent.appendChild(divTotal);
    
    // Limpar venda
    itensVenda = [];
    atualizarItensVenda();
    calcularTotal();
    document.getElementById('valorPago').value = '';
    document.getElementById('troco').textContent = 'Troco: R$ 0.00';
}

function apagarNota() {
    const notaContent = document.getElementById('notaFiscalContent');
    notaContent.innerHTML = "";
    botaoDeApagarNotaFiscal.style.display = "none"
}

// Imprime a nota fiscal
function imprimirNota() {
    if (document.getElementById('notaFiscalContent').innerHTML.trim() === '') {
        alert('Nenhuma nota fiscal gerada.');
        return;
    }
    window.print();
}