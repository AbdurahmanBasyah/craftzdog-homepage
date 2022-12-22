import {
  Container,
  Badge,
  Box,
  Button,
  Image,
  Flex,
  List,
  ListItem,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
  Heading,
  useDisclosure,
  Input,
  SimpleGrid,
} from '@chakra-ui/react'
import { Title, Meta } from '../../components/pageItem'
import Layout from '../../components/layouts/article'
import { useState } from 'react'
import { useEffect } from 'react'
import axios from 'axios'
import P from '../../components/paragraph'
import useWindowSize from '../../hooks/useWindowSize'
import { isSuccess } from '../../functions/api'

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
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [cards, setCards] = useState([])
  const [name, setName] = useState('')
  const [highScores, setHighScores] = useState([])
  const [currentCard, setCurrentCard] = useState(null)
  const [score, setScore] = useState(0)
  const [modalData, setModalData] = useState(null)
  const { width } = useWindowSize()
  const [isMobile, setIsMobile] = useState(false)

  const getCards = () => {
    axios
      .get('https://deckofcardsapi.com/api/deck/new/draw/?count=52')
      .then(res => {
        const cards = res.data.cards
        const cardList = []
        cards.forEach(card => {
          cardList.push(new Card(card.code, card.value, card.suit, card.image))
        })
        setCurrentCard(null)
        setScore(0)
        setCards(cardList)
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
    console.log(cards)
    if (cards.length === 0) return
    for (let i = 0; i < 52; i++) {
      const card = cards[i]
      if (isMobile) {
        if (i < 48) {
          card.setLocation((i % 6) + 1, Math.floor(i / 6 + 1))
        } else {
          card.setLocation(i - 48 + 2, 9)
        }
      } else {
        if (i < 49) {
          card.setLocation((i % 7) + 1, Math.floor(i / 7 + 1))
        } else {
          card.setLocation(i - 49 + 3, 8)
        }
      }

      card.setNeighbors(cards.filter(c => c !== card && c.isNeighbor(card)))
    }

    if (allCardFolded()) {
      let isNewHighScore = false
      for (let i = 0; i < highScores.length; i++) {
        if (score > highScores[i].score) {
          isNewHighScore = true
          break
        }
      }
      if (isNewHighScore || highScores.length < 3) {
        setModalData({
          score: score,
          title: 'New high score!',
          description: `Your score is ${score}! Enter your name to be featured on the leaderboard`,
          isNewHighScore: true
        })
      } else {
        setModalData({
          score: score,
          title: 'You won!',
          description: `Your score is ${score}!`,
          isNewHighScore: false
        })
      }
      onOpen()
    }
  }, [cards])

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/api/scores/cardconnect`, {})
      .then(res => {
        if (isSuccess(res)) {
          setHighScores(res?.data?.data?.cardconnect)
        }
      })

    if (width < 768) {
      setIsMobile(true)
    } else {
      setIsMobile(false)
    }
  }, [])

  const getHint = () => {
    for (let i = 0; i < cards.length; i++) {
      for (let j = 0; j < cards.length; j++) {
        if (i === j) continue
        if (cards[i].getIsFolded() || cards[j].getIsFolded()) continue
        if (cards[i].getValue() === cards[j].getValue()) {
          const path = djikstra(cards[i], cards[j])
          if (path.length > 0) {
            console.log(path)
            // add blink effect 3 times
            for (let i = 0; i < 3; i++) {
              const el = document.getElementById(path[0].getCode())
              setTimeout(() => {
                el.style.backgroundColor = '#FFD700'
                el.style.filter = 'brightness(1.5); opacity: 0.5; blur: 5px'
                el.style.boxShadow = '0 0 10px 10px #FFD700'
                el.style.transition = 'all 0.5s ease'
              }
              , 1000 * i)
              setTimeout(() => {
                el.style.backgroundColor = '#FFFFFF'
                el.style.filter = 'brightness(1); opacity: 1; blur: 0px'
                el.style.boxShadow = '0 0 0px 0px #FFFFFF'
                el.style.transition = 'all 0.5s ease'
              }
              , 1000 * i + 500)
            }
            setScore(score - 5)
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
      setScore(score + path.length - 1)
      setCards([...cards])
    }, 50 * path.length + 50)
  }

  const allCardFolded = () => {
    for (let i = 0; i < cards.length; i++) {
      if (!cards[i].getIsFolded()) {
        return false
      }
    }
    return true
  }
  return (
    <Layout title="Card Connect">
      <Container>
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalBody
              display={'flex'}
              flexDirection="column"
              alignItems={'center'}
            >
              <Heading as="h3" my="4" variant="section-title">
                {modalData?.title}
              </Heading>
              <Text textAlign="center" my="4">
                {modalData?.description}
              </Text>
              {modalData?.isNewHighScore && (
                <Input
                  placeholder="Enter your name"
                  onChange={e => {
                    setName(e.target.value)
                  }}
                  value={name}
                  my="4"
                />
              )}
            </ModalBody>
            <ModalFooter>
              {/* <Button
                cursor={'none'}
                colorScheme="cyan"
                mr={3}
                onClick={() => {
                  shareHandler()
                }}
              >
                Share
              </Button> */}
              <Button
                variant={'outline'}
                colorScheme="teal"
                onClick={() => {
                  onClose()
                }}
              >
                Play Again
              </Button>
              {/* submit button */}
              {modalData?.isNewHighScore && (
                <Button
                  ml="4"
                  colorScheme="teal"
                  onClick={() => {
                    axios
                      .post(`${process.env.NEXT_PUBLIC_API_URL}/api/scores`, {
                        game: 'cardconnect',
                        username: name,
                        score: score
                      })
                      .then(res => {
                        if (isSuccess(res)) {
                          onClose()
                          setScore(0)
                          getCards()
                        }
                      })
                  }}
                >
                  Submit
                </Button>
              )}
            </ModalFooter>
          </ModalContent>
        </Modal>
        <Title type="Posts">
          Card Connect <Badge>Game</Badge>
        </Title>
        <P>
          {`This is a card connect game. The goal is to connect all the cards with
          the same value. You can only connect two cards if there are no other cards
          between them. Connected cards will be folded. You can get a hint by clicking the "Get Hint" button. You can start a new game
          by clicking the "Get Cards" button. This game used djikstra algorithm to find the shortest path between two cards. Enjoy!`}
        </P>
        <List ml={4} my={4}>
          <ListItem>
            <Meta>Type</Meta>
            <span>Game</span>
          </ListItem>
          <ListItem>
            <Meta>Category</Meta>
            <span>Soloplayer</span>
          </ListItem>
          <ListItem>
            <Meta>Tags</Meta>
            <span>Game, Soloplayer, Fun</span>
          </ListItem>
          <ListItem>
            <Meta>Number of Players</Meta>
            <span>1</span>
          </ListItem>
          <ListItem>
            <Meta>Tech</Meta>
            <span>React, Next.js, Chakra UI</span>
          </ListItem>
        </List>
        <Flex m="4" alignItems={'center'} gap="6" justifyContent="center">
          <Button onClick={getCards} colorScheme="teal" variant="outline">
            Get Cards
          </Button>
          <Text fontSize="larger" fontWeight="bold" color="teal.500">
            {score}
          </Text>
          <Button onClick={getHint} colorScheme="teal" variant="outline">
            Hint
          </Button>
        </Flex>
        <SimpleGrid
          columns={isMobile ? 6 : 7}
          gridAutoRows="1fr"
          spacing={isMobile ? 2 : 4}
          placeItems="center"
        >
          {cards.map((card, index) =>
            card?.getIsFolded() ? (
              <Box
                w="full"
                h="full"
                gridColumn={card.x}
                gridRow={card.y}
                key={index}
                id={card?.getCode()}
                filter={
                  currentCard === card ? 'drop-shadow(0 0 0.5rem #FFD700)' : ''
                }
              ></Box>
            ) : (
              <Image
                gridColumn={card.x}
                gridRow={card.y}
                id={card?.getCode()}
                key={index}
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
        </SimpleGrid>
      </Container>
    </Layout>
  )
}

export default CardConnect
