import {
  FileText,
  Image,
  Mic,
  Pencil,
  Trash2,
  Eye,
  CalendarDays,
  Newspaper,
  ArrowRight,
} from "lucide-react";

import { Link } from "react-router-dom";

export default function SuperAdminkonten() {
  return (
    <div
      style={{
        width: "100%",
        overflowX: "hidden",
        paddingBottom: "30px",
      }}
    >
      {/* ========================= */}
      {/* STYLE */}
      {/* ========================= */}
      <style>{`
        .dashboard-grid{
          display:grid;
          grid-template-columns:repeat(auto-fit,minmax(240px,1fr));
          gap:22px;
        }

        .preview-grid{
          display:grid;
          grid-template-columns:repeat(auto-fit,minmax(280px,1fr));
          gap:24px;
        }

        .draft-wrapper{
          display:flex;
          flex-direction:column;
          gap:18px;
        }

        @media(max-width:768px){

          .mobile-stack{
            flex-direction:column !important;
            align-items:stretch !important;
          }

          .mobile-full{
            width:100%;
          }

          .mobile-btn-group{
            width:100%;
            display:grid !important;
            grid-template-columns:1fr 1fr;
            gap:10px;
          }

          .mobile-btn-group button{
            width:100%;
            justify-content:center;
          }

          .news-action{
            display:grid !important;
            grid-template-columns:1fr;
          }

          .preview-grid{
            grid-template-columns:1fr;
          }

          .dashboard-grid{
            grid-template-columns:1fr;
          }

          .section-card{
            padding:18px !important;
            border-radius:22px !important;
          }

          .section-title{
            font-size:18px !important;
          }

          .draft-card{
            padding:16px !important;
            border-radius:18px !important;
          }

          .news-content{
            padding:18px !important;
          }

          .news-image{
            height:200px !important;
          }

          .show-more-btn{
            width:100%;
            justify-content:center;
          }
        }
      `}</style>

      {/* ========================= */}
      {/* HEADER */}
      {/* ========================= */}
      <div
        className="flex items-start justify-between mb-6 mobile-stack"
        style={{
          gap: "18px",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "clamp(24px,4vw,30px)",
              fontWeight: 700,
              marginBottom: "8px",
              lineHeight: 1.2,
            }}
          >
            Dashboard Pengelola Publikasi
          </h1>

          <p
            className="text-muted"
            style={{
              fontSize: "14px",
              lineHeight: 1.7,
              maxWidth: "700px",
            }}
          >
            Manajemen berita, galeri, artikel, dan pengumuman
            sistem SI-UKS DIGITAL secara terintegrasi.
          </p>
        </div>

        <Link
          to="/superadmin/SuperAdminkontenDesain"
          className="btn btn-primary mobile-full"
          style={{
            whiteSpace: "nowrap",
            justifyContent: "center",
          }}
        >
          + Buat Artikel Baru
        </Link>
      </div>

      {/* ========================= */}
      {/* STATISTIC */}
      {/* ========================= */}
      <div className="dashboard-grid mb-6">
        <StatCard
          icon={<FileText size={24} />}
          title="Artikel Terbit"
          value="24"
          bg="var(--accent-glow)"
          color="var(--secondary)"
        />

        <StatCard
          icon={<Image size={24} />}
          title="Album Galeri"
          value="12"
          bg="var(--bg-light)"
          color="var(--primary)"
        />

        <StatCard
          icon={<Mic size={24} />}
          title="Pengumuman Aktif"
          value="3"
          bg="#FFF7E8"
          color="#F59E0B"
        />
      </div>

      {/* ========================= */}
      {/* DRAFT TERBARU */}
      {/* ========================= */}
      <div
        className="card glass-panel section-card mb-6"
        style={{
          padding: "26px",
          borderRadius: "28px",
        }}
      >
        {/* HEADER */}
        <div
          className="flex items-center justify-between mb-6 mobile-stack"
          style={{
            gap: "18px",
            alignItems: "flex-start",
          }}
        >
          <div
            className="flex items-center gap-3"
            style={{
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "16px",
                background: "var(--bg-light)",
                color: "var(--primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <CalendarDays size={22} />
            </div>

            <div>
              <h3
                className="section-title"
                style={{
                  fontSize: "22px",
                  fontWeight: 700,
                  marginBottom: "4px",
                }}
              >
                Draft Terbaru
              </h3>

              <p
                className="text-muted"
                style={{
                  fontSize: "13px",
                }}
              >
                Artikel yang masih dalam proses editing
              </p>
            </div>
          </div>

          <button
            className="btn btn-outline show-more-btn"
            onClick={() =>
              (window.location.href =
                "/admin/konten/draft")
            }
          >
            Show More
            <ArrowRight size={16} />
          </button>
        </div>

        {/* DRAFT LIST */}
        <div className="draft-wrapper">
          <DraftItem
            title="Panduan Cuci Tangan yang Benar"
            date="Diedit 2 jam lalu"
          />

          <DraftItem
            title="Lomba Sekolah Sehat 2026"
            date="Diedit 1 hari lalu"
          />

          <DraftItem
            title="Workshop UKS Kabupaten"
            date="Diedit 3 hari lalu"
          />
        </div>
      </div>

      {/* ========================= */}
      {/* PREVIEW BERITA */}
      {/* ========================= */}
      <div
        className="card glass-panel section-card"
        style={{
          padding: "26px",
          borderRadius: "28px",
        }}
      >
        {/* HEADER */}
        <div
          className="flex items-center justify-between mb-6 mobile-stack"
          style={{
            gap: "18px",
            alignItems: "flex-start",
          }}
        >
          <div
            className="flex items-center gap-3"
            style={{
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "16px",
                background: "var(--accent-glow)",
                color: "var(--secondary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Newspaper size={22} />
            </div>

            <div>
              <h3
                className="section-title"
                style={{
                  fontSize: "22px",
                  fontWeight: 700,
                  marginBottom: "4px",
                }}
              >
                Preview Berita & Artikel
              </h3>

              <p
                className="text-muted"
                style={{
                  fontSize: "13px",
                }}
              >
                Artikel terbaru yang tampil di landing page
              </p>
            </div>
          </div>

          <button
            className="btn btn-outline show-more-btn"
            onClick={() =>
              (window.location.href =
                "/admin/konten/preview")
            }
          >
            Show More
            <ArrowRight size={16} />
          </button>
        </div>

        {/* CARD GRID */}
        <div className="preview-grid">
          <NewsCard
            image="https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?q=80&w=1200&auto=format&fit=crop"
            tag="Kegiatan UKS"
            tagBg="#DCFCE7"
            tagColor="#15803D"
            title="Sosialisasi PHBS di 25 Sekolah Dasar"
            desc="Program edukasi hidup bersih dan sehat bersama tenaga kesehatan daerah."
          />

          <NewsCard
            image="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1200&auto=format&fit=crop"
            tag="Prestasi"
            tagBg="#DBEAFE"
            tagColor="#1D4ED8"
            title="SMPN 3 Sukamaju Raih UKS Paripurna"
            desc="Sekolah berhasil meraih penghargaan strata tertinggi tingkat kabupaten."
          />

          <NewsCard
            image="https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=1200&auto=format&fit=crop"
            tag="Edukasi"
            tagBg="#FEF3C7"
            tagColor="#B45309"
            title="Pentingnya Gizi Seimbang Bagi Pelajar"
            desc="Artikel edukasi kesehatan untuk meningkatkan kualitas hidup siswa."
          />
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
        borderRadius: "24px",
        minWidth: 0,
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
          fontWeight: 700,
          lineHeight: 1.1,
        }}
      >
        {value}
      </div>
    </div>
  );
}

/* ========================= */
/* NEWS CARD */
/* ========================= */

function NewsCard({
  image,
  tag,
  tagBg,
  tagColor,
  title,
  desc,
}) {
  return (
    <div
      style={{
        background: "var(--card-bg)",
        borderRadius: "24px",
        overflow: "hidden",
        border: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        minWidth: 0,
      }}
    >
      <img
        src={image}
        alt={title}
        className="news-image"
        style={{
          width: "100%",
          height: "220px",
          objectFit: "cover",
        }}
      />

      <div
        className="news-content"
        style={{
          padding: "22px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          flex: 1,
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            width: "fit-content",
            padding: "8px 14px",
            borderRadius: "999px",
            fontSize: "12px",
            fontWeight: 600,
            background: tagBg,
            color: tagColor,
          }}
        >
          {tag}
        </div>

        <div
          style={{
            fontSize: "18px",
            fontWeight: 700,
            lineHeight: 1.5,
            color: "var(--text-main)",
          }}
        >
          {title}
        </div>

        <div
          className="text-muted"
          style={{
            fontSize: "14px",
            lineHeight: 1.8,
            flex: 1,
          }}
        >
          {desc}
        </div>

        {/* ACTION */}
        <div
          className="news-action"
          style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
            marginTop: "6px",
          }}
        >
          <button className="btn btn-outline">
            <Eye size={16} />
            Preview
          </button>

          <button className="btn btn-primary">
            <Pencil size={16} />
            Edit
          </button>

          <button
            className="btn"
            style={{
              background: "#FEF2F2",
              color: "#DC2626",
              border: "1px solid #FECACA",
            }}
          >
            <Trash2 size={16} />
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
}

/* ========================= */
/* DRAFT ITEM */
/* ========================= */

function DraftItem({
  title,
  date,
}) {
  return (
    <div
      className="draft-card"
      style={{
        border: "1px solid var(--border)",
        borderRadius: "22px",
        padding: "20px",
        background: "var(--card-bg)",
      }}
    >
      <div
        className="flex items-start justify-between mobile-stack"
        style={{
          gap: "18px",
        }}
      >
        <div
          className="flex items-center gap-4"
          style={{
            minWidth: 0,
            flex: 1,
          }}
        >
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "18px",
              background: "var(--bg-light)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <FileText
              size={24}
              color="var(--primary)"
            />
          </div>

          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontWeight: 700,
                marginBottom: "8px",
                lineHeight: 1.5,
                wordBreak: "break-word",
                fontSize: "16px",
              }}
            >
              {title}
            </div>

            <div
              className="text-muted"
              style={{
                fontSize: "13px",
              }}
            >
              {date}
            </div>
          </div>
        </div>

        {/* ACTION BUTTON */}
        <div className="mobile-btn-group">
          <button className="btn btn-outline">
            <Pencil size={16} />
            Edit
          </button>

          <button
            className="btn"
            style={{
              background: "#FEF2F2",
              color: "#DC2626",
              border: "1px solid #FECACA",
            }}
          >
            <Trash2 size={16} />
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
}