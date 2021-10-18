import { Container, Badge, Link, List, ListItem, UnorderedList, Center, Heading } from '@chakra-ui/react'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import { Title, WorkImage, Meta } from '../../components/pageItem'
import P from '../../components/paragraph'
import Layout from '../../components/layouts/article'

const Work = () => (
  <Layout title="Sabila Mall">
    <Container>
      <Title type="Works">
        Sabila Mall <Badge>2021</Badge>
      </Title>
      <P>
      Reseller and dropshipper platform, the most complete Reselling (Selling Together) Application, owned by State Children in Indonesia!
      </P>
      <List ml={4} my={4}>
        <ListItem>
          <Meta>Website</Meta>
          <Link href="https://www.sabilamall.co.id/">
            https://www.sabilamall.co.id/ <ExternalLinkIcon mx="2px" />
          </Link>
        </ListItem>
        <ListItem>
          <Meta>Platform</Meta>
          <span>Windows/macOS/iOS/Android</span>
        </ListItem>
        <ListItem>
          <Meta>Stack</Meta>
          <span>NextJS, ChakraUI, Axios</span>
        </ListItem>
        <ListItem>
          <Meta>Made For</Meta>
          <Link href="https://www.instagram.com/sabilamall/">
            Sabila Mall<ExternalLinkIcon mx="2px" />
          </Link>
        </ListItem>
      </List>

      <Heading as="h4" fontSize={16} my={6}>
        <Center>{`Feature that I've been working on`}</Center>
      </Heading>

      <UnorderedList my={4}>
        <ListItem>
          Login and reset password page
        </ListItem>
        <ListItem>
          Product details, product information, and related products component
        </ListItem>
        <ListItem>
          Address and upgrade account component along with the data from API
        </ListItem>
        <ListItem>
          Address and upgrade account component along with the data from API
        </ListItem>
        <ListItem>
          Resi tracker page
        </ListItem>
        <ListItem>
          Cart functionality, such as add to cart from products, add product quantity, add cart notes, and add to checkout
        </ListItem>
        <ListItem>
          Checkout Functionality, such as routing to select address and total price
        </ListItem>
        <ListItem>
          Point rewards page along with the data from API
        </ListItem>
      </UnorderedList>

      <WorkImage src="/images/works/sabilamall_1.png" alt="sabilamall" text="landing page" />
      <WorkImage src="/images/works/sabilamall_2.png" alt="sabilamall" text="login page" />
      <WorkImage src="/images/works/sabilamall_3.jpeg" alt="sabilamall" text="sample product details" />
      <WorkImage src="/images/works/sabilamall_4.png" alt="sabilamall" text="cart details page" />
      <WorkImage src="/images/works/sabilamall_5.png" alt="sabilamall" text="address details component" />
    </Container>
  </Layout>
)

export default Work
