let createModel = (NBCouches, NBNeurones, activationType) => {

    // creation du model
    let model =  tf.sequential();

    // ajout de la couche d'entrée
    {
        model.add(
            tf.layers.dense(
                {
                    units: NBNeurones[0],
                    inputShape: [2],
                    activation: activationType
                }
            )
        );
    }

    // ajout des couches internes
    {
        for (let i = 1; i < NBCouches; i++) {
            model.add(
                tf.layers.dense(
                    {
                        units: NBNeurones[i],
                        //inputShape: [NBNeurones[i-1]],
                        activation: activationType
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
                    units: 2,
                    //inputShape: [NBNeurones[NBNeurones.length-1]],
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

let apprentissage = async (model, xs, ys, NBrepetition) => {

    // recuperation de la console
    const consol = document.getElementById(("console"));

    // creation de la configiration de l'apprentissage
    const config = {
        shuffle: true,
        epochs: NBrepetition,
        callbacks: {
            // affichage de la valeur du loss a la fin de chaque itération
            onEpochEnd: async (epoch, logs) => {
                console.log(logs.loss);
            },
            // affichage du numero d'etape au debut de chaque itération
            onEpochBegin : async (epoch) => {
                consol.innerText = `etape ${epoch+1} sur ${NBrepetition}.`;
            }
        }
    };

    // phase d'apprentissage
    const response = await model.fit(xs, ys, config);

    // indication de fin d'apprentissage
    consol.innerText = "apprentissage fini";
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
    let good=0; let dimension = xs.arraySync(), flag;
    for (let i=0;i<response.length;i++)
    {
        flag = false;
        if (response[i][0] > 0.5 && ys[i][0] == 1 || response[i][1] >= 0.5 && ys[i][1] == 1) {
            good++;
            flag = true;
        }

        affichage(dimension[i], i, flag, ctx, response[i][1]>=0.5)
    }
    console.log(good/response.length*100 + "%");
    return good/response.length*100;
};

let up=0, down = 0;
let affichage = (dimension, i, flag, ctx, haut) => {
    const width = parseInt(dimension[0]), height = parseInt(dimension[1]);

    if (flag)
        ctx.fillStyle = 'rgba(0, 200, 0, 1)';
    else
        ctx.fillStyle = 'rgba(200, 0, 0, 1)';


    ctx.beginPath();
    ctx.lineWidth = "2";
    ctx.strokeStyle = "black";


    let x, y;
    if (haut) {
        x = (up * 20) % 1400;
        y = 10 + 10 * (Math.floor((up * 20) / 1400));
        up++;
    }
    else {
        x = (down * 20) % 1400;
        y = 425 + 10 * (Math.floor((down * 20) / 1400));
        down++;
    }

    ctx.rect(x, y, width, height);
    ctx.fillRect(x, y, width, height);
    ctx.stroke();

};
