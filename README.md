
# Check-SQL-Injection

Check-SQL-Injection é uma ferramenta desenvolvida para realizar a verificação de vulnerabilidades de **SQL Injection** e escanear diretórios e arquivos sensíveis comuns em sites. A ferramenta oferece duas funcionalidades principais: (1) **Scanner de Diretórios** e (2) **Teste de SQL Injection**.

A primeira funcionalidade permite que você busque por diretórios e arquivos comuns e sensíveis, como `/admin/`, `/config/`, `.git/`, `wp-config.php`, entre outros, verificando se eles estão acessíveis. Já a segunda funcionalidade realiza a verificação de vulnerabilidades de SQL Injection em URLs ou caminhos específicos, utilizando uma série de payloads de SQL Injection conhecidos.

## Como Instalar

Para instalar e executar o projeto, siga as etapas abaixo:

1. Clone o repositório usando o comando:
   ```bash
   git clone https://github.com/Jean13331/Check-SQL-Injection.git
   ```

2. Acesse o diretório do projeto:
   ```bash
   cd Check-SQL-Injection
   ```

3. Instale as dependências utilizando o `npm`:
   ```bash
   npm install
   ```

## Como Usar

Depois de instalar as dependências, você pode rodar o script com o seguinte comando:

```bash
node sql_injection_checker.js
```

O script exibirá um menu com as opções de operação:

1. **Fazer scanner de diretórios e testar SQL Injection**: O script irá buscar por diretórios e arquivos sensíveis conhecidos e, para cada um encontrado, realizará o teste de SQL Injection.
2. **Testar SQL Injection em um caminho específico**: Você pode fornecer uma URL específica para testar se ela é vulnerável a SQL Injection.

O script testará a URL ou diretório com alguns payloads comuns de SQL Injection e exibirá se o site é vulnerável a este tipo de ataque. Ao final, será gerado um relatório com os seguintes resultados:

- Diretórios e arquivos sensíveis encontrados.
- URLs ou caminhos vulneráveis a SQL Injection.

Exemplo de execução no terminal:

```bash
Selecione uma opção:
1 - Fazer scanner de diretórios e testar SQL Injection.
2 - Testar SQL Injection em um caminho específico.

Digite o número da opção desejada: 1
Digite a URL do site para escanear: http://example.com

🔍 Iniciando scanner de diretórios/arquivos sensíveis na URL base: http://example.com
...
📋 RELATÓRIO FINAL 📋
```

## Aviso Legal

Este script **deve ser utilizado apenas em sites que você tenha permissão explícita para testar**. Realizar testes de segurança sem a devida autorização é ilegal e pode resultar em sanções legais. **Use com responsabilidade.**
