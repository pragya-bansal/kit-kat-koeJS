window.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");

    let markers = [
        [0,0,0],
        [0,0,0],
        [0,0,0]
    ];

    let player = 1;
    let gameOver = false;

    // Load assets
    const xImg = new Image();
    xImg.src = "./assets/x_image.jpg";

    const oImg = new Image();
    oImg.src = "./assets/o_image.jpg";

    const imgPlayer1 = new Image();
    imgPlayer1.src = "./assets/player1_win.png";

    const imgPlayer2 = new Image();
    imgPlayer2.src = "./assets/player2_win.png";

    const imgDraw = new Image();
    imgDraw.src = "./assets/draw.png";

    const overlay = document.getElementById("overlay");
    const resultImage = document.getElementById("resultImage");
    const playAgainBtn = document.getElementById("playAgainBtn");

    function drawGrid() {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, 300, 300);

        ctx.strokeStyle = "black";
        ctx.lineWidth = 5;

        ctx.beginPath();
        ctx.moveTo(100, 0); ctx.lineTo(100, 300);
        ctx.moveTo(200, 0); ctx.lineTo(200, 300);
        ctx.moveTo(0, 100); ctx.lineTo(300, 100);
        ctx.moveTo(0, 200); ctx.lineTo(300, 200);
        ctx.stroke();
    }

    function drawMarkers() {
        for (let x = 0; x < 3; x++) {
            for (let y = 0; y < 3; y++) {
                if (markers[x][y] === 1) {
                    ctx.drawImage(xImg, x * 100 + 5, y * 100 + 5, 90, 90);
                } else if (markers[x][y] === -1) {
                    ctx.drawImage(oImg, x * 100 + 5, y * 100 + 5, 90, 90);
                }
            }
        }
    }

    function checkWinner() {
        for (let i = 0; i < 3; i++) {
            let row = markers[i][0] + markers[i][1] + markers[i][2];
            let col = markers[0][i] + markers[1][i] + markers[2][i];
            if (row === 3 || col === 3) return 1;
            if (row === -3 || col === -3) return 2;
        }

        let diag1 = markers[0][0] + markers[1][1] + markers[2][2];
        let diag2 = markers[2][0] + markers[1][1] + markers[0][2];

        if (diag1 === 3 || diag2 === 3) return 1;
        if (diag1 === -3 || diag2 === -3) return 2;

        if (!markers.flat().includes(0)) return "draw";

        return null;
    }

    canvas.addEventListener("click", (event) => {
        if (gameOver) return;

        let rect = canvas.getBoundingClientRect();
        let mouseX = event.clientX - rect.left;
        let mouseY = event.clientY - rect.top;

        let cellX = Math.floor(mouseX / 100);
        let cellY = Math.floor(mouseY / 100);

        if (markers[cellX][cellY] === 0) {
            markers[cellX][cellY] = player;
            player *= -1;

            let result = checkWinner();
            if (result) {
                gameOver = true;

                if (result === 1) resultImage.src = imgPlayer1.src;
                else if (result === 2) resultImage.src = imgPlayer2.src;
                else resultImage.src = imgDraw.src;

                overlay.classList.remove("hidden");
                overlay.style.display = "flex";
            }
        }
    });

    playAgainBtn.addEventListener("click", () => {
        markers = [
            [0,0,0],
            [0,0,0],
            [0,0,0]
        ];
        player = 1;
        gameOver = false;
        overlay.classList.add("hidden");
        overlay.style.display = "none";
    });

    function gameLoop() {
        drawGrid();
        drawMarkers();
        requestAnimationFrame(gameLoop);
    }

    gameLoop();
});
