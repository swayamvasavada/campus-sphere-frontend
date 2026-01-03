import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PaymentSuccess = () => {
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
          @keyframes scaleUp {
            0% { transform: scale(0); }
            80% { transform: scale(1.1); }
            100% { transform: scale(1); }
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
          <div style={styles.tick}>✓</div>
          <h2 style={styles.title}>Payment Successful</h2>
          <p style={styles.text}>Redirecting to home...</p>
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
    backgroundColor: "#f4f7fb",
  },
  card: {
    textAlign: "center",
    backgroundColor: "#ffffff",
    padding: "40px",
    borderRadius: "14px",
    boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
    animation: "fadeIn 0.6s ease-in-out",
  },
  tick: {
    width: "80px",
    height: "80px",
    margin: "0 auto 20px",
    borderRadius: "50%",
    backgroundColor: "#4CAF50",
    color: "#ffffff",
    fontSize: "48px",
    fontWeight: "bold",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    animation: "scaleUp 0.5s ease-in-out",
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

export default PaymentSuccess;
