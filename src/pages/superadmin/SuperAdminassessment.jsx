import { useState } from "react";
import {
  ClipboardList,
  CheckCircle2,
  Clock3,
  AlertTriangle,
  Search,
  Filter,
  Eye,
  Plus,
  Trash2,
  Pencil,
  Save,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

/* =========================================================
   DUMMY DATA ASSESSMENT
========================================================= */

const dummyData = [
  {
    id: 1,
    sekolah: "SDN Sukamaju 01",
    jenjang: "SD",
    periode: "Ganjil 26/27",
    progress: 100,
    status: "Selesai",
  },
  {
    id: 2,
    sekolah: "SMPN 4 Surakarta",
    jenjang: "SMP",
    periode: "Ganjil 26/27",
    progress: 76,
    status: "Menunggu Verifikasi",
  },
  {
    id: 3,
    sekolah: "SMAN 1 Nusantara",
    jenjang: "SMA",
    periode: "Ganjil 26/27",
    progress: 48,
    status: "Belum Selesai",
  },
];

const statusConfig = {
  Selesai: {
    bg: "#DCFCE7",
    text: "#15803D",
    icon: <CheckCircle2 size={14} />,
  },
  "Menunggu Verifikasi": {
    bg: "#FEF3C7",
    text: "#B45309",
    icon: <Clock3 size={14} />,
  },
  "Belum Selesai": {
    bg: "#FEE2E2",
    text: "#DC2626",
    icon: <AlertTriangle size={14} />,
  },
};

/* =========================================================
   KUISIONER
========================================================= */

const initialQuestions = {
  dasar: [
    "Sekolah memiliki ruang UKS",
    "Sekolah memiliki kotak P3K",
    "Terdapat jadwal piket UKS",
  ],

  madya: [
    "Terdapat dokter kecil",
    "Sekolah memiliki program PHBS",
  ],

  utama: [
    "Sekolah memiliki kerja sama puskesmas",
    "Sekolah memiliki laporan kesehatan",
  ],

  paripurna: [
    "Sekolah memiliki monitoring UKS berkala",
  ],
};

const tierMeta = {
  dasar: {
    label: "Tier Dasar",
    color: "#2563EB",
    bg: "#DBEAFE",
  },

  madya: {
    label: "Tier Madya",
    color: "#D97706",
    bg: "#FEF3C7",
  },

  utama: {
    label: "Tier Utama",
    color: "#16A34A",
    bg: "#DCFCE7",
  },

  paripurna: {
    label: "Tier Paripurna",
    color: "#9333EA",
    bg: "#F3E8FF",
  },
};

export default function SuperAdminAssessment() {
  const [questions, setQuestions] =
    useState(initialQuestions);

  const [openTier, setOpenTier] = useState({
    dasar: true,
    madya: false,
    utama: false,
    paripurna: false,
  });

  const [newQuestion, setNewQuestion] =
    useState({});

  /* =========================================================
     TAMBAH PERTANYAAN
  ========================================================= */

  function addQuestion(tier) {
    const text = (
      newQuestion[tier] || ""
    ).trim();

    if (!text) return;

    setQuestions((prev) => ({
      ...prev,
      [tier]: [...prev[tier], text],
    }));

    setNewQuestion((prev) => ({
      ...prev,
      [tier]: "",
    }));
  }

  /* =========================================================
     HAPUS PERTANYAAN
  ========================================================= */

  function deleteQuestion(tier, idx) {
    setQuestions((prev) => ({
      ...prev,
      [tier]: prev[tier].filter(
        (_, i) => i !== idx
      ),
    }));
  }

  /* =========================================================
     EDIT PERTANYAAN
  ========================================================= */

  function editQuestion(
    tier,
    idx,
    value
  ) {
    setQuestions((prev) => ({
      ...prev,
      [tier]: prev[tier].map((q, i) =>
        i === idx ? value : q
      ),
    }));
  }

  return (
    <div style={{ width: "100%" }}>
      {/* =========================================================
          HEADER
      ========================================================= */}

      <div
        className="flex items-start justify-between mb-6"
        style={{
          gap: "16px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <h1
            style={{
              fontSize:
                "clamp(22px,4vw,32px)",
              fontWeight: 800,
              marginBottom: "8px",
            }}
          >
            Manajemen Assessment
          </h1>

          <p
            className="text-muted"
            style={{
              fontSize: "14px",
              lineHeight: 1.7,
            }}
          >
            Pantau dan kelola assessment
            UKS seluruh sekolah serta
            manajemen kuisioner UKS.
          </p>
        </div>
      </div>

      {/* =========================================================
          STATISTIC
      ========================================================= */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(180px,1fr))",
          gap: "18px",
          marginBottom: "28px",
        }}
      >
        {[
          {
            label: "Total Sekolah",
            value: dummyData.length,
            color: "var(--primary)",
          },

          {
            label: "Selesai",
            value: dummyData.filter(
              (d) =>
                d.status === "Selesai"
            ).length,
            color: "#16A34A",
          },

          {
            label:
              "Menunggu Verifikasi",
            value: dummyData.filter(
              (d) =>
                d.status ===
                "Menunggu Verifikasi"
            ).length,
            color: "#D97706",
          },

          {
            label: "Belum Selesai",
            value: dummyData.filter(
              (d) =>
                d.status ===
                "Belum Selesai"
            ).length,
            color: "#DC2626",
          },
        ].map((s, i) => (
          <div
            key={i}
            className="card"
            style={{
              padding: "20px",
              borderRadius: "20px",
              border:
                "1px solid var(--border)",
            }}
          >
            <div
              style={{
                fontSize: "13px",
                color:
                  "var(--text-muted)",
                marginBottom: "8px",
              }}
            >
              {s.label}
            </div>

            <div
              style={{
                fontSize: "32px",
                fontWeight: 800,
                color: s.color,
              }}
            >
              {s.value}
            </div>
          </div>
        ))}
      </div>

      {/* =========================================================
          TABLE ASSESSMENT
      ========================================================= */}

      <div
        className="card glass-panel"
        style={{
          padding: "28px",
          borderRadius: "28px",
          marginBottom: "28px",
        }}
      >
        {/* FILTER */}

        <div
          style={{
            display: "flex",
            gap: "14px",
            marginBottom: "24px",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              position: "relative",
              flex: 1,
              minWidth: "200px",
            }}
          >
            <Search
              size={16}
              style={{
                position: "absolute",
                left: "14px",
                top: "50%",
                transform:
                  "translateY(-50%)",
                color:
                  "var(--text-muted)",
              }}
            />

            <input
              type="text"
              placeholder="Cari sekolah..."
              style={{
                width: "100%",
                height: "46px",
                borderRadius: "14px",
                border:
                  "1px solid var(--border)",
                background:
                  "var(--bg-light)",
                paddingLeft: "42px",
                paddingRight: "14px",
                outline: "none",
                fontSize: "14px",
              }}
            />
          </div>

          <div
            style={{
              position: "relative",
            }}
          >
            <Filter
              size={16}
              style={{
                position: "absolute",
                left: "14px",
                top: "50%",
                transform:
                  "translateY(-50%)",
                color:
                  "var(--text-muted)",
              }}
            />

            <select
              style={{
                height: "46px",
                borderRadius: "14px",
                border:
                  "1px solid var(--border)",
                background:
                  "var(--bg-light)",
                paddingLeft: "40px",
                paddingRight: "18px",
                outline: "none",
                fontSize: "14px",
              }}
            >
              <option>
                Semua Status
              </option>

              <option>Selesai</option>

              <option>
                Menunggu Verifikasi
              </option>

              <option>
                Belum Selesai
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
              minWidth: "760px",
            }}
          >
            <thead>
              <tr
                style={{
                  background:
                    "var(--bg-light)",
                }}
              >
                {[
                  "Nama Sekolah",
                  "Jenjang",
                  "Periode",
                  "Progress",
                  "Status",
                  "Aksi",
                ].map((h) => (
                  <th
                    key={h}
                    style={{
                      textAlign: "left",
                      padding:
                        "16px 18px",
                      fontSize: "13px",
                      fontWeight: 700,
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {dummyData.map((row) => {
                const sc =
                  statusConfig[
                    row.status
                  ];

                return (
                  <tr
                    key={row.id}
                    style={{
                      borderBottom:
                        "1px solid var(--border)",
                    }}
                  >
                    <td
                      style={{
                        padding:
                          "16px 18px",
                        fontWeight: 600,
                      }}
                    >
                      {row.sekolah}
                    </td>

                    <td
                      style={{
                        padding:
                          "16px 18px",
                      }}
                    >
                      {row.jenjang}
                    </td>

                    <td
                      style={{
                        padding:
                          "16px 18px",
                      }}
                    >
                      {row.periode}
                    </td>

                    <td
                      style={{
                        padding:
                          "16px 18px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems:
                            "center",
                          gap: "10px",
                          minWidth:
                            "170px",
                        }}
                      >
                        <div
                          style={{
                            flex: 1,
                            height: "8px",
                            borderRadius:
                              "999px",
                            background:
                              "#E5E7EB",
                            overflow:
                              "hidden",
                          }}
                        >
                          <div
                            style={{
                              width: `${row.progress}%`,
                              height:
                                "100%",
                              borderRadius:
                                "999px",
                              background:
                                row.progress >=
                                80
                                  ? "#16A34A"
                                  : row.progress >=
                                    60
                                  ? "#F59E0B"
                                  : "#DC2626",
                            }}
                          />
                        </div>

                        <span
                          style={{
                            fontWeight: 700,
                            fontSize:
                              "13px",
                          }}
                        >
                          {row.progress}%
                        </span>
                      </div>
                    </td>

                    <td
                      style={{
                        padding:
                          "16px 18px",
                      }}
                    >
                      <span
                        style={{
                          background:
                            sc.bg,
                          color:
                            sc.text,
                          padding:
                            "5px 12px",
                          borderRadius:
                            "999px",
                          fontSize:
                            "12px",
                          fontWeight: 700,
                          display:
                            "inline-flex",
                          alignItems:
                            "center",
                          gap: "5px",
                        }}
                      >
                        {sc.icon}
                        {row.status}
                      </span>
                    </td>

                    <td
                      style={{
                        padding:
                          "16px 18px",
                      }}
                    >
                      <button
                        className="btn btn-outline"
                        style={{
                          padding:
                            "6px 14px",
                          borderRadius:
                            "10px",
                          fontSize:
                            "13px",
                          display:
                            "flex",
                          alignItems:
                            "center",
                          gap: "5px",
                        }}
                      >
                        <Eye size={13} />
                        Detail
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* =========================================================
          MANAJEMEN KUISIONER
      ========================================================= */}

      <div
        className="card glass-panel"
        style={{
          padding: "28px",
          borderRadius: "28px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent:
              "space-between",
            marginBottom: "24px",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          <div>
            <h2
              style={{
                fontSize: "26px",
                fontWeight: 800,
                marginBottom: "8px",
              }}
            >
              Manajemen Kuisioner
            </h2>

            <p
              style={{
                color:
                  "var(--text-muted)",
                fontSize: "14px",
              }}
            >
              Tambah, edit, dan hapus
              pertanyaan semua tier UKS.
            </p>
          </div>

          <div
            style={{
              background:
                "linear-gradient(135deg,var(--primary),var(--secondary))",
              color: "white",
              padding: "10px 18px",
              borderRadius: "14px",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <ClipboardList size={18} />
            {
              Object.values(
                questions
              ).flat().length
            }{" "}
            Pertanyaan
          </div>
        </div>

        {/* TIER */}

        {Object.keys(questions).map(
          (tierKey) => {
            const tier =
              tierMeta[tierKey];

            return (
              <div
                key={tierKey}
                style={{
                  border:
                    "1px solid var(--border)",
                  borderRadius:
                    "22px",
                  overflow:
                    "hidden",
                  marginBottom:
                    "20px",
                }}
              >
                {/* HEADER */}

                <div
                  onClick={() =>
                    setOpenTier(
                      (prev) => ({
                        ...prev,
                        [tierKey]:
                          !prev[
                            tierKey
                          ],
                      })
                    )
                  }
                  style={{
                    padding:
                      "18px 22px",
                    background:
                      "var(--bg-light)",
                    display:
                      "flex",
                    justifyContent:
                      "space-between",
                    alignItems:
                      "center",
                    cursor:
                      "pointer",
                  }}
                >
                  <div
                    style={{
                      display:
                        "flex",
                      alignItems:
                        "center",
                      gap: "12px",
                    }}
                  >
                    <div
                      style={{
                        background:
                          tier.bg,
                        color:
                          tier.color,
                        padding:
                          "6px 14px",
                        borderRadius:
                          "999px",
                        fontSize:
                          "13px",
                        fontWeight: 700,
                      }}
                    >
                      {tier.label}
                    </div>

                    <span
                      style={{
                        fontWeight: 600,
                        color:
                          "var(--text-muted)",
                      }}
                    >
                      {
                        questions[
                          tierKey
                        ].length
                      }{" "}
                      Pertanyaan
                    </span>
                  </div>

                  {openTier[
                    tierKey
                  ] ? (
                    <ChevronUp
                      size={18}
                    />
                  ) : (
                    <ChevronDown
                      size={18}
                    />
                  )}
                </div>

                {/* CONTENT */}

                {openTier[tierKey] && (
                  <div
                    style={{
                      padding:
                        "22px",
                    }}
                  >
                    {/* LIST */}

                    {questions[
                      tierKey
                    ].map(
                      (
                        question,
                        idx
                      ) => (
                        <div
                          key={idx}
                          style={{
                            background:
                              "#FAFAFA",
                            border:
                              "1px solid #eee",
                            borderRadius:
                              "18px",
                            padding:
                              "18px",
                            marginBottom:
                              "16px",
                          }}
                        >
                          <div
                            style={{
                              display:
                                "flex",
                              justifyContent:
                                "space-between",
                              gap: "16px",
                              flexWrap:
                                "wrap",
                            }}
                          >
                            <div
                              style={{
                                flex: 1,
                                minWidth:
                                  "220px",
                              }}
                            >
                              <div
                                style={{
                                  fontSize:
                                    "13px",
                                  fontWeight: 700,
                                  color:
                                    tier.color,
                                  marginBottom:
                                    "8px",
                                }}
                              >
                                Pertanyaan{" "}
                                {idx + 1}
                              </div>

                              <textarea
                                value={
                                  question
                                }
                                onChange={(
                                  e
                                ) =>
                                  editQuestion(
                                    tierKey,
                                    idx,
                                    e
                                      .target
                                      .value
                                  )
                                }
                                style={{
                                  width:
                                    "100%",
                                  minHeight:
                                    "90px",
                                  borderRadius:
                                    "14px",
                                  border:
                                    "1px solid #ddd",
                                  padding:
                                    "14px",
                                  outline:
                                    "none",
                                  resize:
                                    "vertical",
                                  fontSize:
                                    "14px",
                                }}
                              />
                            </div>

                            <div
                              style={{
                                display:
                                  "flex",
                                gap: "10px",
                                alignItems:
                                  "flex-start",
                              }}
                            >
                              <button
                                style={{
                                  width:
                                    "42px",
                                  height:
                                    "42px",
                                  border:
                                    "none",
                                  borderRadius:
                                    "12px",
                                  background:
                                    "#DBEAFE",
                                  color:
                                    "#2563EB",
                                  display:
                                    "flex",
                                  alignItems:
                                    "center",
                                  justifyContent:
                                    "center",
                                  cursor:
                                    "pointer",
                                }}
                              >
                                <Save
                                  size={
                                    18
                                  }
                                />
                              </button>

                              <button
                                onClick={() =>
                                  deleteQuestion(
                                    tierKey,
                                    idx
                                  )
                                }
                                style={{
                                  width:
                                    "42px",
                                  height:
                                    "42px",
                                  border:
                                    "none",
                                  borderRadius:
                                    "12px",
                                  background:
                                    "#FEE2E2",
                                  color:
                                    "#DC2626",
                                  display:
                                    "flex",
                                  alignItems:
                                    "center",
                                  justifyContent:
                                    "center",
                                  cursor:
                                    "pointer",
                                }}
                              >
                                <Trash2
                                  size={
                                    18
                                  }
                                />
                              </button>
                            </div>
                          </div>
                        </div>
                      )
                    )}

                    {/* ADD */}

                    <div
                      style={{
                        marginTop:
                          "18px",
                        border:
                          "2px dashed #d1d5db",
                        borderRadius:
                          "18px",
                        padding:
                          "20px",
                      }}
                    >
                      <div
                        style={{
                          fontWeight: 700,
                          marginBottom:
                            "12px",
                        }}
                      >
                        Tambah Pertanyaan
                        Baru
                      </div>

                      <div
                        style={{
                          display:
                            "flex",
                          gap: "12px",
                          flexWrap:
                            "wrap",
                        }}
                      >
                        <input
                          type="text"
                          value={
                            newQuestion[
                              tierKey
                            ] || ""
                          }
                          onChange={(
                            e
                          ) =>
                            setNewQuestion(
                              (
                                prev
                              ) => ({
                                ...prev,
                                [tierKey]:
                                  e
                                    .target
                                    .value,
                              })
                            )
                          }
                          placeholder="Masukkan pertanyaan baru..."
                          style={{
                            flex: 1,
                            minWidth:
                              "240px",
                            height:
                              "50px",
                            borderRadius:
                              "14px",
                            border:
                              "1px solid #ddd",
                            padding:
                              "0 16px",
                            outline:
                              "none",
                            fontSize:
                              "14px",
                          }}
                        />

                        <button
                          onClick={() =>
                            addQuestion(
                              tierKey
                            )
                          }
                          style={{
                            height:
                              "50px",
                            padding:
                              "0 22px",
                            border:
                              "none",
                            borderRadius:
                              "14px",
                            background:
                              tier.color,
                            color:
                              "white",
                            fontWeight: 700,
                            display:
                              "flex",
                            alignItems:
                              "center",
                            gap: "8px",
                            cursor:
                              "pointer",
                          }}
                        >
                          <Plus
                            size={18}
                          />
                          Tambah
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          }
        )}
      </div>
    </div>
  );
}
