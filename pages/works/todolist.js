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
  <Layout title="TODO list">
    <Container>
      <Title type="Works">
        TODO list <Badge>2021</Badge>
      </Title>
      <P>
        One of the most important reasons you should use a to do list is that it will help you stay organised. When you write all your tasks in a list, they seem more manageable. When you’ve got a clear outline of the tasks you’ve got to do and those you’ve completed, it helps you stay focused. While freeing up space in your mind for other more creative tasks.
      </P>
      <P>
        When you complete a task, you can cross it off your list. This gives you a sense of progress and achievement, something you’ll lack if you’re always rushing from one task to the next. If you feel a sense of achievement, it spurs you on and motivates you to keep moving forward.
      </P>
      <P>
        With this tool, you can organize your tasks with the deadline date. It also has time remaining remainder with complete/resolve task button and also saved in your local storage.
      </P>

      <List ml={4} my={4}>
        <ListItem>
          <Meta>Website</Meta>
          <Link href="https://abdurahmanbasyah.github.io/TodoList/">
          https://abdurahmanbasyah.github.io/TodoList/ <ExternalLinkIcon mx="2px" />
          </Link>
        </ListItem>
        <ListItem>
          <Meta>Platform</Meta>
          <span>Windows/macOS/iOS/Android</span>
        </ListItem>
        <ListItem>
          <Meta>Stack</Meta>
          <span>ReactJS, Bootstrap</span>
        </ListItem>
      </List>

      <WorkImage src="/images/works/todo_1.png" alt="todolist" text="Desktop view" />
      <WorkImage src="/images/works/todo_3.png" alt="todolist" text="Mobile view" />
    </Container>
  </Layout>
)

export default Work
