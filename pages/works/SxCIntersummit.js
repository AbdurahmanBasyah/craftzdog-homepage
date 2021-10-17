import { Container, Badge, Link, List, ListItem } from '@chakra-ui/react'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import { Title, WorkImage, Meta } from '../../components/pageItem'
import P from '../../components/paragraph'
import Layout from '../../components/layouts/article'

const Work = () => (
  <Layout title="Inkdrop">
    <Container>
      <Title type="Works">
        StudentxCEOs International Summit <Badge>2021</Badge>
      </Title>
      <P>
      A Platform that allows participant to register for StudentxCEOs International Summit pre-events, product branding competition, and main event. Registered 30 teams for the competition.
      </P>
      <List ml={4} my={4}>
        <ListItem>
          <Meta>Website</Meta>
          <Link href="https://www.sxcintersummit.com/">
            https://www.sxcintersummit.com/ <ExternalLinkIcon mx="2px" />
          </Link>
        </ListItem>
        <ListItem>
          <Meta>Platform</Meta>
          <span>Windows/macOS/iOS/Android</span>
        </ListItem>
        <ListItem>
          <Meta>Stack</Meta>
          <span>NextJS, ChakraUI</span>
        </ListItem>
        <ListItem>
          <Meta>Made For</Meta>
          <Link href="https://www.instagram.com/sxcintersummit/">
            StudentxCEOs International Summit<ExternalLinkIcon mx="2px" />
          </Link>
        </ListItem>
      </List>

      <WorkImage src="/images/works/SxC_1.png" alt="SxCInterSummit" text="landing page" />
      <WorkImage src="/images/works/SxC_2.jpeg" alt="SxCInterSummit" text="Competition page" />
      <WorkImage src="/images/works/SxC_3.jpeg" alt="SxCInterSummit" text="Main event page" />
    </Container>
  </Layout>
)

export default Work
