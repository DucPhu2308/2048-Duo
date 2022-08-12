var resultBox = document.getElementById('resultBox')
const canvas = document.querySelector('#game')
const ctx = canvas.getContext('2d')
canvas.width = 500
canvas.height = 500
canvas.style.border = "2px solid"

const tileColor = {
    '2': 'rgb(240, 213, 234)',
    '4': 'rgb(252, 104, 0)',
    '8': 'rgb(252, 150, 9)',
    '16': 'rgb(252, 239, 9)',
    '32': 'rgb(252, 254, 143)',
    '64': 'rgb(252, 178, 233)',
    '128': 'rgb(172, 178, 233)',
    '256': 'rgb(29, 178, 233)',
    '512': 'rgb(29, 79, 233)',
    '1024': 'rgb(143, 16, 138)',
    '2048': 'rgb(64, 204, 82)',

}
function log(base, x) {
    return Math.log(x) / Math.log(base)
}
function transpose(mat) {
    var new_mat = []
    for (var i = 0; i < 4; i++) {
        new_mat.push([])
        for (var j = 0; j < 4; j++) {
            new_mat[i].push(mat[j][i])
        }
    }
    return new_mat
}

function reverse(mat) {
    var new_mat = []
    for (var i = 0; i < 4; i++) {
        new_mat.push([])
        for (var j = 0; j < 4; j++) {
            new_mat[i].push(mat[i][3 - j])
        }
    }
    return new_mat
}

function isFull(mat) {
    for (let i = 0; i < 4; i++)
        for (let j = 0; j < 4; j++)
            if (mat[i][j] === 0)
                return false
    return true
}

class Player {
    constructor() {
        this.name
        this.score = 0
    }
}
class Match {
    constructor() {
        this.players = []
        this.currPlayer = 0
        this.board
        this.winner
    }

    initBoard() {
        this.board = []
        for (var i = 0; i < 4; i++) {
            this.board.push([0, 0, 0, 0])
        }
        var x = Math.floor(Math.random() * 4)
        var y = Math.floor(Math.random() * 4)
        this.board[x][y] = 2
    }
    addNewTile() {
        var x = Math.floor(Math.random() * 4)
        var y = Math.floor(Math.random() * 4)
        while (this.board[x][y] !== 0) {
            x = Math.floor(Math.random() * 4)
            y = Math.floor(Math.random() * 4)
        }
        this.board[x][y] = 2
    }
    compressBoard() { // pull tiles to the left
        var new_board = []
        for (var i = 0; i < 4; i++) {
            new_board.push([0, 0, 0, 0])
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
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 3; j++) {
                if (this.board[i][j] == this.board[i][j + 1] && this.board[i][j] != 0) {
                    this.players[this.currPlayer].score += log(2,this.board[i][j])
                    this.board[i][j] *= 2
                    this.board[i][j + 1] = 0
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

        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (this.board[i][j] !== 0) {
                    let x = j * (tileSize + padding) + padding
                    let y = i * (tileSize + padding) + padding

                    ctx.save()
                    ctx.strokeStyle = '#000'
                    ctx.fillStyle = tileColor[`${this.board[i][j]}`]
                    ctx.strokeRect(x, y, tileSize, tileSize)
                    ctx.fillRect(x, y, tileSize, tileSize)

                    ctx.fillStyle = '#fff'
                    ctx.font = '50px Arial'
                    ctx.textAlign = 'center'
                    ctx.fillText(`${this.board[i][j]}`, x + tileSize / 2, y + tileSize * (3 / 5));
                    ctx.restore()
                }
            }
        }
    }
    addHandleInput() {
        window.addEventListener('keydown', (e) => {
            if (e.key == 'w' || e.key == 'a' || e.key == 's' || e.key == 'd') {
                this.updateBoard(e.key)
                var state = this.getGameState()
                if (state == 'WON') {
                    // win display
                    this.showResult(state)
                }
                else if (state == 'GAME NOT OVER') {
                    if (!isFull(this.board))
                        this.addNewTile()
                    else
                        this.showResult('LOST')
                }
                else {
                    // lose display
                    this.showResult(state)
                }
                var scoreElement = document.querySelector(`#player${this.currPlayer+1}-score`)
                scoreElement.innerHTML = String(this.players[this.currPlayer].score)
                this.currPlayer = (this.currPlayer+1)%this.players.length
            }
        })
    }
    clearBoard() {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
    updateBoard(key) {
        switch (key) {
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
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (this.board[i][j] == 2048)
                    return 'WON'
            }
        }
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (this.board[i][j] == 0)
                    return 'GAME NOT OVER'
            }
        }
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (this.board[i][j] == this.board[i][j + 1] || this.board[i][j] == this.board[i + 1][j])
                    return 'GAME NOT OVER'
            }
        }
        for (let i = 0; i < 3; i++) {
            if (this.board[3][i] == this.board[3][i + 1]) {
                return 'GAME NOT OVER'
            }
        }
        for (let i = 0; i < 3; i++) {
            if (this.board[i][3] == this.board[i + 1][3]) {
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
    showResult(state) {
        this.clearBoard()
        resultBox.innerHTML = 'YOU ' + state + '!!!'
        resultBox.classList.remove('hidden')
    }
}

var player1 = new Player
player1.name = prompt('Player 1\'s name:')
var player2 = new Player
player2.name = prompt('Player 2\'s name:')

function addPlayerDOM(player, playerIndex) {
    var playerContainer = document.getElementById('player-container')
    var player1Div = document.createElement('div')
    player1Div.setAttribute('id',`player${playerIndex}`)
    player1Div.setAttribute('class','player')
    player1Div.innerHTML = `<p>Name: <span>${player.name}</span></p><p>Score: <span id="player${playerIndex}-score">${player.score}</span></p>`
    playerContainer.appendChild(player1Div)
}

addPlayerDOM(player1,1)
addPlayerDOM(player2,2)

var match = new Match
match.players.push(player1,player2)

match.initBoard()
match.addHandleInput()
match.animate()
