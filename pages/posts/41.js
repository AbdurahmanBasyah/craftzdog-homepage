import {
  Container,
  Badge,
  Button,
  Box,
  SimpleGrid,
  Image,
  Flex,
  Input,
  Heading,
  Text,
  Tab,
  TabPanel,
  TabPanels,
  Tabs,
  TabList,
  useClipboard,
  useDisclosure,
  Modal,
  ModalBody,
  ModalOverlay,
  ModalContent,
  ModalFooter
} from '@chakra-ui/react'
import Layout from '../../components/layouts/article'
import { Title } from '../../components/pageItem'
import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import axios from 'axios'
import { generateRoomId } from '../../functions/generator'

class Player {
  constructor(name, id, isHost, character) {
    this.name = name
    this.id = id
    this.cardsFold = []
    this.cardsShown = []
    this.isHost = isHost
    this.prev = null
    this.next = null
    this.character = `/images/${character}.gif`
  }
}

const Game41 = () => {
  const [currentSocket, setCurrentSocket] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)
  const [name, setName] = useState('')
  const [gameData, setGameData] = useState(null)
  const [cards, setCards] = useState([])
  const { onCopy, value, setValue, hasCopied } = useClipboard('')
  const [players, setPlayers] = useState([])
  const { isOpen, onOpen, onClose } = useDisclosure()
  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_API_URL, {
      transports: ['websocket']
    })
    // const socket = io('http://localhost:8080', {
    //   // withCredentials: true,
    //   transports: ['websocket']
    // })
    getCards()
    setCurrentSocket(socket)

    return () => {
      socket.disconnect()
    }
  }, [])

  useEffect(() => {
    if (currentSocket === null) return
    currentSocket.on('connect', () => {
      console.log('connected to socket')
    })
    currentSocket.on('disconnect', () => {
      console.log('disconnected to socket')
    })
  }, [currentSocket])

  useEffect(() => {
    if (currentSocket === null) return
    currentSocket.on('player-joined', data => {
      if (currentUser?.isHost) {
        currentSocket.emit('send-all-players', [...players, data], value)
      }
    })

    currentSocket.on('receive-all-players', data => {
      setPlayers(data)
    })

    currentSocket.on('play-card', data => {
      if (
        data.cards.length === 0 &&
        data.players.every(player => player.cardsShown.length === 4)
      ) {
        currentSocket.emit('end-game', data, value)
      }
      for (let index = 0; index < data.players.length; index++) {
        const player = data.players[index]
        if (player.id === currentUser?.id) {
          setCurrentUser(player)
        }
        if (player.cardsShown.length === 4) {
          const handValue = calculateCardsShown(player.cardsShown)
          console.log(handValue)
          if (handValue === 41) {
            currentSocket.emit('end-game', data, value)
            break
          }
        }
      }
      setGameData(data)
    })

    currentSocket.on('end-game', data => {
      console.log(currentUser)
      setGameData(data)
      onOpen()
    })
    return () => {
      currentSocket.off('player-joined')
      currentSocket.off('receive-all-players')
      currentSocket.off('play-card')
      currentSocket.off('end-game')
    }
  }, [currentUser, value, players, currentSocket])

  const getPlayerFromGameData = id => {
    return gameData?.players.find(player => player.id === id)
  }

  const startGame = () => {
    for (let index = 0; index < players.length; index++) {
      const player = players[index]
      player.next = players[index + 1]?.id ?? players[0]?.id
      player.prev = players[index - 1]?.id ?? players[players.length - 1]?.id
      player.cardsShown = cards.slice(index * 4, index * 4 + 4)
    }
    const data = {
      players: players,
      currentTurn: players[0].id,
      cards: cards.slice(4 * players.length, 52)
    }
    currentSocket.emit('start-game', data, value)
  }

  const getCards = () => {
    axios
      .get('https://deckofcardsapi.com/api/deck/new/draw/?count=52')
      .then(res => {
        setCards(res.data.cards)
      })
  }

  const calculateCardsShown = cardsShown => {
    // first index is sum of hearts,
    // second is sum of diamonds,
    // third is sum of clubs,
    // fourth is sum of spades
    let sumArray = Array(4).fill(0)
    for (let index = 0; index < cardsShown?.length; index++) {
      const card = cardsShown[index]
      switch (card.suit) {
        case 'HEARTS':
          sumArray[0] += ['JACK', 'QUEEN', 'KING'].includes(card.value)
            ? 10
            : card.value === 'ACE'
            ? 11
            : parseInt(card.value)
          break
        case 'DIAMONDS':
          sumArray[1] += ['JACK', 'QUEEN', 'KING'].includes(card.value)
            ? 10
            : card.value === 'ACE'
            ? 11
            : parseInt(card.value)
          break
        case 'CLUBS':
          sumArray[2] += ['JACK', 'QUEEN', 'KING'].includes(card.value)
            ? 10
            : card.value === 'ACE'
            ? 11
            : parseInt(card.value)
          break
        case 'SPADES':
          sumArray[3] += ['JACK', 'QUEEN', 'KING'].includes(card.value)
            ? 10
            : card.value === 'ACE'
            ? 11
            : parseInt(card.value)
          break
        default:
          break
      }
    }
    // find max value of the array and reduce it with others
    const max = Math.max(...sumArray)
    const sum = sumArray.reduce((a, b) => a + b, 0)
    return 2 * max - sum
  }
  return (
    <Layout title="41 Card Game">
      <Container>
        <Title type="Works">
          41 <Badge>2021</Badge>
        </Title>

        <Modal isOpen={isOpen} onClose={onClose} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalBody
              display={'flex'}
              flexDirection="column"
              alignItems={'center'}
            >
              <Heading as="h2" my="4" variant="section-title">
                {gameData?.players.every(
                  otherPlayer =>
                    calculateCardsShown(currentUser?.cardsShown) >=
                    calculateCardsShown(otherPlayer.cardsShown)
                )
                  ? 'You Won'
                  : 'You Lost'}
              </Heading>
              <SimpleGrid columns="2">
                {gameData?.players.map(player => {
                  return (
                    <Box
                      display={'flex'}
                      flexDirection="column"
                      alignItems={'center'}
                      key={player.id}
                    >
                      <Heading
                        as="h5"
                        my="4"
                        variant="section-title"
                        color={
                          // player cards shown is bigger than every other player
                          gameData?.players.every(
                            otherPlayer =>
                              calculateCardsShown(player.cardsShown) >=
                              calculateCardsShown(otherPlayer.cardsShown)
                          )
                            ? 'green.500'
                            : 'red.500'
                        }
                      >
                        {player.name +
                          (currentUser?.id === player.id ? ' (You)' : '')}
                      </Heading>
                      <Text textAlign="center">
                        {calculateCardsShown(player.cardsShown)}
                      </Text>
                      <SimpleGrid columns={10} minW="64px" placeItems="center">
                        {player.cardsShown.map((card, index) => {
                          return (
                            <Image
                              gridColumn={`${2 * index + 1} /  span 3`}
                              gridRow={1}
                              src={card.image}
                              maxW="64px"
                              my="6"
                              alt="41 card"
                              key={card.code}
                            />
                          )
                        })}
                      </SimpleGrid>
                    </Box>
                  )
                })}
              </SimpleGrid>
            </ModalBody>
            <ModalFooter>
              <Button
                colorScheme="teal"
                onClick={() => {
                  setCurrentUser(null)
                  getCards()
                  onClose()
                }}
              >
                Play Again
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        {gameData === null && (
          <>
            <Heading as="h3" my="4">
              Ready to play? Let{`'s`} start!
            </Heading>
            <Tabs colorScheme={'teal'} isFitted variant="soft-rounded">
              {currentUser === null && (
                <TabList mb="1em">
                  <Tab onClick={() => setCurrentUser(null)}>Create a Room</Tab>
                  <Tab onClick={() => setCurrentUser(null)}>Be a Guest</Tab>
                </TabList>
              )}
              <TabPanels>
                <TabPanel>
                  {currentUser === null ? (
                    <Flex justifyContent={'center'}>
                      <Input
                        placeholder="Enter your name"
                        w="full"
                        mr="4"
                        onChange={e => {
                          setName(e.target.value)
                        }}
                        colorScheme="teal"
                        color={'teal'}
                        borderColor={'teal'}
                      />
                      <Button
                        onClick={() => {
                          const playerId = generateRoomId()
                          const player = new Player(
                            name,
                            playerId,
                            true,
                            'jump'
                          )
                          setCurrentUser(player)
                        }}
                        colorScheme={'teal'}
                        variant="outline"
                      >
                        Save
                      </Button>
                    </Flex>
                  ) : (
                    <Flex alignItems="center" flexDirection={'column'}>
                      <Text
                        textAlign={'center'}
                        fontSize="xl"
                        fontWeight="bold"
                        color="gray.500"
                      >
                        Hello {currentUser.name}! You are the host of this room.
                        You can share this room id to your friends so they can
                        join the game.
                      </Text>
                      {value === '' ? (
                        <Button
                          mt="8"
                          mx={'auto'}
                          colorScheme="teal"
                          variant={'outline'}
                          onClick={() => {
                            const roomId = generateRoomId()
                            setValue(roomId)
                            currentSocket.emit('join-room', currentUser, roomId)
                          }}
                        >
                          Generate Room Id
                        </Button>
                      ) : (
                        <>
                          <Text
                            fontSize="xl"
                            fontWeight="bold"
                            color="gray.500"
                            textAlign="center"
                            alignItems={'center'}
                            my="3"
                            textTransform={'uppercase'}
                          >
                            Room id: <b>{value}</b>
                          </Text>
                          <Button
                            size={'sm'}
                            colorScheme="teal"
                            variant={'outline'}
                            onClick={onCopy}
                          >
                            {hasCopied ? 'Copied!' : 'Copy'}
                          </Button>
                        </>
                      )}
                    </Flex>
                  )}
                </TabPanel>
                <TabPanel>
                  {currentUser === null ? (
                    <Flex justifyContent={'center'}>
                      <Input
                        placeholder="Enter your name"
                        w="full"
                        mr="4"
                        onChange={e => {
                          setName(e.target.value)
                        }}
                        colorScheme="teal"
                        color={'teal'}
                        borderColor={'teal'}
                      />
                      <Button
                        onClick={() => {
                          const playerId = generateRoomId()
                          const player = new Player(
                            name,
                            playerId,
                            false,
                            'jump'
                          )
                          setCurrentUser(player)
                        }}
                        colorScheme={'teal'}
                        variant="outline"
                      >
                        Save
                      </Button>
                    </Flex>
                  ) : (
                    <>
                      <Text
                        textAlign={'center'}
                        fontSize="xl"
                        fontWeight="bold"
                        color="gray.500"
                      >
                        Hello, <b>{currentUser.name}</b>! Please enter the room
                        id to join the game.
                      </Text>
                      <Flex justifyContent={'center'} mt="8">
                        <Input
                          placeholder="Enter room id"
                          w="full"
                          mr="4"
                          onChange={e => {
                            setValue(e.target.value)
                          }}
                          colorScheme="teal"
                          color={'teal'}
                          borderColor={'teal'}
                        />
                        <Button
                          colorScheme={'teal'}
                          variant="outline"
                          onClick={() => {
                            console.log(currentSocket)
                            currentSocket.emit('join-room', currentUser, value)
                          }}
                        >
                          Join
                        </Button>
                      </Flex>
                    </>
                  )}
                </TabPanel>
              </TabPanels>
            </Tabs>
            {players.length > 0 && (
              <Box
                textAlign={'center'}
                fontSize="xl"
                fontWeight="bold"
                color="gray.500"
              >
                {currentUser && !currentUser.isHost && (
                  <Text>Waiting for the host to start the game</Text>
                )}
                <Text>Players in this room: {players.length}</Text>
                {players.map(player => {
                  return <Text key={player.id}>{player.name}</Text>
                })}
              </Box>
            )}
            <Button
              mt="8"
              mx={'25%'}
              colorScheme="teal"
              variant={'outline'}
              size={'lg'}
              textTransform={'uppercase'}
              onClick={startGame}
              w="50%"
              disabled={
                players.length < 2 || !currentUser?.isHost || players.length > 4
              }
            >
              Start
            </Button>
          </>
        )}

        <Flex justifyContent={'center'}>
          <SimpleGrid columns={7} w="full" spacing="20" placeItems="center">
            {gameData &&
              gameData.players.map(player => {
                return (
                  <Box
                    w="fit-content"
                    key={player.id}
                    gridRow={(() => {
                      switch (gameData.players.length) {
                        case 2:
                          if (player.id === currentUser.id) return 3
                          return 1
                        default:
                          if (player.id === currentUser.id) return 3
                          if (player.id === currentUser.next) return 2
                          if (player.id === currentUser.prev) return 2
                          return 1
                      }
                    })()}
                    gridColumn={(() => {
                      switch (gameData.players.length) {
                        case 2:
                          return 4
                        default:
                          if (player.id === currentUser.id) return 4
                          if (player.id === currentUser.next) return 1
                          if (player.id === currentUser.prev) return 7
                          return 4
                      }
                    })()}
                  >
                    <Flex
                      gap="64px"
                      alignItems="center"
                      justifyContent={'center'}
                      flexDirection={(() => {
                        switch (gameData.players.length) {
                          case 2:
                            if (player.id === currentUser.id)
                              return 'column-reverse'
                            return 'column'
                          default:
                            if (player.id === currentUser.id)
                              return 'column-reverse'
                            if (player.id === currentUser.next) return 'row'
                            if (player.id === currentUser.prev)
                              return 'row-reverse'
                            return 'column'
                        }
                      })()}
                      w="fit-content"
                    >
                      <Box>
                        <Image
                          mx="auto"
                          src={player.character}
                          maxW="64px"
                          alt="character"
                        />
                        <Text
                          mt="2"
                          color="teal"
                          fontWeight="bold"
                          fontSize="xl"
                        >
                          {player.name}
                        </Text>
                      </Box>
                      <Box display="flex" justifyContent="center">
                        <SimpleGrid
                          placeItems="center"
                          columns={41}
                          minW="64px"
                        >
                          {player?.cardsShown?.map((card, index) => (
                            <Image
                              key={index}
                              _hover={
                                player.id === currentUser.id && {
                                  outline: '2px solid #008080',
                                  borderRadius: 'md',
                                  transition: 'all 0.2s ease-in-out',
                                  transform: 'translateY(-5px)'
                                }
                              }
                              gridColumn={`${10 * index + 1}`}
                              gridRow={1}
                              maxW="64px"
                              src={
                                player.id === currentUser.id
                                  ? card?.image
                                  : '/images/posts/backcard.png'
                              }
                              onClick={() => {
                                if (player.cardsShown.length !== 5) return
                                const nextPlayer = getPlayerFromGameData(
                                  player.next
                                )
                                nextPlayer.cardsFold = [
                                  ...nextPlayer.cardsFold,
                                  card
                                ]
                                player.cardsShown = player.cardsShown.filter(
                                  cardShown => cardShown.code !== card.code
                                )
                                const data = {
                                  ...gameData,
                                  currentTurn: nextPlayer.id
                                }
                                currentSocket.emit('play-card', data, value)
                              }}
                              alt={card?.code}
                            />
                          ))}
                        </SimpleGrid>
                      </Box>
                      <Box
                        display="grid"
                        placeItems={'center'}
                        gridTemplateColumns="repeat(1, 1fr)"
                        gridTemplateRows="repeat(1, 1fr)"
                      >
                        {player?.cardsFold?.map((card, index) => (
                          <Box
                            key={index}
                            transform={`rotate(${Math.floor(
                              (Math.random() - 0.5) * 45
                            )}deg)`}
                            gridColumn={1}
                            gridRow={1}
                            onClick={() => {
                              if (player.cardsShown.length === 5) return
                              if (gameData.currentTurn !== player.id) return
                              const card = player.cardsFold.pop()
                              player.cardsShown = [...player.cardsShown, card]
                              const data = {
                                players: gameData.players,
                                currentTurn: player.id,
                                cards: gameData.cards
                              }
                              currentSocket.emit('play-card', data, value)
                            }}
                          >
                            <Image
                              _hover={
                                player.id === currentUser.id &&
                                player?.cardsFold?.length === index + 1 && {
                                  outline: '2px solid #008080',
                                  borderRadius: 'md',
                                  transition: 'all 0.2s ease-in-out'
                                }
                              }
                              maxW="64px"
                              src={card.image}
                              alt={card.code}
                            />
                          </Box>
                        ))}
                      </Box>
                    </Flex>
                  </Box>
                )
              })}

            <Box gridRow="2" gridColumn="4" whiteSpace={'nowrap'}>
              {gameData !== null && (
                <Text
                  color="teal"
                  fontWeight="bold"
                  fontSize="xl"
                  transform={'translateY(-20px)'}
                >
                  {getPlayerFromGameData(gameData?.currentTurn)?.name ===
                  currentUser?.name
                    ? 'Your Turn'
                    : `Waiting for ${
                        getPlayerFromGameData(gameData?.currentTurn)?.name
                      } to make a move`}
                </Text>
              )}
              <Box
                display={'flex'}
                justifyContent="center"
                transform={'translateX(32px)'}
                onClick={() => {
                  if (gameData.currentTurn !== currentUser.id) return
                  if (currentUser.cardsShown.length === 5) return
                  const card = gameData.cards[gameData.cards.length - 1]
                  const player = getPlayerFromGameData(currentUser.id)
                  player.cardsShown = [...player.cardsShown, card]
                  const data = {
                    ...gameData,
                    currentTurn: gameData.currentTurn,
                    cards: gameData.cards.slice(0, -1)
                  }
                  currentSocket.emit('play-card', data, value)
                }}
              >
                {gameData?.cards.map((card, index) => (
                  <Image
                    _hover={{
                      outline: '2px solid #008080',
                      borderRadius: 'md',
                      transition: 'all 0.2s ease-in-out'
                    }}
                    key={index}
                    ml={`-${63.7}px`}
                    maxW="64px"
                    src={'/images/posts/backcard.png'}
                    alt={card.code}
                  />
                ))}
              </Box>
            </Box>
          </SimpleGrid>
        </Flex>
      </Container>
    </Layout>
  )
}

export default Game41
