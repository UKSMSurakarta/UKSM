import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useUKS, Q_STATUS, VERIFY } from "../context/UKSContext";
import { TIERS, SCHOOLS } from "../data/questions";
import { useToast } from "../components/Toast";

const TIER_KEYS = ["dasar", "madya", "utama", "paripurna"];

export default function AdminPage() {
  const { logout } = useAuth();
  const { getAllSchoolData, updateVerifikasi, submitVerifikasiQuestion } = useUKS();
  const { showToast } = useToast();

  const [selectedSchool, setSelectedSchool] = useState(null);
  const [openTiers, setOpenTiers] = useState({ dasar: true, madya: false, utama: false, paripurna: false });
  const [localVerif, setLocalVerif] = useState({}); // { key: { status, catatan } }

  const allData = getAllSchoolData();
  const submittedSchools = SCHOOLS.filter((s) => {
    const sd = allData[s.id];
    if (!sd?.answers) return false;
    return Object.values(sd.answers).some((a) => a.qStatus === Q_STATUS.SUBMITTED);
  });

  function getSchoolSummary(schoolId) {
    const sd = allData[schoolId] || {};
    const answers = sd.answers || {};
    const verif = sd.verifikasi || {};
    const submitted = Object.values(answers).filter((a) => a.qStatus === Q_STATUS.SUBMITTED).length;
    const finalized = Object.values(verif).filter((v) => v?.finalized).length;
    const belum = Object.values(verif).filter((v) => v?.finalized && v.status === VERIFY.BELUM).length;
    return { submitted, finalized, belum };
  }

  function getTierStatus(schoolId, tk) {
    const sd = allData[schoolId] || {};
    const qs = TIERS[tk].questions;
    const finalizedKeys = qs.map((_, i) => `${tk}_${i}`).filter((k) => sd.verifikasi?.[k]?.finalized);
    if (finalizedKeys.length === 0) return null;
    const hasBelum = finalizedKeys.some((k) => sd.verifikasi[k].status === VERIFY.BELUM);
    return hasBelum ? VERIFY.BELUM : VERIFY.MEMENUHI;
  }

  function handleVerifChange(schoolId, key, field, val) {
    const lk = `${schoolId}_${key}`;
    setLocalVerif((p) => ({ ...p, [lk]: { ...(p[lk] || {}), [field]: val } }));
    // also persist immediately to context
    const existing = allData[schoolId]?.verifikasi?.[key] || {};
    updateVerifikasi(schoolId, key,
      field === "status" ? val : (localVerif[lk]?.status || existing.status || VERIFY.PENDING),
      field === "catatan" ? val : (localVerif[lk]?.catatan ?? existing.catatan ?? "")
    );
  }

  function handleSubmitVerifQuestion(schoolId, key) {
    const lk = `${schoolId}_${key}`;
    const local = localVerif[lk];
    const existing = allData[schoolId]?.verifikasi?.[key] || {};
    const status = local?.status || existing.status;
    const catatan = local?.catatan ?? existing.catatan ?? "";
    if (!status || status === VERIFY.PENDING) {
      showToast("Pilih Memenuhi atau Belum Memenuhi dulu", "error");
      return;
    }
    submitVerifikasiQuestion(schoolId, key, status, catatan);
    showToast(status === VERIFY.MEMENUHI ? "Diverifikasi: Memenuhi ✓" : "Diverifikasi: Belum Memenuhi");
  }

  // ── School list ──────────────────────────────────────────────
  if (!selectedSchool) {
    return (
      <div style={{ minHeight: "100vh", background: "#f5f5f3" }}>
        <div style={stickyHeader}>
          <div>
            <div style={{ fontWeight: 600, fontSize: 15 }}>Panel Admin — Verifikasi UKS</div>
            <div style={{ fontSize: 12, color: "#888" }}>{submittedSchools.length} sekolah ada soal terkirim</div>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 20, background: "#FAEEDA", color: "#854F0B", fontWeight: 600 }}>Admin</span>
            <button onClick={logout} style={outlineBtn}>Keluar</button>
          </div>
        </div>

        <div style={{ maxWidth: 700, margin: "0 auto", padding: "20px 16px" }}>
          {submittedSchools.length === 0 && (
            <div style={{ textAlign: "center", padding: 48, color: "#bbb", fontSize: 14 }}>
              Belum ada sekolah yang mengirim soal
            </div>
          )}
          {submittedSchools.map((school) => {
            const summary = getSchoolSummary(school.id);
            return (
              <div key={school.id} style={{ background: "white", borderRadius: 12, border: "0.5px solid #e0e0e0", padding: "16px 18px", marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{school.name}</div>
                  <button onClick={() => { setSelectedSchool(school); setOpenTiers({ dasar: true, madya: false, utama: false, paripurna: false }); }}
                    style={{ padding: "7px 14px", borderRadius: 8, border: "none", background: "#1D9E75", color: "white", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                    Verifikasi →
                  </button>
                </div>

                {/* Tier chips */}
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
                  {TIER_KEYS.map((tk) => {
                    const ts = getTierStatus(school.id, tk);
                    const sd = allData[school.id] || {};
                    const qs = TIERS[tk].questions;
                    const submittedInTier = qs.filter((_, i) => sd.answers?.[`${tk}_${i}`]?.qStatus === Q_STATUS.SUBMITTED).length;
                    if (submittedInTier === 0) return null;
                    return (
                      <span key={tk} style={{
                        fontSize: 11, padding: "2px 9px", borderRadius: 20, fontWeight: 600,
                        background: ts === VERIFY.BELUM ? "#FCEBEB" : ts === VERIFY.MEMENUHI ? "#E1F5EE" : TIERS[tk].bgColor,
                        color: ts === VERIFY.BELUM ? "#E24B4A" : ts === VERIFY.MEMENUHI ? "#1D9E75" : TIERS[tk].color,
                      }}>
                        {TIERS[tk].label}: {submittedInTier} soal
                        {ts === VERIFY.BELUM ? " · Ada catatan" : ts === VERIFY.MEMENUHI ? " · ✓" : ""}
                      </span>
                    );
                  })}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
                  {[
                    { label: "Soal dikirim", val: summary.submitted, color: "#185FA5", bg: "#E6F1FB" },
                    { label: "Diverifikasi", val: summary.finalized, color: "#1D9E75", bg: "#E1F5EE" },
                    { label: "Perlu perbaikan", val: summary.belum, color: "#E24B4A", bg: "#FCEBEB" },
                  ].map((s) => (
                    <div key={s.label} style={{ background: s.bg, borderRadius: 8, padding: "8px 10px", textAlign: "center" }}>
                      <div style={{ fontSize: 20, fontWeight: 600, color: s.color }}>{s.val}</div>
                      <div style={{ fontSize: 10, color: s.color, opacity: 0.8 }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ── Detail: per-question verification ──────────────────────
  const sd = allData[selectedSchool.id] || {};
  const answers = sd.answers || {};
  const verifikasi = sd.verifikasi || {};

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f3" }}>
      <div style={stickyHeader}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={() => setSelectedSchool(null)} style={{ ...outlineBtn, padding: "6px 12px" }}>← Kembali</button>
          <div>
            <div style={{ fontWeight: 600, fontSize: 15 }}>{selectedSchool.name}</div>
            <div style={{ fontSize: 12, color: "#888" }}>Verifikasi per soal</div>
          </div>
        </div>
        <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 20, background: "#FAEEDA", color: "#854F0B", fontWeight: 600 }}>Admin</span>
      </div>

      <div style={{ maxWidth: 700, margin: "0 auto", padding: "20px 16px" }}>
        {/* Legend */}
        <div style={{ background: "white", borderRadius: 10, border: "0.5px solid #e0e0e0", padding: "10px 14px", marginBottom: 16, display: "flex", gap: 16, flexWrap: "wrap" }}>
          <div style={{ fontSize: 12, color: "#666" }}>
            <span style={{ ...chip, background: "#E1F5EE", color: "#1D9E75" }}>✓ Terkirim</span> Soal sudah dikirim sekolah — bisa diverifikasi
          </div>
          <div style={{ fontSize: 12, color: "#666" }}>
            <span style={{ ...chip, background: "#f0f0ee", color: "#888" }}>Draft</span> Belum dikirim sekolah
          </div>
        </div>

        {TIER_KEYS.map((tk) => {
          const tier = TIERS[tk];
          const isOpen = openTiers[tk];
          const qs = TIERS[tk].questions;
          const submittedInTier = qs.filter((_, i) => answers[`${tk}_${i}`]?.qStatus === Q_STATUS.SUBMITTED).length;

          return (
            <div key={tk} style={{ background: "white", borderRadius: 12, border: "0.5px solid #e0e0e0", marginBottom: 12, overflow: "hidden" }}>
              <div onClick={() => setOpenTiers((p) => ({ ...p, [tk]: !p[tk] }))}
                style={{ padding: "13px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", userSelect: "none" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 20, background: tier.bgColor, color: tier.color, fontWeight: 600 }}>{tier.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 500 }}>{submittedInTier} soal dikirim sekolah</span>
                </div>
                <span style={{ color: "#aaa", transform: isOpen ? "rotate(90deg)" : "none", transition: "transform 0.2s", fontSize: 12 }}>▶</span>
              </div>

              {isOpen && (
                <div style={{ borderTop: "0.5px solid #f0f0ee" }}>
                  {qs.map((q, i) => {
                    const key = `${tk}_${i}`;
                    const ans = answers[key];
                    const qStatus = ans?.qStatus || Q_STATUS.DRAFT;
                    const isQSubmitted = qStatus === Q_STATUS.SUBMITTED;
                    const verifData = verifikasi[key];
                    const isFinalized = verifData?.finalized;
                    const lk = `${selectedSchool.id}_${key}`;
                    const localV = localVerif[lk];
                    const currentStatus = localV?.status ?? verifData?.status ?? "";
                    const currentCatatan = localV?.catatan ?? verifData?.catatan ?? "";
                    const bukti = ans?.bukti || { files: [], links: [] };

                    return (
                      <div key={i} style={{
                        padding: "14px 16px", borderBottom: "0.5px solid #f8f8f8",
                        background: !isQSubmitted ? "#f9f9f9" : isFinalized ? "#FAFFFE" : "white",
                        opacity: !isQSubmitted ? 0.6 : 1,
                      }}>
                        {/* Header row */}
                        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10, marginBottom: 8 }}>
                          <div style={{ fontSize: 13, color: "#333", lineHeight: 1.6, flex: 1 }}>
                            <span style={{ color: "#bbb", marginRight: 6 }}>{i + 1}.</span>{q}
                          </div>
                          {/* Status chips */}
                          <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "flex-end", flexShrink: 0 }}>
                            <QStatusChip qStatus={qStatus} />
                            {isFinalized && <VerifFinalChip status={verifData.status} />}
                          </div>
                        </div>

                        {!isQSubmitted && (
                          <div style={{ fontSize: 12, color: "#aaa", fontStyle: "italic" }}>Sekolah belum mengirim soal ini</div>
                        )}

                        {isQSubmitted && (
                          <>
                            {/* School self-assessment */}
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                              <span style={{ fontSize: 11, color: "#888" }}>Penilaian sekolah:</span>
                              <span style={{
                                fontSize: 12, padding: "2px 10px", borderRadius: 20, fontWeight: 600,
                                background: ans?.memenuhi ? "#E1F5EE" : "#FCEBEB",
                                color: ans?.memenuhi ? "#1D9E75" : "#E24B4A"
                              }}>
                                {ans?.memenuhi ? "✓ Memenuhi" : "✕ Belum Memenuhi"}
                              </span>
                              {ans?.submittedAt && <span style={{ fontSize: 11, color: "#bbb" }}>{ans.submittedAt}</span>}
                            </div>

                            {/* Bukti dukung */}
                            {(bukti.files?.length > 0 || bukti.links?.length > 0) && (
                              <div style={{ background: "#fafafa", borderRadius: 8, border: "0.5px solid #eee", padding: "8px 12px", marginBottom: 10 }}>
                                <div style={{ fontSize: 11, fontWeight: 600, color: "#888", marginBottom: 6 }}>BUKTI DUKUNG</div>
                                {bukti.files?.map((f, fi) => (
                                  <div key={fi} style={filePill}>
                                    <span>{f.type === "application/pdf" ? "📄" : "🖼️"}</span>
                                    <span style={{ fontSize: 12, flex: 1, color: "#444" }}>{f.name}</span>
                                    {f.type !== "application/pdf" && (
                                      <img src={f.data} alt="" onClick={() => window.open(f.data)} style={{ width: 40, height: 40, objectFit: "cover", borderRadius: 4, cursor: "pointer" }} />
                                    )}
                                  </div>
                                ))}
                                {bukti.links?.map((link, li) => (
                                  <div key={li} style={filePill}>
                                    <span>🔗</span>
                                    <a href={link} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: "#185FA5" }}>{link}</a>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Verifikasi form */}
                            <div style={{ background: "#f5f5f3", borderRadius: 8, padding: "10px 12px" }}>
                              <div style={{ fontSize: 11, fontWeight: 600, color: "#888", marginBottom: 8 }}>
                                VERIFIKASI ADMIN
                                {isFinalized && <span style={{ fontWeight: 400, color: "#aaa", marginLeft: 6 }}>· Diverifikasi {verifData.verifiedAt}</span>}
                              </div>
                              <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                                <button
                                  onClick={() => !isFinalized && handleVerifChange(selectedSchool.id, key, "status", VERIFY.MEMENUHI)}
                                  disabled={isFinalized}
                                  style={verifyToggleBtn(currentStatus === VERIFY.MEMENUHI, "#1D9E75", "#E1F5EE", isFinalized)}
                                >✓ Memenuhi</button>
                                <button
                                  onClick={() => !isFinalized && handleVerifChange(selectedSchool.id, key, "status", VERIFY.BELUM)}
                                  disabled={isFinalized}
                                  style={verifyToggleBtn(currentStatus === VERIFY.BELUM, "#E24B4A", "#FCEBEB", isFinalized)}
                                >✕ Belum Memenuhi</button>
                              </div>
                              <textarea
                                value={currentCatatan}
                                onChange={(e) => !isFinalized && handleVerifChange(selectedSchool.id, key, "catatan", e.target.value)}
                                disabled={isFinalized}
                                placeholder="Tulis catatan jika belum memenuhi..."
                                rows={2}
                                style={{
                                  width: "100%", padding: "7px 9px", borderRadius: 7,
                                  border: "0.5px solid #d0d0d0", fontSize: 12, color: "#333",
                                  resize: "none", background: isFinalized ? "#f0f0ee" : "white",
                                  boxSizing: "border-box", marginBottom: 8
                                }}
                              />
                              {!isFinalized && (
                                <button onClick={() => handleSubmitVerifQuestion(selectedSchool.id, key)} style={submitVerifBtn}>
                                  Submit Verifikasi Soal Ini →
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

function QStatusChip({ qStatus }) {
  if (qStatus === Q_STATUS.SUBMITTED) return <span style={{ ...chip, background: "#E1F5EE", color: "#1D9E75" }}>✓ Terkirim</span>;
  if (qStatus === Q_STATUS.EDITING) return <span style={{ ...chip, background: "#FFF0CC", color: "#854F0B" }}>✎ Diedit Ulang</span>;
  return <span style={{ ...chip, background: "#f0f0ee", color: "#aaa" }}>Draft</span>;
}

function VerifFinalChip({ status }) {
  return (
    <span style={{
      ...chip,
      background: status === VERIFY.BELUM ? "#FCEBEB" : "#E6F1FB",
      color: status === VERIFY.BELUM ? "#E24B4A" : "#185FA5"
    }}>
      {status === VERIFY.BELUM ? "✕ Belum" : "✓ Verified"}
    </span>
  );
}

const chip = { fontSize: 10, padding: "2px 8px", borderRadius: 20, fontWeight: 600, whiteSpace: "nowrap" };

const stickyHeader = {
  background: "white", borderBottom: "0.5px solid #e0e0e0",
  padding: "12px 20px", display: "flex", justifyContent: "space-between",
  alignItems: "center", position: "sticky", top: 0, zIndex: 10
};
const outlineBtn = { padding: "5px 12px", borderRadius: 8, border: "0.5px solid #d0d0d0", background: "transparent", fontSize: 12, color: "#666", cursor: "pointer" };
const filePill = { display: "flex", alignItems: "center", gap: 8, marginBottom: 6, padding: "5px 8px", background: "white", borderRadius: 6, border: "0.5px solid #e0e0e0" };
const submitVerifBtn = { padding: "7px 14px", borderRadius: 8, border: "none", background: "#185FA5", color: "white", fontSize: 12, fontWeight: 600, cursor: "pointer" };
const verifyToggleBtn = (active, activeColor, activeBg, disabled) => ({
  padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600,
  border: `0.5px solid ${active ? activeColor : "#d0d0d0"}`,
  background: active ? activeBg : "white", color: active ? activeColor : "#888",
  cursor: disabled ? "default" : "pointer", transition: "all 0.1s", opacity: disabled ? 0.7 : 1,
});
