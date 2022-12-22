import Layout from '../components/layouts/article'
import Section from '../components/section'
import {
  Container,
  Heading,
  Button,
  Text,
  Flex,
  Box,
  Image,
  Divider
} from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { ChevronRightIcon } from '@chakra-ui/icons'
import NextLink from 'next/link'
import axios from 'axios'
import { isSuccess } from '../functions/api'
const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState()

  useEffect(() => {
    console.log(leaderboardData)
    console.log(typeof leaderboardData)
  }, [leaderboardData])

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/scores`).then(res => {
      if (isSuccess(res)) {
        setLeaderboardData(res?.data?.data)
      }
    })
  }, [])

  const sortLeaderboard = leaderboardData => {
    const sortedLeaderboard = leaderboardData?.sort((a, b) => b.score - a.score)
    return sortedLeaderboard
  }

  return (
    <Layout>
      <Container>
        <Heading as="h1" size="3xl" mb={4} textAlign="center" color={'teal'}>
          Leaderboard
        </Heading>
        <Text mb={4} textAlign="center">
          Welcome to the leaderboard. The leaderboard will show the highest
          score for each game. Do you think you can beat the leaderboard? Try it
          out
        </Text>

        <Box align="center" my={4}>
          <NextLink href="/posts">
            <Button
              rightIcon={<ChevronRightIcon />}
              cursor={'none'}
              colorScheme="teal"
            >
              Play Now
            </Button>
          </NextLink>
        </Box>
        {leaderboardData &&
          Object.keys(leaderboardData).map((key, index) => {
            return (
              <>
                <Divider my={6} />
                <Section key={index} delay={index * 0.3}>
                  <Heading
                    as="h1"
                    size={{base:"2xl", md:"3xl"}}
                    mb={4}
                    textAlign="center"
                    color={'teal'}
                  >
                    {key.toUpperCase()}
                  </Heading>
                  <Flex justifyContent="center">
                    <Box
                      key={index}
                      mb={4}
                      position="relative"
                      w="225px"
                      h="300px"
                    >
                      <Image src="/images/gold.png" alt="gold" w={'100%'} />
                      <Text
                        position={'absolute'}
                        left="50%"
                        transform={'translateX(-50%)'}
                        bottom="-12px"
                        fontSize={'2xl'}
                        color={'#FFD700'}
                        filter={'drop-shadow(0 0 0.75rem #FFD700)'}
                        fontWeight={'bold'}
                        fontFamily={'heading'}
                        textTransform={'uppercase'}
                      >
                        {sortLeaderboard(leaderboardData[key])[0]?.username}
                      </Text>
                      <Text
                        position={'absolute'}
                        left="50%"
                        transform={'translateX(-50%)'}
                        top="40%"
                        fontSize={'4xl'}
                        color={'white'}
                        fontWeight={'bold'}
                        fontFamily={'heading'}
                      >
                        {sortLeaderboard(leaderboardData[key])[0]?.score}
                      </Text>
                    </Box>
                  </Flex>
                  <Flex justifyContent="center" gap="4">
                    {sortLeaderboard(leaderboardData[key]).map(
                      (item, index) => {
                        if (index !== 0) {
                          return (
                            <Box
                              key={index}
                              mb={4}
                              position="relative"
                              w="150px"
                              h="200px"
                            >
                              <Image
                                src={
                                  index === 1
                                    ? '/images/silver.png'
                                    : '/images/bronze.png'
                                }
                                alt={index === 1 ? 'silver' : 'bronze'}
                                w={'100%'}
                              />
                              <Text
                                position={'absolute'}
                                left="50%"
                                transform={'translateX(-50%)'}
                                bottom="-20px"
                                fontSize={'xl'}
                                color={'#FFD700'}
                                filter={'drop-shadow(0 0 0.75rem #FFD700)'}
                                fontWeight={'bold'}
                                fontFamily={'heading'}
                                textTransform={'uppercase'}
                              >
                                {item?.username}
                              </Text>
                              <Text
                                position={'absolute'}
                                left="50%"
                                transform={'translateX(-50%)'}
                                top="38%"
                                fontSize={'2xl'}
                                color={'white'}
                                fontWeight={'bold'}
                                fontFamily={'heading'}
                              >
                                {item?.score}
                              </Text>
                            </Box>
                          )
                        }
                      }
                    )}
                  </Flex>
                </Section>
              </>
            )
          })}
      </Container>
    </Layout>
  )
}
export default Leaderboard
