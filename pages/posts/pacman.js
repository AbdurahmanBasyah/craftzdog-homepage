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
  static width = 40
  static height = 40
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

  const [keys, setKeys] = useState({
    ArrowRight: { pressed: false },
    ArrowLeft: { pressed: false },
    ArrowUp: { pressed: false },
    ArrowDown: { pressed: false }
  })

  const [keyState, setKeyState] = useState({})

  const [lastKey, setLastKey] = useState('')

  //   useEffect(() => {
  //     console.log(keys)
  //     console.log(lastKey)
  //     if (keys.ArrowRight.pressed && lastKey === 'ArrowRight') {
  //       let { x, y, direction, velocityX, velocityY } = pacman
  //       if (board[y][x + 1] === 0) {
  //         velocityX = 1
  //         velocityY = 0
  //         direction = 'right'
  //         setPacman({
  //           velocityX: velocityX,
  //           velocityY: velocityY,
  //           direction: direction,
  //           image: '/images/cursor.gif',
  //           x: x + velocityX,
  //           y: y + velocityY
  //         })
  //       }
  //     } else if (keys.ArrowLeft.pressed && lastKey === 'ArrowLeft') {
  //       let { x, y, direction, velocityX, velocityY } = pacman
  //       if (board[y][x - 1] === 0) {
  //         velocityX = -1
  //         velocityY = 0
  //         direction = 'left'
  //         setPacman({
  //           velocityX: velocityX,
  //           velocityY: velocityY,
  //           direction: direction,
  //           image: '/images/cursor.gif',
  //           x: x + velocityX,
  //           y: y + velocityY
  //         })
  //       }
  //     } else if (keys.ArrowUp.pressed && lastKey === 'ArrowUp') {
  //       let { x, y, direction, velocityX, velocityY } = pacman
  //       if (board[y - 1][x] === 0) {
  //         velocityX = 0
  //         velocityY = -1
  //         direction = 'up'
  //         setPacman({
  //           velocityX: velocityX,
  //           velocityY: velocityY,
  //           direction: direction,
  //           image: '/images/cursor.gif',
  //           x: x + velocityX,
  //           y: y + velocityY
  //         })
  //       }
  //     } else if (keys.ArrowDown.pressed && lastKey === 'ArrowDown') {
  //       let { x, y, direction, velocityX, velocityY } = pacman
  //       if (board[y + 1][x] === 0) {
  //         velocityX = 0
  //         velocityY = 1
  //         direction = 'down'
  //         setPacman({
  //           velocityX: velocityX,
  //           velocityY: velocityY,
  //           direction: direction,
  //           image: '/images/cursor.gif',
  //           x: x + velocityX,
  //           y: y + velocityY
  //         })
  //       }
  //     }
  //   }, [keys])

  //   useEffect(() => {
  //     const handleKeyDown = e => {
  //       switch (e.key) {
  //         case 'ArrowRight':
  //           setKeys({
  //             ...keys,
  //             ArrowRight: { pressed: true }
  //           })
  //           setLastKey('ArrowRight')
  //           break
  //         case 'ArrowLeft':
  //           setKeys({
  //             ...keys,
  //             ArrowLeft: { pressed: true }
  //           })
  //           setLastKey('ArrowLeft')
  //           break
  //         case 'ArrowUp':
  //           setKeys({
  //             ...keys,
  //             ArrowUp: { pressed: true }
  //           })
  //           setLastKey('ArrowUp')
  //           break
  //         case 'ArrowDown':
  //           setKeys({
  //             ...keys,
  //             ArrowDown: { pressed: true }
  //           })
  //           setLastKey('ArrowDown')
  //           break
  //         default:
  //           break
  //       }
  //     }

  //     const handleKeyUp = e => {
  //       switch (e.key) {
  //         case 'ArrowRight':
  //           setKeys({
  //             ...keys,
  //             ArrowRight: { pressed: false }
  //           })
  //           break
  //         case 'ArrowLeft':
  //           setKeys({
  //             ...keys,
  //             ArrowLeft: { pressed: false }
  //           })
  //           break
  //         case 'ArrowUp':
  //           setKeys({
  //             ...keys,
  //             ArrowUp: { pressed: false }
  //           })
  //           break
  //         case 'ArrowDown':
  //           setKeys({
  //             ...keys,
  //             ArrowDown: { pressed: false }
  //           })

  //           break
  //         default:
  //           break
  //       }
  //     }

  //     window.addEventListener('keydown', handleKeyDown)
  //     window.addEventListener('keyup', handleKeyUp)
  //     return () => {
  //       window.removeEventListener('keydown', handleKeyDown)
  //       window.removeEventListener('keyup', handleKeyUp)
  //     }
  //   }, [pacman, keys])

  useEffect(() => {
    window.addEventListener(
      'keydown',
      function (e) {
        keyState[e.key] = true
      },
      true
    )

    window.addEventListener(
      'keyup',
      function (e) {
        keyState[e.key] = false
      },
      true
    )
    gameLoop()
    return () => {
      window.removeEventListener(
        'keydown',
        function (e) {
          keyState[e.key] = true
        },
        true
      )

      window.removeEventListener(
        'keyup',
        function (e) {
          keyState[e.key] = false
        },
        true
      )
    }
  }, [pacman])

  const gameLoop = () => {
    if (keyState.ArrowRight) {
      setPacman({
        ...pacman,
        x: pacman.x + 1
      })
    }
    if (keyState.ArrowLeft) {
      setPacman({
        ...pacman,
        x: pacman.x - 1
      })
    }
    setTimeout(gameLoop, 10)
  }
  return (
    <Layout title="Card Connect">
      <Container>
        <Title type="Posts">
          Pacman <Badge>Game</Badge>
        </Title>
        {/* <Box>{renderBoard()}</Box> */}
        <Box position="relative" h={Square.height * board.length}>
          {board.map((row, rowIndex) => {
            return (
              <Box key={rowIndex} display="flex">
                {row.map((square, squareIndex) => {
                  return (
                    <Box
                      key={squareIndex}
                      w={`${Square.width}px`}
                      h={`${Square.height}px`}
                      bg={square === 1 ? 'black' : 'white'}
                    ></Box>
                  )
                })}
              </Box>
            )
          })}

          <Box
            w={`${Square.width}px`}
            h={`${Square.height}px`}
            bg="yellow"
            position="absolute"
            top={`${pacman.y * Square.height}px`}
            left={`${pacman.x * Square.width}px`}
          >
            <Image src={pacman.image} alt="pacman" />
          </Box>
        </Box>
        {/* 
        <Box
            gridColumn={pacman.x + 1}
            gridRow={pacman.y + 1}
            w={Square.width}
            h={Square.height}
            bg="yellow"
            transition={'all 0.1s ease-in-out'}
          >
            <Image
              transition={'all 0.1s ease-in-out'}
              src={pacman.image}
              alt="pacman"
            />
          </Box> */}
      </Container>
    </Layout>
  )
}

export default Pacman
