import {
  Container,
  Badge,
  Box,
  Text,
  Heading,
  Button,
  Image,
  SimpleGrid,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
  List,
  ListItem,
  Input
} from '@chakra-ui/react'
import { Title, Meta } from '../../components/pageItem'
import Layout from '../../components/layouts/article'
import { useState, useEffect } from 'react'
import axios from 'axios'
import stringMath from 'string-math'
import P from '../../components/paragraph'
import { isSuccess } from '../../functions/api'

const Math24 = () => {
  const [cards, setCards] = useState([])
  const [selectedCards, setSelectedCards] = useState([])
  const [currentCalculation, setCurrentCalculation] = useState('')
  const [highScores, setHighScores] = useState([])
  const [cardIsUsed, setCardIsUsed] = useState([false, false, false, false])
  const [numOfCardsUsed, setNumOfCardsUsed] = useState(0)
  const [isStarted, setIsStarted] = useState(false)
  const [startTime, setStartTime] = useState(0)
  const [correctAnswer, setCorrectAnswer] = useState(0)
  const [finalScore, setFinalScore] = useState(0)
  const [name, setName] = useState('')
  const [modalData, setModalData] = useState(null)

  //   0 = last selected is a number
  //   1 = last selected is an operator
  const [currentSelection, setCurrentSelection] = useState(1)
  const { isOpen, onOpen, onClose } = useDisclosure()

  const drawCards = () => {
    axios
      .get('https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
      .then(res => {
        const deck_id = res.data.deck_id
        axios
          .get(
            `https://www.deckofcardsapi.com/api/deck/${deck_id}/draw/?count=52`
          )
          .then(res => {
            setCards(res.data.cards)
            setIsStarted(true)
            setStartTime(Date.now())
            setFinalScore(0)
            setCorrectAnswer(0)
          })
      })
  }

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/api/scores/24`, {})
      .then(res => {
        if (isSuccess(res)) {
          console.log(res?.data?.data?.['24'])
          setHighScores(res?.data?.data?.['24'])
        }
      })
  }, [])

  const get4Cards = () => {
    const last4Cards = cards.slice(-4)
    setCards(cards.slice(0, -4))
    setSelectedCards(last4Cards)
    setCurrentSelection(1)
    setCurrentCalculation('')
    setNumOfCardsUsed(0)
    setCardIsUsed([false, false, false, false])
  }

  const restartGame = () => {
    setFinalScore(
      correctAnswer * 100 - Math.floor((Date.now() - startTime) / 1000)
    )
    onOpen()
    setCards([])
    setIsStarted(false)
    setSelectedCards([])
  }

  const calculateHandler = () => {
    var result = 0
    try {
      result = stringMath(currentCalculation)
      setCurrentCalculation(result)
    } catch (e) {
      alert('Invalid calculation')
      setCurrentSelection(1)
      setCurrentCalculation('')
      setNumOfCardsUsed(0)
      setCardIsUsed([false, false, false, false])
    }
    if (result === 24 && numOfCardsUsed === 4) {
      setCurrentSelection(1)
      setCurrentCalculation('')
      setNumOfCardsUsed(0)
      setCardIsUsed([false, false, false, false])
      setCorrectAnswer(correctAnswer + 1)
      if (cards.length === 0) {
        let isNewHighScore = false
        for (let i = 0; i < highScores.length; i++) {
          if (finalScore > highScores[i].score) {
            isNewHighScore = true
            break
          }
        }
        if (isNewHighScore || highScores.length < 3) {
          setModalData({
            title: 'New High Score!',
            description: `You got ${finalScore} points! Enter your name to be featured on the leaderboard`,
            isNewHighScore: true
          })
        }
        restartGame()
      } else {
        get4Cards()
      }
      return
    }
    return result
  }

  const shareHandler = () => {
    if (navigator.share) {
      navigator
        .share({
          title: '24 Game',
          text: `I got ${correctAnswer} correct answers in 24 Game with  ${Math.floor(
            (correctAnswer / 13) * 100
          )}% accuracy. My final score is ${finalScore}. Try to beat me!\n`,
          url: 'https://abdurrahmanbasyah.com/posts/24Game'
        })
        .then(() => console.log('Successful share'))
        .catch(error => console.log('Error sharing', error))
    }
  }

  return (
    <Layout title="24 Cards Game">
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalBody>
            <ModalBody
              display={'flex'}
              flexDirection="column"
              alignItems={'center'}
            >
              {modalData?.isNewHighScore && (
                <>
                  <Heading as="h3" my="4" variant="section-title">
                    {modalData?.title}
                  </Heading>
                  <Text textAlign="center" my="4">
                    {modalData?.description}
                  </Text>
                  <Input
                    placeholder="Enter your name"
                    onChange={e => {
                      setName(e.target.value)
                    }}
                    value={name}
                    my="4"
                  />
                </>
              )}
            </ModalBody>
            <Heading as="h3" variant="section-title" textAlign="center">
              STATISTICS
            </Heading>
            <Box display={'flex'} my="6" justifyContent="center" gap="10">
              <Box>
                <Heading textAlign="center" as="h4">
                  {correctAnswer}
                </Heading>
                <Text textAlign="center">Correct Answer</Text>
              </Box>
              <Box>
                <Heading textAlign="center" as="h4">
                  {Math.floor((Date.now() - startTime) / 1000)}
                </Heading>
                <Text textAlign="center">Time</Text>
              </Box>
              <Box>
                <Heading textAlign="center" as="h4">
                  {Math.floor((correctAnswer / 13) * 100)}%
                </Heading>
                <Text textAlign="center">Accuracy</Text>
              </Box>
              <Box>
                <Heading textAlign="center" as="h4">
                  {finalScore}
                </Heading>
                <Text textAlign="center">Final Score</Text>
              </Box>
            </Box>
          </ModalBody>

          <ModalFooter>
            <Button
              cursor={'none'}
              colorScheme="cyan"
              variant={'outline'}
              mr={3}
              onClick={() => {
                shareHandler()
              }}
            >
              Share
            </Button>
            <Button
              variant={'outline'}
              cursor={'none'}
              colorScheme="teal"
              onClick={() => {
                onClose()
              }}
            >
              New Game
            </Button>
            {modalData?.isNewHighScore && (
              <Button
                ml={3}
                cursor={'none'}
                colorScheme="teal"
                onClick={() => {
                  axios
                    .put(`${process.env.NEXT_PUBLIC_API_URL}/api/scores`, {
                      game: '24',
                      username: name,
                      score: finalScore
                    })
                    .then(res => {
                      if (isSuccess(res)) {
                        onClose()
                      }
                    })
                    .catch(err => {
                      console.log(err)
                    })
                }}
              >
                Submit
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Container>
        <Title type="Posts">
          24 <Badge>Game</Badge>
        </Title>

        <P>
          24 is a card game where the player is given 4 cards and has to use
          them to make a calculation that equals to 24. The player can use
          addition, subtraction, multiplication, and division. The player can
          also use brackets to change the order of operations. The player can
          only use each card once.
        </P>
        <P>
          {`24 game is a common mathematics game that is used to test the player's
          ability to think logically and strategically.The game is also used to test the player's ability to
          calculate numbers quickly and accurately.`}
        </P>
        <P>
          {`A round is over when the player can no longer make a calculation that
          equals to 24. The player can get a new set of cards by pressing the deck of cards.
          The game is over when the player has used all the cards or end the game by pressing the
          "Give up" button. The player's score is calculated by multiplying the
          number of correct answers by 100 and subtracting the number of seconds
          it took to finish the game. The player can also share their score to a
          social media platform. Therefore, mathematically, the maximum score is
          1300.`}
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
            <span>Game, Soloplayer, Mathematics</span>
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
        {!isStarted ? (
          <>
            <Heading as="h3">Ready to play? Let{`'s`} start!</Heading>
            <Button
              cursor={'none'}
              onClick={drawCards}
              colorScheme="teal"
              my="4"
            >
              Shuffle Cards
            </Button>
          </>
        ) : (
          <Box>
            <Heading as="h3" variant="section-title">
              Cards
            </Heading>
            <Box>
              <Box display={'flex'} justifyContent="center">
                {cards.map((card, index) => (
                  <Image
                    _hover={{
                      outline: '2px solid #008080',
                      borderRadius: 'md',
                      transition: 'all 0.2s ease-in-out'
                    }}
                    key={index}
                    ml={`-${63.5}px`}
                    maxW="64px"
                    src={card.image}
                    alt={card.code}
                    onClick={get4Cards}
                  />
                ))}
              </Box>
              <Text textAlign={'center'} my="3">
                {cards.length >= 4 && 'Click on the deck to get 4 new cards'}
              </Text>
              <Box
                display={'flex'}
                alignItems="center"
                justifyContent="space-between"
              >
                <Box>
                  <Text my="3">{`Cards left: ${cards.length}`}</Text>
                  <Text my="3">{`Correct Answer: ${correctAnswer}`}</Text>
                </Box>
                <Button
                  cursor={'none'}
                  onClick={() => {
                    let isNewHighScore = false
                    let final = correctAnswer * 100 - Math.floor((Date.now() - startTime) / 1000)
                    for (let i = 0; i < highScores.length; i++) {
                      if (final > highScores[i].score) {
                        isNewHighScore = true
                        break
                      }
                    }
                    console.log(finalScore, highScores);
                    if (isNewHighScore || highScores.length < 3) {
                      setModalData({
                        title: 'New High Score!',
                        description: `You got ${final} points! Enter your name to be featured on the leaderboard`,
                        isNewHighScore: true
                      })
                    }
                    restartGame()
                  }}
                  colorScheme="red"
                  my="4"
                >
                  give up
                </Button>
              </Box>
            </Box>

            <Heading as="h3" variant="section-title">
              Calculations
            </Heading>
            <Heading as="h2" my="4" textAlign={'center'}>
              {currentCalculation === '' ? '0' : currentCalculation}
            </Heading>

            <SimpleGrid columns={2} spacing={10} placeItems="center">
              {selectedCards.map((card, index) => (
                <Box key={index} m={2} d="inline-block">
                  <input
                    type="checkbox"
                    id={card.code}
                    name={card.code}
                    value={card.code}
                    style={{ display: 'none' }}
                    _checked={{
                      bg: 'teal.500',
                      color: 'white',
                      borderColor: 'teal.500'
                    }}
                  />
                  <label htmlFor={card.code}>
                    <Image
                      cursor={'none'}
                      _hover={{
                        outline: '2px solid #008080',
                        borderRadius: 'md',
                        transition: 'all 0.2s ease-in-out'
                      }}
                      filter={currentSelection === 0 ? 'opacity(50%)' : ''}
                      visibility={cardIsUsed[index] ? 'hidden' : 'visible'}
                      onClick={() => {
                        if (currentSelection === 1) {
                          if (!cardIsUsed[index]) {
                            setCardIsUsed([
                              ...cardIsUsed.slice(0, index),
                              true,
                              ...cardIsUsed.slice(index + 1)
                            ])
                            if (card.value === 'KING') {
                              setCurrentSelection(0)
                              setCurrentCalculation(currentCalculation + '13')
                            } else if (card.value === 'QUEEN') {
                              setCurrentSelection(0)
                              setCurrentCalculation(currentCalculation + '12')
                            } else if (card.value === 'JACK') {
                              setCurrentSelection(0)
                              setCurrentCalculation(currentCalculation + '11')
                            } else if (card.value === 'ACE') {
                              setCurrentSelection(0)
                              setCurrentCalculation(currentCalculation + '1')
                            } else {
                              setCurrentSelection(0)
                              setCurrentCalculation(
                                currentCalculation + card.value
                              )
                            }
                            setNumOfCardsUsed(numOfCardsUsed + 1)
                          }
                        }
                      }}
                      key={index}
                      maxW="64px"
                      src={card.image}
                      alt={card.code}
                    />
                  </label>
                </Box>
              ))}
            </SimpleGrid>
            <SimpleGrid columns={4} gap={8} my="8" placeItems="center">
              <Button
                cursor={'none'}
                colorScheme={currentSelection === 0 ? 'teal' : 'gray'}
                variant={currentSelection === 0 ? 'solid' : 'outline'}
                disabled={currentSelection === 1}
                onClick={() => {
                  setCurrentSelection(1)
                  setCurrentCalculation(currentCalculation + ' + ')
                }}
              >
                +
              </Button>
              <Button
                cursor={'none'}
                colorScheme={currentSelection === 0 ? 'teal' : 'gray'}
                variant={currentSelection === 0 ? 'solid' : 'outline'}
                disabled={currentSelection === 1}
                onClick={() => {
                  setCurrentSelection(1)
                  setCurrentCalculation(currentCalculation + ' - ')
                }}
              >
                -
              </Button>
              <Button
                cursor={'none'}
                colorScheme={currentSelection === 0 ? 'teal' : 'gray'}
                variant={currentSelection === 0 ? 'solid' : 'outline'}
                disabled={currentSelection === 1}
                onClick={() => {
                  setCurrentSelection(1)
                  setCurrentCalculation(currentCalculation + ' * ')
                }}
              >
                x
              </Button>
              <Button
                cursor={'none'}
                colorScheme={currentSelection === 0 ? 'teal' : 'gray'}
                variant={currentSelection === 0 ? 'solid' : 'outline'}
                disabled={currentSelection === 1}
                onClick={() => {
                  setCurrentSelection(1)
                  setCurrentCalculation(currentCalculation + ' / ')
                }}
              >
                :
              </Button>

              <Button
                colorScheme={'teal'}
                variant={'solid'}
                cursor={'none'}
                onClick={() => {
                  setCurrentCalculation('')
                  setCurrentSelection(1)
                  setCardIsUsed([false, false, false, false])
                  setNumOfCardsUsed(0)
                }}
              >
                Clear
              </Button>
              <Button
                colorScheme={'teal'}
                variant={'solid'}
                cursor={'none'}
                onClick={() => {
                  setCurrentCalculation(currentCalculation + ' ( ')
                }}
              >
                {`(`}
              </Button>
              <Button
                colorScheme={'teal'}
                variant={'solid'}
                cursor={'none'}
                onClick={() => {
                  setCurrentCalculation(currentCalculation + ' ) ')
                }}
              >
                {`)`}
              </Button>
              <Button
                colorScheme="orange"
                variant={'solid'}
                cursor={'none'}
                onClick={() => {
                  calculateHandler()
                }}
              >
                Calculate
              </Button>
            </SimpleGrid>
          </Box>
        )}
      </Container>
    </Layout>
  )
}

export default Math24
