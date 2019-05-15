const MAX_NB_LIGNES = 500; // nombre max de ligne d'une classe
const MAX_NB_ATTRIBUTES = 20; // nombre max d'attributs d'une classe
const MAX_NB_METHODES = 30; // nombre max de methodes d'une classe
const MAX_NB_JOUR_CREATION = 30; // nombre max de jour depuis la creation d'une classe

let genererData = nb => {
   let xs = [], ys = [];

   for (let i=0;i<nb;i++)
   {
       let nbLignes = randint(MAX_NB_LIGNES);
       let nbAttributes = randint(MAX_NB_ATTRIBUTES);
       let nbMethodes = randint(MAX_NB_METHODES);

       let creation = randint(MAX_NB_JOUR_CREATION);
       let lastview = randint(creation);

       let normalizedClasse = normalize(nbLignes, 1, 500)
           + normalize(nbAttributes, 1, 20)
           + normalize(nbMethodes, 1, 30);

       let normalizedDate = normalize(creation, 1, 30)
           + normalize(lastview, 1, 30);

       normalizedClasse /= 3;
       normalizedDate /= 3;

       let resultat;
       if (normalizedClasse>=0.5)
           if (normalizedDate >= 0.5)
               resultat = [0, 1, 0, 0]; // en haut a droite
           else
               resultat = [1, 0, 0, 0]; // en haut a gauche
       else
           if (normalizedDate >= 0.5)
               resultat = [0, 0, 0, 1]; // en bas a droite
           else
               resultat = [0, 0, 1, 0]; // en bas a gauche

       xs.push([nbLignes, nbAttributes, nbMethodes, creation, lastview]);
       ys.push(resultat);
   }

   return [tf.tensor2d(xs), tf.tensor2d(ys)];
};


let randint = (max) => Math.floor(Math.random() * max-1)+1;


let normalize = (val, min, max) => (val - min) / (max - min);