const gameRef = firebase.database().ref("Game");

const btnJoins = document.querySelectorAll(".btn-join");
btnJoins.forEach((btnJoin) => btnJoin.addEventListener("click", joinGame));

let table = [
    "0", "1", "2",
    "3", "4", "5",
    "6", "7", "8",]

function joinGame(event) {
    const currentUser = firebase.auth().currentUser;
    console.log("[Join] Current user", currentUser);
    if (currentUser) {
        const btnJoinID = event.currentTarget.getAttribute("id");
        const player = btnJoinID[btnJoinID.length - 1];
        const playerForm = document.getElementById(`inputPlayer-${player}`);
        if (playerForm.value == "") {
            // Add Player into database
            let tmpID = `user${player}id`;
            let tmpEmail = `user${player}email`;
            gameRef.child("game-1").update({
                [tmpID]: currentUser.uid,
                [tmpEmail]: currentUser.email,
                userwin: ""
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
        let turn = data.val().turn
        let table = data.val().table
        let userwin = data.val().userwin
        let userxid = data.val().userxid
        let useroid = data.val().useroid
        Object.keys(gameInfo).forEach((key) => {
            switch (key) {
                case "userxemail":
                    document.getElementById("inputPlayer-x").value = gameInfo[key];
                    document.querySelector("#btnJoin-x").disabled = true;
                    break;
                case "useroemail":
                    document.getElementById("inputPlayer-o").value = gameInfo[key];
                    document.querySelector("#btnJoin-o").disabled = true;
                    break;
            }
        })
        if (document.querySelector("#inputPlayer-x").value != "" && document.querySelector("#inputPlayer-o").value != "" & !gameInfo.isGameStart) {
            document.querySelector("#text-announcement").innerText = "Click START GAME"
        } else if (document.querySelector("#inputPlayer-x").value == "" || document.querySelector("#inputPlayer-o").value == "" & !gameInfo.isGameStart) {
            document.querySelector("#text-announcement").innerText = "Waiting for players..."
        }
        if (gameInfo.isGameStart || document.getElementById("inputPlayer-o").value == "" || document.getElementById("inputPlayer-x").value == "") {
            document.querySelector("#btnStartGame").disabled = true;
            if (document.getElementById("inputPlayer-o").value != "" && document.getElementById("inputPlayer-x").value != "") {
                document.querySelector("#btnTerminateGame").disabled = false;
            }
            if (gameInfo.isGameStart) {
                if (data.val().table == undefined) {
                    gameRef.child("game-1").update({
                        table: [
                            "0", "1", "2",
                            "3", "4", "5",
                            "6", "7", "8",]
                    })
                }
                gameRef.child("game-1").update({
                    table: table
                })
                btnCancelJoins.forEach(function (btnCancel) {
                    btnCancel.disabled = true
                })

                turn == "X" ? document.querySelector("#text-announcement").innerText = "Turn: X" : document.querySelector("#text-announcement").innerText = "Turn: O"

                for (let i = 1; i <= 3; i++) {
                    for (let j = 1; j <= 3; j++) {
                        document.querySelector(`#row-${i}-col-${j}`).dataset.boxid = (i - 1) * 3 + j - 1
                        document.querySelector(`#row-${i}-col-${j}`).addEventListener("click", addTableListener)
                    }
                }
                table.forEach((value, key) => {
                    let row = Math.floor(key / 3) + 1
                    let col = (key - 3 * Math.floor(key / 3)) + 1
                    if (value == "X") {
                        document.querySelector(`#row-${row}-col-${col}`).innerHTML = `<p class="display-4 text-center mt-3">X</p>`
                    } else if (value == "O") {
                        document.querySelector(`#row-${row}-col-${col}`).innerHTML = `<p class="display-4 text-center mt-3">O</p>`
                    } else {
                        document.querySelector(`#row-${row}-col-${col}`).innerHTML = `<p class="display-4 text-center mt-3"></p>`
                    }
                })
                if (userwin != "" && userwin != "both") {
                    for (let i = 1; i <= 3; i++) {
                        for (let j = 1; j <= 3; j++) {
                            document.querySelector(`#row-${i}-col-${j}`).removeEventListener("click", addTableListener)
                        }
                    }
                    document.querySelector("#text-announcement").innerText = `Winner: ${userwin}`
                    gameWin()
                } else if (userwin == "both") {
                    for (let i = 1; i <= 3; i++) {
                        for (let j = 1; j <= 3; j++) {
                            document.querySelector(`#row-${i}-col-${j}`).removeEventListener("click", addTableListener)
                        }
                    }
                    document.querySelector("#text-announcement").innerText = `GAME DRAW`
                    accountRef.once("value").then((snapshot) => {
                        snapshot.forEach((data) => {
                            let currentUser = firebase.auth().currentUser
                            let accountuid = data.val().uid
                            let score = data.val().score
                            if (currentUser.uid == accountuid) {
                                document.querySelector("#user-profile-score").innerText = `(${score})`
                            }
                        })
                    })
                }
            }
        } else if (!gameInfo.isGameStart) {
            document.querySelector("#btnStartGame").disabled = false;
            document.querySelector("#btnTerminateGame").disabled = true;
            btnCancelJoins.forEach(function (btnCancel) {
                btnCancel.disabled = false
            })
            for (let i = 1; i <= 3; i++) {
                for (let j = 1; j <= 3; j++) {
                    document.querySelector(`#row-${i}-col-${j}`).innerHTML = `<p class="display-4 text-center"></p>`
                    document.querySelector(`#row-${i}-col-${j}`).removeEventListener("click", addTableListener)
                } gameRef.child("game-1").update({
                    userwin: ""
                })
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
        const player = btnCancelID[btnCancelID.length - 1];

        const playerForm = document.getElementById(`inputPlayer-${player}`);
        if (playerForm.value && playerForm.value === currentUser.email) {
            // Delete player from database
            let tmpID = `user${player}id`;
            let tmpEmail = `user${player}email`;
            gameRef.child("game-1").child(tmpID).remove();
            gameRef.child("game-1").child(tmpEmail).remove();
            console.log(`delete on id: ${currentUser.uid}`);
            document.querySelector(`#btnJoin-${player}`).disabled = false;
        }
        if (player == "x") {
            document.getElementById("inputPlayer-o").value == "" ? document.querySelector("#btnJoin-o").disabled = false : document.querySelector("#btnJoin-o").disabled = true
        } else {
            document.getElementById("inputPlayer-x").value == "" ? document.querySelector("#btnJoin-x").disabled = false : document.querySelector("#btnJoin-x").disabled = true
        }
    }
}

const btnStart = document.querySelector("#btnStartGame");
btnStart.addEventListener("click", startGame);

const btnEnd = document.querySelector("#btnTerminateGame");
btnEnd.addEventListener("click", endGame);

function startGame() {
    gameRef.child("game-1").update({ isGameStart: true })
    gameRef.child("game-1").update({ turn: "X" })
}

function endGame() {
    gameRef.child("game-1").update({ isGameStart: false }).then(function () {
        gameRef.child("game-1").update({
            table: [
                "0", "1", "2",
                "3", "4", "5",
                "6", "7", "8",]
        })
        table = [
            "0", "1", "2",
            "3", "4", "5",
            "6", "7", "8",]
    })
}

function addTableListener(event) {
    gameRef.once("value").then((snapshot) => {
        snapshot.forEach((data) => {
            let currentUser = firebase.auth().currentUser
            let turn = data.val().turn
            let userwin = data.val().userwin
            let userxid = data.val().userxid
            let useroid = data.val().useroid
            console.log(table[event.target.dataset.boxid])
            if (firebase.auth().currentUser.uid == data.val().userxid && turn == "X" && table[event.target.dataset.boxid] != undefined) {
                table = data.val().table
                table[event.target.dataset.boxid] = turn
                gameRef.child("game-1").update({
                    table: table,
                    turn: "O"
                })
            } else if (firebase.auth().currentUser.uid == data.val().useroid && turn == "O" && table[event.target.dataset.boxid] != undefined) {
                table = data.val().table
                table[event.target.dataset.boxid] = turn
                gameRef.child("game-1").update({
                    table: table,
                    turn: "X"
                })
            }
            if (table[0] == table[1] && table[1] == table[2] ||
                table[3] == table[4] && table[4] == table[5] ||
                table[6] == table[7] && table[7] == table[8] ||
                table[0] == table[3] && table[3] == table[6] ||
                table[1] == table[4] && table[4] == table[7] ||
                table[2] == table[5] && table[5] == table[8] ||
                table[0] == table[4] && table[4] == table[8] ||
                table[2] == table[4] && table[4] == table[6]) {
                accountRef.once("value").then((snapshot) => {
                    snapshot.forEach((data) => {
                        let accountid = data.key
                        let uid = data.val().uid
                        let score = data.val().score
                        if (uid == currentUser.uid && userwin == "") {
                            score += 3
                            if (turn == "X") {
                                gameRef.child("game-1").update({
                                    userwin: "X"
                                }).then(accountRef.child(accountid).update({ score: score }))
                            } else {
                                gameRef.child("game-1").update({
                                    userwin: "O"
                                }).then(accountRef.child(accountid).update({ score: score }))
                            }
                        }
                    })
                })
            } else if (table[0] != "0" && table[1] != "1" && table[2] != "2" &&
                table[3] != "3" && table[4] != "4" && table[5] != "5" &&
                table[6] != "6" && table[7] != "7" && table[8] != "8" && userwin == "") {
                console.log("Game Draw!")
                accountRef.once("value").then((snapshot) => {
                    snapshot.forEach((data) => {
                        let accountid = data.key
                        let accountuid = data.val().uid
                        let score = data.val().score
                        if (accountuid == userxid || accountuid == useroid) {
                            accountRef.child(accountid).update({
                                score: score + 1
                            }).then(gameRef.child("game-1").update({
                                userwin: "both"
                            }))
                        }
                    })
                })
            }
        })
    })
}

function gameWin() {
    accountRef.once("value").then((snapshot) => {
        snapshot.forEach((data) => {
            let currentUser = firebase.auth().currentUser
            let accountuid = data.val().uid
            let score = data.val().score
            if (currentUser.uid == accountuid) {
                document.querySelector("#user-profile-score").innerText = `(${score})`
            }
        })
    })
}