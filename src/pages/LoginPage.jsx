import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  User,
  Lock,
  AlertCircle,
} from "lucide-react";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState("sekolah");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Animation styles
  useEffect(() => {
    const style = document.createElement("style");

    style.innerHTML = `
      @keyframes floatGlow {
        0% {
          transform: translate3d(0px, 0px, 0px) scale(1);
        }

        25% {
          transform: translate3d(80px, -60px, 0px) scale(1.15);
        }

        50% {
          transform: translate3d(-60px, 50px, 0px) scale(0.9);
        }

        75% {
          transform: translate3d(60px, 80px, 0px) scale(1.08);
        }

        100% {
          transform: translate3d(0px, 0px, 0px) scale(1);
        }
      }

      @keyframes pulseGlow {
        0% {
          opacity: 0.22;
        }

        50% {
          opacity: 0.38;
        }

        100% {
          opacity: 0.22;
        }
      }

      @keyframes cardFloat {
        0% {
          transform: translateY(0px);
        }

        50% {
          transform: translateY(-6px);
        }

        100% {
          transform: translateY(0px);
        }
      }
    `;

    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  async function handleLogin(e) {
    e.preventDefault();

    setError("");
    setLoading(true);

    await new Promise((r) => setTimeout(r, 600));

    const result = login(role, username, password);

    if (!result.ok) {
      setError(result.message);
      setLoading(false);
    } else {
      navigate(`/${role}/dashboard`);
    }
  }

  const roleOptions = [
    {
      label: "Sekolah",
      value: "sekolah",
    },
    {
      label: "Admin OPD",
      value: "admin",
    },
    {
      label: "Superadmin",
      value: "superadmin",
    },
    {
      label: "Konten",
      value: "konten",
    },
  ];

  const floatingLights = [
    {
      width: 420,
      height: 420,
      color: "#60A5FA",
      top: "-120px",
      left: "-150px",
      duration: "18s",
    },
    {
      width: 520,
      height: 520,
      color: "#34D399",
      bottom: "-220px",
      right: "-180px",
      duration: "24s",
    },
    {
      width: 340,
      height: 340,
      color: "#A78BFA",
      top: "40%",
      left: "60%",
      duration: "16s",
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top left, #f8fafb, #eef2f3)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
        position: "relative",
        overflow: "hidden",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* Animated Background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          zIndex: 0,
        }}
      >
        {floatingLights.map((light, index) => (
          <div
            key={index}
            style={{
              position: "absolute",
              width: light.width,
              height: light.height,
              background: light.color,
              borderRadius: "50%",
              filter: "blur(90px)",
              opacity: 0.3,
              mixBlendMode: "screen",
              willChange: "transform",
              animation: `
                floatGlow ${light.duration} ease-in-out infinite,
                pulseGlow 7s ease-in-out infinite
              `,
              top: light.top,
              left: light.left,
              right: light.right,
              bottom: light.bottom,
            }}
          />
        ))}

        {/* Noise Overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at center, rgba(255,255,255,0.06), transparent 70%)",
            mixBlendMode: "soft-light",
          }}
        />
      </div>

      {/* Login Card */}
      <div
        style={{
          width: "100%",
          maxWidth: "440px",
          background: "rgba(255,255,255,0.88)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          border: "1px solid rgba(255,255,255,0.45)",
          borderRadius: "28px",
          boxShadow: "0 25px 50px rgba(0,0,0,0.12)",
          padding: "45px",
          position: "relative",
          zIndex: 1,
          animation: "cardFloat 6s ease-in-out infinite",
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "10px",
            marginBottom: "30px",
          }}
        >
          <ShieldCheck
            size={34}
            style={{
              color: "#0F6E56",
            }}
          />

          <h1
            style={{
              margin: 0,
              fontSize: "28px",
              fontWeight: 800,
              color: "#042C53",
              letterSpacing: "-1px",
            }}
          >
            SI-UKS{" "}
            <span style={{ color: "#0F6E56" }}>
              DIGITAL
            </span>
          </h1>
        </div>

        {/* Subtitle */}
        <p
          style={{
            textAlign: "center",
            color: "#6c757d",
            fontSize: "14px",
            marginBottom: "28px",
            lineHeight: 1.7,
          }}
        >
          Masukkan kredensial Anda untuk mengakses
          dashboard SI-UKS Digital.
        </p>

        {/* Role Selector */}
        <div
          style={{
            background: "#f1f3f5",
            padding: "5px",
            borderRadius: "14px",
            display: "flex",
            marginBottom: "28px",
            gap: "4px",
          }}
        >
          {roleOptions.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setRole(item.value)}
              style={{
                flex: 1,
                border: "none",
                padding: "10px",
                borderRadius: "10px",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "12px",
                transition: "0.3s",
                background:
                  role === item.value
                    ? "#ffffff"
                    : "transparent",
                color:
                  role === item.value
                    ? "#0F6E56"
                    : "#6c757d",
                boxShadow:
                  role === item.value
                    ? "0 4px 10px rgba(0,0,0,0.05)"
                    : "none",
              }}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleLogin}>
          {/* Username */}
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: 600,
                fontSize: "13px",
                color: "#042C53",
              }}
            >
              Email atau Username
            </label>

            <div style={{ position: "relative" }}>
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "14px",
                  transform: "translateY(-50%)",
                  color: "#9ca3af",
                }}
              >
                <User size={18} />
              </div>

              <input
                type="text"
                value={username}
                onChange={(e) =>
                  setUsername(e.target.value)
                }
                placeholder="Contoh: sekolah"
                required
                style={{
                  width: "100%",
                  borderRadius: "14px",
                  padding: "14px 16px 14px 46px",
                  border: "1.5px solid #eef2f3",
                  background: "#fdfdfd",
                  outline: "none",
                  fontSize: "14px",
                  transition: "0.3s",
                }}
              />
            </div>
          </div>

          {/* Password */}
          <div style={{ marginBottom: "18px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "8px",
              }}
            >
              <label
                style={{
                  fontWeight: 600,
                  fontSize: "13px",
                  color: "#042C53",
                }}
              >
                Kata Sandi
              </label>

              <a
                href="#"
                style={{
                  fontSize: "12px",
                  color: "#0F6E56",
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                Lupa Password?
              </a>
            </div>

            <div style={{ position: "relative" }}>
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "14px",
                  transform: "translateY(-50%)",
                  color: "#9ca3af",
                }}
              >
                <Lock size={18} />
              </div>

              <input
                type="password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="••••••••"
                required
                style={{
                  width: "100%",
                  borderRadius: "14px",
                  padding: "14px 16px 14px 46px",
                  border: "1.5px solid #eef2f3",
                  background: "#fdfdfd",
                  outline: "none",
                  fontSize: "14px",
                  transition: "0.3s",
                }}
              />
            </div>
          </div>

          {/* Remember */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "24px",
            }}
          >
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) =>
                setRemember(e.target.checked)
              }
            />

            <label
              style={{
                fontSize: "13px",
                color: "#6c757d",
              }}
            >
              Tetap masuk di perangkat ini
            </label>
          </div>

          {/* Error */}
          {error && (
            <div
              style={{
                background: "#FEE2E2",
                color: "#991B1B",
                padding: "12px 14px",
                borderRadius: "14px",
                marginBottom: "20px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                fontSize: "13px",
              }}
            >
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              border: "none",
              borderRadius: "14px",
              padding: "14px",
              background:
                "linear-gradient(45deg, #042C53, #0F6E56)",
              color: "#ffffff",
              fontWeight: 700,
              fontSize: "15px",
              cursor: "pointer",
              boxShadow:
                "0 10px 20px rgba(4, 44, 83, 0.15)",
              transition: "0.3s",
            }}
          >
            {loading
              ? "Memproses Otentikasi..."
              : "Masuk ke Dashboard"}
          </button>
        </form>

        {/* Footer */}
        <div
          style={{
            marginTop: "28px",
            textAlign: "center",
            fontSize: "13px",
            color: "#7d879c",
            lineHeight: 1.8,
          }}
        >
          Belum memiliki akses?
          <br />

          <a
            href="#"
            style={{
              color: "#042C53",
              textDecoration: "none",
              fontWeight: 700,
            }}
          >
            Hubungi Tim Teknis Kominfo
          </a>
        </div>
      </div>
    </div>
  );
}