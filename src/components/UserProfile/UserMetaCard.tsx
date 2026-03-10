import { useState } from "react";
import { useMutation } from "@apollo/client";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { useUserContext } from "../../store/userContext";
import { getInitials } from "../../utils/getInitials";
import { useToast } from "../notifications/useToast";
import { UPDATE_USER_PROFILE } from "../../graphql/mutation";

export default function UserMetaCard() {
  const { isOpen, openModal, closeModal } = useModal();
  const { userProfileAndRoleData, setUserProfileAndRoleData } = useUserContext();
  const profile = userProfileAndRoleData?.data?.userProfile;
  const toast = useToast();

  const [form, setForm] = useState({
    userFirstName: "",
    userLastName: "",
    userEmail: "",
    profilePhone: "",
  });

  const [updateProfile, { loading }] = useMutation(UPDATE_USER_PROFILE, {
    onCompleted: (data) => {
      const result = data?.updateUserProfileMutation;
      if (result?.response?.status) {
        toast.success(result.response.message ?? "Profile updated successfully.");
        if (userProfileAndRoleData) {
          setUserProfileAndRoleData({
            ...userProfileAndRoleData,
            data: {
              ...userProfileAndRoleData.data,
              userProfile: result.data.userProfile,
            },
          });
        }
        closeModal();
      } else {
        toast.error(result?.response?.message ?? "Update failed.");
      }
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const handleOpen = () => {
    setForm({
      userFirstName: profile?.userFirstName ?? "",
      userLastName: profile?.userLastName ?? "",
      userEmail: profile?.userEmail ?? "",
      profilePhone: profile?.profilePhone ?? "",
    });
    openModal();
  };

  const handleSave = () => {
    updateProfile({
      variables: {
        input: {
          profileUniqueId: profile?.profileUniqueId,
          ...form,
        },
      },
    });
  };

  return (
    <>
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.02]">
        {/* Orange gradient banner */}
        <div className="h-32 rounded-t-2xl bg-gradient-to-r from-orange-500 to-orange-400" />

        <div className="px-5 pb-6 lg:px-6">
          {/* Avatar + name row */}
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-end sm:gap-5 -mt-12">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full border-4 border-white bg-orange-100 text-2xl font-bold text-orange-600 shadow-md dark:border-gray-900 dark:bg-orange-500/15 dark:text-orange-400">
              {profile ? getInitials(profile.userFirstName, profile.userLastName) : "—"}
            </div>

            <div className="flex flex-1 flex-col items-center gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-center sm:text-left">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {profile?.userFirstName} {profile?.userLastName}
                </h3>
                <div className="mt-1 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                  <span className="inline-flex items-center rounded-md bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-700 dark:bg-orange-500/15 dark:text-orange-400">
                    {profile?.profileType?.replace("_", " ") ?? "—"}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {profile?.profileGender}
                  </span>
                  <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                    profile?.profileIsActive
                      ? "bg-green-50 text-green-700 dark:bg-green-500/15 dark:text-green-400"
                      : "bg-red-50 text-red-700 dark:bg-red-500/15 dark:text-red-400"
                  }`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${profile?.profileIsActive ? "bg-green-500" : "bg-red-500"}`} />
                    {profile?.profileIsActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>

              <button
                onClick={handleOpen}
                className="inline-flex items-center gap-2 rounded-lg border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-medium text-orange-600 transition-colors hover:bg-orange-100 dark:border-orange-500/30 dark:bg-orange-500/10 dark:text-orange-400 dark:hover:bg-orange-500/20"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
                </svg>
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[500px] m-4">
        <div className="w-full rounded-2xl bg-white p-5 dark:bg-gray-900 lg:p-7">
          <h4 className="mb-1 text-lg font-semibold text-gray-900 dark:text-white">
            Edit Profile
          </h4>
          <p className="mb-5 text-sm text-gray-500 dark:text-gray-400">
            Update your profile information.
          </p>
          <form className="flex flex-col gap-4" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label>First Name</Label>
                <Input
                  type="text"
                  value={form.userFirstName}
                  onChange={(e) => setForm((f) => ({ ...f, userFirstName: e.target.value }))}
                />
              </div>
              <div>
                <Label>Last Name</Label>
                <Input
                  type="text"
                  value={form.userLastName}
                  onChange={(e) => setForm((f) => ({ ...f, userLastName: e.target.value }))}
                />
              </div>
            </div>
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={form.userEmail}
                onChange={(e) => setForm((f) => ({ ...f, userEmail: e.target.value }))}
              />
            </div>
            <div>
              <Label>Phone</Label>
              <Input
                type="text"
                value={form.profilePhone}
                onChange={(e) => setForm((f) => ({ ...f, profilePhone: e.target.value }))}
              />
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <Button size="sm" variant="outline" onClick={closeModal} disabled={loading}>
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={loading}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}
