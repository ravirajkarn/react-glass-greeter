import DateTime from "../component/DateTime";
import UserList from "../component/UserList";

function LockScreen() {
  return (
    <div className="flex-1 flex flex-col justify-end p-12 md:p-24 lg:p-32 z-10 relative h-full">
      <div>
        <DateTime variant="full" />
      </div>
      <div className="flex items-center justify-between w-full max-w-md mt-auto">
        <UserList />
      </div>
    </div>
  );
}

export default LockScreen;
