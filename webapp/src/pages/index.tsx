// src/pages/index.tsx
import type { NextPage } from 'next'
import Head from 'next/head'
import { VStack, HStack, Heading, Box } from "@chakra-ui/layout"
import { Text } from '@chakra-ui/react'
import ConnectMetamask from 'components/ConnectMetamask'
import ETHBalanceSWR from 'components/ETHBalanceSWR'
import ReadERC721 from 'components/ReadERC721'
import CreateNFT from 'components/CreateNFT'
import { addressNFTContract, addressMarketContract } from '../projectsetting'
import ReadNFTMarket from 'components/ReadNFTMarket'

const Home: NextPage = () => {

  return (
    <>
      <Head>
        <title>My DAPP</title>
      </Head>

      <ConnectMetamask />

      <Box mb={0} p={4} w='100%' borderWidth="1px" borderRadius="lg">
        <Heading my={4} fontSize='xl'>ETH Balance</Heading>
        <ETHBalanceSWR />
      </Box>
      <Box my={4} p={4} w='100%' borderWidth="1px" borderRadius="lg">
        <Heading my={4} fontSize='xl'>ERC721 Smart Contract Info</Heading>
        <ReadERC721 addressContract={addressNFTContract} />
      </Box>
      <Box my={4} p={4} w='100%' borderWidth="1px" borderRadius="lg">
        <Heading my={4} fontSize='xl'>CreateNFT</Heading>
        <CreateNFT />
      </Box>
      <VStack>
        <Box mb={0} p={4} w='100%' borderWidth="1px" borderRadius="lg">
          <Heading my={4} fontSize='xl'>NFT Market - all</Heading>
          <ReadNFTMarket option={0} />
        </Box>

        <Box mb={0} p={4} w='100%' borderWidth="1px" borderRadius="lg">
          <Heading my={4} fontSize='xl'>NFT Market - my brought</Heading>
          <ReadNFTMarket option={1} />
        </Box>

        <Box mb={0} p={4} w='100%' borderWidth="1px" borderRadius="lg">
          <Heading my={4} fontSize='xl'>NFT Market - my created</Heading>
          <ReadNFTMarket option={2} />
        </Box>
      </VStack>
    </>
  )
}

export default Home
