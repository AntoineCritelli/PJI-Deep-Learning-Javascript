/**
 * change le nombre de neurone
 * @param e l'event
 * @param n si n > 0, ajout un neurone, si n < 0, supprime un neurone
 */
let changeNumberNeurone = (e, n) => {
    let parent = e.target.parentNode;
    let target = parent.getElementsByClassName("nombreNeurone")[0];
    let valeur = parseInt(target.innerText.split(" ")[0]);

    // changement de l'affichage textuelle du nombre de neurone
    {
        if (valeur + n === 1)
            target.innerText = (valeur + n) + " neurone";
        else if (valeur + n > 0)
            target.innerText = (valeur + n) + " neurones";
    }

    // changement de l'affichage "graphique" du nombre de neurone
    if (valeur+n > 0)
    {
        let numLayer = parent.id.substr(5, 1);
        if (n < 0) // si n est negatif, on rend inactif le neurone corresondant
        {
            let neurones = document.getElementById("neurone"+valeur);
            let neuroneToRemove = neurones.querySelectorAll("td")[numLayer-1];
            neuroneToRemove.className = "inactif";
            neuroneToRemove.innerHTML = "";
        } else if (n > 0) // si on ajout un neurone
        {
            let neurones = document.getElementById("neurone"+(valeur+n));
            if (neurones == null) // on regarde s'il existe une ligne pour ce seurone
            {
                // Creation du tr avec le numero de neurone assosié
                let tr = document.createElement("tr");
                tr.id = "neurone"+(valeur+n);
                document.getElementById("network").querySelector("tbody").appendChild(tr);
                neurones = document.getElementById("neurone"+(valeur+n));
            }

            let allNeurones = neurones.querySelectorAll("td");
            if (allNeurones.length >= numLayer) // on regarde s'il existe la case pour ce neurone
            {
                //changer le td en neurone actif
                allNeurones[numLayer-1].className = "actif";
                allNeurones[numLayer-1].innerText = "°";
            } else {
                //créer le bon nombre de neurone inactif et ajouter le neurone actif
                for (let i=allNeurones.length;i<(numLayer-1);i++)
                {
                    let td = document.createElement("td");
                    td.className = "inactif";

                    neurones.appendChild(td);
                }


                let td = document.createElement("td");
                td.className = "actif";
                td.innerText = "°";

                neurones.appendChild(td);
            }
        }
    }
};

/**
 * change le nombre de layer
 * @param n si n positif appelle ajoutLayers, si n negatif appelle removeLayers
 */
let changeNumberLayer = (n) => {
    let nombre = document.getElementById("numberLayers");
    value = parseInt(nombre.innerText);

    if (value+n > 0)
        nombre.innerText = value+n;

    if (n > 0)
        addLayers();
    else if (value+n > 0)
        removeLayers();
};

/**
 * Ajout une colonne dans le tableau (colonne representant un layer)
 */
let addLayers = () => {
    let controller = document.getElementById("layersController");

    // ajout des boutons et du texte pour les nouveaux layers
    {
        let td = document.createElement("td");
        let numLayer = controller.querySelectorAll("td").length+1;
        td.id = "layer" + numLayer + "Controller";

        let btnplus = document.createElement("button");
        btnplus.addEventListener("click", (e) => changeNumberNeurone(e, 1));
        btnplus.className = "plusN";
        btnplus.innerText = "+";

        let btnminus = document.createElement("button");
        btnminus.addEventListener("click", (e) => changeNumberNeurone(e, -1));
        btnminus.className = "plusN";
        btnminus.innerText = "-";

        let text = document.createElement("div");
        text.className = "nombreNeurone";
        text.innerText = "1 neurone";

        td.appendChild(btnminus);
        td.appendChild(btnplus);
        td.appendChild(text);
        controller.appendChild(td);
    }

    // ajout du premier neurone du layer
    {
        let n1 = document.getElementById("neurone1");
        let td = document.createElement("td");
        td.className = "actif";
        td.innerText = "°";

        n1.appendChild(td);
    }

    // ajout de la selection de la fonction d'activation
    {
        let td = document.createElement("td");
        let select = document.createElement("select");
        let fonctions = ["elu", "LeakyReLU", "PReLU", "relu", "Softmax", "ThresholdedReLU"];
        fonctions.forEach((e) => {
            let option = document.createElement("option");
            option.value = e;
            option.innerText = e;
            select.appendChild(option);
        });
        td.appendChild(select);
        document.getElementById("selectionFonctionActivation").querySelector("tr").appendChild(td);
    }

};

/**
 * supprime une colonne dans le tableau (colonne representant un layer)
 */
let removeLayers = () => {
    let nbNeurone;

    // suppression du controller du layer
    {
        let controller = document.getElementById("layersController");
        let controllerLayerToRemove = controller.querySelector("td:last-child");
        nbNeurone = controllerLayerToRemove.getElementsByClassName("nombreNeurone")[0].innerText.split(" ")[0];
        controller.removeChild(controllerLayerToRemove);
    }

    // suppression des neurones du layers
    {
        for (let i = 1; i <= nbNeurone; i++) {
            let neurone = document.getElementById("neurone" + i);
            let neuroneToRemove = neurone.querySelector("td:last-child");
            neurone.removeChild(neuroneToRemove);
        }
    }

    // suppresion de la selection de la fonction d'activation du layer
    {
        let tfoot = document.getElementById("selectionFonctionActivation");
        let selectToRemove = tfoot.querySelector("tr td:last-child");
        tfoot.querySelector("tr").removeChild(selectToRemove);
    }
};

/**
 * retourne une liste representant les layers contenant le nombre de neurone
 * ex : [2, 1] = 2 layers avec 2 neurones pour le premier et 1 neurone plus le deuxieme
 */
let getLayersTable = () => {
    let layers = [];
    let numberLayers = document.getElementById("numberLayers").innerText;
    for (let i=0;i<numberLayers;i++)
        layers.push(1);

    let i = 2;
    do {
        let neurones = document.getElementById("neurone"+i);
        Array.from(neurones.querySelectorAll("td")).forEach((e, i) => {
            if (e.className === "actif")
                layers[i] += 1;
        });
        i++;
    } while (document.getElementById("neurone"+i) !== null);

    return layers;
};

/**
 * retourne la liste des fonctions d'activations des layers
 * @returns {Array} la liste des fonction d'activation des layers
 */
let getActivationTable = () => {
    let activations = [];
    Array.from(document.getElementById("selectionFonctionActivation").querySelectorAll("select")).forEach(e => {
        activations.push(e.value);
    });

    return activations;
};

window.addEventListener("load", () => {

    // affecte la fonction de changement a tous les bouton plus
    let plus = document.getElementsByClassName("plusN");
    Array.from(plus).forEach(e => {
        e.addEventListener("click", (e) => changeNumberNeurone(e, 1));
    });

    // affecte la fonction de changement a tous les bouton moin
    let minus = document.getElementsByClassName("minusN");
    Array.from(minus).forEach(e => {
        e.addEventListener("click", (e) => changeNumberNeurone(e, -1));
    });

    // affecte la fonction de changement du nombre de layer
    document.getElementById("addLayer").addEventListener("click", () => changeNumberLayer(1));
    document.getElementById("removeLayer").addEventListener("click", () => changeNumberLayer(-1));



});