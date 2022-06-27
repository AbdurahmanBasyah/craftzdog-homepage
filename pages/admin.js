import Layout from '../components/layouts/article'
import Section from '../components/section'
import {
    Container,
    Heading,
    FormControl,
    FormLabel,
    Input,
    Button,
    Text
} from '@chakra-ui/react'
import { useState } from 'react'
import axios from 'axios'
import { isSuccess } from '../functions/api'
const AdminPage = () => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isError, setisError] = useState(false)

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
                    console.log("berhasil");
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


    return (
        <Layout>
            <Container>
                <Section delay={0.2}>
                    <Heading as="h3" variant="section-title">
                        Private Login
                    </Heading>
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

                    </FormControl>
                </Section>
            </Container>
        </Layout>
    );
}
export default AdminPage