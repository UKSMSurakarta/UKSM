import { useState } from "react";
import {
  Users,
  UserPlus,
  Search,
  Filter,
  ShieldCheck,
  ShieldOff,
  Pencil,
  Trash2,
  User2,
  Building2,
  KeyRound,
  GraduationCap,
} from "lucide-react";

const initialUsers = [
  {
    id: 1,
    nama: "Admin Surakarta",
    username: "admin_ska",
    role: "admin",
    instansi: "Dinkes Surakarta",
    status: true,
  },

  {
    id: 2,
    nama: "Operator SDN 01",
    username: "sekolah_sd01",
    role: "sekolah",
    instansi: "SDN Sukamaju 01",
    status: true,
  },

  {
    id: 3,
    nama: "Tim Konten UKS",
    username: "konten_uks",
    role: "konten",
    instansi: "Pusat",
    status: true,
  },

  {
    id: 4,
    nama: "Admin Nusantara",
    username: "admin_nusa",
    role: "admin",
    instansi: "Dinkes Nusantara",
    status: false,
  },

  {
    id: 5,
    nama: "Operator SMPN 4",
    username: "sekolah_smp4",
    role: "sekolah",
    instansi: "SMPN 4 Surakarta",
    status: true,
  },
];

const roleColor = {
  superadmin: {
    bg: "#EEF2FF",
    text: "#4338CA",
  },

  admin: {
    bg: "#DCFCE7",
    text: "#15803D",
  },

  sekolah: {
    bg: "#FEF3C7",
    text: "#B45309",
  },

  konten: {
    bg: "#FCE7F3",
    text: "#BE185D",
  },
};

