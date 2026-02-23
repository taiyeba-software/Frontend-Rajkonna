import { useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { cn } from "@/lib/utils";
import { X, Edit, Save, User } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "@/api/axiosInstance";

const ProfileSidebar = ({ isOpen, onClose }) => {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    address: {
      line1: "",
      line2: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
    },
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch user profile on open
  useEffect(() => {
    if (isOpen) {
      fetchProfile();
    }
  }, [isOpen]);

  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get("/auth/profile");
      setUserData(data.user);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const updates = {};
      if (userData.phone !== undefined) updates.phone = userData.phone;
      if (userData.address) {
        updates.address = {
          line1: userData.address.line1 || "",
          line2: userData.address.line2 || "",
          city: userData.address.city || "",
          state: userData.address.state || "",
          postalCode: userData.address.postalCode || "",
          country: userData.address.country || "",
        };
      }

      const { data } = await api.put("/auth/profile", updates);
      setUserData(data.user);
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    if (field.startsWith("address.")) {
      const addressField = field.split(".")[1];
      setUserData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value,
        },
      }));
    } else {
      setUserData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  // GSAP animation for slide-in/out
  useGSAP(() => {
    const tl = gsap.timeline();
    if (isOpen) {
      tl.fromTo(
        ".sidebar",
        { x: "100%" },
        { x: "0%", duration: 0.3, ease: "power2.out" }
      );
    } else {
      tl.to(".sidebar", { x: "100%", duration: 0.3, ease: "power2.in" });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Sidebar */}
      <div
        className={cn(
          "sidebar fixed top-20 right-4 h-auto max-h-[calc(100vh-6rem)] w-full max-w-sm bg-card1 shadow-lg z-40 p-4 overflow-y-auto rounded-lg",
          "border border-border"
        )}
        style={{ fontFamily: "MPLUS-Rounded" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[2rem] font-medium text-[#7ca4a1] text-glow">
            Profile
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-border/20 rounded-full transition"
          >
            <X size={20} />
          </button>
        </div>

        {loading && (
          <div className="text-center py-4">
            <div className="animate-pulse">Loading...</div>
          </div>
        )}

        {error && (
          <div className="text-red-500 text-sm mb-4">{error}</div>
        )}

        {!loading && (
          <div className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-[#7ca4a1] mb-1">
                Name
              </label>
              <div className="text-black font-light">{userData.name}</div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-[#7ca4a1] mb-1">
                Email
              </label>
              <div className="text-black font-light">{userData.email}</div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-[#7ca4a1] mb-1">
                Phone
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={userData.phone || ""}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-black focus:outline-none focus:ring-2 focus:ring-primary"
                />
              ) : (
                <div className="text-black font-light">
                  {userData.phone || "Not provided"}
                </div>
              )}
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-[#7ca4a1] mb-1">
                Address
              </label>
              {isEditing ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Flat/House/Road info"
                    value={userData.address?.line1 || ""}
                    onChange={(e) =>
                      handleInputChange("address.line1", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-black focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <input
                    type="text"
                    placeholder="Optional info→2nd Floor, Near Mosque"
                    value={userData.address?.line2 || ""}
                    onChange={(e) =>
                      handleInputChange("address.line2", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-black focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <input
                    type="text"
                    placeholder="City"
                    value={userData.address?.city || ""}
                    onChange={(e) =>
                      handleInputChange("address.city", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-black focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <input
                    type="text"
                    placeholder="State"
                    value={userData.address?.state || ""}
                    onChange={(e) =>
                      handleInputChange("address.state", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-black focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <input
                    type="text"
                    placeholder="Postal Code"
                    value={userData.address?.postalCode || ""}
                    onChange={(e) =>
                      handleInputChange("address.postalCode", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-black focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <input
                    type="text"
                    placeholder="Country"
                    value={userData.address?.country || ""}
                    onChange={(e) =>
                      handleInputChange("address.country", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-black focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              ) : (
                <div className="text-foreground font-light">
                  {userData.address?.line1 && (
                    <div>{userData.address.line1}</div>
                  )}
                  {userData.address?.line2 && (
                    <div>{userData.address.line2}</div>
                  )}
                  {userData.address?.city && (
                    <div>
                      {userData.address.city}, {userData.address.state}{" "}
                      {userData.address.postalCode}
                    </div>
                  )}
                  {userData.address?.country && (
                    <div>{userData.address.country}</div>
                  )}
                  {!userData.address?.line1 &&
                    !userData.address?.city &&
                    "Not provided"}
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="space-y-3">
              {isEditing ? (
                <button
                  onClick={updateProfile}
                  disabled={loading}
                  className="w-full cosmic-button flex items-center justify-center gap-2"
                >
                  <Save size={18} />
                  Save Changes
                </button>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full cosmic-button flex items-center justify-center gap-2"
                >
                  <Edit size={18} />
                  Edit Profile
                </button>
              )}

              <Link
                to="/admin"
                onClick={onClose}
                className="w-full cosmic-button flex items-center justify-center gap-2"
              >
                <User size={18} />
                orders
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ProfileSidebar;
