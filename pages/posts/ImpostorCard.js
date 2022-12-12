import {
  Container,
  Badge,
  Box,
  Text,
  Heading,
  Button,
  Image,
  Flex,
  Input
} from '@chakra-ui/react'
import { Title } from '../../components/pageItem'
import Layout from '../../components/layouts/article'
import { useState } from 'react'
import { io } from 'socket.io-client'
import axios from 'axios'
import { useEffect } from 'react'
import P from '../../components/paragraph'

const ImpostorCard = () => {
  const [playerId, setPlayerId] = useState('')
  const [hostId, setHostId] = useState('')
  const [data, setData] = useState({})
  //   0 = neutral, 1 = host, 2 = guest
  const [isHost, setIsHost] = useState(0)
  const [isCopied, setIsCopied] = useState(false)
  const [isJoined, setIsJoined] = useState(false)
  const [isStarted, setIsStarted] = useState(false)

  const socket = io("https://personal-be-production.up.railway.app", {
    withCredentials: true,
  })
//   const socket = io("http://localhost:3001")
  useEffect(() => {
    socket.on('connect', () => {
      setPlayerId(socket.id)
    })
  }, [])

  socket.on('user-connected', data => {
    if (data?.hostId === playerId) {
      setIsJoined(true)
      setData(data)
    } else if (data?.guestId === playerId) {
      setIsJoined(true)
      setData(data)
    }
  })

  socket.on('start-game', data => {
    setData(data)
    setIsStarted(true)
  })

  socket.on('play-card', data => {
    const newData = {
      ...data,
      hostCards: shuffleCards(removePairedCards(data.hostCards)),
      guestCards: shuffleCards(removePairedCards(data.guestCards))
    }
    console.log(newData?.hostCards.length)
    if (newData?.hostCards.length === 0) {
      console.log('guest win')
    } else if (newData?.guestCards.length === 0) {
      console.log('host win')
    }
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
            const newData = {
              hostId: data.hostId,
              guestId: data.guestId,
              hostCards: removePairedCards(res.data.cards.slice(0, 26)),
              guestCards: removePairedCards(res.data.cards.slice(26, 51)),
              turn: data.hostId
            }
            setData(newData)
            socket.emit('start-game', newData)
          })
      })
  }

  const handleJoin = () => {
    const data = {
      hostId: hostId,
      guestId: playerId,
      hostCards: [],
      guestCards: [],
      turn: hostId
    }
    setData(data)
    socket.emit('join-room', data)
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
                        if (playerId === data.turn) {
                          const guestCards = [
                            ...removePairedCards([...data.guestCards, card])
                          ]
                          const hostCards = removePairedCards(
                            data.hostCards.filter(c => c.code !== card.code)
                          )
                          const newData = {
                            hostId: data.hostId,
                            guestId: data.guestId,
                            hostCards: hostCards,
                            guestCards: guestCards,
                            turn: data.hostId
                          }
                          setData(newData)
                          socket.emit('play-card', newData)
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
                        if (playerId === data.turn) {
                          const hostCards = [
                            ...removePairedCards([...data.hostCards, card])
                          ]
                          const guestCards = removePairedCards(
                            data.guestCards.filter(c => c.code !== card.code)
                          )
                          const newData = {
                            hostId: data.hostId,
                            guestId: data.guestId,
                            hostCards: hostCards,
                            guestCards: guestCards,
                            turn: data.guestId
                          }
                          setData(newData)
                          socket.emit('play-card', newData)
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
            <Text textAlign="center" my="2">
              {playerId === data?.turn
                ? 'Choose one card from your opponents deck'
                : 'Wait for your opponent to play a card'}
            </Text>
            <Text>{`Host cards remaining: ${
              removePairedCards(data?.hostCards).length
            }`}</Text>
            <Text>{`Guest cards remaining: ${
              removePairedCards(data?.guestCards).length
            }`}</Text>
          </Box>
        ) : (
          <>
            <P>
              One card has been removed from the hand. Therefore, there are 25
              pairs and a card left in the deck. The player who has the last
              card in the hand will lose the game. After every turn, paired card from the hand will be removed and
              the remaining cards will be shuffled
            </P>
            <Heading as="h3" my="4">Ready to play? Let{`'s`} start!</Heading>

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
            {isHost === 1 && (
              <>
                {isJoined ? (
                  <Flex alignItems="center">
                    <Text>
                      Your friend has joined the game, click start to begin
                    </Text>
                    <Button
                      cursor={'none'}
                      colorScheme="teal"
                      my="4"
                      variant={'outline'}
                      ml="4"
                      fontSize={'xs'}
                      onClick={() => handleStart()}
                    >
                      Start
                    </Button>
                  </Flex>
                ) : (
                  <Flex alignItems={'center'}>
                    <Text
                      fontSize={'sm'}
                    >{`Invite your friend, here's your ID ${playerId}`}</Text>
                    <Button
                      cursor={'none'}
                      colorScheme="teal"
                      my="4"
                      variant={'outline'}
                      ml="4"
                      fontSize={'xs'}
                      onClick={() => {
                        setIsCopied(true)
                        navigator.clipboard.writeText(playerId)
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
                  <Text>
                    You have joined the game, waiting for the host to start
                  </Text>
                ) : (
                  <Flex alignItems={'center'}>
                    <Input
                      placeholder="Enter your friend's ID"
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
