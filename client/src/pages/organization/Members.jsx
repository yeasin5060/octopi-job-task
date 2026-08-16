import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import DashboardLayout from "../../components/layout/DashboardLayout";
import Modal from "../../components/common/Modal";
import Button from "../../components/common/Button";
import api from "../../services/api";

const Members = () => {
  const user = useSelector(
    (state) => state.auth.user
  );

  const [members, setMembers] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [open, setOpen] =
    useState(false);

  const [form, setForm] =
    useState({
      name: "",
      email: "",
      role: "MEMBER",
    });

  const loadMembers = async () => {
    try {
      const { data } = await api.get(
        "/api/organizations/members"
      );

      setMembers(data.members);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, []);

  const inviteMember = async (e) => {
    e.preventDefault();

    await api.post(
      "/api/organizations/members/invite",
      form
    );

    setOpen(false);

    setForm({
      name: "",
      email: "",
      role: "MEMBER",
    });

    loadMembers();
  };

  const removeMember = async (id) => {
    if (
      !window.confirm(
        "Remove this member?"
      )
    ) {
      return;
    }

    await api.delete(
      `/api/organizations/members/${id}`
    );

    loadMembers();
  };

  return (
    <DashboardLayout>

      <div className="flex justify-between items-center">

        <div>
          <h1 className="text-3xl font-bold">
            Members
          </h1>

          <p className="text-gray-500">
            Manage organization members
          </p>
        </div>

        <Button
          onClick={() => setOpen(true)}
        >
          Invite Member
        </Button>

      </div>

      <div className="bg-white rounded-xl mt-6 overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-left">
                Name
              </th>

              <th className="p-4 text-left">
                Email
              </th>

              <th className="p-4 text-left">
                Role
              </th>

              <th className="p-4 text-left">
                Status
              </th>

              <th className="p-4">
                Action
              </th>
            </tr>
          </thead>

          <tbody>

            {members.map((member) => (
              <tr
                key={member._id}
                className="border-t"
              >

                <td className="p-4">
                  {member.name}
                </td>

                <td className="p-4">
                  {member.email}
                </td>

                <td className="p-4">
                  {member.role}
                </td>

                <td className="p-4">
                  {member.status}
                </td>

                <td className="p-4">

                  {member._id !==
                    user?._id && (
                    <button
                      onClick={() =>
                        removeMember(
                          member._id
                        )
                      }
                      className="text-red-600"
                    >
                      Remove
                    </button>
                  )}

                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Invite Member"
      >

        <form
          onSubmit={inviteMember}
          className="space-y-4"
        >

          <input
            placeholder="Name"
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value,
              })
            }
            className="w-full border rounded-lg p-3"
            required
          />

          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) =>
              setForm({
                ...form,
                email: e.target.value,
              })
            }
            className="w-full border rounded-lg p-3"
            required
          />

          <select
            value={form.role}
            onChange={(e) =>
              setForm({
                ...form,
                role: e.target.value,
              })
            }
            className="w-full border rounded-lg p-3"
          >
            <option value="MEMBER">
              Member
            </option>

            <option value="ORG_ADMIN">
              Organization Admin
            </option>
          </select>

          <Button type="submit">
            Send Invitation
          </Button>

        </form>

      </Modal>

    </DashboardLayout>
  );
};

export default Members;