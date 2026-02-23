import { useState } from "react";
import "./SplitBillsApp.css";

interface Item {
  id: number;
  name: string;
  price: number;
}

export default function SplitBillsApp() {
  const [items, setItems] = useState<Item[]>([]);
  const [name, setName] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [useService, setUseService] = useState<boolean>(true);
  const [editingId, setEditingId] = useState<number | null>(null);

  const handleAddOrUpdate = () => {
    if (!name || price <= 0) return;

    if (editingId !== null) {
      setItems((prev) =>
        prev.map((item) =>
          item.id === editingId ? { ...item, name, price } : item,
        ),
      );
      setEditingId(null);
    } else {
      const newItem: Item = {
        id: Date.now(),
        name,
        price,
      };
      setItems((prev) => [...prev, newItem]);
    }

    setName("");
    setPrice(0);
  };

  const handleEdit = (item: Item) => {
    setName(item.name);
    setPrice(item.price);
    setEditingId(item.id);
  };

  const handleDelete = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const subtotal = items.reduce((acc, item) => acc + item.price, 0);
  const tax = subtotal * 0.1;
  const service = useService ? subtotal * 0.05 : 0;
  const total = subtotal + tax + service;

  return (
    <div className="container">
      <h1>Split Bill Calculator</h1>

      <div className="card">
        <div className="input-group">
          <input
            type="text"
            placeholder="Nama Item"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="number"
            placeholder="Harga"
            value={price || ""}
            onChange={(e) => setPrice(Number(e.target.value))}
          />
          <button onClick={handleAddOrUpdate}>
            {editingId ? "Update" : "Tambah"}
          </button>
        </div>

        <div className="service-toggle">
          <span>Pakai Service 5%</span>
          <label className="switch">
            <input
              type="checkbox"
              checked={useService}
              onChange={() => setUseService(!useService)}
            />
            <span className="slider"></span>
          </label>
        </div>
      </div>

      <div className="card">
        <h2>Daftar Item</h2>
        {items.length === 0 && <p className="empty">Belum ada item</p>}

        {items.map((item) => (
          <div key={item.id} className="item-row">
            <div>
              <strong>{item.name}</strong>
              <p>Rp {item.price.toLocaleString()}</p>
            </div>
            <div className="actions">
              <button className="edit" onClick={() => handleEdit(item)}>
                Edit
              </button>
              <button className="delete" onClick={() => handleDelete(item.id)}>
                Hapus
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <h2>Ringkasan</h2>

        <div className="summary-row">
          <span>Subtotal</span>
          <span>Rp {subtotal.toLocaleString()}</span>
        </div>

        <div className="summary-row">
          <span>Pajak (10%)</span>
          <span>Rp {tax.toLocaleString()}</span>
        </div>

        {useService && (
          <div className="summary-row">
            <span>Service (5%)</span>
            <span>Rp {service.toLocaleString()}</span>
          </div>
        )}

        <hr />

        <div className="summary-row total">
          <span>Total</span>
          <span>Rp {total.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
