import { Container, Badge, Box, Flex, List, ListItem, Text, Heading } from '@chakra-ui/react'
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
                InIMC might be the most
                memorable competition I’ve
                ever had. Team contest consists
                10 problems to discuss with our
                team. On the other hand, Team contest calculated by
                summing of the highest three
                individual contest from four
                participant in a team (3 silvers)
                and compete with 6 other
                teams. Group contest, also
                known as grand prize, means
                accumulative from all
                individual scores and team
                contest scores. Our team
                achieve 633 scores in total,
                while the champion, Singapore
                A team, achieved 687.
            </P>
            <List ml={4} my={4}>
                <ListItem>
                    <Flex>
                        <Meta>Prize</Meta>
                        <Box>
                            <Text>
                                Silver Medal-Key stage III individual contest India International Mathematics Competition 2017
                            </Text>
                            <Text mt={2}>
                                Champion Team-Key stage III team contest India International Mathematics Competition 2017
                            </Text>
                            <Text mt={2}>
                                Second Runner Up-Key stage III group contest India International Mathematics Competition 2017
                            </Text>
                            <Text mt={2}>
                                Second Runner Up Team-Blue Key stage III India International Mathematics Competition 2017
                            </Text>
                        </Box>

                    </Flex>

                </ListItem>
                <ListItem>
                    <Meta>Category</Meta>
                    <span>Individual, Group, Team</span>
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
            <WorkImage src="/images/awards/InIMC_2.jpg" alt="InIMC" text="Interview at Soekarno-hatta International Airport" />
            <WorkImage src="/images/awards/InIMC_3.jpg" alt="InIMC" text="Photo session at CMS School" />
            <WorkImage src="/images/awards/InIMC_4.jpg" alt="InIMC" text="Posted by indozone.id at Instagram" />
            <WorkImage src="/images/awards/InIMC_5.jpg" alt="InIMC" text="Learning at the airport" />
            <WorkImage src="/images/awards/InIMC_6.jpg" alt="InIMC" text="Individual contest awards" />
        </Container>
    </Layout>
)

export default Award
