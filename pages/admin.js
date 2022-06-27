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
} from '@chakra-ui/react'
import { useState } from 'react'
import axios from 'axios'
import { isSuccess } from '../functions/api'
import { BioSection, BioYear } from '../components/bio'
const AdminPage = () => {
    const { isOpen: isOpenAwards, onOpen: onOpenAwards, onClose: onCloseAwards } = useDisclosure()
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isError, setisError] = useState(false)
    const [isLoggedIn, setisLoggedIn] = useState(false)
    const [newData, setNewData] = useState(null)

    const loginHandler = () => {
        setIsSubmitting(true)
        axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/login`, {
            "username": username,
            "password": password
        }).then((res) => {
            console.log(res);
            if (isSuccess(res)) {
                if (res?.data?.success) {
                    setisError(false)
                    setisLoggedIn(true)
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

    const postAwardHandler = () => {
        setIsSubmitting(true)
        axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/awards`, {
            "year": newData.year,
            "name": newData.name
        }).then((res) => {
            if (isSuccess(res)) {
                alert("Award added successfully")
            }
        }).then(() => {
            setIsSubmitting(false)
        }).catch((err) => {
            console.error(err)
        })
    }



    return (
        <Layout>
            <Modal isOpen={isOpenAwards} onClose={onCloseAwards}>
                <ModalOverlay />
                <ModalContent p="20px">
                    <ModalCloseButton />
                    <FormControl>
                        <ModalHeader fontSize={"24px"}>New Award</ModalHeader>
                        <ModalBody>
                            <FormLabel mt="32px" id='year'>Year</FormLabel>
                            <Input autoComplete={false} onChange={(e) => setNewData({ "year": e.target.value })} focusBorderColor="gray.500" colorScheme="gray" name="year" type='number' />
                            <FormLabel mt="16px" htmlFor='username'>Description</FormLabel>
                            <Input autoComplete={false} onChange={(e) => setNewData({ "description": e.target.value })} focusBorderColor="gray.500" colorScheme="gray" id='description' type='text' />
                        </ModalBody>

                        <ModalFooter mt="16px">
                            <Button colorScheme='blue' mr={3} onClick={onCloseAwards}>
                                Close
                            </Button>
                            <Button variant='ghost'
                                colorScheme="teal"
                                type='submit'
                                isLoading={isSubmitting}
                                onClick={() => { postAwardHandler() }}>Submit</Button>
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
                                        <Button mr="8px">Add</Button>
                                        <Button>Edit</Button>
                                    </Box>
                                </Flex>
                            </BioSection>
                            <BioSection mt="16px">
                                <Flex justify="space-between">
                                    <BioYear>Awards</BioYear>
                                    <Box>
                                        <Button mr="8px" onClick={onOpenAwards}>Add</Button>
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