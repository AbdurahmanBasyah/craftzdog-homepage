import {
  Container,
  Badge,
  Box,
  Button,
  Image,
  Flex,
  List,
  ListItem,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
  Heading,
  useDisclosure,
  Input,
  SimpleGrid
} from '@chakra-ui/react'
import { Title, Meta } from '../../components/pageItem'
import Layout from '../../components/layouts/article'
import { useState } from 'react'
import { useEffect } from 'react'
import axios from 'axios'
import P from '../../components/paragraph'
import useWindowSize from '../../hooks/useWindowSize'
import { isSuccess } from '../../functions/api'

class Square {
  static width = '40px'
  static height = '40px'
  constructor(x, y, status) {
    this.x = x
    this.y = y
    this.status = status
  }
}

const board = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 1, 0, 1],
  [1, 0, 1, 0, 0, 0, 1, 1, 0, 1],
  [1, 0, 1, 1, 1, 1, 1, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 1, 1],
  [1, 0, 1, 1, 1, 1, 1, 0, 0, 1],
  [1, 0, 1, 0, 0, 0, 1, 0, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 0, 0, 1],
  [1, 0, 1, 0, 1, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
]

const Pacman = () => {
  const [pacman, setPacman] = useState({
    x: 1,
    y: 1,
    velocityX: 0,
    velocityY: 0,
    direction: 'right',
    image: '/images/cursor.gif'
  })
  const [iteration, setIteration] = useState(0)
  const rightMove = () => {
    console.log(pacman.x + 1 + iteration, pacman.y)
    console.log(board[pacman.y][pacman.x + 1 + iteration])
    if (board[pacman.y][pacman.x + 1 + iteration] === 0) {
      setPacman(pacman => ({
        ...pacman,
        x: pacman.x + 1,
        direction: 'right'
      }))
    }
  }

  useEffect(() => {
    const handleKeyDown = e => {
      if (e.key === 'd') {
        // move right until hit wall
        console.log(board[pacman.y][pacman.x + 1] )
        while (board[pacman.y][pacman.x + 1] === 0) {
          setPacman(pacman => ({
            ...pacman,
            x: pacman.x + 1,
            direction: 'right'
          }))
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [pacman, iteration])

  return (
    <Layout title="Card Connect">
      <Container>
        <Title type="Posts">
          Pacman <Badge>Game</Badge>
        </Title>
        {/* <Box>{renderBoard()}</Box> */}

        <Button
          onClick={() => {
            clearInterval(rightMove)
          }}
        >
          Stop interval
        </Button>

        <SimpleGrid
          columns={10}
          w="fit-content"
          rows={10}
          placeItems="center"
          spacing={0}
          gap={0}
        >
          {board.map((row, y) => {
            return row.map((square, x) => {
              const status = board[y][x] === 1 ? 'wall' : 'empty'
              const newSquare = new Square(x, y, status)
              return (
                <Box
                  gridColumn={newSquare.x + 1}
                  gridRow={newSquare.y + 1}
                  key={newSquare.x + newSquare.y}
                  w={Square.width}
                  h={Square.height}
                  bg={newSquare.status === 'wall' ? 'gray.500' : 'gray.100'}
                ></Box>
              )
            })
          })}
          <Box
            gridColumn={pacman.x + 1}
            gridRow={pacman.y + 1}
            w={Square.width}
            h={Square.height}
            bg="yellow"
            transition={'all 0.1s ease-in-out'}
          >
            <Image src={pacman.image} alt="pacman" />
          </Box>
        </SimpleGrid>
      </Container>
    </Layout>
  )
}

export default Pacman
