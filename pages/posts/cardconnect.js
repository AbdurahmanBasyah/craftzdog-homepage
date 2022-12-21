import {
  Container,
  Badge,
  Box,
  Text,
  Button,
  Image,
  Flex
} from '@chakra-ui/react'
import { Title } from '../../components/pageItem'
import Layout from '../../components/layouts/article'
import { useState } from 'react'
import { useEffect } from 'react'
import axios from 'axios'

class Card {
  constructor(code, value, suit, image) {
    this.code = code
    this.value = value
    this.suit = suit
    this.color = suit === 'HEARTS' || suit === 'DIAMONDS' ? 'red' : 'black'
    this.image = image
    this.x = 0
    this.y = 0
    this.isFolded = false
    this.neighbors = []
  }

  getCode() {
    return this.code
  }

  getValue() {
    return this.value
  }

  getSuit() {
    return this.suit
  }

  getColor() {
    return this.color
  }

  getImage() {
    return this.image
  }
  getLocation() {
    return { x: this.x, y: this.y }
  }

  getIsFolded() {
    return this.isFolded
  }

  getNeighbors() {
    return this.neighbors
  }

  setNeighbors(neighbors) {
    this.neighbors = neighbors
  }

  setLocation(x, y) {
    this.x = x
    this.y = y
  }

  setFolded(isFolded) {
    this.isFolded = isFolded
  }

  isNeighbor(card) {
    const { x, y } = this.getLocation()
    const { x: x2, y: y2 } = card.getLocation()
    if (x === x2 && y === y2) return false
    if (x === x2 && Math.abs(y - y2) === 1) return true
    if (y === y2 && Math.abs(x - x2) === 1) return true
    return false
  }
}

const CardConnect = () => {
  const [cards, setCards] = useState([])
  const [currentCard, setCurrentCard] = useState(null)

  const getCards = () => {
    axios
      .get('https://deckofcardsapi.com/api/deck/new/draw/?count=52')
      .then(res => {
        const cards = res.data.cards
        const cardList = []
        cards.forEach(card => {
          cardList.push(new Card(card.code, card.value, card.suit, card.image))
        })
        setCards(cardList)
        setCurrentCard(null)
      })
  }

  const djikstra = (start, end) => {
    const visited = new Set()
    const queue = []
    queue.push({ card: start, path: [] })
    while (queue.length > 0) {
      const { card, path } = queue.shift()
      if (card === end) return path
      if (visited.has(card)) continue
      visited.add(card)
      path.push(card)
      for (let i = 0; i < card.getNeighbors().length; i++) {
        if (card.getNeighbors()[i].getIsFolded()) {
          queue.push({ card: card.getNeighbors()[i], path: path.slice() })
        } else {
          if (card.getNeighbors()[i] === end)
            return path.concat(card.getNeighbors()[i])
        }
      }
    }
    return []
  }

  useEffect(() => {
    if (cards.length === 0) return
    for (let i = 0; i < 52; i++) {
      const card = cards[i]
      if (i < 49) {
        card.setLocation((i % 7) + 1, Math.floor(i / 7 + 1))
      } else {
        card.setLocation(i - 49 + 3, 8)
      }

      card.setNeighbors(cards.filter(c => c !== card && c.isNeighbor(card)))
    }

    if (allCardFolded()) {
      alert('You Win!')
      getCards()
    }
  }, [cards])

  const getHint = () => {
    for (let i = 0; i < cards.length; i++) {
      for (let j = 0; j < cards.length; j++) {
        if (i === j) continue
        if (cards[i].getIsFolded() || cards[j].getIsFolded()) continue
        if (cards[i].getValue() === cards[j].getValue()) {
          const path = djikstra(cards[i], cards[j])
          if (path.length > 0) {
            setCurrentCard(cards[i])
            setTimeout(() => {
              setCurrentCard(null)
            }, 1000)
            return
          }
        }
      }
    }
    alert('No moves left! Start a new game.')
  }

  const flashThroughPath = path => {
    for (let i = 0; i < path.length; i++) {
      const el = document.getElementById(path[i].getCode())
      setTimeout(() => {
        el.style.backgroundColor = '#FFD700'
        el.style.filter = 'brightness(1.5); opacity: 0.5; blur: 5px'
        el.style.boxShadow = '0 0 10px 10px #FFD700'
      }, 50 * i)
    }
    setTimeout(() => {
      for (let i = 0; i < path.length; i++) {
        const el = document.getElementById(path[i].getCode())
        el.style.backgroundColor = 'transparent'
        el.style.filter = 'brightness(1); opacity: 1; blur: 0px'
        el.style.boxShadow = 'none'
      }
    }, 50 * path.length)
    setTimeout(() => {
      path[0].setFolded(true)
      path[path.length - 1].setFolded(true)
      setCards([...cards])
    }, 50 * path.length + 50)
  }

  const allCardFolded = () => {
    for (let i = 0; i < cards.length; i++) {
      if (!cards[i].getIsFolded()) return false
    }
    return true
  }
  return (
    <Layout title="Card Connect">
      <Container>
        <Title type="Posts">
          Card Connect <Badge>Game</Badge>
        </Title>
        <Text>
          {`This is a card connect game. The goal is to connect all the cards with
          the same value. You can only connect two cards if there are no other cards
          between them. Connected cards will be folded. You can get a hint by clicking the "Get Hint" button. You can start a new game
          by clicking the "Get Cards" button. Enjoy!`}
        </Text>
        <Text my="6" textAlign={'center'}>
          This game is not responsive and not fully developed. Please play it on
          a desktop.
        </Text>
        <Flex m="4" alignItems={'center'} gap="6" justifyContent="center">
          <Button onClick={getCards}>Get Cards</Button>
          <Button onClick={getHint}>Get Hint</Button>
        </Flex>
        <Box display="flex" flexWrap="wrap" justifyContent="center" gap={'6px'}>
          {cards.map((card, index) =>
            card?.getIsFolded() ? (
              <Box
                key={index}
                id={card?.getCode()}
                width="64px"
                height={'90px'}
                filter={
                  currentCard === card ? 'drop-shadow(0 0 0.5rem #FFD700)' : ''
                }
              ></Box>
            ) : (
              <Image
                id={card?.getCode()}
                key={index}
                width="64px"
                height={'90px'}
                style={{
                  aspectRatio: '5 / 7'
                }}
                src={card?.getImage()}
                alt={card?.getCode()}
                filter={
                  currentCard === card ? 'drop-shadow(0 0 0.5rem #FFD700)' : ''
                }
                onClick={() => {
                  if (currentCard) {
                    if (currentCard === card) {
                      setCurrentCard(null)
                      return
                    } else if (
                      // currentCard.getColor() === card.getColor() &&
                      currentCard.getValue() === card.getValue()
                    ) {
                      const path = djikstra(currentCard, card)
                      if (path.length > 0) {
                        flashThroughPath(path)
                      }
                      setCurrentCard(null)
                    } else {
                      setCurrentCard(card)
                    }
                  } else {
                    setCurrentCard(card)
                  }
                  setCards([...cards])
                }}
              />
            )
          )}
        </Box>
      </Container>
    </Layout>
  )
}

export default CardConnect
