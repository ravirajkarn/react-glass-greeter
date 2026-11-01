import DateTime from "../component/DateTime";
import SystemAction from "../component/SystemAction";
import UserForm from "../component/UserForm";

function Login() {
  return (
    <div className="h-full w-full relative">
      {/* Top Left Date and Time */}
      <div className="absolute top-1 left-16">
        <DateTime variant="full" />
      </div>

      {/* Middle: Login Section (Centered vertically) */}
      <div className="absolute top-1/2 left-16">
        <UserForm />
      </div>

      {/* Bottom Left: System Actions */}
      <div className="absolute bottom-12 left-16 ">
        <SystemAction />
      </div>
    </div>
  );
}

export default Login;
