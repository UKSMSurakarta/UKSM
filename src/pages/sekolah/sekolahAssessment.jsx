import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  useUKS,
  TIER_STATUS,
  VERIFY,
  TIER_KEYS,
} from "../../context/UKSContext";
import { TIERS } from "../../data/questions";
import { useToast } from "../../components/Toast";

import {
  Activity,
  CheckCircle,
  Clock,
  ShieldCheck,
  Upload,
  Link as LinkIcon,
} from "lucide-react";

const CANVA_URL = "https://canva.link/uuuecrycswqr5sf";

export default function SekolahAssessment() {
  const { user, logout } = useAuth();

  const {
    getSchoolData,
    updateAnswer,
    submitTier,
    setCertificateName,
  } = useUKS();

  const { showToast } = useToast();

  const schoolId = user.school.id;

  const sd = getSchoolData(schoolId);

  const {
    tierStatus,
    answers,
    verifikasi,
    completed,
    certificateName,
  } = sd;

  const [localAnswers, setLocalAnswers] = useState({});
  const [linkInputs, setLinkInputs] = useState({});

  const [openTiers, setOpenTiers] = useState({
    dasar: true,
    madya: false,
    utama: false,
    paripurna: false,
  });

  const [confirmTier, setConfirmTier] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [certName, setCertName] = useState(
    certificateName || ""
  );

  const [certSaved, setCertSaved] = useState(
    !!certificateName
  );

  function getAns(key) {
    return localAnswers[key] !== undefined
      ? localAnswers[key]
      : answers[key] || null;
  }

  function setMemenuhi(key, val) {
    const existing = getAns(key) || {
      memenuhi: null,
      bukti: {
        files: [],
        links: [],
      },
    };

    setLocalAnswers((p) => ({
      ...p,
      [key]: {
        ...existing,
        memenuhi: val,
      },
    }));
  }

  function handleFile(e, key) {
    const file = e.target.files[0];

    if (!file) return;

    if (
      ![
        "image/jpeg",
        "image/png",
        "image/jpg",
        "application/pdf",
      ].includes(file.type)
    ) {
      showToast("Hanya JPG, PNG, atau PDF", "error");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast("Maksimal 5MB", "error");
      return;
    }

    const reader = new FileReader();

    reader.onload = (ev) => {
      setLocalAnswers((p) => {
        const ex = p[key] ||
          answers[key] || {
            memenuhi: null,
            bukti: {
              files: [],
              links: [],
            },
          };

        return {
          ...p,
          [key]: {
            ...ex,
            bukti: {
              ...(ex.bukti || {}),
              files: [
                ...(ex.bukti?.files || []),
                {
                  name: file.name,
                  type: file.type,
                  data: ev.target.result,
                },
              ],
            },
          },
        };
      });
    };

    reader.readAsDataURL(file);
  }

  function removeFile(key, idx) {
    setLocalAnswers((p) => {
      const ex = p[key] ||
        answers[key] || {
          memenuhi: null,
          bukti: {
            files: [],
            links: [],
          },
        };

      return {
        ...p,
        [key]: {
          ...ex,
          bukti: {
            ...(ex.bukti || {}),
            files: (ex.bukti?.files || []).filter(
              (_, i) => i !== idx
            ),
          },
        },
      };
    });
  }

  function addLink(key) {
    const link = (linkInputs[key] || "").trim();

    if (!link) return;

    if (!link.startsWith("http")) {
      showToast(
        "Link harus diawali https://",
        "error"
      );
      return;
    }

    setLocalAnswers((p) => {
      const ex = p[key] ||
        answers[key] || {
          memenuhi: null,
          bukti: {
            files: [],
            links: [],
          },
        };

      return {
        ...p,
        [key]: {
          ...ex,
          bukti: {
            ...(ex.bukti || {}),
            links: [
              ...(ex.bukti?.links || []),
              link,
            ],
          },
        },
      };
    });

    setLinkInputs((p) => ({
      ...p,
      [key]: "",
    }));
  }

  function removeLink(key, idx) {
    setLocalAnswers((p) => {
      const ex = p[key] ||
        answers[key] || {
          memenuhi: null,
          bukti: {
            files: [],
            links: [],
          },
        };

      return {
        ...p,
        [key]: {
          ...ex,
          bukti: {
            ...(ex.bukti || {}),
            links: (ex.bukti?.links || []).filter(
              (_, i) => i !== idx
            ),
          },
        },
      };
    });
  }

  function isTierComplete(tk) {
    return TIERS[tk].questions.every((_, i) => {
      const key = `${tk}_${i}`;

      const a = getAns(key);

      return (
        a &&
        a.memenuhi !== null &&
        a.memenuhi !== undefined
      );
    });
  }

  async function handleSubmitTier(tk) {
    TIERS[tk].questions.forEach((_, i) => {
      const key = `${tk}_${i}`;

      const a = getAns(key);

      if (a) {
        updateAnswer(
          schoolId,
          key,
          a.memenuhi,
          a.bukti
        );
      }
    });

    setSubmitting(true);

    await new Promise((r) => setTimeout(r, 600));

    submitTier(schoolId, tk);

    setSubmitting(false);

    setConfirmTier(null);

    const isLast = tk === "paripurna";

    showToast(
      isLast
        ? "Semua kategori selesai! 🎉"
        : `Kategori ${TIERS[tk].label} berhasil dikunci.`
    );

    if (!isLast) {
      const nextIdx =
        TIER_KEYS.indexOf(tk) + 1;

      setOpenTiers((p) => ({
        ...p,
        [tk]: false,
        [TIER_KEYS[nextIdx]]: true,
      }));
    }
  }

  function handleSaveCertName() {
    if (!certName.trim()) {
      showToast(
        "Nama tidak boleh kosong",
        "error"
      );
      return;
    }

    setCertificateName(
      schoolId,
      certName.trim()
    );

    setCertSaved(true);

    showToast(
      "Nama sertifikat berhasil disimpan"
    );
  }

  const totalAnswered = TIER_KEYS.reduce(
    (acc, tk) =>
      acc +
      TIERS[tk].questions.filter((_, i) => {
        const a = getAns(`${tk}_${i}`);

        return (
          a &&
          a.memenuhi !== null &&
          a.memenuhi !== undefined
        );
      }).length,
    0
  );

  return (
    <div style={{ minHeight: "100vh" }}>
      {/* HEADER */}
      
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "24px 16px 40px",
        }}
      >
        {/* HERO */}
        <div style={heroCard}>
          <div>
            <div style={heroTitle}>
              Self Assessment
            </div>

            <div style={heroSubtitle}>
              Progres Kuisioner UKS Sekolah
            </div>
          </div>

          <div style={heroStatsWrap}>
            <div style={dashboardCard}>
              <div
                style={{
                  ...iconWrap,
                  background: "#E8F7F0",
                  color: "#1D9E75",
                }}
              >
                <Activity size={24} />
              </div>

              <div>
                <div style={cardLabel}>
                  Status
                </div>

                <div style={cardValue}>
                  {completed
                    ? "Selesai"
                    : "Proses"}
                </div>
              </div>
            </div>

            <div style={dashboardCard}>
              <div
                style={{
                  ...iconWrap,
                  background: "#EAF2FD",
                  color: "#185FA5",
                }}
              >
                <CheckCircle size={24} />
              </div>

              <div>
                <div style={cardLabel}>
                  Progress
                </div>

                <div style={cardValue}>
                  {Math.round(
                    (totalAnswered / 48) * 100
                  )}
                  %
                </div>
              </div>
            </div>

            <div style={dashboardCard}>
              <div
                style={{
                  ...iconWrap,
                  background: "#FFF4E5",
                  color: "#f59e0b",
                }}
              >
                <Clock size={24} />
              </div>

              <div>
                <div style={cardLabel}>
                  Total Jawaban
                </div>

                <div style={cardValue}>
                  {totalAnswered}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CERTIFICATE */}
        {completed && (
          <div style={certificateCard}>
            <div style={certificateTitle}>
              🎉 Semua kategori selesai
            </div>

            <div style={certificateDesc}>
              Masukkan nama untuk sertifikat
            </div>

            <div style={certificateInputWrap}>
              <input
                type="text"
                value={certName}
                onChange={(e) => {
                  setCertName(e.target.value);
                  setCertSaved(false);
                }}
                placeholder="Nama lengkap..."
                style={certInput}
              />

              <button
                onClick={handleSaveCertName}
                style={saveBtn}
              >
                Simpan
              </button>
            </div>

            {certSaved && (
              <>
                <iframe
                  src={CANVA_URL}
                  title="certificate"
                  style={{
                    width: "100%",
                    height: 500,
                    border: "none",
                    borderRadius: 12,
                    marginTop: 18,
                  }}
                />

                <a
                  href={CANVA_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={openCanvaBtn}
                >
                  Buka di Canva
                </a>
              </>
            )}
          </div>
        )}

        {/* TIER */}
        {TIER_KEYS.map((tk) => {
          const tier = TIERS[tk];

          const ts =
            tierStatus[tk] ||
            TIER_STATUS.LOCKED;

          const isLocked =
            ts === TIER_STATUS.LOCKED;

          const isSubmitted =
            ts === TIER_STATUS.SUBMITTED;

          const isOpen =
            ts === TIER_STATUS.OPEN;

          const isOpenUI =
            openTiers[tk];

          const complete =
            isTierComplete(tk);

          return (
            <div
              key={tk}
              style={{
                ...tierCard,
                opacity: isLocked ? 0.5 : 1,
              }}
            >
              {/* HEADER */}
              <div
                onClick={() =>
                  !isLocked &&
                  setOpenTiers((p) => ({
                    ...p,
                    [tk]: !p[tk],
                  }))
                }
                style={tierHeader}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <div
                    style={{
                      background: tier.bgColor,
                      color: tier.color,
                      padding: "5px 12px",
                      borderRadius: 999,
                      fontWeight: 700,
                      fontSize: 12,
                    }}
                  >
                    {tier.label}
                  </div>

                  {isSubmitted && (
                    <span
                      style={{
                        color: "#1D9E75",
                        fontSize: 12,
                        fontWeight: 600,
                      }}
                    >
                      ✓ Terkunci
                    </span>
                  )}
                </div>

                <div>
                  {isOpenUI ? "▲" : "▼"}
                </div>
              </div>

              {/* QUESTIONS */}
              {!isLocked &&
                isOpenUI && (
                  <div>
                    {tier.questions.map(
                      (q, i) => {
                        const key = `${tk}_${i}`;

                        const ans =
                          getAns(key);

                        const bukti =
                          ans?.bukti || {
                            files: [],
                            links: [],
                          };

                        const qVerif =
                          verifikasi?.[
                            key
                          ];

                        return (
                          <div
                            key={i}
                            style={
                              questionCard
                            }
                          >
                            <div
                              style={
                                questionText
                              }
                            >
                              {i + 1}. {q}
                            </div>

                            {/* ADMIN */}
                            {qVerif?.finalized && (
                              <div
                                style={{
                                  background:
                                    qVerif.status ===
                                    VERIFY.BELUM
                                      ? "#FCEBEB"
                                      : "#E1F5EE",
                                  padding:
                                    "10px 14px",
                                  borderRadius: 10,
                                  marginBottom: 14,
                                  fontSize: 13,
                                }}
                              >
                                {qVerif.status ===
                                VERIFY.BELUM
                                  ? "✕ Belum memenuhi"
                                  : "✓ Diverifikasi"}

                                <div
                                  style={{
                                    marginTop: 4,
                                  }}
                                >
                                  {
                                    qVerif.catatan
                                  }
                                </div>
                              </div>
                            )}

                            {/* BUTTON */}
                            <div
                              style={{
                                display: "flex",
                                gap: 10,
                                marginBottom: 14,
                              }}
                            >
                              <button
                                onClick={() =>
                                  isOpen &&
                                  setMemenuhi(
                                    key,
                                    true
                                  )
                                }
                                style={toggleBtn(
                                  ans?.memenuhi ===
                                    true,
                                  "#1D9E75",
                                  "#E1F5EE"
                                )}
                              >
                                ✓ Memenuhi
                              </button>

                              <button
                                onClick={() =>
                                  isOpen &&
                                  setMemenuhi(
                                    key,
                                    false
                                  )
                                }
                                style={toggleBtn(
                                  ans?.memenuhi ===
                                    false,
                                  "#E24B4A",
                                  "#FCEBEB"
                                )}
                              >
                                ✕ Belum
                              </button>
                            </div>

                            {/* FILE */}
                            <div
                              style={
                                evidenceBox
                              }
                            >
                              <div
                                style={
                                  evidenceTitle
                                }
                              >
                                Bukti Dukung
                              </div>

                              {bukti.files?.map(
                                (
                                  f,
                                  fi
                                ) => (
                                  <div
                                    key={
                                      fi
                                    }
                                    style={
                                      fileItem
                                    }
                                  >
                                    <div
                                      style={{
                                        display:
                                          "flex",
                                        alignItems:
                                          "center",
                                        gap: 10,
                                      }}
                                    >
                                      <Upload
                                        size={
                                          16
                                        }
                                      />

                                      <span>
                                        {
                                          f.name
                                        }
                                      </span>
                                    </div>

                                    <button
                                      onClick={() =>
                                        removeFile(
                                          key,
                                          fi
                                        )
                                      }
                                      style={
                                        removeBtn
                                      }
                                    >
                                      ×
                                    </button>
                                  </div>
                                )
                              )}

                              {bukti.links?.map(
                                (
                                  l,
                                  li
                                ) => (
                                  <div
                                    key={
                                      li
                                    }
                                    style={
                                      fileItem
                                    }
                                  >
                                    <a
                                      href={
                                        l
                                      }
                                      target="_blank"
                                      rel="noreferrer"
                                      style={{
                                        color:
                                          "#185FA5",
                                        fontSize:
                                          13,
                                      }}
                                    >
                                      {l}
                                    </a>

                                    <button
                                      onClick={() =>
                                        removeLink(
                                          key,
                                          li
                                        )
                                      }
                                      style={
                                        removeBtn
                                      }
                                    >
                                      ×
                                    </button>
                                  </div>
                                )
                              )}

                              {isOpen && (
                                <>
                                  <label
                                    style={
                                      uploadBtn
                                    }
                                  >
                                    <Upload
                                      size={
                                        14
                                      }
                                    />
                                    Upload
                                    <input
                                      type="file"
                                      style={{
                                        display:
                                          "none",
                                      }}
                                      onChange={(
                                        e
                                      ) =>
                                        handleFile(
                                          e,
                                          key
                                        )
                                      }
                                    />
                                  </label>

                                  <div
                                    style={{
                                      display:
                                        "flex",
                                      gap: 8,
                                      marginTop: 12,
                                    }}
                                  >
                                    <input
                                      type="text"
                                      value={
                                        linkInputs[
                                          key
                                        ] ||
                                        ""
                                      }
                                      onChange={(
                                        e
                                      ) =>
                                        setLinkInputs(
                                          (
                                            p
                                          ) => ({
                                            ...p,
                                            [key]:
                                              e
                                                .target
                                                .value,
                                          })
                                        )
                                      }
                                      placeholder="https://..."
                                      style={
                                        linkInput
                                      }
                                    />

                                    <button
                                      onClick={() =>
                                        addLink(
                                          key
                                        )
                                      }
                                      style={
                                        addLinkBtn
                                      }
                                    >
                                      <LinkIcon
                                        size={
                                          14
                                        }
                                      />
                                      Link
                                    </button>
                                  </div>
                                </>
                              )}
                            </div>

                            {/* SUBMIT */}
                            {i ===
                              tier.questions
                                .length -
                                1 &&
                              !isSubmitted && (
                                <button
                                  disabled={
                                    !complete
                                  }
                                  onClick={() =>
                                    complete &&
                                    setConfirmTier(
                                      tk
                                    )
                                  }
                                  style={{
                                    ...submitBtn,
                                    background:
                                      complete
                                        ? tier.color
                                        : "#ccc",
                                    cursor:
                                      complete
                                        ? "pointer"
                                        : "not-allowed",
                                  }}
                                >
                                  Submit{" "}
                                  {
                                    tier.label
                                  }
                                </button>
                              )}
                          </div>
                        );
                      }
                    )}
                  </div>
                )}
            </div>
          );
        })}
      </div>

      {/* MODAL */}
      {confirmTier && (
        <div style={modalOverlay}>
          <div style={modalBox}>
            <ShieldCheck
              size={48}
              color="#1D9E75"
            />

            <div style={modalTitle}>
              Submit Kategori?
            </div>

            <div style={modalDesc}>
              Setelah submit, data tidak
              dapat diubah lagi.
            </div>

            <div style={modalBtnWrap}>
              <button
                onClick={() =>
                  setConfirmTier(null)
                }
                style={outlineBtn}
              >
                Batal
              </button>

              <button
                onClick={() =>
                  handleSubmitTier(
                    confirmTier
                  )
                }
                style={confirmBtn}
              >
                {submitting
                  ? "Menyimpan..."
                  : "Ya Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ========================= */
/* STYLES */
/* ========================= */

const stickyHeader = {
  background: "white",
  borderBottom: "1px solid #e5e7eb",
  padding: "14px 24px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  position: "sticky",
  top: 0,
  zIndex: 100,
};

const progressBadge = {
  background: "#E6F1FB",
  color: "#185FA5",
  padding: "5px 12px",
  borderRadius: 999,
  fontSize: 12,
  fontWeight: 700,
};

const outlineBtn = {
  padding: "8px 14px",
  borderRadius: 10,
  border: "1px solid #d1d5db",
  background: "white",
  cursor: "pointer",
};

const heroCard = {
  background: "linear-gradient(135deg,#185FA5,#1D9E75)",
  borderRadius: 24,
  padding: 28,
  color: "white",
  marginBottom: 24,
};

const heroTitle = {
  fontSize: 30,
  fontWeight: 800,
};

const heroSubtitle = {
  opacity: 0.9,
  marginTop: 6,
};

const heroStatsWrap = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit,minmax(220px,1fr))",
  gap: 16,
  marginTop: 24,
};

const dashboardCard = {
  background: "white",
  borderRadius: 18,
  padding: 18,
  display: "flex",
  alignItems: "center",
  gap: 14,
};

const iconWrap = {
  width: 56,
  height: 56,
  borderRadius: 16,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const cardLabel = {
  fontSize: 12,
  color: "#888",
};

const cardValue = {
  fontSize: 24,
  fontWeight: 800,
  color: "#222",
};

const certificateCard = {
  background: "white",
  borderRadius: 24,
  padding: 24,
  marginBottom: 24,
};

const certificateTitle = {
  fontSize: 24,
  fontWeight: 800,
};

const certificateDesc = {
  color: "#666",
  marginTop: 6,
};

const certificateInputWrap = {
  display: "flex",
  gap: 10,
  marginTop: 18,
};

const certInput = {
  flex: 1,
  padding: "12px 14px",
  borderRadius: 12,
  border: "1px solid #ddd",
};

const saveBtn = {
  padding: "12px 18px",
  borderRadius: 12,
  border: "none",
  background: "#1D9E75",
  color: "white",
  fontWeight: 700,
  cursor: "pointer",
};

const openCanvaBtn = {
  display: "inline-block",
  marginTop: 16,
  background: "#185FA5",
  color: "white",
  padding: "12px 18px",
  borderRadius: 12,
  textDecoration: "none",
};

const tierCard = {
  background: "white",
  borderRadius: 22,
  marginBottom: 20,
  overflow: "hidden",
  border: "1px solid #e5e7eb",
};

const tierHeader = {
  padding: "18px 20px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  cursor: "pointer",
};

const questionCard = {
  padding: 20,
  borderTop: "1px solid #f1f1f1",
};

const questionText = {
  fontSize: 15,
  lineHeight: 1.7,
  fontWeight: 500,
  marginBottom: 16,
};

const evidenceBox = {
  background: "#fafafa",
  border: "1px solid #eee",
  borderRadius: 14,
  padding: 16,
};

const evidenceTitle = {
  fontSize: 12,
  fontWeight: 700,
  color: "#777",
  marginBottom: 12,
};

const fileItem = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "10px 12px",
  borderRadius: 10,
  background: "white",
  marginBottom: 10,
};

const removeBtn = {
  border: "none",
  background: "#efefef",
  width: 24,
  height: 24,
  borderRadius: "50%",
  cursor: "pointer",
};

const uploadBtn = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  background: "white",
  border: "1px dashed #ccc",
  borderRadius: 10,
  padding: "10px 14px",
  cursor: "pointer",
  marginTop: 6,
};

const linkInput = {
  flex: 1,
  borderRadius: 10,
  border: "1px solid #ddd",
  padding: "10px 12px",
};

const addLinkBtn = {
  border: "none",
  background: "#185FA5",
  color: "white",
  padding: "10px 16px",
  borderRadius: 10,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: 6,
};

const submitBtn = {
  width: "100%",
  marginTop: 18,
  border: "none",
  color: "white",
  padding: "14px",
  borderRadius: 14,
  fontWeight: 700,
  fontSize: 15,
};

const modalOverlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.45)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 999,
};

const modalBox = {
  background: "white",
  borderRadius: 24,
  padding: 30,
  width: 380,
  textAlign: "center",
};

const modalTitle = {
  fontSize: 22,
  fontWeight: 800,
  marginTop: 12,
};

const modalDesc = {
  color: "#666",
  marginTop: 8,
};

const modalBtnWrap = {
  display: "flex",
  gap: 12,
  marginTop: 24,
};

const confirmBtn = {
  flex: 1,
  border: "none",
  background: "#1D9E75",
  color: "white",
  borderRadius: 12,
  fontWeight: 700,
  cursor: "pointer",
};

const toggleBtn = (
  active,
  activeColor,
  activeBg
) => ({
  padding: "10px 16px",
  borderRadius: 12,
  border: `1px solid ${
    active
      ? activeColor
      : "#d1d5db"
  }`,
  background: active
    ? activeBg
    : "white",
  color: active
    ? activeColor
    : "#666",
  cursor: "pointer",
  fontWeight: 700,
});