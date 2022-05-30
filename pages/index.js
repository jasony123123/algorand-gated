import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import styles from '../styles/Home.module.css'
import { useState } from 'react';

export default function Home() {
  const [assetId, setAssetId] = useState('');
  return (
    <div className={styles.container}>
      <Head>
        <title> Algorand ASA Gated Voting</title>
        <meta name="description" content="Gated Voting Beta with Algorand ASAs" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Algorand ASA Gated Voting Beta
        </h1>

        <h2>
          Get started by looking at {
            <Link href={"https://testnet.algoexplorer.io/assets"}>
              <a>ASA List</a>
            </Link>
          } and entering an asset ID below:
        </h2>


        <input
          type="text"
          value={assetId}
          onChange={e => { setAssetId(e.currentTarget.value); }}
        />

        <Link href={`/asa-voting-dashboard/?asset=${assetId}`}>
          <a className={styles.card}>
            <h2>Go to Vote! &rarr;</h2>
            <p> Voting dashboard for current referendum results. And if you own the asset, you can vote too.</p>
          </a>
        </Link>

      </main >

      <footer className={styles.footer}>
        <a href="https://nextjs.org" target="_blank" rel="noopener noreferrer">
          Built with Next.js | Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div >
  )
}
