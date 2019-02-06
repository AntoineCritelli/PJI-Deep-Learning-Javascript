import random

table = []

with open("training/xs.js", 'w') as f :
    f.write("const xs = [\n");
    for i in range(0, 10000) :
        x = random.randint(1, 500)
        y = random.randint(1, 500)
        table += [[x, y]]
        f.write("[" + str(x) + "," + str(y) + "]," + "\n")
    f.write("];");

with open("training/ys.js", "w") as f :
    f.write("const ys = [\n");
    for t in table :
        if t[0] * t[1] < 125000 :
            f.write("[1,0],\n")
        else :
            f.write("[0,1],\n")
    f.write("];");


table = []

with open("testing/xs.js", 'w') as f :
    f.write("const Txs = [\n");
    for i in range(0, 200) :
        x = random.randint(1, 500)
        y = random.randint(1, 500)
        table += [[x, y]]
        f.write("[" + str(x) + "," + str(y) + "]," + "\n")
    f.write("];");

with open("testing/ys.js", "w") as f :
    f.write("const Tys = [\n");
    for t in table :
        if t[0] * t[1] < 125000 :
            f.write("[1,0],\n")
        else :
            f.write("[0,1],\n")
    f.write("];");
