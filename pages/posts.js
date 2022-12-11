import {
  Heading,
  Container,
  SimpleGrid,
} from '@chakra-ui/react'
import Section from '../components/section'
import { PostGridItem } from '../components/grid-item'
import cardThumbnail from '../public/images/posts/21CardMagic_1.jpg'

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
        Posts
      </Heading>

      <SimpleGrid columns={[1, 1, 2]} gap={6}>
        <Section>
          <PostGridItem
            id="21CardsMagic"
            title="21 Cards Magic"
            thumbnail={cardThumbnail}
          >
            A magic trick that uses 21 cards. Based on the principle of mathematical modularity.
          </PostGridItem>
        </Section>
      </SimpleGrid>
    </Container>
  )
}

export default Posts
export { getServerSideProps } from '../components/chakra'
