import {
  Building2,
  Search,
  Plus,
  Pencil,
  Trash2,
  School,
  MapPin,
} from "lucide-react";

export default function SuperadminManajemenOPD() {
  return (
    <div
      style={{
        width: "100%",
        overflowX: "hidden",
      }}
    >
      {/* ========================= */}
      {/* HEADER */}
      {/* ========================= */}

      <div
        className="flex items-start justify-between mb-6"
        style={{
          gap: "18px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "clamp(24px,4vw,32px)",
              fontWeight: 800,
              marginBottom: "8px",
              lineHeight: 1.2,
            }}
          >
            Manajemen OPD
          </h1>

          <p
            className="text-muted"
            style={{
              fontSize: "14px",
              lineHeight: 1.7,
              maxWidth: "760px",
            }}
          >
            Kelola data Organisasi Perangkat Daerah
            (OPD), jumlah sekolah binaan, serta
            informasi wilayah monitoring UKS.
          </p>
        </div>

        <button className="btn btn-primary">
          <Plus size={18} />
          Tambah OPD
        </button>
      </div>

      {/* ========================= */}
      {/* STATISTIC */}
      {/* ========================= */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(240px,1fr))",
          gap: "22px",
          marginBottom: "28px",
        }}
      >
        <StatCard
          icon={<Building2 size={24} />}
          title="Total OPD"
          value="15"
          bg="var(--accent-glow)"
          color="var(--secondary)"
        />

        <StatCard
          icon={<School size={24} />}
          title="Sekolah Terdaftar"
          value="1,450"
          bg="#EEF2FF"
          color="#4338CA"
        />

        <StatCard
          icon={<MapPin size={24} />}
          title="Wilayah Aktif"
          value="12"
          bg="#FEF3C7"
          color="#D97706"
        />
      </div>

      {/* ========================= */}
      {/* TABLE CARD */}
      {/* ========================= */}

      <div
        className="card glass-panel"
        style={{
          padding: "28px",
          borderRadius: "28px",
          overflow: "hidden",
        }}
      >
        {/* HEADER TABLE */}
        <div
          className="flex items-start justify-between mb-6"
          style={{
            gap: "18px",
            flexWrap: "wrap",
          }}
        >
          <div>
            <h3
              style={{
                fontSize: "24px",
                fontWeight: 700,
                marginBottom: "6px",
              }}
            >
              Data OPD
            </h3>

            <p
              className="text-muted"
              style={{
                fontSize: "13px",
              }}
            >
              Monitoring dan pengelolaan seluruh OPD
            </p>
          </div>

          {/* SEARCH */}
          <div
            style={{
              position: "relative",
              width: "100%",
              maxWidth: "320px",
            }}
          >
            <Search
              size={18}
              style={{
                position: "absolute",
                left: "16px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--text-muted)",
              }}
            />

            <input
              type="text"
              placeholder="Cari nama OPD..."
              style={{
                width: "100%",
                height: "52px",
                borderRadius: "16px",
                border:
                  "1px solid var(--border)",
                background: "var(--card-bg)",
                paddingLeft: "48px",
                paddingRight: "18px",
                outline: "none",
                fontSize: "14px",
              }}
            />
          </div>
        </div>

        {/* TABLE */}
        <div
          style={{
            width: "100%",
            overflowX: "auto",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              minWidth: "980px",
            }}
          >
            <thead>
              <tr
                style={{
                  background: "var(--bg-light)",
                }}
              >
                <TableHead>Kode OPD</TableHead>
                <TableHead>Nama OPD</TableHead>
                <TableHead>Total Sekolah</TableHead>
                <TableHead>Alamat</TableHead>
                <TableHead>Aksi</TableHead>
              </tr>
            </thead>

            <tbody>
              <TableRow
                kode="OPD-001"
                nama="Dinas Kesehatan Sukamaju"
                sekolah="245"
                alamat="Jl. Merdeka No.12 Sukamaju"
              />

              <TableRow
                kode="OPD-002"
                nama="Dinas Pendidikan Nusantara"
                sekolah="186"
                alamat="Jl. Pendidikan Raya No.8"
              />

              <TableRow
                kode="OPD-003"
                nama="Diskominfo Kabupaten"
                sekolah="312"
                alamat="Jl. Teknologi No.15"
              />

              <TableRow
                kode="OPD-004"
                nama="Dinas Kesehatan Barat"
                sekolah="154"
                alamat="Jl. Kesehatan Barat No.20"
              />

              <TableRow
                kode="OPD-005"
                nama="Dinas Pendidikan Timur"
                sekolah="221"
                alamat="Jl. Pendidikan Timur No.5"
              />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ========================= */
/* STAT CARD */
/* ========================= */

function StatCard({
  icon,
  title,
  value,
  bg,
  color,
}) {
  return (
    <div
      className="card"
      style={{
        padding: "24px",
        borderRadius: "26px",
        border: "1px solid var(--border)",
      }}
    >
      <div
        style={{
          width: "60px",
          height: "60px",
          borderRadius: "18px",
          background: bg,
          color: color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "18px",
        }}
      >
        {icon}
      </div>

      <div
        className="text-muted"
        style={{
          fontSize: "14px",
          marginBottom: "8px",
        }}
      >
        {title}
      </div>

      <div
        style={{
          fontSize: "30px",
          fontWeight: 800,
          lineHeight: 1.1,
        }}
      >
        {value}
      </div>
    </div>
  );
}

/* ========================= */
/* TABLE HEAD */
/* ========================= */

function TableHead({ children }) {
  return (
    <th
      style={{
        textAlign: "left",
        padding: "18px",
        fontSize: "14px",
        fontWeight: 700,
        color: "var(--text-main)",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </th>
  );
}

/* ========================= */
/* TABLE ROW */
/* ========================= */

function TableRow({
  kode,
  nama,
  sekolah,
  alamat,
}) {
  return (
    <tr
      style={{
        borderBottom:
          "1px solid var(--border)",
      }}
    >
      <td style={tdStyle}>
        <div
          style={{
            fontWeight: 700,
            color: "var(--primary)",
            whiteSpace: "nowrap",
          }}
        >
          {kode}
        </div>
      </td>

      <td style={tdStyle}>
        <div
          style={{
            fontWeight: 600,
            minWidth: "220px",
          }}
        >
          {nama}
        </div>
      </td>

      <td style={tdStyle}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            padding: "8px 14px",
            borderRadius: "999px",
            background: "#EEF2FF",
            color: "#4338CA",
            fontWeight: 700,
            fontSize: "13px",
            whiteSpace: "nowrap",
          }}
        >
          <School size={15} />
          {sekolah} Sekolah
        </div>
      </td>

      <td style={tdStyle}>
        <div
          style={{
            minWidth: "260px",
            lineHeight: 1.7,
          }}
        >
          {alamat}
        </div>
      </td>

      <td style={tdStyle}>
        <div
          style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
          }}
        >
          <button className="btn btn-outline">
            <Pencil size={16} />
            Edit
          </button>

          <button
            className="btn"
            style={{
              background: "#FEF2F2",
              color: "#DC2626",
              border:
                "1px solid #FECACA",
            }}
          >
            <Trash2 size={16} />
            Hapus
          </button>
        </div>
      </td>
    </tr>
  );
}

/* ========================= */
/* TD STYLE */
/* ========================= */

const tdStyle = {
  padding: "18px",
  fontSize: "14px",
  verticalAlign: "middle",
};