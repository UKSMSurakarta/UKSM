import { useAuth } from "../../context/AuthContext";
import {
  School,
  MapPin,
  Mail,
  Phone,
  User,
  ShieldCheck,
  CalendarDays,
  BadgeCheck,
} from "lucide-react";

export default function SekolahDashboard() {
  const { user } = useAuth();

  return (
    <div
      style={{
        width: "100%",
        overflowX: "hidden",
      }}
    >
      {/* HEADER */}
      <div
        className="flex items-start justify-between gap-4 mb-6"
        style={{
          flexWrap: "wrap",
        }}
      >
        <div style={{ minWidth: 0 }}>
          <h1
            style={{
              fontSize: "clamp(20px, 4vw, 28px)",
              fontWeight: 700,
              lineHeight: 1.2,
              marginBottom: 6,
              wordBreak: "break-word",
            }}
          >
            Profile Sekolah
          </h1>

          <p
            className="text-muted"
            style={{
              fontSize: "14px",
              lineHeight: 1.5,
            }}
          >
            Informasi lengkap data sekolah peserta UKS
          </p>
        </div>

        <div
          className="badge badge-glow"
          style={{
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          Tahun Ajaran 2026/2027
        </div>
      </div>

      {/* PROFILE CARD */}
      <div
        className="card glass-panel mb-6"
        style={{
          padding: "24px",
          borderRadius: "24px",
        }}
      >
        <div
          className="flex gap-5"
          style={{
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          {/* LOGO */}
          <div
            style={{
              width: "90px",
              height: "90px",
              borderRadius: "50%",
              background: "var(--accent-glow)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--secondary)",
              flexShrink: 0,
              margin: "0 auto",
            }}
          >
            <School size={40} />
          </div>

          {/* INFO */}
          <div
            style={{
              flex: 1,
              minWidth: 0,
            }}
          >
            <h2
              style={{
                fontSize: "clamp(20px, 4vw, 26px)",
                fontWeight: 700,
                lineHeight: 1.3,
                marginBottom: 8,
                wordBreak: "break-word",
              }}
            >
              {user?.school?.name || "SDN 01 Percontohan"}
            </h2>

            <p
              className="text-muted"
              style={{
                fontSize: "14px",
                marginBottom: 14,
                lineHeight: 1.5,
              }}
            >
              Sekolah Peserta Penilaian UKS Digital
            </p>

            <div
              className="flex gap-2"
              style={{
                flexWrap: "wrap",
              }}
            >
              <div className="badge badge-glow">
                Sekolah Aktif
              </div>

              <div
                className="badge"
                style={{
                  background: "var(--bg-light)",
                  color: "var(--primary)",
                }}
              >
                Terverifikasi
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* GRID */}
      <div
        className="grid gap-6 mb-6"
        style={{
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        }}
      >
        {/* IDENTITAS */}
        <div
          className="card glass-panel"
          style={{
            padding: "22px",
            borderRadius: "22px",
            minWidth: 0,
          }}
        >
          <div
            className="flex items-center gap-2 mb-5"
            style={{
              flexWrap: "wrap",
            }}
          >
            <ShieldCheck
              size={20}
              color="var(--primary)"
            />

            <h3
              style={{
                fontSize: "18px",
                fontWeight: 700,
              }}
            >
              Identitas Sekolah
            </h3>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 14,
            }}
          >
            <ProfileItem
              icon={<School size={18} />}
              label="Nama Sekolah"
              value={user?.school?.name || "SDN 01 Percontohan"}
            />

            <ProfileItem
              icon={<User size={18} />}
              label="Kepala Sekolah"
              value={user?.username || "Kepala Sekolah"}
            />

            <ProfileItem
              icon={<BadgeCheck size={18} />}
              label="NPSN"
              value="20345678"
            />

            <ProfileItem
              icon={<CalendarDays size={18} />}
              label="Tahun Bergabung"
              value="2026"
            />
          </div>
        </div>

        {/* KONTAK */}
        <div
          className="card glass-panel"
          style={{
            padding: "22px",
            borderRadius: "22px",
            minWidth: 0,
          }}
        >
          <div
            className="flex items-center gap-2 mb-5"
            style={{
              flexWrap: "wrap",
            }}
          >
            <Mail
              size={20}
              color="var(--secondary)"
            />

            <h3
              style={{
                fontSize: "18px",
                fontWeight: 700,
              }}
            >
              Kontak & Lokasi
            </h3>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 14,
            }}
          >
            <ProfileItem
              icon={<MapPin size={18} />}
              label="Alamat"
              value="Jl. Pendidikan No. 12, Jawa Tengah"
            />

            <ProfileItem
              icon={<Phone size={18} />}
              label="Nomor Telepon"
              value="(0271) 123456"
            />

            <ProfileItem
              icon={<Mail size={18} />}
              label="Email Sekolah"
              value="sdn01@email.com"
            />

            <ProfileItem
              icon={<School size={18} />}
              label="Akreditasi"
              value="A"
            />
          </div>
        </div>
      </div>

      {/* STATUS */}
      <div
        className="card glass-panel"
        style={{
          padding: "24px",
          borderRadius: "24px",
        }}
      >
        <div
          className="flex items-start justify-between gap-4 mb-5"
          style={{
            flexWrap: "wrap",
          }}
        >
          <div style={{ minWidth: 0 }}>
            <h3
              style={{
                fontSize: "20px",
                fontWeight: 700,
                marginBottom: 6,
              }}
            >
              Status Penilaian UKS
            </h3>

            <p
              className="text-muted"
              style={{
                fontSize: "14px",
                lineHeight: 1.5,
              }}
            >
              Ringkasan progres penilaian sekolah
            </p>
          </div>

          <div
            className="badge"
            style={{
              background: "var(--accent-glow)",
              color: "var(--secondary)",
              whiteSpace: "nowrap",
            }}
          >
            Dalam Proses
          </div>
        </div>

        {/* STATUS GRID */}
        <div
          className="grid gap-4"
          style={{
            gridTemplateColumns:
              "repeat(auto-fit, minmax(180px, 1fr))",
          }}
        >
          <StatusCard
            title="Kategori Selesai"
            value="2 / 4"
          />

          <StatusCard
            title="Indikator Terisi"
            value="14 / 28"
          />

          <StatusCard
            title="Progress"
            value="65%"
          />
        </div>
      </div>
    </div>
  );
}

