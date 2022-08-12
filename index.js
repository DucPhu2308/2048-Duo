const canvas = document.querySelector('#game')
const ctx = canvas.getContext('2d')
canvas.width = 1024
canvas.height = 678
canvas.style.border = "2px solid"

function transpose(mat) {
    var new_mat = []
    for (var i=0; i<4; i++) {
        new_mat.push([])
        for (var j=0; j<4; j++) {
            new_mat[i].push(mat[j][i])
        }
    }
    return new_mat
}
function reverse(mat) {
    var new_mat = []
    for (var i=0; i<4; i++) {
        new_mat.push([])
        for (var j=0; j<4; j++) {
            new_mat[i].push(mat[i][3-j])
        }
    }
    return new_mat
}
class Player {
    constructor() {
        this.name
        this.score
    }
}
class Match {
    constructor() {
        this.players
        this.currPlayer
        this.board
        this.winner
    }
    initBoard() {
        this.board = []
        for (var i=0; i<4; i++) {
            this.board.push([0,0,0,0])
        }
        var x = Math.floor(Math.random()*4)
        var y = Math.floor(Math.random()*4)
        this.board[x][y] = 2
    }
    compressBoard() { // pull tiles to the left
        var new_board = []
        for (var i=0; i<4; i++) {
            new_board.push([0,0,0,0])
        }
        for (let i = 0; i < 4; i++) {
            var pos = 0
            for (let j = 0; j < 4; j++) {
                if (this.board[i][j] != 0) {
                    new_board[i][pos] = this.board[i][j]
                    pos++;
                }
            }
        }
        this.board = new_board
    }
    mergeTiles() { // merge after compress

    }
    drawBoard() {

    }
    addHandleInput() {
        window.addEventListener('keydown',(e) => {
                
            }
        )
    }
    clearBoard() {

    }
    updateBoard(key) {
        switch(key) {

        }
    }
    animate() {
        window.requestAnimationFrame(() => {
            this.clearBoard()
            this.drawBoard()
            this.animate()
        })
    }
}

var match = new Match
match.initBoard()
console.log(match.board)
match.compressBoard()
console.log(match.board)

// match.addHandleInput()
// match.animate()



