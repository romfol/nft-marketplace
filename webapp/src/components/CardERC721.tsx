import React, { useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'
import { Box, Text, Image } from '@chakra-ui/react'
import useSWR from 'swr'
import { ERC721ABI as abi } from "abi/ERC721ABI"
import { BigNumber } from 'ethers'
import { fetcher } from 'utils/fetcher'

interface Props {
  addressContract: string,
  tokenId: BigNumber
}

interface ItemInfo {
  name: string,
  description: string,
  imageURI: string
}

export default function CardERC721(props: Props) {
  const addressContract = props.addressContract
  const { account, active, library } = useWeb3React<Web3Provider>()

  const [itemInfo, setItemInfo] = useState<ItemInfo>()

  const { data: nftURI } = useSWR([addressContract, 'tokenURI', props.tokenId], {
    fetcher: fetcher(library, abi),
  })

  useEffect(() => {
    if (!nftURI) return

    fetch(nftURI)
      .then(res => res.json())
      .then(data => {
        // console.log('JSON! ', data)
        setItemInfo({
          "name": data.name,
          "description": data.description,
          "imageURI": data.image
        })
      })
      .catch(err => console.log(err));

  }, [nftURI])

  return (
    <Box my={2} bg='gray.100' borderRadius='md' width={220} height={260} px={3} py={4}>
      {itemInfo
        ? <Box>
          <Image src={itemInfo.imageURI} alt={itemInfo.name} width='200px' />
          <Text fontSize='xl' px={2} py={2}>{itemInfo.name}</Text>
          <Text fontSize='xl' px={2} py={2}>{itemInfo.description}</Text>
        </Box>
        : <Box />
      }
    </Box>
  )
}
