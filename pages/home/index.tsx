import Layout from '../../components/Layout'
import AddMessageButton from '../../components/AddMessageButton'
import MessageList from '../../components/MessageList'

export default function Home() {
  return (
    <Layout title="Home" description="Home page">
      <main>
        <h1>Home</h1>
        <p>Welcome to the Home page!</p>
        <AddMessageButton />
        <MessageList />
      </main>
    </Layout>
  )
}
