"use client";

import { gql, useQuery, useMutation } from "@apollo/client";
import { useState } from "react";

import { UpdateUserDocument } from "@/generated/graphql";

const GET_ALL_USERS = gql`
  query allUsers {
    allUsers {
      id
      username
      email
      phoneNumber
      firstName
      lastName
      allergies
      gradeYear
      graduationYear
      lastLogin
      dateJoined
      feideUserid
      feideEmail
      memberships {
        id
        organization {
          id
          name
        }
        group {
          id
          name
          uuid
        }
      }
      events {
        title
      }
    }
  }
`;

export default function UserEditor() {
  const [userId, setUserId] = useState("");

  type Membership = {
    id: string;
    organization?: { id: string; name?: string | null } | null;
    group?: { id: string; name?: string | null; uuid?: string | null } | null;
  };

  type EventItem = {
    title?: string | null;
  };

  type UserData = {
    username?: string;
    email?: string;
    phoneNumber?: string;
    firstName?: string;
    lastName?: string;
    allergies?: string | null;
    gradeYear?: number | null;
    graduationYear?: number | null;
    lastLogin?: string | null;
    dateJoined?: string | null;
    feideUserid?: string | null;
    feideEmail?: string | null;
    memberships?: Membership[];
    events?: EventItem[];
  };

  const [userData, setUserData] = useState<UserData>({
    username: "",
    email: "",
    phoneNumber: "",
    firstName: "",
    lastName: "",
    allergies: "",
    gradeYear: undefined,
    graduationYear: undefined,
    lastLogin: "",
    dateJoined: "",
    feideUserid: "",
    feideEmail: "",
    memberships: [],
    events: [],
  });

  const { data, loading, error } = useQuery<{ allUsers: (UserData & { id: string })[] }>(GET_ALL_USERS, {
    onError: (err) => {
      console.error("GraphQL Query Error:", err);
    },
  });

  const [updateUser] = useMutation(UpdateUserDocument, {
    onError: (err) => {
      console.error("GraphQL Mutation Error:", err);
    },
  });

  const handleFetchUser = () => {
    if (!data || !data.allUsers) {
      alert("No users available.");
      return;
    }

    const user = data.allUsers.find((user) => user.id === userId);
    if (user) {
      setUserData({
        username: user.username ?? "",
        email: user.email ?? "",
        phoneNumber: user.phoneNumber ?? "",
        firstName: user.firstName ?? "",
        lastName: user.lastName ?? "",
        allergies: user.allergies ?? "",
        gradeYear: user.gradeYear ?? undefined,
        graduationYear: user.graduationYear ?? undefined,
        lastLogin: user.lastLogin ?? "",
        dateJoined: user.dateJoined ?? "",
        feideUserid: user.feideUserid ?? "",
        feideEmail: user.feideEmail ?? "",
        memberships: user.memberships ?? [],
        events: user.events ?? [],
      });
    } else {
      alert("User not found.");
    }
  };

  const handleSave = async () => {
    try {
      await updateUser({
        variables: {
          userData: {
            // Only send allowed fields:
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            phoneNumber: userData.phoneNumber,
            graduationYear: userData.graduationYear,
            allergies: userData.allergies,
          },
        },
      });
      alert("User updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update user.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading users. Please try again later.</p>;

  return (
    <div>
      <h1>Edit User</h1>
      <div>
        <label>
          User ID:
          <input type="text" value={userId} onChange={(e) => setUserId(e.target.value)} />
        </label>
        <button onClick={handleFetchUser}>Fetch User</button>
      </div>

      {userData.username && (
        <div style={{ marginTop: 16 }}>
          <div>
            <label>
              Username:
              <input
                type="text"
                value={userData.username || ""}
                onChange={(e) => setUserData({ ...userData, username: e.target.value })}
                disabled
              />
            </label>
          </div>

          <div>
            <label>
              Email:
              <input
                type="email"
                value={userData.email || ""}
                onChange={(e) => setUserData({ ...userData, email: e.target.value })}
              />
            </label>
          </div>

          <div>
            <label>
              First name:
              <input
                type="text"
                value={userData.firstName || ""}
                onChange={(e) => setUserData({ ...userData, firstName: e.target.value })}
              />
            </label>
          </div>

          <div>
            <label>
              Last name:
              <input
                type="text"
                value={userData.lastName || ""}
                onChange={(e) => setUserData({ ...userData, lastName: e.target.value })}
              />
            </label>
          </div>

          <div>
            <label>
              Phone:
              <input
                type="text"
                value={userData.phoneNumber || ""}
                onChange={(e) => setUserData({ ...userData, phoneNumber: e.target.value })}
              />
            </label>
          </div>

          <div>
            <label>
              Allergies:
              <input
                type="text"
                value={userData.allergies || ""}
                onChange={(e) => setUserData({ ...userData, allergies: e.target.value })}
              />
            </label>
          </div>

          <div>
            <label>
              Grade year:
              <input
                type="number"
                value={userData.gradeYear ?? ""}
                onChange={(e) =>
                  setUserData({ ...userData, gradeYear: e.target.value ? Number(e.target.value) : undefined })
                }
                disabled
              />
            </label>
          </div>

          <div>
            <label>
              Graduation year:
              <input
                type="number"
                value={userData.graduationYear ?? ""}
                onChange={(e) =>
                  setUserData({ ...userData, graduationYear: e.target.value ? Number(e.target.value) : undefined })
                }
              />
            </label>
          </div>

          <div>
            <label>
              Feide user id:
              <input
                type="text"
                value={userData.feideUserid || ""}
                onChange={(e) => setUserData({ ...userData, feideUserid: e.target.value })}
                disabled
              />
            </label>
          </div>

          <div>
            <label>
              Feide email:
              <input
                type="email"
                value={userData.feideEmail || ""}
                onChange={(e) => setUserData({ ...userData, feideEmail: e.target.value })}
                disabled
              />
            </label>
          </div>

          <div>
            <strong>Last login:</strong> {userData.lastLogin || ""}
          </div>

          <div>
            <strong>Date joined:</strong> {userData.dateJoined || ""}
          </div>

          <div>
            <strong>Memberships:</strong>
            <ul>
              {(userData.memberships || []).map((m, idx) => (
                <li key={m?.id ?? idx}>
                  {m?.organization?.name ?? m?.group?.name ?? ""} {m?.group?.uuid ? `(${m?.group?.uuid})` : ""}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <strong>Events:</strong>
            <ul>
              {(userData.events || []).map((ev, idx) => (
                <li key={idx}>{ev?.title || ""}</li>
              ))}
            </ul>
          </div>

          <div style={{ marginTop: 8 }}>
            <button onClick={handleSave}>Save</button>
          </div>
        </div>
      )}
    </div>
  );
}
