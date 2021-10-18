import NextLink from 'next/link'
import {
  Link,
  Container,
  Heading,
  Box,
  Image,
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
import {
  IoLogoTwitter,
  IoLogoInstagram,
  IoLogoGithub,
  IoLogoLinkedin,
  IoMail
} from 'react-icons/io5'
import { useState } from 'react'

const Home = () => {
  const [numOfAwards, setNumOfAwards] = useState(5);
  const totalAwards = 25;

  const handleMoreAwards = () => {
    if (numOfAwards >= totalAwards) {
      setNumOfAwards(5);
    } else {
      setNumOfAwards(numOfAwards + 5);
    }
  }
  return (
    <Layout>
      <Container>
        <Box
          borderRadius="lg"
          mb={6}
          p={3}
          textAlign="center"
          bg={useColorModeValue('whiteAlpha.500', 'whiteAlpha.200')}
        >
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
            <Image
              borderColor="whiteAlpha.800"
              borderWidth={2}
              borderStyle="solid"
              maxWidth="100px"
              display="inline-block"
              borderRadius="full"
              src="/images/profile.jpg"
              alt="Profile image"
            />
          </Box>
        </Box>

        <Section delay={0.2}>
          <Heading as="h3" variant="section-title">
            Summary
          </Heading>
          <Paragraph>
            Abduh has an interest in
            business and technology, therefore, he took the opportunity
            to study at Information Systems, University of Indonesia. He loves coding, problem solving, and also music and food. In the future, he wants to be known as someone
            which is useful to many people so that he always takes
            opportunities so that he can continue to grow.
            {/* <NextLink href="/works/inkdrop">
            <Link>Inkdrop</Link>
          </NextLink> */}
          </Paragraph>
          <Box align="center" my={4}>
            <NextLink href="/works">
              <Button rightIcon={<ChevronRightIcon />} colorScheme="teal">
                My portfolio
              </Button>
            </NextLink>
          </Box>
        </Section>

        <Section delay={0.4}>
          <Heading as="h3" variant="section-title">
            Bio
          </Heading>
          <BioSection>
            <BioYear>2002</BioYear>
            Born in Kuala Lumpur, Malaysia
          </BioSection>
          <BioSection>
            <BioYear>2011</BioYear>
            Took part in an international mathematics competition for the very first time
          </BioSection>
          <BioSection>
            <BioYear>2018</BioYear>
            Last year to participate in international mathematics competition before becoming an undergraduate student
          </BioSection>
          <BioSection>
            <BioYear>2020</BioYear>
            Enrolled in the Department of Information Systems, Faculty of Computer Science, University of Indonesia
          </BioSection>
          <BioSection>
            <BioYear>2020</BioYear>
            Experienced first internship program at Akademis.id
          </BioSection>
          <BioSection>
            <BioYear>2021</BioYear>
            First time being a business plan competition champion
          </BioSection>
        </Section>

        <Section delay={0.6}>
          <Heading as="h3" variant="section-title">
            I ♥
          </Heading>
          <Paragraph>
            Music, Video Games, Rubik, Cards, Magic, Geometry, Coding, You
          </Paragraph>
        </Section>

        <Section delay={0.8}>
          <Heading as="h3" variant="section-title">
            Awards
          </Heading>
          <BioSection display={1 <= numOfAwards ? 'block' : 'none'}>
            <BioYear>2021</BioYear>
            3<sup>rd</sup> Place business plan at Business Plan Competition at USEEIC 2021
          </BioSection>
          <BioSection display={2 <= numOfAwards ? 'block' : 'none'}>
            <BioYear>2021</BioYear>
            1<sup>st</sup> Place business plan at Business Plan Competition at UNJASMARTEXPO 2021
          </BioSection>
          <BioSection display={3 <= numOfAwards ? 'block' : 'none'}>
            <BioYear>2021</BioYear>
            Top 15 business plan at Business Plan Competition at IDEAS, FEB UGM
          </BioSection>
          <BioSection display={4 <= numOfAwards ? 'block' : 'none'}>
            <BioYear>2021</BioYear>
            4<sup>th</sup> Place business plan at Business Plan Competition at JAKARTA, STUDENTS, INNOVATION
          </BioSection>
          <BioSection display={5 <= numOfAwards ? 'block' : 'none'}>
            <BioYear>2020</BioYear>
            Gold Award and First Place, 12th grade, at Kompetisi Matematika Nalaria Realistik 2020
          </BioSection>
          <BioSection display={6 <= numOfAwards ? 'block' : 'none'}>
            <BioYear>2020</BioYear>
            2<sup>nd</sup> Place mathematics competition at Olimpiade Update Science, Social, and Language Competition
          </BioSection>
          <BioSection display={7 <= numOfAwards ? 'block' : 'none'}>
            <BioYear>2019</BioYear>
            2<sup>nd</sup> Place mathematics competition at PARSIAL UIN Syarif Hidayatullah Jakarta
          </BioSection>
          <BioSection display={8 <= numOfAwards ? 'block' : 'none'}>
            <BioYear>2019</BioYear>
            3<sup>rd</sup> Place mathematics competition at OSN SMA Tingkat Kota Depok
          </BioSection>
          <BioSection display={9 <= numOfAwards ? 'block' : 'none'}>
            <BioYear>2019</BioYear>
            2<sup>nd</sup> Place Mathematics Team Competition LOGIKA UI
          </BioSection>
          <BioSection display={10 <= numOfAwards ? 'block' : 'none'}>
            <BioYear>2018</BioYear>
            The Third Prize at 15th Chinese Southeast Mathematical Olympiad
          </BioSection>
          <BioSection display={11 <= numOfAwards ? 'block' : 'none'}>
            <BioYear>2018</BioYear>
            Bronze Medal and First Prize Team Trophy at 15th Hanoi Open Mathematics Competition
          </BioSection>
          <BioSection display={12 <= numOfAwards ? 'block' : 'none'}>
            <BioYear>2018</BioYear>
            Gold Award at Thailand International Mathematical Olympiad Final Round
          </BioSection>
          <BioSection display={13 <= numOfAwards ? 'block' : 'none'}>
            <BioYear>2018</BioYear>
            1<sup>st</sup> Place mathematics competition at OSN SMA Tingkat Kota Depok
          </BioSection>
          <BioSection display={14 <= numOfAwards ? 'block' : 'none'}>
            <BioYear>2018</BioYear>
            2<sup>nd</sup>Place Competition Of Mathematics And Science, SMAN 2 Depok
          </BioSection>
          <BioSection display={15 <= numOfAwards ? 'block' : 'none'}>
            <BioYear>2018</BioYear>
            3<sup>rd</sup> Place mathematics competition at Pelangi Matematika XXV Universitas Negeri Jakarta
          </BioSection>
          <BioSection display={16 <= numOfAwards ? 'block' : 'none'}>
            <BioYear>2017</BioYear>
            Gold Award at Thailand International Mathematical Olympiad Heat Round
          </BioSection>
          <BioSection display={17 <= numOfAwards ? 'block' : 'none'}>
            <BioYear>2017</BioYear>
            Certificate Of Distinction in the Euclid Contest
          </BioSection>
          <BioSection display={18 <= numOfAwards ? 'block' : 'none'}>
            <BioYear>2017</BioYear>
            Certificate Of Distinction on the American Mathematics Contest
          </BioSection>
          <BioSection display={19 <= numOfAwards ? 'block' : 'none'}>
            <BioYear>2017</BioYear>
            2<sup>nd</sup> Team-Blue Key stage III India International Mathematics Competition
          </BioSection>
          <BioSection display={20 <= numOfAwards ? 'block' : 'none'}>
            <BioYear>2017</BioYear>
            2<sup>nd</sup> Up-Key stage III group contest India International Mathematics Competition
          </BioSection>
          <BioSection display={21 <= numOfAwards ? 'block' : 'none'}>
            <BioYear>2017</BioYear>
            Champion Team-Key stage III team contest India International Mathematics Competition
          </BioSection>
          <BioSection display={22 <= numOfAwards ? 'block' : 'none'}>
            <BioYear>2017</BioYear>
            Silver Medal-Key stage III individual contest India International Mathematics Competitio
          </BioSection>
          <BioSection display={23 <= numOfAwards ? 'block' : 'none'}>
            <BioYear>2017</BioYear>
            3<sup>rd</sup> Place Mathematics Team Competition LOGIKA UI
          </BioSection>
          <BioSection display={24 <= numOfAwards ? 'block' : 'none'}>
            <BioYear>2017</BioYear>
            2<sup>nd</sup> Place mathematics competition at Olimpiade Matematika Vektor Nasional Universitas Negeri Malang
          </BioSection>
          <BioSection display={25 <= numOfAwards ? 'block' : 'none'}>
            <BioYear>2017</BioYear>
            1<sup>st</sup> Place mathematics competition at Matematika Ria Pesta Sains Nasional
          </BioSection>
          <Box my={4}>
            <Button colorScheme="teal" variant="ghost" onClick={() => handleMoreAwards()}>
              {numOfAwards < totalAwards ? "Load more" : "Load less"}
            </Button>
          </Box>

          <Box align="center" my={4}>
            <NextLink href="/awards">
              <Button rightIcon={<ChevronRightIcon />} colorScheme="teal">
                My Achievements
              </Button>
            </NextLink>
          </Box>
        </Section>

        <Section delay={1.0}>
          <Heading as="h3" variant="section-title">
            Experiences
          </Heading>
          <BioSection>
            <BioYear>2021</BioYear>
            Teaching Assistant of Discrete Mathematics
          </BioSection>
          <BioSection>
            <BioYear>2021</BioYear>
            Project Development at BEM Fasilkom UI
          </BioSection>
          <BioSection>
            <BioYear>2021</BioYear>
            Business Intelligence Special Interest Group at SISTEM Fasilkom UI
          </BioSection>
          <BioSection>
            <BioYear>2021</BioYear>
            Programming Foundation Mentor at Fasilkom UI
          </BioSection>
          <BioSection>
            <BioYear>2021</BioYear>
            Vice Project Officer at Wisuda Virtual Fasilkom UI
          </BioSection>
          <BioSection>
            <BioYear>2020</BioYear>
            Developer Student Club Universitas Indonesia
          </BioSection>
          <BioSection>
            <BioYear>2020</BioYear>
            Selected as a product division intern at Akademis.id
          </BioSection>
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
                  leftIcon={<Icon as={IoLogoLinkedin} />}
                >
                  abduh962
                </Button>
              </Link>
            </ListItem>
            <ListItem>
              <Link href="https://twitter.com/yahhElahh" target="_blank">
                <Button
                  variant="ghost"
                  colorScheme="teal"
                  leftIcon={<Icon as={IoLogoTwitter} />}
                >
                  @yahhElahh
                </Button>
              </Link>
            </ListItem>
            <ListItem>
              <Link href="https://instagram.com/mabasyah" target="_blank">
                <Button
                  variant="ghost"
                  colorScheme="teal"
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
            My YouTube channel
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
