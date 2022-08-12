var resultBox = document.getElementById('resultBox')
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
class UI {
    static showResult(state) {
        if (state === 'WON') {
            resultBox.innerHTML = 'YOU WON!'
            resultBox.didplay = 'block'
        } else if (state === 'GAME OVER') {
            resultBox.innerHTML = 'YOU LOSE!'
            resultBox.didplay = 'block'
        }
    }
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
    addNewTile() {
        var x = Math.floor(Math.random()*4)
        var y = Math.floor(Math.random()*4)
        while (this.board[x][y] !== 0) {
            x = Math.floor(Math.random()*4)
            y = Math.floor(Math.random()*4)
        }
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
        for (var i=0; i<4; i++) {
            for (var j=0; j<3; j++) {
                if (this.board[i][j] == this.board[i][j+1]) {
                    this.board[i][j] *= 2
                    this.board[i][j+1] = 0
                    // score calculation here
                }
            }
        }
    }
    moveLeft() {
        this.compressBoard()
        this.mergeTiles()
        this.compressBoard()
    }
    moveRight() {
        this.board = reverse(this.board)
        this.moveLeft()
        this.board = reverse(this.board)
    }
    moveUp() {
        this.board = transpose(this.board)
        this.moveLeft()
        this.board = transpose(this.board)
    }
    moveDown() {
        this.board = transpose(this.board)
        this.moveRight()
        this.board = transpose(this.board)
    }
    drawBoard() {
        let padding = 5
        let tileSize = (canvas.width - padding * 5) / 4

        ctx.save()
        ctx.strokeStyle = '#aaa'
        ctx.fillStyle = '#ccc'
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                let x = i * (tileSize + padding) + padding
                let y = j * (tileSize + padding) + padding
                ctx.strokeRect(x, y, tileSize, tileSize)
                ctx.fillRect(x, y, tileSize, tileSize)
                ctx.font = '30px Arial'
                ctx.fillText(`${this.board[i][j]}`, x, y);
            }
        }
        ctx.restore()
    }
    addHandleInput() {
        canvas.addEventListener('keydown',(e) => {
                this.updateBoard(e.key)
                var state = this.getGameState()
                if (state == 'WON') {
                    // win display
                }
                else if (state == 'GAME NOT OVER') {
                    this.addNewTile()
                }
                else {
                    // lose display
                }
            }
        )
    }
    clearBoard() {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
    updateBoard(key) {
        switch(key) {
            case 'w':
                this.moveUp()
                break
            case 'a':
                this.moveLeft()
                break
            case 's':
                this.moveDown()
                break
            case 'd':
                this.moveRight()
                break
        }
    }
    getGameState() {
        for (let i=0; i<4; i++) {
            for (let j=0; j<4; j++) {
                if (this.board[i][j] == 2048)
                    return 'WON'
            }
        }
        for (let i=0; i<4; i++) {
            for (let j=0; j<4; j++) {
                if (this.board[i][j] == 0)
                    return 'GAME NOT OVER'
            }
        }
        for (let i=0; i<3; i++) {
            for (let j=0; j<3; j++) {
                if (this.board[i][j] == this.board[i][j+1] || this.board[i][j] == this.board[i+1][j])
                    return 'GAME NOT OVER'
            }
        }
        for (let i=0; i<3; i++) {
            if (this.board[3][i] == this.board[3][i+1]) {
                return 'GAME NOT OVER'
            }
        }
        for (let i=0; i<3; i++) {
            if (this.board[i][3] == this.board[i+1][3]) {
                return 'GAME NOT OVER'
            }
        }
        return 'LOST'
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
match.addHandleInput()
match.animate()



