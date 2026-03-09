SERVER
Installer Express:
npm install express

Lancer le serveur: 
npm run serve

BASE DE DONNEES
PSQL
Se connecter à la db:
psql -U nirvana -d eleven_db -h localhost -p 5432

Afficher les tables:
\l

PRISMA
> bonnes pratiques:
> // - delete n'en supprime qu'un seul à la fois
> // - deleteMany en supprime plusieurs

FAIRE UNE MIGRATION (EN DEUX TEMPS)
1. Faire une migration:
   npx prisma migrate dev

2. Puis, il faut nécessairement re-générer le client:
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
// - gérer le processus pour joinRequestStore
// - tester les endpoints pour joinRequestStore dans Postman
// - create friendRequest endpoints (follow the model of JoinRequest, it's exactly the same format)
// - test friendRequest endpoints (follow the model of JoinRequest, it's exactly the same format)
// - créer le service Event le store et le controller
// - tester les endpoints Event
// - créer le store EventPeople, Endpoint et service
// - Quand des gens supplémentaires sont ajoutés ça correspond à un update
// - Tester les endpoints EventPeople
// - Tester les deux nouvelles méthodes dans l'endpoint Event: ajouter et retirer des participants

TO DO:
// - Ironic front-end interface in to modelize Figma
// - add getAll() Method for users
// - réfléchir à l'interface du front (Figma)

PRISMA QUERY METHODS
const query = <GUID value>

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
