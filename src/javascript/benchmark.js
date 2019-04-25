let model = [], dataUsed;


window.addEventListener("load", () => {

    // crée le model
    document.getElementById("createModel").addEventListener("click", () => {
        // recuperation du nombre de neurones par layers et des fonctions d'activations
        let layers = getLayersTable();
        let activations = getActivationTable();

        // creation du model
        model.push(createModel(layers, activations));

        // ajout du model a l'affichage
        {
            let tr = document.createElement("tr");
            tr.className = "model";
            tr.style.textAlign = "right";

            let td = document.createElement("td");
            td.className = "name";
            let a = document.createElement("a");
            a.href = "#";
            a.title = title(layers, activations);
            a.innerText = "Model " + model.length;

            let img = document.createElement("img");
            img.src = "assets/icon_interrogation.jpg";
            img.width = 15;
            img.height = 15;

            a.appendChild(img);
            td.appendChild(a);
            tr.appendChild(td);

            let td2 = document.createElement("td");
            let td3 = document.createElement("td");
            td2.className = "lossValue";
            td3.className = "validationValue";

            tr.appendChild(td2);
            tr.appendChild(td3);
            document.getElementById("models").appendChild(tr);
        }

    });

    // fait l'apprentissage du model
    document.getElementById("train").addEventListener("click", () => {
        const dataSize = document.getElementById("dataSize").value;
        const numRepetition = document.getElementById("repetition").value;

        const [xs, ys] = genererData(dataSize);
        dataUsed = [xs, ys];

        model.forEach((elt, i) => {
            // creation de la fonction pour le graphique
            let callbacks = {
                onEpochEnd: (epoch, log) => {
                    let loss = log.loss.toFixed(4);

                    document.getElementById("models")
                        .querySelectorAll("tr")[i+1]
                        .getElementsByClassName("lossValue")[0].innerText = loss+'%';
                }
            };

            // lancement de la fonction d'apprentissage
            apprentissage(elt, xs, ys, numRepetition, callbacks);
        });
    });

    // fait la verification du model
    document.getElementById("verificationButton").addEventListener("click", async () => {
        const nombreExemple = document.getElementById("nbverification").value;

        const [xs, ys] = genererData(nombreExemple);

        model.forEach((elt, i) => {
            const [pourcentage, prediction] = verification(elt, xs, ys.arraySync());

            document.getElementById("models")
                .querySelectorAll("tr")[i+1]
                .getElementsByClassName("validationValue")[0].innerText = pourcentage.toFixed(2)+'%';

            tf.dispose(prediction);
        });

        tf.dispose(xs);
        tf.dispose(ys);
    })


});

let title = (layers, activation) => {
    let res = "";
    layers.forEach((elt, i) => {
        res += "couche " + (i+1) + " : " + elt + " neurones (" + activation[i] + ")\n";
    });
    return res;
};