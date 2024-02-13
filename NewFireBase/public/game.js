const gameRef = firebase.database().ref("Game");

const btnJoins = document.querySelectorAll(".btn-join");
btnJoins.forEach((btnJoin) => btnJoin.addEventListener("click", joinGame));

function joinGame(event){
    const currentUser = firebase.auth().currentUser;
    console.log("[Join] Current user", currentUser);
    if(currentUser){
        const btnJoinID = event.currentTarget.getAttribute("id");
        const player = btnJoinID[btnJoinID.length-1];
        const playerForm = document.getElementById(`inputPlayer-${player}`);
        if(playerForm.value == ""){
            // Add Player into database
            let tmpID = `user-${player}-id`;
            let tmpEmail = `user-${player}-email`;
            gameRef.child("game-1").update({
                [tmpID]: currentUser.uid,
                [tmpEmail]: currentUser.email,
            });
            console.log(currentUser.email + " added.");
        }
    }
}

gameRef.on("value", (snapshot) => {
    getGameInfo(snapshot);
})

function getGameInfo(snapshot) {
    document.getElementById("inputPlayer-x").value = "";
    document.getElementById("inputPlayer-o").value = "";

    snapshot.forEach((data) => {
        const gameInfo = data.val();
        Object.keys(gameInfo).forEach((key) => {
            switch (key) {
                case "user-x-email":
                    document.getElementById("inputPlayer-x").value = gameInfo[key];
                    document.querySelector("#btnJoin-x").disabled = true;
                    break;
                case "user-o-email":
                    document.getElementById("inputPlayer-o").value = gameInfo[key];
                    document.querySelector("#btnJoin-o").disabled = true;
                    break;
            }
        })
        if(gameInfo.isGameStart || document.getElementById("inputPlayer-o").value == "" || document.getElementById("inputPlayer-x").value == ""){
            document.querySelector("#btnStartGame").disabled = true;
            if(document.getElementById("inputPlayer-o").value != "" && document.getElementById("inputPlayer-x").value != ""){
                document.querySelector("#btnTerminateGame").disabled = false;
            }
            if(gameInfo.isGameStart){
                btnCancelJoins.forEach(function(btnCancel){
                    btnCancel.disabled = true
                })
                for(let i = 1; i <= 3; i++){
                    for(let j = 1; j <= 3;j++){
                        document.querySelector(`#row-${i}-col-${j}`).addEventListener("click", addTableListener)
                    }
                }
            }
        }else if(!gameInfo.isGameStart){
            document.querySelector("#btnStartGame").disabled = false;
            document.querySelector("#btnTerminateGame").disabled = true;
            btnCancelJoins.forEach(function(btnCancel){
                btnCancel.disabled = false
            })
            for(let i = 1; i <= 3; i++){
                for(let j = 1; j <= 3;j++){
                    document.querySelector(`#row-${i}-col-${j}`).removeEventListener("click", addTableListener)
                }
            }
        }
    })
}

const btnCancelJoins = document.querySelectorAll(".btn-cancel-join-game");
btnCancelJoins.forEach((btnCancel) => btnCancel.addEventListener("click", cancelJoin));

function cancelJoin(event) {
    const currentUser = firebase.auth().currentUser;
    console.log("[Cancel] Current user:", currentUser);
    if (currentUser) {
        const btnCancelID = event.currentTarget.getAttribute("id");
        const player = btnCancelID[btnCancelID.length-1];

        const playerForm = document.getElementById(`inputPlayer-${player}`);
        if (playerForm.value && playerForm.value === currentUser.email){
            // Delete player from database
            let tmpID = `user-${player}-id`;
            let tmpEmail = `user-${player}-email`;
            gameRef.child("game-1").child(tmpID).remove();
            gameRef.child("game-1").child(tmpEmail).remove();
            console.log(`delete on id: ${currentUser.uid}`);
            document.querySelector(`#btnJoin-${player}`).disabled = false;
        }
        if(player == "x"){
            document.getElementById("inputPlayer-o").value == "" ? document.querySelector("#btnJoin-o").disabled = false : document.querySelector("#btnJoin-o").disabled = true
        }else{
            document.getElementById("inputPlayer-x").value == "" ? document.querySelector("#btnJoin-x").disabled = false : document.querySelector("#btnJoin-x").disabled = true
        }
    }
}

const btnStart = document.querySelector("#btnStartGame");
btnStart.addEventListener("click", function(){gameRef.child("game-1").update({isGameStart : true})});

const btnEnd = document.querySelector("#btnTerminateGame");
btnEnd.addEventListener("click", function(){gameRef.child("game-1").update({isGameStart : false})});

function addTableListener(event){
    console.log(event.target.id)
}

