// auth0 login
import { useAuth0 } from "@auth0/auth0-react";

const LogoutButton = () => {
  const { logout } = useAuth0();
  return (
    <div
      onClick={() => logout({ returnTo: window.location.origin })}
      className="text-center Tab"
    >
      <img src="/icons/logout button.svg" className="logout" />
    </div>
  );
};

export default LogoutButton;
