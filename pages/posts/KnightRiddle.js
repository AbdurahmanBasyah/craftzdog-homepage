import {
  Container,
  Badge,
  Box,
  Text,
  Heading,
  Button,
  SimpleGrid,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
  Input,
  Flex
} from '@chakra-ui/react'
import { Title } from '../../components/pageItem'
import Layout from '../../components/layouts/article'
import blackKnight from '../../public/images/posts/blackKnight.png'
import { useState } from 'react'
import { useEffect } from 'react'
import Image from 'next/image'
import { io } from 'socket.io-client'
import { generateRoomId } from '../../functions/generator'

// class Square
export class Square {
  constructor(square) {
    this.square = square
    this.piece = ''
    this.possibleMoves = []
    this.isVisited = false
  }

  isPossibleMove(square) {
    return this.possibleMoves.includes(square)
  }

  setPiece(piece) {
    this.piece = piece
  }

  getPiece() {
    return this.piece
  }

  getSquare() {
    return this.square
  }

  getPossibleMoves() {
    return this.possibleMoves
  }

  setPossibleMoves(moves) {
    this.possibleMoves = moves
  }

  setVisited() {
    this.isVisited = true
  }

  getVisited() {
    return this.isVisited
  }

  toString() {
    return this.square
  }
}

const WHITE_SQUARE_STYLE = {
  backgroundColor: '#8a785d',
  width: '40px',
  height: '40px',
  border: '1px solid black',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: '40px',
  color: 'black',
  cursor: 'none'
}

const BLACK_SQUARE_STYLE = {
  backgroundColor: '#573a2e',
  width: '40px',
  height: '40px',
  border: '1px solid black',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: '40px',
  color: 'white',
  cursor: 'none'
}

const CURRENT_SQUARE_STYLE = {
  backgroundColor: '#FFD700',
  filter: 'drop-shadow(0 0 0.75rem #FFD700)',
  width: '40px',
  height: '40px',
  border: '1px solid black',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: '40px',
  color: 'white',
  cursor: 'none'
}

const VISITED_SQUARE_STYLE = {
  backgroundColor: 'transparent',
  width: '40px',
  height: '40px',
  // border: '1px solid black',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: '40px',
  color: 'white',
  cursor: 'none'
}

const BLACK_SQUARES = [
  'a1',
  'a3',
  'a5',
  'a7',
  'b2',
  'b4',
  'b6',
  'b8',
  'c1',
  'c3',
  'c5',
  'c7',
  'd2',
  'd4',
  'd6',
  'd8',
  'e1',
  'e3',
  'e5',
  'e7',
  'f2',
  'f4',
  'f6',
  'f8',
  'g1',
  'g3',
  'g5',
  'g7',
  'h2',
  'h4',
  'h6',
  'h8'
]

// Move
export class Move {
  constructor(fromSquare, toSquare, piece) {
    this.fromSquare = fromSquare
    this.toSquare = toSquare
    this.piece = piece
  }

  getFromSquare() {
    return this.fromSquare
  }

  getToSquare() {
    return this.toSquare
  }

  getPiece() {
    return this.piece
  }

  toString() {
    return this.fromSquare + ' ' + this.toSquare + ' ' + this.piece
  }
}