export default function SuperAdminUsers() {
  const [users, setUsers] =
    useState(initialUsers);

  const toggleStatus = (id) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === id
          ? {
              ...user,
              status: !user.status,
            }
          : user
      )
    );
  };

  return (
    <div
      style={{
        width: "100%",
        overflowX: "hidden",
      }}
    >
      {/* HEADER */}
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
            }}
          >
            Manajemen User
          </h1>

          <p
            className="text-muted"
            style={{
              fontSize: "14px",
              lineHeight: 1.7,
              maxWidth: "760px",
            }}
          >
            Kelola akun pengguna sistem
            SI-UKS DIGITAL dari semua role
            dan wilayah.
          </p>
        </div>

        <button className="btn btn-primary">
          <UserPlus size={18} />
          Tambah User
        </button>
      </div>

      {/* STATS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(220px,1fr))",
          gap: "22px",
          marginBottom: "28px",
        }}
      >
        <StatCard
          icon={<Users size={24} />}
          title="Total User"
          value={users.length}
          bg="var(--accent-glow)"
          color="var(--secondary)"
        />

        <StatCard
          icon={<ShieldCheck size={24} />}
          title="Admin"
          value={
            users.filter(
              (u) => u.role === "admin"
            ).length
          }
          bg="#DCFCE7"
          color="#15803D"
        />

        <StatCard
          icon={<GraduationCap size={24} />}
          title="Sekolah"
          value={
            users.filter(
              (u) => u.role === "sekolah"
            ).length
          }
          bg="#FEF3C7"
          color="#B45309"
        />

        <StatCard
          icon={<Building2 size={24} />}
          title="Konten"
          value={
            users.filter(
              (u) => u.role === "konten"
            ).length
          }
          bg="#FCE7F3"
          color="#BE185D"
        />
      </div>

      {/* TABLE CARD */}
      <div
        className="card glass-panel"
        style={{
          padding: "28px",
          borderRadius: "28px",
          overflow: "hidden",
        }}
      >
        {/* FILTER */}
        <div
          style={{
            display: "flex",
            gap: "16px",
            marginBottom: "24px",
            flexWrap: "wrap",
          }}
        >
          {/* SEARCH */}
          <div
            style={{
              position: "relative",
              flex: 1,
              minWidth: "240px",
            }}
          >
            <Search
              size={18}
              style={{
                position: "absolute",
                left: "16px",
                top: "50%",
                transform:
                  "translateY(-50%)",
                color:
                  "var(--text-muted)",
              }}
            />

            <input
              type="text"
              placeholder="Cari username / nama..."
              style={{
                width: "100%",
                height: "52px",
                borderRadius: "16px",
                border:
                  "1px solid var(--border)",
                background:
                  "var(--card-bg)",
                paddingLeft: "48px",
                paddingRight: "18px",
                outline: "none",
                fontSize: "14px",
              }}
            />
          </div>

          {/* FILTER */}
          <div
            style={{
              position: "relative",
            }}
          >
            <Filter
              size={18}
              style={{
                position: "absolute",
                left: "16px",
                top: "50%",
                transform:
                  "translateY(-50%)",
                color:
                  "var(--text-muted)",
              }}
            />

            <select
              style={{
                height: "52px",
                borderRadius: "16px",
                border:
                  "1px solid var(--border)",
                background:
                  "var(--card-bg)",
                paddingLeft: "46px",
                paddingRight: "18px",
                outline: "none",
                fontSize: "14px",
                cursor: "pointer",
              }}
            >
              <option>
                Semua Role
              </option>

              <option>
                admin
              </option>

              <option>
                sekolah
              </option>

              <option>
                konten
              </option>
            </select>
          </div>
        </div>

        {/* TABLE */}
        <div
          style={{
            overflowX: "auto",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse:
                "collapse",
              minWidth: "1150px",
            }}
          >
            <thead>
              <tr
                style={{
                  background:
                    "var(--bg-light)",
                }}
              >
                <TableHead>
                  Nama
                </TableHead>

                <TableHead>
                  Username
                </TableHead>

                <TableHead>
                  Role
                </TableHead>

                <TableHead>
                  Instansi
                </TableHead>

                <TableHead>
                  Status
                </TableHead>

                <TableHead>
                  Password
                </TableHead>

                <TableHead>
                  Aksi
                </TableHead>
              </tr>
            </thead>

            <tbody>
              {users.map((u) => {
                const rc =
                  roleColor[u.role] || {
                    bg: "#F3F4F6",
                    text: "#374151",
                  };

                return (
                  <tr
                    key={u.id}
                    style={{
                      borderBottom:
                        "1px solid var(--border)",
                    }}
                  >
                    {/* NAMA */}
                    <td style={tdStyle}>
                      <div
                        style={{
                          display: "flex",
                          alignItems:
                            "center",
                          gap: "12px",
                          minWidth: "220px",
                        }}
                      >
                        <div
                          style={{
                            width: "42px",
                            height: "42px",
                            borderRadius:
                              "14px",
                            background:
                              "var(--bg-light)",
                            display: "flex",
                            alignItems:
                              "center",
                            justifyContent:
                              "center",
                            color:
                              "var(--primary)",
                          }}
                        >
                          <User2
                            size={18}
                          />
                        </div>

                        <div
                          style={{
                            fontWeight: 600,
                          }}
                        >
                          {u.nama}
                        </div>
                      </div>
                    </td>

                    {/* USERNAME */}
                    <td style={tdStyle}>
                      <div
                        style={{
                          fontWeight: 600,
                          color:
                            "var(--text-muted)",
                        }}
                      >
                        @{u.username}
                      </div>
                    </td>

                    {/* ROLE */}
                    <td style={tdStyle}>
                      <div
                        style={{
                          display:
                            "inline-flex",
                          alignItems:
                            "center",
                          gap: "8px",
                          padding:
                            "8px 14px",
                          borderRadius:
                            "999px",
                          background:
                            rc.bg,
                          color: rc.text,
                          fontSize:
                            "13px",
                          fontWeight: 700,
                          whiteSpace:
                            "nowrap",
                        }}
                      >
                        <ShieldCheck
                          size={14}
                        />
                        {u.role}
                      </div>
                    </td>

                    {/* INSTANSI */}
                    <td style={tdStyle}>
                      <div
                        style={{
                          display: "flex",
                          alignItems:
                            "center",
                          gap: "10px",
                          minWidth: "220px",
                        }}
                      >
                        <div
                          style={{
                            width: "38px",
                            height: "38px",
                            borderRadius:
                              "12px",
                            background:
                              "var(--bg-light)",
                            display: "flex",
                            alignItems:
                              "center",
                            justifyContent:
                              "center",
                            color:
                              "var(--primary)",
                          }}
                        >
                          <Building2
                            size={17}
                          />
                        </div>

                        <div
                          style={{
                            lineHeight: 1.6,
                          }}
                        >
                          {u.instansi}
                        </div>
                      </div>
                    </td>

                    {/* STATUS */}
                    <td style={tdStyle}>
                      <button
                        onClick={() =>
                          toggleStatus(
                            u.id
                          )
                        }
                        style={{
                          width: "72px",
                          height: "36px",
                          borderRadius:
                            "999px",
                          border: "none",
                          cursor:
                            "pointer",
                          position:
                            "relative",
                          transition:
                            "all 0.3s ease",
                          background:
                            u.status
                              ? "#DCFCE7"
                              : "#FEE2E2",
                          boxShadow:
                            u.status
                              ? "0 4px 14px rgba(22,163,74,0.18)"
                              : "0 4px 14px rgba(220,38,38,0.15)",
                        }}
                      >
                        {/* LABEL */}
                        <span
                          style={{
                            position:
                              "absolute",
                            left:
                              u.status
                                ? "12px"
                                : "30px",
                            top: "50%",
                            transform:
                              "translateY(-50%)",
                            fontSize:
                              "11px",
                            fontWeight: 700,
                            color:
                              u.status
                                ? "#15803D"
                                : "#DC2626",
                            transition:
                              "all 0.3s ease",
                          }}
                        >
                          {u.status
                            ? "ON"
                            : "OFF"}
                        </span>

                        {/* BULATAN */}
                        <div
                          style={{
                            width: "30px",
                            height:
                              "30px",
                            borderRadius:
                              "999px",
                            background:
                              u.status
                                ? "#16A34A"
                                : "#DC2626",
                            position:
                              "absolute",
                            top: "3px",
                            left:
                              u.status
                                ? "39px"
                                : "3px",
                            transition:
                              "all 0.3s ease",
                            display:
                              "flex",
                            alignItems:
                              "center",
                            justifyContent:
                              "center",
                            color:
                              "white",
                          }}
                        >
                          {u.status ? (
                            <ShieldCheck
                              size={
                                15
                              }
                            />
                          ) : (
                            <ShieldOff
                              size={
                                15
                              }
                            />
                          )}
                        </div>
                      </button>
                    </td>

                    {/* PASSWORD */}
                    <td style={tdStyle}>
                      <button
                        className="btn btn-outline"
                        style={{
                          width: "42px",
                          height: "42px",
                          borderRadius:
                            "14px",
                          padding: 0,
                          display:
                            "flex",
                          alignItems:
                            "center",
                          justifyContent:
                            "center",
                        }}
                      >
                        <KeyRound
                          size={16}
                        />
                      </button>
                    </td>

                    {/* AKSI */}
                    <td style={tdStyle}>
                      <div
                        style={{
                          display: "flex",
                          gap: "10px",
                          flexWrap:
                            "wrap",
                        }}
                      >
                        <button className="btn btn-outline">
                          <Pencil
                            size={16}
                          />
                          Edit
                        </button>

                        <button
                          className="btn"
                          style={{
                            background:
                              "#FEF2F2",
                            color:
                              "#DC2626",
                            border:
                              "1px solid #FECACA",
                          }}
                        >
                          <Trash2
                            size={16}
                          />
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
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
        border:
          "1px solid var(--border)",
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

function TableHead({
  children,
}) {
  return (
    <th
      style={{
        textAlign: "left",
        padding: "18px",
        fontSize: "14px",
        fontWeight: 700,
        color:
          "var(--text-main)",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </th>
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