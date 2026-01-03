import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PaymentFailure = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/", { replace: true });
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <>
      <style>
        {`
          @keyframes shake {
            0% { transform: translateX(0); }
            25% { transform: translateX(-6px); }
            50% { transform: translateX(6px); }
            75% { transform: translateX(-6px); }
            100% { transform: translateX(0); }
          }

          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(15px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>

      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.cross}>✕</div>
          <h2 style={styles.title}>Payment Failed</h2>
          <p style={styles.text}>Something went wrong. Redirecting...</p>
        </div>
      </div>
    </>
  );
};

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff5f5",
  },
  card: {
    textAlign: "center",
    backgroundColor: "#ffffff",
    padding: "40px",
    borderRadius: "14px",
    boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
    animation: "fadeIn 0.6s ease-in-out",
  },
  cross: {
    width: "80px",
    height: "80px",
    margin: "0 auto 20px",
    borderRadius: "50%",
    backgroundColor: "#e53935",
    color: "#ffffff",
    fontSize: "48px",
    fontWeight: "bold",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    animation: "shake 0.5s ease-in-out",
  },
  title: {
    marginBottom: "8px",
    color: "#333",
  },
  text: {
    color: "#777",
    fontSize: "14px",
  },
};

export default PaymentFailure;
