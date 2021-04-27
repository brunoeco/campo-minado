        const game = document.getElementById('game');

        const square = [];
        const filledSquare = [];
        const fieldSize = 10;

        //Inicia o jogo
        
        document.addEventListener('load', createGame())

        function createGame(){
            let restart = document.getElementById('div-0');

            createSquare();

            if(restart){
                document.getElementById('title').querySelector('img').setAttribute('src', './assets/start.jpeg')

                fillSquare(filledSquare);
                return;
            }



            for(let i = 0; i < fieldSize; i++){
                let div = document.createElement('div');

                div.setAttribute('id', `div-${i}`);
                game.appendChild(div);

                for(let n = 0; n < fieldSize; n++){
                    let id = n + (i*fieldSize);
                    let img = document.createElement('img');

                    img.setAttribute('id', `${id}`);
                    img.setAttribute('onclick', 'openSquare(id)')
                    img.setAttribute('src', `./assets/fechado.jpeg`)
                    document.getElementById(`div-${i}`).appendChild(img);
                }
            }
        }

        //Define as posições para preenchimento

        function posXY(x, y){
            let posX = [-1, 0, 1];
            let posY = [-1, 0, 1]; 

            if(x === 0){
                posX[0] = 2;
            };
            if(x === fieldSize - 1){
                posX[2] = 2;
            };
            if(y === 0){
                posY[0] = 2;
            };
            if(y === fieldSize - 1){
                posY[2] = 2;
            };

            return({posX, posY});
        }

        //Cria o campo minado // MATRIZ

        function createSquare(){
            for(let i = 0; i < fieldSize; i++){
                let tempSquare = []
                let tempFilledSquare = []
                for(let n = 0; n < fieldSize; n++){
                    tempSquare[n] = 0;
                    tempFilledSquare[n] = 'fechado';
                }
                square[i] = tempSquare;
                filledSquare[i] = tempFilledSquare;
            }

            for(let i = 0; i < 20; i++){
                let bombPositionX = Math.floor(Math.random() * fieldSize);
                let bombPositionY = Math.floor(Math.random() * fieldSize);

                 
                if(!(square[bombPositionX][bombPositionY] === 'bomba')){
                    square[bombPositionX][bombPositionY] = 'bomba';
                } else{
                    i--
                }
            }


            for(let x = 0; x < fieldSize; x++){
                for(let y = 0; y < fieldSize; y++){
                    if(square[x][y] === 'bomba'){
                        continue;
                    }

                    let pos = posXY(x, y);
                    let posX = pos.posX
                    let posY = pos.posY 
                    let bombs = 0;

                    for(let i = 0; i < 3; i++){
                        for(let n = 0; n < 3; n++){
                            if(posX[i] === 2 || posY[n] === 2 || (posX[i] === 0 && posY[n] === 0)){
                                continue;
                            };
                            if(square[x+(posX[i])][y+(posY[n])] === 'bomba'){
                                bombs++;
                            }
                        }
                    }

                    square[x][y]= `aberto_${bombs}`;
                }
            }

        }

        //Preenche o campo

        function fillSquare(value, open = 0){
            for(let x = 0; x < fieldSize; x++){
                for(let y = 0; y < fieldSize; y++){
                    let id = y + (x*fieldSize);

                    if(filledSquare[x][y] === 'fechado' && open === 1){
                        continue;
                    }

                    if(open === 1){
                        document.getElementById(`${id}`).classList.add('filled');
                    }else{
                        document.getElementById(`${id}`).classList.remove('filled');
                    }

                    document.getElementById(`${id}`).setAttribute('src', `./assets/${value[x][y]}.jpeg`);

                }
            }
            return;
        }

        //Abre o quadrado clicado

        function openSquare(e){
            let squareId = parseInt(e);
            let squareX = Math.floor(squareId/fieldSize);
            let squareY = squareId % fieldSize;

            if(square[squareX][squareY] === 'bomba'){
                square[squareX][squareY] = 'bomba_1'

                fillSquare(square);
                document.getElementById('title').querySelector('img').setAttribute('src', './assets/restart.jpeg')
                return;
            }

            //Função recursiva para abrir casas ao lado

            openAround(squareX, squareY);
        }

        function openAround(squareX, squareY){
            let open = 1;
            let zero = 0;

            let pos = posXY(squareX, squareY);
            let posX = pos.posX
            let posY = pos.posY 

            for(let x = 0; x < 3; x++){
                for(let y = 0; y < 3; y++){
                    if(posX[x] === 2 || posY[y] === 2 || (posX[x] === 0 && posY[y] === 0) || square[squareX+(posX[x])][squareY+(posY[y])] === 'bomba'){
                        continue;
                    };

                    if(square[squareX+(posX[x])][squareY+(posY[y])] === 'aberto_0' && filledSquare[squareX+(posX[x])][squareY+(posY[y])] === 'fechado'){
                        filledSquare[squareX + (posX[x])][squareY + (posY[y])] = square[squareX + (posX[x])][squareY + (posY[y])];
                        zero ++;

                        openAround(squareX + (posX[x]), squareY + (posY[y]));
                    }
                    
                    if(zero > 0) {
                        filledSquare[squareX + (posX[x])][squareY + (posY[y])] = square[squareX + (posX[x])][squareY + (posY[y])];
                    }
                }
            }

            filledSquare[squareX][squareY] = square[squareX][squareY];

            fillSquare(filledSquare, open);
            
        }