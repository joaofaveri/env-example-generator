/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-require-imports */
const { execSync } = require('child_process')
/**
 * Obtém os contribuidores do último release e resolve seus nomes de usuário no GitHub.
 */
async function getContributors() {
  try {
    // Obtém a tag mais recente de forma segura
    const lastTag = execSync('git describe --tags --abbrev=0', {
      encoding: 'utf-8'
    }).trim()

    // Usa a tag para obter os e-mails dos commits desde essa versão
    const output = execSync(`git log --format='%ae' ${lastTag}..HEAD`, {
      encoding: 'utf-8'
    })

    // Processa a saída para remover duplicatas
    const emails = [
      ...new Set(
        output
          .split('\n')
          .map(email => email.trim().replace(/^['"]|['"]$/g, ''))
          .filter(email => email)
      )
    ]

    if (emails.length === 0) {
      console.log('')
      return []
    }

    // Mapeia os e-mails para nomes de usuário do GitHub
    const usernames = await Promise.all(
      emails.map(async email => {
        try {
          const response = await fetch(
            `https://api.github.com/search/users?q=${email}+in:email`
          )
          const data = await response.json()
          if (!response.ok)
            throw new Error(`GitHub API error: ${response.status}`)
          if (data.items && data.items.length > 0) {
            return `@${data.items[0].login}` // Retorna o nome de usuário do GitHub
          }
        } catch (error) {
          return error
        }
      })
    )

    return usernames
  } catch (error) {
    console.error('❌ Error fetching contributors:', error.message)
    process.exit(1)
  }
}

// ✅ Executando a função corretamente dentro de um IIFE
;(async () => {
  const contributors = await getContributors()
  console.log(contributors.join(', '))
})()
