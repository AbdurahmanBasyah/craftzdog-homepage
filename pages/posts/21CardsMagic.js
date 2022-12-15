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
  ModalCloseButton,
  List,
  ListItem
} from '@chakra-ui/react'
import { Title, Meta } from '../../components/pageItem'
import Layout from '../../components/layouts/article'
import { useState } from 'react'
import axios from 'axios'
import P from '../../components/paragraph'

const Magic24 = () => {
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
        <P>
          This is a magic trick that I learned from my friend. It is a simple
          trick that you can do with a deck of cards. The trick is to guess the
          card that the magician is thinking of. The magician will shuffle the
          deck of cards and then ask you to think of a card. The magician will
          then ask you which column the card is in for three times
        </P>
        <P>
          <br />
          <br />
          SPOILER ALERT!! If you don{`'`}t want to know the trick, please don
          {`'`}t read the explanation below.
          <br />
          <br />
          The trick is to divide the deck of cards into three columns. The first
          column is the first card, the fourth card, the seventh card, the tenth
          card, the thirteenth card, the sixteenth card, the nineteenth card,
          and the twenty-second card. The second column is the second card, the
          fifth card, the eighth card, the eleventh card, the fourteenth card,
          the seventeenth card, and the twentieth card. The third column is the
          third card, the sixth card, the ninth card, the twelfth card, the
          fifteenth card, the eighteenth card, and the twenty-first card.
        </P>
        <P>
          The magician will ask you to think of a card and then ask you which
          column the card is in. Whatever column you choose, the magician will
          place the column in the middle. Therefore, the card that you are
          thinking of now will be in the middle of the deck. For example, if you
          choose the first column, the magician will place the first column in
          the middle. The cards will be in the order of the second column, the
          first column, and the third column. The card that you are thinking of
          will be in the new eighth, ninth, tenth, eleventh, twelfth,
          thirteenth, or fourteenth card. By dividing the deck of cards into
          three columns, the card will be in either the third, fourth, or fifth
          row.
        </P>
        <P>
          The magician will then ask you which column the card is in again. The
          magician will place the column in the middle again. The card that you
          are thinking of will be either the new eighth, ninth, tenth, eleventh,
          twelfth, thirteenth, or fourteenth card. But, because the card is in
          either the third, fourth, or fifth row, the card will be in either the
          tenth, eleventh, or twelfth card.
        </P>
        <P>
          Notice that when the cards is divide into three columns again, the
          tenth, eleventh, and twelfth card will be in the fourth row. The
          magician will then ask you which column the card is in again. The
          magician will place the column in the middle again. The card that you
          are thinking of will be either the new eighth, ninth, tenth, eleventh,
          twelfth, thirteenth, or fourteenth card. But, because the card is in
          either the fourth row, the card will be the eleventh card.
        </P>
        <List ml={4} my={4}>
          <ListItem>
            <Meta>Type</Meta>
            <span>Magic</span>
          </ListItem>
          <ListItem>
            <Meta>Category</Meta>
            <span>SoloPlayer</span>
          </ListItem>
          <ListItem>
            <Meta>Tags</Meta>
            <span>Magic, SoloPlayer, Mathematics</span>
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
                {currentStep === 1 &&
                  'I can guess your card, but I need some clues! Can you tell me which column is your card?'} 
                {currentStep === 2 &&
                  'I promise I can guess it! Which column is your card?'}
                {currentStep === 3 &&
                  'This is the last step! Which column is your card?'}
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

export default Magic24
