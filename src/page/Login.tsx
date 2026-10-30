import DateTime from "../component/DateTime";
import SystemAction from "../component/SystemAction";
import User from "../component/User";

function Login() {
  return (
    <div>
      {/* Top Left Date and Time */}
      <div>
        <DateTime variant="full" />
      </div>

      {/* Middle: Login Section (Centered vertically) */}
      <div className="flex-1 flex items-center">
        <User />
      </div>

      {/* Bottom Left: System Actions */}
      <div className="absolute bottom-12 left-16">
        <SystemAction />
      </div>
    </div>
  );
}

export default Login;
