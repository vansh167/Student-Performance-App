import "../Styling/Profile.css";
import { User, Mail, ShieldCheck, Settings2 } from "lucide-react";

export default function Profile() {
  const user = {
    name: "Admin User",
    email: "admin@gmail.com",
    role: "Admin",
  };

  return (
    <div className="profilePage">
      <div className="profileCard">
        <div className="profileTop">
          <div className="profileAvatar">
            <User size={26} />
          </div>
          <div>
            <h2>{user.name}</h2>
            <p className="roleTag">
              <ShieldCheck size={16} />
              {user.role}
            </p>
          </div>
        </div>

        <div className="profileInfo">
          <p>
            <Mail size={16} /> {user.email}
          </p>
        </div>

        <button className="profileBtn">
          <Settings2 size={18} /> Edit Profile
        </button>
      </div>
    </div>
  );
}
