import Link from 'next/link'
import styles from '../styles/Home.module.css'
import { useState } from 'react';
import { useRouter } from "next/router";
import { Bar } from "react-chartjs-2";
import useSWR, { useSWRConfig } from 'swr'
import Error from 'next/error'
import Chart from 'chart.js/auto';

const fetcher = (...args) => fetch(...args).then((res) => res.json())

export default function PageWithJSbasedForm() {
  const { query } = useRouter();

  const [walletAddress, setWalletAddress] = useState(null);
  // const { data, error } = useSWR(`/api/data/${query.asset}`, fetcher)
  const { data, error } = useSWR(query ? `/api/data/${query.asset}` : null, query ? fetcher : null);

  const { mutate } = useSWRConfig()

  if (!query.asset)
    return (<Error statusCode={404} />)
  if (error || !data)
    return (<Error statusCode={500} />);
  if (!data)
    return (<p> Loading... </p>);

  const DataViewer = () => {
    console.log(data);
    return (
      <div style={{ maxWidth: "650px" }}>
        <Bar
          data={{
            labels: ["Yes Votes", "No Votes", "Abstained"],
            datasets: [
              {
                data: [data.yesCount, data.noCount, data.abstainCount],
                backgroundColor: ["green", "red", "blue"],
              },
            ],
          }}
          height={300}
          options={{
            plugins: {
              legend: {
                display: false
              }
            },
            maintainAspectRatio: false,
          }}
        />
      </div>
    )
  }

  const connectWallet = async (event) => {
    event.preventDefault();
    // Check that AlgoSigner is installed
    if (typeof AlgoSigner !== 'undefined') {
      window.AlgoSigner.connect()
        .then(() => window.AlgoSigner.accounts({
          ledger: 'TestNet'
        }))
        .then((accountData) => {
          setWalletAddress(accountData[0].address);
        })
        .catch((e) => {
          console.error(e);
        });
    }
  }

  const getDispWalletAddress = () => {
    if (walletAddress === null) {
      return "Click to connect wallet";
    } else {
      return "Wallet connected: " + walletAddress.substring(0, 5) + "..." + walletAddress.substring(walletAddress.length - 5);
    }
  }

  const GetSelectionChoice = () => {
    if (walletAddress === null) {
      return (<div>Connect wallet first to access gated voting.</div>)
    } else {
      if (!data.holders.includes(walletAddress)) {
        return (<div>This wallet does not own the asset, and cannot vote.</div>)
      } else {

        const handleSubmit = async (event) => {
          event.preventDefault()
          console.log(event.target.vote.value);
          const data = {
            asset: query.asset,
            wallet: walletAddress,
            vote: event.target.vote.value,
          }
          const JSONdata = JSON.stringify(data)
          const endpoint = '/api/submit-vote'
          const options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSONdata,
          }
          const response = await fetch(endpoint, options)
          const result = await response.json()
          console.log(result);
          mutate(`/api/data/${query.asset}`)
        }

        return (
          <div>
            <form onSubmit={handleSubmit}>
              <div>
                <input type="radio" value="Yes" name="vote" /> Vote Yes
                <p />
                <input type="radio" value="No" name="vote" /> Vote No
                <p />
              </div>
              <button type="submit">Submit Vote</button>
            </form>
          </div>
        )
      }
    }
  }

  return (
    <div className="container">
      <h1 className={styles.title}>
        Gated voting for {
          <Link href={`https://testnet.algoexplorer.io/asset/${query.asset}`}>
            <a>Algorand Asset {`${query.asset}`}</a>
          </Link>
        }
      </h1>

      <p />

      <DataViewer />

      <div className={styles.grid}>
        <button onClick={connectWallet}>
          {getDispWalletAddress()}
        </button>
      </div>

      <div style={{ maxWidth: "400px" }}>
        <GetSelectionChoice />
      </div>
    </div >
  )
}