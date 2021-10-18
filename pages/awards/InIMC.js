import { Container, Badge, Box, Flex, List, ListItem, Text, Heading, Link } from '@chakra-ui/react'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import { Title, WorkImage, Meta } from '../../components/pageItem'
import P from '../../components/paragraph'
import Layout from '../../components/layouts/article'

const Award = () => (
    <Layout title="InIMC">
        <Container>
            <Title type="Awards">
                India International Mathematics Competition <Badge>2017</Badge>
            </Title>
            <P>
                InIMC might be the most memorable competition I’ve ever had. Individual contest made of 15 questions with the composition of 12 short answer questions and 3 essays. Therefore, the maximum possible scores is 12 x 5 + 3 * 20 = 120. Luckily, I{`'ve`} got 85 that made me get the silver medal. I{`t's`} also a matter of pride that I managed to come up with a solution that is different from the official one.
            </P>
            <P>
                Team contest consists of 10 problems to discuss with our team. With the maximum possible scores of 400, we have got scores of 320 that made us a champion in our groups (Blue). On the other hand, Group contests are calculated by summing the highest three individual contests from four participants in a team (3 silvers) and competing with the others. Overall contest, also known as grand prize, means accumulative from all individual scores and team contest scores. Our team achieved 633 scores in total, while the champion, Singapore A team, achieved 687.
            </P>
            <P>
                Apart from the competition, IMC has always been fun to participate in. I{`'ve`} also participated in KIMC(Korea International Mathematics Competition) and TIMC(Thailand International Mathematics Competition). We{`'ve `}met many people across the country, exchanged souvenirs, and took photos. Especially for InIMC for making exploration games.
            </P>
            <List ml={4} my={4}>
                <ListItem>
                    <Flex>
                        <Meta>Prize</Meta>
                        <Box>
                            <Text>
                                Silver Medal-Key stage III individual contest
                            </Text>
                            <Text mt={2}>
                                Champion Team-Blue stage III team contest
                            </Text>
                            <Text mt={2}>
                                Second Runner Up-Key stage III overall contest
                            </Text>
                            <Text mt={2}>
                                Second Runner Up Team-Blue Key stage III group contest
                            </Text>
                        </Box>
                    </Flex>
                </ListItem>
                <ListItem>
                    <Meta>Category</Meta>
                    <span>Individual, Group, Team, Overall</span>
                </ListItem>
                <ListItem>
                    <Meta>Website</Meta>
                    <Link href="https://chiuchang.org/imc/en/history-en/inimc-2017-en/">
                        Official Website<ExternalLinkIcon mx="2px" />
                    </Link>
                </ListItem>
                <ListItem>
                    <Meta>Range</Meta>
                    <span>International</span>
                </ListItem>
                <ListItem>
                    <Meta>Field</Meta>
                    <span>Mathematics</span>
                </ListItem>
            </List>

            <Heading as="h3" variant="section-title">
                Captured Moments
            </Heading>
            <WorkImage src="/images/awards/InIMC_1.jpg" alt="InIMC" text="D-day competition" />
            <WorkImage src="/images/awards/InIMC_9.jpg" alt="InIMC" text="Another D-day competition" />
            <WorkImage src="/images/awards/InIMC_2.jpg" alt="InIMC" text="Interview at Soekarno-hatta International Airport" />
            <WorkImage src="/images/awards/InIMC_3.jpg" alt="InIMC" text="Photo session at CMS School" />
            <WorkImage src="/images/awards/InIMC_4.jpg" alt="InIMC" text="Posted by Indozone.id at Instagram" />
            <WorkImage src="/images/awards/InIMC_5.jpg" alt="InIMC" text="Studying at the airport" />
            <WorkImage src="/images/awards/InIMC_6.jpg" alt="InIMC" text="Awarding night" />
            <WorkImage src="/images/awards/InIMC_8.jpg" alt="InIMC" text="Exchange souvenir session" />
        </Container>
    </Layout>
)

export default Award
