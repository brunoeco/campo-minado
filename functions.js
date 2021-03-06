        const game = document.getElementById('game');

        const square = [];
        const filledSquare = [];

        //Inicia o jogo

        function createGame(){
            let restart = document.getElementById('div-0');

            createSquare();

            if(restart){ 
                document.getElementById('title').innerHTML = 'Iniciar'
                fillSquare(filledSquare);
                return;
            }



            for(let i = 0; i < 10; i++){
                let div = document.createElement('div');

                div.setAttribute('id', `div-${i}`);
                game.appendChild(div);

                for(let n = 0; n < 10; n++){
                    let id = n + (i*10);
                    let span = document.createElement('span');

                    span.setAttribute('id', `${id}`);
                    span.setAttribute('onclick', 'openSquare(id)')
                    document.getElementById(`div-${i}`).appendChild(span);
                    document.getElementById(`${id}`).innerHTML = '-'
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
            if(x === 10 - 1){
                posX[2] = 2;
            };
            if(y === 0){
                posY[0] = 2;
            };
            if(y === 10 - 1){
                posY[2] = 2;
            };

            return({posX, posY});
        }

        //Cria o campo minado

        function createSquare(){
            for(let i = 0; i < 10; i++){
                let tempSquare = []
                let tempFilledSquare = []
                for(let n = 0; n < 10; n++){
                    tempSquare[n] = 0;
                    tempFilledSquare[n] = '-';
                }
                square[i] = tempSquare;
                filledSquare[i] = tempFilledSquare;
            }

            for(let i = 0; i < 20; i++){
                let bombPositionX = Math.floor(Math.random() * 10);
                let bombPositionY = Math.floor(Math.random() * 10);

                 
                if(!(square[bombPositionX][bombPositionY] === '*')){
                    square[bombPositionX][bombPositionY] = '*';
                } else{
                    i--
                }
            }


            for(let x = 0; x < 10; x++){
                for(let y = 0; y < 10; y++){
                    if(square[x][y] === '*'){
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
                            if(square[x+(posX[i])][y+(posY[n])] === '*'){
                                bombs++;
                            }
                        }
                    }

                    square[x][y]= bombs;
                }
            }

        }

        //Preenche o campo

        function fillSquare(value, open = 0){
            console.log(value)
            for(let x = 0; x < 10; x++){
                for(let y = 0; y < 10; y++){
                    let id = y + (x*10);

                    if(filledSquare[x][y] === '-' && open === 1){
                        continue;
                    }

                    if(open === 1){
                        document.getElementById(`${id}`).classList.add('filled');
                    }else{
                        document.getElementById(`${id}`).classList.remove('filled');
                    }

                    document.getElementById(`${id}`).innerHTML = value[x][y];

                }
            }
            return;
        }

        //Abre o quadrado clicado

        function openSquare(e){
            let squareId = parseInt(e);
            let squareX = Math.floor(squareId/10);
            let squareY = squareId % 10;
            let open = 1;
            let zero = 0;


            if(square[squareX][squareY] === '*'){
                console.log('you lose');
                fillSquare(square);
                document.getElementById('title').innerHTML = 'Você perdeu... Restart!'
                return;
            }

            //Função recursiva para abrir casas ao lado

            function openAround(squareX, squareY){
                console.log(squareX, squareY);

                let pos = posXY(squareX, squareY);
                let posX = pos.posX
                let posY = pos.posY 

                for(let x = 0; x < 3; x++){
                    for(let y = 0; y < 3; y++){
                        if(posX[x] === 2 || posY[y] === 2 || (posX[x] === 0 && posY[y] === 0) || square[squareX+(posX[x])][squareY+(posY[y])] === '*'){
                            continue;
                        };

                        if(square[squareX+(posX[x])][squareY+(posY[y])] === 0 && filledSquare[squareX+(posX[x])][squareY+(posY[y])] === '-'){
                            filledSquare[squareX + (posX[x])][squareY + (posY[y])] = square[squareX + (posX[x])][squareY + (posY[y])];
                            zero ++;

                            openAround(squareX + (posX[x]), squareY + (posY[y]));
                        }else if(zero > 0) {
                            filledSquare[squareX + (posX[x])][squareY + (posY[y])] = square[squareX + (posX[x])][squareY + (posY[y])];

                        }
                    }
                }

                filledSquare[squareX][squareY] = square[squareX][squareY];

                fillSquare(filledSquare, open);
                
            }

            openAround(squareX, squareY);
        }