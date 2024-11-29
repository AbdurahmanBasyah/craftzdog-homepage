import {
  Container,
  Badge,
  Box,
  Text,
  Heading,
  Button,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  LinkBox,
  ButtonGroup,
  Flex,
  Spacer,
  Divider,
  Image,
  Icon
} from '@chakra-ui/react'
import { Title } from '../../components/pageItem'
import Layout from '../../components/layouts/article'
import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import NextLink from 'next/link'
import { generateRoomId } from '../../functions/generator'
import iso from 'iso-3166-1'
import { FaSpotify, FaLayerGroup } from 'react-icons/fa'

const Invoicetify = () => {
  const CLIENT_ID = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID
  const REDIRECT_URI = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI
  const AUTH_ENDPOINT = process.env.NEXT_PUBLIC_SPOTIFY_AUTH_ENDPOINT
  const RESPONSE_TYPE = process.env.NEXT_PUBLIC_SPOTIFY_RESPONSE_TYPE

  const SCOPE =
    'user-read-private user-read-email user-library-read user-read-recently-played user-top-read user-read-currently-playing user-read-playback-state user-modify-playback-state'

  const [token, setToken] = useState('')
  const [data, setData] = useState(null)
  const [timeRange, setTimeRange] = useState('')
  const [dates, setDates] = useState({
    invoiceDate: '',
    dueDate: ''
  })
  const [invoiceId, setInvoiceId] = useState('')
  const [user, setUser] = useState(null)
  const [isGrouped, setIsGrouped] = useState(false)

  useEffect(() => {
    if (isGrouped) {
      if (data && data.items[0].artist === undefined) {
        let tracksGroupedByArtists = []
        data.items.forEach(track => {
          const artist = track.artists[0].name

          const index = tracksGroupedByArtists.findIndex(
            item => item.artist === artist
          )
          if (index === -1) {
            tracksGroupedByArtists.push({
              artist,
              tracks: [track]
            })
          } else {
            tracksGroupedByArtists[index].tracks.push(track)
          }
        })
        setData({
          items: tracksGroupedByArtists
        })
      }
    } else {
      const today = new Date()
      setInvoiceId(generateRoomId())
      switch (timeRange) {
        case 'long_term':
          setDates({
            ...dates,
            invoiceDate: '',
            dueDate: today.toISOString().split('T')[0]
          })
          getUserTopTracks()
          break
        case 'medium_term':
          const lastSixMonths = new Date(today)
          lastSixMonths.setMonth(lastSixMonths.getMonth() - 6)
          setDates({
            ...dates,
            dueDate: today.toISOString().split('T')[0],
            invoiceDate: lastSixMonths.toISOString().split('T')[0]
          })
          getUserTopTracks()
          break
        case 'short_term':
          const lastMonth = new Date(today)
          lastMonth.setMonth(lastMonth.getMonth() - 1)
          setDates({
            ...dates,
            dueDate: today.toISOString().split('T')[0],
            invoiceDate: lastMonth.toISOString().split('T')[0]
          })
          getUserTopTracks()
          break
        default:
          break
      }
    }
  }, [timeRange, isGrouped])

  const ref = useRef()

  useEffect(() => {
    const hash = window.location.hash
    let token = document.cookie
      .split('; ')
      ?.find(elem => elem.startsWith('token'))
      ?.split('=')[1]

    if (!token && hash) {
      token = hash
        .substring(1)
        .split('&')
        .find(elem => elem.startsWith('access_token'))
        .split('=')[1]

      // expire after 1 hour
      let expire = new Date()
      expire.setHours(expire.getHours() + 1)
      window.location.hash = ''
      window.location.href = REDIRECT_URI
      document.cookie = `token=${token ? token : ''
        }; expires=${expire.toUTCString()};`
    }

    setToken(token)
  }, [])

  useEffect(() => {
    if (token) getSpotifyUser()
  }, [token])

  const getUserTopTracks = () => {
    axios
      .get(
        `https://api.spotify.com/v1/me/top/tracks?limit=10&time_range=${timeRange}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      .then(res => {
        setData(res.data)
        return res.data
      })
  }

  const getSpotifyUser = () => {
    axios
      .get(`https://api.spotify.com/v1/me`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(res => {
        setUser(res.data)
      })
  }

  const milisecondsToMinutesAndSeconds = miliseconds => {
    const minutes = Math.floor(miliseconds / 60000)
    const seconds = ((miliseconds % 60000) / 1000).toFixed(0)
    return formatPrice(minutes, seconds)
  }

  const formatPrice = (minutes, seconds) => {
    return `$${minutes}.${seconds < 10 ? '0' : ''}${seconds}`
  }

  const trackDurationSum = (data) => {
    let sum = 0
    data?.forEach(item => {
      sum += item?.duration_ms ? parseInt(item?.duration_ms) : 0
      item.tracks?.forEach(track => {
        sum += parseInt(track?.duration_ms)
      })
    })
    return sum
  }

  //   change time to price
  const changeTimeToPrice = (priceAsDollar, percentage) => {
    // remove $ and . from price
    const priceAsNumber = priceAsDollar.replace('$', '').replace('.', '')
    // convert to number
    const priceAsNumberInt = parseInt(parseInt(priceAsNumber) * percentage)
    return formatPrice(
      Math.floor(priceAsNumberInt / 100),
      priceAsNumberInt % 100
    )
  }

  return (
    <Layout title="Invoicetify">
      <Container>
        <Title type="Works">
          Invoicetify <Badge>2022</Badge>
        </Title>
        {!token ? (
          <Box mx="auto" w="fit-content" mb="6">
            <LinkBox
              as={NextLink}
              href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${SCOPE}&response_type=${RESPONSE_TYPE}`}
              cursor={'none'}
              _hover={{
                textDecoration: 'none'
              }}
            >
              <>
                <Button
                  colorScheme="green"
                  variant="outline"
                  size="lg"
                  cursor={'none'}
                  _hover={{
                    textDecoration: 'none'
                  }}
                  leftIcon={<FaSpotify />}
                >
                  Login with Spotify
                </Button>
              </>
            </LinkBox>
          </Box>
        ) : (
          <>
            <ButtonGroup
              variant={'outline'}
              gap={6}
              placeItems={'center'}
              display={'grid'}
              gridTemplateColumns={'repeat(3, 1fr)'}
            >
              <Button
                onClick={() => {
                  setTimeRange('short_term')
                  setIsGrouped(false)
                }}
                colorScheme={timeRange === 'short_term' ? 'teal' : 'gray'}
              >
                This month
              </Button>
              <Button
                onClick={() => {
                  setTimeRange('medium_term')
                  setIsGrouped(false)
                }}
                colorScheme={timeRange === 'medium_term' ? 'teal' : 'gray'}
              >
                Last six months
              </Button>
              <Button
                onClick={() => {
                  setTimeRange('long_term')
                  setIsGrouped(false)
                }}
                colorScheme={timeRange === 'long_term' ? 'teal' : 'gray'}
              >
                All time
              </Button>
              <Box></Box>
              <Button
                onClick={() => {
                  setIsGrouped(!isGrouped)
                }}
                colorScheme={isGrouped ? 'green' : 'gray'}
              >
                <Icon as={FaLayerGroup} mr="2" />
                Group by artists
              </Button>
            </ButtonGroup>
            {data && (
              <Box
                ref={ref}
                mt="20"
                px="8"
                pt="2"
                pb="6"
                bg="white"
                color="black"
              >
                <Box mx="auto" w="fit-content">
                  <Image
                    src="/images/works/invoicetify.png"
                    alt="Invoicetify Logo"
                    width="120px"
                    height="120px"
                  />
                </Box>
                <Heading
                  textAlign={'center'}
                  as="h4"
                  variant={'section-title'}
                  mt="0"
                >
                  {isGrouped ? `Purchase Order List` : `Invoice #${invoiceId}`}
                </Heading>
                <Flex>
                  <Box mb="4">
                    <Heading size={{ base: 'sm', md: 'md' }} my="3">
                      {isGrouped ? 'Finalized by' : 'Invoice to'}
                    </Heading>
                    <Text
                      fontSize={{
                        base: '10px',
                        md: '12px',
                        lg: '14px'
                      }}
                    >
                      {isGrouped
                        ? `Employee: ${user?.display_name}`
                        : `Client: ${user?.display_name}`}
                    </Text>
                    <Text
                      fontSize={{
                        base: '10px',
                        md: '12px',
                        lg: '14px'
                      }}
                    >{`Location: ${iso.whereAlpha2(user?.country).country
                      }`}</Text>
                  </Box>
                  <Spacer />
                  <Box
                    textAlign={'end'}
                    fontSize={{
                      base: '10px',
                      md: '12px'
                    }}
                  >
                    <Text>
                      {dates?.invoiceDate &&
                        (isGrouped
                          ? `Date Created: ${dates?.invoiceDate}`
                          : `Invoice Date: ${dates?.invoiceDate}`)}
                    </Text>
                    <Text>
                      {isGrouped
                        ? `Date Finalized: ${dates?.dueDate}`
                        : `Due Date: ${dates?.dueDate}`}
                    </Text>
                  </Box>
                </Flex>
                <Box></Box>
                <Table variant="striped" size="sm" colorScheme={'gray'}>
                  <Thead bgColor={'teal'}>
                    <Tr>
                      <Th
                        color="white"
                        fontSize={{
                          base: '8px',
                          md: '10px',
                          lg: '12px'
                        }}
                      >
                        {isGrouped ? 'Supplier' : 'Item'}
                      </Th>
                      <Th
                        color="white"
                        fontSize={{
                          base: '8px',
                          md: '10px',
                          lg: '12px'
                        }}
                      >
                        {isGrouped ? 'Items' : 'Description'}
                      </Th>
                      <Th
                        color="white"
                        fontSize={{
                          base: '8px',
                          md: '10px',
                          lg: '12px'
                        }}
                        isNumeric
                      >
                        Price
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody border={'1px solid #333333'}>
                    {data.items.map((item, index) => {
                      return (
                        <Tr
                          key={index}
                          color={index % 2 === 0 ? 'whitesmoke' : 'inherit'}
                        >
                          <Td
                            fontSize={{
                              base: '8px',
                              md: '10px',
                              lg: '12px'
                            }}
                          >
                            {isGrouped ? item.artist : item.name}
                          </Td>
                          <Td
                            fontSize={{
                              base: '8px',
                              md: '10px',
                              lg: '12px'
                            }}
                          >
                            {isGrouped
                              ? item.tracks?.map((item, index) => {
                                return <Text key={index}>{`- ${item.name}`}</Text>
                              })
                              : item.artists[0].name}
                          </Td>
                          <Td
                            isNumeric
                            fontSize={{
                              base: '8px',
                              md: '10px',
                              lg: '12px'
                            }}
                          >
                            {isGrouped
                              ? milisecondsToMinutesAndSeconds(trackDurationSum(item.tracks))
                              : milisecondsToMinutesAndSeconds(
                                item.duration_ms
                              )}
                          </Td>
                        </Tr>
                      )
                    })}
                  </Tbody>
                  <Tfoot>
                    <Tr>
                      <Th></Th>
                      {isGrouped ? (
                        <Th
                          fontSize={{
                            base: '6px',
                            md: '10px'
                          }}
                        >
                          Total
                        </Th>
                      ) : (
                        <Th
                          fontSize={{
                            base: '6px',
                            md: '10px'
                          }}
                        >
                          Total <br />
                          Tax <br />
                          Grand Total <br />
                          Amount Paid
                          <br />
                          Balance Due
                        </Th>
                      )}
                      {isGrouped ? (
                        <Th
                          fontSize={{
                            base: '6px',
                            md: '10px'
                          }}
                          isNumeric
                        >
                          {`${milisecondsToMinutesAndSeconds(
                            trackDurationSum(data.items)
                          )}`}
                        </Th>
                      ) : (
                        <Th
                          isNumeric
                          fontSize={{
                            base: '6px',
                            md: '10px'
                          }}
                        >
                          {`${milisecondsToMinutesAndSeconds(
                            trackDurationSum(data.items)
                          )}`}
                          <br />
                          {`${changeTimeToPrice(
                            milisecondsToMinutesAndSeconds(
                              trackDurationSum(data.items)
                            ),
                            0.2
                          )}`}
                          <br />
                          {`${changeTimeToPrice(
                            milisecondsToMinutesAndSeconds(
                              trackDurationSum(data.items)
                            ),
                            1.2
                          )}`}
                          <br />
                          {`${changeTimeToPrice(
                            milisecondsToMinutesAndSeconds(
                              trackDurationSum(data.items)
                            ),
                            0.8
                          )}`}
                          <Divider />
                          {`${changeTimeToPrice(
                            milisecondsToMinutesAndSeconds(
                              trackDurationSum(data.items)
                            ),
                            0.4
                          )}`}
                        </Th>
                      )}
                    </Tr>
                  </Tfoot>
                </Table>
                {isGrouped ? (
                  <Box
                    fontSize={{
                      base: '8px',
                      md: '10px',
                      lg: '12px'
                    }}
                    my="6"
                  >
                    <Text>
                      <Text fontWeight={'bold'}>Notes</Text>
                    </Text>
                    <Text mb="2">
                      This finalized purchase order list is for your records.
                      Please keep this document for your records.
                    </Text>
                  </Box>
                ) : (
                  <Box
                    fontSize={{
                      base: '8px',
                      md: '10px',
                      lg: '12px'
                    }}
                    my="6"
                  >
                    <Text mb="2">
                      <Text fontWeight={'bold'}>Terms & Conditions</Text>
                    </Text>
                    <Text>
                      <Text fontWeight={'bold'}>Payment</Text>
                    </Text>
                    <Text mb="2">
                      Payment is due within 15 days of receipt of invoice. Late
                      payments will be subject to a 5% surcharge.
                    </Text>
                    <Text>
                      <Text fontWeight={'bold'}>Refunds</Text>
                    </Text>
                    <Text mb="2">
                      Refunds are only available within 30 days of purchase.
                    </Text>
                    <Text>
                      <Text fontWeight={'bold'}>Privacy</Text>
                    </Text>
                    <Text mb="2">
                      We will never share your personal information with anyone
                      else.
                    </Text>
                  </Box>
                )}

                <Text textAlign={'center'} fontWeight={'bold'} mb="2">
                  Thank you for your business!
                </Text>
                <Text textAlign={'center'} fontWeight={'bold'}>
                  &copy; Invoicetify
                </Text>
                <Text textAlign={'center'}>rebrand.ly/invoicetify</Text>
              </Box>
            )}
            {data && (
              <Box mx="auto" w="fit-content" my="10">
                <Button
                  onClick={async () => {
                    const { exportComponentAsPNG } = await import(
                      'react-component-export-image'
                    )
                    exportComponentAsPNG(ref, {
                      fileName: `invoicetify-${user?.display_name}`
                    })
                  }}
                  variant="outline"
                  colorScheme="teal"
                >
                  Download
                </Button>
              </Box>
            )}
          </>
        )}
      </Container>
    </Layout>
  )
}

export default Invoicetify
