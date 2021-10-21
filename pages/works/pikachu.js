import {
  Container,
  Badge,
  List,
  ListItem,
} from '@chakra-ui/react'
import Layout from '../../components/layouts/article'
import { Title, WorkImage, Meta } from '../../components/pageItem'
import P from '../../components/paragraph'

const Work = () => (
  <Layout title="Pikachu">
    <Container>
      <Title type="Works">
        Grid of Pikachu <Badge>2021</Badge>
      </Title>
      <P>Automatic audio file tagging tool using FreeDB for Windows</P>

      <List ml={4} my={4}>
        <ListItem>
          <Meta>Stack</Meta>
          <span>NextJS</span>
        </ListItem>
        <ListItem>
          <Meta>Made For</Meta>
          <span>Me</span>
        </ListItem>
      </List>

      <WorkImage src="/images/works/pikachu_1.png" alt="pikachu" text="The only page" />
    </Container>
  </Layout>
)

export default Work
