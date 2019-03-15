let model;

window.addEventListener("load", () => {

    // creation d'un reseau de neurone
    document.getElementById("create").addEventListener("click", () => {

        // suppression du model si il exite
        if (model != undefined)
            tf.dispose(model);

        // recuperation des inputs
        const inputNBCouches = parseInt(document.getElementById("couches").value);
        let inputNBNeurones = [];
        for (let i=0;i<inputNBCouches;i++) {
            inputNBNeurones.push(parseInt(document.getElementById(`neurones${i+1}`).value));
        }
        const activationType = document.getElementById("activation").value;
        let activationTypeList = [];
        for (let i=0;i<inputNBNeurones.length;i++)
        {
            activationTypeList.push(activationType);
        }

        // creation du model
        model = createModel(inputNBNeurones, activationTypeList);
    });

    // apprentissage du reseau
    document.getElementById("train").addEventListener("click", () => {

        // recuperation des inputs
        const inputNBrepetition = parseInt(document.getElementById("repetition").value);
        const nombreExemple = parseInt(document.getElementById("exemple").value);

        // creation des données pour l'apprentissage
        const data = genererData(nombreExemple);

        // apprentissage
        apprentissage(model, data[0], data[1], inputNBrepetition);
    });

    // verification du reseau
    document.getElementById("verification").addEventListener("click", () => {

        // recuperation des inputs
        const canvas = document.getElementById("canvas");
        canvas.style.display = "block";
        const nombreExemple = parseInt(document.getElementById("nbverification").value);
        const consol = document.getElementById("console");

        // recuperation des données pour la verification
        const data = genererData(nombreExemple);

        // veridication
        let pourcentage = verification(model, data[0], data[1].arraySync())[0];

        consol.innerText = `taux de réusite : ${pourcentage}%`;
    });

    // creation des lignes pour les layers
    document.getElementById("couches").addEventListener("keyup", (e) => {
        let tr = e.target.parentNode.parentNode;

        // suppression des lignes deja existante
        {
            let child = document.getElementsByClassName("toRemove");
            if (child.length > 0) {
                for (let l = child.length - 1; l > 0; l--) {
                    tr.parentNode.removeChild(child[l]);
                }
                tr.parentNode.removeChild(child[0]);
            }
        }


        // creation des lignes pour les couches de neurones
        for (let i=e.target.value;i>0;i--) {
            let node = document.createElement("tr");
            node.className = "toRemove";
            let td = document.createElement("td");
            let label = document.createElement("label");
            label.innerText = `Nombre de neurone pour la couche ${i} :`;

            let td2 = document.createElement("td");
            let input = document.createElement("input");
            input.type = "number";
            input.min = 1;
            input.value = i;
            input.id = `neurones${i}`;

            td2.appendChild(input);
            td.appendChild(label);
            node.appendChild(td);
            node.appendChild(td2);
            tr.parentNode.insertBefore(node, tr.nextSibling);
        }
    });

});