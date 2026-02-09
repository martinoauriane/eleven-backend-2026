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
bonnes pratiques: 
// - delete n'en supprime qu'un seul à la fois 
// - deleteMany en supprime plusieurs

Faire une migration: 
npx prisma migrate dev

générer le client: 
npx prisma generate

Vérifier que Prisma est bien connectée à la db: 
npx prisma db pull

GITHUB
Tester la connexion à GitHub: 
ssh -T git@github.com

BCRYPT
npm i bcryptjs

DONE: 
// - test user endpoints (DONE)

NEXT STEPS: 
// - gérer le processus pour joinRequestStore 
// - tester les endpoints pour joinRequestStore dans Postman
// - Ironic front-end interface in to modelize Figma




PRISMA QUERY METHODS
const qry = <GUID value>

const data = await prisma.user.findUnique({
    where: {
        id: qry,
    },
    select: {
        id: true,
        username: true,
        email: true,
        firstName: true,
        lastName: true
    },
});