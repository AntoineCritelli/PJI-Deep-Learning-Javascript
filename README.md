# PJI-Deep-Learning-Javascript

Ce projet consiste a testé la viabilité de l'intelligence artificielle dans le placement automatique d'éléments graphiques. Plus précisément, le placement des différents éléments dans un digramme de classe en fonction de différents critères (nombre de méthodes de la classe, nombre de lignes ...)

## Utilisation

Le projet s'articule autour de deux page html, la première index.html, permet de créer un réseau de neurone en définissant le nombre de couche du neurone, le nombre de neurone par couche et la fonction d’activation des couches. Après la création du réseau, il est possible de définir le nombre d’exemple d’entrainement ainsi que le nombre d’itération d’apprentissage sur ces exemples. Pendant l’apprentissage, un graphique affiche l’évolution de la valeur du loss. Une fois le modèle entrainé, il est possible de validé ce modèle. Pour ce faire, il est possible de choisir le nombre d’exemple de validation. Après les prédictions du modèle, un graphe affiche les résultats produit par le modèle. Les carrés verts sont les carrés bien placé par le réseau, les rouges sont des erreurs. En dessous de ce schéma apparaît la matrice de confusion du modèle sur les donné de validation.

La deuxième page, **benshmark.html**