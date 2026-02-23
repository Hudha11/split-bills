import React, { useState, useMemo } from "react";

function SplitBillApp() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [includeService, setIncludeService] = useState(true);
  const [editId, setEditId] = useState(null);

  const handleSubmit = () => {
    if (!name.trim() || !price || price <= 0) return;

    if (editId) {
      // UPDATE
      setItems(
        items.map((item) =>
          item.id === editId
            ? { ...item, name, price: parseFloat(price) }
            : item,
        ),
      );
      setEditId(null);
    } else {
      // ADD
      const newItem = {
        id: Date.now(),
        name,
        price: parseFloat(price),
      };
      setItems([...items, newItem]);
    }

    setName("");
    setPrice("");
  };

  const handleEdit = (item) => {
    setName(item.name);
    setPrice(item.price);
    setEditId(item.id);
  };

  const handleDelete = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const subtotal = useMemo(() => {
    return items.reduce((total, item) => total + item.price, 0);
  }, [items]);

  const tax = subtotal * 0.1;
  const service = includeService ? subtotal * 0.05 : 0;
  const grandTotal = subtotal + tax + service;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Split Bill Calculator</h2>

      {/* FORM */}
      <div style={styles.card}>
        <div style={styles.inputGroup}>
          <input
            type="text"
            placeholder="Nama Item"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={styles.input}
          />
          <input
            type="number"
            placeholder="Harga"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            style={styles.input}
          />
          <button onClick={handleSubmit} style={styles.button}>
            {editId ? "Update" : "Tambah"}
          </button>
        </div>

        <label style={styles.checkbox}>
          <input
            type="checkbox"
            checked={includeService}
            onChange={() => setIncludeService(!includeService)}
          />
          Gunakan Service 5%
        </label>
      </div>

      {/* ITEM LIST */}
      <div style={styles.card}>
        <h3>Daftar Item</h3>

        {items.length === 0 ? (
          <p style={{ color: "#888" }}>Belum ada item</p>
        ) : (
          items.map((item) => (
            <div key={item.id} style={styles.itemRow}>
              <div>
                <div>{item.name}</div>
                <div style={{ fontSize: 13, color: "#94a3b8" }}>
                  Rp {item.price.toLocaleString("id-ID")}
                </div>
              </div>

              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => handleEdit(item)} style={styles.editBtn}>
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  style={styles.deleteBtn}
                >
                  Hapus
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* SUMMARY */}
      <div style={styles.card}>
        <h3>Detail Pembayaran</h3>

        <div style={styles.summaryRow}>
          <span>Subtotal</span>
          <span>Rp {subtotal.toLocaleString("id-ID")}</span>
        </div>

        <div style={styles.summaryRow}>
          <span>Pajak (10%)</span>
          <span>Rp {tax.toLocaleString("id-ID")}</span>
        </div>

        {includeService && (
          <div style={styles.summaryRow}>
            <span>Service (5%)</span>
            <span>Rp {service.toLocaleString("id-ID")}</span>
          </div>
        )}

        <hr style={{ borderColor: "#334155", margin: "10px 0" }} />

        <div style={{ ...styles.summaryRow, fontWeight: "bold", fontSize: 18 }}>
          <span>Total</span>
          <span style={{ color: "#3b82f6" }}>
            Rp {grandTotal.toLocaleString("id-ID")}
          </span>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    padding: "40px 20px",
    borderRadius: "8px",
    background: "#0f172a",
    color: "#f1f5f9",
    fontFamily: "Inter, sans-serif",
  },
  title: {
    textAlign: "center",
    marginBottom: "30px",
  },
  card: {
    background: "#1e293b",
    padding: "20px",
    borderRadius: "12px",
    marginBottom: "20px",
  },
  inputGroup: {
    display: "flex",
    gap: "10px",
    marginBottom: "10px",
  },
  input: {
    flex: 1,
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #334155",
    background: "#0f172a",
    color: "#fff",
  },
  button: {
    padding: "10px 16px",
    borderRadius: "8px",
    border: "none",
    background: "#3b82f6",
    color: "white",
    cursor: "pointer",
    fontWeight: "bold",
  },
  editBtn: {
    padding: "6px 12px",
    borderRadius: "6px",
    border: "none",
    background: "#f59e0b",
    color: "white",
    cursor: "pointer",
  },
  deleteBtn: {
    padding: "6px 12px",
    borderRadius: "6px",
    border: "none",
    background: "#ef4444",
    color: "white",
    cursor: "pointer",
  },
  checkbox: {
    fontSize: "14px",
    color: "#cbd5e1",
  },
  itemRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 0",
    borderBottom: "1px solid #334155",
  },
  summaryRow: {
    display: "flex",
    justifyContent: "space-between",
    margin: "6px 0",
  },
};

export default SplitBillApp;
