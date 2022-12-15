import {
  Container,
  Badge,
  Box,
  Text,
  Heading,
  Button,
  Image,
  Flex,
  Input,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
  List,
  ListItem
} from '@chakra-ui/react'
import { Title, Meta } from '../../components/pageItem'
import Layout from '../../components/layouts/article'
import { useState } from 'react'
import { io } from 'socket.io-client'
import axios from 'axios'
import { useEffect } from 'react'
import P from '../../components/paragraph'
import { generateRoomId } from '../../functions/generator'

const ImpostorCard = () => {
  const [playerId, setPlayerId] = useState('')
  const [roomId, setRoomId] = useState('')
  const [hostId, setHostId] = useState('')
  const [data, setData] = useState({})
  //   0 = neutral, 1 = host, 2 = guest
  const [isHost, setIsHost] = useState(0)
  const [isCopied, setIsCopied] = useState(false)
  const [isJoined, setIsJoined] = useState(false)
  const [isStarted, setIsStarted] = useState(false)
  const [currentSocket, setCurrentSocket] = useState(null)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [modalData, setModalData] = useState(null)

  useEffect(() => {
    const socket = io('https://personal-be-production.up.railway.app', {
      transports: ['websocket']
    })
    // const socket = io('http://localhost:8080', {
    //   // withCredentials: true,
    //   transports: ['websocket']
    // })

    setCurrentSocket(socket)

    return () => {
      socket.disconnect()
    }
  }, [])
  useEffect(() => {
    if (currentSocket) {
      currentSocket?.on('connect', () => {
        console.log('connected')
        setPlayerId(currentSocket.id)
        const id = generateRoomId()
        const data = {
          playerId: currentSocket.id,
          roomId: id,
          isHost: true
        }
        currentSocket.emit('join-room', data, id)
      })

      currentSocket?.on('player-joined', data => {
        // set join if new player is guest
        if (!data.isHost) {
          setIsJoined(true)
        }
      })
    }
  }, [currentSocket])

  currentSocket?.on('play-card', data => {
    const newData = {
      ...data,
      hostCards: shuffleCards(removePairedCards(data.hostCards)),
      guestCards: shuffleCards(removePairedCards(data.guestCards))
    }
    // guest hold the last card
    // guest lose and host win
    if (data?.hostCards.length === 0) {
      if (isHost === 2) {
        const modalData = {
          title: 'You lose',
          description: 'You have the impostor card, the impostor card is',
          image: data?.guestCards[0]?.image
        }
        setModalData(modalData)
        onOpen()
      } else if (isHost === 1) {
        const modalData = {
          title: 'You win',
          description:
            'Your opponent has the impostor card, the impostor card is',
          image: data?.guestCards[0]?.image
        }
        setModalData(modalData)
        onOpen()
      }

      // host hold the last card
      // host lose and guest win
    } else if (data?.guestCards.length === 0) {
      if (isHost === 1) {
        const modalData = {
          title: 'You lose',
          description: 'You have the impostor card, the impostor card is',
          image: data?.hostCards[0]?.image
        }
        setModalData(modalData)
        onOpen()
      } else if (isHost === 2) {
        const modalData = {
          title: 'You win',
          description:
            'Your opponent has the impostor card, the impostor card is',
          image: data?.hostCards[0]?.image
        }
        setModalData(modalData)
        onOpen()
      }
    }
    setIsStarted(true)
    setData(newData)
  })

  const shuffleCards = cards => {
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[cards[i], cards[j]] = [cards[j], cards[i]]
    }
    return cards
  }

  const handleStart = () => {
    axios
      .get('https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
      .then(res => {
        const deck_id = res.data.deck_id
        axios
          .get(
            `https://www.deckofcardsapi.com/api/deck/${deck_id}/draw/?count=52`
          )
          .then(res => {
            const tempHostCards = removePairedCards(res.data.cards.slice(0, 26))
            const tempGuestCards = removePairedCards(
              res.data.cards.slice(26, 51)
            )
            // host gets more cards
            if (tempHostCards.length > tempGuestCards.length) {
              const newData = {
                hostCards: tempHostCards,
                guestCards: tempGuestCards,
                lastTurn: playerId
              }
              setData(newData)
              currentSocket.emit('start-game', newData, roomId)
            } else {
              const newData = {
                hostCards: tempGuestCards,
                guestCards: tempHostCards,
                lastTurn: playerId
              }
              setIsHost(1)
              setData(newData)
              currentSocket.emit('start-game', newData, roomId)
            }
          })
      })
  }

  const handleJoin = () => {
    const data = {
      playerId: currentSocket.id,
      roomId: hostId,
      isHost: false
    }
    setRoomId(hostId)
    setIsJoined(true)
    setIsHost(2)
    currentSocket.emit('join-room', data, hostId)
  }

  const removePairedCards = cards => {
    const result = []
    for (let i = 0; i < cards.length; i++) {
      const card = cards[i]
      let isMoreThanOne = false
      for (let j = 0; j < result.length; j++) {
        const card2 = result[j]
        if (card.value === card2.value) {
          isMoreThanOne = true
          result.splice(result.indexOf(card2), 1)
          break
        }
      }
      if (!isMoreThanOne) {
        result.push(card)
      }
    }
    return result
  }

  return (
    <Layout title="Impostor Card Game">
      <Container>
        <Title type="Posts">
          Impostor Card <Badge>Game</Badge>
        </Title>
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
              <Text textAlign="center">{modalData?.description}</Text>
              <Image
                src={modalData?.image}
                w="30%"
                my="6"
                alt="impostor card"
              />
            </ModalBody>
            <ModalFooter>
              <Button
                colorScheme="teal"
                onClick={() => {
                  onClose()
                  setIsStarted(false)
                  setData(null)
                  setIsHost(0)
                  setIsJoined(false)
                }}
              >
                Play Again
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        <P>
          <strong>Impostor Card Game</strong>{' '}
          {`is a card game where you have to find
              and avoid the impostor. The game is played with a standard deck of 52
              cards with a card removed. The remaining 51 cards are shuffled and
              dealt out evenly between two players.`}
        </P>
        <P>
          {`The object of the game is to be the first player to get rid of all 
              of your cards. To do this, you must find the impostor card and avoid
              it. The impostor card is the only card that is not a pair. In every turn, 
              you can take a card from the opponent's deck. If the card is a pair with any of the other cards in your pile,
              you can discard it. If the card is not a pair, you have to keep it.`}
        </P>
        <P>
          {`After each turns, the deck for both players will be shuffled. The game ends when one of the players has no cards left. The player with the last card loses.`}
        </P>
        <List ml={4} my={4}>
          <ListItem>
            <Meta>Type</Meta>
            <span>Game</span>
          </ListItem>
          <ListItem>
            <Meta>Category</Meta>
            <span>Multiplayer</span>
          </ListItem>
          <ListItem>
            <Meta>Number of Players</Meta>
            <span>2</span>
          </ListItem>
          <ListItem>
            <Meta>Who Should Win</Meta>
            <span>Both</span>
          </ListItem>
          <ListItem>
            <Meta>Tech</Meta>
            <span>NextJS, Socket.io, Node.js, Express</span>
          </ListItem>
        </List>
        {isStarted ? (
          <Box>
            <Heading as="h3" variant="section-title">
              Your Cards
            </Heading>
            <Box display={'flex'} justifyContent="center">
              {isHost === 1
                ? removePairedCards(data?.hostCards)?.map((card, index) => (
                    <Image
                      key={index}
                      ml={`-${40}px`}
                      maxW="64px"
                      src={card.image}
                      alt={card.code}
                    />
                  ))
                : removePairedCards(data?.guestCards)?.map((card, index) => (
                    <Image
                      key={index}
                      ml={`-${40}px`}
                      maxW="64px"
                      src={card.image}
                      alt={card.code}
                    />
                  ))}
            </Box>
            <Heading as="h3" variant="section-title">
              Opponent Cards
            </Heading>
            <Box display={'flex'} justifyContent="center">
              {isHost === 2
                ? removePairedCards(data?.hostCards)?.map((card, index) => (
                    <Image
                      key={index}
                      ml={`-${40}px`}
                      maxW="64px"
                      onClick={() => {
                        if (playerId !== data.lastTurn) {
                          const guestCards = [
                            ...removePairedCards([...data.guestCards, card])
                          ]
                          const hostCards = removePairedCards(
                            data.hostCards.filter(c => c.code !== card.code)
                          )
                          const newData = {
                            hostCards: hostCards,
                            guestCards: guestCards,
                            lastTurn: playerId
                          }
                          currentSocket.emit('play-card', newData, roomId)
                        } else {
                          alert('Not your turn')
                        }
                      }}
                      _hover={{
                        transform: 'scale(1.2)',
                        transition: 'all 0.2s ease-in-out'
                      }}
                      src={
                        'https://i.pinimg.com/originals/91/69/ef/9169ef73b3564976a7dc564d66861027.png'
                      }
                      alt={card.code}
                    />
                  ))
                : removePairedCards(data?.guestCards)?.map((card, index) => (
                    <Image
                      key={index}
                      ml={`-${40}px`}
                      maxW="64px"
                      _hover={{
                        transform: 'scale(1.2)',
                        transition: 'all 0.2s ease-in-out'
                      }}
                      onClick={() => {
                        if (playerId !== data.lastTurn) {
                          const hostCards = [
                            ...removePairedCards([...data.hostCards, card])
                          ]
                          const guestCards = removePairedCards(
                            data.guestCards.filter(c => c.code !== card.code)
                          )
                          const newData = {
                            hostCards: hostCards,
                            guestCards: guestCards,
                            lastTurn: playerId
                          }
                          currentSocket.emit('play-card', newData, roomId)
                        } else {
                          alert('Not your turn')
                        }
                      }}
                      src={
                        'https://i.pinimg.com/originals/91/69/ef/9169ef73b3564976a7dc564d66861027.png'
                      }
                      alt={card.code}
                    />
                  ))}
            </Box>
            {isStarted && (
              <Text textAlign="center" my="2">
                {playerId !== data?.lastTurn
                  ? `Get one card from your opponent's deck`
                  : 'Wait for your opponent to take a card'}
              </Text>
            )}
          </Box>
        ) : (
          <>
            {!isJoined && (
              <>
                <Heading as="h3" my="4">
                  Ready to play? Let{`'s`} start!
                </Heading>

                <Flex>
                  <Button
                    onClick={() => setIsHost(1)}
                    cursor={'none'}
                    colorScheme="teal"
                    my="4"
                  >
                    Host a game
                  </Button>
                  <Button
                    onClick={() => setIsHost(2)}
                    cursor={'none'}
                    colorScheme="teal"
                    my="4"
                    variant={'outline'}
                    ml="4"
                  >
                    Join a game
                  </Button>
                </Flex>
              </>
            )}
            {isHost === 1 && (
              <>
                {isJoined ? (
                  <Flex alignItems="center" flexDirection="column">
                    <Text my="8">
                      Your friend has joined the game, click start to begin
                    </Text>
                    <Button
                      cursor={'none'}
                      colorScheme="teal"
                      my="4"
                      variant={'outline'}
                      ml="4"
                      fontSize={"20px"}
                      size={'lg'}
                      onClick={() => handleStart()}
                    >
                      Start
                    </Button>
                  </Flex>
                ) : (
                  <Flex alignItems={'center'}>
                    <Text
                      fontSize={'sm'}
                    >{`Invite your friend, here's your room ID ${roomId}`}</Text>
                    <Button
                      cursor={'none'}
                      colorScheme="teal"
                      my="4"
                      variant={'outline'}
                      ml="4"
                      fontSize={'xs'}
                      onClick={() => {
                        setIsCopied(true)
                        navigator.clipboard.writeText(roomId)
                      }}
                    >
                      {isCopied ? 'Copied' : 'Copy'}
                    </Button>
                  </Flex>
                )}
              </>
            )}
            {isHost === 2 && (
              <>
                {isJoined ? (
                  <Text textAlign="center" my="8">
                    You have joined the game, waiting for the host to start
                  </Text>
                ) : (
                  <Flex alignItems={'center'}>
                    <Input
                      placeholder="Enter your friend's room ID"
                      color="teal"
                      _placeholder={{ color: 'inherit' }}
                      onChange={e => setHostId(e.target.value)}
                    />
                    <Button
                      cursor={'none'}
                      colorScheme="teal"
                      my="4"
                      variant={'outline'}
                      ml="4"
                      fontSize={'xs'}
                      onClick={() => handleJoin()}
                    >
                      Join
                    </Button>
                  </Flex>
                )}
              </>
            )}
          </>
        )}
      </Container>
    </Layout>
  )
}

export default ImpostorCard
