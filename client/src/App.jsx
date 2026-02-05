import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Browse from './pages/Browse'
import ItemDetail from './pages/ItemDetail'
import ListItem from './pages/ListItem'
import About from './pages/About'
import Checkout from './pages/Checkout'
import OrderSuccess from './pages/OrderSuccess'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="browse" element={<Browse />} />
        <Route path="item/:id" element={<ItemDetail />} />
        <Route path="list" element={<ListItem />} />
        <Route path="about" element={<About />} />
        <Route path="checkout/:id" element={<Checkout />} />
        <Route path="order/success" element={<OrderSuccess />} />
      </Route>
    </Routes>
  )
}
