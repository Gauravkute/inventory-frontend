import { useState, useEffect } from "react";
import DashboardCards from "./components/DashboardCards";
import ItemForm from "./components/ItemForm";
import ItemTable from "./components/ItemTable";
import { getItems, addItem, updateItem, deleteItem } from "./api";

export default function AppDashboard() {
  const [items, setItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // 🟢 Fetch items from backend on load
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await getItems();
        setItems(res.data);
      } catch (err) {
        console.error("Error fetching items:", err);
        alert("⚠️ Failed to connect to backend. Please start your server.");
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  // 🟢 Add or update item
  const handleAddOrUpdate = async (item) => {
    try {
      if (editingItem) {
        const res = await updateItem(editingItem._id, item);
        setItems(items.map((i) => (i._id === editingItem._id ? res.data : i)));
        setEditingItem(null);
      } else {
        const res = await addItem(item);
        setItems([...items, res.data]);
      }
    } catch (err) {
      console.error("Error saving item:", err);
      alert("❌ Failed to save item.");
    }
  };

  // 🟢 Delete item
  const handleDelete = async (id) => {
    try {
      await deleteItem(id);
      setItems(items.filter((i) => i._id !== id));
    } catch (err) {
      console.error("Error deleting item:", err);
      alert("❌ Failed to delete item.");
    }
  };

  // 🟢 Clear all (optional)
  const clearAll = async () => {
    if (window.confirm("Are you sure you want to clear all inventory?")) {
      try {
        const promises = items.map((i) => deleteItem(i._id));
        await Promise.all(promises);
        setItems([]);
      } catch (err) {
        alert("Failed to clear all items");
      }
    }
  };

  // 🟢 Search filter
  const filteredItems = items.filter((i) =>
    i.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="container">
        <h1>📦 Manage Inventory</h1>

        <DashboardCards items={items} />

        <button className="clear-btn" onClick={clearAll}>
          🗑️ Clear All Inventory
        </button>

        <input
          type="text"
          placeholder="Search item..."
          className="search-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <ItemForm addItem={handleAddOrUpdate} editingItem={editingItem} />
        {loading ? (
          <p>Loading...</p>
        ) : (
          <ItemTable
            items={filteredItems}
            deleteItem={handleDelete}
            setEditingItem={setEditingItem}
          />
        )}
      </div>
    </div>
  );
}
