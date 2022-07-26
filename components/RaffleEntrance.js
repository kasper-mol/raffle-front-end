import { useEffect, useState } from "react"
import { useWeb3Contract, useMoralis } from "react-moralis"
import { contractAbi, contractAddresses } from "../constants"
import { ethers } from 'ethers'
import { useNotification } from "web3uikit"

export default function RaffleEntrance() {
  const { chainId: chainIdHex, isWeb3Enabled } = useMoralis()
  const chainId = parseInt(chainIdHex)
  const raffleAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null
  const [entranceFee, setEntranceFee] = useState("0")
  const [numplayers, setNumplayers] = useState("0")
  const [recentWinner, setRecentWinner] = useState("0")
  const dispatch = useNotification()

  const { runContractFunction: enterRaffle, isLoading, isFetching } = useWeb3Contract({
    abi: contractAbi,
    contractAddress: raffleAddress,
    functionName: "enterRaffle",
    msgValue: entranceFee,
    params: {},
  })

  const { runContractFunction: getEntranceFee } = useWeb3Contract({
    abi: contractAbi,
    contractAddress: raffleAddress,
    functionName: "getEntranceFee",
    params: {},
  })

  const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
    abi: contractAbi,
    contractAddress: raffleAddress,
    functionName: "getNumberOfPlayers",
    params: {},
  })

  const { runContractFunction: getRecentWinner } = useWeb3Contract({
    abi: contractAbi,
    contractAddress: raffleAddress,
    functionName: "getRecentWinner",
    params: {},
  })

  useEffect(() => {
    if (isWeb3Enabled) {
      const updateUI = async () => {
        const entranceFeeFromCall = (await getEntranceFee()).toString()
        const numPlayersFromCall = (await getNumberOfPlayers()).toString()
        const recentWinnerFromCall = (await getRecentWinner()).toString()
        setEntranceFee(entranceFeeFromCall)
        setNumplayers(numPlayersFromCall)
        setRecentWinner(recentWinnerFromCall)
      }
      updateUI()
    }
  }, [isWeb3Enabled])

  const handleSucces = async (tx) => {
    await tx.wait(1)
    handleNewNotification(tx)
    updateUI()
  }

  const handleNewNotification = () => {
    dispatch({
      type: "info",
      message: "Transaction complete",
      title: "Tx Notification",
      position: "topR",
      icon: "bell"
    })
  }

  return (
    <div className="p-5">
      {raffleAddress ? (
        <div>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto" onClick={async () => {
            await enterRaffle({
              onSuccess: handleSucces,
              onError: (error) => console.log(error)
            })
          }} disabled={isLoading || isFetching}>
            {isLoading || isFetching ? (
              <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
            ) : (
              "Enter Raffle"
            )}
          </button> <br />
          Entrance Fee: {ethers.utils.formatUnits(entranceFee, "ether")} ETH<br />
          Number of players: {numplayers}<br />
          Recent Winner: {recentWinner}
        </div>
      ) : (
        <div>No raffle address detected</div>
      )}

    </div>
  )
}