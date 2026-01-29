import ItemRow from "./ItemRow";

export default function ItemTable({ items, deleteItem, setEditingItem }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Qty</th>
          <th>Price</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {items.length > 0 ? (
          items.map((i) => (
            <ItemRow
              key={i._id}
              item={i}
              deleteItem={deleteItem}
              setEditingItem={setEditingItem}
            />
          ))
        ) : (
          <tr>
            <td colSpan="4">No items found</td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
