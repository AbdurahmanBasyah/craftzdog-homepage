import {
  Container,
  Badge,
  Link,
  List,
  ListItem
} from '@chakra-ui/react'
import Layout from '../../components/layouts/article'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import { Title, WorkImage, Meta } from '../../components/pageItem'
import P from '../../components/paragraph'

const Work = () => (
  <Layout title="Movie App">
    <Container>
      <Title type="Works">
        pichu*pichu <Badge>2010</Badge>
      </Title>
      <P>
        A movie app that allows user to search for movies, add movies to bookmarked and liked section. Made with the support of API from IMDB. This is my first experience working with API, localstorage, and JSON.
      </P>

      <List ml={4} my={4}>
        <ListItem>
          <Meta>Website</Meta>
          <Link href="https://abdurahmanbasyah.github.io/Movie-App/">
          https://abdurahmanbasyah.github.io/Movie-App/ <ExternalLinkIcon mx="2px" />
          </Link>
        </ListItem>
        <ListItem>
          <Meta>Platform</Meta>
          <span>Windows/macOS/iOS/Android</span>
        </ListItem>
        <ListItem>
          <Meta>Stack</Meta>
          <span>ReactJS</span>
        </ListItem>
        <ListItem>
          <Meta>Source code</Meta>
          <Link href="https://github.com/AbdurahmanBasyah/Movie-App">
            Github Repositories<ExternalLinkIcon mx="2px" />
          </Link>
        </ListItem>
      </List>

      <WorkImage src="/images/works/movieapp_2.png" alt="movieapp" text="liked movies example" />
      <WorkImage src="/images/works/movieapp_3.png" alt="movieapp" text="bookmarked movies example" />
      <WorkImage src="/images/works/movieapp_4.jpeg" alt="movieapp" text="searching for more movies" />
    </Container>
  </Layout>
)

export default Work
