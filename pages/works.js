import {
  Container,
  Heading,
  SimpleGrid,
  Divider,
  Center
} from '@chakra-ui/react'
import Layout from '../components/layouts/article'
import Section from '../components/section'
import { WorkGridItem } from '../components/grid-item'

// import thumbFourPainters from '../public/images/works/the-four-painters_eyecatch.jpg'
// import thumbMenkiki from '../public/images/works/menkiki_eyecatch.png'
// import thumbModeTokyo from '../public/images/works/modetokyo_eyecatch.png'
// import thumbStyly from '../public/images/works/styly_eyecatch.png'
// import thumbFreeDBTagger from '../public/images/works/freedbtagger_eyecatch.png'
// import thumbAmembo from '../public/images/works/amembo_eyecatch.png'
import SxC from '../public/images/works/SxC_1.png'
import sabilamall from '../public/images/works/sabilamall_1.png'
import movieapp from '../public/images/works/movieapp_2.png'
import pikachu from '../public/images/works/pikachu_1.png'
import todo from '../public/images/works/todo_2.png'
import personal from '../public/images/works/personal_1.png'
import covidapp from '../public/images/works/covid_2.png'
import invoicetify from '../public/images/works/invoicetify.png'

const Works = () => (
  <Layout title="Works">
    <Container>
      <Heading as="h3" fontSize={20} mb={4}>
        Works
      </Heading>

      <SimpleGrid columns={[1, 1, 2]} gap={6}>
        <Section>
          <WorkGridItem
            id="SxCIntersummit"
            title="SxC Intersummit"
            thumbnail={SxC}
          >
            A Grand Event consisting of a sequence of Pre-Event, PBC, Chambers,
            Virtual Company Visit, and Main Conference.
          </WorkGridItem>
        </Section>
        <Section delay={0.3}>
          <WorkGridItem
            id="sabilamall"
            title="Sabila Mall"
            thumbnail={sabilamall}
          >
            Reseller and dropshipper platform
          </WorkGridItem>
        </Section>

        <Section delay={0.6}>
          <WorkGridItem
            id="invoicetify"
            title="Invoicetify"
            thumbnail={invoicetify}
          >
            An invoice mockup of list of the most played songs on Spotify.
          </WorkGridItem>
        </Section>
      </SimpleGrid>

      <Section delay={0.9}>
        <Divider my={6} />
        <Heading as="h3" fontSize={20} mb={4}>
          Old works
        </Heading>
      </Section>

      <SimpleGrid columns={[1, 1, 2]} gap={6}>
        <Section delay={1.2}>
          <WorkGridItem id="movieapp" thumbnail={movieapp} title="Movie app">
            Movie app that allows user to add search, add and remove wishlist
            and liked movies
          </WorkGridItem>
        </Section>
        <Section delay={1.5}>
          <WorkGridItem id="pikachu" thumbnail={pikachu} title="Grid Pikachu">
            Just a pikachu
          </WorkGridItem>
        </Section>
      </SimpleGrid>
      <SimpleGrid columns={[1, 1, 2]} gap={6}>
        <Section delay={1.8}>
          <WorkGridItem id="todolist" thumbnail={todo} title="TODO list">
            A simple responsive todo list app with the deadline date
          </WorkGridItem>
        </Section>
        <Section delay={2.1}>
          <WorkGridItem
            id="personal"
            thumbnail={personal}
            title="First personal website"
          >
            First ever personal website
          </WorkGridItem>
        </Section>
      </SimpleGrid>
      <Section delay={2.4}>
        <Divider my={6} />
        <Heading as="h3" fontSize={20} mb={4}>
          Other works
        </Heading>
      </Section>

      <SimpleGrid columns={[1, 1, 2]} gap={6}>
        <Section delay={2.7}>
          <WorkGridItem id="covidapp" thumbnail={covidapp} title="Covid App">
            Covid app consists of related information and discussion forums
          </WorkGridItem>
        </Section>
      </SimpleGrid>
      <Heading as="h3" fontSize={20} my={4}>
        <Center>More works in the close times</Center>
      </Heading>
    </Container>
  </Layout>
)

export default Works
export { getServerSideProps } from '../components/chakra'
