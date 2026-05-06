import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useUKS, Q_STATUS, VERIFY } from "../context/UKSContext";
import { TIERS } from "../data/questions";
import { useToast } from "../components/Toast";

const TIER_KEYS = ["dasar", "madya", "utama", "paripurna"];

export default function UserPage() {
  const { user, logout } = useAuth();
  const { getSchoolData, updateAnswer, submitQuestion, editQuestion } = useUKS();
  const { showToast } = useToast();

  const schoolId = user.school.id;

  // Local draft state per question (before submit)
  const [localDrafts, setLocalDrafts] = useState({});
  const [linkInputs, setLinkInputs] = useState({});
  const [openTiers, setOpenTiers] = useState({ dasar: true, madya: false, utama: false, paripurna: false });

  const sd = getSchoolData(schoolId);
  const answers = sd.answers || {};
  const verifikasi = sd.verifikasi || {};

  // Merge: if local draft exists, use it; otherwise use saved
  function getEffective(key) {
    return localDrafts[key] !== undefined ? localDrafts[key] : (answers[key] || null);
  }

  function setLocalMemenuhi(key, val) {
    const existing = getEffective(key) || { memenuhi: null, bukti: { files: [], links: [] } };
    setLocalDrafts((p) => ({ ...p, [key]: { ...existing, memenuhi: val } }));
  }

  function handleFileUpload(e, key) {
    const file = e.target.files[0];
    if (!file) return;
    const allowed = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];
    if (!allowed.includes(file.type)) { showToast("Hanya JPG, PNG, atau PDF yang didukung", "error"); return; }
    if (file.size > 5 * 1024 * 1024) { showToast("Ukuran file maksimal 5MB", "error"); return; }
    const reader = new FileReader();
    reader.onload = (ev) => {
      setLocalDrafts((p) => {
        const existing = p[key] || answers[key] || { memenuhi: null, bukti: { files: [], links: [] } };
        return {
          ...p,
          [key]: {
            ...existing,
            bukti: {
              ...(existing.bukti || { files: [], links: [] }),
              files: [...(existing.bukti?.files || []), { name: file.name, type: file.type, data: ev.target.result }],
            },
          },
        };
      });
    };
    reader.readAsDataURL(file);
  }

  function removeFile(key, idx) {
    setLocalDrafts((p) => {
      const existing = p[key] || answers[key] || { memenuhi: null, bukti: { files: [], links: [] } };
      return {
        ...p,
        [key]: {
          ...existing,
          bukti: { ...(existing.bukti || {}), files: (existing.bukti?.files || []).filter((_, i) => i !== idx) },
        },
      };
    });
  }

  function addLink(key) {
    const link = (linkInputs[key] || "").trim();
    if (!link) return;
    if (!link.startsWith("http")) { showToast("Link harus diawali https://", "error"); return; }
    setLocalDrafts((p) => {
      const existing = p[key] || answers[key] || { memenuhi: null, bukti: { files: [], links: [] } };
      return {
        ...p,
        [key]: {
          ...existing,
          bukti: { ...(existing.bukti || {}), links: [...(existing.bukti?.links || []), link] },
        },
      };
    });
    setLinkInputs((p) => ({ ...p, [key]: "" }));
  }

  function removeLink(key, idx) {
    setLocalDrafts((p) => {
      const existing = p[key] || answers[key] || { memenuhi: null, bukti: { files: [], links: [] } };
      return {
        ...p,
        [key]: {
          ...existing,
          bukti: { ...(existing.bukti || {}), links: (existing.bukti?.links || []).filter((_, i) => i !== idx) },
        },
      };
    });
  }

  function handleSubmitQuestion(key) {
    const draft = getEffective(key);
    if (!draft || draft.memenuhi === null || draft.memenuhi === undefined) {
      showToast("Pilih Memenuhi atau Belum Memenuhi dulu", "error");
      return;
    }
    updateAnswer(schoolId, key, draft.memenuhi, draft.bukti);
    submitQuestion(schoolId, key);
    // clear local draft
    setLocalDrafts((p) => { const n = { ...p }; delete n[key]; return n; });
    showToast("Soal berhasil dikirim ke verifikator ✓");
  }

  function handleEditQuestion(key) {
    editQuestion(schoolId, key);
    // seed local draft with current saved data
    setLocalDrafts((p) => ({ ...p, [key]: { ...answers[key] } }));
    showToast("Soal dibuka untuk diedit", "info");
  }

  // Tier stats
  function getTierStats(tk) {
    const qs = TIERS[tk].questions;
    const submitted = qs.filter((_, i) => answers[`${tk}_${i}`]?.qStatus === Q_STATUS.SUBMITTED).length;
    const total = qs.length;
    return { submitted, total };
  }

  function getTierVerifStatus(tk) {
    const qs = TIERS[tk].questions;
    const verifiedKeys = qs.map((_, i) => `${tk}_${i}`).filter((k) => verifikasi[k]?.finalized);
    if (verifiedKeys.length === 0) return null;
    const hasBelum = verifiedKeys.some((k) => verifikasi[k]?.status === VERIFY.BELUM);
    return hasBelum ? VERIFY.BELUM : VERIFY.MEMENUHI;
  }

  const totalSubmitted = TIER_KEYS.reduce((a, tk) => a + getTierStats(tk).submitted, 0);

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f3" }}>
      {/* Header */}
      <div style={stickyHeader}>
        <div>
          <div style={{ fontWeight: 600, fontSize: 15 }}>Penilaian UKS</div>
          <div style={{ fontSize: 12, color: "#888" }}>{user.school.name}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 20, background: "#E6F1FB", color: "#185FA5", fontWeight: 600 }}>
            {totalSubmitted} soal terkirim
          </span>
          <button onClick={logout} style={outlineBtn}>Keluar</button>
        </div>
      </div>

      <div style={{ maxWidth: 700, margin: "0 auto", padding: "20px 16px" }}>
        {/* Tier overview */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginBottom: 16 }}>
          {TIER_KEYS.map((tk) => {
            const tier = TIERS[tk];
            const stats = getTierStats(tk);
            const verifStatus = getTierVerifStatus(tk);
            return (
              <div key={tk} style={{ background: "white", borderRadius: 10, border: "0.5px solid #e0e0e0", padding: "10px 10px", textAlign: "center" }}>
                <div style={{ fontSize: 16, fontWeight: 600, color: tier.color }}>{stats.submitted}/{stats.total}</div>
                <div style={{ fontSize: 10, color: "#888", marginTop: 2 }}>{tier.label}</div>
                {verifStatus && (
                  <div style={{ marginTop: 4 }}>
                    <span style={{ fontSize: 10, padding: "1px 6px", borderRadius: 20, fontWeight: 600,
                      background: verifStatus === VERIFY.BELUM ? "#FCEBEB" : "#E1F5EE",
                      color: verifStatus === VERIFY.BELUM ? "#E24B4A" : "#1D9E75" }}>
                      {verifStatus === VERIFY.BELUM ? "Ada catatan" : "✓ Memenuhi"}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Tier sections */}
        {TIER_KEYS.map((tk) => {
          const tier = TIERS[tk];
          const isOpen = openTiers[tk];
          const stats = getTierStats(tk);

          return (
            <div key={tk} style={{ background: "white", borderRadius: 12, border: "0.5px solid #e0e0e0", marginBottom: 12, overflow: "hidden" }}>
              <div onClick={() => setOpenTiers((p) => ({ ...p, [tk]: !p[tk] }))}
                style={{ padding: "13px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", userSelect: "none" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 20, background: tier.bgColor, color: tier.color, fontWeight: 600 }}>{tier.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 500 }}>{stats.submitted}/{stats.total} terkirim</span>
                </div>
                <span style={{ color: "#aaa", transform: isOpen ? "rotate(90deg)" : "none", transition: "transform 0.2s", fontSize: 12 }}>▶</span>
              </div>

              {isOpen && (
                <div style={{ borderTop: "0.5px solid #f0f0ee" }}>
                  {tier.questions.map((q, i) => {
                    const key = `${tk}_${i}`;
                    const saved = answers[key];
                    const effective = getEffective(key);
                    const qStatus = saved?.qStatus || Q_STATUS.DRAFT;
                    const isEditing = qStatus === Q_STATUS.EDITING || (localDrafts[key] !== undefined && qStatus !== Q_STATUS.SUBMITTED);
                    const isSubmitted = qStatus === Q_STATUS.SUBMITTED && localDrafts[key] === undefined;
                    const verif = verifikasi[key];
                    const bukti = effective?.bukti || { files: [], links: [] };

                    return (
                      <div key={i} style={{
                        padding: "14px 16px", borderBottom: "0.5px solid #f8f8f8",
                        background: isSubmitted ? "#FAFFFE" : "white"
                      }}>
                        {/* Question header */}
                        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10, marginBottom: 10 }}>
                          <div style={{ fontSize: 13, color: "#333", lineHeight: 1.6, flex: 1 }}>
                            <span style={{ color: "#bbb", marginRight: 6 }}>{i + 1}.</span>{q}
                          </div>
                          <QStatusChip qStatus={qStatus} hasLocal={localDrafts[key] !== undefined} />
                        </div>

                        {/* Admin feedback (if verified) */}
                        {verif?.finalized && (
                          <div style={{
                            marginBottom: 10, padding: "8px 12px", borderRadius: 8,
                            background: verif.status === VERIFY.BELUM ? "#FCEBEB" : "#E1F5EE",
                            border: `0.5px solid ${verif.status === VERIFY.BELUM ? "#F5C0C0" : "#A0DEC8"}`
                          }}>
                            <div style={{ fontSize: 11, fontWeight: 600, color: verif.status === VERIFY.BELUM ? "#E24B4A" : "#1D9E75" }}>
                              {verif.status === VERIFY.BELUM ? "✕ Belum Memenuhi — Catatan Admin:" : "✓ Diverifikasi Admin"}
                            </div>
                            {verif.catatan && <div style={{ fontSize: 12, color: "#555", marginTop: 2 }}>{verif.catatan}</div>}
                          </div>
                        )}

                        {/* If submitted and not editing: show summary + edit button */}
                        {isSubmitted ? (
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <span style={{
                                fontSize: 12, padding: "3px 10px", borderRadius: 20, fontWeight: 600,
                                background: saved?.memenuhi ? "#E1F5EE" : "#FCEBEB",
                                color: saved?.memenuhi ? "#1D9E75" : "#E24B4A"
                              }}>
                                {saved?.memenuhi ? "✓ Memenuhi" : "✕ Belum Memenuhi"}
                              </span>
                              {((saved?.bukti?.files?.length || 0) + (saved?.bukti?.links?.length || 0)) > 0 && (
                                <span style={{ fontSize: 11, color: "#888" }}>
                                  {(saved?.bukti?.files?.length || 0) + (saved?.bukti?.links?.length || 0)} bukti dukung
                                </span>
                              )}
                            </div>
                            <button onClick={() => handleEditQuestion(key)} style={editBtn}>
                              ✎ Edit
                            </button>
                          </div>
                        ) : (
                          /* Edit/draft form */
                          <>
                            {/* Memenuhi toggle */}
                            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                              <button onClick={() => setLocalMemenuhi(key, true)}
                                style={toggleBtn(effective?.memenuhi === true, "#1D9E75", "#E1F5EE")}>
                                ✓ Memenuhi
                              </button>
                              <button onClick={() => setLocalMemenuhi(key, false)}
                                style={toggleBtn(effective?.memenuhi === false, "#E24B4A", "#FCEBEB")}>
                                ✕ Belum Memenuhi
                              </button>
                            </div>

                            {/* Bukti dukung */}
                            <div style={{ background: "#fafafa", borderRadius: 8, border: "0.5px solid #eee", padding: "10px 12px", marginBottom: 10 }}>
                              <div style={{ fontSize: 11, fontWeight: 600, color: "#888", marginBottom: 8 }}>BUKTI DUKUNG</div>
                              {bukti.files?.map((f, fi) => (
                                <div key={fi} style={filePill}>
                                  <span>{f.type === "application/pdf" ? "📄" : "🖼️"}</span>
                                  <span style={{ fontSize: 12, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "#444" }}>{f.name}</span>
                                  {f.type !== "application/pdf" && <img src={f.data} alt="" style={{ width: 32, height: 32, objectFit: "cover", borderRadius: 4 }} />}
                                  <button onClick={() => removeFile(key, fi)} style={rmBtn}>×</button>
                                </div>
                              ))}
                              {bukti.links?.map((link, li) => (
                                <div key={li} style={filePill}>
                                  <span>🔗</span>
                                  <a href={link} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, flex: 1, color: "#185FA5", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{link}</a>
                                  <button onClick={() => removeLink(key, li)} style={rmBtn}>×</button>
                                </div>
                              ))}
                              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 4 }}>
                                <label style={uploadLabel}>
                                  + Foto/PDF
                                  <input type="file" accept="image/jpeg,image/png,application/pdf" style={{ display: "none" }} onChange={(e) => handleFileUpload(e, key)} />
                                </label>
                                <div style={{ display: "flex", gap: 4, flex: 1, minWidth: 200 }}>
                                  <input type="text" placeholder="https://drive.google.com/..."
                                    value={linkInputs[key] || ""}
                                    onChange={(e) => setLinkInputs((p) => ({ ...p, [key]: e.target.value }))}
                                    onKeyDown={(e) => e.key === "Enter" && addLink(key)}
                                    style={linkInput} />
                                  <button onClick={() => addLink(key)} style={addLinkBtn}>+ Link</button>
                                </div>
                              </div>
                            </div>

                            {/* Submit question */}
                            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                              <button onClick={() => handleSubmitQuestion(key)} style={submitQBtn}>
                                Kirim Soal Ini →
                              </button>
                              {qStatus === Q_STATUS.EDITING && (
                                <button onClick={() => {
                                  setLocalDrafts((p) => { const n = { ...p }; delete n[key]; return n; });
                                  editQuestion(schoolId, key); // revert to submitted
                                  // actually revert qStatus
                                  submitQuestion(schoolId, key);
                                }} style={cancelBtn}>
                                  Batal Edit
                                </button>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function QStatusChip({ qStatus, hasLocal }) {
  if (hasLocal || qStatus === Q_STATUS.EDITING) {
    return <span style={{ ...chip, background: "#FFF0CC", color: "#854F0B" }}>✎ Sedang Diedit</span>;
  }
  if (qStatus === Q_STATUS.SUBMITTED) {
    return <span style={{ ...chip, background: "#E1F5EE", color: "#1D9E75" }}>✓ Terkirim</span>;
  }
  return <span style={{ ...chip, background: "#f0f0ee", color: "#888" }}>Draft</span>;
}

const chip = { fontSize: 10, padding: "2px 8px", borderRadius: 20, fontWeight: 600, whiteSpace: "nowrap", flexShrink: 0 };

const stickyHeader = {
  background: "white", borderBottom: "0.5px solid #e0e0e0",
  padding: "12px 20px", display: "flex", justifyContent: "space-between",
  alignItems: "center", position: "sticky", top: 0, zIndex: 10
};
const outlineBtn = { padding: "5px 12px", borderRadius: 8, border: "0.5px solid #d0d0d0", background: "transparent", fontSize: 12, color: "#666", cursor: "pointer" };
const editBtn = { padding: "5px 12px", borderRadius: 8, border: "0.5px solid #d0d0d0", background: "white", fontSize: 12, color: "#555", cursor: "pointer", whiteSpace: "nowrap" };
const cancelBtn = { padding: "7px 12px", borderRadius: 8, border: "0.5px solid #d0d0d0", background: "white", fontSize: 12, color: "#888", cursor: "pointer" };
const submitQBtn = { padding: "7px 16px", borderRadius: 8, border: "none", background: "#1D9E75", color: "white", fontSize: 12, fontWeight: 600, cursor: "pointer" };
const filePill = { display: "flex", alignItems: "center", gap: 8, marginBottom: 6, padding: "5px 8px", background: "white", borderRadius: 6, border: "0.5px solid #e0e0e0" };
const rmBtn = { width: 20, height: 20, borderRadius: "50%", border: "none", background: "#eee", color: "#888", fontSize: 14, cursor: "pointer", flexShrink: 0, lineHeight: 1, display: "flex", alignItems: "center", justifyContent: "center" };
const uploadLabel = { display: "inline-flex", alignItems: "center", gap: 4, padding: "5px 10px", borderRadius: 6, border: "0.5px dashed #c0c0c0", fontSize: 12, color: "#666", cursor: "pointer", background: "white" };
const linkInput = { flex: 1, padding: "5px 8px", borderRadius: 6, border: "0.5px solid #d0d0d0", fontSize: 12, background: "white" };
const addLinkBtn = { padding: "5px 10px", borderRadius: 6, border: "none", background: "#185FA5", color: "white", fontSize: 12, cursor: "pointer" };
const toggleBtn = (active, activeColor, activeBg) => ({
  padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer",
  border: `0.5px solid ${active ? activeColor : "#d0d0d0"}`,
  background: active ? activeBg : "white", color: active ? activeColor : "#888", transition: "all 0.1s",
});
