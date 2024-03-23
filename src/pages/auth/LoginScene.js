import { Button, Input } from "@material-tailwind/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInUser } from "../../services/axios";
import { useAuth } from "../../authContext";

export default function LoginScene() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const toMainScene = async () => {
    const signInData = {
      email: email,
      password: password,
    };
    const res = await signInUser(signInData);
    if (res.success) {
      login();
      navigate("/main", {
        state: { role: res.role, userId: res.id },
      });
    } else {
      setError(res.error); // Set error message from the response
      localStorage.removeItem("token");
      // Handle different error cases based on the status code
      setError(res.data);
    }
  };
  return (
    <div>
      <div className="w-full h-screen flex justify-center bg-[#FFF]">
        <div className="flex flex-col ">
          <div className="text-[40px] text-[#00f] text-[700] mt-[80px] text-center">
            Prijavaqqqqqqqqqqqqqqqq
          </div>
          <div className="w-72 mt-[20px]">
            <Input
              color="blue"
              label="Email"
              onChange={(e) => {
                setEmail(e.target.value);
                setError(""); // Clear error message when typing in email
              }}
            />
          </div>
          <div className="w-72 mt-[20px]">
            <Input
              color="blue"
              type="password"
              label="Password"
              onChange={(e) => {
                setPassword(e.target.value);
                setError(""); // Clear error message when typing in password
              }}
            />
          </div>
          {error && <div className="text-red-500 mt-2">{error}</div>}{" "}
          {/* Display error message */}
          <div className="w-72 mt-[40px]">
            <Button className="w-full bg-[blue]" onClick={toMainScene}>
              Prijava
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
