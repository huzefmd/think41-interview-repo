import express from "express";
import supabase from "../supabase.js";

const router = express.Router();

// Get all orders for a specific customer
router.get("/customer/:customerId", async (req, res) => {
  const customerId = req.params.customerId;

  // Optional: Check if customer exists
  const { data: customer, error: customerError } = await supabase
    .from("users")
    .select("*")
    .eq("id", customerId)
    .single();

  if (customerError || !customer) {
    return res.status(404).json({ error: "Customer not found" });
  }

  // Fetch all orders for the customer using user_id column
  const { data: orders, error: ordersError } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", customerId);

  if (ordersError) {
    return res.status(500).json({ error: ordersError.message });
  }

  res.json({
    customer,
    orders,
  });
});

export default router;