const KnightRiddle = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [data, setData] = useState(null)
  const [currentSocket, setCurrentSocket] = useState(null)
  const [playerId, setPlayerId] = useState('')
  const [isJoined, setIsJoined] = useState(false)
  const [roomId, setRoomId] = useState('')
  const [joinRoom, setJoinRoom] = useState('')
  const [isHost, setIsHost] = useState(null)
  const [isCopied, setIsCopied] = useState(false)
  const [modalData, setModalData] = useState(null)

  useEffect(() => {
    // const socket = io('https://personal-be-production.up.railway.app', {
    //   transports: ['websocket']
    // })
    const socket = io('http://localhost:8080', {
      // withCredentials: true,
      transports: ['websocket']
    })

    let tempSquares = []
    for (let i = 8; i >= 1; i--) {
      for (let j = 0; j <= 7; j++) {
        const square = new Square(
          `${['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'][j]}${i}`
        )
        tempSquares.push(square)
      }
    }
    setData({ ...data, squares: tempSquares })
    setPossibleKnightMoves(tempSquares)
    setCurrentSocket(socket)
    return () => {
      socket.disconnect()
    }
  }, [])

  useEffect(() => {
    if (currentSocket) {
      currentSocket?.on('connect', () => {
        setPlayerId(currentSocket.id)
        const id = generateRoomId()
        setRoomId(id)
        const data = {
          roomId: id,
          playerId: currentSocket.id,
          isHost: true
        }
        currentSocket.emit('join-room', data, id)
      })

      currentSocket?.on('player-joined', data => {
        console.log(data)
        console.log(data.playerId)
        console.log(playerId)
        // set isJoined to true and host to true if new guest is joined
        if (
          isHost === null &&
          data.isHost === false &&
          data.playerId !== currentSocket.id
        ) {
          setIsJoined(true)
          setIsHost(true)
        }
      })

      currentSocket?.on('play-card', newData => {
        const toSquare = getSquareByName(newData.move.toSquare)
        const fromSquare = getSquareByName(newData.move.fromSquare)
        const piece = newData.move.piece
        if (piece === 'n') {
          if (fromSquare) {
            fromSquare.setPiece(null)
          }
          toSquare.setPiece(newData.move.piece)
          toSquare.setVisited()

          setData({
            ...data,
            squares: data.squares,
            lastTurn: newData.lastTurn
          })

          // check if there is a possible move
          if (!possibleSquareIsAvailable(toSquare)) {
            if (newData.lastTurn === currentSocket.id) {
              setModalData({
                title: 'You won!',
                description:
                  'You have made your opponent does not have any possible move!'
              })
              onOpen()
            } else {
              setModalData({
                title: 'You lost!',
                description: 'You have no possible move!'
              })
              onOpen()
            }
          }
        }
      })
    }
  }, [currentSocket])

  useEffect(() => {
    console.log(data)
    renderBoard()
  }, [data])

  const getSquareByName = name => {
    return data.squares.find(square => square.getSquare() === name)
  }

  // set possible knight moves for each square
  const setPossibleKnightMoves = squares => {
    squares.forEach(square => {
      const possibleMoves = getPossibleKnightMoves(square)
      square.setPossibleMoves(possibleMoves)
    })
  }

  // get possible knight moves for a square
  const getPossibleKnightMoves = square => {
    const squareName = square.getSquare()
    const possibleMoves = []
    const row = squareName[1]
    const col = squareName[0]

    const possibleMovesNames = [
      `${String.fromCharCode(col.charCodeAt(0) + 1)}${Number(row) + 2}`,
      `${String.fromCharCode(col.charCodeAt(0) + 2)}${Number(row) + 1}`,
      `${String.fromCharCode(col.charCodeAt(0) + 2)}${Number(row) - 1}`,
      `${String.fromCharCode(col.charCodeAt(0) + 1)}${Number(row) - 2}`,
      `${String.fromCharCode(col.charCodeAt(0) - 1)}${Number(row) - 2}`,
      `${String.fromCharCode(col.charCodeAt(0) - 2)}${Number(row) - 1}`,
      `${String.fromCharCode(col.charCodeAt(0) - 2)}${Number(row) + 1}`,
      `${String.fromCharCode(col.charCodeAt(0) - 1)}${Number(row) + 2}`
    ]

    possibleMovesNames.forEach(move => {
      if (move.match(/[a-h][1-8]/)) {
        // check if move is not square 10
        if (move[2] !== '0') {
          possibleMoves.push(move)
        }
      }
    })

    return possibleMoves
  }

  const onDrop = (e, square) => {
    e.preventDefault()
    if (data.lastTurn !== currentSocket.id) {
      const piece = e.dataTransfer.getData('piece')
      const fromSquare = e.dataTransfer.getData('fromSquare')
      const toSquare = square.getSquare()
      if (fromSquare) {
        const move = new Move(fromSquare, toSquare, piece)
        console.log(move)
        // check if move is valid
        if (getSquareByName(fromSquare).getPossibleMoves().includes(toSquare)) {
          // check if square is not visited
          if (!square.getVisited()) {
            getSquareByName(fromSquare).setPiece('')
            const newData = {
              move: move,
              lastTurn: currentSocket.id
            }
            currentSocket.emit('play-card', newData, roomId)
          }
        }
      } else {
        const move = new Move(fromSquare, toSquare, piece)
        const newData = {
          move: move,
          lastTurn: currentSocket.id
        }
        currentSocket.emit('play-card', newData, roomId)
      }
    }
  }

  const possibleSquareIsAvailable = square => {
    return square.getPossibleMoves().some(move => {
      return !getSquareByName(move).getVisited()
    })
  }

  const drag = e => {
    e.dataTransfer.setData('piece', e.target.id)
    e.dataTransfer.setData('fromSquare', e.target.parentNode.id)
  }

  const handleJoin = () => {
    const data = {
      playerId: currentSocket.id,
      roomId: joinRoom,
      isHost: false
    }
    setRoomId(joinRoom)
    setIsJoined(true)
    setIsHost(false)
    currentSocket.emit('join-room', data, joinRoom)
  }

  const shareHandler = () => {
    if (navigator.share) {
      let text = `I played The Knight Riddle!\n`
      text += '\n'
      for (let i = 0; i < data.squares.length; i++) {
        if (data.squares[i].getPiece() === 'n') {
          text += `🟧`
        } else if (data.squares[i].getVisited()) {
          text += `⬛`
        } else if (BLACK_SQUARES.includes(data.squares[i].getSquare())) {
          text += `🟫`
        } else {
          text += `⬜`
        }
        if (i % 8 === 7) {
          text += `\n`
        }
      }
      text += '\n'
      text += 'Can you beat me?'
      text += '\n'
      navigator.share({
        title: 'The Knight Riddle',
        text: text,
        url: 'https://abdurahmanbasyah/posts/KnightRiddle'
      })
    }
  }

  const renderSquare = square => {
    return (
      <Box
        id={square.getSquare()}
        key={square.getSquare()}
        position="relative"
        // if piece is knight, set current square style. if square is visited, set visited square style. if square is black, set black square style. else set white square style
        style={
          square.getPiece() === 'n'
            ? CURRENT_SQUARE_STYLE
            : square.getVisited()
            ? VISITED_SQUARE_STYLE
            : BLACK_SQUARES.includes(square.getSquare())
            ? BLACK_SQUARE_STYLE
            : WHITE_SQUARE_STYLE
        }
        onDrop={e => onDrop(e, square)}
        onDragOver={e => e.preventDefault()}
        onTouchEnd={e => onDrop(e, square)}
        onTouchMove={e => e.preventDefault()}
      >
        {square.getPiece() === 'n' && (
          <Image
            src={blackKnight}
            alt="black knight"
            draggable={true}
            onDragStart={e => drag(e)}
            onTouchStart={e => drag(e)}
            id={square.getPiece()}
          />
        )}
      </Box>
    )
  }

  const renderBoard = () => {
    return (
      <SimpleGrid
        columns={8}
        spacing={0}
        gap={0}
        placeItems="center"
        my="6"
        mx="auto"
        w={'fit-content'}
      >
        {data?.squares?.map(square => {
          return renderSquare(square)
        })}
      </SimpleGrid>
    )
  }

  return (
    <Layout title="Knight Riddle">
      <Container>
        <Title type="Posts">
          Knight Riddle <Badge>Game</Badge>
        </Title>

        <Modal isOpen={isOpen} onClose={onClose} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalBody
              display={'flex'}
              flexDirection="column"
              alignItems={'center'}
            >
              <Heading as="h3" my="4" variant="section-title">
                {modalData?.title}
              </Heading>
              <Text textAlign="center">{modalData?.description}</Text>
            </ModalBody>
            <ModalFooter>
              <Button
                cursor={'none'}
                colorScheme="cyan"
                mr={3}
                onClick={() => {
                  shareHandler()
                }}
              >
                Share
              </Button>
              <Button
                colorScheme="teal"
                onClick={() => {
                  onClose()
                  setData(null)
                  setIsJoined(false)
                  setIsHost(null)
                  setJoinRoom('')
                }}
              >
                Play Again
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        {isJoined ? (
          <>
            {console.log(data.lastTurn)}
            {isHost ? (
              <Box>
                {data.lastTurn === undefined && (
                  <>
                    <Text>
                      Your friend is joined the room. Now is your turn, place
                      your knight somewhere
                    </Text>

                    <Image
                      src={blackKnight}
                      alt="black knight"
                      draggable={true}
                      onDragStart={e => drag(e)}
                      onTouchStart={e => drag(e)}
                      id={'n'}
                    />
                  </>
                )}
              </Box>
            ) : (
              <Box>
                {data.lastTurn === undefined && (
                  <>
                    <Text>Waiting for your friend to make the first move</Text>
                  </>
                )}
              </Box>
            )}
            {data.lastTurn !== undefined &&
              data.lastTurn === currentSocket.id && (
                <Text>
                  Waiting for your friend to make the next move, please wait...
                </Text>
              )}
            {data.lastTurn !== undefined &&
              data.lastTurn !== currentSocket.id && (
                <Text>
                  {`Your friend made a move, now is your turn to make a move`}
                </Text>
              )}
          </>
        ) : (
          <>
            <Flex>
              <Box>
                <Heading as="h3" className="section-titile">
                  Be a host
                </Heading>
                <Text
                  fontSize={'sm'}
                >{`Invite your friend, here's your room ID ${roomId}`}</Text>
                <Button
                  cursor={'none'}
                  colorScheme="teal"
                  my="4"
                  variant={'outline'}
                  ml="4"
                  fontSize={'xs'}
                  onClick={() => {
                    setIsCopied(true)
                    navigator.clipboard.writeText(roomId)
                  }}
                >
                  {isCopied ? 'Copied' : 'Copy'}
                </Button>
              </Box>
              <Text>or</Text>
              <Box>
                <Heading as="h3" className="section-titile">
                  Join a room
                </Heading>
                <Input
                  placeholder="Room ID"
                  value={joinRoom}
                  onChange={e => setJoinRoom(e.target.value)}
                />
                <Button
                  colorScheme="teal"
                  my="4"
                  variant={'outline'}
                  ml="4"
                  fontSize={'xs'}
                  onClick={handleJoin}
                >
                  Join
                </Button>
              </Box>
            </Flex>
          </>
        )}

        <Box>{renderBoard()}</Box>
      </Container>
    </Layout>
  )
}

export default KnightRiddle
