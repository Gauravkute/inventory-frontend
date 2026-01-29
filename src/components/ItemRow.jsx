export default function ItemRow({ item, deleteItem, setEditingItem }) {
  const qty = Number(item.qty);

  let statusClass = "badge healthy";
  let rowClass = "";
  if (qty < 5) {
    statusClass = "badge low";
    rowClass = "low-stock-row";
  } else if (qty < 20) {
    statusClass = "badge medium";
  }

  const priceInRupees = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(item.price);

  return (
    <tr className={rowClass}>
      <td>{item.name}</td>
      <td>
        <span className={statusClass}>{qty}</span>
      </td>
      <td>{priceInRupees}</td>
      <td>
        <button className="edit-btn" onClick={() => setEditingItem(item)}>
          ✏️ Edit
        </button>
        <button className="delete-btn" onClick={() => deleteItem(item._id)}>
          ❌ Delete
        </button>
      </td>
    </tr>
  );
}
