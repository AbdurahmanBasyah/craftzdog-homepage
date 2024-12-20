import NextLink from 'next/link'
import {
  Link,
  Container,
  Heading,
  Box,
  Button,
  List,
  ListItem,
  Icon,
  useColorModeValue
} from '@chakra-ui/react'
import { ChevronRightIcon } from '@chakra-ui/icons'
import Paragraph from '../components/paragraph'
import { BioSection, BioYear } from '../components/bio'
import Layout from '../components/layouts/article'
import Section from '../components/section'
import Image from 'next/image'
import {
  IoLogoInstagram,
  IoLogoGithub,
  IoLogoLinkedin,
  IoMail
} from 'react-icons/io5'
import { useState } from 'react'
import { useEffect } from 'react'
import axios from 'axios'
import { isSuccess } from '../functions/api'
import profile from '../public/images/profile.jpg'
const Home = () => {
  const [numOfAwards, setNumOfAwards] = useState(5)
  const [bios, setBios] = useState([])
  const [awards, setAwards] = useState([])
  const [experiences, setExperiences] = useState([])
  const totalAwards = awards.length

  const handleMoreAwards = () => {
    if (numOfAwards >= totalAwards) {
      setNumOfAwards(5)
    } else {
      setNumOfAwards(numOfAwards + 5)
    }
  }
  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/api/bios`, {})
      .then(res => {
        if (isSuccess(res)) {
          setBios(res?.data?.data)
        }
      })
      .catch(err => {
        console.error(err)
      })
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/api/awards`, {})
      .then(res => {
        if (isSuccess(res)) {
          setAwards((res?.data?.data).reverse())
        }
      })
      .catch(err => {
        console.error(err)
      })
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/api/experiences`, {})
      .then(res => {
        if (isSuccess(res)) {
          setExperiences((res?.data?.data).reverse())
        }
      })
      .catch(err => {
        console.error(err)
      })
  }, [])

  const color = useColorModeValue('whiteAlpha.500', 'whiteAlpha.200')

  return (
    <Layout>
      <Container>
        <Box borderRadius="lg" mb={6} p={3} textAlign="center" bg={color}>
          Hello, Welcome to my personal web site
        </Box>

        <Box display={{ md: 'flex' }}>
          <Box flexGrow={1}>
            <Heading as="h2" variant="page-title">
              M Abdurahman Basyah
            </Heading>
            <p>Developer / Learner / High Achiever</p>
          </Box>
          <Box
            flexShrink={0}
            mt={{ base: 4, md: 0 }}
            ml={{ md: 6 }}
            textAlign="center"
          >
            <Box
              borderColor="whiteAlpha.800"
              borderWidth={2}
              borderStyle="solid"
              maxWidth="100px"
              display="inline-block"
              overflow={'hidden'}
              borderRadius="full"
            >
              <Image
                src={profile}
                width={100}
                height={100}
                alt="Profile image"
              />
            </Box>
          </Box>
        </Box>
        <Section delay={0.2}>
          <Heading as="h3" variant="section-title">
            Summary
          </Heading>
          <Paragraph>
            Abduh has an interest in business and technology, therefore, he took
            the opportunity to study at Information Systems, University of
            Indonesia. He loves coding, problem solving, and also music and
            food. In the future, he wants to be known as someone which is useful
            to many people so that he always takes opportunities so that he can
            continue to grow.
            {/* <NextLink href="/works/inkdrop">
            <Link>Inkdrop</Link>
          </NextLink> */}
          </Paragraph>
          <Box align="center" my={4}>
            <NextLink href="/works">
              <Button
                rightIcon={<ChevronRightIcon />}
                cursor={'none'}
                colorScheme="teal"
              >
                My portfolio
              </Button>
            </NextLink>
          </Box>
        </Section>

        <Section delay={0.4}>
          <Heading as="h3" variant="section-title">
            Bio
          </Heading>
          {bios.map((bio, index) => {
            return (
              <BioSection key={index}>
                <BioYear>{bio.year}</BioYear>
                {bio.description}
              </BioSection>
            )
          })}
        </Section>

        <Section delay={0.6}>
          <Heading as="h3" variant="section-title">
            I ♥
          </Heading>
          <Paragraph>
            Music, Video Games, Rubik, Cards, Magic, Geometry, Coding, You
          </Paragraph>
          <Box align="center" my={4}>
            <NextLink href="/posts">
              <Button
                rightIcon={<ChevronRightIcon />}
                cursor={'none'}
                colorScheme="teal"
              >
                Check out my posts
              </Button>
            </NextLink>
          </Box>
        </Section>

        <Section delay={0.8}>
          <Heading as="h3" variant="section-title">
            Awards
          </Heading>
          {awards.map((el, idx) => {
            if (idx < numOfAwards) {
              return (
                <BioSection key={idx}>
                  <BioYear>{el.year}</BioYear>
                  {el.description}
                </BioSection>
              )
            }
          })}
          <Box my={4}>
            <Button
              colorScheme="teal"
              variant="ghost"
              onClick={() => handleMoreAwards()}
            >
              {numOfAwards < totalAwards ? 'Load more' : 'Load less'}
            </Button>
          </Box>

          <Box align="center" my={4}>
            <NextLink href="/awards">
              <Button
                rightIcon={<ChevronRightIcon />}
                cursor="none"
                colorScheme="teal"
              >
                My Achievements
              </Button>
            </NextLink>
          </Box>
        </Section>

        <Section delay={1.0}>
          <Heading as="h3" variant="section-title">
            Experiences
          </Heading>
          {experiences.map((experience, index) => {
            return (
              <BioSection key={index}>
                <BioYear>{experience.year}</BioYear>
                {experience.description}
              </BioSection>
            )
          })}
        </Section>

        <Section delay={1.2}>
          <Heading as="h3" variant="section-title">
            Find me on the Internet
          </Heading>
          <List>
            <ListItem>
              <Link href="https://github.com/AbdurahmanBasyah" target="_blank">
                <Button
                  variant="ghost"
                  colorScheme="teal"
                  leftIcon={<Icon as={IoLogoGithub} />}
                  cursor="none"
                >
                  AbdurahmanBasyah
                </Button>
              </Link>
            </ListItem>
            <ListItem>
              <Link href="mailto:abdurrahmanbasyah@gmail.com" target="_blank">
                <Button
                  variant="ghost"
                  colorScheme="teal"
                  cursor="none"
                  leftIcon={<Icon as={IoMail} />}
                >
                  abdurrahmanbasyah@gmail.com
                </Button>
              </Link>
            </ListItem>
            <ListItem>
              <Link href="https://linkedin.com/in/abduh962" target="_blank">
                <Button
                  variant="ghost"
                  colorScheme="teal"
                  cursor="none"
                  leftIcon={<Icon as={IoLogoLinkedin} />}
                >
                  abduh962
                </Button>
              </Link>
            </ListItem>
            {/* <ListItem>
              <Link href="https://twitter.com/yahhElahh" target="_blank">
                <Button
                  variant="ghost"
                  colorScheme="teal"
                  leftIcon={<Icon as={IoLogoTwitter} />}
                >
                  @yahhElahh
                </Button>
              </Link>
            </ListItem> */}
            <ListItem>
              <Link href="https://instagram.com/mabasyah" target="_blank">
                <Button
                  variant="ghost"
                  colorScheme="teal"
                  cursor="none"
                  leftIcon={<Icon as={IoLogoInstagram} />}
                >
                  @mabasyah
                </Button>
              </Link>
            </ListItem>
            {/* <ListItem>
            <Link href="https://discord.gg/QfsG5Kj" target="_blank">
              <Button
                variant="ghost"
                colorScheme="teal"
                leftIcon={<Icon as={IoLogoDiscord} />}
              >
                Discord
              </Button>
            </Link>
          </ListItem> */}
          </List>

          {/* <SimpleGrid columns={[1, 2, 2]} gap={6}>
          <GridItem
            href="https://www.youtube.com/devaslife"
            title="Dev as Life"
            thumbnail={thumbYouTube}
          >
            My YouTube channel (&gt;100k subs)
          </GridItem>
          <GridItem
            href="https://www.inkdrop.app/"
            title="Inkdrop"
            thumbnail={thumbInkdrop}
          >
            A Markdown note-taking app
          </GridItem>
        </SimpleGrid> */}
        </Section>
      </Container>
    </Layout>
  )
}

export default Home
export { getServerSideProps } from '../components/chakra'
