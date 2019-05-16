let model = [], dataUsed;
let passed_iteration = 0;

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

            let td4 = document.createElement("td");
            let button = document.createElement("button");
            button.className = "save";
            button.addEventListener("click", async (t) => {await saveModel(t)});
            button.innerText = "sauvegarder";
            td4.appendChild(button);

            let td5 = document.createElement("td");
            td5.id = "console_loss" + document.getElementById("models").querySelectorAll("tr").length;
            td5.style.width = "100 px";

            tr.appendChild(td4);
            tr.appendChild(td5);


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
            const metrics = ['loss', 'val_loss'];
            const graphe_function = tfvis.show.fitCallbacks(document.getElementById("console_loss"+(i+1)), metrics).onEpochEnd;
            const callbacks = {onEpochEnd: (epoch, log) => {
                graphe_function(epoch, log);

                let loss = log.loss.toFixed(4);

                document.getElementById("console").innerText = `itération restante : ${(model.length*numRepetition)-(++passed_iteration)}/${model.length*numRepetition}`;

                if (passed_iteration===model.length*numRepetition) {
                    document.getElementById("console").innerText = "entrainement terminé";
                    passed_iteration = 0;
                }

                document.getElementById("models")
                    .querySelectorAll("tr")[i+1]
                    .getElementsByClassName("lossValue")[0].innerText = loss+'%';
                }};
            callbacks.onBatchEnd = null;

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

let saveModel = async e => {
    let name = prompt("nom du model :", "my-model");

    if (name) {
        let tr = e.target.parentNode.parentNode;
        let index = Array.from(document.getElementsByClassName("model")).indexOf(tr);

        await model[index].save("downloads://" + name);
    }
};