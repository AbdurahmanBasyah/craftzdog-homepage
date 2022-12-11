import Head from 'next/head'
import dynamic from 'next/dynamic'
import NavBar from '../navbar'
import { Box, Container } from '@chakra-ui/react'
import Footer from '../footer'
import VoxelDogLoader from '../voxel-dog-loader'
import { useEffect } from 'react'

const LazyVoxelDog = dynamic(() => import('../voxel-dog'), {
  ssr: false,
  loading: () => <VoxelDogLoader />
})

const Main = ({ children, router }) => {
  useEffect(() => {
    document.body.style.cursor = 'none'
    var cursor = document.querySelector('.cursor')
    var cursorinner = document.querySelector('.cursor2')

    document.addEventListener('mousemove', function (e) {
      cursor.style.transform = `translate3d(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%), 0)`
    })

    document.addEventListener('mousemove', function (e) {
      var x = e.clientX
      var y = e.clientY
      cursorinner.style.left = x + 'px'
      cursorinner.style.top = y + 'px'
    })

    document.addEventListener('mousedown', function () {
      cursor.classList.add('click')
      cursorinner.classList.add('cursorinnerhover')
    })

    document.addEventListener('mouseup', function () {
      cursor.classList.remove('click')
      cursorinner.classList.remove('cursorinnerhover')
    })

    const buttons = document.getElementsByTagName('button')
    for (let i = 0; i < buttons.length; i++) {
      buttons[i].style.cursor = 'none'
      buttons[i].addEventListener('mouseover', function () {
        cursor.classList.add('hover')
      })
      buttons[i].addEventListener('mouseout', function () {
        cursor.classList.remove('hover')
      })
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
        <meta name="twitter:title" content="Takuya Matsuyama" />
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
          width="50px"
          height="50px"
          borderRadius="full"
          border="1px solid #008080"
          transition="all .1s ease-out"
          position="fixed"
          pointerEvents="none"
          cursor="none"
          left="0"
          top="0"
          zIndex={999}
          transform={'translate(-50%, -50%)'}
        ></Box>
        <Box
          className="cursor2"
          width="20px"
          height="20px"
          borderRadius="full"
          backgroundColor="#008080"
          position="fixed"
          zIndex={999}
          cursor={'none'}
          transform={'translate(-50%, -50%)'}
          pointerEvents="none"
          transition="width .3s, height .3s, opacity .3s"
        ></Box>
        <Footer />
      </Container>
    </Box>
  )
}

export default Main
