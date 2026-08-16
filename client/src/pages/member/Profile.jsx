import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import DashboardLayout from "../../components/layout/DashboardLayout";
import Button from "../../components/common/Button";
import api from "../../services/api";

const Profile = () => {
  const user = useSelector(
    (state) => state.auth.user
  );

  const [form, setForm] =
    useState({
      name: user?.name || "",
      email: user?.email || "",
      password: "",
    });


  const handleSubmit = async (e) => {
    e.preventDefault();

    await api.patch(
      "/users/me",
      form
    );
  };

  useEffect (() => {
    
  },[])

  return (
    <DashboardLayout>

      <h1 className="text-3xl font-bold">
        My Profile
      </h1>

      <div className="max-w-xl bg-white rounded-xl p-6 mt-6">

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          <div>
            <label>Name</label>

            <input
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value,
                })
              }
              className="w-full border rounded-lg p-3 mt-2"
            />
          </div>

          <div>
            <label>Email</label>

            <input
              value={form.email}
              disabled
              className="w-full border rounded-lg p-3 mt-2 bg-gray-100"
            />
          </div>

          <div>
            <label>
              New Password
            </label>

            <input
              type="password"
              value={form.password}
              onChange={(e) =>
                setForm({
                  ...form,
                  password:
                    e.target.value,
                })
              }
              className="w-full border rounded-lg p-3 mt-2"
            />
          </div>

          <Button type="submit">
            Update Profile
          </Button>

        </form>

      </div>

    </DashboardLayout>
  );
};

export default Profile;