import Image from 'next/image'
import { Box, Text, LinkBox } from '@chakra-ui/react'
import { Global } from '@emotion/react'
import NextLink from 'next/link'

export const AwardGridItem = ({ text, id, title, thumbnail }) => {
  return (
    <Box w="100%" textAlign="center">
      <LinkBox
        as={NextLink}
        href={`/awards/${id}`}
        cursor={'none'}
        _hover={{
          textDecoration: 'none'
        }}
        color="white"
      >
        <>
          <Image
            src={thumbnail}
            alt={title}
            className="grid-item-thumbnail"
            placeholder="blur"
          />
          <Text mt={2} fontSize={20}>
            {title}
          </Text>
          <Text fontSize={14}>{text}</Text>
        </>
      </LinkBox>
    </Box>
  )
}

export const WorkGridItem = ({ children, id, title, thumbnail }) => (
  <Box w="100%" textAlign="center">
    <LinkBox
      as={NextLink}
      href={`/works/${id}`}
      cursor={'none'}
      _hover={{
        textDecoration: 'none'
      }}
      color="white"
    >
      <>
        <Image
          src={thumbnail}
          alt={title}
          className="grid-item-thumbnail"
          placeholder="blur"
        />
        <Text mt={2} fontSize={20}>
          {title}
        </Text>
        <Text fontSize={14}>{children}</Text>
      </>
    </LinkBox>
  </Box>
)

export const PostGridItem = ({ children, id, title, thumbnail }) => (
  <Box w="100%" textAlign="center">
    <LinkBox
      as={NextLink}
      href={`/posts/${id}`}
      cursor={'none'}
      _hover={{
        textDecoration: 'none'
      }}
      color="white"
    >
      <>
        <Image
          src={thumbnail}
          alt={title}
          className="grid-item-thumbnail"
          placeholder="blur"
        />
        <Text mt={2} fontSize={20}>
          {title}
        </Text>
        <Text fontSize={14}>{children}</Text>
      </>
    </LinkBox>
  </Box>
)

export const GridItemStyle = () => (
  <Global
    styles={`
      .grid-item-thumbnail {
        border-radius: 12px;
      }
    `}
  />
)
