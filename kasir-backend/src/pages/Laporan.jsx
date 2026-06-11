function Laporan() {
const dataLaporan = [
{
id: "TRX001",
tanggal: "2026-06-01",
pelanggan: "Budi",
total: 25000,
},
{
id: "TRX002",
tanggal: "2026-06-01",
pelanggan: "Siti",
total: 50000,
},
{
id: "TRX003",
tanggal: "2026-06-02",
pelanggan: "Andi",
total: 75000,
},
{
id: "TRX004",
tanggal: "2026-06-02",
pelanggan: "Rina",
total: 40000,
},
];

const totalPendapatan = dataLaporan.reduce(
(total, item) => total + item.total,
0
);

return ( <div className="container mt-4">


  <h2 className="mb-4">
    Laporan Penjualan
  </h2>

  <div className="card shadow border-0 mb-4">
    <div className="card-body">

      <h4>
        Total Pendapatan
      </h4>

      <h2 className="text-success">
        Rp {totalPendapatan.toLocaleString("id-ID")}
      </h2>

    </div>
  </div>

  <div className="card shadow border-0">
    <div className="card-body">

      <table className="table table-bordered table-striped">

        <thead className="table-dark">
          <tr>
            <th>No</th>
            <th>ID Transaksi</th>
            <th>Tanggal</th>
            <th>Pelanggan</th>
            <th>Total</th>
          </tr>
        </thead>

        <tbody>
          {dataLaporan.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{item.id}</td>
              <td>{item.tanggal}</td>
              <td>{item.pelanggan}</td>
              <td>
                Rp {item.total.toLocaleString("id-ID")}
              </td>
            </tr>
          ))}
        </tbody>

      </table>

    </div>
  </div>

</div>


);
}

export default Laporan;
