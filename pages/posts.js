import { Heading, Container, SimpleGrid, Divider } from '@chakra-ui/react'
import Section from '../components/section'
import { PostGridItem } from '../components/grid-item'
import cardThumbnail from '../public/images/posts/21CardMagic_1.jpg'
import cardGameThumbnail from '../public/images/posts/24CardGame_1.jpg'
import impostorThumbnail from '../public/images/posts/ImpostorCard_1.jpg'
import knightThumbnail from '../public/images/posts/KnightRiddle_1.jpg'
import cardConnectThumbnail from '../public/images/posts/cardconnect_1.png'
import fourtyOneThumbnail from '../public/images/posts/41_1.jpg'

const Posts = () => {
  return (
    <Container>
      {/* <Box>
        {cards.map(card => {
          return (
            <Box key={card.code} m={2} d="inline-block">
              <img src={card.image} alt={card.code} />
            </Box>
          )
        })}
      </Box> */}
      <Heading as="h3" fontSize={20} mb={4}>
        Magic
      </Heading>

      <SimpleGrid columns={[1, 1, 2]} gap={6}>
        <Section>
          <PostGridItem
            id="21cardsmagic"
            title="21 Cards Magic"
            thumbnail={cardThumbnail}
          >
            A magic trick that uses 21 cards. Based on the principle of
            mathematical modularity.
          </PostGridItem>
        </Section>
      </SimpleGrid>

      <Section delay={0.3}>
        <Divider my={6} />
        <Heading as="h3" fontSize={20} mb={4}>
          Games
        </Heading>
      </Section>
      <SimpleGrid columns={[1, 1, 2]} gap={6}>
        <Section delay={0.6}>
          <PostGridItem id="24" title="24 Game" thumbnail={cardGameThumbnail}>
            A Mathematics game that use 4 cards. The goal is to get the number
            24 using the calculations of the 4 cards.
          </PostGridItem>
        </Section>
        <Section delay={0.9}>
          <PostGridItem
            id="impostorcard"
            title="Impostor Card Game"
            thumbnail={impostorThumbnail}
          >
            A card game that requires 2 players. The player who has the impostor
            card loses the game.
          </PostGridItem>
        </Section>
        <Section delay={1.2}>
          <PostGridItem
            id="knightriddle"
            title="Knight Riddle Game"
            thumbnail={knightThumbnail}
          >
            A game that based on the principle of game theory. The goal is to
            always be able to move the knight to the next position.
          </PostGridItem>
        </Section>
        <Section delay={1.5}>
          <PostGridItem
            id="cardconnect"
            title="Card Connect Game"
            thumbnail={cardConnectThumbnail}
          >
            A mini game that uses a full deck of cards. The goal is to connect
            all the cards with the same value.
          </PostGridItem>
        </Section>
        <Section delay={1.5}>
          <PostGridItem id="41" title="41 Game" thumbnail={fourtyOneThumbnail}>
            A game that uses 4 cards. The first player to get the number 41 wins
            the game.
          </PostGridItem>
        </Section>
      </SimpleGrid>
    </Container>
  )
}

export default Posts
export { getServerSideProps } from '../components/chakra'
