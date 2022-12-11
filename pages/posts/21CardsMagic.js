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

const Award = () => {
  const [cards, setCards] = useState([])
  const [currentStep, setCurrentStep] = useState(0)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const drawCards = () => {
    axios
      .get('https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
      .then(res => {
        const deck_id = res.data.deck_id
        axios
          .get(
            `https://www.deckofcardsapi.com/api/deck/${deck_id}/draw/?count=21`
          )
          .then(res => {
            setCards(res.data.cards)
          })
      })
  }

  const handleClick = numOfColumn => {
    if (currentStep === 3) {
      onOpen()
    }
    const oneModThree = cards.filter((card, index) => {
      return index % 3 === 1
    })

    const twoModThree = cards.filter((card, index) => {
      return index % 3 === 2
    })

    const zeroModThree = cards.filter((card, index) => {
      return index % 3 === 0
    })
    setCurrentStep(currentStep + 1)
    switch (numOfColumn) {
      case 1:
        setCards([...twoModThree, ...zeroModThree, ...oneModThree])
        break
      case 2:
        setCards([...zeroModThree, ...oneModThree, ...twoModThree])
        break
      case 3:
        setCards([...oneModThree, ...twoModThree, ...zeroModThree])
        break
      default:
        break
    }
  }

  return (
    <Layout title="21 Cards Magic">
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Voala!!</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Your card is</Text>
            <Image
              mx="auto"
              mt="3"
              maxW="64px"
              src={cards[10]?.image}
              alt={cards[10]?.code}
            />
          </ModalBody>

          <ModalFooter>
            <Button
              cursor={'none'}
              colorScheme="blue"
              mr={3}
              onClick={() => {
                setCards([])
                setCurrentStep(0)
                onClose()
              }}
            >
              Play Again
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Container>
        <Title type="Posts">
          21 cards <Badge>Magic</Badge>
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
            <Box display={currentStep !== 0 && 'none'}>
              <Box
                display={currentStep === 0 ? 'flex' : 'none'}
                justifyContent="center"
              >
                {cards.map((card, index) => (
                  <Image
                    key={index}
                    ml={`-${48}px`}
                    maxW="64px"
                    src={card.image}
                    alt={card.code}
                  />
                ))}
              </Box>
              <Text mt="3" textAlign={'center'}>
                Think of a card from the deck above and don{`'`}t tell me
              </Text>
              <Button
                cursor={'none'}
                onClick={() => setCurrentStep(currentStep + 1)}
                colorScheme={'teal'}
                my="4"
              >
                Next Step
              </Button>
            </Box>
            <Box display={currentStep === 0 && 'none'}>
              <Text textAlign={'center'} mb="1">
                {currentStep === 1 && 'I need your help! Which column is your card?'}
                {currentStep === 2 && 'I promise I can guess it! Which column is your card?'}
                {currentStep === 3 && 'This is the last step! Which column is your card?'}
              </Text>
              <SimpleGrid columns={3} placeItems={'center'}>
                {cards.map((card, index) => (
                  <Image
                    key={index}
                    maxW="64px"
                    src={card.image}
                    alt={card.code}
                    my="1"
                  />
                ))}
                <Button
                  cursor={'none'}
                  colorScheme={'teal'}
                  onClick={() => handleClick(1)}
                  my="4"
                >
                  Here
                </Button>
                <Button
                  cursor={'none'}
                  colorScheme={'teal'}
                  onClick={() => handleClick(2)}
                  my="4"
                >
                  Here
                </Button>
                <Button
                  cursor={'none'}
                  colorScheme={'teal'}
                  onClick={() => handleClick(3)}
                  my="4"
                >
                  Here
                </Button>
              </SimpleGrid>
            </Box>
          </Box>
        )}
      </Container>
    </Layout>
  )
}

export default Award
