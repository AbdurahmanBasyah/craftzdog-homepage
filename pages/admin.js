import Layout from '../components/layouts/article'
import Section from '../components/section'
import {
    Container,
    Heading,
    FormControl,
    FormLabel,
    Input,
    Button,
    Text,
    Flex,
    Box,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Alert,
    AlertIcon
} from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { isSuccess } from '../functions/api'
import { BioSection, BioYear } from '../components/bio'
const AdminPage = () => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isError, setisError] = useState(false)
    const [isLoggedIn, setisLoggedIn] = useState(false)
    const [newData, setNewData] = useState(null)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [currentType, setCurrentType] = useState("")
    const [role, setRole] = useState("")

    useEffect(() => {
        if (isSubmitted) {
            setTimeout(() => {
                setIsSubmitted(false)
            }, 3000)
        }
    }, [isSubmitted])


    const loginHandler = () => {
        setIsSubmitting(true)
        axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/login`, {
            "username": username,
            "password": password
        }).then((res) => {
            if (isSuccess(res)) {
                if (res?.data?.success) {
                    setisError(false)
                    setisLoggedIn(true)
                    setRole(res?.data?.role)
                } else {
                    setisError(true)
                }
            }
        }).then(() => {
            setIsSubmitting(false)
        }).catch((err) => {
            console.error(err)
        })
    }

    const postHandler = () => {
        setIsSubmitting(true)
        if (currentType === "award" && role === "admin") {
            axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/awards`, {
                "year": newData.year,
                "description": newData.description
            }).then((res) => {
                if (isSuccess(res)) {
                    setIsSubmitted(true)
                }
            }).then(() => {
                setIsSubmitting(false)
            }).catch((err) => {
                console.error(err)
            }).finally(() => {
                setNewData(null)
                onClose()
            })
        } else if (currentType === "experience" && role === "admin") {
            axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/experiences`, {
                "year": newData.year,
                "description": newData.description
            }).then((res) => {
                if (isSuccess(res)) {
                    setIsSubmitted(true)
                }
            }).then(() => {
                setIsSubmitting(false)
            }).catch((err) => {
                console.error(err)
            }).finally(() => {
                setNewData(null)
                onClose()
            })
        } else if (currentType === "bio" && role === "admin") {
            axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/bios`, {
                "year": newData.year,
                "description": newData.description
            }).then((res) => {
                if (isSuccess(res)) {
                    setIsSubmitted(true)
                }
            }).then(() => {
                setIsSubmitting(false)
            }).catch((err) => {
                console.error(err)
            }).finally(() => {
                setNewData(null)
                onClose()
            })
        } else {
            onClose()
            setIsSubmitting(false)
            setNewData(null)
        }

    }

    return (
        <Layout>
            {isSubmitted && <Alert status='success' variant='solid'>
                <AlertIcon />
                Data uploaded to the server
            </Alert>}
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent p="20px">
                    <ModalCloseButton />
                    <FormControl>
                        <ModalHeader fontSize={"24px"} textTransform="capitalize">New {currentType}</ModalHeader>
                        <ModalBody>
                            <FormLabel mt="32px" id='year'>Year</FormLabel>
                            <Input autoComplete={false} onChange={(e) => setNewData({ ...newData, year: e.target.value })} value={newData?.year} focusBorderColor="gray.500" colorScheme="gray" name="year" type='number' />
                            <FormLabel mt="16px" htmlFor='description'>Description</FormLabel>
                            <Input autoComplete={false} onChange={(e) => setNewData({ ...newData, description: e.target.value })} value={newData?.description} focusBorderColor="gray.500" colorScheme="gray" id='description' type='text' />
                        </ModalBody>

                        <ModalFooter mt="16px">
                            <Button colorScheme='blue' mr={3} onClick={onClose}>
                                Close
                            </Button>
                            <Button variant='ghost'
                                colorScheme="teal"
                                type='submit'
                                isLoading={isSubmitting}
                                onClick={() => {
                                    postHandler()
                                }}>Submit</Button>
                        </ModalFooter>
                    </FormControl>
                </ModalContent>
            </Modal>
            <Container>
                <Section delay={0.2}>
                    <Heading as="h3" variant="section-title">
                        {isLoggedIn ? "Admin Page" : "Private Login"}
                    </Heading>
                    {isLoggedIn ?
                        <Box mt="16px">
                            <BioSection mt="16px">
                                <Flex justify="space-between">
                                    <BioYear>Bios</BioYear>
                                    <Box>
                                        <Button mr="8px" onClick={() => {
                                            setCurrentType("bio");
                                            onOpen()
                                        }}>Add</Button>
                                        <Button>Edit</Button>
                                    </Box>
                                </Flex>
                            </BioSection>
                            <BioSection mt="16px">
                                <Flex justify="space-between">
                                    <BioYear>Awards</BioYear>
                                    <Box>
                                        <Button mr="8px" onClick={() => {
                                            setCurrentType("award");
                                            onOpen()
                                        }}>Add</Button>
                                        <Button>Edit</Button>
                                    </Box>
                                </Flex>
                            </BioSection>
                            <BioSection mt="16px">
                                <Flex justify="space-between">
                                    <BioYear>Experiences</BioYear>
                                    <Box>
                                        <Button mr="8px" onClick={() => {
                                            setCurrentType("experience");
                                            onOpen()
                                        }}>Add</Button>
                                        <Button>Edit</Button>
                                    </Box>
                                </Flex>
                            </BioSection>
                        </Box> :
                        <FormControl w="80%" mx="auto">
                            <FormLabel mt="32px" htmlFor='username'>Username</FormLabel>
                            <Input autoComplete={false} onChange={(e) => setUsername(e.target.value)} focusBorderColor="gray.500" colorScheme="gray" id='username' type='text' />
                            <FormLabel mt="16px" htmlFor='username'>Password</FormLabel>
                            <Input autoComplete={false} onChange={(e) => setPassword(e.target.value)} focusBorderColor="gray.500" colorScheme="gray" id='password' type='password' />
                            {isError && <Text mt="12px" align="center" opacity={0.4} fontSize="sm">
                                Login failed. Please check your username and password.
                            </Text>}
                            <Button
                                mt={4}
                                colorScheme="teal"
                                isLoading={isSubmitting}
                                type='submit'
                                onClick={(e) => { loginHandler(e) }}
                            >
                                Submit
                            </Button>
                        </FormControl>}
                </Section>
            </Container>
        </Layout>
    );
}
export default AdminPage