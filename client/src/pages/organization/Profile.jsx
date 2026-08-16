import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import DashboardLayout from "../../components/layout/DashboardLayout";
import Button from "../../components/common/Button";

import {
  fetchOrganization,
  updateOrganization,
} from "../../redux/slices/organizationSlice";

const Profile = () => {
  const dispatch = useDispatch();

  const {
    user,
  } = useSelector(
    (state) => state.auth
  );

  const {
    current,
  } = useSelector(
    (state) => state.organizations
  );

  const [form, setForm] =
    useState({
      name: "",
      contactInfo: "",
      billingEmail: "",
    });

  useEffect(() => {
    if (user?.organizationId) {
      dispatch(
        fetchOrganization(
          user.organizationId
        )
      );
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (current) {
      setForm({
        name: current.name || "",
        contactInfo:
          current.contactInfo || "",
        billingEmail:
          current.billingEmail || "",
      });
    }
  }, [current]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?.organizationId) return;

    await dispatch(
      updateOrganization({
        id: user.organizationId,
        data: form,
      })
    );
  };

  return (
    <DashboardLayout>

      <h1 className="text-3xl font-bold">
        Organization Profile
      </h1>

      <div className="max-w-2xl bg-white rounded-xl p-6 mt-6">

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          <div>
            <label className="block mb-2">
              Organization Name
            </label>

            <input
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value,
                })
              }
              className="w-full border rounded-lg p-3"
            />
          </div>

          <div>
            <label className="block mb-2">
              Contact Info
            </label>

            <input
              value={form.contactInfo}
              onChange={(e) =>
                setForm({
                  ...form,
                  contactInfo:
                    e.target.value,
                })
              }
              className="w-full border rounded-lg p-3"
            />
          </div>

          <div>
            <label className="block mb-2">
              Billing Email
            </label>

            <input
              type="email"
              value={form.billingEmail}
              onChange={(e) =>
                setForm({
                  ...form,
                  billingEmail:
                    e.target.value,
                })
              }
              className="w-full border rounded-lg p-3"
            />
          </div>

          <Button type="submit">
            Save Changes
          </Button>

        </form>

      </div>

    </DashboardLayout>
  );
};

export default Profile;