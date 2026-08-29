import { useEffect, useState } from "react";
import { X, User, Mail } from "lucide-react";
import Input from "./Input";
import Button from "./Button";

const EditProfileModal = ({ isOpen, onClose, user, onSave }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen && user) {
      setFormData({
        fullName: user.fullName || "",
        email: user.email || "",
      });
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    try {
      await onSave(formData);
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 md:p-7 shadow-2xl space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-zinc-100">Edit Profile Details</h2>
            <p className="text-xs text-slate-600 dark:text-zinc-400">Update your public name and email address</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-zinc-800 transition cursor-pointer"
            aria-label="Close editor"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Your full name"
            icon={User}
            required
          />

          <Input
            label="Email Address"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Your email address"
            icon={Mail}
            required
          />

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-200 dark:border-zinc-800/80">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-slate-300 dark:border-zinc-700 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition cursor-pointer"
            >
              Cancel
            </button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isSaving}
              className="rounded-full px-5 py-2 text-xs font-bold"
            >
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
