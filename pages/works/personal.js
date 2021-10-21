import {
    Container,
    Badge,
    Link,
    List,
    ListItem,
} from '@chakra-ui/react'
import Layout from '../../components/layouts/article'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import { Title, WorkImage, Meta } from '../../components/pageItem'
import P from '../../components/paragraph'

const Work = () => (
    <Layout title="First Website">
        <Container>
            <Title type="Works">
                First Personal Website <Badge>2021</Badge>
            </Title>
            <P>
                Not only this is my first personal website, it{`'s`} also my first experience using bootstrap and jQuery after learning the basics of HTML, CSS, and JavaScript.
            </P>

            <List ml={4} my={4}>
                <ListItem>
                    <Meta>Website</Meta>
                    <Link href="https://abduh-personal-web.herokuapp.com/">
                        https://abduh-personal-web.herokuapp.com/ <ExternalLinkIcon mx="2px" />
                    </Link>
                </ListItem>
                <ListItem>
                    <Meta>Platform</Meta>
                    <span>Windows/macOS/iOS/Android</span>
                </ListItem>
                <ListItem>
                    <Meta>Stack</Meta>
                    <span>HTML, CSS, Bootstrap, PHP</span>
                </ListItem>
            </List>

            <WorkImage src="/images/works/personal_2.jpeg" alt="personal" text="Desktop view" />
            <WorkImage src="/images/works/personal_3.jpeg" alt="personal" text="Mobile view" />
        </Container>
    </Layout>
)

export default Work
