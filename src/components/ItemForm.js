import { useState, useEffect } from "react";

export default function ItemForm({ addItem, editingItem }) {
  const [name, setName] = useState("");
  const [qty, setQty] = useState("");
  const [price, setPrice] = useState("");

  useEffect(() => {
    if (editingItem) {
      setName(editingItem.name);
      setQty(editingItem.qty);
      setPrice(editingItem.price);
    }
  }, [editingItem]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) return;

    // ✅ Use addItem for both add and edit
    addItem({ name, qty, price });

    setName("");
    setQty("");
    setPrice("");
  };

  return (
    <form className="item-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Item name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="number"
        placeholder="Quantity"
        value={qty}
        onChange={(e) => setQty(e.target.value)}
      />
      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <button type="submit">{editingItem ? "Update Item" : "Add Item"}</button>
    </form>
  );
}
