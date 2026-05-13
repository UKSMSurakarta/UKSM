import {
  FileSpreadsheet,
  Download,
  Eye,
  School,
  CheckCircle2,
  Clock3,
  AlertTriangle,
  PieChart,
  BarChart3,
} from "lucide-react";
import { SCHOOL_REGISTRY, PREDIKAT_UKS, PERIODE_AKTIF, getAdminStats } from "../../data/questions";

export default function AdminAnalisisLaporan() {
  const stats = getAdminStats(SCHOOL_REGISTRY);
  const selesai  = SCHOOL_REGISTRY.filter((s) => s.status === "Terverifikasi" || s.status === "Selesai").length;
  const menunggu = SCHOOL_REGISTRY.filter((s) => s.status === "Menunggu Verifikasi").length;
  const belum    = SCHOOL_REGISTRY.filter((s) => s.status === "Belum Selesai" || s.status === "Proses").length;
  const avgProgress = Math.round(SCHOOL_REGISTRY.reduce((a, s) => a + s.progress, 0) / SCHOOL_REGISTRY.length);
  const predikatCount = {};
  PREDIKAT_UKS.forEach((p) => { predikatCount[p.key] = SCHOOL_REGISTRY.filter((s) => s.predikat === p.key).length; });
  const laporanList = [
    { id: 1, title: "Laporan Rekap Assessment UKS",  periode: PERIODE_AKTIF.nama, ukuran: "2.4 MB", tanggal: "12 Mei 2026" },
    { id: 2, title: "Laporan Verifikasi Sekolah",    periode: PERIODE_AKTIF.nama, ukuran: "1.2 MB", tanggal: "10 Mei 2026" },
  ];

  return (
    <div
      style={{
        width: "100%",
        overflowX: "hidden",
        display: "flex",
        flexDirection: "column",
        gap: "22px",
      }}
    >
      {/* HEADER */}
      <div
        className="flex items-start justify-between"
        style={{
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1
            style={{
              fontSize: "clamp(24px, 4vw, 30px)",
              fontWeight: 700,
              lineHeight: 1.2,
              marginBottom: 6,
            }}
          >
            Analisis & Laporan
          </h1>

          <p
            className="text-muted"
            style={{
              fontSize: "14px",
              lineHeight: 1.6,
            }}
          >
            Monitoring data assessment, progres
            verifikasi, serta laporan sekolah binaan.
          </p>
        </div>

        <div
          className="badge badge-glow"
          style={{
            whiteSpace: "nowrap",
          }}
        >
          Tahun 2026 / 2027
        </div>
      </div>

      {/* STATISTIK */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "18px",
        }}
      >
        <StatCard icon={<School size={22} />}       title="Total Sekolah"       value={String(stats.total)} color="var(--secondary)" bg="var(--accent-glow)" />
        <StatCard icon={<CheckCircle2 size={22} />}  title="Terverifikasi"       value={String(selesai)}     color="#16A34A"          bg="#DCFCE7" />
        <StatCard icon={<Clock3 size={22} />}         title="Menunggu Verifikasi" value={String(menunggu)}    color="#D97706"          bg="#FEF3C7" />
        <StatCard icon={<AlertTriangle size={22} />}  title="Belum Selesai"       value={String(belum)}       color="#DC2626"          bg="#FEE2E2" />
      </div>

      {/* ANALISIS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "18px",
        }}
      >
        {/* ANALISIS STRATA */}
        <div
          className="card glass-panel"
          style={{
            padding: "24px",
            borderRadius: "24px",
          }}
        >
          <div
            className="flex items-center gap-2"
            style={{
              marginBottom: "22px",
            }}
          >
            <PieChart
              size={20}
              color="var(--primary)"
            />

            <h3
              style={{
                fontSize: "18px",
                fontWeight: 700,
              }}
            >
              Analisis Strata
            </h3>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            {PREDIKAT_UKS.map((p) => (
              <ProgressItem
                key={p.key}
                title={p.label}
                value={`${predikatCount[p.key] || 0} Sekolah`}
                width={`${Math.min(100, (predikatCount[p.key] || 0) / SCHOOL_REGISTRY.length * 100 * 3)}%`}
                color={p.color}
              />
            ))}
          </div>
        </div>

        {/* ANALISIS PROGRES */}
        <div
          className="card glass-panel"
          style={{
            padding: "24px",
            borderRadius: "24px",
          }}
        >
          <div
            className="flex items-center gap-2"
            style={{
              marginBottom: "22px",
            }}
          >
            <BarChart3
              size={20}
              color="var(--secondary)"
            />

            <h3
              style={{
                fontSize: "18px",
                fontWeight: 700,
              }}
            >
              Progress Assessment
            </h3>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(2, minmax(0,1fr))",
              gap: "14px",
            }}
          >
            <MiniCard title="Rata-rata Progress" value={`${avgProgress}%`} />
            <MiniCard title="Terverifikasi"       value={String(selesai)} />
            <MiniCard title="Belum Selesai"       value={String(belum)} />
            <MiniCard title="Menunggu Verifikasi" value={String(menunggu)} />
          </div>
        </div>
      </div>

      {/* PREVIEW LAPORAN */}
      <div
        className="card glass-panel"
        style={{
          padding: "24px",
          borderRadius: "24px",
        }}
      >
        <div
          className="flex items-center justify-between"
          style={{
            flexWrap: "wrap",
            gap: "14px",
            marginBottom: "20px",
          }}
        >
          <div
            className="flex items-center gap-2"
            style={{
              flexWrap: "wrap",
            }}
          >
            <FileSpreadsheet
              size={20}
              color="#16A34A"
            />

            <h3
              style={{
                fontSize: "18px",
                fontWeight: 700,
              }}
            >
              Preview Laporan Excel
            </h3>
          </div>

          <button style={downloadBtn}>
            <Download size={16} />
            Download Semua
          </button>
        </div>

        {/* PREVIEW TABLE */}
        <div
          style={{
            overflowX: "auto",
            borderRadius: "18px",
            border: "1px solid var(--border)",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              minWidth: "720px",
            }}
          >
            <thead
              style={{
                background: "var(--bg-light)",
              }}
            >
              <tr>
                <Th>Nama Sekolah</Th>
                <Th>Status</Th>
                <Th>Progress</Th>
                <Th>Strata</Th>
                <Th>Verifikasi</Th>
              </tr>
            </thead>

            <tbody>
              <TableRow
                sekolah="SDN 01 Percontohan"
                status="Selesai"
                progress="100%"
                strata="Paripurna"
                verifikasi="Terverifikasi"
              />

              <TableRow
                sekolah="SMPN 02 Harapan"
                status="Proses"
                progress="75%"
                strata="Madya"
                verifikasi="Menunggu"
              />

              <TableRow
                sekolah="SMAN 03 Nusantara"
                status="Selesai"
                progress="100%"
                strata="Utama"
                verifikasi="Terverifikasi"
              />

              <TableRow
                sekolah="SD Islam Cahaya"
                status="Belum Selesai"
                progress="45%"
                strata="Standar"
                verifikasi="Belum"
              />
            </tbody>
          </table>
        </div>
      </div>

      {/* LAPORAN */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "18px",
        }}
      >
        {laporanList.map((laporan) => (
          <div
            key={laporan.id}
            className="card glass-panel"
            style={{
              padding: "22px",
              borderRadius: "22px",
              display: "flex",
              flexDirection: "column",
              gap: "18px",
            }}
          >
            <div
              className="flex items-start gap-4"
              style={{
                minWidth: 0,
              }}
            >
              <div
                style={{
                  width: "58px",
                  height: "58px",
                  borderRadius: "18px",
                  background: "#DCFCE7",
                  color: "#16A34A",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <FileSpreadsheet size={26} />
              </div>

              <div style={{ minWidth: 0 }}>
                <h3
                  style={{
                    fontSize: "17px",
                    fontWeight: 700,
                    lineHeight: 1.5,
                    marginBottom: "6px",
                    wordBreak: "break-word",
                  }}
                >
                  {laporan.title}
                </h3>

                <div
                  className="text-muted"
                  style={{
                    fontSize: "13px",
                    lineHeight: 1.6,
                  }}
                >
                  {laporan.periode}
                </div>
              </div>
            </div>

            {/* INFO */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(2, minmax(0,1fr))",
                gap: "12px",
              }}
            >
              <MiniCard
                title="Ukuran"
                value={laporan.ukuran}
              />

              <MiniCard
                title="Tanggal"
                value={laporan.tanggal}
              />
            </div>

            {/* ACTION */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(140px, 1fr))",
                gap: "12px",
              }}
            >
              <button style={previewBtn}>
                <Eye size={16} />
                Preview
              </button>

              <button style={downloadBtn}>
                <Download size={16} />
                Download
              </button>
            </div>
          </div>
        ))}
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
  color,
  bg,
}) {
  return (
    <div
      className="card"
      style={{
        padding: "22px",
        borderRadius: "22px",
        border: "1px solid var(--border)",
        display: "flex",
        alignItems: "center",
        gap: "16px",
      }}
    >
      <div
        style={{
          width: "54px",
          height: "54px",
          borderRadius: "18px",
          background: bg,
          color: color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {icon}
      </div>

      <div style={{ minWidth: 0 }}>
        <div
          className="text-muted"
          style={{
            fontSize: "13px",
            marginBottom: "4px",
          }}
        >
          {title}
        </div>

        <div
          style={{
            fontSize: "28px",
            fontWeight: 700,
            lineHeight: 1.2,
          }}
        >
          {value}
        </div>
      </div>
    </div>
  );
}

/* ========================= */
/* MINI CARD */
/* ========================= */

function MiniCard({ title, value }) {
  return (
    <div
      style={{
        padding: "14px",
        borderRadius: "16px",
        background: "var(--bg-light)",
        border: "1px solid var(--border)",
      }}
    >
      <div
        className="text-muted"
        style={{
          fontSize: "12px",
          marginBottom: "6px",
        }}
      >
        {title}
      </div>

      <div
        style={{
          fontSize: "18px",
          fontWeight: 700,
          lineHeight: 1.3,
          wordBreak: "break-word",
        }}
      >
        {value}
      </div>
    </div>
  );
}

/* ========================= */
/* PROGRESS ITEM */
/* ========================= */

function ProgressItem({
  title,
  value,
  width,
  color,
}) {
  return (
    <div>
      <div
        className="flex items-center justify-between"
        style={{
          marginBottom: "8px",
          gap: "10px",
        }}
      >
        <span
          style={{
            fontSize: "14px",
            fontWeight: 600,
          }}
        >
          {title}
        </span>

        <span
          className="text-muted"
          style={{
            fontSize: "13px",
          }}
        >
          {value}
        </span>
      </div>

      <div
        style={{
          width: "100%",
          height: "10px",
          borderRadius: "999px",
          background: "var(--border)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: width,
            height: "100%",
            borderRadius: "999px",
            background: color,
          }}
        />
      </div>
    </div>
  );
}

/* ========================= */
/* TABLE */
/* ========================= */

function Th({ children }) {
  return (
    <th
      style={{
        textAlign: "left",
        padding: "14px",
        fontSize: "13px",
        fontWeight: 700,
        borderBottom: "1px solid var(--border)",
      }}
    >
      {children}
    </th>
  );
}

function TableRow({
  sekolah,
  status,
  progress,
  strata,
  verifikasi,
}) {
  return (
    <tr>
      <Td>{sekolah}</Td>
      <Td>{status}</Td>
      <Td>{progress}</Td>
      <Td>{strata}</Td>
      <Td>{verifikasi}</Td>
    </tr>
  );
}

function Td({ children }) {
  return (
    <td
      style={{
        padding: "14px",
        fontSize: "13px",
        borderBottom: "1px solid var(--border)",
      }}
    >
      {children}
    </td>
  );
}

/* ========================= */
/* BUTTON */
/* ========================= */

const previewBtn = {
  height: "46px",
  borderRadius: "14px",
  border: "1px solid var(--border)",
  background: "var(--card-bg)",
  color: "var(--text-main)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  cursor: "pointer",
  fontWeight: 600,
  fontSize: "14px",
};

const downloadBtn = {
  height: "46px",
  borderRadius: "14px",
  border: "none",
  background:
    "linear-gradient(135deg, #16A34A, #15803D)",
  color: "white",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  cursor: "pointer",
  fontWeight: 600,
  fontSize: "14px",
};