import NextLink from 'next/link'
import {
  Box,
  Heading,
  Text,
  Container,
  Divider,
  Button
} from '@chakra-ui/react'

const Posts = () => {
  return (
    <Container>
      <Heading as="h1">Be back soon</Heading>
      <Text>There will be more posts for you in this page.</Text>
      <Divider my={6} />

      <Box my={6} align="center">
        <NextLink href="/">
          <Button colorScheme="teal">Return to home</Button>
        </NextLink>
      </Box>
    </Container>
  )
}

export default Posts
export { getServerSideProps } from '../components/chakra'
