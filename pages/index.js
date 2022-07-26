import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Header from '../components/Header'
import RaffleEntrance from '../components/RaffleEntrance'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Smart Contract Raffle</title>
        <meta name="description" content="My Smart Contract Lottery" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <RaffleEntrance />
    </div>
  )
}
