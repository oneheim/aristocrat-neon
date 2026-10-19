// Публикует папку dist в ветку gh-pages того же репозитория.
import { execSync } from 'node:child_process'

const run = (cmd, cwd = 'dist') => execSync(cmd, { cwd, stdio: 'inherit' })
const remote = execSync('git remote get-url origin').toString().trim()

run('git init -q -b gh-pages')
run('git add -A')
run('git -c user.name="aristocrat-neon deploy" -c user.email="deploy@users.noreply.github.com" commit -q -m "Deploy"')
run(`git push -f ${remote} gh-pages`)
console.log('Deployed to gh-pages')
