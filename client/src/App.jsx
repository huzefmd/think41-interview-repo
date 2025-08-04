import React, { useEffect, useState } from "react";

function App() {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setLoadingCustomers(true);
    fetch("http://localhost:5000/api")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch customers");
        return res.json();
      })
      .then((data) => {
        setCustomers(data);
        setFilteredCustomers(data);
        setLoadingCustomers(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoadingCustomers(false);
      });
  }, []);

  useEffect(() => {
    if (!selectedCustomer) return;
    setLoadingOrders(true);
    fetch(`http://localhost:5000/customer/${selectedCustomer.id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch orders");
        return res.json();
      })
      .then((data) => {
        setOrders(data.orders);
        setLoadingOrders(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoadingOrders(false);
      });
  }, [selectedCustomer]);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filtered = customers.filter(
      (c) =>
        c.first_name.toLowerCase().includes(term) ||
        c.last_name.toLowerCase().includes(term) ||
        (c.email && c.email.toLowerCase().includes(term)) ||
        (c.city && c.city.toLowerCase().includes(term))
    );
    setFilteredCustomers(filtered);
  }, [searchTerm, customers]);

  return (
    <div
      style={{
        padding: 20,
        fontFamily: "Arial, sans-serif",
        display: "flex",
        gap: "30px",
        height: "90vh",
      }}
    >
      {/* Left column - Customers with search */}
      <div style={{ width: "40%", overflowY: "auto" }}>
        <h1>Customers</h1>
        {error && <p style={{ color: "red" }}>{error}</p>}

        <input
          type="text"
          placeholder="Search by name, email, or city"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: "8px 12px",
            width: "100%",
            marginBottom: 20,
            borderRadius: 4,
            border: "1px solid #ccc",
            fontSize: 16,
          }}
        />

        {loadingCustomers ? (
          <p>Loading customers...</p>
        ) : filteredCustomers.length === 0 ? (
          <p>No customers found.</p>
        ) : (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 , }}>
            {filteredCustomers.map((cust) => (
              <div
                key={cust.id}
                onClick={() => {
                  setSelectedCustomer(cust);
                  setError(null);
                }}
                style={{
                  cursor: "pointer",
                  border:
                    selectedCustomer?.id === cust.id
                      ? "2px solid blue"
                      : "1px solid #ccc",
                  borderRadius: 8,
                  padding: 15,
                  width: 250,
                  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                  backgroundColor:
                    selectedCustomer?.id === cust.id ? "#e6f0ff" : "#fff",
                  userSelect: "none",
                  transition: "background-color 0.3s, border-color 0.3s",
                }}
              >
                <h3>
                  {cust.first_name} {cust.last_name}
                </h3>
                <p>
                  <strong>Email:</strong> {cust.email}
                </p>
                <p>
                  <strong>City:</strong> {cust.city}, {cust.state}
                </p>
                <p>
                  <strong>Age:</strong> {cust.age}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right column - Orders */}
      <div
        style={{
          width: "60%",
          overflowY: "auto",
          borderLeft: "1px solid #ccc",
          paddingLeft: 20,
        }}
      >
        {selectedCustomer ? (
          <>
            <h2>Orders for {selectedCustomer.first_name}</h2>
            {loadingOrders ? (
              <p>Loading orders...</p>
            ) : orders.length === 0 ? (
              <p>No orders found.</p>
            ) : (
              <table
                border="1"
                cellPadding="5"
                cellSpacing="0"
                style={{ width: "100%", borderCollapse: "collapse" }}
              >
                <thead>
                  <tr style={{ backgroundColor: "#f0f0f0" }}>
                    <th>Order ID</th>
                    <th>Status</th>
                    <th>Gender</th>
                    <th>Number of Items</th>
                    <th>Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.order_id}>
                      <td>{order.order_id}</td>
                      <td>{order.status}</td>
                      <td>{order.gender}</td>
                      <td>{order.num_of_item}</td>
                      <td>{new Date(order.created_at).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        ) : (
          <p>Select a customer to see orders.</p>
        )}
      </div>
    </div>
  );
}

export default App;
