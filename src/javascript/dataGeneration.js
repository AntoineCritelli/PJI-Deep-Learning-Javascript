let genererData = nb => {
   let xs = [], ys = [];

   for (let i=0;i<nb;i++)
   {
       let nbLignes = randint(500);
       let nbAttributes = randint(20);
       let nbMethodes = randint(30);

       let creation = randint(30);
       let lastview = randint(creation);

       let normalized = normalize(nbLignes, 1, 500)
           + normalize(nbAttributes, 1, 20)
           + normalize(nbMethodes, 1, 30);

       let normalizeddate = normalize(creation, 1, 30)
           + normalize(lastview, 1, 30);

       normalized /= 3;
       normalizeddate /= 3;

       let resultat;
       if (normalized>=0.5)
           if (normalizeddate >= 0.5)
               resultat = [0, 1, 0, 0]; // en haut a droite
           else
               resultat = [1, 0, 0, 0]; // en haut a gauche
       else
           if (normalizeddate >= 0.5)
               resultat = [0, 0, 0, 1]; // en bas a droite
           else
               resultat = [0, 0, 1, 0]; // en bas a gauche

       xs.push([nbLignes, nbAttributes, nbMethodes, creation, lastview]);
       ys.push(resultat);
   }

   return [tf.tensor2d(xs), tf.tensor2d(ys)];
};


let randint = (max) => Math.floor(Math.random() * max-1)+1;


let normalize = (val, max, min) => (val - min) / (max - min);