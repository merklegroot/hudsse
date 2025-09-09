import Layout from '../../components/Layout'
import AddMessageButton from '../../components/AddMessageButton'
import SSEButton from '../../components/SSEButton'
import MessageList from '../../components/MessageList'

export default function Home() {
  return (
    <Layout title="Home" description="Home page">
      <main>
        <h1>Home</h1>
        <p>Welcome to the Home page!</p>
        <div className="space-x-4 mb-4">
          <AddMessageButton />
          <SSEButton />
        </div>
        <MessageList />
      </main>
    </Layout>
  )
}
