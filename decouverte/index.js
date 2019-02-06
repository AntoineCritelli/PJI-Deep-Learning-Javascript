let createModel = () => {

	// creation du model
    const model =  tf.sequential();

	// recuperation des input
    const inputNBCouches = parseInt(document.getElementById("couches").value);
    const inputNBNeurones = parseInt(document.getElementById("neurones").value);
    const activationType = document.getElementById("activation").value;
    const consoleText = document.getElementById("console");
    const canvas = document.getElementById("canvas");
    let ctx = canvas.getContext('2d');

	// ajout de la couche d'entrée
    model.add(
        tf.layers.dense(
            {
                units: inputNBNeurones,
                inputShape: [2],
                activation: activationType
            }
        )
    );

    // ajout des couches internes
    for (let i = 0; i < inputNBCouches; i++) {
        model.add(
            tf.layers.dense(
                {
                    units: inputNBNeurones,
                    activation: activationType
                }
            )
        );
    }

    // ajout de l'output
    model.add(
        tf.layers.dense(
            {
                units: 2,
                activation: 'softmax'
            }
        )
    );

    const sgdOpt = tf.train.sgd(0.1);
    model.compile({loss: 'meanSquaredError', optimizer: sgdOpt});

    // prediction before training
    {
        console.log("Previous training");

        let output = model.predict(tf.tensor2d(Txs, [200, 2]));
        const test = output.dataSync();

        let good = 0;
        for (let i=0;i<200;i++)
        {
            if (Tys[i][0] == 1 && test[i*2] > 0.5)
                good ++;
        }
        console.log(good/2 + "%");

    }


// fonction de train
    let train = async (xs, ys) => {

        consoleText.innerText = "Training ...";

        const config = {
            epochs: 10,
            shuffle: true
        };
        const response = await model.fit(xs, ys, config);
        console.log(response.history.loss[0]);
    };

//verification
    train(tf.tensor2d(xs, [10000, 2]), tf.tensor2d(ys, [10000, 2])).then(() => {
        console.log("training complete");
        consoleText.innerText = "Validation ...";

        let output = model.predict(tf.tensor2d(Txs, [200, 2]));
        const test = output.dataSync();

        let good = 0;
        let up = 0, down = 0;
        for (let i = 0; i < 200; i++) {
            let flag = false;
            if (Tys[i][0] == 1 && test[i * 2] > 0.5) {
                good++;
                flag = true;
            }

            // affichage temps reel
            if (flag) {
                ctx.fillStyle = 'rgba(0, 0, 200, 0.1)';
                ctx.fillRect((up*20)%1400, 10*(1+Math.floor((up*20)/1400)), parseInt(Txs[i][0]), parseInt(Txs[i][1]));
                up++;
            } else {
                ctx.fillStyle = 'rgba(200, 0, 0, 0.1)';
                ctx.fillRect((down*20)%1400, 425*(1+Math.floor((down*20)/1400)), parseInt(Txs[i][0]), parseInt(Txs[i][1]));
                down++;
            }
        }
        consoleText.innerText = "Training complete";

        // affichage resultat
        console.log(good/2 + "%");
        consoleText.innerText += "\n";
        consoleText.innerText += "validation : ";
        consoleText.innerText += (good/Txs.length)*100 + "%";
    });

};


window.addEventListener("load", () => {
    document.getElementById("train").addEventListener("click", () => {
        tf.tidy(createModel);
    });


});