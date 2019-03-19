let genererData = nb => {
   let xs = [], ys = [];

   for (let i=0;i<nb;i++)
   {
       let nbLignes = randint(500);
       let nbAttributes = randint(20);
       let nbMethodes = randint(30);

       let normalized = normalize(nbLignes, 1, 500)
           + normalize(nbAttributes, 1, 20)
           + normalize(nbMethodes, 1, 30);

       normalized = normalized/3;

       let resultat;
       if (normalized>=0.5)
           resultat = [0, 1];
       else
           resultat = [1, 0];

       xs.push([nbLignes, nbAttributes, nbMethodes]);
       ys.push(resultat);
   }

   return [tf.tensor2d(xs), tf.tensor2d(ys)];
};


let randint = (max) => Math.floor(Math.random() * max-1)+1;


let normalize = (val, max, min) => (val - min) / (max - min);