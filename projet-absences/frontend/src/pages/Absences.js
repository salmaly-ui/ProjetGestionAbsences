import React, { useEffect, useState, useCallback } from "react";
import API from "../services/api";
import { useToast } from "../hooks/useToast";
import Toast from "../components/Toast";
import ConfirmModal from "../components/ConfirmModal";

const colors = {
  primary: "#1e3a8a",
  primaryLight: "#3b82f6",
  primaryDark: "#0f2b6d",
  success: "#10b981",
  danger: "#ef4444",
  warning: "#f59e0b",
  gray: {
    50: "#f9fafb",
    100: "#f3f4f6",
    200: "#e5e7eb",
    300: "#d1d5db",
    400: "#9ca3af",
    500: "#6b7280",
    600: "#4b5563",
    700: "#374151",
    800: "#1f2937",
    900: "#111827",
  },
};

const styles = {
  container: {
    fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
    color: colors.gray[800],
  },
  title: {
    fontSize: "1.75rem",
    fontWeight: "700",
    marginBottom: "1.5rem",
    color: colors.primary,
    letterSpacing: "-0.01em",
  },
  filtersBar: {
    background: "white",
    padding: "1rem 1.25rem",
    borderRadius: "1rem",
    marginBottom: "1.5rem",
    display: "flex",
    flexWrap: "wrap",
    gap: "0.75rem",
    alignItems: "flex-end",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.03)",
    border: `1px solid ${colors.gray[200]}`,
  },
  filterGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "0.25rem",
  },
  filterLabel: {
    fontSize: "0.7rem",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    color: colors.gray[500],
  },
  filterSelect: {
    padding: "0.5rem 0.75rem",
    borderRadius: "0.5rem",
    border: `1px solid ${colors.gray[300]}`,
    fontSize: "0.875rem",
    backgroundColor: "white",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  filterInput: {
    padding: "0.5rem 0.75rem",
    borderRadius: "0.5rem",
    border: `1px solid ${colors.gray[300]}`,
    fontSize: "0.875rem",
    width: "200px",
    transition: "all 0.2s",
  },
  resetButton: {
    background: colors.gray[100],
    border: "none",
    padding: "0.5rem 1rem",
    borderRadius: "0.5rem",
    cursor: "pointer",
    fontWeight: "500",
    fontSize: "0.75rem",
    color: colors.gray[600],
    transition: "all 0.2s",
  },
  tableWrapper: {
    background: "white",
    borderRadius: "1rem",
    overflow: "hidden",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.03)",
    border: `1px solid ${colors.gray[200]}`,
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "0.875rem",
  },
  th: {
    padding: "0.75rem 1rem",
    textAlign: "left",
    fontSize: "0.75rem",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    color: colors.gray[500],
    background: colors.gray[50],
    borderBottom: `1px solid ${colors.gray[200]}`,
  },
  td: {
    padding: "0.75rem 1rem",
    borderBottom: `1px solid ${colors.gray[100]}`,
    verticalAlign: "middle",
  },
  trHover: {
    transition: "background 0.2s ease",
    cursor: "pointer",
  },
  detailButton: {
    background: "#e0e7ff",
    color: colors.primaryDark,
    border: "none",
    padding: "0.25rem 0.75rem",
    borderRadius: "0.5rem",
    marginRight: "0.5rem",
    cursor: "pointer",
    fontSize: "0.75rem",
    fontWeight: "500",
    transition: "all 0.2s",
  },
  validateButton: {
    background: "#dcfce7",
    color: "#166534",
    border: "none",
    padding: "0.25rem 0.75rem",
    borderRadius: "0.5rem",
    marginRight: "0.5rem",
    cursor: "pointer",
    fontSize: "0.75rem",
    fontWeight: "500",
    transition: "all 0.2s",
  },
  refuseButton: {
    background: "#fee2e2",
    color: "#991b1b",
    border: "none",
    padding: "0.25rem 0.75rem",
    borderRadius: "0.5rem",
    cursor: "pointer",
    fontSize: "0.75rem",
    fontWeight: "500",
    transition: "all 0.2s",
  },
  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1100,
    backdropFilter: "blur(4px)",
    animation: "fadeIn 0.2s ease",
  },
  modalContent: {
    background: "white",
    borderRadius: "1.5rem",
    maxWidth: "650px",
    width: "95%",
    maxHeight: "85vh",
    overflowY: "auto",
    padding: "1.75rem",
    boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
    animation: "slideUp 0.3s ease",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1.25rem",
    borderBottom: `2px solid ${colors.gray[100]}`,
    paddingBottom: "0.75rem",
  },
  modalTitle: {
    margin: 0,
    fontSize: "1.25rem",
    color: colors.gray[800],
  },
  closeButton: {
    background: "none",
    border: "none",
    fontSize: "1.5rem",
    cursor: "pointer",
    color: colors.gray[400],
    transition: "color 0.2s",
  },
  infoGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "1rem",
    marginBottom: "1.5rem",
  },
  infoRow: {
    fontSize: "0.875rem",
  },
  infoLabel: {
    color: colors.gray[500],
    display: "block",
    fontSize: "0.7rem",
    fontWeight: "600",
    textTransform: "uppercase",
    marginBottom: "0.25rem",
  },
  infoValue: {
    fontWeight: "500",
    color: colors.gray[800],
  },
  docSection: {
    marginBottom: "1.5rem",
    padding: "0.75rem",
    background: colors.gray[50],
    borderRadius: "1rem",
  },
  docLink: {
    color: colors.primaryLight,
    textDecoration: "none",
    fontWeight: "500",
    fontSize: "0.875rem",
    display: "inline-flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  historySection: {
    marginBottom: "1.5rem",
  },
  historyTitle: {
    fontSize: "0.875rem",
    fontWeight: "600",
    marginBottom: "0.75rem",
    color: colors.gray[600],
  },
  historyItem: {
    borderLeft: `3px solid ${colors.primaryLight}`,
    paddingLeft: "0.75rem",
    marginBottom: "0.75rem",
    paddingBottom: "0.5rem",
    borderBottom: `1px solid ${colors.gray[100]}`,
  },
  actionButtons: {
    display: "flex",
    gap: "0.75rem",
    marginTop: "1rem",
  },
};


