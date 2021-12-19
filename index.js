let deckId
const drawBtn = document.getElementById('draw-btn')
const deckBtn = document.getElementById('deck-btn')
const cardsImageContainer = document.getElementById("cards-image")
const header = document.getElementById('header')
const remainCards = document.getElementById('remain-cards')
const userScoreEl = document.getElementById('user-score')
const computerScoreEl = document.getElementById('computer-score')

let userScore = 0
let computerScore = 0


function getIntValue(cardValue) {
    switch (cardValue) {
        case 'ACE':
            return 14
        case 'KING':
            return 13
        case 'QUEEN':
            return 12
        case 'JACK':
            return 11
        default:
            return parseInt(cardValue)
    }
}

function cardsWarCheck(card1, card2) {
    const card1Value = getIntValue(card1.value)
    const card2Value = getIntValue(card2.value)
    if (card1Value > card2Value) {
        computerScore++
        return 'Computer wins!'
    } else if (card1Value < card2Value) {
        userScore++
        return "You win!"
    } else {
        return "War!"
    }
}

function updateScore() {
    userScoreEl.innerText = `Your Score: ${userScore}`
    computerScoreEl.innerText = `Comuter Score: ${computerScore}`
}


function newDeckClick() {
    fetch("https://apis.scrimba.com/deckofcards/api/deck/new/shuffle/")
        .then(res => res.json())
        .then(data => {
            deckId = data.deck_id
            remainCards.textContent = `Cards remaining: ${data.remaining}`
        })

    cardsImageContainer.children[0].innerHTML = ""
    cardsImageContainer.children[1].innerHTML = ""
    header.textContent = "Game of War"
    drawBtn.disabled = false
    userScore = 0
    computerScore = 0
    updateScore()
}

function drawCardClick() {
    fetch(`https://apis.scrimba.com/deckofcards/api/deck/${deckId}/draw/?count=2`)
        .then(res => res.json())
        .then(data => {
            cardsImageContainer.children[0].innerHTML = ` <img src=${data.cards[0].image} class="card" />`
            cardsImageContainer.children[1].innerHTML = ` <img src=${data.cards[1].image} class="card" />`
            const roundWinner = cardsWarCheck(data.cards[0], data.cards[1])
            header.textContent = roundWinner
            remainCards.textContent = `Cards remaining: ${data.remaining}`
            updateScore()
            if (data.remaining === 0) {
                drawBtn.disabled = true
                if (userScore > computerScore) {
                    header.textContent = "You won the game!"
                }else if (userScore < computerScore) {
                    header.textContent = "The computer won the game!"
                } else {
                    header.textContent = "It's a tie game!"
                }
            }
        })
}


deckBtn.addEventListener('click', newDeckClick)
drawBtn.addEventListener('click', drawCardClick)