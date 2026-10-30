import { useNavigate } from "react-router";
import "./Void.css";
import { useEffect } from "react";
function Void() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      void navigate("/lockScreen");
    }, 3000);
    console.log(timer);

    return () => clearTimeout(timer);
  }, [navigate]);

  return <></>;
}

export default Void;
