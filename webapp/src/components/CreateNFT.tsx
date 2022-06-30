import { useState, useEffect } from 'react'
import { Stack, Spinner, Button, Image, Input, InputGroup, Text } from "@chakra-ui/react"
import { ethers } from 'ethers'
import { create as ipfsHttpClient } from 'ipfs-http-client'
import { useWeb3React } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'
import { Contract } from "@ethersproject/contracts";
import { addressMarketContract, addressNFTContract } from '../projectsetting'
import abiNFToken from '../../../blockchain/artifacts/contracts/NFToken.sol/NFToken.json'
import abiNFTMarketplace from '../../../blockchain/artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json'


const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

export default function CreateItem() {
    const { account, active, library } = useWeb3React<Web3Provider>()
    const [fileUrl, setFileUrl] = useState(null)
    const [formInput, updateFormInput] = useState({ price: '', name: '', description: '' })
    const [NFTId, setNFTId] = useState(0)
    const [isApprove, setApprove] = useState(false)
    const [isCreatingMarketItem, setCreatingMarketItem] = useState(false)
    const [isListingForSale, setListingForSale] = useState(false)

    const market: Contract = new Contract(addressMarketContract, abiNFTMarketplace.abi, library?.getSigner())
    const nft: Contract = new Contract(addressNFTContract, abiNFToken.abi, library?.getSigner())

    useEffect(() => {
        if (!(active && account && library)) return
        // listen for changes on an Ethereum address
        console.log(`listening for ERC721 Transfer...`)

        const fromMe = nft.filters.Transfer(account, null)
        nft.on(fromMe, (from, to, tokenId, event) => {
            console.log('Transfer|sent', { from, to, tokenId, event })
            // mutate(undefined, true)
        })

        const toMe = nft.filters.Transfer(null, account)
        nft.on(toMe, (from, to, tokenId, event) => {
            console.log('Transfer|received', { from, to, tokenId, event })
            const NFTId = parseInt(tokenId.toString());
            setNFTId(NFTId)
            approveNFT(NFTId);
        })

        const approveToMarket = nft.filters.Approval(account, addressMarketContract)
        nft.on(approveToMarket, (exOwner, newOwner, tokenId, event) => {
            console.log('Approval', { exOwner, newOwner, tokenId, event })
            setApprove(true);
        })

        const сreateMarketItem = market.filters.MarketItemCreated()
        market.on(сreateMarketItem, () => {
            console.log('MarketItemCreated')
            setCreatingMarketItem(false);
            updateFormInput(({ price: '', name: '', description: '' }))
            setFileUrl(null)
            setListingForSale(false)
        })

        // remove listener when the component is unmounted
        return () => {
            nft.removeAllListeners(fromMe)
            nft.removeAllListeners(toMe)
            nft.removeAllListeners(approveToMarket)
            market.removeAllListeners(сreateMarketItem)
        }

        // trigger the effect only on component mount
    }, [active, account])

    async function onChange(e) {
        /* upload image to IPFS */
        const file = e.target.files[0]
        try {
            const added = await client.add(
                file,
                {
                    progress: (prog) => console.log(`received: ${prog}`)
                }
            )
            const url = `https://ipfs.infura.io/ipfs/${added.path}`
            console.log("fileUrl", url);
            setFileUrl(url)
        } catch (error) {
            console.log('Error uploading file: ', error)
        }
    }

    async function uploadToIPFS() {
        const { name, description } = formInput
        if (!name || !description || !fileUrl) return
        /* first, upload metadata to IPFS */
        const data = JSON.stringify({
            name, description, image: fileUrl
        })
        try {
            const added = await client.add(data)
            const url = `https://ipfs.infura.io/ipfs/${added.path}`
            /* after metadata is uploaded to IPFS, return the URL to use it in the transaction */
            return url
        } catch (error) {
            console.log('Error uploading file: ', error)
        }
    }

    async function createNFT() {
        const url = await uploadToIPFS()
        console.log("ipfs url", url)

        await nft.safeMint(account, url)
        setCreatingMarketItem(true);
    }

    async function approveNFT(NFTId: number) {
        await nft.approve(addressMarketContract, NFTId)
    }

    async function listNFTForSale() {
        const price = ethers.utils.parseUnits(formInput.price, 'ether')
        await market.createMarketItem(
            addressNFTContract,
            NFTId,
            price
        )
        setListingForSale(true)
    }

    return (
        <Stack spacing={3}>
            {!isApprove || !isCreatingMarketItem ?
                <>
                    <InputGroup>
                        <Input
                            placeholder="Asset Name"
                            onChange={e => updateFormInput({ ...formInput, name: e.target.value })}
                        />
                        <Input
                            placeholder="Asset Description"
                            onChange={e => updateFormInput({ ...formInput, description: e.target.value })}
                        />
                        <Input
                            type="file"
                            // name="Asset"
                            onChange={onChange}
                        />
                    </InputGroup>
                    {
                        fileUrl && (
                            <Image className="rounded mt-4" width="350" src={fileUrl} />
                        )
                    }
                    <Button onClick={createNFT} isLoading={isCreatingMarketItem && !isApprove}>
                        Create
                    </Button>
                </> :
                <>
                    <Text>NFTCreated!<br />List for sale on marketplace?</Text>
                    <Input
                        placeholder="Asset Price in Eth"
                        className="mt-2 border rounded p-4"
                        onChange={e => updateFormInput({ ...formInput, price: e.target.value })}
                    />
                    <Button isLoading={isListingForSale} onClick={listNFTForSale}>Yes</Button></>}
        </Stack>


    )
}

