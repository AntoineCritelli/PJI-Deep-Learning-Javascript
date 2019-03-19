let genererData = nb => {
   let xs = [], ys = [];

   for (let i=0;i<nb;i++)
   {
       let hauteur = Math.floor(Math.random() * 400-1)+1;
       let largeur = Math.floor(Math.random() * 400-1)+1;

       let resultat = (hauteur*largeur<40000)?[1, 0]:[0, 1];

       xs.push([largeur, hauteur]);
       ys.push(resultat);
   }

   return [tf.tensor2d(xs), tf.tensor2d(ys)];
};