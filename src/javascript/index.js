let model, dataUsed;


window.addEventListener("load", () => {

    // crée le model
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
        document.getElementById("saveModel").style.display = "inline-block";
    });

    // fait l'apprentissage du model
    document.getElementById("train").addEventListener("click", () => {
        const dataSize = document.getElementById("dataSize").value;
        const numRepetition = document.getElementById("repetition").value;

        const [xs, ys] = genererData(dataSize);
        dataUsed = [xs, ys];

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

    // fait la verification du model
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

    // sauvegarde le model
    document.getElementById("saveModel").addEventListener("click", async () => {
        let name = prompt("nom du model :", "my-model");

        if (name)
            await model.save("downloads://"+name);
    });

    // charge un model
    // TODO resoudre le probleme de chargement de model
    document.getElementById("loadModel").addEventListener("click", async () => {
        model = await tf.loadLayersModel('downloads://my-model').then(r => console.log(r));

        //document.getElementById("loadModelPosition").click();
    });

    document.getElementById("loadModelPosition").addEventListener("change", async () => {
        let inputFile = document.getElementById("loadModelPosition");

        model = await tf.loadLayersModel(inputFile.value).then(r => console.log(r));
    });
});