/* PROFILE ITEM */
function ProfileItem({ icon, label, value }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
        paddingBottom: 14,
        borderBottom: "1px solid var(--border)",
        minWidth: 0,
      }}
    >
      {/* ICON */}
      <div
        style={{
          width: 42,
          height: 42,
          borderRadius: 14,
          background: "var(--bg-light)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--primary)",
          flexShrink: 0,
        }}
      >
        {icon}
      </div>

      {/* CONTENT */}
      <div
        style={{
          flex: 1,
          minWidth: 0,
        }}
      >
        <div
          className="text-muted"
          style={{
            fontSize: 12,
            marginBottom: 4,
          }}
        >
          {label}
        </div>

        <div
          style={{
            fontWeight: 600,
            fontSize: 14,
            lineHeight: 1.5,
            wordBreak: "break-word",
            overflowWrap: "break-word",
          }}
        >
          {value}
        </div>
      </div>
    </div>
  );
}

/* STATUS CARD */
function StatusCard({ title, value }) {
  return (
    <div
      style={{
        padding: "20px",
        borderRadius: "20px",
        border: "1px solid var(--border)",
        background: "var(--card-bg)",
        minWidth: 0,
      }}
    >
      <div
        className="text-muted"
        style={{
          fontSize: 13,
          marginBottom: 8,
          lineHeight: 1.5,
        }}
      >
        {title}
      </div>

      <div
        style={{
          fontSize: "clamp(24px, 5vw, 30px)",
          fontWeight: 700,
          color: "var(--primary)",
          wordBreak: "break-word",
        }}
      >
        {value}
      </div>
    </div>
  );
}