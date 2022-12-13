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
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton
} from '@chakra-ui/react'
import { Title } from '../../components/pageItem'
import Layout from '../../components/layouts/article'
import { useState } from 'react'
import axios from 'axios'
import stringMath from 'string-math'

const Math24 = () => {
  const [cards, setCards] = useState([])
  const [selectedCards, setSelectedCards] = useState([])
  const [currentCalculation, setCurrentCalculation] = useState('')
  const [score, setScore] = useState(0)
  const [cardIsUsed, setCardIsUsed] = useState([false, false, false, false])
  const [numOfCardsUsed, setNumOfCardsUsed] = useState(0)

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
          })
      })
  }

  const get4Cards = () => {
    const last4Cards = cards.slice(-4)
    setCards(cards.slice(0, -4))
    setSelectedCards(last4Cards)
    setCurrentSelection(1)
    setCurrentCalculation('')
    setNumOfCardsUsed(0)
    setCardIsUsed([false, false, false, false])
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
      setScore(score + 100)
      setCurrentSelection(1)
      setCurrentCalculation('')
      setNumOfCardsUsed(0)
      setCardIsUsed([false, false, false, false])
      get4Cards()
      onOpen()
      return
    }
    return result
  }

  return (
    <Layout title="24 Cards Game">
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Voala!! You got the 24</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>New Score: {score}</Text>
          </ModalBody>

          <ModalFooter>
            <Button
              cursor={'none'}
              colorScheme="blue"
              mr={3}
              onClick={() => {
                onClose()
              }}
            >
              Continue Playing
            </Button>
            <Button
              cursor={'none'}
              onClick={() => {
                setCards([])
                onClose()
              }}
            >
              New Game
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Container>
        <Title type="Posts">
          24 <Badge>Game</Badge>
        </Title>
        {cards.length === 0 ? (
          <>
            <Heading as="h3">Ready to play? Let{`'s`} start!</Heading>
            <Button
              cursor={'none'}
              onClick={drawCards}
              colorScheme="teal"
              my="4"
            >
              Draw Cards
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
                    _hover={{ outline: '2px solid #008080', borderRadius: 'md', transition: 'all 0.2s ease-in-out' }}
                    key={index}
                    ml={`-${63.5}px`}
                    maxW="64px"
                    src={card.image}
                    alt={card.code}
                    onClick={get4Cards}
                  />
                ))}
              </Box>
              <Text my="3">{`Cards left: ${cards.length}`}</Text>
              <Text my="3">{`Your score: ${score}`}</Text>
              <Text textAlign={'center'} my="3">
                Click the cards to start a new round
              </Text>
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
                      _hover={{ outline: '2px solid #008080', borderRadius: 'md', transition: 'all 0.2s ease-in-out' }}
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
