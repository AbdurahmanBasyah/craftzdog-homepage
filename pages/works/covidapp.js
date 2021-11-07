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
    <Layout title="Covid App">
      <Container>
        <Title type="Works">
          Covid App <Badge>2021</Badge>
        </Title>
        <P>
          A covid app consists of related informations, such as hospitals, cases data, covid distribution map, and vaccination. It{`'s`} also featured by authentication and authorization so that the authenticated user can add discussion forums topic. 
        </P>
  
        <List ml={4} my={4}>
          <ListItem>
            <Meta>Website</Meta>
            <Link href="https://covid-information-app.herokuapp.com/">
            https://covid-information-app.herokuapp.com/ <ExternalLinkIcon mx="2px" />
            </Link>
          </ListItem>
          <ListItem>
            <Meta>Platform</Meta>
            <span>Windows/macOS/iOS/Android</span>
          </ListItem>
          <ListItem>
            <Meta>Stack</Meta>
            <span>Django, Bootstrap 5, Ajax</span>
          </ListItem>
          <ListItem>
            <Meta>Source code</Meta>
            <Link href="https://gitlab.com/muhammad.abdurahman/pbp-tk">
              Github Repositories<ExternalLinkIcon mx="2px" />
            </Link>
          </ListItem>
          <ListItem>
          <Meta>Made For</Meta>
          <span>Mid term examination</span>
        </ListItem>
        </List>
  
        <WorkImage src="/images/works/covid_1.jpeg" alt="covid" text="Homepage desktop view" />
        <WorkImage src="/images/works/covid_3.jpeg" alt="covid" text="Discussion forums" />
        <WorkImage src="/images/works/covid_4.jpeg" alt="covid" text="Discussion forum forms" />
      </Container>
    </Layout>
  )
  
  export default Work
  