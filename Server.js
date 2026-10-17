app.post("/api/quote", (req, res) => res.json({ pricing: agents.pricing.run(req.body.items || []), inventory: agents.inventory.run(req.body.items || []) }));
app.post("/api/support", (req, res) => res.json(agents.support.run(req.body.message || "")));
app.post("/api/checkout", (req, res) => {
  const items = req.body.items || [];
  const inventory = agents.inventory.run(items);
  const pricing = agents.pricing.run(items);
  if (!items.length) return res.status(400).json({ error: "Your cart is empty." });
  if (!inventory.ok) return res.status(409).json({ error: inventory.message, inventory });
  const orderId = "DEMO-" + Date.now().toString(36).toUpperCase();
  res.status(201).json({ orderId, status: "Demo order created", pricing, note: "No payment was taken. This is a demonstration checkout." });
});

app.get("*", (_req, res) => res.sendFile(path.join(__dirname, "public", "index.html")));
// Vercel imports this Express app as a serverless function.
module.exports = app;

// Keep local development working with `npm start`.
if (require.main === module) {
  app.listen(PORT, () => console.log(`Multi-Agent E-Commerce System running on port ${PORT}`));
}

