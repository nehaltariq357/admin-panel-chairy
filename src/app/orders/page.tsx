"use client"
import { useState, useEffect } from "react"
import { client } from "../../sanity/lib/client"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"

const MySwal = withReactContent(Swal)

interface Order {
  _id: string
  customerName: string
  email: string
  phone: string
  address: string
  city: string
  orderDate: string
  totalAmount: number
  items: {
    title: string
    quantity: number
    price: number
  }[]
  status: string
}

async function getOrders(): Promise<Order[]> {
  return await client.fetch(`
    *[_type == "order"]{
      _id,
      customerName,
      email,
      phone,
      address,
      city,
      orderDate,
      totalAmount,
      items[]->{
        title,
        quantity,
        price
      },
      status
    }
  `)
}

async function deleteOrder(orderId: string) {
  try {
    await client.delete(orderId)
    return true
  } catch (error) {
    console.error("Error deleting order:", error)
    return false
  }
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [isSignup, setIsSignup] = useState<boolean>(false)

  useEffect(() => {
    async function fetchOrders() {
      const data = await getOrders()
      setOrders(data)
    }
    fetchOrders()
  }, [])

  useEffect(() => {
    const storedUser = localStorage.getItem("adminUser")
    if (storedUser) {
      setIsLoggedIn(true)
    }
  }, [])

  const handleAuth = () => {
    if (email === "admin123@gmail.com" && password === "admin123") {
      localStorage.setItem("adminUser", email)
      setIsLoggedIn(true)
    } else {
      MySwal.fire("Error", "Invalid credentials", "error")
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("adminUser")
    setIsLoggedIn(false)
  }

  const handleDelete = async (orderId: string) => {
    MySwal.fire({
      title: "Are you sure?",
      text: "You won't be able to recover this order!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        const success = await deleteOrder(orderId)
        if (success) {
          setOrders(orders.filter((order) => order._id !== orderId))
          MySwal.fire("Deleted!", "The order has been deleted.", "success")
        } else {
          MySwal.fire("Error", "Failed to delete the order. Try again!", "error")
        }
      }
    })
  }

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg w-96">
          <h2 className="text-2xl font-bold mb-4 text-center">
            {isSignup ? "Sign Up" : "Login"}
          </h2>
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 border border-gray-300 rounded mb-3"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 border border-gray-300 rounded mb-3"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            onClick={handleAuth}
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
          >
            {isSignup ? "Sign Up" : "Login"}
          </button>
          <p className="text-center mt-4">
            {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
            <span
              className="text-blue-500 cursor-pointer"
              onClick={() => setIsSignup(!isSignup)}
            >
              {isSignup ? "Login" : "Sign Up"}
            </span>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Orders</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm transition-all duration-300"
        >
          Logout
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="py-3 px-4">Customer Name</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Phone</th>
              <th className="py-3 px-4">Address</th>
              <th className="py-3 px-4">City</th>
              <th className="py-3 px-4">Order Date</th>
              <th className="py-3 px-4">Total Amount</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="border-b hover:bg-gray-100">
                <td className="py-3 px-4">{order.customerName || "Nehal"}</td>
                <td className="py-3 px-4">{order.email}</td>
                <td className="py-3 px-4">{order.phone}</td>
                <td className="py-3 px-4">{order.address}</td>
                <td className="py-3 px-4">{order.city}</td>
                <td className="py-3 px-4">
                  {new Date(order.orderDate).toLocaleDateString()}
                </td>
                <td className="py-3 px-4 font-semibold">
                {order.totalAmount ? order.totalAmount.toFixed(2) : "0.00"}
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`px-3 py-1 rounded-full text-white text-sm ${
                      order.status === "Pending"
                        ? "bg-yellow-500"
                        : order.status === "Completed"
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-center">
                  <button
                    onClick={() => handleDelete(order._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm transition-all duration-300"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
