/**
 *
 * @param NBNeurones une liste de nombre corresondant au nombre de neurones par couche
 * @param activationType une liste de fonction d'activation
 * @returns {*} le model
 */
let createModel = (NBNeurones, activationType) => {

    // creation du model
    let model =  tf.sequential();

    // ajout de la couche d'entrée
    {
        model.add(
            tf.layers.dense(
                {
                    units: NBNeurones[0],
                    inputShape: [5],
                    activation: activationType[0]
                }
            )
        );
    }

    // ajout des couches internes
    {
        for (let i = 1; i < NBNeurones.length; i++) {
            model.add(
                tf.layers.dense(
                    {
                        units: NBNeurones[i],
                        activation: activationType[i]
                    }
                )
            );
        }
    }

    // ajout de l'output
    {
        model.add(
            tf.layers.dense(
                {
                    units: 4,
                    activation: 'softmax'
                }
            )
        );
    }

    // compilation
    const sgdOpt = tf.train.sgd(0.1); // 0.1 : learning rate
    model.compile({loss: 'meanSquaredError', optimizer: sgdOpt});

    return model;
};

let apprentissage = async (model, xs, ys, NBrepetition, fitCallbacks) => {

    // creation de la configiration de l'apprentissage
    const config = {
        shuffle: true,
        epochs: NBrepetition,
        callbacks: fitCallbacks
        //validationSplit: 0.1,
    };

    // phase d'apprentissage
    const response = await model.fit(xs, ys, config);
};

let verification = (model, xs, ys) => {

    // prediction
    let output = model.predict(xs);

    // recuperation des données
    let response = output.arraySync();

    // recuperation du canvas
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    // affichage et calcul du pourcentage de réussite
    let good=0, flag;
    for (let i=0;i<response.length;i++)
    {
        flag = false;
/*        if ((response[i][0] > 0.5 && ys[i][0] == 1) && (response[i][2] > 0.5 && ys[i][2] == 1)
            || (response[i][1] >= 0.5 && ys[i][1] == 1) && (response[i][3] >= 0.5 && ys[i][3] == 1)) {
            good++;
            flag = true;
        }

        */
        let indexMax = response[i].indexOf(Math.max(...response[i]));
        if (ys[i][indexMax] === 1)
        {
            good++;
            flag = true;
        }
        affichage(flag, ctx,
            indexMax === 0 || indexMax === 1,
            indexMax === 0 || indexMax === 2)
    }
    //console.log(good/response.length*100 + "%");
    return [good/response.length*100, output];
};



let up=0, down = 0, right = 0, left = 0;
let affichage = (flag, ctx, haut, gauche) => {
    const width = 200, height = 200;

    if (flag)
        ctx.fillStyle = 'rgba(0, 200, 0, 1)';
    else
        ctx.fillStyle = 'rgba(200, 0, 0, 1)';


    ctx.beginPath();
    ctx.lineWidth = "2";
    ctx.strokeStyle = "black";


    let x, y;
    if (haut) {
        y = 10 + 10 * (Math.floor((up * 20) / 1400));
        up++;
    }
    else {
        y = 425 + 10 * (Math.floor((down * 20) / 1400));
        down++;
    }
    if (gauche)
    {
        x = (left * 20) % 600;
        left++;
    }
    else
    {
        x = 650 + (right * 20) % 600;
        right++;
    }

    ctx.rect(x, y, width, height);
    ctx.fillRect(x, y, width, height);
    ctx.stroke();

};
