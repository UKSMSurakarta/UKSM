import {
  School,
  Search,
  Plus,
  Pencil,
  Trash2,
  Building2,
  GraduationCap,
  User2,
} from "lucide-react";

export default function SuperadminSekolah() {
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
            Manajemen Sekolah
          </h1>

          <p
            className="text-muted"
            style={{
              fontSize: "14px",
              lineHeight: 1.7,
              maxWidth: "760px",
            }}
          >
            Kelola data sekolah, jenjang pendidikan,
            kepala sekolah, serta OPD wilayah yang
            terhubung pada sistem SI-UKS DIGITAL.
          </p>
        </div>

        <button className="btn btn-primary">
          <Plus size={18} />
          Tambah Sekolah
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
          icon={<School size={24} />}
          title="Total Sekolah"
          value="1,450"
          bg="var(--accent-glow)"
          color="var(--secondary)"
        />

        <StatCard
          icon={<GraduationCap size={24} />}
          title="Jenjang Aktif"
          value="4 Jenjang"
          bg="#EEF2FF"
          color="#4338CA"
        />

        <StatCard
          icon={<Building2 size={24} />}
          title="Total OPD"
          value="15"
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
              Data Sekolah
            </h3>

            <p
              className="text-muted"
              style={{
                fontSize: "13px",
              }}
            >
              Monitoring dan pengelolaan seluruh data
              sekolah
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
              placeholder="Cari nama sekolah..."
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
              minWidth: "1100px",
            }}
          >
            <thead>
              <tr
                style={{
                  background: "var(--bg-light)",
                }}
              >
                <TableHead>NPSN</TableHead>
                <TableHead>Nama Sekolah</TableHead>
                <TableHead>Jenjang</TableHead>
                <TableHead>OPD</TableHead>
                <TableHead>Kepala Sekolah</TableHead>
                <TableHead>Aksi</TableHead>
              </tr>
            </thead>

            <tbody>
              <TableRow
                npsn="20100101"
                sekolah="SDN Sukamaju 01"
                jenjang="SD"
                opd="Dinas Kesehatan Sukamaju"
                kepala="Drs. Ahmad Fauzi"
              />

              <TableRow
                npsn="20100102"
                sekolah="SMPN 4 Sukamaju"
                jenjang="SMP"
                opd="Dinas Pendidikan Sukamaju"
                kepala="Siti Rahmawati, S.Pd"
              />

              <TableRow
                npsn="20100103"
                sekolah="SMAN 1 Nusantara"
                jenjang="SMA"
                opd="Dinas Pendidikan Nusantara"
                kepala="Hendra Wijaya, M.Pd"
              />

              <TableRow
                npsn="20100104"
                sekolah="SMKN Teknologi 02"
                jenjang="SMK"
                opd="Diskominfo Teknologi"
                kepala="Agus Saputra, S.Kom"
              />

              <TableRow
                npsn="20100105"
                sekolah="SDN Harapan Bangsa"
                jenjang="SD"
                opd="Dinas Kesehatan Barat"
                kepala="Nur Aisyah, S.Pd"
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
  npsn,
  sekolah,
  jenjang,
  opd,
  kepala,
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
          {npsn}
        </div>
      </td>

      <td style={tdStyle}>
        <div
          style={{
            fontWeight: 600,
            minWidth: "220px",
          }}
        >
          {sekolah}
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
          <GraduationCap size={15} />
          {jenjang}
        </div>
      </td>

      <td style={tdStyle}>
        <div
          style={{
            minWidth: "220px",
            lineHeight: 1.7,
          }}
        >
          {opd}
        </div>
      </td>

      <td style={tdStyle}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            minWidth: "220px",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "12px",
              background: "var(--bg-light)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--primary)",
            }}
          >
            <User2 size={18} />
          </div>

          <div
            style={{
              fontWeight: 600,
            }}
          >
            {kepala}
          </div>
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
            Delete
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