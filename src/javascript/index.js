let model;


window.addEventListener("load", () => {
    document.getElementById("createModel").addEventListener("click", () => {
        if (model !== null)
            tf.dispose(model);

        // recuperation du nombre de neurones par layers et des fonctions d'activations
        let layers = getLayersTable();
        let activations = getActivationTable();

        // creation du model
        model = createModel(layers, activations);

        // affichage des options d'apprentissage
        document.getElementById("apprentissage").style.display = "block";
    });

    document.getElementById("train").addEventListener("click", () => {
        const dataSize = document.getElementById("dataSize").value;
        const numRepetition = document.getElementById("repetition").value;

        const [xs, ys] = genererData(dataSize);

        // creation de la fonction pour le graphique
        const metrics = ['loss', 'val_loss'];
        const callbacks = tfvis.show.fitCallbacks(document.getElementById("console2"), metrics);
        callbacks.onBatchEnd = null;
        callbacks.onTrainEnd = () => {
            // affiche les options de verification quand leapprentissage est fini
            document.getElementById("verification").style.display = "block";
        };

        // lancement de la fonction d'apprentissage
        apprentissage(model, xs, ys, numRepetition, callbacks);
    });

    document.getElementById("verificationButton").addEventListener("click", async () => {
        const nombreExemple = document.getElementById("nbverification").value;

        const [xs, ys] = genererData(nombreExemple);

        const [pourcentage, prediction] = verification(model, xs, ys.arraySync());

        document.getElementById("resultatVerification").innerText = pourcentage+"%";

        // calcule de la matrice de confusion
        const confusionMatrix = await tfvis.metrics.confusionMatrix(
            ys.argMax([-1]),
            prediction.argMax([-1]),
            4
        );

        console.log(ys.arraySync()[0]);
        console.log(prediction.arraySync()[0]);

        // affichage de la matrice
        const container = document.getElementById("console3");
        tfvis.render.confusionMatrix(container, {
            values: confusionMatrix,
            tickLabels: ["Haut-gauche", "Haut-droite", "Bas-gauche", "Bas-droite"]
        });


        tf.dispose(xs);
        tf.dispose(ys);
        tf.dispose(prediction);
        tf.dispose(confusionMatrix);
    })
});