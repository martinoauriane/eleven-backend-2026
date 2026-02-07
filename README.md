SERVER
Installer Express:
npm install express

BASE DE DONNEES
PSQL 
Se connecter à la db: 
psql -U nirvana -d eleven_db -h localhost -p 5432

Afficher les tables: 
\l

PRISMA 
générer le client: 
npx prisma generate

Faire une migration: 
npx prisma migrate

Vérifier que Prisma est bien connectée à la db: 
npx prisma db pull

GITHUB
Tester la connexion à GitHub: 
ssh -T git@github.com

BCRYPT
npm i bcryptjs

NEXT STEPS: 
- test user endpoints