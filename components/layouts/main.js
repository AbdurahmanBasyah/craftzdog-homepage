import Head from 'next/head'
import dynamic from 'next/dynamic'
import NavBar from '../navbar'
import { Box, Container } from '@chakra-ui/react'
import Footer from '../footer'
import VoxelDogLoader from '../voxel-dog-loader'
import { useEffect } from 'react'
import { useState } from 'react'
import useWindowSize from '../../hooks/useWindowSize'
import cursor from '../../public/images/cursor.gif'
import run from '../../public/images/run.gif'
import jump from '../../public/images/jump.gif'
import climb from '../../public/images/climb.gif'
import Image from 'next/image'

const LazyVoxelDog = dynamic(() => import('../voxel-dog'), {
  ssr: false,
  loading: () => <VoxelDogLoader />
})

const Main = ({ children, router }) => {
  const [isHover, setIsHover] = useState(false)
  const [isMove, setIsMove] = useState(false)
  const [isScroll, setIsScroll] = useState(false)
  const { width } = useWindowSize()
  const isMobile = width < 768
  useEffect(() => {
    if (!isMobile) {
      document.body.style.cursor = 'none'
      var cursor = document.querySelector('.cursor')
      // var cursorinner = document.querySelector('.cursor2')

      cursor.style.display = 'block'
      // cursorinner.style.display = 'block'

      var timer
      window.addEventListener('mousemove', function (e) {
        clearTimeout(timer)
        cursor.style.transform = `translate3d(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%), 0)`
        setIsMove(true)

        timer = setTimeout(() => setIsMove(false), 100)
      })

      // window.addEventListener('mousemove', function (e) {
      //   var x = e.clientX
      //   var y = e.clientY
      //   cursorinner.style.left = x + 'px'
      //   cursorinner.style.top = y + 'px'
      // })

      // window.addEventListener('mousedown', function () {
      //   cursor.classList.add('click')
      //   cursorinner.classList.add('cursorinnerhover')
      // })

      // window.addEventListener('mouseup', function () {
      //   cursor.classList.remove('click')
      //   cursorinner.classList.remove('cursorinnerhover')
      // })

      const buttons = document.getElementsByTagName('button')
      for (let i = 0; i < buttons.length; i++) {
        buttons[i].style.cursor = 'none'
        buttons[i].addEventListener('mouseover', function () {
          setIsHover(true)
        })
        buttons[i].addEventListener('mouseout', function () {
          setIsHover(false)
        })
      }
    }

    const links = document.getElementsByTagName('a')
    for (let i = 0; i < links.length; i++) {
      links[i].style.cursor = 'none'
      links[i].addEventListener('mouseover', function () {
        setIsHover(true)
      })
      links[i].addEventListener('mouseout', function () {
        setIsHover(false)
      })
    }

    window.addEventListener('scroll', () => setIsScroll(true))

    // Use a debounce function to remove the class after the user stops scrolling
    let debounce
    window.addEventListener('scroll', () => {
      clearTimeout(debounce)
      debounce = setTimeout(() => setIsScroll(false), 100)
    })
    return () => {
      document.body.style.cursor = 'auto'
    }
  }, [])

  return (
    <Box as="main" pb={8} overflow="hidden" minH="100vh">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Abduh's homepage" />
        <meta name="author" content="M Abdurahman Basyah" />
        <meta name="author" content="craftzdog" />
        <link rel="apple-touch-icon" href="apple-touch-icon.png" />
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="icon" href="apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.webmanifest" />
        <meta name="theme-color" content="#008080" />
        <meta name="twitter:title" content="Abdurahman Basyah" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@craftzdog" />
        <meta name="twitter:creator" content="@craftzdog" />
        <meta name="twitter:image" content="/card.png" />
        <meta
          property="og:site_name"
          content="M Abdurahman Basyah's Homepage"
        />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/card.png" />
        <title>M Abdurahman B - Homepage</title>
      </Head>

      <NavBar path={router.asPath} />

      <Container maxW="container.md" pt={14}>
        <LazyVoxelDog />

        {children}
        <Box
          className="cursor"
          borderRadius="full"
          // border="1px solid #008080"
          transition="all .1s ease-out"
          position="fixed"
          filter={isHover ? 'brightness(1.5)' : 'brightness(1)'}
          pointerEvents="none"
          cursor="none"
          left="0"
          top="0"
          display={'none'}
          zIndex={999999}
          transform={'translate(-50%, -50%)'}
          // width={isHover ? '30px' : '50px'}
          // height={isHover ? '30px' : '50px'}
        >
          {(() => {
            if (isHover) {
              return <Image src={jump} alt="cursor" width={50} height={50} />
            } else if (isScroll) {
              return <Image src={climb} alt="cursor" width={50} height={50} />
            } else if (isMove) {
              return <Image src={run} alt="cursor" width={50} height={50} />
            } else {
              return <Image src={cursor} alt="cursor" width={50} height={50} />
            }
          })()}
        </Box>
        {/* <Box
          className="cursor2"
          width={isHover ? '30px' : '20px'}
          height={isHover ? '30px' : '20px'}
          borderRadius="full"
          backgroundColor="#008080"
          position="fixed"
          zIndex={999999}
          cursor={'none'}
          display={'none'}
          transform={'translate(-50%, -50%)'}
          pointerEvents="none"
          transition="width .3s, height .3s, opacity .3s"
        ></Box> */}
        <Footer />
      </Container>
    </Box>
  )
}

export default Main