const globalStyles = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes slideUp {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  button, select, input {
    transition: all 0.2s ease;
  }
  button:hover {
    transform: translateY(-1px);
  }
`;

export default function Absences() {
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [logs, setLogs] = useState([]);
  const [filtreStatut, setFiltreStatut] = useState("");
  const [filtreDateDebut, setFiltreDateDebut] = useState("");
  const [filtreDateFin, setFiltreDateFin] = useState("");
  const [filtreEtudiant, setFiltreEtudiant] = useState("");
  const [confirmState, setConfirmState] = useState({ isOpen: false, action: null, id: null });
  const [commentValue, setCommentValue] = useState("");

  const { toast, showToast } = useToast();

  const load = useCallback(() => {
    setLoading(true);
    API.get("/absences")
      .then((res) => { setData(res.data); setFiltered(res.data); })
      .catch(() => showToast("Erreur chargement", "error"))
      .finally(() => setLoading(false));
  }, [showToast]);

  useEffect(() => { load(); }, [load]);

  const normalizeStatus = (status) => !status || status === "soumise" ? "en_attente" : status;

  useEffect(() => {
    let result = [...data];
    if (filtreStatut) result = result.filter(a => normalizeStatus(a.status) === filtreStatut);
    if (filtreDateDebut) result = result.filter(a => new Date(a.start_date) >= new Date(filtreDateDebut));
    if (filtreDateFin) result = result.filter(a => new Date(a.end_date) <= new Date(filtreDateFin));
    if (filtreEtudiant) { const term = filtreEtudiant.toLowerCase(); result = result.filter(a => a.nom?.toLowerCase().includes(term) || a.email?.toLowerCase().includes(term)); }
    setFiltered(result);
  }, [filtreStatut, filtreDateDebut, filtreDateFin, filtreEtudiant, data]);

  const openDetail = async (absence) => {
    setSelected(absence);
    API.get(`/absences/${absence.id}/logs`).then(res => setLogs(res.data)).catch(() => setLogs([]));
    const currentStatus = absence.status || "en_attente";
    if (currentStatus === "en_attente" || currentStatus === "soumise") {
      try {
        await API.post("/absences/encours", { id: absence.id });
        setData(prev => prev.map(a => a.id === absence.id ? { ...a, status: "en_cours" } : a));
        setSelected(prev => prev && prev.id === absence.id ? { ...prev, status: "en_cours" } : prev);
      } catch (err) { showToast("Erreur mise à jour du statut", "error"); }
    }
  };

  const closeDetail = () => { setSelected(null); setLogs([]); };

  const promptComment = (action, id) => {
    setCommentValue(action === "validate" ? "Validé" : "Dossier incomplet");
    setConfirmState({ isOpen: true, action, id });
  };

  const handleConfirm = async () => {
    const { action, id } = confirmState;
    const endpoint = action === "validate" ? "/absences/validate" : "/absences/refuse";
    try {
      await API.post(endpoint, { id, comment: commentValue });
      showToast(`Absence ${action === "validate" ? "validée" : "refusée"} avec succès`, "success");
      load();
      closeDetail();
    } catch (err) {
      showToast(err.response?.data?.message || "Erreur", "error");
    } finally {
      setConfirmState({ isOpen: false, action: null, id: null });
      setCommentValue("");
    }
  };

  if (loading) return <div style={{ padding: "40px", textAlign: "center", color: colors.gray[500] }}>Chargement des absences...</div>;

  return (
    <>
      <style>{globalStyles}</style>
      {toast && <Toast message={toast.message} type={toast.type} />}
      <ConfirmModal
        isOpen={confirmState.isOpen}
        onClose={() => setConfirmState({ isOpen: false, action: null, id: null })}
        onConfirm={handleConfirm}
        title={confirmState.action === "validate" ? "Valider l'absence" : "Refuser l'absence"}
        message={
          <>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: 500 }}>Commentaire :</label>
            <textarea
              value={commentValue}
              onChange={e => setCommentValue(e.target.value)}
              style={{ width: "100%", padding: "8px", borderRadius: "8px", border: `1px solid ${colors.gray[300]}`, marginTop: "8px" }}
              rows="3"
            />
          </>
        }
      />

      <div style={styles.container}>
        <h2 style={styles.title}>Gestion des absences</h2>

        {/* Filtres */}
        <div style={styles.filtersBar}>
          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Statut</label>
            <select value={filtreStatut} onChange={e => setFiltreStatut(e.target.value)} style={styles.filterSelect}>
              <option value="">Tous</option>
              <option value="en_attente">En attente</option>
              <option value="en_cours">En cours</option>
              <option value="acceptee">Acceptée</option>
              <option value="refusee">Refusée</option>
            </select>
          </div>
          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Date début ≥</label>
            <input type="date" value={filtreDateDebut} onChange={e => setFiltreDateDebut(e.target.value)} style={styles.filterInput} />
          </div>
          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Date fin ≤</label>
            <input type="date" value={filtreDateFin} onChange={e => setFiltreDateFin(e.target.value)} style={styles.filterInput} />
          </div>
          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Étudiant</label>
            <input type="text" placeholder="Rechercher..." value={filtreEtudiant} onChange={e => setFiltreEtudiant(e.target.value)} style={styles.filterInput} />
          </div>
          <button onClick={() => { setFiltreStatut(""); setFiltreDateDebut(""); setFiltreDateFin(""); setFiltreEtudiant(""); }} style={styles.resetButton}>
            Réinitialiser
          </button>
        </div>

        {/* Tableau */}
        {filtered.length === 0 ? (
          <div style={{ background: "white", borderRadius: "1rem", padding: "2.5rem", textAlign: "center", color: colors.gray[400] }}>
            Aucune absence trouvée
          </div>
        ) : (
          <div style={styles.tableWrapper}>
            <div style={{ overflowX: "auto" }}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Étudiant</th>
                    <th style={styles.th}>Début</th>
                    <th style={styles.th}>Fin</th>
                    <th style={styles.th}>Motif</th>
                    <th style={styles.th}>Statut</th>
                    <th style={styles.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((a) => (
                    <tr key={a.id} style={{ borderBottom: `1px solid ${colors.gray[100]}` }} onMouseEnter={e => e.currentTarget.style.background = colors.gray[50]} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                      <td style={styles.td}>{a.nom}</td>
                      <td style={styles.td}>{new Date(a.start_date).toLocaleDateString("fr-FR")}</td>
                      <td style={styles.td}>{new Date(a.end_date).toLocaleDateString("fr-FR")}</td>
                      <td style={{ ...styles.td, maxWidth: "200px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }} title={a.reason}>
                        {a.reason?.slice(0, 30) || "—"}
                      </td>
                      <td style={styles.td}>
                        <StatusBadge status={a.status} />
                      </td>
                      <td style={styles.td}>
                        <button onClick={() => openDetail(a)} style={styles.detailButton}>
                          🔍 Détails
                        </button>
                        {!["acceptee", "refusee"].includes(a.status) && (
                          <>
                            <button onClick={() => promptComment("validate", a.id)} style={styles.validateButton}>
                              ✔ Valider
                            </button>
                            <button onClick={() => promptComment("refuse", a.id)} style={styles.refuseButton}>
                              ❌ Refuser
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal détail */}
        {selected && (
          <div style={styles.modalOverlay} onClick={closeDetail}>
            <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
              <div style={styles.modalHeader}>
                <h3 style={styles.modalTitle}>Détail de l'absence #{selected.id}</h3>
                <button onClick={closeDetail} style={styles.closeButton}>✕</button>
              </div>

              <div style={styles.infoGrid}>
                <InfoRow label="Étudiant" value={selected.nom} />
                <InfoRow label="Email" value={selected.email} />
                <InfoRow label="Date début" value={new Date(selected.start_date).toLocaleDateString("fr-FR")} />
                <InfoRow label="Date fin" value={new Date(selected.end_date).toLocaleDateString("fr-FR")} />
                <InfoRow label="Durée" value={`${Math.ceil((new Date(selected.end_date) - new Date(selected.start_date)) / (1000 * 60 * 60 * 24) + 1)} jour(s)`} />
                <InfoRow label="Motif" value={selected.reason || "—"} />
                <InfoRow label="Statut" value={<StatusBadge status={selected.status} />} />
                {selected.agent_comment && <InfoRow label="Commentaire agent" value={selected.agent_comment} />}
              </div>

              {selected.file_path && (
                <div style={styles.docSection}>
                  <div style={{ fontSize: "0.875rem", fontWeight: "600", marginBottom: "0.5rem", color: colors.gray[600] }}>📎 Justificatif</div>
                  <a href={`http://localhost:5000/${selected.file_path}`} target="_blank" rel="noreferrer" style={styles.docLink}>
                    📄 Ouvrir le document
                  </a>
                </div>
              )}

              <div style={styles.historySection}>
                <div style={styles.historyTitle}>📜 Historique des statuts</div>
                {logs.length === 0 ? (
                  <div style={{ color: colors.gray[400], fontSize: "0.875rem" }}>Aucun historique</div>
                ) : (
                  <div style={{ maxHeight: "250px", overflowY: "auto" }}>
                    {logs.map((log, i) => (
                      <div key={i} style={styles.historyItem}>
                        <div style={{ fontSize: "0.875rem" }}>
                          <strong>{log.old_status || "—"}</strong> → <strong>{log.new_status}</strong>
                          {log.agent_nom && <span style={{ color: colors.gray[500] }}> par {log.agent_nom}</span>}
                        </div>
                        {log.comment && <div style={{ fontSize: "0.75rem", color: colors.gray[500], marginTop: "0.25rem" }}>"{log.comment}"</div>}
                        <div style={{ fontSize: "0.7rem", color: colors.gray[400], marginTop: "0.25rem" }}>{new Date(log.changed_at).toLocaleString()}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {!["acceptee", "refusee"].includes(selected.status) && (
                <div style={styles.actionButtons}>
                  <button onClick={() => promptComment("validate", selected.id)} style={{ ...styles.validateButton, flex: 1, padding: "0.5rem" }}>
                    ✔ Valider l'absence
                  </button>
                  <button onClick={() => promptComment("refuse", selected.id)} style={{ ...styles.refuseButton, flex: 1, padding: "0.5rem" }}>
                     Refuser l'absence
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// Composants auxiliaires
const InfoRow = ({ label, value }) => (
  <div style={styles.infoRow}>
    <span style={styles.infoLabel}>{label}</span>
    <span style={styles.infoValue}>{value}</span>
  </div>
);

const StatusBadge = ({ status }) => {
  const map = {
    en_attente: { bg: "#dbeafe", color: "#1e40af", label: "en attente" },
    en_cours: { bg: "#fed7aa", color: "#9a3412", label: "en cours" },
    acceptee: { bg: "#d1fae5", color: "#065f46", label: "acceptée" },
    refusee: { bg: "#fee2e2", color: "#991b1b", label: "refusée" },
  };
  const s = map[status] || { bg: colors.gray[200], color: colors.gray[700], label: status || "en attente" };
  return <span style={{ background: s.bg, color: s.color, padding: "0.25rem 0.75rem", borderRadius: "2rem", fontSize: "0.7rem", fontWeight: "600", display: "inline-block" }}>{s.label}</span>;
};