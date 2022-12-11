import NextLink from 'next/link'
import { Heading, Box, Image, Link, Badge, Text } from '@chakra-ui/react'
import { ChevronRightIcon } from '@chakra-ui/icons'

export const Title = ({ children, type }) => (
  <Box>
    <Link href={`/${type.toLowerCase()}`} as={NextLink}>
      {type}
    </Link>
    <span>
      {' '}
      <ChevronRightIcon />{' '}
    </span>
    <Heading display="inline-block" as="h3" fontSize={20} mb={4}>
      {children}
    </Heading>
  </Box>
)

export const WorkImage = ({ src, alt, text }) => (
  <>
    <Image borderRadius="lg" w="full" src={src} alt={alt} />
    <Text textAlign="center" color="gray.500" mb={4}>
      {text}
    </Text>
  </>
)

export const Meta = ({ children }) => (
  <Badge colorScheme="green" mr={2} h="fit-content">
    {children}
  </Badge>
)
